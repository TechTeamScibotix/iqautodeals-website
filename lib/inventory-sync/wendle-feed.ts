import SftpClient from 'ssh2-sftp-client';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { uploadVehiclePhotos } from '@/lib/sync/photo-uploader';
import { generateSEODescription, isValidSEODescription } from '@/lib/seo/generate-description';

const SEO_DELAY_MS = 1500; // 1.5s between Gemini calls to respect rate limits

// SFTP Configuration — Wendle has its own credentials on the same DO server
function getSftpConfig() {
  return {
    host: (process.env.WENDLE_SFTP_HOST || '').trim(),
    port: 22,
    username: (process.env.WENDLE_SFTP_USERNAME || '').trim(),
    password: (process.env.WENDLE_SFTP_PASSWORD || '').trim(),
    // OpenSSH 9.6 requires explicit algorithm negotiation with ssh2 library
    algorithms: {
      kex: [
        'ecdh-sha2-nistp256',
        'ecdh-sha2-nistp384',
        'ecdh-sha2-nistp521',
        'diffie-hellman-group-exchange-sha256',
        'diffie-hellman-group14-sha256',
      ] as any,
      serverHostKey: [
        'ssh-ed25519',
        'ecdsa-sha2-nistp256',
        'rsa-sha2-512',
        'rsa-sha2-256',
      ] as any,
    },
  };
}

// Feed paths relative to SFTP home directory
const FEED_PATHS = [
  'uploads/inventoryfeed.csv',
  'uploadsnissan/inventoryfeed.csv',
];

// Wendle CSV field mapping (66 columns, comma-separated images)
interface WendleCsvVehicle {
  VIN: string;
  Year: string;
  Make: string;
  Model: string;
  Trim: string;
  Body: string;
  Miles: string;
  ExteriorColor: string;
  InteriorColor: string;
  SellingPrice: string;
  Internet_Price: string;
  MSRP: string;
  Transmission: string;
  Engine_Description: string;
  Drivetrain: string;
  Fuel_Type: string;
  Doors: string;
  CityMPG: string;
  HighwayMPG: string;
  Certified: string;
  Type: string;
  DateInStock: string;
  Description: string;
  Options: string;
  ImageList: string;
  'Dealer City': string;
  'Dealer State': string;
  Stock: string;
  // Additional columns present in the CSV but not mapped to Car fields
  [key: string]: string;
}

interface SyncResult {
  success: boolean;
  completed: boolean;       // true = all vehicles processed; false = hit time limit
  nextIndex: number;        // index to resume from on next invocation
  dealerId: string;
  feedId: string;
  totalInFeed: number;
  created: number;
  updated: number;
  markedSold: number;
  errors: string[];
  duration: number;
}

interface SyncOptions {
  startIndex?: number;      // vehicle index to resume from (default 0)
  timeLimitMs?: number;     // max runtime in ms (default 240000 = 4 minutes)
}

// Generate SEO-friendly slug
function generateSlug(vin: string, year: number, make: string, model: string, city: string, state: string): string {
  const parts = [vin, year, make, model, city, state]
    .map(p => String(p).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .filter(p => p);
  return parts.join('-');
}

// Parse comma-separated features from Options into JSON array string
function parseFeatures(options: string): string | null {
  if (!options || !options.trim()) return null;
  const list = options.split(',').map(f => f.trim()).filter(f => f);
  // Deduplicate (case-insensitive)
  const seen = new Set<string>();
  const unique = list.filter(f => {
    const lower = f.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
  return unique.length > 0 ? JSON.stringify(unique) : null;
}

// Parse comma-separated image URLs into array
function parseImageUrls(imageListString: string): string[] {
  if (!imageListString) return [];
  return imageListString.split(',').map(url => url.trim()).filter(url => url && url.startsWith('http'));
}

// Normalize fuel type — Wendle CSV uses values like "Gasoline Fuel", "Diesel Fuel"
function normalizeFuelType(fuelType: string, engine: string, model: string): string {
  const fuelLower = (fuelType || '').toLowerCase();
  const engineLower = (engine || '').toLowerCase();
  const modelLower = (model || '').toLowerCase();

  // Check the Fuel_Type column first
  if (fuelLower.includes('electric') || modelLower.includes('bev') || modelLower.includes('electric')) {
    return 'Electric';
  }
  if (fuelLower.includes('hybrid') || fuelLower.includes('phev') ||
      engineLower.includes('hybrid') || modelLower.includes('hybrid')) {
    return 'Hybrid';
  }
  if (fuelLower.includes('diesel') || engineLower.includes('diesel') || engineLower.includes('cummins')) {
    return 'Diesel';
  }
  if (fuelLower.includes('flex') || fuelLower.includes('e85') ||
      engineLower.includes('flex') || engineLower.includes('e85')) {
    return 'Flex Fuel';
  }
  if (fuelLower.includes('gasoline') || fuelLower.includes('gas') || fuelLower.includes('unleaded')) {
    return 'Gasoline';
  }

  // Fall back to engine string inference
  if (engineLower.includes('electric')) return 'Electric';
  if (engineLower.includes('phev') || engineLower.includes('powerboost')) return 'Hybrid';

  // Default
  return 'Gasoline';
}

// Determine vehicle condition from Type column + mileage override
function determineCondition(type: string, mileage: number): string {
  // Mileage override: > 1000 miles means Used regardless of what CSV says
  if (mileage > 1000) {
    return 'Used';
  }

  // Trust the CSV column
  const value = (type || '').toLowerCase().trim();
  if (value === 'new') return 'New';
  if (value === 'used') return 'Used';

  return 'Used';
}

// Download images and upload to Vercel Blob, returns JSON string of URLs
async function processVehiclePhotos(imageListString: string, vin: string): Promise<string> {
  const urls = parseImageUrls(imageListString);
  if (urls.length === 0) return '[]';

  try {
    const uploadedUrls = await uploadVehiclePhotos(urls, vin, true);
    return JSON.stringify(uploadedUrls);
  } catch (error) {
    console.error(`Failed to upload photos for ${vin}:`, error);
    // Fall back to original URLs
    return JSON.stringify(urls);
  }
}

// Get coordinates for dealer location
function getCoordinatesForDealer(city: string, state: string): { latitude: number; longitude: number } {
  const cityCoords: Record<string, { lat: number; lng: number }> = {
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

  // Default to center of US if not found
  return { latitude: 39.8283, longitude: -98.5795 };
}

export async function syncWendleFeedInventory(dealerId: string, options: SyncOptions = {}): Promise<SyncResult> {
  const startTime = Date.now();
  const startIndex = options.startIndex ?? 0;
  const timeLimitMs = options.timeLimitMs ?? 240000; // 4 minutes default

  const result: SyncResult = {
    success: false,
    completed: false,
    nextIndex: 0,
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
      throw new Error(`Dealer ${dealer.businessName} has no feed ID configured`);
    }

    if (dealer.inventoryFeedType !== 'wendle_sftp') {
      throw new Error(`Dealer ${dealer.businessName} is not configured for Wendle SFTP sync`);
    }

    result.feedId = dealer.dealerSocketFeedId;

    // Connect to SFTP
    console.log(`[Wendle Sync] Connecting to SFTP server for ${dealer.businessName}...`);
    await sftp.connect(getSftpConfig());

    // Read and merge CSV files from all feed paths, deduplicating by VIN
    const vinMap = new Map<string, WendleCsvVehicle>();

    for (const feedPath of FEED_PATHS) {
      const exists = await sftp.exists(feedPath);
      if (!exists) {
        console.log(`[Wendle Sync] Feed file not found (skipping): ${feedPath}`);
        continue;
      }

      console.log(`[Wendle Sync] Reading feed file: ${feedPath}`);
      const csvBuffer = await sftp.get(feedPath);
      const csvContent = csvBuffer.toString();

      const parsed: WendleCsvVehicle[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      console.log(`[Wendle Sync] Found ${parsed.length} vehicles in ${feedPath}`);

      for (const v of parsed) {
        if (v.VIN && !vinMap.has(v.VIN)) {
          vinMap.set(v.VIN, v);
        }
      }
    }

    const vehicles = Array.from(vinMap.values());

    if (vehicles.length === 0) {
      throw new Error('No vehicles found in any feed file');
    }

    result.totalInFeed = vehicles.length;
    console.log(`[Wendle Sync] ${vehicles.length} unique vehicles after merging feeds`);

    // Get existing VINs for this dealer
    const existingCars = await prisma.car.findMany({
      where: { dealerId },
      select: { id: true, vin: true, seoDescriptionGenerated: true },
    });
    const existingVinMap = new Map(existingCars.map(c => [c.vin, { id: c.id, seoDescriptionGenerated: c.seoDescriptionGenerated }]));
    const feedVins = new Set(vehicles.map(v => v.VIN));

    // Use city/state from CSV if available, otherwise fall back to dealer record
    const firstVehicle = vehicles[0];
    const city = firstVehicle?.['Dealer City'] || dealer.city || '';
    const state = firstVehicle?.['Dealer State'] || dealer.state || '';
    const coords = getCoordinatesForDealer(city, state);

    // Process each vehicle (resume from startIndex if continuing a previous run).
    // For EXISTING vehicles: only update metadata (price, mileage, etc.) — skip photo
    // re-upload since photos are already on Vercel Blob.
    // For NEW vehicles: download photos and generate SEO descriptions.
    let newVehicleCount = 0;

    console.log(`[Wendle Sync] Processing from index ${startIndex} of ${vehicles.length} (time limit: ${timeLimitMs}ms)`);

    for (let i = startIndex; i < vehicles.length; i++) {
      // Check time before processing each vehicle
      const elapsed = Date.now() - startTime;
      if (elapsed >= timeLimitMs) {
        console.log(`[Wendle Sync] Time limit reached at index ${i}/${vehicles.length} (${elapsed}ms). Will resume next invocation.`);
        result.nextIndex = i;
        result.completed = false;
        result.success = true;
        result.duration = Date.now() - startTime;

        // Save progress so cron knows to continue
        await prisma.user.update({
          where: { id: dealerId },
          data: {
            lastSyncAt: new Date(),
            lastSyncStatus: 'in_progress',
            lastSyncMessage: JSON.stringify({
              nextIndex: i,
              totalInFeed: vehicles.length,
              created: result.created,
              updated: result.updated,
            }),
          },
        });

        await sftp.end();
        return result;
      }

      const vehicle = vehicles[i];
      try {
        if (!vehicle.VIN) {
          result.errors.push('Skipping vehicle with no VIN');
          continue;
        }

        const mileage = parseInt(vehicle.Miles, 10) || 0;
        const vehicleCity = vehicle['Dealer City'] || city;
        const vehicleState = vehicle['Dealer State'] || state;

        // Use SellingPrice, fall back to Internet_Price
        const sellingPrice = parseFloat(vehicle.SellingPrice) || 0;
        const internetPrice = parseFloat(vehicle.Internet_Price) || 0;
        const listingPrice = sellingPrice > 0 ? sellingPrice : internetPrice;

        // Parse in-stock date if provided
        const inStockDate = vehicle.DateInStock ? new Date(vehicle.DateInStock) : null;
        const validInStockDate = inStockDate && !isNaN(inStockDate.getTime()) ? inStockDate : null;

        if (existingVinMap.has(vehicle.VIN)) {
          // ── EXISTING VEHICLE: fast metadata-only update (no photo re-upload) ──
          const existing = existingVinMap.get(vehicle.VIN)!;
          const updateData: any = {
            make: (vehicle.Make || '').trim(),
            model: (vehicle.Model || '').trim(),
            year: parseInt(vehicle.Year, 10) || 0,
            mileage,
            color: (vehicle.ExteriorColor || 'Unknown').trim(),
            transmission: (vehicle.Transmission || 'Automatic').trim(),
            salePrice: listingPrice,
            latitude: coords.latitude,
            longitude: coords.longitude,
            city: vehicleCity.trim(),
            state: vehicleState.trim(),
            status: 'active',
            bodyType: vehicle.Body?.trim() || null,
            trim: vehicle.Trim?.trim() || null,
            drivetrain: vehicle.Drivetrain?.trim()
              ? vehicle.Drivetrain.trim().charAt(0).toUpperCase() + vehicle.Drivetrain.trim().slice(1)
              : null,
            engine: vehicle.Engine_Description?.trim() || null,
            condition: determineCondition(vehicle.Type, mileage),
            fuelType: normalizeFuelType(vehicle.Fuel_Type, vehicle.Engine_Description, vehicle.Model),
            interiorColor: vehicle.InteriorColor?.trim() || null,
            msrp: parseFloat(vehicle.MSRP) || null,
            inStockDate: validInStockDate,
            mpgCity: parseInt(vehicle.CityMPG, 10) || null,
            mpgHighway: parseInt(vehicle.HighwayMPG, 10) || null,
            doors: parseInt(vehicle.Doors, 10) || null,
            certified: vehicle.Certified === 'True' || vehicle.Certified === 'true',
            features: parseFeatures(vehicle.Options),
          };

          // Preserve existing SEO description
          if (!existing.seoDescriptionGenerated) {
            updateData.description = (vehicle.Description || '').trim();
          }

          await prisma.car.update({
            where: { id: existing.id },
            data: updateData,
          });
          result.updated++;
        } else {
          // ── NEW VEHICLE: full processing with photos + SEO ──
          newVehicleCount++;
          console.log(`[Wendle Sync] New vehicle ${vehicle.VIN} — downloading photos...`);
          const photos = await processVehiclePhotos(vehicle.ImageList, vehicle.VIN);

          const carData = {
            dealerId,
            vin: vehicle.VIN.trim(),
            make: (vehicle.Make || '').trim(),
            model: (vehicle.Model || '').trim(),
            year: parseInt(vehicle.Year, 10) || 0,
            mileage,
            color: (vehicle.ExteriorColor || 'Unknown').trim(),
            transmission: (vehicle.Transmission || 'Automatic').trim(),
            salePrice: listingPrice,
            description: (vehicle.Description || '').trim(),
            photos,
            latitude: coords.latitude,
            longitude: coords.longitude,
            city: vehicleCity.trim(),
            state: vehicleState.trim(),
            status: 'active',
            bodyType: vehicle.Body?.trim() || null,
            trim: vehicle.Trim?.trim() || null,
            drivetrain: vehicle.Drivetrain?.trim()
              ? vehicle.Drivetrain.trim().charAt(0).toUpperCase() + vehicle.Drivetrain.trim().slice(1)
              : null,
            engine: vehicle.Engine_Description?.trim() || null,
            condition: determineCondition(vehicle.Type, mileage),
            fuelType: normalizeFuelType(vehicle.Fuel_Type, vehicle.Engine_Description, vehicle.Model),
            slug: generateSlug(
              vehicle.VIN,
              parseInt(vehicle.Year, 10),
              vehicle.Make || '',
              vehicle.Model || '',
              vehicleCity,
              vehicleState
            ),
            interiorColor: vehicle.InteriorColor?.trim() || null,
            msrp: parseFloat(vehicle.MSRP) || null,
            inStockDate: validInStockDate,
            mpgCity: parseInt(vehicle.CityMPG, 10) || null,
            mpgHighway: parseInt(vehicle.HighwayMPG, 10) || null,
            doors: parseInt(vehicle.Doors, 10) || null,
            certified: vehicle.Certified === 'True' || vehicle.Certified === 'true',
            features: parseFeatures(vehicle.Options),
          };

          const created = await prisma.car.create({ data: carData });
          result.created++;

          // Generate SEO description for new vehicles
          try {
            const seoDescription = await generateSEODescription(carData);
            if (isValidSEODescription(seoDescription)) {
              await prisma.car.update({
                where: { id: created.id },
                data: {
                  description: seoDescription,
                  seoDescriptionGenerated: true,
                },
              });
              console.log(`[Wendle Sync] SEO description generated for ${vehicle.VIN}`);
            }
          } catch (seoErr: any) {
            console.error(`[Wendle Sync] SEO generation failed for ${vehicle.VIN}:`, seoErr.message);
          }
          await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
        }
      } catch (err: any) {
        result.errors.push(`VIN ${vehicle.VIN}: ${err.message}`);
      }
    }

    console.log(`[Wendle Sync] Processed ${result.updated} existing (metadata only) + ${newVehicleCount} new (with photos/SEO)`);

    // All vehicles processed — mark as fully completed
    result.completed = true;
    result.nextIndex = vehicles.length;

    // Only mark vehicles as sold on the final completed pass
    for (const [vin, existing] of existingVinMap) {
      if (!feedVins.has(vin)) {
        try {
          await prisma.car.update({
            where: { id: existing.id },
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

    // Update dealer sync status — fully done
    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: 'success',
        lastSyncMessage: `Synced ${result.totalInFeed} vehicles: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`,
      },
    });

    result.success = true;
    console.log(`[Wendle Sync] Completed: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`);

  } catch (err: any) {
    console.error('[Wendle Sync] Error:', err);
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
      console.error('[Wendle Sync] Failed to update sync status:', updateErr);
    }

  } finally {
    await sftp.end();
    result.duration = Date.now() - startTime;
  }

  return result;
}
