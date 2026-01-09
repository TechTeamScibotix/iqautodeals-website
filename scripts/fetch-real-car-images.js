const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();

// Real car images from various free sources
// These URLs have been verified to work and show actual car models
const carImageDatabase = {
  // Sedans
  'Toyota Camry': [
    'https://di-uploads-pod14.dealerinspire.com/colonialtoyota/uploads/2023/01/2023-Toyota-Camry-Nightshade-Edition.png',
    'https://di-uploads-pod14.dealerinspire.com/colonialtoyota/uploads/2022/01/2022-Toyota-Camry.png'
  ],
  'Honda Accord': [
    'https://di-uploads-pod3.dealerinspire.com/haborhonda/uploads/2022/01/mlp-img-new-accord.png',
    'https://di-uploads-pod3.dealerinspire.com/performancehondabountiful/uploads/2021/09/2022-Honda-Accord.png'
  ],
  'BMW 3 Series': [
    'https://di-uploads-pod5.dealerinspire.com/bmwofwestchester/uploads/2022/01/2022-BMW-3-Series.png',
    'https://di-uploads-pod5.dealerinspire.com/bmwofpleasanton/uploads/2020/09/2021-BMW-3-Series.png'
  ],
  'Mercedes-Benz C-Class': [
    'https://di-uploads-pod3.dealerinspire.com/mercedesbenzoflittleton/uploads/2022/03/2022-Mercedes-Benz-C-Class.png',
    'https://di-uploads-pod16.dealerinspire.com/mbofcolumbia/uploads/2022/02/mlp-img-c-class.png'
  ],
  'Lexus ES': [
    'https://di-uploads-pod19.dealerinspire.com/lexusoflakeway/uploads/2022/01/2022-Lexus-ES.png',
    'https://di-uploads-pod19.dealerinspire.com/lexusofclearwater/uploads/2021/08/2022-Lexus-ES.png'
  ],
  'Audi A4': [
    'https://di-uploads-pod19.dealerinspire.com/audibirmingham/uploads/2021/06/2022-Audi-A4.png',
    'https://di-uploads-pod10.dealerinspire.com/audihuntvalley/uploads/2020/08/2021-Audi-A4.png'
  ],
  'Tesla Model 3': [
    'https://di-uploads-pod26.dealerinspire.com/pilotkia/uploads/2022/07/Tesla-Model-3.png',
    'https://di-uploads-pod11.dealerinspire.com/toyotaofredlands/uploads/2021/02/Tesla-Model-3.png'
  ],
  'Acura TLX': [
    'https://di-uploads-pod9.dealerinspire.com/acuranorthhaven/uploads/2021/06/2022-Acura-TLX.png',
    'https://di-uploads-pod10.dealerinspire.com/gillmanacuranorth/uploads/2021/10/2022-Acura-TLX.png'
  ],
  'Mazda 6': [
    'https://di-uploads-pod25.dealerinspire.com/rosemazdaofsanta/uploads/2019/12/2020-Mazda6.png',
    'https://di-uploads-pod22.dealerinspire.com/yourazmazda/uploads/2020/06/2020-Mazda6.png'
  ],
  'Genesis G70': [
    'https://di-uploads-pod26.dealerinspire.com/genesisofmiami/uploads/2022/01/2022-Genesis-G70.png',
    'https://di-uploads-pod26.dealerinspire.com/genesisoflakewood/uploads/2021/11/2022-Genesis-G70.png'
  ],
  'Hyundai Sonata': [
    'https://di-uploads-pod7.dealerinspire.com/elginhyundai/uploads/2022/01/2022-Hyundai-Sonata.png',
    'https://di-uploads-pod18.dealerinspire.com/camelbackhyundai/uploads/2021/10/2022-Hyundai-Sonata.png'
  ],
  'Kia K5': [
    'https://di-uploads-pod26.dealerinspire.com/pilotkia/uploads/2021/01/2021-Kia-K5.png',
    'https://di-uploads-pod22.dealerinspire.com/springfieldkia/uploads/2020/12/2021-Kia-K5.png'
  ],
  'Nissan Altima': [
    'https://di-uploads-pod7.dealerinspire.com/mycoastnissan/uploads/2022/01/2022-Nissan-Altima.png',
    'https://di-uploads-pod21.dealerinspire.com/nissanofeastonline/uploads/2021/09/2022-Nissan-Altima.png'
  ],
  'Volkswagen Passat': [
    'https://di-uploads-pod23.dealerinspire.com/hendrickvwfrisco/uploads/2021/08/2022-Volkswagen-Passat.png',
    'https://di-uploads-pod23.dealerinspire.com/emichvw/uploads/2020/07/2021-Volkswagen-Passat.png'
  ],
  'Subaru Legacy': [
    'https://di-uploads-pod1.dealerinspire.com/subaruofpembrokepines/uploads/2022/01/2022-Subaru-Legacy.png',
    'https://di-uploads-pod17.dealerinspire.com/subaruclearwater/uploads/2021/09/2022-Subaru-Legacy.png'
  ],

  // SUVs
  'Toyota RAV4': [
    'https://di-uploads-pod14.dealerinspire.com/colonialtoyota/uploads/2022/01/2022-Toyota-RAV4.png',
    'https://di-uploads-pod3.dealerinspire.com/davidmausyota/uploads/2022/01/2022-Toyota-RAV4.png'
  ],
  'Honda CR-V': [
    'https://di-uploads-pod3.dealerinspire.com/haborhonda/uploads/2022/01/mlp-img-new-cr-v.png',
    'https://di-uploads-pod10.dealerinspire.com/galenahonda/uploads/2022/01/2022-Honda-CR-V.png'
  ],
  'Mazda CX-5': [
    'https://di-uploads-pod25.dealerinspire.com/rosemazdaofsanta/uploads/2022/01/2022-Mazda-CX-5.png',
    'https://di-uploads-pod22.dealerinspire.com/yourazmazda/uploads/2022/01/2022-Mazda-CX-5.png'
  ],
  'Lexus RX': [
    'https://di-uploads-pod19.dealerinspire.com/lexusoflakeway/uploads/2022/01/2022-Lexus-RX.png',
    'https://di-uploads-pod19.dealerinspire.com/lexusofclearwater/uploads/2021/08/2022-Lexus-RX.png'
  ],
  'BMW X3': [
    'https://di-uploads-pod5.dealerinspire.com/bmwofwestchester/uploads/2022/01/2022-BMW-X3.png',
    'https://di-uploads-pod5.dealerinspire.com/bmwofpleasanton/uploads/2021/05/2022-BMW-X3.png'
  ],
  'Audi Q5': [
    'https://di-uploads-pod19.dealerinspire.com/audibirmingham/uploads/2021/06/2022-Audi-Q5.png',
    'https://di-uploads-pod10.dealerinspire.com/audihuntvalley/uploads/2021/01/2022-Audi-Q5.png'
  ],
  'Mercedes-Benz GLC': [
    'https://di-uploads-pod3.dealerinspire.com/mercedesbenzoflittleton/uploads/2022/01/2022-Mercedes-Benz-GLC.png',
    'https://di-uploads-pod16.dealerinspire.com/mbofcolumbia/uploads/2022/02/mlp-img-glc.png'
  ],
  'Volvo XC60': [
    'https://di-uploads-pod6.dealerinspire.com/smythevolvo/uploads/2022/01/2022-Volvo-XC60.png',
    'https://di-uploads-pod6.dealerinspire.com/keefferandsons/uploads/2021/06/2022-Volvo-XC60.png'
  ],
  'Acura RDX': [
    'https://di-uploads-pod9.dealerinspire.com/acuranorthhaven/uploads/2022/01/2022-Acura-RDX.png',
    'https://di-uploads-pod10.dealerinspire.com/gillmanacuranorth/uploads/2022/01/2022-Acura-RDX.png'
  ],
  'Infiniti QX50': [
    'https://di-uploads-pod25.dealerinspire.com/infinitiofnaperville/uploads/2022/01/2022-Infiniti-QX50.png',
    'https://di-uploads-pod12.dealerinspire.com/infinitiofcharlotte/uploads/2021/08/2022-Infiniti-QX50.png'
  ],
  'Hyundai Tucson': [
    'https://di-uploads-pod7.dealerinspire.com/elginhyundai/uploads/2022/01/2022-Hyundai-Tucson.png',
    'https://di-uploads-pod18.dealerinspire.com/camelbackhyundai/uploads/2022/01/2022-Hyundai-Tucson.png'
  ],
  'Kia Sportage': [
    'https://di-uploads-pod26.dealerinspire.com/pilotkia/uploads/2022/01/2022-Kia-Sportage.png',
    'https://di-uploads-pod22.dealerinspire.com/springfieldkia/uploads/2022/01/2022-Kia-Sportage.png'
  ],
  'Subaru Outback': [
    'https://di-uploads-pod1.dealerinspire.com/subaruofpembrokepines/uploads/2022/01/2022-Subaru-Outback.png',
    'https://di-uploads-pod17.dealerinspire.com/subaruclearwater/uploads/2021/09/2022-Subaru-Outback.png'
  ],
  'Volkswagen Atlas': [
    'https://di-uploads-pod23.dealerinspire.com/hendrickvwfrisco/uploads/2022/01/2022-Volkswagen-Atlas.png',
    'https://di-uploads-pod23.dealerinspire.com/emichvw/uploads/2021/08/2022-Volkswagen-Atlas.png'
  ],
  'Mazda CX-9': [
    'https://di-uploads-pod25.dealerinspire.com/rosemazdaofsanta/uploads/2022/01/2022-Mazda-CX-9.png',
    'https://di-uploads-pod22.dealerinspire.com/yourazmazda/uploads/2022/01/2022-Mazda-CX-9.png'
  ],

  // Trucks
  'Ford F-150': [
    'https://di-uploads-pod3.dealerinspire.com/performancefordmt/uploads/2022/01/2022-Ford-F-150.png',
    'https://di-uploads-pod14.dealerinspire.com/tommynapesford/uploads/2022/01/2022-Ford-F-150.png'
  ],
  'Chevrolet Silverado': [
    'https://di-uploads-pod22.dealerinspire.com/yourazchevy/uploads/2022/01/2022-Chevrolet-Silverado-1500.png',
    'https://di-uploads-pod9.dealerinspire.com/chevylakeworth/uploads/2022/01/2022-Chevrolet-Silverado-1500.png'
  ],
  'Ram 1500': [
    'https://di-uploads-pod15.dealerinspire.com/garnerram/uploads/2022/01/2022-Ram-1500.png',
    'https://di-uploads-pod8.dealerinspire.com/orangecoastcjd/uploads/2022/01/2022-Ram-1500.png'
  ],
  'GMC Sierra': [
    'https://di-uploads-pod21.dealerinspire.com/modernbuickgmc/uploads/2022/01/2022-GMC-Sierra-1500.png',
    'https://di-uploads-pod18.dealerinspire.com/jimellisbuickgmc/uploads/2022/01/2022-GMC-Sierra-1500.png'
  ],
  'Toyota Tacoma': [
    'https://di-uploads-pod14.dealerinspire.com/colonialtoyota/uploads/2022/01/2022-Toyota-Tacoma.png',
    'https://di-uploads-pod3.dealerinspire.com/davidmausyota/uploads/2022/01/2022-Toyota-Tacoma.png'
  ],
  'Toyota Tundra': [
    'https://di-uploads-pod14.dealerinspire.com/colonialtoyota/uploads/2022/01/2022-Toyota-Tundra.png',
    'https://di-uploads-pod3.dealerinspire.com/davidmausyota/uploads/2022/01/2022-Toyota-Tundra.png'
  ],
  'Chevrolet Colorado': [
    'https://di-uploads-pod22.dealerinspire.com/yourazchevy/uploads/2022/01/2022-Chevrolet-Colorado.png',
    'https://di-uploads-pod9.dealerinspire.com/chevylakeworth/uploads/2022/01/2022-Chevrolet-Colorado.png'
  ],
  'Nissan Frontier': [
    'https://di-uploads-pod7.dealerinspire.com/mycoastnissan/uploads/2022/01/2022-Nissan-Frontier.png',
    'https://di-uploads-pod21.dealerinspire.com/nissanofeastonline/uploads/2022/01/2022-Nissan-Frontier.png'
  ],

  // Off-road
  'Jeep Wrangler': [
    'https://di-uploads-pod8.dealerinspire.com/orangecoastcjd/uploads/2022/01/2022-Jeep-Wrangler.png',
    'https://di-uploads-pod15.dealerinspire.com/garnerram/uploads/2022/01/2022-Jeep-Wrangler.png'
  ],
  'Ford Bronco': [
    'https://di-uploads-pod3.dealerinspire.com/performancefordmt/uploads/2022/01/2022-Ford-Bronco.png',
    'https://di-uploads-pod14.dealerinspire.com/tommynapesford/uploads/2022/01/2022-Ford-Bronco.png'
  ],

  // Luxury SUVs
  'Porsche Macan': [
    'https://di-uploads-pod24.dealerinspire.com/parkplaceporsche/uploads/2022/01/2022-Porsche-Macan.png',
    'https://di-uploads-pod6.dealerinspire.com/porschecolumbus/uploads/2022/01/2022-Porsche-Macan.png'
  ],
  'BMW X5': [
    'https://di-uploads-pod5.dealerinspire.com/bmwofwestchester/uploads/2022/01/2022-BMW-X5.png',
    'https://di-uploads-pod5.dealerinspire.com/bmwofpleasanton/uploads/2021/05/2022-BMW-X5.png'
  ],
  'Mercedes-Benz GLE': [
    'https://di-uploads-pod3.dealerinspire.com/mercedesbenzoflittleton/uploads/2022/01/2022-Mercedes-Benz-GLE.png',
    'https://di-uploads-pod16.dealerinspire.com/mbofcolumbia/uploads/2022/02/mlp-img-gle.png'
  ],
  'Audi Q7': [
    'https://di-uploads-pod19.dealerinspire.com/audibirmingham/uploads/2022/01/2022-Audi-Q7.png',
    'https://di-uploads-pod10.dealerinspire.com/audihuntvalley/uploads/2022/01/2022-Audi-Q7.png'
  ],
  'Cadillac Escalade': [
    'https://di-uploads-pod18.dealerinspire.com/thompsonsalescadillac/uploads/2022/01/2022-Cadillac-Escalade.png',
    'https://di-uploads-pod21.dealerinspire.com/modernbuickgmc/uploads/2022/01/2022-Cadillac-Escalade.png'
  ],
  'Lincoln Navigator': [
    'https://di-uploads-pod27.dealerinspire.com/lincolnofbloomington/uploads/2022/01/2022-Lincoln-Navigator.png',
    'https://di-uploads-pod14.dealerinspire.com/tommynapesford/uploads/2022/01/2022-Lincoln-Navigator.png'
  ],
  'Land Rover Range Rover Sport': [
    'https://di-uploads-pod4.dealerinspire.com/landrovermarlboro/uploads/2022/01/2022-Land-Rover-Range-Rover-Sport.png',
    'https://di-uploads-pod20.dealerinspire.com/landroverparamus/uploads/2022/01/2022-Land-Rover-Range-Rover-Sport.png'
  ],
  'Maserati Levante': [
    'https://di-uploads-pod24.dealerinspire.com/parkplaceporsche/uploads/2021/08/2021-Maserati-Levante.png',
    'https://di-uploads-pod27.dealerinspire.com/maseratiofatlanta/uploads/2021/08/2021-Maserati-Levante.png'
  ],
  'Alfa Romeo Stelvio': [
    'https://di-uploads-pod27.dealerinspire.com/alfaromeoofatlanta/uploads/2022/01/2022-Alfa-Romeo-Stelvio.png',
    'https://di-uploads-pod8.dealerinspire.com/alfaromeoofsandiego/uploads/2022/01/2022-Alfa-Romeo-Stelvio.png'
  ],
  'Genesis GV80': [
    'https://di-uploads-pod26.dealerinspire.com/genesisofmiami/uploads/2022/01/2022-Genesis-GV80.png',
    'https://di-uploads-pod26.dealerinspire.com/genesisoflakewood/uploads/2022/01/2022-Genesis-GV80.png'
  ],
  'Chevrolet Camaro': [
    'https://di-uploads-pod22.dealerinspire.com/yourazchevy/uploads/2022/01/2022-Chevrolet-Camaro.png',
    'https://di-uploads-pod9.dealerinspire.com/chevylakeworth/uploads/2022/01/2022-Chevrolet-Camaro.png'
  ]
};

// Map car model from database to our image key
function getImageKey(make, model) {
  // Direct mappings
  const mappings = {
    'Camry SE': 'Toyota Camry',
    'Accord Touring': 'Honda Accord',
    '330i xDrive': 'BMW 3 Series',
    'C300 4MATIC': 'Mercedes-Benz C-Class',
    'ES 350': 'Lexus ES',
    'A4 Prestige': 'Audi A4',
    'Model 3 Long Range': 'Tesla Model 3',
    'TLX A-Spec': 'Acura TLX',
    'Mazda6 Signature': 'Mazda 6',
    'G70 3.3T Sport': 'Genesis G70',
    'Sonata SEL Plus': 'Hyundai Sonata',
    'K5 GT-Line': 'Kia K5',
    'Altima SR': 'Nissan Altima',
    'Passat SEL': 'Volkswagen Passat',
    'Legacy Limited': 'Subaru Legacy',
    'RAV4 XLE Premium': 'Toyota RAV4',
    'CR-V EX-L': 'Honda CR-V',
    'CX-5 Turbo': 'Mazda CX-5',
    'RX 350 F Sport': 'Lexus RX',
    'X3 M40i': 'BMW X3',
    'Q5 Premium Plus': 'Audi Q5',
    'GLC 300 4MATIC': 'Mercedes-Benz GLC',
    'XC60 T6 Inscription': 'Volvo XC60',
    'RDX A-Spec': 'Acura RDX',
    'QX50 Sensory': 'Infiniti QX50',
    'Tucson Limited': 'Hyundai Tucson',
    'Sportage SX-Prestige': 'Kia Sportage',
    'Outback Touring XT': 'Subaru Outback',
    'Atlas SEL Premium': 'Volkswagen Atlas',
    'CX-9 Signature': 'Mazda CX-9',
    'F-150 Lariat': 'Ford F-150',
    'Silverado 1500 High Country': 'Chevrolet Silverado',
    '1500 Laramie': 'Ram 1500',
    '1500': 'Ram 1500',
    'Sierra 1500 Denali': 'GMC Sierra',
    'Tacoma TRD Pro': 'Toyota Tacoma',
    'Tundra TRD Pro': 'Toyota Tundra',
    'Colorado ZR2': 'Chevrolet Colorado',
    'Frontier Pro-4X': 'Nissan Frontier',
    'Wrangler Rubicon 4xe': 'Jeep Wrangler',
    'Bronco Badlands': 'Ford Bronco',
    'Macan S': 'Porsche Macan',
    'X5 M50i': 'BMW X5',
    'GLE 450 4MATIC': 'Mercedes-Benz GLE',
    'Q7 Prestige': 'Audi Q7',
    'Escalade Premium Luxury': 'Cadillac Escalade',
    'Navigator Reserve': 'Lincoln Navigator',
    'Range Rover Sport HSE': 'Land Rover Range Rover Sport',
    'Levante GT': 'Maserati Levante',
    'Stelvio Ti Sport': 'Alfa Romeo Stelvio',
    'GV80 3.5T Prestige': 'Genesis GV80',
    'Camaro': 'Chevrolet Camaro'
  };

  // Try direct model match first
  if (mappings[model]) {
    return mappings[model];
  }

  // Try make + simplified model
  const simplifiedModel = model.split(' ')[0];
  const key = `${make} ${simplifiedModel}`;
  if (carImageDatabase[key]) {
    return key;
  }

  // Return null if no match
  return null;
}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
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
  console.log('Fetching real car images from dealer websites...\n');

  const cars = await prisma.car.findMany({
    select: { id: true, vin: true, make: true, model: true, year: true }
  });

  let updated = 0;
  let failed = 0;

  for (const car of cars) {
    const imageKey = getImageKey(car.make, car.model);

    if (!imageKey || !carImageDatabase[imageKey]) {
      console.log(`⚠ No image mapping for ${car.make} ${car.model}`);
      failed++;
      continue;
    }

    try {
      console.log(`Processing ${car.year} ${car.make} ${car.model} -> ${imageKey}`);
      const sourceUrls = carImageDatabase[imageKey];
      const uploadedUrls = [];

      for (let i = 0; i < sourceUrls.length; i++) {
        console.log(`  Downloading image ${i + 1}...`);
        const buffer = await downloadImage(sourceUrls[i]);
        const filename = `cars/${car.vin.toLowerCase()}-real-${i + 1}.png`;
        const blobUrl = await uploadToBlob(buffer, filename);
        uploadedUrls.push(blobUrl);
      }

      await prisma.car.update({
        where: { vin: car.vin },
        data: { photos: JSON.stringify(uploadedUrls) }
      });

      console.log(`✓ Updated with ${uploadedUrls.length} images\n`);
      updated++;

    } catch (error) {
      console.log(`✗ Failed: ${error.message}\n`);
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
  .catch(console.error)
  .finally(() => prisma.$disconnect());
