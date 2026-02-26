import dotenv from 'dotenv';
import path from 'path';

// Load env BEFORE any other imports so GEMINI_API_KEY is available
// when generate-description.ts initializes at module scope
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

// Dynamic require to ensure dotenv has loaded first
const { prisma } = require('../lib/prisma');
const { generateSEODescription, isValidSEODescription } = require('../lib/seo/generate-description');

const DEALER_EMAIL = 'michaelbratton2@gmail.com';
const DELAY = 1500;

async function main() {
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'MISSING');

  const dealer = await prisma.user.findUnique({
    where: { email: DEALER_EMAIL },
    select: { id: true, businessName: true },
  });

  if (!dealer) {
    console.error('Dealer not found:', DEALER_EMAIL);
    process.exit(1);
  }

  const cars = await prisma.car.findMany({
    where: { dealerId: dealer.id, seoDescriptionGenerated: false },
    select: {
      id: true, vin: true, year: true, make: true, model: true,
      mileage: true, color: true, transmission: true, salePrice: true,
      city: true, state: true, features: true,
      trim: true, engine: true, drivetrain: true, bodyType: true,
      fuelType: true, interiorColor: true, condition: true, certified: true,
      mpgCity: true, mpgHighway: true,
    },
  });

  console.log(`Dealer: ${dealer.businessName}`);
  console.log(`Cars needing SEO: ${cars.length}`);

  if (cars.length === 0) {
    console.log('All vehicles already have SEO descriptions.');
    process.exit(0);
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const name = `${car.year} ${car.make} ${car.model}`;

    try {
      console.log(`[${i + 1}/${cars.length}] Generating SEO for ${name} (${car.vin})...`);
      const desc = await generateSEODescription(car);

      if (isValidSEODescription(desc)) {
        await prisma.car.update({
          where: { id: car.id },
          data: { description: desc, seoDescriptionGenerated: true },
        });
        success++;
        console.log(`  OK`);
      } else {
        console.log(`  SKIP (invalid description)`);
        failed++;
      }
    } catch (err: any) {
      console.error(`  FAIL: ${err.message}`);
      failed++;
    }

    if (i < cars.length - 1) {
      await new Promise(r => setTimeout(r, DELAY));
    }
  }

  console.log(`\nDone: ${success} success, ${failed} failed, out of ${cars.length}`);
  process.exit(0);
}

main();
