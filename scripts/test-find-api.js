/**
 * Find API endpoints that DealerOn uses to load vehicle data
 */

async function findApis() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';
  const inventoryUrl = `${baseUrl}/searchused.aspx`;

  console.log('Fetching inventory page to find API endpoints...\n');

  const response = await fetch(inventoryUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  const html = await response.text();

  // Look for API patterns
  const apiPatterns = [
    /["']([^"']*api[^"']*vehicles[^"']*)["']/gi,
    /["']([^"']*\/api\/[^"']*)["']/gi,
    /["']([^"']*inventory[^"']*\.json[^"']*)["']/gi,
    /["']([^"']*search[^"']*\.json[^"']*)["']/gi,
    /fetch\s*\(\s*["']([^"']+)["']/gi,
    /XMLHttpRequest[^}]*["']([^"']+)["']/gi,
  ];

  console.log('Looking for API endpoints...\n');

  const foundApis = new Set();
  for (const pattern of apiPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      if (!match[1].includes('.css') && !match[1].includes('.svg') && !match[1].includes('.png')) {
        foundApis.add(match[1]);
      }
    }
  }

  console.log('Potential API endpoints:');
  [...foundApis].forEach(api => console.log(`  ${api}`));

  // Look for inline vehicle data
  console.log('\n\nLooking for inline vehicle data...');

  // Check for window.__INITIAL_STATE__ or similar
  const statePattern = /window\.__([A-Z_]+)__\s*=\s*(\{[\s\S]*?\});/g;
  let match;
  while ((match = statePattern.exec(html)) !== null) {
    console.log(`Found window.${match[1]} with ${match[2].length} chars`);
  }

  // Check for data in script tags
  const vehicleDataPattern = /vehicleIdentificationNumber|"vin":/gi;
  const hasVehicleData = vehicleDataPattern.test(html);
  console.log(`\nContains VIN data in HTML: ${hasVehicleData}`);

  // Look for next/data or similar patterns
  const nextDataPattern = /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i;
  const nextMatch = html.match(nextDataPattern);
  if (nextMatch) {
    console.log('\nFound Next.js data!');
  }

  // Try common DealerOn API endpoints
  console.log('\n\nTrying common DealerOn API endpoints...\n');

  const testEndpoints = [
    '/api/inventory/used',
    '/api/vehicles/used',
    '/api/search/used',
    '/inventory/api/used',
    '/vehicles.json',
    '/searchused.aspx?json=1',
    '/searchresults/api',
  ];

  for (const endpoint of testEndpoints) {
    try {
      const testUrl = baseUrl + endpoint;
      const testResp = await fetch(testUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        },
      });
      console.log(`${endpoint}: ${testResp.status} ${testResp.headers.get('content-type')}`);

      if (testResp.ok && testResp.headers.get('content-type')?.includes('json')) {
        const text = await testResp.text();
        console.log(`  Response length: ${text.length} chars`);
        if (text.length < 1000) {
          console.log(`  Content: ${text.substring(0, 200)}`);
        }
      }
    } catch (e) {
      console.log(`${endpoint}: Failed - ${e.message}`);
    }
  }
}

findApis().catch(console.error);
