/**
 * Test Puppeteer scraping for mileage and photos
 */
const puppeteer = require('puppeteer');

async function testScrape() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  // Intercept network requests to find vehicle data API
  const vehicleData = {};
  await page.setRequestInterception(true);
  page.on('request', request => request.continue());
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('inventory') || url.includes('vehicle') || url.includes('api')) {
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('json')) {
          const text = await response.text();
          if (text.includes('mileage') || text.includes('odometer')) {
            console.log(`Found vehicle data API: ${url}`);
            console.log(`Response preview: ${text.substring(0, 500)}`);
          }
        }
      } catch (e) {}
    }
  });

  // First get a valid used vehicle URL from the search page
  const searchUrl = 'https://www.turpindodgeofdubuque.net/searchused.aspx';
  console.log(`Getting used inventory from: ${searchUrl}`);

  await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // Find a vehicle link
  const vehicleUrl = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/used-"]');
    for (const link of links) {
      if (link.href.match(/[A-HJ-NPR-Z0-9]{17}$/i)) {
        return link.href;
      }
    }
    return null;
  });

  if (!vehicleUrl) {
    console.log('No used vehicle found on search page');
    await browser.close();
    return;
  }

  const testUrl = vehicleUrl;
  console.log(`Found vehicle URL: ${testUrl}`);
  console.log(`Navigating to: ${testUrl}`);

  await page.goto(testUrl, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for page to fully load
  await new Promise(r => setTimeout(r, 5000));

  // Debug: Get page content
  const html = await page.content();
  console.log(`Page length: ${html.length} chars`);

  // Search for mileage in raw HTML
  const mileageMatch = html.match(/vehicle-mileage[^>]*>([^<]+)</i);
  console.log('Mileage in HTML:', mileageMatch ? mileageMatch[1] : 'not found');

  // Search for odometer
  const odometerMatch = html.match(/odometer[^>]*>([^<]+)</i);
  console.log('Odometer in HTML:', odometerMatch ? odometerMatch[1] : 'not found');

  // Any "mi" text
  const miMatch = html.match(/(\d[\d,]*)\s*mi/i);
  console.log('MI match in HTML:', miMatch ? miMatch[1] : 'not found');

  // Look for any mileage-related text
  const mileageInfo = await page.evaluate(() => {
    // Find the vehicle-mileage element
    const mileageEl = document.querySelector('.vehicle-mileage');
    if (mileageEl) {
      return {
        found: true,
        text: mileageEl.textContent,
        html: mileageEl.innerHTML
      };
    }

    // Also search body text
    const body = document.body.innerText;
    const match = body.match(/([0-9,]+)\s*mi/gi);
    return {
      found: false,
      matches: match ? match.slice(0, 5) : []
    };
  });
  console.log('Mileage info:', mileageInfo);

  // Check page title
  const title = await page.title();
  console.log('Page title:', title);

  // Check for 404
  const is404 = await page.evaluate(() => {
    return document.body.innerText.includes('Page Not Found') || document.body.innerText.includes('404');
  });
  console.log('Is 404:', is404);

  // Wait for Vue to render
  await page.waitForSelector('.vehicle-mileage, [class*="mileage"]', { timeout: 10000 }).catch(() => console.log('No mileage selector found'));

  // Extract mileage
  const mileage = await page.evaluate(() => {
    const el = document.querySelector('.vehicle-mileage');
    if (el) {
      const text = el.textContent.trim();
      const match = text.match(/([0-9,]+)\s*mi/i);
      return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
    }
    return 0;
  });

  console.log(`Mileage: ${mileage.toLocaleString()} mi`);

  // Extract price
  const price = await page.evaluate(() => {
    const el = document.querySelector('.vehicle-price, .price, [class*="price"]');
    if (el) {
      const text = el.textContent.trim();
      const match = text.match(/\$?([0-9,]+)/);
      return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
    }
    return 0;
  });

  console.log(`Price: $${price.toLocaleString()}`);

  // Extract all photos
  const photos = await page.evaluate(() => {
    const images = [];
    // Look for gallery images
    document.querySelectorAll('img[src*="inventoryphotos"]').forEach(img => {
      let src = img.src || img.dataset.src;
      if (src && !src.includes('/thumbs/')) {
        // Remove query params
        src = src.split('?')[0];
        if (!images.includes(src)) {
          images.push(src);
        }
      }
    });
    return images;
  });

  console.log(`\nPhotos found: ${photos.length}`);
  photos.slice(0, 5).forEach((p, i) => console.log(`  ${i+1}. ${p}`));

  await browser.close();
  console.log('\nDone!');
}

testScrape().catch(console.error);
