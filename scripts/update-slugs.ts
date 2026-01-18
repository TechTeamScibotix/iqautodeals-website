/**
 * Script to update all car slugs to new format: vin-year-make-model-city-state
 *
 * Run with: npx tsx scripts/update-slugs.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(
  vin: string,
  year: number,
  make: string,
  model: string,
  city: string,
  state: string
): string {
  return [vin, year.toString(), make, model, city, state]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function updateSlugs() {
  console.log('Fetching all cars...');

  const cars = await prisma.car.findMany({
    select: {
      id: true,
      vin: true,
      year: true,
      make: true,
      model: true,
      city: true,
      state: true,
      slug: true,
    },
  });

  console.log(`Found ${cars.length} cars to update`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const car of cars) {
    const newSlug = generateSlug(
      car.vin,
      car.year,
      car.make,
      car.model,
      car.city,
      car.state
    );

    // Skip if slug is already in the new format
    if (car.slug === newSlug) {
      skipped++;
      continue;
    }

    try {
      await prisma.car.update({
        where: { id: car.id },
        data: { slug: newSlug },
      });
      console.log(`Updated: ${car.slug || car.id} -> ${newSlug}`);
      updated++;
    } catch (error) {
      console.error(`Error updating car ${car.id}:`, error);
      errors++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (already correct): ${skipped}`);
  console.log(`Errors: ${errors}`);
}

updateSlugs()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
