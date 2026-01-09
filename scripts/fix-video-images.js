const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

// Verified Pexels car images - these are confirmed to be actual car photos
const verifiedCarImages = {
  // Sedans
  'toyota-camry': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?w=800',
  'honda-accord': 'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?w=800',
  'bmw-sedan': 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?w=800',

  // SUVs
  'suv-1': 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=800',
  'suv-2': 'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?w=800',
  'suv-3': 'https://images.pexels.com/photos/1682409/pexels-photo-1682409.jpeg?w=800',

  // Luxury
  'luxury-1': 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800',
  'luxury-2': 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=800',
  'luxury-3': 'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?w=800',

  // Sports/Performance
  'sports-1': 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?w=800',
  'sports-2': 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?w=800',
};

// Map VINs to which image to use (uppercase to match database)
const vinToImage = {
  '4T1G11AK8PU123001': 'toyota-camry',    // Toyota Camry SE
  '1HGCV1F92NA123002': 'honda-accord',    // Honda Accord
  '5UXCR6C03P9K44002': 'luxury-2',        // BMW X5
  '5UX53DP08P9223005': 'bmw-sedan',       // BMW X3
  '4JGFB4KB9PA44003': 'luxury-1',         // Mercedes GLE
  'WA1LHBF79ND44004': 'suv-2',            // Audi Q7
  '1GYS4FKL6PR44005': 'suv-1',            // Cadillac Escalade
  '1FMDE5BH9NLA333007': 'suv-3',          // Ford Bronco
  'WA1BVAFY9N2223006': 'luxury-3',        // Audi Q5
  '5NMJE3AE0PH555006': 'suv-2',           // Hyundai Tucson
  'JTMB1RFV4PD223001': 'suv-1',           // Toyota RAV4
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
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

async function fixImages() {
  console.log('Fixing images for cars used in videos...\n');

  for (const [vin, imageKey] of Object.entries(vinToImage)) {
    const imageUrl = verifiedCarImages[imageKey];

    try {
      const car = await prisma.car.findUnique({ where: { vin } });
      if (!car) {
        console.log(`${vin}: Car not found, skipping`);
        continue;
      }

      process.stdout.write(`${car.year} ${car.make} ${car.model}... `);

      const buffer = await downloadImage(imageUrl);

      if (buffer.length < 5000) {
        console.log('Image too small, skipping');
        continue;
      }

      const blob = await put(`cars/${vin.toLowerCase()}-verified.jpg`, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: true
      });

      await prisma.car.update({
        where: { vin },
        data: { photos: JSON.stringify([blob.url]) }
      });

      console.log(`Done (${Math.round(buffer.length / 1024)}KB)`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  console.log('\nDone fixing images!');
}

process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_YzKbVK1txuE5Y0mL_hx4preAchubkJUUNTUtXtJoDwCeitw';
fixImages().catch(console.error).finally(() => prisma.$disconnect());
