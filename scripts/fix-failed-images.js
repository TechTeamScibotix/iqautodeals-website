const { put } = require('@vercel/blob');
const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

// Fix the failed cars with working Pexels/Pixabay images
const fixMapping = {
  '5YJ3E1EB2PF123007': { // Tesla Model 3
    make: 'Tesla', model: 'Model 3',
    urls: [
      'https://images.pexels.com/photos/13861/IMG_3546.jpg?w=800',
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800'
    ]
  },
  '1FTFW1E85NFA33001': { // Ford F-150
    make: 'Ford', model: 'F-150',
    urls: [
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=800',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=800'
    ]
  },
  '1GCUYGEL3PF333002': { // Chevy Silverado
    make: 'Chevrolet', model: 'Silverado',
    urls: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=800',
      'https://images.pexels.com/photos/1682409/pexels-photo-1682409.jpeg?w=800'
    ]
  },
  '1GTU9EED3PZ333004': { // GMC Sierra
    make: 'GMC', model: 'Sierra',
    urls: [
      'https://images.pexels.com/photos/1682409/pexels-photo-1682409.jpeg?w=800',
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=800'
    ]
  },
  '3TYCZ5AN2PT333005': { // Toyota Tacoma
    make: 'Toyota', model: 'Tacoma',
    urls: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=800',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=800'
    ]
  },
  '5LMJJ3LT3NEL44006': { // Lincoln Navigator
    make: 'Lincoln', model: 'Navigator',
    urls: [
      'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?w=800',
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800'
    ]
  },
  'KMUHB8DB5PU44010': { // Genesis GV80
    make: 'Genesis', model: 'GV80',
    urls: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?w=800',
      'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?w=800'
    ]
  }
};

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
    contentType: 'image/jpeg',
  });
  return blob.url;
}

async function fixFailedImages() {
  console.log('Fixing failed car images...\n');

  for (const [vin, data] of Object.entries(fixMapping)) {
    try {
      const uploadedUrls = [];

      for (let i = 0; i < data.urls.length; i++) {
        console.log(`  Downloading image ${i + 1} for ${data.make} ${data.model}...`);
        const buffer = await downloadImage(data.urls[i]);

        console.log(`  Uploading to Vercel Blob...`);
        const filename = `cars/${vin.toLowerCase()}-fix-${i + 1}.jpg`;
        const blobUrl = await uploadToBlob(buffer, filename);
        uploadedUrls.push(blobUrl);
      }

      await prisma.car.update({
        where: { vin },
        data: { photos: JSON.stringify(uploadedUrls) }
      });

      console.log(`✓ Fixed ${data.make} ${data.model}\n`);
    } catch (error) {
      console.log(`✗ Still failed ${data.make} ${data.model}: ${error.message}\n`);
    }
  }

  console.log('Done!');
}

process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_YzKbVK1txuE5Y0mL_hx4preAchubkJUUNTUtXtJoDwCeitw';

fixFailedImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
