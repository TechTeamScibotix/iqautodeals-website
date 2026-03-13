import SftpClient from 'ssh2-sftp-client';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { uploadVehiclePhotos } from '@/lib/sync/photo-uploader';
import { generateSEODescription, isValidSEODescription } from '@/lib/seo/generate-description';

const SEO_DELAY_MS = 1500; // 1.5s between Gemini calls to respect rate limits

// SFTP Configuration - read at call time so env vars are available after dotenv loads
function getSftpConfig() {
  return {
    host: (process.env.DEALERSOCKET_SFTP_HOST || '').trim(),
    port: parseInt((process.env.DEALERSOCKET_SFTP_PORT || '22').trim(), 10),
    username: (process.env.LEXUS_SFTP_USERNAME || '').trim(),
    password: (process.env.LEXUS_SFTP_PASSWORD || '').trim(),
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

// Absolute path template — each dealer has its own home dir on the shared SFTP server
// e.g. /home/lexus_MP12861/uploads/lexus_MP12861_inventory.csv
function getFeedPath(feedId: string): string {
  return `/home/${feedId}/uploads/${feedId}_inventory.csv`;
}

// Lexus CSV field mapping
interface LexusCsvVehicle {
  VIN: string;
  Year: string;
  Make: string;
  Model: string;
  Odometer: string;
  Price: string;
  MSRP: string;
  Colour: string;
  'Interior Color': string;
  Body: string;
  Transmission: string;
  'Drivetrain Desc': string;
  Engine: string;
  Fuel: string;
  Series: string;
  'Series Detail': string;
  'New/Used': string;
  Certified: string;
  Description: string;
  'Photo Url List': string;
  'Dealer City': string;
  'Dealer Region': string;
  Features: string;
  'City MPG': string;
  'Highway MPG': string;
  'Body Door Ct': string;
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

// Parse pipe-separated features string into JSON array string
function parseFeatures(features: string): string | null {
  if (!features) return null;
  const list = features.split('|').map(f => f.trim()).filter(f => f);
  return list.length > 0 ? JSON.stringify(list) : null;
}

// Parse pipe-separated photo URLs into array
function parsePhotoUrls(photoUrlList: string): string[] {
  if (!photoUrlList) return [];
  return photoUrlList.split('|').map(url => url.trim()).filter(url => url);
}

// Normalize fuel type from the Lexus CSV Fuel column
function normalizeFuelType(fuel: string, engine: string, model: string): string {
  const fuelLower = (fuel || '').toLowerCase();
  const engineLower = (engine || '').toLowerCase();
  const modelLower = (model || '').toLowerCase();

  // Check the Fuel column first (Lexus CSV provides this directly)
  if (fuelLower.includes('electric') || modelLower.includes('bev') || modelLower.includes('electric')) {
    return 'Electric';
  }
  if (fuelLower.includes('hybrid') || fuelLower.includes('phev') ||
      engineLower.includes('hybrid') || modelLower.includes('hybrid')) {
    return 'Hybrid';
  }
  if (fuelLower.includes('diesel') || engineLower.includes('diesel')) {
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
  if (engineLower.includes('cummins')) return 'Diesel';

  // Default
  return 'Gasoline';
}

// Determine vehicle condition from New/Used + Certified columns + mileage override
function determineCondition(newUsed: string, certified: string, mileage: number): string {
  // Certified Pre-Owned takes priority
  if (certified && certified.toUpperCase() === 'Y') {
    return 'Certified Pre-Owned';
  }

  // Mileage override: > 1000 miles means Used regardless of what CSV says
  if (mileage > 1000) {
    return 'Used';
  }

  // Trust the CSV column
  const value = (newUsed || '').toLowerCase().trim();
  if (value === 'new' || value === 'n') return 'New';
  if (value === 'used' || value === 'u') return 'Used';

  return 'Used';
}

// Drivetrain terms that should NOT be used as trim
const DRIVETRAIN_TERMS = ['quattro', '4matic', 'xdrive', 'awd', 'fwd', 'rwd', '4wd', '2wd', '4x4', '4x2', 'e-4orce'];

function isDrivetrainOnly(val: string): boolean {
  const cleaned = val.toLowerCase().trim().replace(/[®™©]/g, '');
  return DRIVETRAIN_TERMS.includes(cleaned);
}

function stripTrademarks(val: string): string {
  return val.replace(/[®™©]/g, '').trim();
}

// Build trim from Series / Series Detail columns
function buildTrim(series: string, seriesDetail: string): string | null {
  // Prefer Series Detail if it's a real trim (not just a drivetrain designation)
  if (seriesDetail && seriesDetail.trim() && !isDrivetrainOnly(seriesDetail)) {
    return stripTrademarks(seriesDetail);
  }
  if (series && series.trim() && !isDrivetrainOnly(series)) {
    return stripTrademarks(series);
  }
  return null;
}

// Download images and upload to Vercel Blob, returns JSON string of URLs
async function processVehiclePhotos(photoUrlList: string, vin: string): Promise<string> {
  const urls = parsePhotoUrls(photoUrlList);
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
    'alpharetta-ga': { lat: 34.0754, lng: -84.2941 },
  };

  const key = `${city.toLowerCase().trim()}-${state.toLowerCase().trim()}`;
  const coords = cityCoords[key];

  if (coords) {
    return { latitude: coords.lat, longitude: coords.lng };
  }

  // Default to center of US if not found
  return { latitude: 39.8283, longitude: -98.5795 };
}

export async function syncLexusFeedInventory(dealerId: string): Promise<SyncResult> {
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
      throw new Error(`Dealer ${dealer.businessName} has no feed ID configured`);
    }

    if (dealer.inventoryFeedType !== 'lexus_sftp') {
      throw new Error(`Dealer ${dealer.businessName} is not configured for Lexus SFTP sync`);
    }

    result.feedId = dealer.dealerSocketFeedId;

    // Connect to SFTP
    console.log(`[Lexus Sync] Connecting to SFTP server for ${dealer.businessName}...`);
    await sftp.connect(getSftpConfig());

    // Read CSV file via absolute path on the shared SFTP server
    const feedPath = getFeedPath(dealer.dealerSocketFeedId);
    console.log(`[Lexus Sync] Reading feed file: ${feedPath}`);

    const exists = await sftp.exists(feedPath);
    if (!exists) {
      throw new Error(`Feed file not found: ${feedPath}`);
    }

    const csvBuffer = await sftp.get(feedPath);
    const csvContent = csvBuffer.toString();

    // Parse CSV
    const vehicles: LexusCsvVehicle[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    result.totalInFeed = vehicles.length;
    console.log(`[Lexus Sync] Found ${vehicles.length} vehicles in feed`);

    // Get existing VINs for this dealer (include photos to check image counts)
    const existingCars = await prisma.car.findMany({
      where: { dealerId },
      select: { id: true, vin: true, seoDescriptionGenerated: true, photos: true },
    });
    const existingVinMap = new Map(existingCars.map(c => [c.vin, { id: c.id, seoDescriptionGenerated: c.seoDescriptionGenerated, photos: c.photos }]));
    const feedVins = new Set(vehicles.map(v => v.VIN));

    // Use city/state from CSV if available, otherwise fall back to dealer record
    const firstVehicle = vehicles[0];
    const city = firstVehicle?.['Dealer City'] || dealer.city || '';
    const state = firstVehicle?.['Dealer Region'] || dealer.state || '';
    const coords = getCoordinatesForDealer(city, state);

    // Process each vehicle
    for (const vehicle of vehicles) {
      try {
        if (!vehicle.VIN) {
          result.errors.push('Skipping vehicle with no VIN');
          continue;
        }

        const feedPhotoUrls = parsePhotoUrls(vehicle['Photo Url List']);
        const feedPhotoCount = feedPhotoUrls.length;

        // --- EXISTING VIN: check if we can skip ---
        if (existingVinMap.has(vehicle.VIN)) {
          const existing = existingVinMap.get(vehicle.VIN)!;

          // Count how many images we currently have
          let currentPhotoCount = 0;
          try {
            const parsed = JSON.parse(existing.photos || '[]');
            currentPhotoCount = Array.isArray(parsed) ? parsed.length : 0;
          } catch { currentPhotoCount = 0; }

          // If images match and SEO exists → skip entirely
          if (currentPhotoCount >= feedPhotoCount && currentPhotoCount > 1 && existing.seoDescriptionGenerated) {
            result.updated++;
            continue;
          }

          // If we only have 1 image (or 0) and feed has more → re-download photos
          let needsPhotoUpdate = false;
          if (currentPhotoCount <= 1 && feedPhotoCount > currentPhotoCount) {
            needsPhotoUpdate = true;
          }

          if (needsPhotoUpdate) {
            console.log(`[Lexus Sync] ${vehicle.VIN} — updating photos (had ${currentPhotoCount}, feed has ${feedPhotoCount})`);
            const photos = await processVehiclePhotos(vehicle['Photo Url List'], vehicle.VIN);
            await prisma.car.update({
              where: { id: existing.id },
              data: { photos },
            });
          }

          // If SEO description is missing, generate it
          if (!existing.seoDescriptionGenerated) {
            const mileage = parseInt(vehicle.Odometer, 10) || 0;
            const vehicleCity = vehicle['Dealer City'] || city;
            const vehicleState = vehicle['Dealer Region'] || state;
            const isNewVehicle = (vehicle['New/Used'] || '').toLowerCase().trim() === 'n' ||
                                 (vehicle['New/Used'] || '').toLowerCase().trim() === 'new';
            const msrpPrice = parseFloat(vehicle.MSRP) || 0;
            const regularPrice = parseFloat(vehicle.Price) || 0;
            const listingPrice = isNewVehicle && msrpPrice > 0 ? msrpPrice : regularPrice;

            try {
              const seoDescription = await generateSEODescription({
                vin: vehicle.VIN, make: vehicle.Make || 'Lexus', model: vehicle.Model || '',
                year: parseInt(vehicle.Year, 10) || 0, mileage, color: vehicle.Colour || 'Unknown',
                transmission: vehicle.Transmission || 'Automatic', salePrice: listingPrice,
                bodyType: vehicle.Body || null, trim: buildTrim(vehicle.Series, vehicle['Series Detail']),
                engine: vehicle.Engine || null, fuelType: normalizeFuelType(vehicle.Fuel, vehicle.Engine, vehicle.Model),
                condition: determineCondition(vehicle['New/Used'], vehicle.Certified, mileage),
                city: vehicleCity, state: vehicleState,
              });
              if (isValidSEODescription(seoDescription)) {
                await prisma.car.update({
                  where: { id: existing.id },
                  data: { description: seoDescription, seoDescriptionGenerated: true },
                });
                console.log(`[Lexus Sync] SEO description generated for ${vehicle.VIN}`);
              }
            } catch (seoErr: any) {
              console.error(`[Lexus Sync] SEO generation failed for ${vehicle.VIN}:`, seoErr.message);
            }
            await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
          }

          result.updated++;
          continue;
        }

        // --- NEW VIN: full processing ---
        console.log(`[Lexus Sync] NEW vehicle: ${vehicle.VIN} — ${vehicle.Year} ${vehicle.Make} ${vehicle.Model}`);
        const photos = await processVehiclePhotos(vehicle['Photo Url List'], vehicle.VIN);

        const mileage = parseInt(vehicle.Odometer, 10) || 0;
        const vehicleCity = vehicle['Dealer City'] || city;
        const vehicleState = vehicle['Dealer Region'] || state;

        const isNewVehicle = (vehicle['New/Used'] || '').toLowerCase().trim() === 'n' ||
                             (vehicle['New/Used'] || '').toLowerCase().trim() === 'new';
        const msrpPrice = parseFloat(vehicle.MSRP) || 0;
        const regularPrice = parseFloat(vehicle.Price) || 0;
        const listingPrice = isNewVehicle && msrpPrice > 0 ? msrpPrice : regularPrice;

        const carData = {
          dealerId,
          vin: vehicle.VIN.trim(),
          make: (vehicle.Make || 'Lexus').trim(),
          model: (vehicle.Model || '').trim(),
          year: parseInt(vehicle.Year, 10) || 0,
          mileage,
          color: (vehicle.Colour || 'Unknown').trim(),
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
          trim: buildTrim(vehicle.Series, vehicle['Series Detail']),
          drivetrain: vehicle['Drivetrain Desc']?.trim()
            ? stripTrademarks(vehicle['Drivetrain Desc'].trim().charAt(0).toUpperCase() + vehicle['Drivetrain Desc'].trim().slice(1))
            : null,
          engine: vehicle.Engine?.trim() || null,
          condition: determineCondition(vehicle['New/Used'], vehicle.Certified, mileage),
          fuelType: normalizeFuelType(vehicle.Fuel, vehicle.Engine, vehicle.Model),
          slug: generateSlug(
            vehicle.VIN,
            parseInt(vehicle.Year, 10),
            vehicle.Make || 'Lexus',
            vehicle.Model,
            vehicleCity,
            vehicleState
          ),
          interiorColor: vehicle['Interior Color']?.trim() || null,
          msrp: msrpPrice > 0 ? msrpPrice : null,
          certified: vehicle.Certified?.toUpperCase() === 'Y' || vehicle.Certified?.toUpperCase() === 'YES',
          features: parseFeatures(vehicle.Features),
          mpgCity: parseInt(vehicle['City MPG'], 10) || null,
          mpgHighway: parseInt(vehicle['Highway MPG'], 10) || null,
          doors: parseInt(vehicle['Body Door Ct'], 10) || null,
        };

        const created = await prisma.car.create({ data: carData });
        result.created++;

        // Generate SEO description for new vehicle
        try {
          const seoDescription = await generateSEODescription(carData);
          if (isValidSEODescription(seoDescription)) {
            await prisma.car.update({
              where: { id: created.id },
              data: { description: seoDescription, seoDescriptionGenerated: true },
            });
            console.log(`[Lexus Sync] SEO description generated for ${vehicle.VIN}`);
          }
        } catch (seoErr: any) {
          console.error(`[Lexus Sync] SEO generation failed for ${vehicle.VIN}:`, seoErr.message);
        }
        await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
      } catch (err: any) {
        result.errors.push(`VIN ${vehicle.VIN}: ${err.message}`);
      }
    }

    // Mark vehicles not in feed as sold
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
    console.log(`[Lexus Sync] Completed: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`);

  } catch (err: any) {
    console.error('[Lexus Sync] Error:', err);
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
      console.error('[Lexus Sync] Failed to update sync status:', updateErr);
    }

  } finally {
    await sftp.end();
    result.duration = Date.now() - startTime;
  }

  return result;
}
