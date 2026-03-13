import { parse as parseHTML } from 'node-html-parser';
import { prisma } from '@/lib/prisma';
import { uploadVehiclePhotos } from '@/lib/sync/photo-uploader';
import { generateSEODescription, isValidSEODescription } from '@/lib/seo/generate-description';
import { decodeVin } from '@/lib/sync/vin-decoder';

const SEO_DELAY_MS = 1500;
const PAGE_FETCH_DELAY_MS = 500; // 0.5s between page fetches

// Full browser headers to bypass DataDome bot protection
const BROWSER_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-ch-ua-arch': '"arm"',
  'sec-ch-device-memory': '8',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
};

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

interface ListingInfo {
  detailUrl: string;
  yearMakeModel: string;
  mileage: number | null;
  thumbnailUrl: string | null;
}

interface VehicleDetail {
  vin: string;
  stockNumber: string | null;
  mileage: number;
  engine: string | null;
  transmission: string | null;
  drivetrain: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  fuelType: string | null;
  mpgCity: number | null;
  mpgHighway: number | null;
  photoUrls: string[];
  year: number;
  make: string;
  model: string;
  trim: string | null;
  bodyType: string | null;
  doors: number | null;
}

function generateSlug(vin: string, year: number, make: string, model: string, city: string, state: string): string {
  const parts = [vin, year, make, model, city, state]
    .map(p => String(p).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .filter(p => p);
  return parts.join('-');
}

function inferFuelType(engine: string, model: string): string {
  const engineLower = (engine || '').toLowerCase();
  const modelLower = (model || '').toLowerCase();

  if (engineLower.includes('electric') || modelLower.includes('bev') || modelLower.includes('electric')) return 'Electric';
  if (engineLower.includes('phev') || engineLower.includes('hybrid') || engineLower.includes('powerboost') ||
      modelLower.includes('hybrid') || modelLower.includes('phev')) return 'Hybrid';
  if (engineLower.includes('diesel') || engineLower.includes('cummins')) return 'Diesel';
  if (engineLower.includes('flex') || engineLower.includes('e85')) return 'Flex Fuel';
  return 'Gasoline';
}

function determineCondition(mileage: number): string {
  return mileage > 1000 ? 'Used' : 'New';
}

// Detect if response is a DataDome CAPTCHA page instead of real content
function isCaptchaPage(html: string): boolean {
  return html.length < 2000 && html.includes('captcha-delivery.com');
}

// Fetch a page with full browser headers and retry on 403/CAPTCHA
async function fetchPage(url: string, referer?: string, retries = 4): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const headers: Record<string, string> = {
        ...BROWSER_HEADERS,
        'sec-fetch-site': referer ? 'same-origin' : 'none',
      };
      if (referer) {
        headers['Referer'] = referer;
      }

      const response = await fetch(url, { headers });

      if (response.status === 403 && attempt < retries) {
        console.log(`[Carsforsale] 403 on attempt ${attempt} for ${url}, retrying in ${attempt * 3}s...`);
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} fetching ${url}`);
      }

      const html = await response.text();

      // Check if we got a CAPTCHA page instead of real content
      if (isCaptchaPage(html) && attempt < retries) {
        console.log(`[Carsforsale] CAPTCHA on attempt ${attempt} for ${url}, retrying in ${attempt * 3}s...`);
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }

      if (isCaptchaPage(html)) {
        throw new Error(`DataDome CAPTCHA blocked access to ${url}`);
      }

      return html;
    } catch (err: any) {
      if (attempt === retries) throw err;
      console.log(`[Carsforsale] Fetch error attempt ${attempt}: ${err.message}, retrying...`);
      await new Promise(r => setTimeout(r, attempt * 3000));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

// Parse listing page to extract detail page URLs
function parseListingPage(html: string, baseUrl: string): ListingInfo[] {
  const root = parseHTML(html);
  const listings: ListingInfo[] = [];
  const seenUrls = new Set<string>();

  // Find all /Inventory/Details/{GUID} links
  const links = root.querySelectorAll('a[href*="/Inventory/Details/"]');

  for (const link of links) {
    const href = link.getAttribute('href');
    if (!href) continue;

    const fullUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;

    // Deduplicate — same vehicle may have image + title links
    if (seenUrls.has(fullUrl)) continue;
    seenUrls.add(fullUrl);

    // Extract year/make/model from the link's parent card
    const card = link.closest('[class*="vehicle"], [class*="listing"], [class*="card"]') || link.parentNode;
    const heading = card?.querySelector('h5, h4, h3, h2') || link;
    const yearMakeModel = heading?.text?.trim() || '';

    // Try to get mileage
    let mileage: number | null = null;
    const cardText = card?.text || '';
    const milesMatch = cardText.match(/([\d,]+)\s*(?:miles?|mi\b)/i);
    if (milesMatch) {
      mileage = parseInt(milesMatch[1].replace(/,/g, ''), 10);
    }

    // Thumbnail
    const img = card?.querySelector('img');
    const thumbnailUrl = img?.getAttribute('src') || img?.getAttribute('data-src') || null;

    listings.push({ detailUrl: fullUrl, yearMakeModel, mileage, thumbnailUrl });
  }

  return listings;
}

// Check if there are more pages by parsing "Showing X - Y of Z"
function hasNextPage(html: string, currentPage: number): boolean {
  // Look for "Showing X - Y of Z" pattern
  const showingMatch = html.match(/Showing\s+\D*(\d+)\D+(\d+)\D+of\D+(\d+)/i);
  if (showingMatch) {
    const lastShown = parseInt(showingMatch[2], 10);
    const total = parseInt(showingMatch[3], 10);
    if (lastShown < total) return true;
  }

  // Fallback: look for pagination links with higher page numbers
  const root = parseHTML(html);
  const pageLinks = root.querySelectorAll('.page-link, a[href*="Paging.Page="]');
  for (const link of pageLinks) {
    const href = link.getAttribute('href') || '';
    const pageMatch = href.match(/Paging\.Page=(\d+)/);
    if (pageMatch) {
      const pageNum = parseInt(pageMatch[1], 10);
      if (pageNum > currentPage) return true;
    }
  }

  return false;
}

// Parse detail page HTML using the Chassis/Blazor widget structure
// Specs are in info__label/info__data div pairs with VehicleInfoWidgetCssScope attribute
function parseDetailPage(html: string): VehicleDetail | null {
  const root = parseHTML(html);

  // Extract specs from info__label / info__data pairs
  const specs: Record<string, string> = {};
  const labels = root.querySelectorAll('.info__label');
  for (const label of labels) {
    const key = label.text.trim();
    // The info__data div is the next sibling
    const dataEl = label.nextElementSibling;
    if (dataEl) {
      const val = dataEl.text.trim();
      if (key && val) {
        specs[key.toLowerCase().replace(/#$/, '')] = val;
      }
    }
  }

  // Extract VIN from specs
  const vin = (specs['vin'] || '').toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
  if (!vin || vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    // Fallback: search all text for 17-char VIN pattern
    const fullText = root.text;
    const vinMatch = fullText.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
    if (!vinMatch) return null;
    // Only use if it's not a DataDome hash (those start with hex chars and appear in script tags)
    const candidate = vinMatch[1];
    if (!candidate) return null;
    specs['vin'] = candidate;
  }

  const finalVin = (specs['vin'] || vin).toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
  if (finalVin.length !== 17) return null;

  // Extract mileage from mileage__value span
  let mileage = 0;
  const mileageEl = root.querySelector('.mileage__value');
  if (mileageEl) {
    mileage = parseInt(mileageEl.text.replace(/,/g, ''), 10) || 0;
  }

  // Extract year/make/model from H1 with class veh__title
  let year = 0;
  let make = '';
  let model = '';
  const h1 = root.querySelector('h1.veh__title, h1');
  const h1Text = h1?.text?.trim() || '';
  const ymmMatch = h1Text.match(/(\d{4})\s+(\S+)\s+(.+)/);
  if (ymmMatch) {
    year = parseInt(ymmMatch[1], 10);
    make = ymmMatch[2].trim();
    model = ymmMatch[3].trim();
  }

  // Extract trim from h4.veh__trim or specs
  let trim: string | null = null;
  const trimEl = root.querySelector('h4.veh__trim, .veh__trim');
  if (trimEl) {
    trim = trimEl.text.trim().replace(/\s+SUV$|\s+Sedan$|\s+Truck$|\s+Coupe$|\s+Van$|\s+Wagon$|\s+Hatchback$/i, '').trim() || null;
  }
  if (!trim && specs['trim']) {
    trim = specs['trim'];
  }

  // Extract photos — unique CDN photo hashes, largest available resolution
  const photoUrls: string[] = [];
  const seenHashes = new Set<string>();

  // Dealer favicon/logo hash to exclude
  const faviconHashes = new Set<string>();
  const favicons = root.querySelectorAll('link[rel="icon"]');
  for (const fav of favicons) {
    const href = fav.getAttribute('href') || '';
    const hashMatch = href.match(/carsforsale\.com\/([a-f0-9]{32,})/);
    if (hashMatch) faviconHashes.add(hashMatch[1]);
  }

  // Collect all carsforsale CDN image URLs
  const allImgSrcs: string[] = [];
  const imgElements = root.querySelectorAll('img');
  for (const img of imgElements) {
    for (const attr of ['src', 'data-src']) {
      const val = img.getAttribute(attr);
      if (val && val.includes('carsforsale.com')) allImgSrcs.push(val);
    }
    // Also check srcset
    const srcset = img.getAttribute('srcset');
    if (srcset && srcset.includes('carsforsale.com')) {
      const parts = srcset.split(',');
      for (const part of parts) {
        const url = part.trim().split(' ')[0];
        if (url.includes('carsforsale.com')) allImgSrcs.push(url);
      }
    }
  }

  // Also check source elements with srcset
  const sourceEls = root.querySelectorAll('source[srcset*="carsforsale.com"]');
  for (const el of sourceEls) {
    const srcset = el.getAttribute('srcset') || '';
    const parts = srcset.split(',');
    for (const part of parts) {
      const url = part.trim().split(' ')[0];
      if (url.includes('carsforsale.com')) allImgSrcs.push(url);
    }
  }

  for (const rawUrl of allImgSrcs) {
    // Extract the photo hash (32+ hex chars after carsforsale.com/)
    const hashMatch = rawUrl.match(/carsforsale\.com\/([a-f0-9]{32,})/);
    if (!hashMatch) continue;

    const hash = hashMatch[1];

    // Skip favicon/logo hashes
    if (faviconHashes.has(hash)) continue;

    // Deduplicate by hash — only keep one URL per unique photo
    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);

    // Build highest-resolution URL: use the 640x480 query param version
    // Decode HTML entities in the URL (&amp; -> &)
    let photoUrl = rawUrl.replace(/&amp;/g, '&');
    if (photoUrl.startsWith('//')) photoUrl = `https:${photoUrl}`;

    // If URL has width/height params, bump to largest
    if (photoUrl.includes('width=') && photoUrl.includes('height=')) {
      photoUrl = photoUrl
        .replace(/width=\d+/, 'width=640')
        .replace(/height=\d+/, 'height=480');
    }

    photoUrls.push(photoUrl);
  }

  // Extract MPG from specs — format: "17 City - 23 Hwy / 650 mi"
  let mpgCity: number | null = null;
  let mpgHighway: number | null = null;
  const mpgStr = specs['mpg / max range'] || specs['mpg'] || specs['fuel economy'] || '';
  const mpgMatch = mpgStr.match(/(\d+)\s*City\s*[-–]\s*(\d+)\s*Hwy/i);
  if (mpgMatch) {
    mpgCity = parseInt(mpgMatch[1], 10);
    mpgHighway = parseInt(mpgMatch[2], 10);
  }

  // Vehicle Type from specs as body type
  const vehicleType = specs['vehicle type'] || null;

  return {
    vin: finalVin,
    stockNumber: specs['stock'] || specs['stock#'] || null,
    mileage,
    engine: specs['engine'] || null,
    transmission: specs['transmission'] || null,
    drivetrain: specs['drivetrain'] || null,
    exteriorColor: specs['exterior color'] || specs['color'] || null,
    interiorColor: specs['interior color'] || null,
    fuelType: specs['fuel'] || specs['fuel type'] || null,
    mpgCity,
    mpgHighway,
    photoUrls,
    year,
    make,
    model,
    trim,
    bodyType: vehicleType,
    doors: null,
  };
}

// Discover all vehicle detail URLs by paginating through listing pages
async function discoverAllVehicles(baseUrl: string): Promise<ListingInfo[]> {
  const allListings: ListingInfo[] = [];
  const seenUrls = new Set<string>();
  let page = 1;
  const maxPages = 10; // Safety limit

  while (page <= maxPages) {
    const pageUrl = `${baseUrl}/cars-for-sale?Paging.Page=${page}&Sorting.Column=0&Sorting.Direction=1`;
    console.log(`[Carsforsale] Fetching listing page ${page}: ${pageUrl}`);

    const html = await fetchPage(pageUrl);
    const listings = parseListingPage(html, baseUrl);

    if (listings.length === 0) {
      console.log(`[Carsforsale] No listings found on page ${page}, stopping pagination`);
      break;
    }

    let newCount = 0;
    for (const listing of listings) {
      if (!seenUrls.has(listing.detailUrl)) {
        seenUrls.add(listing.detailUrl);
        allListings.push(listing);
        newCount++;
      }
    }

    console.log(`[Carsforsale] Page ${page}: found ${listings.length} listings (${newCount} new)`);

    if (newCount === 0 || !hasNextPage(html, page)) {
      break;
    }

    page++;
    await new Promise(r => setTimeout(r, PAGE_FETCH_DELAY_MS));
  }

  return allListings;
}

// Download images and upload to Vercel Blob
async function processVehiclePhotos(photoUrls: string[], vin: string): Promise<string> {
  if (photoUrls.length === 0) return '[]';

  try {
    const uploadedUrls = await uploadVehiclePhotos(photoUrls, vin, true);
    return JSON.stringify(uploadedUrls);
  } catch (error) {
    console.error(`[Carsforsale] Failed to upload photos for ${vin}:`, error);
    return JSON.stringify(photoUrls);
  }
}

function getCoordinatesForDealer(city: string, state: string): { latitude: number; longitude: number } {
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    'phenix city-al': { lat: 32.4710, lng: -85.0008 },
    'dubuque-ia': { lat: 42.5006, lng: -90.6646 },
    'tampa-fl': { lat: 27.9506, lng: -82.4572 },
    'madison-wi': { lat: 43.0731, lng: -89.4012 },
  };

  const key = `${city.toLowerCase()}-${state.toLowerCase()}`;
  const coords = cityCoords[key];
  return coords
    ? { latitude: coords.lat, longitude: coords.lng }
    : { latitude: 39.8283, longitude: -98.5795 };
}

export async function syncCarsforsaleInventory(dealerId: string): Promise<SyncResult> {
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
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        businessName: true,
        city: true,
        state: true,
        inventoryFeedUrl: true,
        inventoryFeedType: true,
      },
    });

    if (!dealer) throw new Error(`Dealer not found: ${dealerId}`);
    if (!dealer.inventoryFeedUrl) throw new Error(`Dealer ${dealer.businessName} has no inventory feed URL configured`);
    if (dealer.inventoryFeedType !== 'carsforsale') throw new Error(`Dealer ${dealer.businessName} is not configured for Carsforsale sync`);

    const baseUrl = dealer.inventoryFeedUrl.replace(/\/$/, '');
    result.feedId = baseUrl;
    const coords = getCoordinatesForDealer(dealer.city || '', dealer.state || '');

    // Step 1: Discover all vehicle detail URLs from listing pages
    console.log(`[Carsforsale] Discovering vehicles from ${baseUrl}...`);
    const listings = await discoverAllVehicles(baseUrl);
    console.log(`[Carsforsale] Discovered ${listings.length} vehicle detail URLs`);

    if (listings.length === 0) {
      throw new Error('No vehicles found on listing pages');
    }

    // Get existing VINs for this dealer FIRST so we can skip known vehicles
    const existingCars = await prisma.car.findMany({
      where: { dealerId },
      select: { id: true, vin: true, seoDescriptionGenerated: true },
    });
    const existingVinMap = new Map(existingCars.map(c => [c.vin, { id: c.id, seoDescriptionGenerated: c.seoDescriptionGenerated }]));
    const feedVins = new Set<string>();

    console.log(`[Carsforsale] ${existingVinMap.size} existing vehicles in our system`);

    // Step 2: Visit each detail page, extract VIN only.
    // If VIN already exists in our system, SKIP entirely.
    // Only do full processing (photos, SEO, VIN decode) for NEW vehicles.
    // Use minimal delay (200ms) for existing VIN checks, full delay only for new vehicles.
    const newVehicles: VehicleDetail[] = [];
    const listingPageUrl = `${baseUrl}/cars-for-sale`;

    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      try {
        const html = await fetchPage(listing.detailUrl, listingPageUrl);
        const detail = parseDetailPage(html);

        if (!detail) {
          console.warn(`[Carsforsale] No VIN found on ${listing.detailUrl}, skipping`);
          continue;
        }

        // Track this VIN as active in the feed (for sold detection)
        feedVins.add(detail.vin);

        // If we already have this VIN, skip everything else
        if (existingVinMap.has(detail.vin)) {
          result.updated++;
          // Minimal delay for existing vehicles
          if (i < listings.length - 1) {
            await new Promise(r => setTimeout(r, 200));
          }
          continue;
        }

        // New vehicle — collect for full processing
        if (detail.mileage === 0 && listing.mileage) {
          detail.mileage = listing.mileage;
        }

        newVehicles.push(detail);
        console.log(`[Carsforsale] NEW vehicle: ${detail.vin} — ${detail.year} ${detail.make} ${detail.model}`);
      } catch (err: any) {
        result.errors.push(`Detail page ${listing.detailUrl}: ${err.message}`);
      }

      // Full rate limit delay only between new vehicle detail page fetches
      if (i < listings.length - 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    result.totalInFeed = feedVins.size;
    console.log(`[Carsforsale] ${feedVins.size} vehicles in feed, ${newVehicles.length} are NEW`);

    // Step 3: Decode VINs via NHTSA for NEW vehicles only
    for (const vehicle of newVehicles) {
      try {
        const decoded = await decodeVin(vehicle.vin);
        if (decoded) {
          vehicle.year = decoded.year || vehicle.year;
          vehicle.make = decoded.make || vehicle.make;
          vehicle.model = decoded.model || vehicle.model;
          vehicle.trim = decoded.trim || vehicle.trim;
          vehicle.bodyType = decoded.bodyType || vehicle.bodyType;
          vehicle.drivetrain = decoded.drivetrain || vehicle.drivetrain;
          vehicle.fuelType = decoded.fuelType || vehicle.fuelType;
          vehicle.engine = decoded.engine || vehicle.engine;
          vehicle.transmission = decoded.transmission || vehicle.transmission;
          vehicle.doors = decoded.doors || vehicle.doors;
        }
      } catch (err: any) {
        console.warn(`[Carsforsale] VIN decode failed for ${vehicle.vin}: ${err.message}`);
      }
    }

    // Step 4: Create NEW vehicles only
    for (const vehicle of newVehicles) {
      try {
        if (!vehicle.year || !vehicle.make || !vehicle.model) {
          result.errors.push(`VIN ${vehicle.vin}: Missing year/make/model, skipping`);
          continue;
        }

        console.log(`[Carsforsale] Processing photos for ${vehicle.vin}...`);
        const photos = await processVehiclePhotos(vehicle.photoUrls, vehicle.vin);

        const carData = {
          dealerId,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          color: (vehicle.exteriorColor || 'Unknown').trim(),
          transmission: (vehicle.transmission || 'Automatic').trim(),
          salePrice: 0,
          description: '',
          photos,
          latitude: coords.latitude,
          longitude: coords.longitude,
          city: (dealer.city || '').trim(),
          state: (dealer.state || '').trim(),
          status: 'active',
          bodyType: vehicle.bodyType || null,
          trim: vehicle.trim || null,
          drivetrain: vehicle.drivetrain || null,
          engine: vehicle.engine || null,
          condition: determineCondition(vehicle.mileage),
          fuelType: vehicle.fuelType || inferFuelType(vehicle.engine || '', vehicle.model),
          slug: generateSlug(vehicle.vin, vehicle.year, vehicle.make, vehicle.model, dealer.city || '', dealer.state || ''),
          interiorColor: vehicle.interiorColor || null,
          mpgCity: vehicle.mpgCity || null,
          mpgHighway: vehicle.mpgHighway || null,
          doors: vehicle.doors || null,
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
            console.log(`[Carsforsale] SEO description generated for ${vehicle.vin}`);
          }
        } catch (seoErr: any) {
          console.error(`[Carsforsale] SEO generation failed for ${vehicle.vin}:`, seoErr.message);
        }
        await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
      } catch (err: any) {
        result.errors.push(`VIN ${vehicle.vin}: ${err.message}`);
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

    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: 'success',
        lastSyncMessage: `Synced ${result.totalInFeed} vehicles: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`,
      },
    });

    result.success = true;
    console.log(`[Carsforsale] Sync completed: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`);

  } catch (err: any) {
    console.error('[Carsforsale] Sync error:', err);
    result.errors.push(err.message);

    try {
      await prisma.user.update({
        where: { id: dealerId },
        data: { lastSyncAt: new Date(), lastSyncStatus: 'failed', lastSyncMessage: err.message },
      });
    } catch (updateErr) {
      console.error('[Carsforsale] Failed to update sync status:', updateErr);
    }
  } finally {
    result.duration = Date.now() - startTime;
  }

  return result;
}
