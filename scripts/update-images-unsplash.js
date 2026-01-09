const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// Use Unsplash Source API for free car images
// Format: https://source.unsplash.com/1600x900/?{make},{model},{color}
function getUnsplashUrl(make, model, category) {
  const searchTerms = [
    make.toLowerCase().replace('-', ''),
    model.split(' ')[0].toLowerCase(),
    category
  ].filter(Boolean).join(',');
  return `https://source.unsplash.com/1600x900/?${searchTerms}`;
}

// Categories for each car type
const carCategories = {
  // Sedans
  'Camry SE': 'sedan,white',
  'Accord Touring': 'sedan,silver',
  '330i xDrive': 'bmw,sedan',
  'C300 4MATIC': 'mercedes,sedan',
  'ES 350': 'lexus,sedan',
  'A4 Prestige': 'audi,sedan',
  'Model 3 Long Range': 'tesla,electric',
  'TLX A-Spec': 'sedan,luxury',
  'Mazda6 Signature': 'sedan,red',
  'G70 3.3T Sport': 'sedan,sport',
  'Sonata SEL Plus': 'sedan,modern',
  'K5 GT-Line': 'sedan,sport',
  'Altima SR': 'sedan,grey',
  'Passat SEL': 'sedan,silver',
  'Legacy Limited': 'sedan,subaru',

  // SUVs
  'RAV4 XLE Premium': 'suv,toyota',
  'CR-V EX-L': 'suv,honda',
  'CX-5 Turbo': 'suv,mazda',
  'RX 350 F Sport': 'suv,lexus',
  'X3 M40i': 'suv,bmw',
  'Q5 Premium Plus': 'suv,audi',
  'GLC 300 4MATIC': 'suv,mercedes',
  'XC60 T6 Inscription': 'suv,volvo',
  'RDX A-Spec': 'suv,acura',
  'QX50 Sensory': 'suv,luxury',
  'Tucson Limited': 'suv,hyundai',
  'Sportage SX-Prestige': 'suv,kia',
  'Outback Touring XT': 'suv,subaru',
  'Atlas SEL Premium': 'suv,volkswagen',
  'CX-9 Signature': 'suv,large',

  // Trucks
  'F-150 Lariat': 'truck,ford',
  'Silverado 1500 High Country': 'truck,chevrolet',
  '1500 Laramie': 'truck,ram',
  '1500': 'truck,pickup',
  'Sierra 1500 Denali': 'truck,gmc',
  'Tacoma TRD Pro': 'truck,toyota',
  'Tundra TRD Pro': 'truck,toyota',
  'Colorado ZR2': 'truck,chevrolet',
  'Frontier Pro-4X': 'truck,nissan',

  // Off-road
  'Wrangler Rubicon 4xe': 'jeep,offroad',
  'Bronco Badlands': 'ford,bronco',

  // Luxury SUVs
  'Macan S': 'porsche,suv',
  'X5 M50i': 'bmw,suv',
  'GLE 450 4MATIC': 'mercedes,suv',
  'Q7 Prestige': 'audi,suv',
  'Escalade Premium Luxury': 'cadillac,suv',
  'Navigator Reserve': 'lincoln,suv',
  'Range Rover Sport HSE': 'range,rover',
  'Levante GT': 'maserati,suv',
  'Stelvio Ti Sport': 'alfa,romeo',
  'GV80 3.5T Prestige': 'genesis,suv',
  'Camaro': 'chevrolet,camaro'
};

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
  console.log('Updating car images with Unsplash photos...\n');

  const cars = await prisma.car.findMany({
    select: { id: true, vin: true, make: true, model: true, year: true }
  });

  let updated = 0, failed = 0;

  for (const car of cars) {
    const category = carCategories[car.model] || 'car,automobile';
    const imgUrl = getUnsplashUrl(car.make, car.model, category.split(',')[0]);

    try {
      process.stdout.write(`${car.year} ${car.make} ${car.model}... `);

      const buffer = await downloadImage(imgUrl);

      // Check if we got a valid image (at least 10KB)
      if (buffer.length < 10000) {
        throw new Error('Image too small');
      }

      const blob = await put(`cars/${car.vin.toLowerCase()}-unsplash.jpg`, buffer, {
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

      // Small delay to avoid rate limiting
      await sleep(500);
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
