/**
 * Test fetching vehicle detail pages from DealerOn
 */

async function testDetailPages() {
  const baseUrl = 'https://www.turpindodgeofdubuque.net';
  const inventoryUrl = `${baseUrl}/searchused.aspx`;

  console.log('Fetching inventory page to find vehicle URLs...\n');

  const response = await fetch(inventoryUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  const html = await response.text();

  // Look for vehicle detail URLs - DealerOn uses patterns like:
  // /used/Vehicle-Name/VIN
  // /used-Vehicle/VIN.htm
  // /VehicleDetails?...vin=XXX
  const urlPatterns = [
    /href="(\/used[^"]*[A-HJ-NPR-Z0-9]{17}[^"]*)"/gi,
    /href="(\/vehicle[^"]*[A-HJ-NPR-Z0-9]{17}[^"]*)"/gi,
    /href="([^"]*VehicleDetails[^"]*)"/gi,
  ];

  const foundUrls = new Set();

  for (const pattern of urlPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = baseUrl + url;
      }
      foundUrls.add(url);
    }
  }

  console.log(`Found ${foundUrls.size} potential vehicle URLs\n`);

  // Test first URL
  const urls = [...foundUrls];
  if (urls.length > 0) {
    const testUrl = urls[0];
    console.log(`Testing first URL: ${testUrl}\n`);

    const detailResponse = await fetch(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!detailResponse.ok) {
      console.log(`Failed to fetch: ${detailResponse.status}`);
      return;
    }

    const detailHtml = await detailResponse.text();
    console.log(`Detail page size: ${(detailHtml.length / 1024).toFixed(1)} KB\n`);

    // Look for JSON-LD
    const jsonLdMatches = [...detailHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    console.log(`Found ${jsonLdMatches.length} JSON-LD blocks\n`);

    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1].trim());
        if (data['@type'] === 'Vehicle' || data['@type'] === 'Car' || data['@type'] === 'Product') {
          console.log('=== Found Vehicle JSON-LD ===');
          console.log(`VIN: ${data.vehicleIdentificationNumber || data.vin}`);
          console.log(`Year: ${data.vehicleModelDate}`);
          console.log(`Make: ${data.brand?.name || data.manufacturer?.name}`);
          console.log(`Model: ${data.model?.name || data.model}`);
          console.log(`Price: ${data.offers?.price}`);
          console.log(`Mileage: ${data.mileageFromOdometer?.value}`);
          console.log(`Color: ${data.color}`);

          // Count images
          const images = data.image;
          if (images) {
            const imageUrls = Array.isArray(images) ? images : [images];
            console.log(`Images: ${imageUrls.length}`);
            if (imageUrls.length > 0) {
              console.log(`First image: ${typeof imageUrls[0] === 'string' ? imageUrls[0] : imageUrls[0].url || imageUrls[0].contentUrl}`);
            }
          }
        }
      } catch (e) {
        // Not valid JSON
      }
    }

    // Also look for image URLs
    const imagePattern = /src="([^"]+(?:photos|vehicle|inventory)[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi;
    const images = new Set();
    let imgMatch;
    while ((imgMatch = imagePattern.exec(detailHtml)) !== null) {
      let imgUrl = imgMatch[1];
      if (imgUrl.startsWith('/')) {
        imgUrl = baseUrl + imgUrl;
      }
      images.add(imgUrl);
    }

    console.log(`\nFound ${images.size} images on detail page`);
    if (images.size > 0) {
      console.log('\nSample images:');
      [...images].slice(0, 3).forEach((img) => console.log(`  ${img}`));
    }
  }
}

testDetailPages().catch(console.error);
