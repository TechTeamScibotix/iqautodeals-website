import { scrapeDealerOnInventory } from '../lib/sync/dealeron-scraper';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TURPIN_DODGE_URL = 'https://www.turpindodgeofdubuque.net';

async function run() {
  console.log('Scraping Turpin Dodge for fuel types...');

  const scrapeResult = await scrapeDealerOnInventory(TURPIN_DODGE_URL, 'all');

  if (!scrapeResult.success) {
    console.error('Failed to scrape:', scrapeResult.error);
    return;
  }

  console.log('Scraped', scrapeResult.vehicles.length, 'vehicles');

  // Build VIN -> fuelType map
  const vinFuelMap = new Map<string, string>();
  for (const v of scrapeResult.vehicles) {
    if (v.fuelType && v.fuelType !== 'Unknown') {
      vinFuelMap.set(v.vin.toUpperCase(), v.fuelType);
    }
  }

  console.log('Found fuel types for', vinFuelMap.size, 'vehicles');

  // Show fuel type breakdown
  const fuelCounts: Record<string, number> = {};
  for (const [, fuel] of vinFuelMap) {
    fuelCounts[fuel] = (fuelCounts[fuel] || 0) + 1;
  }
  console.log('Fuel type breakdown:', fuelCounts);

  // Get all active cars
  const cars = await prisma.car.findMany({
    where: { status: 'active' },
    select: { id: true, vin: true, fuelType: true, year: true, make: true, model: true }
  });

  console.log('Found', cars.length, 'active cars in database');

  let updated = 0;
  let matched = 0;

  for (const car of cars) {
    const scrapedFuel = vinFuelMap.get(car.vin.toUpperCase());
    if (scrapedFuel) {
      matched++;
      if (car.fuelType !== scrapedFuel) {
        // Use raw SQL to avoid schema validation issues with shared database
        await prisma.$executeRaw`UPDATE "Car" SET "fuelType" = ${scrapedFuel} WHERE id = ${car.id}`;
        console.log('Updated:', car.year, car.make, car.model, '-', car.fuelType, '->', scrapedFuel);
        updated++;
      }
    }
  }

  console.log('\nDone! Matched:', matched, 'Updated:', updated);
  await prisma.$disconnect();
}

run().catch(console.error);
