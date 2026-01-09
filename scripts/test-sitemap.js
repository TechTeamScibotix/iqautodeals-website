/**
 * Debug sitemap parsing
 */

async function debugSitemap() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  console.log('Fetching sitemap...\n');

  const response = await fetch(sitemapUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  const xml = await response.text();

  // Find all URLs
  const urlPattern = /<loc>([^<]+)<\/loc>/gi;
  const urls = [];
  let match;

  while ((match = urlPattern.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  console.log(`Total URLs in sitemap: ${urls.length}\n`);

  // Find vehicle URLs
  const vehicleUrls = urls.filter(url => {
    return url.includes('used') || url.includes('new') || url.includes('vehicle');
  });

  console.log(`URLs with 'used', 'new', or 'vehicle': ${vehicleUrls.length}\n`);

  // Show sample URLs
  console.log('Sample URLs:');
  vehicleUrls.slice(0, 10).forEach(url => console.log(`  ${url}`));

  // Check for VIN pattern
  console.log('\n\nURLs ending with VIN-like pattern:');
  const vinUrls = urls.filter(url => /[A-HJ-NPR-Z0-9]{17}$/i.test(url));
  console.log(`Found: ${vinUrls.length}`);
  vinUrls.slice(0, 10).forEach(url => console.log(`  ${url}`));

  // Check URL patterns
  console.log('\n\nAll unique URL path patterns:');
  const patterns = new Set();
  urls.forEach(url => {
    const path = new URL(url).pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 0) {
      patterns.add(parts[0]);
    }
  });
  console.log([...patterns].join('\n'));
}

debugSitemap().catch(console.error);
