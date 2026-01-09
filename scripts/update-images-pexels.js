const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// Verified working Pexels/Pixabay image URLs organized by category
const imagesByCategory = {
  // Sedans - various colors and styles
  sedan: [
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?w=1200',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=1200',
    'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?w=1200',
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=1200',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=1200',
    'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?w=1200',
    'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?w=1200',
    'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?w=1200',
    'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?w=1200',
    'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?w=1200',
    'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?w=1200',
    'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?w=1200',
    'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?w=1200',
    'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?w=1200',
    'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?w=1200'
  ],
  // SUVs and crossovers
  suv: [
    'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=1200',
    'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?w=1200',
    'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?w=1200',
    'https://images.pexels.com/photos/1682409/pexels-photo-1682409.jpeg?w=1200',
    'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?w=1200',
    'https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?w=1200',
    'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?w=1200',
    'https://images.pexels.com/photos/5214420/pexels-photo-5214420.jpeg?w=1200',
    'https://images.pexels.com/photos/3849557/pexels-photo-3849557.jpeg?w=1200',
    'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=1200',
    'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg?w=1200',
    'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?w=1200',
    'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?w=1200',
    'https://images.pexels.com/photos/3729460/pexels-photo-3729460.jpeg?w=1200',
    'https://images.pexels.com/photos/4173209/pexels-photo-4173209.jpeg?w=1200'
  ],
  // Trucks and pickups
  truck: [
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=1200',
    'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg?w=1200',
    'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=1200',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=1200',
    'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg?w=1200',
    'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=1200',
    'https://images.pexels.com/photos/2676095/pexels-photo-2676095.jpeg?w=1200',
    'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?w=1200',
    'https://images.pexels.com/photos/1682409/pexels-photo-1682409.jpeg?w=1200'
  ],
  // Luxury vehicles
  luxury: [
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=1200',
    'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?w=1200',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=1200',
    'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?w=1200',
    'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?w=1200',
    'https://images.pexels.com/photos/3849557/pexels-photo-3849557.jpeg?w=1200',
    'https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?w=1200',
    'https://images.pexels.com/photos/5214420/pexels-photo-5214420.jpeg?w=1200',
    'https://images.pexels.com/photos/4173209/pexels-photo-4173209.jpeg?w=1200',
    'https://images.pexels.com/photos/3729460/pexels-photo-3729460.jpeg?w=1200'
  ],
  // Electric/Tesla
  electric: [
    'https://images.pexels.com/photos/13861/IMG_3546.jpg?w=1200',
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=1200',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=1200',
    'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?w=1200'
  ],
  // Sports/Performance
  sports: [
    'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?w=1200',
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=1200',
    'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?w=1200',
    'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?w=1200',
    'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?w=1200'
  ],
  // Off-road
  offroad: [
    'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=1200',
    'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg?w=1200',
    'https://images.pexels.com/photos/1682409/pexels-photo-1682409.jpeg?w=1200',
    'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?w=1200',
    'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?w=1200'
  ]
};

// Map each car model to its category
const carCategoryMap = {
  // Sedans
  'Camry SE': 'sedan',
  'Accord Touring': 'sedan',
  '330i xDrive': 'luxury',
  'C300 4MATIC': 'luxury',
  'ES 350': 'luxury',
  'A4 Prestige': 'luxury',
  'Model 3 Long Range': 'electric',
  'TLX A-Spec': 'luxury',
  'Mazda6 Signature': 'sedan',
  'G70 3.3T Sport': 'sports',
  'Sonata SEL Plus': 'sedan',
  'K5 GT-Line': 'sedan',
  'Altima SR': 'sedan',
  'Passat SEL': 'sedan',
  'Legacy Limited': 'sedan',

  // SUVs
  'RAV4 XLE Premium': 'suv',
  'CR-V EX-L': 'suv',
  'CX-5 Turbo': 'suv',
  'RX 350 F Sport': 'luxury',
  'X3 M40i': 'luxury',
  'Q5 Premium Plus': 'luxury',
  'GLC 300 4MATIC': 'luxury',
  'XC60 T6 Inscription': 'luxury',
  'RDX A-Spec': 'suv',
  'QX50 Sensory': 'suv',
  'Tucson Limited': 'suv',
  'Sportage SX-Prestige': 'suv',
  'Outback Touring XT': 'suv',
  'Atlas SEL Premium': 'suv',
  'CX-9 Signature': 'suv',

  // Trucks
  'F-150 Lariat': 'truck',
  'Silverado 1500 High Country': 'truck',
  '1500 Laramie': 'truck',
  '1500': 'truck',
  'Sierra 1500 Denali': 'truck',
  'Tacoma TRD Pro': 'truck',
  'Tundra TRD Pro': 'truck',
  'Colorado ZR2': 'truck',
  'Frontier Pro-4X': 'truck',

  // Off-road
  'Wrangler Rubicon 4xe': 'offroad',
  'Bronco Badlands': 'offroad',

  // Luxury SUVs
  'Macan S': 'luxury',
  'X5 M50i': 'luxury',
  'GLE 450 4MATIC': 'luxury',
  'Q7 Prestige': 'luxury',
  'Escalade Premium Luxury': 'luxury',
  'Navigator Reserve': 'luxury',
  'Range Rover Sport HSE': 'luxury',
  'Levante GT': 'luxury',
  'Stelvio Ti Sport': 'luxury',
  'GV80 3.5T Prestige': 'luxury',

  // Sports
  'Camaro': 'sports'
};

// Keep track of used images to ensure variety
const usedIndices = {};

function getImageUrl(model) {
  const category = carCategoryMap[model] || 'sedan';
  const images = imagesByCategory[category] || imagesByCategory.sedan;

  if (!usedIndices[category]) {
    usedIndices[category] = 0;
  }

  const index = usedIndices[category] % images.length;
  usedIndices[category]++;

  return images[index];
}

async function downloadImage(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    timeout: 30000,
    maxRedirects: 5
  });
  return Buffer.from(response.data);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Updating car images with Pexels photos...\n');

  const cars = await prisma.car.findMany({
    select: { id: true, vin: true, make: true, model: true, year: true },
    orderBy: { make: 'asc' }
  });

  let updated = 0, failed = 0;

  for (const car of cars) {
    const imgUrl = getImageUrl(car.model);

    try {
      process.stdout.write(`${car.year} ${car.make} ${car.model}... `);

      const buffer = await downloadImage(imgUrl);

      if (buffer.length < 10000) {
        throw new Error('Image too small');
      }

      const blob = await put(`cars/${car.vin.toLowerCase()}-pexels.jpg`, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: true
      });

      await prisma.car.update({
        where: { vin: car.vin },
        data: { photos: JSON.stringify([blob.url]) }
      });

      console.log(`✓ Done (${Math.round(buffer.length / 1024)}KB)`);
      updated++;

      // Small delay between requests
      await sleep(300);
    } catch (error) {
      console.log(`✗ ${error.message}`);
      failed++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Updated: ${updated}, Failed: ${failed}`);
  console.log(`${'='.repeat(50)}`);
}

process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_YzKbVK1txuE5Y0mL_hx4preAchubkJUUNTUtXtJoDwCeitw';
main().catch(console.error).finally(() => prisma.$disconnect());
