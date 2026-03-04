import { prisma } from '@/lib/prisma';
import { uploadVehiclePhotos } from '@/lib/sync/photo-uploader';
import { generateSEODescription, isValidSEODescription } from '@/lib/seo/generate-description';
import { decodeVin } from '@/lib/sync/vin-decoder';

const SEO_DELAY_MS = 1500;
const PAGE_FETCH_DELAY_MS = 1500;

// Full browser headers to bypass Akamai + PerimeterX bot protection
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

const API_HEADERS: Record<string, string> = {
  'User-Agent': BROWSER_HEADERS['User-Agent'],
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Content-Type': 'application/json',
  'sec-ch-ua': BROWSER_HEADERS['sec-ch-ua'],
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
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

interface SRPVehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  bodyStyle: string | null;
  stockNumber: string | null;
  type: string; // 'new', 'used'
  certified: boolean;
  condition: string;
  link: string; // VDP URL path
  // From trackingAttributes
  engine: string | null;
  engineSize: string | null;
  transmission: string | null;
  drivetrain: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  fuelType: string | null;
  odometer: number;
  doors: number | null;
  mpgCity: number | null;
  mpgHighway: number | null;
  // From trackingPricing
  askingPrice: number;
  msrp: number | null;
  // Primary image from SRP
  primaryImageUrl: string | null;
}

interface DealerComVehicle extends SRPVehicle {
  photoUrls: string[];
  features: string[];
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

// Detect bot-protection block pages
function isBlockedPage(html: string): boolean {
  return (html.length < 3000 && (html.includes('captcha-delivery.com') || html.includes('Access Denied') || html.includes('_pxCaptcha')));
}

// Fetch a VDP page with full browser headers and retry on 403/block
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
        console.log(`[DealerCom] 403 on attempt ${attempt} for ${url}, retrying in ${attempt * 3}s...`);
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} fetching ${url}`);
      }

      const html = await response.text();

      if (isBlockedPage(html) && attempt < retries) {
        console.log(`[DealerCom] Blocked on attempt ${attempt} for ${url}, retrying in ${attempt * 3}s...`);
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }

      if (isBlockedPage(html)) {
        throw new Error(`Bot protection blocked access to ${url}`);
      }

      return html;
    } catch (err: any) {
      if (attempt === retries) throw err;
      console.log(`[DealerCom] Fetch error attempt ${attempt}: ${err.message}, retrying...`);
      await new Promise(r => setTimeout(r, attempt * 3000));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

/**
 * Extract JSON from a DDC.WS.state assignment using bracket-counting.
 * DDC.WS.state uses single-quoted bracket notation:
 *   DDC.WS.state['ws-quick-specs']['instance-id'] = { ... };
 */
function extractWidgetStates(html: string, widgetName: string): any[] {
  const results: any[] = [];
  const pattern = `DDC.WS.state['${widgetName}']`;
  let searchFrom = 0;

  while (true) {
    const idx = html.indexOf(pattern, searchFrom);
    if (idx === -1) break;

    const eqIdx = html.indexOf('=', idx + pattern.length);
    if (eqIdx === -1) { searchFrom = idx + 1; continue; }

    const braceStart = html.indexOf('{', eqIdx);
    if (braceStart === -1) { searchFrom = idx + 1; continue; }

    let depth = 0;
    let i = braceStart;
    let inString = false;
    let escapeNext = false;

    for (; i < html.length; i++) {
      const ch = html[i];
      if (escapeNext) { escapeNext = false; continue; }
      if (ch === '\\' && inString) { escapeNext = true; continue; }
      if (ch === '"' && !escapeNext) { inString = !inString; continue; }
      if (!inString) {
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) break; }
      }
    }

    if (depth !== 0) { searchFrom = idx + 1; continue; }

    const jsonStr = html.substring(braceStart, i + 1);
    try {
      results.push(JSON.parse(jsonStr));
    } catch {
      // JSON parse failed — skip
    }

    searchFrom = i + 1;
  }

  return results;
}

// ── SRP API: Discover all vehicles via DDC's inventory API ──

interface InventoryConfig {
  pageAlias: string;
  listingConfigId: string;
  label: string; // 'new' | 'used'
}

const INVENTORY_CONFIGS: InventoryConfig[] = [
  { pageAlias: 'INVENTORY_LISTING_DEFAULT_AUTO_NEW', listingConfigId: 'auto-new', label: 'new' },
  { pageAlias: 'INVENTORY_LISTING_DEFAULT_AUTO_USED', listingConfigId: 'auto-used', label: 'used' },
];

function extractTrackingAttr(vehicle: any, name: string): string | null {
  const attr = vehicle.trackingAttributes?.find((a: any) => a.name === name);
  return attr?.value ?? attr?.normalizedValue ?? null;
}

function parseSRPVehicle(v: any): SRPVehicle | null {
  const vin = (v.vin || '').toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
  if (vin.length !== 17) return null;

  const pricing = v.trackingPricing || {};
  const msrpStr = pricing.msrp || pricing.retailValue || '0';
  const msrpVal = parseInt(String(msrpStr).replace(/[^0-9]/g, ''), 10) || 0;

  // Pick the best consumer-facing price: collect all non-zero price fields,
  // then use the lowest one (e.g. internetPrice reflects rebates/discounts
  // and is lower than askingPrice which is the pre-rebate sticker price).
  const priceFields = ['internetPrice', 'salePrice', 'askingPrice'];
  const candidatePrices = priceFields
    .map(f => parseInt(String(pricing[f] || '0').replace(/[^0-9]/g, ''), 10) || 0)
    .filter(p => p > 0);
  const askingPrice = candidatePrices.length > 0 ? Math.min(...candidatePrices) : 0;

  const odometerStr = extractTrackingAttr(v, 'odometer');
  const odometer = odometerStr ? parseInt(odometerStr.replace(/,/g, ''), 10) || 0 : 0;

  const doorsStr = extractTrackingAttr(v, 'doors');
  const doors = doorsStr ? parseInt(doorsStr, 10) || null : null;

  const mpgCityStr = extractTrackingAttr(v, 'cityFuelEconomy');
  const mpgCity = mpgCityStr ? Math.round(parseFloat(mpgCityStr)) || null : null;

  const mpgHwyStr = extractTrackingAttr(v, 'highwayFuelEconomy');
  const mpgHighway = mpgHwyStr ? Math.round(parseFloat(mpgHwyStr)) || null : null;

  // Engine: combine engineSize + engine description from attributes
  const engineAttr = v.attributes?.find((a: any) => a.name === 'engine');
  const engineDesc = engineAttr?.value || extractTrackingAttr(v, 'engine') || null;

  const primaryImage = v.images?.[0]?.uri || null;

  const type = (v.type || 'used').toLowerCase();

  return {
    vin,
    year: v.year || 0,
    make: v.make || '',
    model: v.model || '',
    trim: v.trim || null,
    bodyStyle: v.bodyStyle || null,
    stockNumber: v.stockNumber || null,
    type,
    certified: v.certified === true,
    condition: v.condition || (type === 'new' ? 'New' : 'Used'),
    link: v.link || '',
    engine: engineDesc,
    engineSize: extractTrackingAttr(v, 'engineSize'),
    transmission: extractTrackingAttr(v, 'transmission'),
    drivetrain: extractTrackingAttr(v, 'driveLine'),
    exteriorColor: extractTrackingAttr(v, 'exteriorColor'),
    interiorColor: extractTrackingAttr(v, 'interiorColor'),
    fuelType: v.fuelType || extractTrackingAttr(v, 'normalFuelType') || null,
    odometer,
    doors,
    mpgCity,
    mpgHighway,
    askingPrice,
    msrp: msrpVal > 0 ? msrpVal : null,
    primaryImageUrl: primaryImage,
  };
}

async function fetchInventoryAPI(baseUrl: string, config: InventoryConfig, pageStart: number = 0): Promise<{ vehicles: any[]; totalCount: number }> {
  const body = {
    siteId: 'timberhaywardfordfd',
    locale: 'en_US',
    device: 'DESKTOP',
    pageAlias: config.pageAlias,
    pageId: `v9_INVENTORY_SEARCH_RESULTS_AUTO_${config.label.toUpperCase()}_V1_1`,
    windowId: 'inventory-data-bus2',
    widgetName: 'ws-inv-data',
    inventoryParameters: pageStart > 0 ? { start: String(pageStart) } : {},
    preferences: {
      pageSize: '100',
      'listing.config.id': config.listingConfigId,
      'listing.boost.order': 'account,make,model,bodyStyle,trim,optionCodes,modelCode,fuelType',
      removeEmptyFacets: 'true',
      removeEmptyConstraints: 'true',
      'required.display.sets': 'TITLE,IMAGE_ALT,IMAGE_TITLE,PRICE,FEATURED_ITEMS,CALLOUT,LISTING,HIGHLIGHTED_ATTRIBUTES,SUPPLEMENTAL_TITLE',
      'required.display.attributes': 'accountCity,accountCountry,accountId,accountName,accountState,accountZipcode,askingPrice,attributes,bodyStyle,cab,certified,cityMpg,classification,classificationName,comments,doors,driveLine,engine,engineSize,equipment,exteriorColor,fuelType,highwayMpg,id,interiorColor,internetPrice,inventoryDate,invoicePrice,key,location,make,mileage,model,modelCode,msrp,normalExteriorColor,normalFuelType,normalInteriorColor,odometer,optionCodes,options,packages_internal,primary_image,retailValue,salePrice,status,stockNumber,transmission,trim,trimLevel,type,uuid,vin,wholesalePrice,year,cpoTier',
      showFranchiseVehiclesOnly: 'true',
    },
    includePricing: true,
  };

  const headers: Record<string, string> = {
    ...API_HEADERS,
    'Origin': baseUrl,
    'Referer': `${baseUrl}/${config.label}-inventory/index.htm`,
  };

  const res = await fetch(`${baseUrl}/api/widget/ws-inv-data/getInventory`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Inventory API returned ${res.status}`);
  }

  const data = await res.json();
  return {
    vehicles: data.inventory || [],
    totalCount: data.pageInfo?.totalCount || 0,
  };
}

async function discoverAllVehiclesViaAPI(baseUrl: string): Promise<SRPVehicle[]> {
  const allVehicles: SRPVehicle[] = [];
  const seenVins = new Set<string>();

  for (const config of INVENTORY_CONFIGS) {
    let pageStart = 0;
    const PAGE_SIZE = 100;
    const MAX_PAGES = 10;

    for (let page = 0; page < MAX_PAGES; page++) {
      console.log(`[DealerCom] Fetching ${config.label} inventory API (start=${pageStart})...`);

      try {
        const { vehicles, totalCount } = await fetchInventoryAPI(baseUrl, config, pageStart);
        console.log(`[DealerCom] ${config.label} API: ${vehicles.length} vehicles (total: ${totalCount})`);

        if (vehicles.length === 0) break;

        let newCount = 0;
        for (const v of vehicles) {
          const parsed = parseSRPVehicle(v);
          if (!parsed) continue;
          if (seenVins.has(parsed.vin)) continue;
          seenVins.add(parsed.vin);
          allVehicles.push(parsed);
          newCount++;
        }

        console.log(`[DealerCom] ${config.label} API: ${newCount} new vehicles added`);

        // Check if there are more pages
        if (pageStart + vehicles.length >= totalCount) break;

        pageStart += PAGE_SIZE;
        await new Promise(r => setTimeout(r, 500));
      } catch (err: any) {
        console.error(`[DealerCom] ${config.label} API error: ${err.message}`);
        break;
      }
    }
  }

  return allVehicles;
}

// ── VDP Page: Extract features + photos ──

function enrichFromVDP(html: string, vehicle: SRPVehicle): DealerComVehicle {
  const photoUrls: string[] = [];
  const features: string[] = [];
  const seenPhotoUrls = new Set<string>();
  const seenFeatures = new Set<string>();

  // Photos from ws-vehicle-gallery → media.images[]
  const galleryStates = extractWidgetStates(html, 'ws-vehicle-gallery');
  for (const state of galleryStates) {
    if (state.media?.images && Array.isArray(state.media.images)) {
      for (const img of state.media.images) {
        const src = img.src || img.uri || img.url;
        if (src && !seenPhotoUrls.has(src)) {
          seenPhotoUrls.add(src);
          photoUrls.push(src);
        }
      }
    }
  }

  // Fallback: scan HTML for pictures.dealer.com/t/timberhaywardfordfd URLs
  if (photoUrls.length === 0) {
    const picPattern = /https?:\/\/pictures\.dealer\.com\/t\/timberhaywardfordfd\/[^\s"'<>]+x\.jpg/gi;
    const matches = html.match(picPattern) || [];
    for (const url of matches) {
      const cleanUrl = url.replace(/\?.*$/, '');
      if (!cleanUrl.includes('thumb_') && !seenPhotoUrls.has(cleanUrl)) {
        seenPhotoUrls.add(cleanUrl);
        photoUrls.push(cleanUrl);
      }
    }
  }

  // If still no photos, use the SRP primary image
  if (photoUrls.length === 0 && vehicle.primaryImageUrl) {
    photoUrls.push(vehicle.primaryImageUrl);
  }

  // Features from ws-detailed-specs → equipment.specification[]
  const specStates = extractWidgetStates(html, 'ws-detailed-specs');
  for (const state of specStates) {
    if (state.equipment?.specification && Array.isArray(state.equipment.specification)) {
      for (const spec of state.equipment.specification) {
        const desc = spec.spec?.description || spec.description || spec.name;
        if (desc && typeof desc === 'string') {
          const trimmed = desc.trim();
          if (trimmed && !seenFeatures.has(trimmed.toLowerCase())) {
            seenFeatures.add(trimmed.toLowerCase());
            features.push(trimmed);
          }
        }
      }
    }
  }

  // Options from ws-packages-options → options[]
  const pkgStates = extractWidgetStates(html, 'ws-packages-options');
  for (const state of pkgStates) {
    if (state.options && Array.isArray(state.options)) {
      for (const opt of state.options) {
        const name = opt.name || opt.description || opt.label;
        if (name && typeof name === 'string') {
          const trimmed = name.trim();
          if (trimmed && !seenFeatures.has(trimmed.toLowerCase())) {
            seenFeatures.add(trimmed.toLowerCase());
            features.push(trimmed);
          }
        }
      }
    }
    if (state.packages && Array.isArray(state.packages)) {
      for (const pkg of state.packages) {
        const name = pkg.name || pkg.description || pkg.label;
        if (name && typeof name === 'string') {
          const trimmed = name.trim();
          if (trimmed && !seenFeatures.has(trimmed.toLowerCase())) {
            seenFeatures.add(trimmed.toLowerCase());
            features.push(trimmed);
          }
        }
      }
    }
  }

  // Extract best consumer price from VDP. The SRP API gives the pre-rebate
  // asking price, but the VDP page embeds a dprice array with a final price
  // entry marked "isFinalPrice":true (e.g. "Price After Rebates").
  // We use that when available and sane (>50% of asking to avoid rebate amounts).
  let bestPrice = vehicle.askingPrice;
  const priceFloor = vehicle.askingPrice > 0 ? vehicle.askingPrice * 0.5 : 2000;

  const finalPriceMatch = html.match(/"value"\s*:\s*"\$\s*([\d,]+)"\s*,\s*"isFinalPrice"\s*:\s*true/);
  if (finalPriceMatch) {
    const finalPrice = parseInt(finalPriceMatch[1].replace(/,/g, ''), 10);
    if (finalPrice >= priceFloor && finalPrice < bestPrice) {
      bestPrice = finalPrice;
    }
  }

  return {
    ...vehicle,
    askingPrice: bestPrice,
    photoUrls,
    features,
  };
}

// Download images and upload to Vercel Blob
async function processVehiclePhotos(photoUrls: string[], vin: string): Promise<string> {
  if (photoUrls.length === 0) return '[]';

  try {
    const uploadedUrls = await uploadVehiclePhotos(photoUrls, vin, true);
    return JSON.stringify(uploadedUrls);
  } catch (error) {
    console.error(`[DealerCom] Failed to upload photos for ${vin}:`, error);
    return JSON.stringify(photoUrls);
  }
}

export async function syncDealerComInventory(dealerId: string): Promise<SyncResult> {
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
    if (dealer.inventoryFeedType !== 'dealer-com') throw new Error(`Dealer ${dealer.businessName} is not configured for Dealer.com sync`);

    const baseUrl = dealer.inventoryFeedUrl.replace(/\/$/, '');
    result.feedId = baseUrl;

    // Step 1: Discover all vehicles via DDC inventory API
    console.log(`[DealerCom] Discovering vehicles from ${baseUrl} via API...`);
    const srpVehicles = await discoverAllVehiclesViaAPI(baseUrl);
    console.log(`[DealerCom] Discovered ${srpVehicles.length} unique vehicles via API`);

    if (srpVehicles.length === 0) {
      throw new Error('No vehicles found via inventory API');
    }

    // Step 2: Visit each VDP for photos + features
    const vehicles: DealerComVehicle[] = [];

    for (let i = 0; i < srpVehicles.length; i++) {
      const srpVehicle = srpVehicles[i];
      try {
        const vdpUrl = srpVehicle.link.startsWith('http')
          ? srpVehicle.link
          : `${baseUrl}${srpVehicle.link}`;

        console.log(`[DealerCom] Fetching VDP ${i + 1}/${srpVehicles.length}: ${srpVehicle.year} ${srpVehicle.make} ${srpVehicle.model} (${srpVehicle.vin})`);
        const html = await fetchPage(vdpUrl, `${baseUrl}/used-inventory/index.htm`);
        const enriched = enrichFromVDP(html, srpVehicle);

        vehicles.push(enriched);
        console.log(`[DealerCom]   -> ${enriched.photoUrls.length} photos, ${enriched.features.length} features, $${enriched.askingPrice}`);
      } catch (err: any) {
        // If VDP fails, still use SRP data with primary image only
        console.warn(`[DealerCom] VDP failed for ${srpVehicle.vin}: ${err.message}, using SRP data`);
        vehicles.push({
          ...srpVehicle,
          photoUrls: srpVehicle.primaryImageUrl ? [srpVehicle.primaryImageUrl] : [],
          features: [],
        });
        result.errors.push(`VDP ${srpVehicle.vin}: ${err.message}`);
      }

      if (i < srpVehicles.length - 1) {
        await new Promise(r => setTimeout(r, PAGE_FETCH_DELAY_MS));
      }
    }

    result.totalInFeed = vehicles.length;
    console.log(`[DealerCom] Processed ${vehicles.length} vehicles`);

    // Step 3: VIN decode via NHTSA to supplement scraped data
    for (const vehicle of vehicles) {
      try {
        const decoded = await decodeVin(vehicle.vin);
        if (decoded) {
          vehicle.year = decoded.year || vehicle.year;
          vehicle.make = decoded.make || vehicle.make;
          vehicle.model = decoded.model || vehicle.model;
          vehicle.trim = decoded.trim || vehicle.trim;
          vehicle.bodyStyle = decoded.bodyType || vehicle.bodyStyle;
          vehicle.drivetrain = decoded.drivetrain || vehicle.drivetrain;
          vehicle.fuelType = decoded.fuelType || vehicle.fuelType;
          vehicle.engine = decoded.engine || vehicle.engine;
          vehicle.transmission = decoded.transmission || vehicle.transmission;
          vehicle.doors = decoded.doors || vehicle.doors;
        }
      } catch (err: any) {
        console.warn(`[DealerCom] VIN decode failed for ${vehicle.vin}: ${err.message}`);
      }
    }

    // Get existing VINs for this dealer
    const existingCars = await prisma.car.findMany({
      where: { dealerId },
      select: { id: true, vin: true, seoDescriptionGenerated: true },
    });
    const existingVinMap = new Map(existingCars.map(c => [c.vin, { id: c.id, seoDescriptionGenerated: c.seoDescriptionGenerated }]));
    const feedVins = new Set(vehicles.map(v => v.vin));

    // Default location for this dealer
    const defaultCity = 'Hayward';
    const defaultState = 'WI';
    const defaultLat = 45.9856;
    const defaultLng = -91.5366;

    // Step 4: Upsert vehicles
    for (const vehicle of vehicles) {
      try {
        if (!vehicle.year || !vehicle.make || !vehicle.model) {
          result.errors.push(`VIN ${vehicle.vin}: Missing year/make/model, skipping`);
          continue;
        }

        console.log(`[DealerCom] Processing photos for ${vehicle.vin}...`);
        const photos = await processVehiclePhotos(vehicle.photoUrls, vehicle.vin);

        const vCity = dealer.city || defaultCity;
        const vState = dealer.state || defaultState;

        const carData = {
          dealerId,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.odometer,
          color: (vehicle.exteriorColor || 'Unknown').trim(),
          transmission: (vehicle.transmission || 'Automatic').trim(),
          salePrice: vehicle.askingPrice,
          msrp: vehicle.msrp,
          description: '',
          photos,
          latitude: defaultLat,
          longitude: defaultLng,
          city: vCity.trim(),
          state: vState.trim(),
          status: 'active',
          bodyType: vehicle.bodyStyle || null,
          trim: vehicle.trim || null,
          drivetrain: vehicle.drivetrain || null,
          engine: vehicle.engine || null,
          condition: vehicle.condition,
          certified: vehicle.certified,
          fuelType: vehicle.fuelType || inferFuelType(vehicle.engine || '', vehicle.model),
          slug: generateSlug(vehicle.vin, vehicle.year, vehicle.make, vehicle.model, vCity, vState),
          interiorColor: vehicle.interiorColor || null,
          mpgCity: vehicle.mpgCity || null,
          mpgHighway: vehicle.mpgHighway || null,
          doors: vehicle.doors || null,
          features: vehicle.features.length > 0 ? JSON.stringify(vehicle.features) : null,
        };

        let carId: string;
        let needsSEO = false;

        if (existingVinMap.has(vehicle.vin)) {
          const existing = existingVinMap.get(vehicle.vin)!;
          carId = existing.id;
          const updateData = { ...carData };
          if (existing.seoDescriptionGenerated) {
            delete (updateData as any).description;
          } else {
            needsSEO = true;
          }
          await prisma.car.update({ where: { id: existing.id }, data: updateData });
          result.updated++;
        } else {
          const created = await prisma.car.create({ data: carData });
          carId = created.id;
          needsSEO = true;
          result.created++;
        }

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
              console.log(`[DealerCom] SEO description generated for ${vehicle.vin}`);
            }
          } catch (seoErr: any) {
            console.error(`[DealerCom] SEO generation failed for ${vehicle.vin}:`, seoErr.message);
          }
          await new Promise(resolve => setTimeout(resolve, SEO_DELAY_MS));
        }
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
    console.log(`[DealerCom] Sync completed: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`);

  } catch (err: any) {
    console.error('[DealerCom] Sync error:', err);
    result.errors.push(err.message);

    try {
      await prisma.user.update({
        where: { id: dealerId },
        data: { lastSyncAt: new Date(), lastSyncStatus: 'failed', lastSyncMessage: err.message },
      });
    } catch (updateErr) {
      console.error('[DealerCom] Failed to update sync status:', updateErr);
    }
  } finally {
    result.duration = Date.now() - startTime;
  }

  return result;
}
