/**
 * Test script for DealerOn scraper
 * Run with: node scripts/test-scraper.js
 */

async function testScraper() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';
  const inventoryUrl = `${baseUrl}/searchused.aspx`;

  console.log(`\n=== Testing DealerOn Scraper ===`);
  console.log(`URL: ${inventoryUrl}\n`);

  try {
    // Fetch the page
    console.log('Fetching inventory page...');
    const response = await fetch(inventoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.status} ${response.statusText}`);
      return;
    }

    const html = await response.text();
    console.log(`Page size: ${(html.length / 1024).toFixed(1)} KB\n`);

    // Look for JSON-LD structured data
    const jsonLdMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    console.log(`Found ${jsonLdMatches.length} JSON-LD blocks\n`);

    let vehicleCount = 0;
    const vehicles = [];

    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1].trim());
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
          if (item['@type'] === 'Vehicle' || item['@type'] === 'Car' || item['@type'] === 'Product') {
            vehicleCount++;
            const vin = item.vehicleIdentificationNumber || item.vin || item.sku;
            const price = item.offers?.price || item.price;
            const mileage = item.mileageFromOdometer?.value || item.mileage;
            const images = item.image ? (Array.isArray(item.image) ? item.image.length : 1) : 0;

            vehicles.push({
              vin,
              year: item.vehicleModelDate,
              make: item.brand?.name || item.manufacturer?.name,
              model: item.model?.name || item.model,
              price,
              mileage,
              images,
              url: item.url,
            });
          }

          // Check for ItemList
          if (item['@type'] === 'ItemList' && item.itemListElement) {
            for (const listItem of item.itemListElement) {
              const itemData = listItem.item || listItem;
              if (itemData['@type'] === 'Vehicle' || itemData['@type'] === 'Car') {
                vehicleCount++;
                const vin = itemData.vehicleIdentificationNumber || itemData.vin;
                vehicles.push({
                  vin,
                  year: itemData.vehicleModelDate,
                  make: itemData.brand?.name,
                  model: itemData.model?.name || itemData.model,
                  price: itemData.offers?.price,
                  mileage: itemData.mileageFromOdometer?.value,
                  images: itemData.image ? (Array.isArray(itemData.image) ? itemData.image.length : 1) : 0,
                });
              }
            }
          }
        }
      } catch (e) {
        // Parse error
      }
    }

    console.log(`Found ${vehicleCount} vehicles in JSON-LD\n`);

    if (vehicles.length > 0) {
      console.log('=== Sample Vehicles ===');
      vehicles.slice(0, 5).forEach((v, i) => {
        console.log(`\n${i + 1}. VIN: ${v.vin}`);
        console.log(`   ${v.year} ${v.make} ${v.model}`);
        console.log(`   Price: $${v.price}`);
        console.log(`   Mileage: ${v.mileage} mi`);
        console.log(`   Photos: ${v.images}`);
        if (v.url) console.log(`   URL: ${v.url}`);
      });
    }

    // Also look for VINs in HTML
    const vinRegex = /\b([A-HJ-NPR-Z0-9]{17})\b/gi;
    const allVins = new Set();
    let vinMatch;
    while ((vinMatch = vinRegex.exec(html)) !== null) {
      const vin = vinMatch[1].toUpperCase();
      // Basic validation
      if (/[A-Z]/.test(vin) && /[0-9]/.test(vin)) {
        allVins.add(vin);
      }
    }

    console.log(`\n\nTotal unique VINs found in page: ${allVins.size}`);

    if (allVins.size > 0 && allVins.size <= 20) {
      console.log('\nVINs found:');
      [...allVins].forEach((vin) => console.log(`  ${vin}`));
    }

    // Test NHTSA VIN decoder with first VIN
    if (allVins.size > 0) {
      const testVin = [...allVins][0];
      console.log(`\n\n=== Testing NHTSA VIN Decoder ===`);
      console.log(`VIN: ${testVin}\n`);

      const nhtsaResponse = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${testVin}?format=json`
      );

      if (nhtsaResponse.ok) {
        const nhtsaData = await nhtsaResponse.json();
        const getValue = (name) => {
          const r = nhtsaData.Results.find((x) => x.Variable === name);
          return r?.Value || 'N/A';
        };

        console.log('Decoded Vehicle Info:');
        console.log(`  Year: ${getValue('Model Year')}`);
        console.log(`  Make: ${getValue('Make')}`);
        console.log(`  Model: ${getValue('Model')}`);
        console.log(`  Trim: ${getValue('Trim')}`);
        console.log(`  Body: ${getValue('Body Class')}`);
        console.log(`  Drive: ${getValue('Drive Type')}`);
        console.log(`  Fuel: ${getValue('Fuel Type - Primary')}`);
        console.log(`  Engine: ${getValue('Displacement (L)')}L ${getValue('Engine Number of Cylinders')}-cyl`);
        console.log(`  Transmission: ${getValue('Transmission Style')}`);
      }
    }

    console.log('\n=== Test Complete ===\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

testScraper();
