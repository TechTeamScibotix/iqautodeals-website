const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

// Using Imagin Studio's free car image API
// Format: https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=BMW&modelFamily=3%20Series&modelYear=2022&angle=front
// or: https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=Toyota&modelFamily=Camry&modelYear=2023

const IMAGIN_CUSTOMER = 'hrjavascript-mastery'; // Free demo customer key

// Map our car data to Imagin API format
function getImaginUrl(make, model, year, angle = 'front') {
  // Clean up model names to get the model family
  let modelFamily = model
    .replace(/SE|SEL|Plus|Touring|Premium|Prestige|A-Spec|Sport|TRD Pro|Limited|Signature|Turbo|F Sport|xDrive|4MATIC|M40i|Lariat|High Country|Laramie|Denali|Badlands|ZR2|Rubicon|4xe|Pro-4X|Long Range|Ti/gi, '')
    .trim()
    .replace(/\s+/g, ' ')
    .trim();

  // Handle specific model mappings
  const modelMappings = {
    'Camry': 'Camry',
    'Accord': 'Accord',
    '330i': '3 Series',
    'C300': 'C-Class',
    'ES 350': 'ES',
    'A4': 'A4',
    'Model 3': 'Model 3',
    'TLX': 'TLX',
    'Mazda6': '6',
    'G70': 'G70',
    'RAV4 XLE': 'RAV4',
    'CR-V EX-L': 'CR-V',
    'CX-5': 'CX-5',
    'RX 350': 'RX',
    'X3': 'X3',
    'Q5': 'Q5',
    'GLC 300': 'GLC-Class',
    'XC60 T6 Inscription': 'XC60',
    'RDX': 'RDX',
    'QX50 Sensory': 'QX50',
    'F-150': 'F-150',
    'Silverado 1500': 'Silverado',
    '1500': '1500',
    'Sierra 1500': 'Sierra',
    'Tacoma': 'Tacoma',
    'Wrangler': 'Wrangler',
    'Bronco': 'Bronco',
    'Colorado': 'Colorado',
    'Tundra': 'Tundra',
    'Frontier': 'Frontier',
    'Macan S': 'Macan',
    'X5': 'X5',
    'GLE 450': 'GLE-Class',
    'Q7': 'Q7',
    'Escalade': 'Escalade',
    'Navigator Reserve': 'Navigator',
    'Range Rover Sport HSE': 'Range Rover Sport',
    'Levante GT': 'Levante',
    'Stelvio': 'Stelvio',
    'GV80 3.5T': 'GV80',
    'Sonata SEL': 'Sonata',
    'K5 GT-Line': 'K5',
    'Altima SR': 'Altima',
    'Passat SEL': 'Passat',
    'Legacy': 'Legacy',
    'Tucson': 'Tucson',
    'Sportage SX-Prestige': 'Sportage',
    'Outback Touring XT': 'Outback',
    'Atlas SEL': 'Atlas',
    'CX-9': 'CX-9'
  };

  // Find the best match
  let bestMatch = modelFamily;
  for (const [key, value] of Object.entries(modelMappings)) {
    if (model.includes(key) || modelFamily.includes(key)) {
      bestMatch = value;
      break;
    }
  }

  // Handle brand names
  let cleanMake = make;
  if (make === 'Mercedes-Benz') cleanMake = 'Mercedes-Benz';
  if (make === 'Land Rover') cleanMake = 'Land Rover';
  if (make === 'Alfa Romeo') cleanMake = 'Alfa Romeo';

  const params = new URLSearchParams({
    customer: IMAGIN_CUSTOMER,
    make: cleanMake,
    modelFamily: bestMatch,
    modelYear: year.toString(),
    angle: angle
  });

  return `https://cdn.imagin.studio/getimage?${params.toString()}`;
}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
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
      reject(new Error('Timeout'));
    });
  });
}

async function uploadToBlob(buffer, filename) {
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: 'image/png',
    addRandomSuffix: true,
  });
  return blob.url;
}

async function updateCarImages() {
  console.log('Fetching model-specific car images from Imagin Studio API...\n');

  const cars = await prisma.car.findMany({
    select: { id: true, vin: true, make: true, model: true, year: true }
  });

  let updated = 0;
  let failed = 0;

  for (const car of cars) {
    try {
      console.log(`Processing ${car.year} ${car.make} ${car.model}...`);
      const uploadedUrls = [];

      // Get front angle
      const frontUrl = getImaginUrl(car.make, car.model, car.year, 'front');
      console.log(`  Fetching front view...`);
      const frontBuffer = await downloadImage(frontUrl);
      const frontBlob = await uploadToBlob(frontBuffer, `cars/${car.vin.toLowerCase()}-front.png`);
      uploadedUrls.push(frontBlob);

      // Get side angle
      const sideUrl = getImaginUrl(car.make, car.model, car.year, 'side');
      console.log(`  Fetching side view...`);
      const sideBuffer = await downloadImage(sideUrl);
      const sideBlob = await uploadToBlob(sideBuffer, `cars/${car.vin.toLowerCase()}-side.png`);
      uploadedUrls.push(sideBlob);

      // Update database
      await prisma.car.update({
        where: { vin: car.vin },
        data: { photos: JSON.stringify(uploadedUrls) }
      });

      console.log(`✓ Updated ${car.make} ${car.model} with ${uploadedUrls.length} model-specific images\n`);
      updated++;

    } catch (error) {
      console.log(`✗ Failed ${car.make} ${car.model}: ${error.message}\n`);
      failed++;
    }
  }

  console.log('='.repeat(50));
  console.log('Update Complete!');
  console.log(`  Updated: ${updated} cars`);
  console.log(`  Failed: ${failed} cars`);
  console.log('='.repeat(50));
}

process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_YzKbVK1txuE5Y0mL_hx4preAchubkJUUNTUtXtJoDwCeitw';

updateCarImages()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
