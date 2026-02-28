import { prisma } from '@/lib/prisma';
import { uploadVehiclePhotos } from '@/lib/sync/photo-uploader';
import { generateSEODescription, isValidSEODescription } from '@/lib/seo/generate-description';

const SEO_DELAY_MS = 1500; // 1.5s between Gemini calls to respect rate limits
const TIME_BUDGET_MS = 4.5 * 60 * 1000; // 4.5 minutes — stop early to avoid Vercel timeout

// Algolia public search-only credentials (safe to hardcode)
const ALGOLIA_APP_ID = 'SEWJN80HTN';
const ALGOLIA_API_KEY = '179608f32563367799314290254e3e44';
const ALGOLIA_INDEX = 'lexusofnashville-sbm0226_production_inventory';

// Dealer mapping: Algolia location → dealer ID + city/state
const DEALER_MAP: Record<string, { dealerId: string; city: string; state: string }> = {
  'Lexus of Nashville': {
    dealerId: 'e362433a-bfb0-49d4-80d0-d3361fd893a2',
    city: 'Nashville',
    state: 'TN',
  },
  'Lexus of Cool Springs': {
    dealerId: 'b81b150f-be2f-4f85-ab73-dde5e878e498',
    city: 'Brentwood',
    state: 'TN',
  },
};

// Coordinates for each location
const LOCATION_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'Nashville-TN': { latitude: 36.1627, longitude: -86.7816 },
  'Brentwood-TN': { latitude: 36.0331, longitude: -86.7828 },
};

interface AlgoliaHit {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  model_series: string;
  msrp: number;
  our_price: number;
  ext_color: string;
  int_color: string;
  body: string;
  drivetrain: string;
  engine_description: string;
  transmission_description: string;
  miles: number;
  fueltype: string;
  city_mpg: number;
  hw_mpg: number;
  doors: number;
  certified: any;
  features: string[];
  thumbnail: string;
  type: string; // "new" or "used"
  location: string;
}

interface AlgoliaResponse {
  hits: AlgoliaHit[];
  nbHits: number;
}

interface AlgoliaSyncResult {
  success: boolean;
  totalFetched: number;
  created: number;
  reactivated: number;
  photosUpdated: number;
  skipped: number;
  deferred: number;
  errors: string[];
  duration: number;
}

// Fetch all vehicles from Algolia index
async function fetchAlgoliaInventory(): Promise<AlgoliaHit[]> {
  const allHits: AlgoliaHit[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const response = await fetch(
      `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX}/query`,
      {
        method: 'POST',
        headers: {
          'X-Algolia-Application-Id': ALGOLIA_APP_ID,
          'X-Algolia-API-Key': ALGOLIA_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: `hitsPerPage=1000&page=${page}`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Algolia API error: ${response.status} ${response.statusText}`);
    }

    const data: AlgoliaResponse & { nbPages?: number } = await response.json();
    allHits.push(...data.hits);
    totalPages = data.nbPages || 1;
    page++;
  }

  return allHits;
}

// Normalize plural body types to singular (e.g. "SUVs" → "SUV", "Sedans" → "Sedan")
function normalizeBodyType(body: string): string | null {
  if (!body) return null;
  let normalized = body.trim();
  // Remove trailing 's' for common plurals but not for words like "Bus"
  if (normalized.endsWith('s') && normalized.length > 3) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || null;
}

// Determine vehicle condition from type + certified + miles
function determineCondition(type: string, certified: boolean, miles: number): string {
  if (certified) return 'Certified Pre-Owned';
  if (miles > 1000) return 'Used';
  if (String(type || '').toLowerCase() === 'new') return 'New';
  if (String(type || '').toLowerCase() === 'used') return 'Used';
  return 'Used';
}

// Pick the best trim value
function pickTrim(hit: AlgoliaHit): string | null {
  if (hit.trim && hit.trim.trim()) return hit.trim.trim();
  if (hit.model_series && hit.model_series.trim()) return hit.model_series.trim();
  return null;
}

// Generate SEO-friendly slug (same pattern as lexus-feed.ts)
function generateSlug(vin: string, year: number, make: string, model: string, city: string, state: string): string {
  const parts = [vin, year, make, model, city, state]
    .map(p => String(p).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .filter(p => p);
  return parts.join('-');
}

// Clean and validate a thumbnail URL from Algolia
function cleanThumbnailUrl(url: string): string | null {
  if (!url) return null;
  let cleaned = url.trim();

  // Fix protocol-relative URLs
  if (cleaned.startsWith('//')) {
    cleaned = `https:${cleaned}`;
  }

  // Filter out "notfound" / placeholder images
  if (cleaned.includes('notfound') || cleaned.includes('no-image') || cleaned.includes('placeholder')) {
    return null;
  }

  return cleaned;
}

// Upload thumbnail to Vercel Blob, return JSON string of photo array
async function processVehicleThumbnail(thumbnailUrl: string, vin: string): Promise<string> {
  const cleaned = cleanThumbnailUrl(thumbnailUrl);
  if (!cleaned) return '[]';

  try {
    const uploadedUrls = await uploadVehiclePhotos([cleaned], vin, true);
    return JSON.stringify(uploadedUrls);
  } catch (error) {
    console.error(`[Algolia Sync] Failed to upload thumbnail for ${vin}:`, error);
    return JSON.stringify([cleaned]);
  }
}

// Normalize fuel type string
function normalizeFuelType(fueltype: string, engine: string, model: string): string {
  const fuelLower = (fueltype || '').toLowerCase();
  const engineLower = (engine || '').toLowerCase();
  const modelLower = (model || '').toLowerCase();

  if (fuelLower.includes('electric') || modelLower.includes('bev') || modelLower.includes('electric')) return 'Electric';
  if (fuelLower.includes('hybrid') || fuelLower.includes('phev') || engineLower.includes('hybrid') || modelLower.includes('hybrid')) return 'Hybrid';
  if (fuelLower.includes('diesel') || engineLower.includes('diesel')) return 'Diesel';
  if (fuelLower.includes('flex') || fuelLower.includes('e85')) return 'Flex Fuel';
  if (fuelLower.includes('gasoline') || fuelLower.includes('gas') || fuelLower.includes('unleaded')) return 'Gasoline';
  if (engineLower.includes('electric')) return 'Electric';
  return 'Gasoline';
}

export async function syncLexusAlgoliaInventory(): Promise<AlgoliaSyncResult> {
  const startTime = Date.now();
  const result: AlgoliaSyncResult = {
    success: false,
    totalFetched: 0,
    created: 0,
    reactivated: 0,
    photosUpdated: 0,
    skipped: 0,
    deferred: 0,
    errors: [],
    duration: 0,
  };

  try {
    // 1. Fetch all vehicles from Algolia
    console.log('[Algolia Sync] Fetching inventory from Algolia...');
    const allHits = await fetchAlgoliaInventory();
    result.totalFetched = allHits.length;
    console.log(`[Algolia Sync] Fetched ${allHits.length} vehicles from Algolia`);

    // 2. Group by location → dealer
    const hitsByDealer = new Map<string, { dealerId: string; city: string; state: string; hits: AlgoliaHit[] }>();

    for (const hit of allHits) {
      const mapping = DEALER_MAP[hit.location];
      if (!mapping) {
        // Unknown location — skip
        continue;
      }

      if (!hitsByDealer.has(mapping.dealerId)) {
        hitsByDealer.set(mapping.dealerId, { ...mapping, hits: [] });
      }
      hitsByDealer.get(mapping.dealerId)!.hits.push(hit);
    }

    // 3. For each dealer, reconcile against DB
    for (const [dealerId, { city, state, hits }] of hitsByDealer) {
      console.log(`[Algolia Sync] Processing ${hits.length} vehicles for dealer ${dealerId} (${city}, ${state})`);

      const coordKey = `${city}-${state}`;
      const coords = LOCATION_COORDS[coordKey] || { latitude: 39.8283, longitude: -98.5795 };

      // Get ALL existing cars for this dealer (active and sold)
      const existingCars = await prisma.car.findMany({
        where: { dealerId },
        select: { id: true, vin: true, status: true, photos: true, seoDescriptionGenerated: true },
      });

      const existingVinMap = new Map(
        existingCars.map(c => [c.vin, { id: c.id, status: c.status, photos: c.photos, seoDescriptionGenerated: c.seoDescriptionGenerated }])
      );

      for (const hit of hits) {
        // Time budget check — stop early to avoid Vercel timeout
        if (Date.now() - startTime > TIME_BUDGET_MS) {
          result.deferred++;
          continue;
        }

        try {
          if (!hit.vin) {
            result.errors.push('Skipping vehicle with no VIN');
            continue;
          }

          const existing = existingVinMap.get(hit.vin);

          // Pre-compute certified flag (needed for SEO in all branches)
          const isCertified = hit.certified === true || hit.certified === 1 || String(hit.certified).toLowerCase() === 'true' || String(hit.certified).toLowerCase() === 'yes';

          // Check if active vehicle has valid (non-placeholder) photos
          const hasValidPhotos = (() => {
            if (!existing || !existing.photos) return false;
            try {
              const parsed = JSON.parse(existing.photos);
              if (!Array.isArray(parsed) || parsed.length === 0) return false;
              // Check that at least one URL is real (not a notfound/placeholder)
              return parsed.some((url: string) =>
                url && url.startsWith('https://') && !url.includes('notfound') && !url.includes('no-image') && !url.includes('placeholder')
              );
            } catch { return false; }
          })();

          // ACTIVE + HAS VALID PHOTOS → skip, but generate SEO if missing
          if (existing && existing.status === 'active' && hasValidPhotos) {
            if (!existing.seoDescriptionGenerated && Date.now() - startTime < TIME_BUDGET_MS) {
              try {
                const seoData = {
                  make: (hit.make || 'Lexus').trim(), model: (hit.model || '').trim(),
                  year: parseInt(String(hit.year), 10) || 0, mileage: parseInt(String(hit.miles), 10) || 0,
                  color: (hit.ext_color || 'Unknown').trim(), transmission: (hit.transmission_description || 'Automatic').trim(),
                  salePrice: parseFloat(String(hit.our_price)) || parseFloat(String(hit.msrp)) || 0, city, state, vin: hit.vin,
                  features: hit.features && hit.features.length > 0 ? JSON.stringify(hit.features) : null,
                  trim: pickTrim(hit), engine: hit.engine_description?.trim() || null,
                  drivetrain: hit.drivetrain?.trim() || null, bodyType: normalizeBodyType(hit.body),
                  fuelType: normalizeFuelType(hit.fueltype, hit.engine_description, hit.model),
                  interiorColor: hit.int_color?.trim() || null,
                  condition: determineCondition(hit.type, isCertified, parseInt(String(hit.miles), 10) || 0),
                  certified: isCertified,
                  mpgCity: parseInt(String(hit.city_mpg), 10) || null,
                  mpgHighway: parseInt(String(hit.hw_mpg), 10) || null,
                };
                const seoDescription = await generateSEODescription(seoData);
                if (isValidSEODescription(seoDescription)) {
                  await prisma.car.update({
                    where: { id: existing.id },
                    data: { description: seoDescription, seoDescriptionGenerated: true },
                  });
                  console.log(`[Algolia Sync] SEO description generated for active ${hit.vin}`);
                }
              } catch (seoErr: any) {
                console.error(`[Algolia Sync] SEO generation failed for ${hit.vin}:`, seoErr.message);
              }
              await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
            }
            result.skipped++;
            continue;
          }

          // ACTIVE + NO/BAD PHOTOS → just update photos from Algolia thumbnail
          if (existing && existing.status === 'active' && !hasValidPhotos) {
            const cleanedUrl = cleanThumbnailUrl(hit.thumbnail);
            if (cleanedUrl) {
              console.log(`[Algolia Sync] Updating photos for active vehicle ${hit.vin} (was missing photos)...`);
              const photos = await processVehicleThumbnail(hit.thumbnail, hit.vin);
              // Only save if we got a real photo (not empty)
              const parsed = JSON.parse(photos);
              if (Array.isArray(parsed) && parsed.length > 0) {
                await prisma.car.update({
                  where: { id: existing.id },
                  data: { photos },
                });
                result.photosUpdated++;
                console.log(`[Algolia Sync] Photos updated for ${hit.vin}`);
              } else {
                result.skipped++;
              }
            } else {
              result.skipped++;
            }
            // Generate SEO for active vehicles missing descriptions (regardless of photo status)
            if (!existing.seoDescriptionGenerated && Date.now() - startTime < TIME_BUDGET_MS) {
              try {
                const seoData = {
                  make: (hit.make || 'Lexus').trim(), model: (hit.model || '').trim(),
                  year: parseInt(String(hit.year), 10) || 0, mileage: parseInt(String(hit.miles), 10) || 0,
                  color: (hit.ext_color || 'Unknown').trim(), transmission: (hit.transmission_description || 'Automatic').trim(),
                  salePrice: parseFloat(String(hit.our_price)) || parseFloat(String(hit.msrp)) || 0, city, state, vin: hit.vin,
                  features: hit.features && hit.features.length > 0 ? JSON.stringify(hit.features) : null,
                  trim: pickTrim(hit), engine: hit.engine_description?.trim() || null,
                  drivetrain: hit.drivetrain?.trim() || null, bodyType: normalizeBodyType(hit.body),
                  fuelType: normalizeFuelType(hit.fueltype, hit.engine_description, hit.model),
                  interiorColor: hit.int_color?.trim() || null,
                  condition: determineCondition(hit.type, isCertified, parseInt(String(hit.miles), 10) || 0),
                  certified: isCertified,
                  mpgCity: parseInt(String(hit.city_mpg), 10) || null,
                  mpgHighway: parseInt(String(hit.hw_mpg), 10) || null,
                };
                const seoDescription = await generateSEODescription(seoData);
                if (isValidSEODescription(seoDescription)) {
                  await prisma.car.update({
                    where: { id: existing.id },
                    data: { description: seoDescription, seoDescriptionGenerated: true },
                  });
                  console.log(`[Algolia Sync] SEO description generated for active ${hit.vin}`);
                }
              } catch (seoErr: any) {
                console.error(`[Algolia Sync] SEO generation failed for ${hit.vin}:`, seoErr.message);
              }
              await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
            }
            continue;
          }

          // This is either a CREATE or REACTIVATE
          const isReactivate = existing && existing.status === 'sold';

          // Upload thumbnail photo
          console.log(`[Algolia Sync] Processing photo for ${hit.vin}...`);
          const photos = await processVehicleThumbnail(hit.thumbnail, hit.vin);

          // Algolia returns loosely typed values — force coerce everything
          const mileage = parseInt(String(hit.miles), 10) || 0;
          const year = parseInt(String(hit.year), 10) || 0;
          const msrpNum = parseFloat(String(hit.msrp)) || 0;
          const ourPriceNum = parseFloat(String(hit.our_price)) || 0;
          const cityMpg = parseInt(String(hit.city_mpg), 10) || null;
          const hwMpg = parseInt(String(hit.hw_mpg), 10) || null;
          const doorsNum = parseInt(String(hit.doors), 10) || null;
          const isNew = String(hit.type || '').toLowerCase() === 'new';
          const salePrice = isNew && msrpNum > 0 ? msrpNum : ourPriceNum > 0 ? ourPriceNum : msrpNum;

          const carData = {
            dealerId,
            vin: hit.vin.trim(),
            make: (hit.make || 'Lexus').trim(),
            model: (hit.model || '').trim(),
            year,
            mileage,
            color: (hit.ext_color || 'Unknown').trim(),
            transmission: (hit.transmission_description || 'Automatic').trim(),
            salePrice,
            description: '',
            photos,
            latitude: coords.latitude,
            longitude: coords.longitude,
            city,
            state,
            status: 'active',
            bodyType: normalizeBodyType(hit.body),
            trim: pickTrim(hit),
            drivetrain: hit.drivetrain?.trim() || null,
            engine: hit.engine_description?.trim() || null,
            condition: determineCondition(hit.type, isCertified, mileage),
            fuelType: normalizeFuelType(hit.fueltype, hit.engine_description, hit.model),
            slug: generateSlug(hit.vin, year, hit.make || 'Lexus', hit.model, city, state),
            interiorColor: hit.int_color?.trim() || null,
            msrp: msrpNum > 0 ? msrpNum : null,
            certified: isCertified,
            features: hit.features && hit.features.length > 0 ? JSON.stringify(hit.features) : null,
            mpgCity: cityMpg,
            mpgHighway: hwMpg,
            doors: doorsNum,
          };

          let carId: string;

          if (isReactivate) {
            // REACTIVATE: update all fields and set status back to active
            await prisma.car.update({
              where: { id: existing!.id },
              data: {
                ...carData,
                statusChangedAt: new Date(),
              },
            });
            carId = existing!.id;
            result.reactivated++;
            console.log(`[Algolia Sync] Reactivated ${hit.vin}`);
          } else {
            // CREATE: new car record (upsert to handle VINs shared across locations)
            const created = await prisma.car.upsert({
              where: { vin: hit.vin.trim() },
              create: carData,
              update: {
                ...carData,
                statusChangedAt: new Date(),
              },
            });
            carId = created.id;
            result.created++;
            console.log(`[Algolia Sync] Created ${hit.vin}`);
          }

          // Generate SEO description for new/reactivated vehicles
          if (Date.now() - startTime < TIME_BUDGET_MS) {
            try {
              const seoDescription = await generateSEODescription(carData);
              if (isValidSEODescription(seoDescription)) {
                await prisma.car.update({
                  where: { id: carId },
                  data: {
                    description: seoDescription,
                    seoDescriptionGenerated: true,
                  },
                });
                console.log(`[Algolia Sync] SEO description generated for ${hit.vin}`);
              }
            } catch (seoErr: any) {
              console.error(`[Algolia Sync] SEO generation failed for ${hit.vin}:`, seoErr.message);
            }
            await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
          }
        } catch (err: any) {
          result.errors.push(`VIN ${hit.vin}: ${err.message}`);
        }
      }
    }

    result.success = true;
    console.log(`[Algolia Sync] Completed: ${result.created} created, ${result.reactivated} reactivated, ${result.photosUpdated} photos updated, ${result.skipped} skipped, ${result.deferred} deferred`);

  } catch (err: any) {
    console.error('[Algolia Sync] Error:', err);
    result.errors.push(err.message);
  } finally {
    result.duration = Date.now() - startTime;
  }

  return result;
}
