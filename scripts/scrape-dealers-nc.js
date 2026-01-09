const fs = require('fs');
const https = require('https');

// Google Places API Key
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('\n❌ Error: GOOGLE_PLACES_API_KEY environment variable is required');
  console.log('\nRun: GOOGLE_PLACES_API_KEY="your-key" node scripts/scrape-dealers-nc.js\n');
  process.exit(1);
}

// North Carolina cities to search
const CITIES = [
  'Charlotte, NC',
  'Raleigh, NC',
  'Greensboro, NC',
  'Durham, NC',
  'Winston-Salem, NC',
  'Fayetteville, NC',
  'Cary, NC',
  'Wilmington, NC',
  'High Point, NC',
  'Concord, NC',
  'Asheville, NC',
  'Gastonia, NC',
  'Jacksonville, NC',
  'Chapel Hill, NC',
  'Rocky Mount, NC',
  'Huntersville, NC',
  'Burlington, NC',
  'Wilson, NC',
  'Kannapolis, NC',
  'Apex, NC',
  'Hickory, NC',
  'Greenville, NC',
  'Wake Forest, NC',
  'Indian Trail, NC',
  'Mooresville, NC',
  'Goldsboro, NC',
  'Monroe, NC',
  'Salisbury, NC',
  'New Bern, NC',
  'Holly Springs, NC',
  'Matthews, NC',
  'Sanford, NC',
  'Cornelius, NC',
  'Lumberton, NC',
  'Kernersville, NC',
  'Mint Hill, NC',
  'Morrisville, NC',
  'Statesville, NC',
  'Garner, NC',
  'Fuquay-Varina, NC',
];

// Search queries to find dealers
const SEARCH_QUERIES = [
  'car dealership',
  'used car dealer',
  'auto dealer',
];

const allDealers = new Map();

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚗 IQ Auto Deals - NC Dealer Lead Scraper');
  console.log('==========================================\n');
  console.log(`Searching ${CITIES.length} cities in North Carolina...\n`);

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

      await sleep(150);
    }

    console.log(`Found ${cityCount} dealers`);
  }

  console.log(`\n✅ Found ${totalFound} unique dealers. Fetching details...\n`);

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

    await sleep(100);
  }

  console.log('\n');

  const activeDealers = detailedDealers.filter(d => d.status !== 'CLOSED_PERMANENTLY');

  activeDealers.sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0);
    return (b.totalReviews || 0) - (a.totalReviews || 0);
  });

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
  const filename = `nc-car-dealers-${new Date().toISOString().split('T')[0]}.csv`;
  fs.writeFileSync(filename, csv);

  console.log('📊 Results Summary:');
  console.log(`   Total dealers found: ${activeDealers.length}`);
  console.log(`   With phone numbers: ${activeDealers.filter(d => d.phone).length}`);
  console.log(`   With websites: ${activeDealers.filter(d => d.website).length}`);
  console.log(`\n✅ Saved to: ${filename}\n`);
}

main().catch(console.error);
