import { prisma } from '@/lib/prisma';
import { uploadVehiclePhotos } from '@/lib/sync/photo-uploader';
import { generateSEODescription, isValidSEODescription } from '@/lib/seo/generate-description';

const SEO_DELAY_MS = 1500;

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

// Known CarsCommerce API keys per CCID
const CCID_API_KEYS: Record<string, string> = {
  '105380': 'OQa8l7SzMctJyr5bhSG9jYvlGnZUQfgl',
};

// Known dealer city coordinates
function getCoordinatesForDealer(city: string, state: string): { latitude: number; longitude: number } {
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    'tempe-az': { lat: 33.4255, lng: -111.9400 },
    'dubuque-ia': { lat: 42.5006, lng: -90.6646 },
    'tampa-fl': { lat: 27.9506, lng: -82.4572 },
    'madison-wi': { lat: 43.0731, lng: -89.4012 },
    'nashville-tn': { lat: 36.1627, lng: -86.7816 },
    'brentwood-tn': { lat: 36.0331, lng: -86.7828 },
    'spokane-wa': { lat: 47.6588, lng: -117.4260 },
  };

  const key = `${city.toLowerCase().trim()}-${state.toLowerCase().trim()}`;
  const coords = cityCoords[key];

  if (coords) {
    return { latitude: coords.lat, longitude: coords.lng };
  }

  // Default to Tempe, AZ
  return { latitude: 33.4255, longitude: -111.9400 };
}

function generateSlug(vin: string, year: number, make: string, model: string, city: string, state: string): string {
  const parts = [vin, year, make, model, city, state]
    .map(p => String(p).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .filter(p => p);
  return parts.join('-');
}

function normalizeFuelType(fuel: string, engine: string, model: string): string {
  const f = (fuel || '').toLowerCase();
  const e = (engine || '').toLowerCase();
  const m = (model || '').toLowerCase();
  if (f.includes('electric') || m.includes('model 3') || m.includes('model s') || m.includes('model y') || m.includes('model x')) return 'Electric';
  if (f.includes('hybrid') || e.includes('hybrid')) return 'Hybrid';
  if (f.includes('diesel') || e.includes('diesel')) return 'Diesel';
  if (f.includes('flex') || e.includes('e85')) return 'Flex Fuel';
  return 'Gasoline';
}

async function processVehiclePhotos(imageUrls: string[], vin: string): Promise<string> {
  if (imageUrls.length === 0) return '[]';
  try {
    const uploadedUrls = await uploadVehiclePhotos(imageUrls, vin, true);
    return JSON.stringify(uploadedUrls);
  } catch (error) {
    console.error(`[CarsCommerce] Failed to upload photos for ${vin}:`, error);
    return JSON.stringify(imageUrls);
  }
}

async function fetchCarsCommerceInventory(ccid: string, apiKey: string, websiteUrl: string): Promise<any[]> {
  const url = `https://websites-search.api.carscommerce.inc/api/v1/listings/${ccid}/search`;

  const body = {
    page: 1,
    perPage: 200,
    sort: [{ field: 'low_price', order: 'asc' }],
    filters: { status: ['publish', 'modified'] },
    facetFilters: { type_slug: ['Used', 'Certified Used', 'New'] },
    requestedFields: [
      'vin', 'stock', 'type', 'year', 'make', 'model', 'trim',
      'model_number', 'model_series', 'date_in_stock', 'mileage',
      'features', 'vdp_url', 'source_id', 'body_details', 'styles',
      'mechanical', 'pricing', 'payments', 'dealer', 'media',
      'extra_fields', 'oem_fields', 'in_transit', 'is_demo',
      'is_loaner', 'is_special', 'packages', 'warranty',
      'history_report', 'status', 'window_sticker_url', 'brochure',
      'manufacturer_model_code',
    ],
  };

  const origin = websiteUrl.replace(/\/$/, '');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'Origin': origin,
      'Referer': `${origin}/`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`CarsCommerce API returned ${res.status}: ${await res.text().catch(() => 'no body')}`);
  }

  const data = await res.json();
  return data.data?.listings || [];
}

export async function syncCarsCommerceInventory(dealerId: string): Promise<SyncResult> {
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

  try {
    // Step 1: Load dealer record
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        businessName: true,
        city: true,
        state: true,
        inventoryFeedUrl: true,
        inventoryFeedType: true,
        dealerSocketFeedId: true,
      },
    });

    if (!dealer) throw new Error(`Dealer not found: ${dealerId}`);
    if (!dealer.dealerSocketFeedId) throw new Error(`Dealer ${dealer.businessName} has no CarsCommerce CCID configured (dealerSocketFeedId)`);

    const ccid = dealer.dealerSocketFeedId;
    const apiKey = CCID_API_KEYS[ccid];
    if (!apiKey) throw new Error(`No API key configured for CarsCommerce CCID: ${ccid}`);

    const websiteUrl = (dealer.inventoryFeedUrl || '').replace(/\/$/, '');
    if (!websiteUrl) throw new Error(`Dealer ${dealer.businessName} has no website URL configured (inventoryFeedUrl)`);

    result.feedId = ccid;

    // Step 2: Fetch inventory from CarsCommerce API
    console.log(`[CarsCommerce] Fetching inventory for CCID ${ccid} (${dealer.businessName})...`);
    const listings = await fetchCarsCommerceInventory(ccid, apiKey, websiteUrl);
    console.log(`[CarsCommerce] Found ${listings.length} vehicles`);

    if (listings.length === 0) {
      throw new Error('No vehicles found from CarsCommerce API');
    }

    result.totalInFeed = listings.length;

    // Step 3: Get existing VINs for this dealer
    const existingCars = await prisma.car.findMany({
      where: { dealerId },
      select: { id: true, vin: true, seoDescriptionGenerated: true },
    });
    const existingVinMap = new Map(existingCars.map(c => [c.vin, { id: c.id, seoDescriptionGenerated: c.seoDescriptionGenerated }]));
    const feedVins = new Set<string>();

    // Dealer location
    const defaultCity = 'Tempe';
    const defaultState = 'AZ';
    const vCity = (dealer.city || defaultCity).trim();
    const vState = (dealer.state || defaultState).trim();
    const coords = getCoordinatesForDealer(vCity, vState);

    // Step 4: Process each vehicle
    for (let i = 0; i < listings.length; i++) {
      const v = listings[i];
      const vin = (v.vin || '').toUpperCase().trim();
      if (!vin || vin.length !== 17) {
        result.errors.push(`Skipping invalid VIN: ${v.vin}`);
        continue;
      }

      feedVins.add(vin);

      const pricing = v.pricing || {};
      const mechanical = v.mechanical || {};
      const styles = v.styles || {};
      const bodyDetails = v.body_details || {};
      const media = v.media || {};
      const images: string[] = media.images || [];

      const price = pricing.our_price || pricing.price || pricing.internet_price || 0;
      const msrp = pricing.msrp || null;
      const mileage = v.mileage || 0;

      const make = (v.make || '').trim();
      const model = (v.model || '').trim();
      const year = v.year || 0;
      const trim = (v.trim || '').trim();

      if (!year || !make || !model) {
        result.errors.push(`VIN ${vin}: Missing year/make/model, skipping`);
        continue;
      }

      const fuelType = normalizeFuelType(
        mechanical.fuel_type || '',
        mechanical.engine || '',
        model
      );

      const condition = (v.type || 'Used').includes('New') ? 'New' : 'Used';
      const certified = (v.type || '').toLowerCase().includes('certified');

      console.log(`[CarsCommerce] [${i + 1}/${listings.length}] ${year} ${make} ${model} ${trim} (${vin}) $${price.toLocaleString()}`);

      try {
        // Upload photos
        console.log(`[CarsCommerce]   Uploading ${images.length} photos...`);
        const photos = await processVehiclePhotos(images, vin);

        const carData: any = {
          dealerId,
          vin,
          make,
          model,
          year,
          mileage,
          color: (styles.exterior_color || 'Unknown').trim(),
          transmission: (mechanical.transmission || 'Automatic').trim(),
          salePrice: price,
          msrp: msrp && msrp > 0 ? msrp : null,
          description: '',
          photos,
          latitude: coords.latitude,
          longitude: coords.longitude,
          city: vCity,
          state: vState,
          status: 'active',
          bodyType: bodyDetails.type || null,
          trim: trim || null,
          drivetrain: mechanical.drivetrain || null,
          engine: mechanical.engine || null,
          condition,
          certified,
          fuelType,
          slug: generateSlug(vin, year, make, model, vCity, vState),
          interiorColor: styles.interior_color || null,
          mpgCity: mechanical.city_mpg || null,
          mpgHighway: mechanical.highway_mpg || null,
          doors: bodyDetails.number_of_doors || null,
          features: v.features && v.features.length > 0 ? JSON.stringify(v.features) : null,
        };

        let carId: string;
        let needsSEO = false;

        if (existingVinMap.has(vin)) {
          // Update existing vehicle
          const existing = existingVinMap.get(vin)!;
          carId = existing.id;
          const updateData = { ...carData };
          if (existing.seoDescriptionGenerated) {
            delete updateData.description;
          } else {
            needsSEO = true;
          }
          await prisma.car.update({ where: { id: existing.id }, data: updateData });
          result.updated++;
          console.log(`[CarsCommerce]   Updated`);
        } else {
          // Create new vehicle
          const created = await prisma.car.create({ data: carData });
          carId = created.id;
          needsSEO = true;
          result.created++;
          console.log(`[CarsCommerce]   Created`);
        }

        // Generate SEO description for new vehicles or those missing one
        if (needsSEO) {
          try {
            const seoDescription = await generateSEODescription({
              ...carData,
              color: carData.color,
              salePrice: carData.salePrice || null,
            });
            if (isValidSEODescription(seoDescription)) {
              await prisma.car.update({
                where: { id: carId },
                data: { description: seoDescription, seoDescriptionGenerated: true },
              });
              console.log(`[CarsCommerce]   SEO description generated for ${vin}`);
            }
          } catch (seoErr: any) {
            console.error(`[CarsCommerce]   SEO generation failed for ${vin}:`, seoErr.message);
          }
          await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
        }
      } catch (err: any) {
        result.errors.push(`VIN ${vin}: ${err.message}`);
        console.error(`[CarsCommerce]   ERROR: ${err.message}`);
      }
    }

    // Step 5: Mark vehicles not in feed as sold
    for (const [vin, existing] of existingVinMap) {
      if (!feedVins.has(vin)) {
        try {
          await prisma.car.update({
            where: { id: existing.id },
            data: { status: 'sold', statusChangedAt: new Date() },
          });
          result.markedSold++;
        } catch (err: any) {
          result.errors.push(`Mark sold VIN ${vin}: ${err.message}`);
        }
      }
    }

    // Step 6: Update dealer sync status
    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: 'success',
        lastSyncMessage: `Synced ${result.totalInFeed} vehicles: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`,
      },
    });

    result.success = true;
    console.log(`[CarsCommerce] Sync completed: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`);

  } catch (err: any) {
    console.error('[CarsCommerce] Sync error:', err);
    result.errors.push(err.message);

    try {
      await prisma.user.update({
        where: { id: dealerId },
        data: { lastSyncAt: new Date(), lastSyncStatus: 'failed', lastSyncMessage: err.message },
      });
    } catch (updateErr) {
      console.error('[CarsCommerce] Failed to update sync status:', updateErr);
    }
  } finally {
    result.duration = Date.now() - startTime;
  }

  return result;
}
