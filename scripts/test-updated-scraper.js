/**
 * Test updated scraper with HTML sitemap parsing
 */

async function testUpdatedScraper() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';

  console.log('=== Testing Updated Scraper ===\n');

  // Fetch sitemap
  console.log('Fetching sitemap...');
  const response = await fetch(`${baseUrl}/sitemap.xml`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });

  const content = await response.text();
  console.log(`Content length: ${content.length} chars\n`);

  // Look for vehicle URLs with the new pattern
  const hrefPattern = /href="([^"]*(?:used-|new-)[^"]*[A-HJ-NPR-Z0-9]{17})"/gi;
  const urls = [];
  let match;

  while ((match = hrefPattern.exec(content)) !== null) {
    let url = match[1];
    if (url.startsWith('/')) {
      url = baseUrl + url;
    }
    urls.push(url);
  }

  console.log(`Found ${urls.length} vehicle URLs\n`);

  if (urls.length > 0) {
    console.log('Sample URLs:');
    urls.slice(0, 5).forEach((url, i) => {
      console.log(`  ${i + 1}. ${url}`);
    });

    // Test fetching one
    console.log('\n\nFetching first vehicle detail page...');
    const testUrl = urls[0];
    const vinMatch = testUrl.match(/([A-HJ-NPR-Z0-9]{17})$/i);

    if (vinMatch) {
      const vin = vinMatch[1].toUpperCase();
      console.log(`VIN: ${vin}`);

      const detailResponse = await fetch(testUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      if (detailResponse.ok) {
        const html = await detailResponse.text();
        console.log(`Page size: ${(html.length / 1024).toFixed(1)} KB`);

        // Check for JSON-LD
        const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
        if (jsonLdMatch) {
          try {
            const data = JSON.parse(jsonLdMatch[1]);
            if (data['@type'] === 'Vehicle' || data['@type'] === 'Product') {
              console.log('\n=== JSON-LD Vehicle Data ===');
              console.log(`VIN: ${data.vehicleIdentificationNumber || data.vin || 'N/A'}`);
              console.log(`Name: ${data.name || 'N/A'}`);
              console.log(`Price: $${data.offers?.price || 'N/A'}`);
              console.log(`Mileage: ${data.mileageFromOdometer?.value || 'N/A'} mi`);
              console.log(`Color: ${data.color || 'N/A'}`);

              if (data.image) {
                const images = Array.isArray(data.image) ? data.image : [data.image];
                console.log(`Photos: ${images.length}`);
              }
            }
          } catch (e) {
            console.log('JSON-LD parse error');
          }
        }

        // Try HTML extraction
        console.log('\n=== HTML Extraction ===');
        const priceMatch = html.match(/\$\s*([0-9,]+)/);
        console.log(`Price: ${priceMatch ? '$' + priceMatch[1] : 'Not found'}`);

        const mileageMatch = html.match(/([0-9,]+)\s*(?:mi|miles)/i);
        console.log(`Mileage: ${mileageMatch ? mileageMatch[1] + ' mi' : 'Not found'}`);
      }
    }
  }

  // Count used vs new
  const usedUrls = urls.filter(u => u.includes('/used-'));
  const newUrls = urls.filter(u => u.includes('/new-'));
  console.log(`\n\nSummary:`);
  console.log(`  Used vehicles: ${usedUrls.length}`);
  console.log(`  New vehicles: ${newUrls.length}`);
}

testUpdatedScraper().catch(console.error);
