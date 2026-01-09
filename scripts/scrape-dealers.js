const fs = require('fs');
const https = require('https');

// Google Places API Key - Get yours at: https://console.cloud.google.com/apis/credentials
// Enable "Places API" in your Google Cloud project
// You get $200 free credit per month (about 10,000 searches)
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('\n❌ Error: GOOGLE_PLACES_API_KEY environment variable is required');
  console.log('\nTo get an API key:');
  console.log('1. Go to https://console.cloud.google.com/apis/credentials');
  console.log('2. Create a new project (or select existing)');
  console.log('3. Enable "Places API" and "Places API (New)"');
  console.log('4. Create an API key');
  console.log('5. Run: GOOGLE_PLACES_API_KEY="your-key" node scripts/scrape-dealers.js\n');
  process.exit(1);
}

// Georgia cities to search - add more as needed
const CITIES = [
  'Atlanta, GA',
  'Augusta, GA',
  'Columbus, GA',
  'Macon, GA',
  'Savannah, GA',
  'Athens, GA',
  'Sandy Springs, GA',
  'Roswell, GA',
  'Johns Creek, GA',
  'Albany, GA',
  'Warner Robins, GA',
  'Alpharetta, GA',
  'Marietta, GA',
  'Valdosta, GA',
  'Smyrna, GA',
  'Dunwoody, GA',
  'Rome, GA',
  'Peachtree City, GA',
  'Gainesville, GA',
  'Brookhaven, GA',
  'Newnan, GA',
  'Dalton, GA',
  'Woodstock, GA',
  'Lawrenceville, GA',
  'Duluth, GA',
  'Kennesaw, GA',
  'Statesboro, GA',
  'Carrollton, GA',
  'Canton, GA',
  'McDonough, GA',
  'Acworth, GA',
  'Griffin, GA',
  'Pooler, GA',
  'Union City, GA',
  'Douglasville, GA',
  'Hinesville, GA',
  'Chamblee, GA',
  'Snellville, GA',
  'Fayetteville, GA',
  'Stockbridge, GA',
];

// Search queries to find dealers
const SEARCH_QUERIES = [
  'car dealership',
  'used car dealer',
  'auto dealer',
  'new car dealer',
];

const allDealers = new Map(); // Use Map to deduplicate by place_id

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function searchPlaces(query, city) {
  const searchQuery = encodeURIComponent(`${query} in ${city}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${API_KEY}`;

  try {
    const response = await makeRequest(url);

    if (response.status === 'OK' || response.status === 'ZERO_RESULTS') {
      return response.results || [];
    } else {
      console.error(`API Error for ${city}: ${response.status} - ${response.error_message || ''}`);
      return [];
    }
  } catch (error) {
    console.error(`Request error for ${city}:`, error.message);
    return [];
  }
}

async function getPlaceDetails(placeId) {
  const fields = 'name,formatted_address,formatted_phone_number,website,url,business_status,types,rating,user_ratings_total';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;

  try {
    const response = await makeRequest(url);
    if (response.status === 'OK') {
      return response.result;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function extractEmailFromWebsite(website) {
  // This would require actually fetching the website - placeholder for now
  return '';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚗 IQ Auto Deals - Dealer Lead Scraper');
  console.log('=====================================\n');
  console.log(`Searching ${CITIES.length} cities in Georgia...\n`);

  let totalFound = 0;

  for (const city of CITIES) {
    process.stdout.write(`📍 ${city}... `);
    let cityCount = 0;

    for (const query of SEARCH_QUERIES) {
      const places = await searchPlaces(query, city);

      for (const place of places) {
        if (!allDealers.has(place.place_id)) {
          allDealers.set(place.place_id, {
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating || '',
            totalRatings: place.user_ratings_total || 0,
            city: city,
          });
          cityCount++;
          totalFound++;
        }
      }

      // Rate limiting - Google allows 10 requests/second
      await sleep(150);
    }

    console.log(`Found ${cityCount} dealers`);
  }

  console.log(`\n✅ Found ${totalFound} unique dealers. Fetching details...\n`);

  // Get detailed info for each dealer
  const dealers = Array.from(allDealers.values());
  const detailedDealers = [];
  let processed = 0;

  for (const dealer of dealers) {
    processed++;
    process.stdout.write(`\rFetching details: ${processed}/${dealers.length}`);

    const details = await getPlaceDetails(dealer.placeId);

    if (details) {
      detailedDealers.push({
        name: details.name || dealer.name,
        address: details.formatted_address || dealer.address,
        phone: details.formatted_phone_number || '',
        website: details.website || '',
        googleMapsUrl: details.url || '',
        rating: details.rating || dealer.rating,
        totalReviews: details.user_ratings_total || dealer.totalRatings,
        status: details.business_status || 'UNKNOWN',
        searchCity: dealer.city,
      });
    } else {
      detailedDealers.push({
        name: dealer.name,
        address: dealer.address,
        phone: '',
        website: '',
        googleMapsUrl: '',
        rating: dealer.rating,
        totalReviews: dealer.totalRatings,
        status: 'UNKNOWN',
        searchCity: dealer.city,
      });
    }

    // Rate limiting
    await sleep(100);
  }

  console.log('\n');

  // Filter for operational businesses only
  const activeDealers = detailedDealers.filter(d => d.status !== 'CLOSED_PERMANENTLY');

  // Sort by rating (best first)
  activeDealers.sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0);
    return (b.totalReviews || 0) - (a.totalReviews || 0);
  });

  // Create CSV
  const csvHeader = 'Name,Address,Phone,Website,Google Maps,Rating,Reviews,City\n';
  const csvRows = activeDealers.map(d => {
    const escape = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
    return [
      escape(d.name),
      escape(d.address),
      escape(d.phone),
      escape(d.website),
      escape(d.googleMapsUrl),
      d.rating || '',
      d.totalReviews || '',
      escape(d.searchCity),
    ].join(',');
  }).join('\n');

  const csv = csvHeader + csvRows;
  const filename = `georgia-car-dealers-${new Date().toISOString().split('T')[0]}.csv`;
  fs.writeFileSync(filename, csv);

  console.log('📊 Results Summary:');
  console.log(`   Total dealers found: ${activeDealers.length}`);
  console.log(`   With phone numbers: ${activeDealers.filter(d => d.phone).length}`);
  console.log(`   With websites: ${activeDealers.filter(d => d.website).length}`);
  console.log(`\n✅ Saved to: ${filename}\n`);

  // Also create a summary by city
  const byCity = {};
  activeDealers.forEach(d => {
    const city = d.searchCity;
    if (!byCity[city]) byCity[city] = 0;
    byCity[city]++;
  });

  console.log('📍 Dealers by City:');
  Object.entries(byCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([city, count]) => {
      console.log(`   ${city}: ${count}`);
    });

  if (Object.keys(byCity).length > 15) {
    console.log(`   ... and ${Object.keys(byCity).length - 15} more cities`);
  }

  console.log('\n🎯 Next Steps:');
  console.log('   1. Open the CSV in Excel/Google Sheets');
  console.log('   2. Use Hunter.io or Apollo.io to find emails from websites');
  console.log('   3. Send personalized outreach emails');
  console.log('   4. Consider using email verification (NeverBounce, ZeroBounce)\n');
}

main().catch(console.error);
