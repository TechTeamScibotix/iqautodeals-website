/**
 * Find all URLs on the DealerOn page to understand the pattern
 */

async function findUrls() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';
  const inventoryUrl = `${baseUrl}/searchused.aspx`;

  console.log('Fetching inventory page...\n');

  const response = await fetch(inventoryUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  const html = await response.text();

  // Find all hrefs
  const hrefPattern = /href="([^"]+)"/gi;
  const urls = new Set();

  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    urls.add(match[1]);
  }

  console.log(`Found ${urls.size} unique URLs\n`);

  // Filter for ones that might be vehicle pages
  const vehicleUrls = [...urls].filter(url => {
    const lower = url.toLowerCase();
    return (
      lower.includes('used') ||
      lower.includes('vehicle') ||
      lower.includes('inventory') ||
      lower.includes('detail')
    );
  });

  console.log('URLs containing "used", "vehicle", "inventory", or "detail":');
  vehicleUrls.forEach(url => console.log(`  ${url}`));

  // Also check for data attributes
  console.log('\n\nLooking for data attributes...');

  const dataVinPattern = /data-[^=]*vin[^=]*="([^"]+)"/gi;
  while ((match = dataVinPattern.exec(html)) !== null) {
    console.log(`Found data attribute with VIN: ${match[1]}`);
  }

  // Look for onclick or data attributes with URLs
  const dataUrlPattern = /data-(?:url|href|link)[^=]*="([^"]+)"/gi;
  while ((match = dataUrlPattern.exec(html)) !== null) {
    console.log(`Found data URL: ${match[1]}`);
  }

  // Look for any URLs containing a 17-char alphanumeric (VIN)
  const vinUrlPattern = /href="([^"]*[A-HJ-NPR-Z0-9]{17}[^"]*)"/gi;
  console.log('\n\nURLs containing VIN-like patterns:');
  while ((match = vinUrlPattern.exec(html)) !== null) {
    console.log(`  ${match[1]}`);
  }
}

findUrls().catch(console.error);
