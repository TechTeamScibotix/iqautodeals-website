import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeDealerOnInventory } from '@/lib/sync/dealeron-scraper';

interface UpdateResult {
  success: boolean;
  dealerEmail?: string;
  dealerName?: string;
  websiteUrl?: string;
  stats: {
    totalCars: number;
    scraped: number;
    updated: number;
    defaulted: number;
    failed: number;
  };
  error?: string;
}

/**
 * Update fuel types for a specific dealer by scraping their website
 *
 * POST /api/admin/update-fuel-types
 * Body: { dealerEmail: string, defaultAll?: boolean }
 *
 * - dealerEmail: The dealer's email to update fuel types for
 * - defaultAll: If true, also sets "Gasoline" as default for all remaining cars without fuel type
 */
export async function POST(request: NextRequest) {
  try {
    const { dealerEmail, defaultAll } = await request.json();

    if (!dealerEmail) {
      return NextResponse.json(
        { error: 'dealerEmail is required' },
        { status: 400 }
      );
    }

    const result = await updateDealerFuelTypes(dealerEmail, defaultAll);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating fuel types:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Default all cars without fuel type to "Gasoline"
 *
 * GET /api/admin/update-fuel-types?defaultAll=true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const defaultAll = searchParams.get('defaultAll') === 'true';

    if (!defaultAll) {
      return NextResponse.json(
        { error: 'Use POST with dealerEmail to update specific dealer, or GET with ?defaultAll=true' },
        { status: 400 }
      );
    }

    // Default all cars without fuel type to Gasoline
    const result = await prisma.car.updateMany({
      where: {
        OR: [
          { fuelType: null },
          { fuelType: '' },
          { fuelType: 'Unknown' },
        ],
      },
      data: {
        fuelType: 'Gasoline',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Defaulted ${result.count} cars to "Gasoline" fuel type`,
      updated: result.count,
    });
  } catch (error) {
    console.error('Error defaulting fuel types:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Update fuel types for a specific dealer
 */
async function updateDealerFuelTypes(dealerEmail: string, defaultAll?: boolean): Promise<UpdateResult> {
  const result: UpdateResult = {
    success: false,
    dealerEmail,
    stats: {
      totalCars: 0,
      scraped: 0,
      updated: 0,
      defaulted: 0,
      failed: 0,
    },
  };

  // Find the dealer by email
  const dealer = await prisma.user.findFirst({
    where: {
      email: {
        equals: dealerEmail,
        mode: 'insensitive',
      },
      userType: 'dealer',
    },
    select: {
      id: true,
      email: true,
      businessName: true,
      websiteUrl: true,
      inventoryFeedUrl: true,
    },
  });

  if (!dealer) {
    result.error = `Dealer not found with email: ${dealerEmail}`;
    return result;
  }

  result.dealerName = dealer.businessName || 'Unknown';

  // Determine website URL - check inventoryFeedUrl, websiteUrl, or derive from email domain
  let websiteUrl = dealer.inventoryFeedUrl || dealer.websiteUrl;

  if (!websiteUrl) {
    // Try to derive from email domain
    const emailDomain = dealerEmail.split('@')[1];
    if (emailDomain && !emailDomain.includes('gmail') && !emailDomain.includes('yahoo') && !emailDomain.includes('hotmail')) {
      websiteUrl = `https://www.${emailDomain}`;
    }
  }

  if (!websiteUrl) {
    result.error = `No website URL found for dealer. Please set inventoryFeedUrl or websiteUrl in their profile.`;
    return result;
  }

  result.websiteUrl = websiteUrl;

  // Get all cars for this dealer
  const cars = await prisma.car.findMany({
    where: {
      dealerId: dealer.id,
      status: { not: 'sold' },
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

  result.stats.totalCars = cars.length;

  if (cars.length === 0) {
    result.success = true;
    result.error = 'No active cars found for this dealer';
    return result;
  }

  console.log(`Scraping ${websiteUrl} for fuel types...`);

  // Scrape the dealer's website
  const scrapeResult = await scrapeDealerOnInventory(websiteUrl, 'all');

  if (!scrapeResult.success) {
    result.error = `Failed to scrape website: ${scrapeResult.error}`;
    // Still continue to default cars if requested
    if (defaultAll) {
      await defaultDealerCars(dealer.id, result);
    }
    return result;
  }

  result.stats.scraped = scrapeResult.vehicles.length;
  console.log(`Scraped ${scrapeResult.vehicles.length} vehicles from website`);

  // Create VIN -> fuelType map from scraped data
  const vinFuelMap = new Map<string, string>();
  for (const vehicle of scrapeResult.vehicles) {
    if (vehicle.fuelType && vehicle.fuelType !== 'Unknown') {
      vinFuelMap.set(vehicle.vin.toUpperCase(), vehicle.fuelType);
    }
  }

  console.log(`Found fuel types for ${vinFuelMap.size} vehicles`);

  // Update each car
  for (const car of cars) {
    try {
      const scrapedFuelType = vinFuelMap.get(car.vin.toUpperCase());

      if (scrapedFuelType) {
        // Update with scraped fuel type
        await prisma.car.update({
          where: { id: car.id },
          data: { fuelType: scrapedFuelType },
        });
        result.stats.updated++;
        console.log(`Updated ${car.year} ${car.make} ${car.model} (${car.vin}): ${scrapedFuelType}`);
      } else if (defaultAll && (!car.fuelType || car.fuelType === 'Unknown' || car.fuelType === '')) {
        // Default to Gasoline if no scraped value and defaultAll is true
        await prisma.car.update({
          where: { id: car.id },
          data: { fuelType: 'Gasoline' },
        });
        result.stats.defaulted++;
        console.log(`Defaulted ${car.year} ${car.make} ${car.model} (${car.vin}): Gasoline`);
      }
    } catch (error) {
      console.error(`Error updating car ${car.vin}:`, error);
      result.stats.failed++;
    }
  }

  result.success = true;
  return result;
}

/**
 * Default all cars for a dealer to Gasoline if they don't have fuel type
 */
async function defaultDealerCars(dealerId: string, result: UpdateResult): Promise<void> {
  const updateResult = await prisma.car.updateMany({
    where: {
      dealerId,
      status: { not: 'sold' },
      OR: [
        { fuelType: null },
        { fuelType: '' },
        { fuelType: 'Unknown' },
      ],
    },
    data: {
      fuelType: 'Gasoline',
    },
  });

  result.stats.defaulted = updateResult.count;
  console.log(`Defaulted ${updateResult.count} cars to Gasoline`);
}
