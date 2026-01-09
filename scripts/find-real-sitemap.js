/**
 * Find the real XML sitemap
 */

async function findRealSitemap() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';

  const possibleLocations = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/sitemaps/sitemap.xml',
    '/sitemap/sitemap.xml',
    '/sitemap1.xml',
    '/sitemap-index.xml',
    '/robots.txt', // Check robots.txt for sitemap location
  ];

  console.log('Searching for XML sitemap...\n');

  for (const path of possibleLocations) {
    const url = baseUrl + path;
    console.log(`Trying: ${url}`);

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const contentType = response.headers.get('content-type') || '';
      console.log(`  Status: ${response.status}, Content-Type: ${contentType}`);

      if (response.ok) {
        const text = await response.text();

        if (path === '/robots.txt') {
          // Look for Sitemap directive
          const sitemapMatch = text.match(/Sitemap:\s*(\S+)/gi);
          if (sitemapMatch) {
            console.log('  Found sitemap references:');
            sitemapMatch.forEach(m => console.log(`    ${m}`));
          }
        } else if (contentType.includes('xml') || text.trim().startsWith('<?xml')) {
          console.log('  ✓ Found XML sitemap!');

          // Check if it's an index
          if (text.includes('<sitemapindex')) {
            console.log('  This is a sitemap index');

            const sitemapUrls = [];
            const pattern = /<loc>([^<]+)<\/loc>/gi;
            let match;
            while ((match = pattern.exec(text)) !== null) {
              sitemapUrls.push(match[1]);
            }
            console.log(`  Contains ${sitemapUrls.length} child sitemaps:`);
            sitemapUrls.slice(0, 5).forEach(u => console.log(`    ${u}`));
          } else {
            // Regular sitemap - count URLs
            const locCount = (text.match(/<loc>/gi) || []).length;
            console.log(`  Contains ${locCount} URLs`);

            // Check for vehicle URLs
            const vehicleUrls = (text.match(/used-[^<]+/gi) || []).length;
            console.log(`  Vehicle URLs with 'used-': ${vehicleUrls}`);
          }

          return;
        }
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }

    console.log('');
  }
}

findRealSitemap().catch(console.error);
