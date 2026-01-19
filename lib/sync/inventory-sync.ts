/**
 * Inventory Sync Service
 * Syncs dealer inventory from external sources to IQ Auto Deals
 */

import { prisma } from '@/lib/prisma';
import { scrapeDealerOnInventory, ScrapedVehicle } from './dealeron-scraper';
import { decodeVin } from './vin-decoder';
import { uploadVehiclePhotos } from './photo-uploader';

export interface SyncSummary {
  dealerId: string;
  dealerName: string;
  success: boolean;
  error?: string;
  stats: {
    found: number;
    added: number;
    updated: number;
    markedSold: number;
    failed: number;
  };
  duration: number;
}

/**
 * Sync inventory for a single dealer
 */
export async function syncDealerInventory(dealerId: string): Promise<SyncSummary> {
  const startTime = Date.now();
  const summary: SyncSummary = {
    dealerId,
    dealerName: '',
    success: false,
    stats: {
      found: 0,
      added: 0,
      updated: 0,
      markedSold: 0,
      failed: 0,
    },
    duration: 0,
  };

  try {
    // Get dealer info
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        businessName: true,
        inventoryFeedUrl: true,
        inventoryFeedType: true,
        city: true,
        state: true,
      },
    });

    if (!dealer) {
      summary.error = 'Dealer not found';
      return summary;
    }

    summary.dealerName = dealer.businessName || 'Unknown';

    if (!dealer.inventoryFeedUrl) {
      summary.error = 'No inventory feed URL configured';
      return summary;
    }

    // Update sync status to in_progress
    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncStatus: 'in_progress',
        lastSyncMessage: 'Sync started...',
      },
    });

    // Scrape inventory based on feed type
    let scrapedVehicles: ScrapedVehicle[] = [];

    if (dealer.inventoryFeedType === 'dealeron' || !dealer.inventoryFeedType) {
      const result = await scrapeDealerOnInventory(dealer.inventoryFeedUrl, 'all');
      if (!result.success) {
        throw new Error(result.error || 'Failed to scrape inventory');
      }
      scrapedVehicles = result.vehicles;
    } else {
      throw new Error(`Unsupported feed type: ${dealer.inventoryFeedType}`);
    }

    summary.stats.found = scrapedVehicles.length;
    console.log(`Found ${scrapedVehicles.length} vehicles for ${dealer.businessName}`);

    // Get existing cars for this dealer
    const existingCars = await prisma.car.findMany({
      where: { dealerId, status: { not: 'sold' } },
      select: { id: true, vin: true, salePrice: true, mileage: true, photos: true, color: true, fuelType: true },
    });

    const existingVinMap = new Map(existingCars.map((c) => [c.vin, c]));
    const scrapedVinSet = new Set(scrapedVehicles.map((v) => v.vin));

    // Process each scraped vehicle
    for (const scrapedVehicle of scrapedVehicles) {
      try {
        const existing = existingVinMap.get(scrapedVehicle.vin);

        if (existing) {
          // Check what needs updating
          const priceChanged = Math.abs(existing.salePrice - scrapedVehicle.price) > 1;
          const mileageChanged = scrapedVehicle.mileage > 0 && Math.abs(existing.mileage - scrapedVehicle.mileage) > 100;
          const isValidColor = scrapedVehicle.color && scrapedVehicle.color !== 'Unknown' && scrapedVehicle.color !== 'Content';
          const colorChanged = isValidColor && (existing.color === 'Unknown' || existing.color === 'Content');

          // Check if fuel type needs updating (scraped fuel type takes priority)
          const isValidFuelType = scrapedVehicle.fuelType && scrapedVehicle.fuelType !== 'Unknown';
          const fuelTypeChanged = isValidFuelType && (!existing.fuelType || existing.fuelType === 'Unknown');

          // Check if scraped vehicle has more photos
          const existingPhotos: string[] = JSON.parse(existing.photos as string || '[]');
          const photosImproved = scrapedVehicle.photoUrls.length > existingPhotos.length;

          if (priceChanged || mileageChanged || photosImproved || colorChanged || fuelTypeChanged) {
            const updateData: Record<string, unknown> = {};

            if (priceChanged && scrapedVehicle.price > 0) {
              updateData.salePrice = scrapedVehicle.price;
            }
            if (mileageChanged) {
              updateData.mileage = scrapedVehicle.mileage;
            }
            if (photosImproved) {
              updateData.photos = JSON.stringify(scrapedVehicle.photoUrls);
            }
            if (colorChanged) {
              updateData.color = scrapedVehicle.color;
            }
            if (fuelTypeChanged) {
              updateData.fuelType = scrapedVehicle.fuelType;
            }

            if (Object.keys(updateData).length > 0) {
              await prisma.car.update({
                where: { id: existing.id },
                data: updateData,
              });
              summary.stats.updated++;
              console.log(`Updated car ${scrapedVehicle.vin}: price=${priceChanged}, mileage=${mileageChanged}, photos=${photosImproved ? scrapedVehicle.photoUrls.length : 'same'}, color=${colorChanged ? scrapedVehicle.color : 'same'}, fuelType=${fuelTypeChanged ? scrapedVehicle.fuelType : 'same'}`);
            }
          }
        } else {
          // Add new car
          const newCar = await addNewCar(scrapedVehicle, dealer);
          if (newCar) {
            summary.stats.added++;
            console.log(`Added new car: ${scrapedVehicle.vin}`);
          } else {
            summary.stats.failed++;
          }
        }
      } catch (error) {
        console.error(`Error processing vehicle ${scrapedVehicle.vin}:`, error);
        summary.stats.failed++;
      }
    }

    // Mark cars as sold if they're no longer in the inventory
    for (const existing of existingCars) {
      if (!scrapedVinSet.has(existing.vin)) {
        await prisma.car.update({
          where: { id: existing.id },
          data: { status: 'sold' },
        });
        summary.stats.markedSold++;
        console.log(`Marked as sold: ${existing.vin}`);
      }
    }

    // Update sync status
    summary.success = true;
    summary.duration = Date.now() - startTime;

    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: 'success',
        lastSyncMessage: `Synced successfully. Added: ${summary.stats.added}, Updated: ${summary.stats.updated}, Sold: ${summary.stats.markedSold}`,
      },
    });

    return summary;
  } catch (error) {
    summary.error = error instanceof Error ? error.message : 'Unknown error';
    summary.duration = Date.now() - startTime;

    // Update sync status with error
    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: 'failed',
        lastSyncMessage: summary.error,
      },
    });

    console.error(`Sync failed for dealer ${dealerId}:`, summary.error);
    return summary;
  }
}

/**
 * Add a new car from scraped data
 */
async function addNewCar(
  scrapedVehicle: ScrapedVehicle,
  dealer: { id: string; city: string | null; state: string | null }
): Promise<boolean> {
  try {
    // Decode VIN for vehicle details
    const vinData = await decodeVin(scrapedVehicle.vin);

    if (!vinData) {
      console.error(`Failed to decode VIN: ${scrapedVehicle.vin}`);
      return false;
    }

    // Upload photos to Vercel Blob
    let photoUrls: string[] = [];
    if (scrapedVehicle.photoUrls.length > 0) {
      console.log(`Uploading ${scrapedVehicle.photoUrls.length} photos for ${scrapedVehicle.vin}...`);
      photoUrls = await uploadVehiclePhotos(scrapedVehicle.photoUrls, scrapedVehicle.vin);
      console.log(`Uploaded ${photoUrls.length} photos for ${scrapedVehicle.vin}`);
    }

    // Generate slug: vin-year-make-model-city-state
    const slug = generateSlug(
      scrapedVehicle.vin,
      vinData.year,
      vinData.make,
      vinData.model,
      dealer.city || 'Unknown',
      dealer.state || 'US'
    );

    // Check for duplicate slug and append VIN suffix if needed
    const existingSlug = await prisma.car.findUnique({
      where: { slug },
      select: { id: true },
    });

    const finalSlug = existingSlug
      ? `${slug}-${scrapedVehicle.vin.slice(-6).toLowerCase()}`
      : slug;

    // Create the car - prefer scraped fuelType over VIN decoder
    await prisma.car.create({
      data: {
        dealerId: dealer.id,
        vin: scrapedVehicle.vin,
        year: vinData.year,
        make: vinData.make,
        model: vinData.model,
        trim: vinData.trim || scrapedVehicle.trim,
        mileage: scrapedVehicle.mileage || 0,
        color: scrapedVehicle.color || 'Unknown',
        transmission: vinData.transmission || scrapedVehicle.transmission || 'Automatic',
        salePrice: scrapedVehicle.price || 0,
        description: scrapedVehicle.description || `${vinData.year} ${vinData.make} ${vinData.model}`,
        photos: JSON.stringify(photoUrls),
        city: dealer.city || 'Unknown',
        state: dealer.state || 'US',
        latitude: 0, // Would need geocoding
        longitude: 0,
        status: 'active',
        slug: finalSlug,
        bodyType: vinData.bodyType,
        drivetrain: vinData.drivetrain,
        fuelType: scrapedVehicle.fuelType || vinData.fuelType || 'Gasoline', // Scraped takes priority, default to Gasoline
        engine: vinData.engine,
      },
    });

    return true;
  } catch (error) {
    console.error(`Error adding car ${scrapedVehicle.vin}:`, error);
    return false;
  }
}

/**
 * Generate SEO-friendly slug: vin-year-make-model-city-state
 */
function generateSlug(
  vin: string,
  year: number,
  make: string,
  model: string,
  city: string,
  state: string
): string {
  return [vin, year.toString(), make, model, city, state]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Run sync for all dealers that need syncing
 */
export async function runScheduledSync(): Promise<SyncSummary[]> {
  console.log('Starting scheduled inventory sync...');

  // Find dealers that need syncing
  const dealersToSync = await prisma.user.findMany({
    where: {
      userType: 'dealer',
      autoSyncEnabled: true,
      inventoryFeedUrl: { not: null },
      verificationStatus: 'approved',
      OR: [
        { lastSyncAt: null },
        {
          lastSyncAt: {
            lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
        },
      ],
    },
    select: {
      id: true,
      businessName: true,
      syncFrequencyDays: true,
      lastSyncAt: true,
    },
  });

  console.log(`Found ${dealersToSync.length} dealers to sync`);

  const summaries: SyncSummary[] = [];

  for (const dealer of dealersToSync) {
    // Check if enough time has passed based on sync frequency
    if (dealer.lastSyncAt) {
      const daysSinceLastSync =
        (Date.now() - dealer.lastSyncAt.getTime()) / (24 * 60 * 60 * 1000);
      if (daysSinceLastSync < (dealer.syncFrequencyDays || 2)) {
        console.log(`Skipping ${dealer.businessName} - synced ${daysSinceLastSync.toFixed(1)} days ago`);
        continue;
      }
    }

    console.log(`Syncing inventory for: ${dealer.businessName}`);
    const summary = await syncDealerInventory(dealer.id);
    summaries.push(summary);

    // Small delay between dealers to be respectful
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log('Scheduled sync complete');
  return summaries;
}
