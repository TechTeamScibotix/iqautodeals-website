/**
 * Test the full DealerOn scraper with sitemap
 */

async function testFullScraper() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';

  console.log('=== Testing Full DealerOn Scraper ===\n');
  console.log(`Base URL: ${baseUrl}\n`);

  // 1. Test sitemap parsing
  console.log('1. Fetching sitemap...');
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const sitemapResponse = await fetch(sitemapUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!sitemapResponse.ok) {
    console.log(`Sitemap not found: ${sitemapResponse.status}`);
    return;
  }

  const xml = await sitemapResponse.text();
  console.log(`Sitemap size: ${(xml.length / 1024).toFixed(1)} KB\n`);

  // Extract used vehicle URLs
  const urlPattern = /<loc>([^<]+)<\/loc>/gi;
  const usedVehicleUrls = [];
  let match;

  while ((match = urlPattern.exec(xml)) !== null) {
    const url = match[1];
    if (url.includes('/used-') && /[A-HJ-NPR-Z0-9]{17}$/i.test(url)) {
      usedVehicleUrls.push(url);
    }
  }

  console.log(`Found ${usedVehicleUrls.length} used vehicle URLs\n`);

  if (usedVehicleUrls.length === 0) {
    console.log('No vehicles found in sitemap');
    return;
  }

  // 2. Test fetching a vehicle detail page
  console.log('2. Fetching sample vehicle detail page...');
  const testUrl = usedVehicleUrls[0];
  console.log(`URL: ${testUrl}\n`);

  const vinMatch = testUrl.match(/([A-HJ-NPR-Z0-9]{17})$/i);
  if (!vinMatch) {
    console.log('Could not extract VIN from URL');
    return;
  }

  const vin = vinMatch[1].toUpperCase();
  console.log(`VIN: ${vin}\n`);

  const detailResponse = await fetch(testUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });

  if (!detailResponse.ok) {
    console.log(`Failed to fetch detail page: ${detailResponse.status}`);
    return;
  }

  const html = await detailResponse.text();
  console.log(`Detail page size: ${(html.length / 1024).toFixed(1)} KB\n`);

  // 3. Try to extract JSON-LD
  console.log('3. Looking for JSON-LD data...');
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  console.log(`Found ${jsonLdMatches.length} JSON-LD blocks\n`);

  for (const jMatch of jsonLdMatches) {
    try {
      const data = JSON.parse(jMatch[1]);
      if (data['@type'] === 'Vehicle' || data['@type'] === 'Car' || data['@type'] === 'Product') {
        console.log('=== Vehicle JSON-LD Found ===');
        console.log(`VIN: ${data.vehicleIdentificationNumber || data.vin}`);
        console.log(`Year: ${data.vehicleModelDate}`);
        console.log(`Make: ${data.brand?.name || data.manufacturer?.name}`);
        console.log(`Model: ${data.model?.name || data.model}`);
        console.log(`Price: $${data.offers?.price}`);
        console.log(`Mileage: ${data.mileageFromOdometer?.value} mi`);
        console.log(`Color: ${data.color}`);

        // Images
        const images = data.image;
        if (images) {
          const imageUrls = Array.isArray(images) ? images : [images];
          console.log(`Photos: ${imageUrls.length}`);
          imageUrls.slice(0, 3).forEach((img, i) => {
            const url = typeof img === 'string' ? img : img.url || img.contentUrl;
            console.log(`  ${i + 1}. ${url?.substring(0, 80)}...`);
          });
        }
      }
    } catch (e) {
      // Not valid JSON
    }
  }

  // 4. Extract data from HTML as fallback
  console.log('\n4. Extracting from HTML (fallback)...');

  // Price
  const priceMatch = html.match(/\$\s*([0-9,]+)/);
  console.log(`Price: ${priceMatch ? '$' + priceMatch[1] : 'Not found'}`);

  // Mileage
  const mileageMatch = html.match(/([0-9,]+)\s*(?:mi|miles)/i);
  console.log(`Mileage: ${mileageMatch ? mileageMatch[1] + ' mi' : 'Not found'}`);

  // Color
  const colorMatch = html.match(/(?:exterior|ext\.?)\s*(?:color)?[:\s]*([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
  console.log(`Color: ${colorMatch ? colorMatch[1] : 'Not found'}`);

  // Photos
  const photoPattern = /(?:src|data-src)="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi;
  const photos = new Set();
  let photoMatch;
  while ((photoMatch = photoPattern.exec(html)) !== null) {
    let url = photoMatch[1];
    // Filter for vehicle images
    if (url.includes('vehicle') || url.includes('photo') || url.includes('image') || url.includes('inventory')) {
      if (url.startsWith('//')) url = 'https:' + url;
      else if (url.startsWith('/')) url = baseUrl + url;
      photos.add(url);
    }
  }
  console.log(`Photos found: ${photos.size}`);
  [...photos].slice(0, 3).forEach((p, i) => console.log(`  ${i + 1}. ${p.substring(0, 80)}...`));

  // 5. Test VIN decoder
  console.log('\n5. Testing NHTSA VIN Decoder...');
  const nhtsaResponse = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
  );

  if (nhtsaResponse.ok) {
    const nhtsaData = await nhtsaResponse.json();
    const getValue = (name) => {
      const r = nhtsaData.Results.find((x) => x.Variable === name);
      return r?.Value || 'N/A';
    };

    console.log('NHTSA Decoded:');
    console.log(`  Year: ${getValue('Model Year')}`);
    console.log(`  Make: ${getValue('Make')}`);
    console.log(`  Model: ${getValue('Model')}`);
    console.log(`  Trim: ${getValue('Trim')}`);
    console.log(`  Body: ${getValue('Body Class')}`);
    console.log(`  Drive: ${getValue('Drive Type')}`);
    console.log(`  Fuel: ${getValue('Fuel Type - Primary')}`);
  }

  console.log('\n=== Test Complete ===');
  console.log(`\nTotal used vehicles in sitemap: ${usedVehicleUrls.length}`);
}

testFullScraper().catch(console.error);
