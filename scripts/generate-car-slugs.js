const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function generateSlug(car) {
  // Format: year-make-model-city-state
  const parts = [
    car.year.toString(),
    car.make,
    car.model,
    car.city,
    car.state
  ];

  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')          // Collapse multiple hyphens
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
}

async function main() {
  console.log('Fetching all cars...');

  const cars = await prisma.car.findMany({
    select: {
      id: true,
      year: true,
      make: true,
      model: true,
      city: true,
      state: true,
      vin: true,
      slug: true
    }
  });

  console.log(`Found ${cars.length} cars`);

  // Track slugs to handle duplicates
  const usedSlugs = new Map();

  // First pass: generate base slugs and find duplicates
  for (const car of cars) {
    if (car.slug) {
      console.log(`Skipping car ${car.id} - already has slug: ${car.slug}`);
      usedSlugs.set(car.slug, true);
      continue;
    }

    const baseSlug = generateSlug(car);

    if (!usedSlugs.has(baseSlug)) {
      usedSlugs.set(baseSlug, car.id);
    } else {
      // Mark as duplicate - will need VIN suffix
      const existing = usedSlugs.get(baseSlug);
      if (existing !== 'duplicate') {
        usedSlugs.set(baseSlug, 'duplicate');
      }
    }
  }

  // Second pass: update cars with slugs
  let updated = 0;
  let skipped = 0;

  for (const car of cars) {
    if (car.slug) {
      skipped++;
      continue;
    }

    let slug = generateSlug(car);

    // Check if we need to add VIN suffix for uniqueness
    const existingSlugCheck = await prisma.car.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (existingSlugCheck && existingSlugCheck.id !== car.id) {
      // Add last 6 chars of VIN for uniqueness
      const vinSuffix = car.vin.slice(-6).toLowerCase();
      slug = `${slug}-${vinSuffix}`;
    }

    try {
      await prisma.car.update({
        where: { id: car.id },
        data: { slug }
      });
      console.log(`Updated car ${car.id}: ${slug}`);
      updated++;
    } catch (error) {
      console.error(`Failed to update car ${car.id}:`, error.message);
      // If still duplicate, add full VIN
      const fullSlug = `${generateSlug(car)}-${car.vin.toLowerCase()}`;
      try {
        await prisma.car.update({
          where: { id: car.id },
          data: { slug: fullSlug }
        });
        console.log(`Updated car ${car.id} with full VIN: ${fullSlug}`);
        updated++;
      } catch (err) {
        console.error(`Failed again for car ${car.id}:`, err.message);
      }
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
