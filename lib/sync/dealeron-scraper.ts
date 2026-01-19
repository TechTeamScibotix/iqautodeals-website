/**
 * DealerOn Inventory Scraper
 * Scrapes vehicle inventory from DealerOn-powered dealer websites
 */

import { cleanPhotoUrl } from './photo-uploader';

export interface ScrapedVehicle {
  vin: string;
  price: number;
  mileage: number;
  color: string;
  photoUrls: string[];
  detailUrl: string;
  // These may be provided by the page or decoded from VIN
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  transmission?: string;
  description?: string;
  fuelType?: string;
}

export interface ScrapeResult {
  success: boolean;
  vehicles: ScrapedVehicle[];
  error?: string;
  totalFound: number;
}

/**
 * Scrape inventory from a DealerOn website
 * Uses sitemap.xml to find all vehicle URLs, then fetches details from each page
 */
export async function scrapeDealerOnInventory(
  baseUrl: string,
  inventoryType: 'used' | 'new' | 'all' = 'used'
): Promise<ScrapeResult> {
  try {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    console.log(`Scraping DealerOn inventory from: ${cleanBaseUrl}`);

    // First, try to get vehicle URLs from sitemap
    const vehicleUrls = await getVehicleUrlsFromSitemap(cleanBaseUrl, inventoryType);

    if (vehicleUrls.length > 0) {
      console.log(`Found ${vehicleUrls.length} vehicle URLs from sitemap`);

      // Fetch details for each vehicle
      const vehicles = await fetchVehicleDetails(vehicleUrls, cleanBaseUrl);

      // Fetch mileage and color from DataLayer API
      const vins = vehicles.map((v) => v.vin);
      const dataMap = await fetchVehicleDataFromDataLayer(cleanBaseUrl, vins);

      // Update vehicles with mileage and color data
      for (const vehicle of vehicles) {
        const data = dataMap.get(vehicle.vin);
        if (data) {
          if (data.mileage > 0) {
            vehicle.mileage = data.mileage;
          }
          // Only use valid color values
          if (data.color && data.color !== 'Unknown' && data.color !== 'Content') {
            vehicle.color = data.color;
          }
        }
      }

      return {
        success: true,
        vehicles,
        totalFound: vehicles.length,
      };
    }

    // Fallback: scrape from inventory page HTML
    console.log('No sitemap vehicles found, falling back to HTML scraping...');

    const pathMap = {
      used: '/searchused.aspx',
      new: '/searchnew.aspx',
      all: '/searchall.aspx',
    };

    const inventoryUrl = `${cleanBaseUrl}${pathMap[inventoryType]}`;
    const response = await fetch(inventoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        vehicles: [],
        error: `Failed to fetch inventory page: ${response.status}`,
        totalFound: 0,
      };
    }

    const html = await response.text();
    const vehicles = parseDealerOnHtml(html, cleanBaseUrl);
    const detailedVehicles = await enrichVehicleDetails(vehicles, cleanBaseUrl);

    return {
      success: true,
      vehicles: detailedVehicles,
      totalFound: detailedVehicles.length,
    };
  } catch (error) {
    console.error('Error scraping DealerOn inventory:', error);
    return {
      success: false,
      vehicles: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      totalFound: 0,
    };
  }
}

/**
 * Get vehicle URLs from sitemap page
 * DealerOn serves an HTML sitemap at /sitemap.xml with URLs like: /used-City-YEAR-MAKE-MODEL-VIN
 */
async function getVehicleUrlsFromSitemap(
  baseUrl: string,
  inventoryType: 'used' | 'new' | 'all'
): Promise<string[]> {
  try {
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    console.log(`Fetching sitemap: ${sitemapUrl}`);

    const response = await fetch(sitemapUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });

    if (!response.ok) {
      console.log(`Sitemap not found: ${response.status}`);
      return [];
    }

    const content = await response.text();
    const urls: string[] = [];

    // DealerOn serves HTML sitemap, not XML - look for href links
    // Pattern: /used-City-YEAR-MAKE-MODEL-VIN or /new-City-...
    const hrefPattern = /href="([^"]*(?:used-|new-)[^"]*[A-HJ-NPR-Z0-9]{17})"/gi;
    let match;

    while ((match = hrefPattern.exec(content)) !== null) {
      let url = match[1];

      // Decode HTML entities (&#x2B; -> +, etc.)
      url = url.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      url = url.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
      url = url.replace(/&amp;/g, '&');

      // Make absolute URL
      if (url.startsWith('/')) {
        url = baseUrl + url;
      } else if (!url.startsWith('http')) {
        url = baseUrl + '/' + url;
      }

      // Filter by inventory type
      const isUsed = url.includes('/used-');
      const isNew = url.includes('/new-');

      if (inventoryType === 'all' && (isUsed || isNew)) {
        urls.push(url);
      } else if (inventoryType === 'used' && isUsed) {
        urls.push(url);
      } else if (inventoryType === 'new' && isNew) {
        urls.push(url);
      }
    }

    // Also try XML format in case it's actually XML
    if (urls.length === 0) {
      const xmlPattern = /<loc>([^<]+)<\/loc>/gi;
      while ((match = xmlPattern.exec(content)) !== null) {
        const url = match[1];
        const isUsed = url.includes('/used-');
        const isNew = url.includes('/new-');
        const hasVin = /[A-HJ-NPR-Z0-9]{17}$/i.test(url);

        if (!hasVin) continue;

        if (inventoryType === 'all' && (isUsed || isNew)) {
          urls.push(url);
        } else if (inventoryType === 'used' && isUsed) {
          urls.push(url);
        } else if (inventoryType === 'new' && isNew) {
          urls.push(url);
        }
      }
    }

    // Deduplicate
    return [...new Set(urls)];
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    return [];
  }
}

/**
 * Fetch vehicle details from individual pages
 */
async function fetchVehicleDetails(
  urls: string[],
  baseUrl: string
): Promise<ScrapedVehicle[]> {
  const vehicles: ScrapedVehicle[] = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    console.log(`Fetching batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(urls.length / BATCH_SIZE)}...`);

    const results = await Promise.all(
      batch.map(async (url) => {
        try {
          // Extract VIN from URL
          const vinMatch = url.match(/([A-HJ-NPR-Z0-9]{17})$/i);
          if (!vinMatch) return null;

          const vin = vinMatch[1].toUpperCase();

          const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          });

          if (!response.ok) return null;

          const html = await response.text();

          // Extract data from detail page
          const vehicle = await parseDetailPage(html, vin, url, baseUrl);
          return vehicle;
        } catch (e) {
          console.error(`Error fetching ${url}:`, e);
          return null;
        }
      })
    );

    vehicles.push(...results.filter((v): v is ScrapedVehicle => v !== null));

    // Delay between batches
    if (i + BATCH_SIZE < urls.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return vehicles;
}

/**
 * Parse vehicle details from a detail page
 */
async function parseDetailPage(
  html: string,
  vin: string,
  url: string,
  baseUrl: string
): Promise<ScrapedVehicle | null> {
  try {
    // Start with default vehicle
    let vehicle: ScrapedVehicle = {
      vin,
      price: 0,
      mileage: 0,
      color: 'Unknown',
      photoUrls: [],
      detailUrl: url,
    };

    // Try to get base data from JSON-LD first
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const data = JSON.parse(jsonLdMatch[1]);
        if (data['@type'] === 'Vehicle' || data['@type'] === 'Car' || data['@type'] === 'Product') {
          const jsonLdVehicle = parseJsonLdVehicle(data, baseUrl, vin, url);
          if (jsonLdVehicle) {
            vehicle = jsonLdVehicle;
          }
        }
      } catch {
        // Continue to HTML parsing
      }
    }

    // If no price from JSON-LD, try HTML
    if (!vehicle.price) {
      const priceMatch = html.match(/(?:price|sale)[^$]*\$\s*([0-9,]+)/i) ||
                         html.match(/\$\s*([0-9,]+)/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
        if (price > 1000 && price < 500000) {
          vehicle.price = price;
        }
      }
    }

    // If no mileage from JSON-LD, try HTML
    if (!vehicle.mileage || isNaN(vehicle.mileage)) {
      const mileageMatch = html.match(/([0-9,]+)\s*(?:mi|miles)/i);
      if (mileageMatch) {
        vehicle.mileage = parseInt(mileageMatch[1].replace(/,/g, ''), 10) || 0;
      } else {
        vehicle.mileage = 0;
      }
    }

    // If no color from JSON-LD, try HTML
    if (vehicle.color === 'Unknown') {
      const colorMatch = html.match(/(?:exterior|ext\.?)\s*(?:color)?[:\s]*([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
      if (colorMatch && colorMatch[1].length < 30) {
        vehicle.color = colorMatch[1].trim();
      }
    }

    // If no fuel type from JSON-LD, try HTML
    if (!vehicle.fuelType) {
      const fuelPatterns = [
        /fuel\s*(?:type)?[:\s]*([^<,\n]+)/i,
        /engine[:\s]*[^<]*?(gasoline|diesel|electric|hybrid|flex\s*fuel|gas|petrol)/i,
        /(?:gasoline|diesel|electric|hybrid|flex\s*fuel)\s*(?:engine|fuel)/i,
      ];

      for (const pattern of fuelPatterns) {
        const fuelMatch = html.match(pattern);
        if (fuelMatch) {
          const fuelValue = fuelMatch[1]?.trim() || fuelMatch[0]?.trim();
          if (fuelValue && fuelValue.length < 30) {
            vehicle.fuelType = normalizeFuelType(fuelValue);
            break;
          }
        }
      }
    }

    // ALWAYS probe for photos (DealerOn specific) - this gets ALL photos
    const dealerId = extractDealerId(html);
    if (dealerId) {
      const probedPhotos = await probeForPhotos(baseUrl, dealerId, vin);
      if (probedPhotos.length > 0) {
        vehicle.photoUrls = probedPhotos;
        return vehicle;
      }
    }

    // Fallback: Extract photos from HTML if probing failed
    if (vehicle.photoUrls.length === 0) {
      vehicle.photoUrls = extractPhotosFromHtml(html, baseUrl, vin);
    }

    return vehicle;
  } catch (e) {
    console.error(`Error parsing detail page for ${vin}:`, e);
    return null;
  }
}

/**
 * Parse vehicle data from DealerOn HTML
 */
function parseDealerOnHtml(html: string, baseUrl: string): ScrapedVehicle[] {
  const vehicles: ScrapedVehicle[] = [];

  // DealerOn typically includes JSON-LD structured data for vehicles
  // Look for schema.org Vehicle or Car data
  const jsonLdMatches = html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);

  for (const match of jsonLdMatches) {
    try {
      const jsonContent = match[1].trim();
      const data = JSON.parse(jsonContent);

      // Handle arrays of items
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        if (item['@type'] === 'Vehicle' || item['@type'] === 'Car' || item['@type'] === 'Product') {
          const vehicle = parseJsonLdVehicle(item, baseUrl);
          if (vehicle && vehicle.vin) {
            vehicles.push(vehicle);
          }
        }

        // Check for ItemList containing vehicles
        if (item['@type'] === 'ItemList' && item.itemListElement) {
          for (const listItem of item.itemListElement) {
            const itemData = listItem.item || listItem;
            if (itemData['@type'] === 'Vehicle' || itemData['@type'] === 'Car' || itemData['@type'] === 'Product') {
              const vehicle = parseJsonLdVehicle(itemData, baseUrl);
              if (vehicle && vehicle.vin) {
                vehicles.push(vehicle);
              }
            }
          }
        }
      }
    } catch (e) {
      // JSON parse error, continue to next match
    }
  }

  // If no JSON-LD found, try HTML parsing
  if (vehicles.length === 0) {
    const htmlVehicles = parseVehiclesFromHtml(html, baseUrl);
    vehicles.push(...htmlVehicles);
  }

  return vehicles;
}

/**
 * Parse a vehicle from JSON-LD structured data
 */
function parseJsonLdVehicle(
  data: any,
  baseUrl: string,
  vinOverride?: string,
  urlOverride?: string
): ScrapedVehicle | null {
  try {
    // Extract VIN (use override if provided)
    const vin = vinOverride || data.vehicleIdentificationNumber || data.vin || data.sku;
    if (!vin) return null;

    // Extract price
    let price = 0;
    if (data.offers?.price) {
      price = parseFloat(data.offers.price);
    } else if (data.price) {
      price = parseFloat(data.price);
    }

    // Extract mileage
    let mileage = 0;
    if (data.mileageFromOdometer?.value) {
      mileage = parseInt(data.mileageFromOdometer.value, 10);
    } else if (data.mileage) {
      mileage = parseInt(data.mileage, 10);
    }

    // Extract color
    const color = data.color || data.vehicleInteriorColor || 'Unknown';

    // Extract photos
    const photoUrls: string[] = [];
    if (data.image) {
      const images = Array.isArray(data.image) ? data.image : [data.image];
      for (const img of images) {
        const url = typeof img === 'string' ? img : img.url || img.contentUrl;
        const cleanedUrl = cleanPhotoUrl(url, baseUrl);
        if (cleanedUrl) photoUrls.push(cleanedUrl);
      }
    }

    // Extract detail URL (use override if provided)
    let detailUrl = urlOverride || data.url || data.offers?.url || '';
    if (detailUrl && !detailUrl.startsWith('http')) {
      detailUrl = `${baseUrl.replace(/\/$/, '')}${detailUrl.startsWith('/') ? '' : '/'}${detailUrl}`;
    }

    // Extract fuel type from JSON-LD
    const fuelTypeRaw = data.fuelType || data.vehicleFuelType || data.fuelEfficiency?.fuelType;
    const fuelType = fuelTypeRaw ? normalizeFuelType(String(fuelTypeRaw)) : undefined;

    return {
      vin: (vinOverride || vin).toUpperCase(),
      price: isNaN(price) ? 0 : price,
      mileage: isNaN(mileage) ? 0 : mileage,
      color: typeof color === 'string' ? color : 'Unknown',
      photoUrls,
      detailUrl,
      year: data.vehicleModelDate ? parseInt(data.vehicleModelDate, 10) : undefined,
      make: data.brand?.name || data.manufacturer?.name || data.make,
      model: data.model?.name || data.model,
      trim: data.vehicleConfiguration || data.trim,
      description: data.description,
      fuelType,
    };
  } catch (e) {
    console.error('Error parsing JSON-LD vehicle:', e);
    return null;
  }
}

/**
 * Fallback: Parse vehicles directly from HTML when JSON-LD is not available
 */
function parseVehiclesFromHtml(html: string, baseUrl: string): ScrapedVehicle[] {
  const vehicles: ScrapedVehicle[] = [];

  // Look for VINs in the HTML (17-character alphanumeric, no I, O, Q)
  const vinRegex = /\b([A-HJ-NPR-Z0-9]{17})\b/gi;
  const foundVins = new Set<string>();

  let match;
  while ((match = vinRegex.exec(html)) !== null) {
    const vin = match[1].toUpperCase();
    // Basic VIN validation - check it's not just random characters
    if (isValidVin(vin)) {
      foundVins.add(vin);
    }
  }

  // For each VIN, try to find associated data
  for (const vin of foundVins) {
    // Find price near VIN
    const priceMatch = html.match(new RegExp(`${vin}[\\s\\S]{0,500}\\$([\\d,]+)`, 'i')) ||
                       html.match(new RegExp(`\\$([\\d,]+)[\\s\\S]{0,500}${vin}`, 'i'));
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 0;

    // Find mileage near VIN
    const mileageMatch = html.match(new RegExp(`${vin}[\\s\\S]{0,500}([\\d,]+)\\s*(?:mi|miles)`, 'i')) ||
                         html.match(new RegExp(`([\\d,]+)\\s*(?:mi|miles)[\\s\\S]{0,500}${vin}`, 'i'));
    const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/,/g, ''), 10) : 0;

    vehicles.push({
      vin,
      price,
      mileage,
      color: 'Unknown',
      photoUrls: [],
      detailUrl: '',
    });
  }

  return vehicles;
}

/**
 * Basic VIN validation
 */
function isValidVin(vin: string): boolean {
  if (vin.length !== 17) return false;

  // Check for common false positives
  // VINs shouldn't have all the same character
  if (/^(.)\1+$/.test(vin)) return false;

  // Check digit position (position 9) should follow VIN check digit algorithm
  // For simplicity, we just ensure it's not all letters or all numbers
  const hasLetter = /[A-Z]/.test(vin);
  const hasNumber = /[0-9]/.test(vin);

  return hasLetter && hasNumber;
}

/**
 * Fetch detail pages to get more photos and info
 */
async function enrichVehicleDetails(
  vehicles: ScrapedVehicle[],
  baseUrl: string
): Promise<ScrapedVehicle[]> {
  const enriched: ScrapedVehicle[] = [];

  // Process in batches to avoid overwhelming the server
  const BATCH_SIZE = 3;

  for (let i = 0; i < vehicles.length; i += BATCH_SIZE) {
    const batch = vehicles.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async (vehicle) => {
        if (!vehicle.detailUrl) return vehicle;

        try {
          const response = await fetch(vehicle.detailUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          });

          if (!response.ok) return vehicle;

          const html = await response.text();

          // Extract more photos from detail page
          const morePhotos = extractPhotosFromHtml(html, baseUrl, vehicle.vin);
          const allPhotos = [...new Set([...vehicle.photoUrls, ...morePhotos])];

          // Try to get more details
          const details = extractDetailsFromHtml(html);

          return {
            ...vehicle,
            photoUrls: allPhotos,
            transmission: details.transmission || vehicle.transmission,
            description: details.description || vehicle.description,
            color: details.color || vehicle.color,
            mileage: details.mileage || vehicle.mileage,
            price: details.price || vehicle.price,
            fuelType: details.fuelType || vehicle.fuelType,
          };
        } catch (e) {
          console.error(`Error enriching vehicle ${vehicle.vin}:`, e);
          return vehicle;
        }
      })
    );

    enriched.push(...results);

    // Small delay between batches
    if (i + BATCH_SIZE < vehicles.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return enriched;
}

/**
 * Extract dealer ID from HTML for photo URL construction
 */
function extractDealerId(html: string): string | null {
  // Look for dealer ID in various patterns
  const patterns = [
    /inventoryphotos\/(\d+)\//i,
    /"dealerId"\s*:\s*"?(\d+)"?/i,
    /dealer-(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Probe for all photos by constructing URLs and testing existence
 * DealerOn uses pattern: /inventoryphotos/{dealerId}/{vin}/ip/{n}.jpg
 */
async function probeForPhotos(baseUrl: string, dealerId: string, vin: string): Promise<string[]> {
  const photos: string[] = [];
  const vinLower = vin.toLowerCase();
  const maxPhotos = 50; // Maximum photos to check

  for (let i = 1; i <= maxPhotos; i++) {
    const photoUrl = `${baseUrl}/inventoryphotos/${dealerId}/${vinLower}/ip/${i}.jpg`;

    try {
      const response = await fetch(photoUrl, { method: 'HEAD' });
      if (response.ok) {
        photos.push(photoUrl);
      } else {
        // Stop probing when we hit a 404
        break;
      }
    } catch {
      break;
    }
  }

  return photos;
}

/**
 * Extract photo URLs from HTML (fallback if probing fails)
 */
function extractPhotosFromHtml(html: string, baseUrl: string, vin?: string): string[] {
  const photos: string[] = [];
  const seenUrls = new Set<string>();

  // DealerOn specific pattern: /inventoryphotos/{dealerId}/{vin}/ip/{n}.jpg
  const vinLower = vin?.toLowerCase() || '';

  // Look for inventory photo URLs with this VIN
  const inventoryPhotoPattern = new RegExp(
    `(/inventoryphotos/\\d+/${vinLower}/ip/\\d+\\.(?:jpg|jpeg|png|webp))`,
    'gi'
  );

  let match;
  while ((match = inventoryPhotoPattern.exec(html)) !== null) {
    let photoPath = match[1];
    photoPath = photoPath.split('?')[0];
    const fullUrl = `${baseUrl}${photoPath}`;

    if (!seenUrls.has(fullUrl)) {
      seenUrls.add(fullUrl);
      photos.push(fullUrl);
    }
  }

  // Also look for any inventoryphotos URLs as fallback
  if (photos.length === 0) {
    const generalPattern = /\/inventoryphotos\/\d+\/[a-z0-9]+\/ip\/(\d+)\.(?:jpg|jpeg|png|webp)/gi;
    while ((match = generalPattern.exec(html)) !== null) {
      let photoPath = match[0];
      photoPath = photoPath.split('?')[0];
      const fullUrl = `${baseUrl}${photoPath}`;

      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        photos.push(fullUrl);
      }
    }
  }

  // Sort photos by number
  photos.sort((a, b) => {
    const numA = parseInt(a.match(/\/(\d+)\.(?:jpg|jpeg|png|webp)/i)?.[1] || '0', 10);
    const numB = parseInt(b.match(/\/(\d+)\.(?:jpg|jpeg|png|webp)/i)?.[1] || '0', 10);
    return numA - numB;
  });

  return photos;
}

/**
 * Extract additional details from HTML
 */
function extractDetailsFromHtml(html: string): Partial<ScrapedVehicle> {
  const details: Partial<ScrapedVehicle> = {};

  // Transmission
  const transMatch = html.match(/transmission[:\s]*([^<,]+)/i);
  if (transMatch) {
    details.transmission = transMatch[1].trim();
  }

  // Color
  const colorMatch = html.match(/(?:exterior\s*)?color[:\s]*([^<,]+)/i);
  if (colorMatch && colorMatch[1].length < 30) {
    details.color = colorMatch[1].trim();
  }

  // Mileage
  const mileageMatch = html.match(/([0-9,]+)\s*(?:mi|miles)/i);
  if (mileageMatch) {
    details.mileage = parseInt(mileageMatch[1].replace(/,/g, ''), 10);
  }

  // Price
  const priceMatch = html.match(/\$([0-9,]+)/);
  if (priceMatch) {
    const price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    if (price > 1000 && price < 500000) {
      details.price = price;
    }
  }

  // Fuel Type - try multiple patterns
  const fuelPatterns = [
    /fuel\s*(?:type)?[:\s]*([^<,\n]+)/i,
    /engine[:\s]*[^<]*?(gasoline|diesel|electric|hybrid|flex\s*fuel|gas|petrol)/i,
    /(?:gasoline|diesel|electric|hybrid|flex\s*fuel)\s*(?:engine|fuel)/i,
  ];

  for (const pattern of fuelPatterns) {
    const fuelMatch = html.match(pattern);
    if (fuelMatch) {
      const fuelValue = fuelMatch[1]?.trim() || fuelMatch[0]?.trim();
      if (fuelValue && fuelValue.length < 30) {
        details.fuelType = normalizeFuelType(fuelValue);
        break;
      }
    }
  }

  return details;
}

/**
 * Normalize fuel type to standard values
 */
function normalizeFuelType(fuelType: string): string {
  const lower = fuelType.toLowerCase().trim();

  if (lower.includes('diesel')) return 'Diesel';
  if (lower.includes('electric') && !lower.includes('hybrid')) return 'Electric';
  if (lower.includes('hybrid') || lower.includes('plug-in')) return 'Hybrid';
  if (lower.includes('flex') || lower.includes('e85')) return 'Flex Fuel';
  if (lower.includes('gas') || lower.includes('petrol') || lower.includes('unleaded')) return 'Gasoline';

  // If it looks like a valid fuel type, return it capitalized
  if (lower.length > 0 && lower.length < 20) {
    return fuelType.charAt(0).toUpperCase() + fuelType.slice(1).toLowerCase();
  }

  return 'Gasoline'; // Default
}

/**
 * Extract the DealerOn dealer ID from the website
 */
async function extractDealerOnDealerId(baseUrl: string): Promise<string | null> {
  try {
    // Fetch the homepage to extract dealer ID from scripts
    const response = await fetch(`${baseUrl}/searchused.aspx`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!response.ok) return null;

    const html = await response.text();

    // Look for dealer ID patterns in the page
    const patterns = [
      /["']dealerId["']\s*:\s*["']?(\d+)["']?/i,
      /data-dealer-id=["'](\d+)["']/i,
      /dealer_id\s*[:=]\s*["']?(\d+)["']?/i,
      /DealerId\s*[:=]\s*(\d+)/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1];
    }

    return null;
  } catch {
    return null;
  }
}

interface VehicleDataLayerInfo {
  mileage: number;
  color: string;
}

/**
 * Fetch vehicle data (mileage and color) from DealerOn DataLayer API
 * Makes batched requests to get data for all vehicles
 */
async function fetchVehicleDataFromDataLayer(
  baseUrl: string,
  vins: string[]
): Promise<Map<string, VehicleDataLayerInfo>> {
  const dataMap = new Map<string, VehicleDataLayerInfo>();

  if (vins.length === 0) return dataMap;

  try {
    // Extract dealer ID dynamically
    const dealerId = await extractDealerOnDealerId(baseUrl);
    if (!dealerId) {
      console.log('Could not extract dealer ID, using default');
    }
    const effectiveDealerId = dealerId || '25944';

    // Batch VINs into groups of 50 for API calls
    const BATCH_SIZE = 50;
    const batches: string[][] = [];
    for (let i = 0; i < vins.length; i += BATCH_SIZE) {
      batches.push(vins.slice(i, i + BATCH_SIZE));
    }

    console.log(`Fetching vehicle data in ${batches.length} batch(es)...`);

    for (const batch of batches) {
      const params = new URLSearchParams();
      params.append('dealerId', effectiveDealerId);
      params.append('pageType', 'itemlist');
      params.append('statusCode', '200');
      params.append('itemCount', batch.length.toString());

      for (const vin of batch) {
        params.append('item', vin);
      }

      const response = await fetch(`${baseUrl}/api/taggbaa/DataLayer/Init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        console.error('DataLayer API returned:', response.status);
        continue;
      }

      const data = await response.json();

      // Parse the comma-separated lists
      const idList = (data.item_id_list || '').split(',').filter(Boolean);
      const mileageList = (data.item_mileage_list || '').split(',');
      const colorList = (data.item_color_list || '').split(',');

      // Map VINs to data
      for (let i = 0; i < idList.length; i++) {
        const vin = idList[i]?.toUpperCase();
        const mileage = parseInt(mileageList[i], 10);
        const color = colorList[i]?.trim() || 'Unknown';

        if (vin) {
          dataMap.set(vin, {
            mileage: !isNaN(mileage) ? mileage : 0,
            color: color || 'Unknown',
          });
        }
      }

      // Small delay between batches
      if (batches.length > 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    console.log(`Fetched data for ${dataMap.size} of ${vins.length} vehicles from DataLayer API`);
  } catch (error) {
    console.error('Error fetching vehicle data from DataLayer:', error);
  }

  return dataMap;
}
