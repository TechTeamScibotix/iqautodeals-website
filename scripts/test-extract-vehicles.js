/**
 * Extract vehicle data from DealerOn HTML more thoroughly
 */

async function extractVehicles() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';
  const inventoryUrl = `${baseUrl}/searchused.aspx`;

  console.log('Fetching inventory page...\n');

  const response = await fetch(inventoryUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  const html = await response.text();

  // Look for the area around VINs to understand the data structure
  const vinRegex = /[A-HJ-NPR-Z0-9]{17}/gi;
  const vins = new Set();
  let match;

  while ((match = vinRegex.exec(html)) !== null) {
    const vin = match[0].toUpperCase();
    // Validate: must have both letters and numbers
    if (/[A-Z]/.test(vin) && /[0-9]/.test(vin)) {
      // Check position 9 (check digit) - should be 0-9 or X
      if (/[0-9X]/.test(vin[8])) {
        vins.add(vin);
      }
    }
  }

  console.log(`Found ${vins.size} valid VINs:\n`);

  for (const vin of vins) {
    console.log(`VIN: ${vin}`);

    // Find context around this VIN (500 chars before and after)
    const idx = html.indexOf(vin);
    if (idx > -1) {
      const start = Math.max(0, idx - 300);
      const end = Math.min(html.length, idx + vin.length + 300);
      const context = html.substring(start, end);

      // Look for price near VIN
      const priceMatch = context.match(/\$\s*([0-9,]+)/);
      if (priceMatch) {
        console.log(`  Price: $${priceMatch[1]}`);
      }

      // Look for mileage
      const mileageMatch = context.match(/([0-9,]+)\s*(?:mi|miles)/i);
      if (mileageMatch) {
        console.log(`  Mileage: ${mileageMatch[1]} mi`);
      }

      // Look for year/make/model - usually in title or h tags
      const titleMatch = context.match(/(?:title|alt)="([^"]*(?:20\d{2}|19\d{2})[^"]*)"/i);
      if (titleMatch) {
        console.log(`  Title: ${titleMatch[1]}`);
      }

      // Look for image URL
      const imgMatch = context.match(/(?:src|data-src)="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
      if (imgMatch) {
        let imgUrl = imgMatch[1];
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        else if (imgUrl.startsWith('/')) imgUrl = baseUrl + imgUrl;
        console.log(`  Image: ${imgUrl.substring(0, 80)}...`);
      }

      // Look for detail page URL
      const hrefMatch = context.match(/href="([^"]*(?:used|vehicle)[^"]*)"/i);
      if (hrefMatch) {
        let detailUrl = hrefMatch[1];
        if (detailUrl.startsWith('/')) detailUrl = baseUrl + detailUrl;
        console.log(`  Detail URL: ${detailUrl}`);
      }
    }

    console.log('');
  }

  // Also look for structured vehicle data in JSON format
  console.log('\n=== Looking for JSON vehicle data ===\n');

  // Match any JSON that contains vehicle-like data
  const jsonPattern = /\{[^{}]*"(?:vin|VIN|vehicleIdentificationNumber)"[^{}]*\}/g;
  while ((match = jsonPattern.exec(html)) !== null) {
    console.log('Found JSON with VIN:', match[0].substring(0, 200));
  }

  // Look for data attributes on vehicle cards
  console.log('\n=== Looking for data attributes ===\n');

  const dataAttrPattern = /data-(?:vin|vehicle|price|mileage|year|make|model)[^=]*="([^"]+)"/gi;
  let attrCount = 0;
  while ((match = dataAttrPattern.exec(html)) !== null) {
    console.log(`${match[0]}`);
    attrCount++;
  }
  console.log(`Found ${attrCount} relevant data attributes`);
}

extractVehicles().catch(console.error);
