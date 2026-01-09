/**
 * Check raw sitemap content
 */

async function checkSitemap() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  console.log('Fetching sitemap...\n');

  const response = await fetch(sitemapUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  const xml = await response.text();

  console.log(`Status: ${response.status}`);
  console.log(`Content-Type: ${response.headers.get('content-type')}`);
  console.log(`Size: ${xml.length} chars\n`);

  // Show first 2000 chars
  console.log('First 2000 chars:');
  console.log(xml.substring(0, 2000));

  console.log('\n\n... middle content ...\n');

  // Look for sitemap index
  if (xml.includes('<sitemapindex') || xml.includes('<sitemap>')) {
    console.log('This is a SITEMAP INDEX');

    // Extract child sitemap URLs
    const sitemapPattern = /<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/gi;
    let match;
    console.log('\nChild sitemaps:');
    while ((match = sitemapPattern.exec(xml)) !== null) {
      console.log(`  ${match[1]}`);
    }
  }

  // Search for vehicle URLs
  console.log('\n\nSearching for vehicle-related content...');
  if (xml.includes('/used-')) console.log('Contains /used-');
  if (xml.includes('/new-')) console.log('Contains /new-');
  if (xml.includes('VIN')) console.log('Contains VIN');

  // Look for any <loc> tags
  const locCount = (xml.match(/<loc>/gi) || []).length;
  console.log(`\nTotal <loc> tags: ${locCount}`);
}

checkSitemap().catch(console.error);
