import SftpClient from 'ssh2-sftp-client';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { uploadVehiclePhotos } from '@/lib/sync/photo-uploader';

// SFTP Configuration - read at call time so env vars are available after dotenv loads
function getSftpConfig() {
  return {
    host: process.env.DEALERSOCKET_SFTP_HOST || '',
    port: parseInt(process.env.DEALERSOCKET_SFTP_PORT || '22', 10),
    username: process.env.DEALERSOCKET_SFTP_USERNAME || '',
    password: process.env.DEALERSOCKET_SFTP_PASSWORD || '',
    // OpenSSH 9.6 requires explicit algorithm negotiation with ssh2 library
    algorithms: {
      kex: [
        'ecdh-sha2-nistp256',
        'ecdh-sha2-nistp384',
        'ecdh-sha2-nistp521',
        'diffie-hellman-group-exchange-sha256',
        'diffie-hellman-group14-sha256',
      ],
      serverHostKey: [
        'ssh-ed25519',
        'ecdsa-sha2-nistp256',
        'rsa-sha2-512',
        'rsa-sha2-256',
      ],
    },
  };
}

// Path relative to home directory
const UPLOADS_PATH = 'uploads';

// DealerSocket CSV field mapping
interface DealerSocketVehicle {
  DealerId: string;
  FeedId: string;
  VIN: string;
  Stock: string;
  Mileage: string;
  Year: string;
  Make: string;
  Model: string;
  Trim: string;
  Body: string;
  Transmission: string;
  Engine: string;
  IntColor: string;
  ExtColor: string;
  GenericIntColor: string;
  GenericExtColor: string;
  Price: string;
  RetailPrice: string;
  DealerCost: string;
  ModelCode: string;
  ExtColorCode: string;
  IntColorCode: string;
  Certified: string;
  Condition: string;
  InDate: string;
  Comments: string;
  ImageURLs: string;
  Options: string;
  StandardEquipment: string;
  OptionCodes: string;
  MPGCity: string;
  MPGHighway: string;
  Doors: string;
  Drivetrain: string;
  CabType: string;
  CustomPrice: string;
}

interface SyncResult {
  success: boolean;
  dealerId: string;
  feedId: string;
  totalInFeed: number;
  created: number;
  updated: number;
  markedSold: number;
  errors: string[];
  duration: number;
}

// Generate SEO-friendly slug
function generateSlug(vin: string, year: number, make: string, model: string, city: string, state: string): string {
  const parts = [vin, year, make, model, city, state]
    .map(p => String(p).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .filter(p => p);
  return parts.join('-');
}

// Parse pipe-separated image URLs into array
function parseImageUrls(imageUrlsString: string): string[] {
  if (!imageUrlsString) return [];
  return imageUrlsString.split('|').filter(url => url.trim());
}

// Determine vehicle condition - override based on mileage if necessary
// Vehicles with > 1000 miles should be marked "Used" regardless of CSV data
function determineCondition(csvCondition: string, mileage: number): string {
  const condition = csvCondition || 'Used';

  // If mileage is over 1000, it's definitely not a new vehicle
  if (mileage > 1000) {
    return 'Used';
  }

  // Trust the CSV for low-mileage vehicles
  return condition;
}

// Infer fuel type from engine description and model name
function inferFuelType(engine: string, model: string): string {
  const engineLower = (engine || '').toLowerCase();
  const modelLower = (model || '').toLowerCase();

  // Electric
  if (engineLower.includes('electric') || modelLower.includes('bev') || modelLower.includes('electric')) {
    return 'Electric';
  }

  // Hybrid/PHEV
  if (engineLower.includes('phev') || engineLower.includes('hybrid') || engineLower.includes('powerboost') ||
      modelLower.includes('4xe') || modelLower.includes('hybrid') || modelLower.includes('phev')) {
    return 'Hybrid';
  }

  // Diesel
  if (engineLower.includes('diesel') || engineLower.includes('cummins')) {
    return 'Diesel';
  }

  // Flex Fuel (E85)
  if (engineLower.includes('flex') || engineLower.includes('e85')) {
    return 'Flex Fuel';
  }

  // Default to Gasoline
  return 'Gasoline';
}

// Download images and upload to Vercel Blob, returns JSON string of URLs
async function processVehiclePhotos(imageUrlsString: string, vin: string): Promise<string> {
  const urls = parseImageUrls(imageUrlsString);
  if (urls.length === 0) return '[]';

  try {
    // Upload to Vercel Blob (falls back to original URLs if no token)
    const uploadedUrls = await uploadVehiclePhotos(urls, vin, true);
    return JSON.stringify(uploadedUrls);
  } catch (error) {
    console.error(`Failed to upload photos for ${vin}:`, error);
    // Fall back to original URLs
    return JSON.stringify(urls);
  }
}

// Geocode address to get lat/lng (simplified - uses approximate coordinates for now)
// In production, you'd want to use a geocoding API like Google Maps or OpenStreetMap
async function getCoordinatesForDealer(city: string, state: string): Promise<{ latitude: number; longitude: number }> {
  // Default coordinates for common cities (simplified)
  // In production, use a geocoding API
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    'dubuque-ia': { lat: 42.5006, lng: -90.6646 },
    'tampa-fl': { lat: 27.9506, lng: -82.4572 },
    'madison-wi': { lat: 43.0731, lng: -89.4012 },
  };

  const key = `${city.toLowerCase()}-${state.toLowerCase()}`;
  const coords = cityCoords[key];

  if (coords) {
    return { latitude: coords.lat, longitude: coords.lng };
  }

  // Default to center of US if not found
  return { latitude: 39.8283, longitude: -98.5795 };
}

export async function syncDealerSocketInventory(dealerId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    success: false,
    dealerId,
    feedId: '',
    totalInFeed: 0,
    created: 0,
    updated: 0,
    markedSold: 0,
    errors: [],
    duration: 0,
  };

  const sftp = new SftpClient();

  try {
    // Get dealer info
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        businessName: true,
        city: true,
        state: true,
        dealerSocketFeedId: true,
        inventoryFeedType: true,
      },
    });

    if (!dealer) {
      throw new Error(`Dealer not found: ${dealerId}`);
    }

    if (!dealer.dealerSocketFeedId) {
      throw new Error(`Dealer ${dealer.businessName} has no DealerSocket Feed ID configured`);
    }

    if (dealer.inventoryFeedType !== 'dealersocket') {
      throw new Error(`Dealer ${dealer.businessName} is not configured for DealerSocket sync`);
    }

    result.feedId = dealer.dealerSocketFeedId;

    // Get dealer coordinates
    const coords = await getCoordinatesForDealer(dealer.city || '', dealer.state || '');

    // Connect to SFTP
    console.log(`Connecting to SFTP server...`);
    await sftp.connect(getSftpConfig());

    // Read CSV file
    const feedPath = `${UPLOADS_PATH}/${dealer.dealerSocketFeedId}.csv`;
    console.log(`Reading feed file: ${feedPath}`);

    const exists = await sftp.exists(feedPath);
    if (!exists) {
      throw new Error(`Feed file not found: ${feedPath}`);
    }

    const csvBuffer = await sftp.get(feedPath);
    const csvContent = csvBuffer.toString();

    // Parse CSV
    const vehicles: DealerSocketVehicle[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    result.totalInFeed = vehicles.length;
    console.log(`Found ${vehicles.length} vehicles in feed`);

    // Get existing VINs for this dealer
    const existingCars = await prisma.car.findMany({
      where: { dealerId },
      select: { id: true, vin: true },
    });
    const existingVinMap = new Map(existingCars.map(c => [c.vin, c.id]));
    const feedVins = new Set(vehicles.map(v => v.VIN));

    // Process each vehicle
    for (const vehicle of vehicles) {
      try {
        // Download and upload photos to Vercel Blob
        console.log(`Processing photos for ${vehicle.VIN}...`);
        const photos = await processVehiclePhotos(vehicle.ImageURLs, vehicle.VIN);

        const mileage = parseInt(vehicle.Mileage, 10) || 0;

        const carData = {
          dealerId,
          vin: vehicle.VIN,
          make: vehicle.Make,
          model: vehicle.Model,
          year: parseInt(vehicle.Year, 10) || 0,
          mileage,
          color: vehicle.ExtColor || 'Unknown',
          transmission: vehicle.Transmission || 'Automatic',
          salePrice: parseFloat(vehicle.Price) || 0,
          description: vehicle.Comments || '',
          photos,
          latitude: coords.latitude,
          longitude: coords.longitude,
          city: dealer.city || '',
          state: dealer.state || '',
          status: 'active',
          bodyType: vehicle.Body || null,
          trim: vehicle.Trim || null,
          drivetrain: vehicle.Drivetrain || null,
          engine: vehicle.Engine || null,
          condition: determineCondition(vehicle.Condition, mileage),
          fuelType: inferFuelType(vehicle.Engine, vehicle.Model),
          slug: generateSlug(
            vehicle.VIN,
            parseInt(vehicle.Year, 10),
            vehicle.Make,
            vehicle.Model,
            dealer.city || '',
            dealer.state || ''
          ),
        };

        if (existingVinMap.has(vehicle.VIN)) {
          // Update existing
          await prisma.car.update({
            where: { id: existingVinMap.get(vehicle.VIN) },
            data: carData,
          });
          result.updated++;
        } else {
          // Create new
          await prisma.car.create({
            data: carData,
          });
          result.created++;
        }
      } catch (err: any) {
        result.errors.push(`VIN ${vehicle.VIN}: ${err.message}`);
      }
    }

    // Mark vehicles not in feed as sold
    for (const [vin, carId] of existingVinMap) {
      if (!feedVins.has(vin)) {
        try {
          await prisma.car.update({
            where: { id: carId },
            data: {
              status: 'sold',
              statusChangedAt: new Date(),
            },
          });
          result.markedSold++;
        } catch (err: any) {
          result.errors.push(`Mark sold VIN ${vin}: ${err.message}`);
        }
      }
    }

    // Update dealer sync status
    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: 'success',
        lastSyncMessage: `Synced ${result.totalInFeed} vehicles: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`,
      },
    });

    result.success = true;
    console.log(`Sync completed: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`);

  } catch (err: any) {
    console.error('Sync error:', err);
    result.errors.push(err.message);

    // Update dealer sync status with error
    try {
      await prisma.user.update({
        where: { id: dealerId },
        data: {
          lastSyncAt: new Date(),
          lastSyncStatus: 'failed',
          lastSyncMessage: err.message,
        },
      });
    } catch (updateErr) {
      console.error('Failed to update sync status:', updateErr);
    }

  } finally {
    await sftp.end();
    result.duration = Date.now() - startTime;
  }

  return result;
}

// List available feed files on SFTP
export async function listAvailableFeeds(): Promise<string[]> {
  const sftp = new SftpClient();
  try {
    await sftp.connect(getSftpConfig());
    const files = await sftp.list(UPLOADS_PATH);
    return files
      .filter(f => f.name.endsWith('.csv'))
      .map(f => f.name.replace('.csv', ''));
  } finally {
    await sftp.end();
  }
}
