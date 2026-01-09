const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();

// Free, reliable image URLs for each car category
// Using Pexels and Pixabay images which allow hotlinking
const carImageSources = {
  // Sedans
  'sedan-black': [
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?w=800',
    'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?w=800'
  ],
  'sedan-white': [
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800',
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=800'
  ],
  'sedan-silver': [
    'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?w=800',
    'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?w=800'
  ],
  'sedan-red': [
    'https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg?w=800',
    'https://images.pexels.com/photos/810357/pexels-photo-810357.jpeg?w=800'
  ],
  'sedan-blue': [
    'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?w=800',
    'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?w=800'
  ],

  // Luxury Sedans
  'luxury-black': [
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=800',
    'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?w=800'
  ],
  'luxury-white': [
    'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?w=800',
    'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?w=800'
  ],
  'luxury-silver': [
    'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?w=800',
    'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?w=800'
  ],

  // SUVs
  'suv-black': [
    'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=800',
    'https://images.pexels.com/photos/1682409/pexels-photo-1682409.jpeg?w=800'
  ],
  'suv-white': [
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=800',
    'https://images.pexels.com/photos/1592385/pexels-photo-1592385.jpeg?w=800'
  ],
  'suv-gray': [
    'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?w=800',
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800'
  ],
  'suv-red': [
    'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?w=800',
    'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?w=800'
  ],
  'suv-blue': [
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=800',
    'https://images.pexels.com/photos/977003/pexels-photo-977003.jpeg?w=800'
  ],

  // Trucks
  'truck-black': [
    'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?w=800',
    'https://images.pexels.com/photos/8968317/pexels-photo-8968317.jpeg?w=800'
  ],
  'truck-white': [
    'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg?w=800',
    'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg?w=800'
  ],
  'truck-red': [
    'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?w=800',
    'https://images.pexels.com/photos/68703/pexels-photo-68703.jpeg?w=800'
  ],
  'truck-gray': [
    'https://images.pexels.com/photos/9607320/pexels-photo-9607320.jpeg?w=800',
    'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?w=800'
  ],

  // Off-road/Jeep
  'offroad-blue': [
    'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=800',
    'https://images.pexels.com/photos/210143/pexels-photo-210143.jpeg?w=800'
  ],
  'offroad-gray': [
    'https://images.pexels.com/photos/12183076/pexels-photo-12183076.jpeg?w=800',
    'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=800'
  ],

  // Sports/Electric
  'sports-white': [
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=800'
  ],
  'electric-white': [
    'https://images.pexels.com/photos/12861856/pexels-photo-12861856.jpeg?w=800',
    'https://images.pexels.com/photos/13861/pexels-photo-13861.jpeg?w=800'
  ]
};

// Map each car VIN to a specific image category based on its type
const vinToCategoryMap = {
  // DEALER 1 - Sedans
  '4T1G11AK8PU123001': 'sedan-black',      // Toyota Camry - Black
  '1HGCV1F92NA123002': 'sedan-white',      // Honda Accord - White
  'WBA5R1C05NDT23003': 'luxury-white',     // BMW 330i - White
  'W1KCG5DB1RA123004': 'luxury-black',     // Mercedes C300 - Black
  '58ABZ1B10NU123005': 'luxury-silver',    // Lexus ES 350 - Silver
  'WAUC4AF40PA123006': 'luxury-black',     // Audi A4 - Black
  '5YJ3E1EB2PF123007': 'electric-white',   // Tesla Model 3 - White
  '19UUB6F59NA123008': 'sedan-red',        // Acura TLX - Red
  'JM1GL1WM6M1123009': 'sedan-blue',       // Mazda6 - Blue
  'KMTG34TA5NU123010': 'luxury-white',     // Genesis G70 - White

  // DEALER 2 - SUVs
  'JTMB1RFV4PD223001': 'suv-gray',         // Toyota RAV4 - Gray
  '7FARW2H88NE223002': 'suv-gray',         // Honda CR-V - Gray
  'JM3KFBEY7P0223003': 'suv-red',          // Mazda CX-5 - Red
  '2T2BZMCA9NC223004': 'suv-black',        // Lexus RX 350 - Black
  '5UX53DP08P9223005': 'suv-gray',         // BMW X3 - Gray
  'WA1BVAFY9N2223006': 'suv-blue',         // Audi Q5 - Blue
  'WDC0G8EB9PV223007': 'suv-gray',         // Mercedes GLC - Silver
  'YV4A22PL7N2223008': 'suv-gray',         // Volvo XC60 - Gray
  '5J8TC2H79PL223009': 'suv-blue',         // Acura RDX - Blue
  '3PCAJ5M31NF223010': 'suv-gray',         // Infiniti QX50 - Gray

  // DEALER 3 - Trucks
  '1FTFW1E85NFA33001': 'truck-red',        // Ford F-150 - Red
  '1GCUYGEL3PF333002': 'truck-black',      // Chevy Silverado - Black
  '1C6SRFFT6NN333003': 'truck-gray',       // Ram 1500 - Gray
  '1GTU9EED3PZ333004': 'truck-black',      // GMC Sierra - Black
  '3TYCZ5AN2PT333005': 'truck-red',        // Toyota Tacoma - Orange
  '1C4JJXFN0PW333006': 'offroad-blue',     // Jeep Wrangler - Blue
  '1FMDE5BH9NLA333007': 'offroad-gray',    // Ford Bronco - Gray
  '1GCGTCEN8P1333008': 'truck-gray',       // Chevy Colorado - Gray
  '5TFDY5F18PX333009': 'truck-gray',       // Toyota Tundra - Gray
  '1N6ED1EJ3NN333010': 'truck-gray',       // Nissan Frontier - Gray

  // DEALER 4 - Luxury SUVs
  'WP1AB2A59PKA44001': 'suv-gray',         // Porsche Macan - Gray
  '5UXCR6C03P9K44002': 'suv-blue',         // BMW X5 - Blue
  '4JGFB4KB9PA44003': 'suv-gray',          // Mercedes GLE - Gray
  'WA1LHBF79ND44004': 'suv-gray',          // Audi Q7 - Gray
  '1GYS4FKL6PR44005': 'suv-black',         // Cadillac Escalade - Black
  '5LMJJ3LT3NEL44006': 'suv-white',        // Lincoln Navigator - White
  'SALWS2SE6PA44007': 'suv-black',         // Range Rover - Black
  'ZN661XUA6NX44008': 'suv-blue',          // Maserati Levante - Blue
  'ZASPAKBN8P7C44009': 'suv-gray',         // Alfa Romeo Stelvio - Gray
  'KMUHB8DB5PU44010': 'suv-white',         // Genesis GV80 - White

  // DEALER 5 - Value Vehicles
  '5NPE34AF5PH555001': 'sedan-silver',     // Hyundai Sonata - Gray
  '5XXG84J20PG555002': 'sedan-silver',     // Kia K5 - Gray
  '1N4BL4FV8NC555003': 'sedan-blue',       // Nissan Altima - Blue
  '1VWCA7A32MC555004': 'sedan-white',      // VW Passat - White
  '4S3BWAN67P3555005': 'sedan-silver',     // Subaru Legacy - Gray
  '5NMJE3AE0PH555006': 'suv-gray',         // Hyundai Tucson - Gray
  'KNDPM3ACXP7555007': 'suv-red',          // Kia Sportage - Red
  '4S4BTGND7P3555008': 'suv-gray',         // Subaru Outback - Green
  '1V2GR2CA9NC555009': 'suv-blue',         // VW Atlas - Blue
  'JM3TCBEY9N0555010': 'suv-gray',         // Mazda CX-9 - Gray
};

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function uploadToBlob(buffer, filename) {
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
  });
  return blob.url;
}

async function updateCarPhotos() {
  console.log('Starting car image upload to Vercel Blob...\n');

  let updatedCount = 0;
  let errorCount = 0;

  const cars = await prisma.car.findMany({
    select: { id: true, vin: true, make: true, model: true, year: true, color: true }
  });

  for (const car of cars) {
    const category = vinToCategoryMap[car.vin];
    if (!category) {
      console.log(`⚠ No category mapping for VIN ${car.vin}`);
      errorCount++;
      continue;
    }

    const sourceUrls = carImageSources[category];
    if (!sourceUrls) {
      console.log(`⚠ No images for category ${category}`);
      errorCount++;
      continue;
    }

    try {
      const uploadedUrls = [];

      for (let i = 0; i < sourceUrls.length; i++) {
        const url = sourceUrls[i];
        console.log(`  Downloading image ${i + 1} for ${car.year} ${car.make} ${car.model}...`);

        const buffer = await downloadImage(url);
        const filename = `cars/${car.vin.toLowerCase()}-${i + 1}.jpg`;

        console.log(`  Uploading to Vercel Blob...`);
        const blobUrl = await uploadToBlob(buffer, filename);
        uploadedUrls.push(blobUrl);
      }

      // Update database with new URLs
      await prisma.car.update({
        where: { vin: car.vin },
        data: { photos: JSON.stringify(uploadedUrls) }
      });

      console.log(`✓ Updated ${car.year} ${car.make} ${car.model} with ${uploadedUrls.length} images\n`);
      updatedCount++;

    } catch (error) {
      console.log(`✗ Failed ${car.make} ${car.model}: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log('='.repeat(50));
  console.log(`Upload Complete!`);
  console.log(`  Updated: ${updatedCount} cars`);
  console.log(`  Errors: ${errorCount}`);
  console.log('='.repeat(50));
}

// Set the token from environment
process.env.BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ||
  'vercel_blob_rw_YzKbVK1txuE5Y0mL_hx4preAchubkJUUNTUtXtJoDwCeitw';

updateCarPhotos()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
