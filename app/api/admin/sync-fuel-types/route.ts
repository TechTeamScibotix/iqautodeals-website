import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeDealerOnInventory } from '@/lib/sync/dealeron-scraper';

// Turpin Dodge website URL
const TURPIN_DODGE_URL = 'https://www.turpindodgeofdubuque.net';

/**
 * Sync fuel types for ALL cars by scraping Turpin Dodge inventory
 * Matches by VIN and updates fuel type for any car in the database
 *
 * GET /api/admin/sync-fuel-types
 */
export async function GET(request: NextRequest) {
  try {
    console.log(`Scraping ${TURPIN_DODGE_URL} for fuel types...`);

    // Scrape Turpin Dodge inventory
    const scrapeResult = await scrapeDealerOnInventory(TURPIN_DODGE_URL, 'all');

    if (!scrapeResult.success) {
      return NextResponse.json(
        { error: `Failed to scrape website: ${scrapeResult.error}` },
        { status: 500 }
      );
    }

    console.log(`Scraped ${scrapeResult.vehicles.length} vehicles from Turpin Dodge`);

    // Build VIN -> fuelType map from scraped data
    const vinFuelMap = new Map<string, string>();
    for (const vehicle of scrapeResult.vehicles) {
      if (vehicle.fuelType && vehicle.fuelType !== 'Unknown') {
        vinFuelMap.set(vehicle.vin.toUpperCase(), vehicle.fuelType);
      }
    }

    console.log(`Found fuel types for ${vinFuelMap.size} vehicles`);

    if (vinFuelMap.size === 0) {
      return NextResponse.json({
        success: true,
        message: 'No fuel types found in scraped data',
        stats: {
          scraped: scrapeResult.vehicles.length,
          withFuelType: 0,
          updated: 0,
        },
      });
    }

    // Get ALL active cars from database
    const cars = await prisma.car.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        vin: true,
        fuelType: true,
        year: true,
        make: true,
        model: true,
      },
    });

    console.log(`Found ${cars.length} active cars in database`);

    const stats = {
      scraped: scrapeResult.vehicles.length,
      withFuelType: vinFuelMap.size,
      totalCars: cars.length,
      matched: 0,
      updated: 0,
      unchanged: 0,
      failed: 0,
    };

    const updates: Array<{ vin: string; car: string; oldFuel: string | null; newFuel: string }> = [];

    // Update cars that match scraped VINs
    for (const car of cars) {
      const scrapedFuelType = vinFuelMap.get(car.vin.toUpperCase());

      if (scrapedFuelType) {
        stats.matched++;

        // Only update if different
        if (car.fuelType === scrapedFuelType) {
          stats.unchanged++;
          continue;
        }

        try {
          await prisma.car.update({
            where: { id: car.id },
            data: { fuelType: scrapedFuelType },
          });

          stats.updated++;
          updates.push({
            vin: car.vin,
            car: `${car.year} ${car.make} ${car.model}`,
            oldFuel: car.fuelType,
            newFuel: scrapedFuelType,
          });

          console.log(`Updated ${car.year} ${car.make} ${car.model} (${car.vin}): ${car.fuelType} -> ${scrapedFuelType}`);
        } catch (error) {
          console.error(`Error updating car ${car.vin}:`, error);
          stats.failed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraped ${stats.scraped} vehicles, found ${stats.withFuelType} with fuel types, matched ${stats.matched} cars, updated ${stats.updated}`,
      stats,
      updates,
    });
  } catch (error) {
    console.error('Error syncing fuel types:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
