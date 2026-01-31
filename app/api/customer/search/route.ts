import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import zipcodes from 'zipcodes';

// Calculate distance between two coordinates using Haversine formula (in miles)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query'); // Free-text search
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const state = searchParams.get('state');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const zipCode = searchParams.get('zipCode');
    const radius = searchParams.get('radius'); // Optional radius in miles (default: nationwide)
    const condition = searchParams.get('condition'); // new, used
    const bodyType = searchParams.get('bodyType'); // SUV, Sedan, Truck, etc.
    const fuelType = searchParams.get('fuelType'); // Gasoline, Electric, Hybrid, etc.

    // Get coordinates from zipcode if provided
    let userLat: number | null = null;
    let userLon: number | null = null;
    let maxRadius: number | null = null;

    if (zipCode) {
      const zipData = zipcodes.lookup(zipCode);
      if (zipData) {
        userLat = zipData.latitude;
        userLon = zipData.longitude;
        // If radius is provided, use it; otherwise show all cars sorted by distance
        if (radius) {
          const parsedRadius = parseInt(radius, 10);
          if (!isNaN(parsedRadius) && parsedRadius > 0) {
            maxRadius = parsedRadius;
          }
        }
      }
    }

    const where: any = {
      status: 'active',
      // Only show cars from approved dealers
      dealer: {
        verificationStatus: 'approved',
      },
    };

    // Only filter by state if a specific state is provided (not 'all' or empty)
    // Skip state filter if searching by zipcode (zipcode takes precedence)
    if (state && state !== 'all' && !zipCode) {
      where.state = state;
    }

    // Free-text search across multiple fields
    if (query) {
      const searchTerms = query.trim().split(/\s+/);

      // Build OR conditions for each term to match against make, model, year, color, etc.
      where.AND = searchTerms.map(term => ({
        OR: [
          { make: { contains: term, mode: 'insensitive' } },
          { model: { contains: term, mode: 'insensitive' } },
          { year: { equals: parseInt(term, 10) || 0 } },
          { color: { contains: term, mode: 'insensitive' } },
          { trim: { contains: term, mode: 'insensitive' } },
          { bodyType: { contains: term, mode: 'insensitive' } },
          { vin: { contains: term, mode: 'insensitive' } },
        ],
      }));
    }

    if (make) where.make = { contains: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };

    // Filter by condition (new/used)
    if (condition && condition !== 'all') {
      where.condition = { equals: condition, mode: 'insensitive' };
    }

    // Filter by body type with smart matching
    // Maps user-friendly names to database patterns, model keywords, and makes
    if (bodyType && bodyType !== 'all') {
      const bodyTypeMapping: Record<string, { bodyTypes: string[]; models: string[]; makes: string[] }> = {
        'truck': {
          bodyTypes: ['truck', 'cab', 'pickup'],
          models: ['f-150', 'f-250', 'f-350', 'silverado', 'sierra', '1500', '2500', '3500', '4500', '5500', 'tacoma', 'tundra', 'titan', 'frontier', 'colorado', 'canyon', 'ranger', 'gladiator', 'ridgeline', 'maverick'],
          makes: []
        },
        'suv': {
          bodyTypes: ['suv', 'sport utility'],
          models: [],
          makes: []
        },
        'sedan': {
          bodyTypes: ['sedan'],
          models: [],
          makes: []
        },
        'coupe': {
          bodyTypes: ['coupe'],
          models: [],
          makes: []
        },
        'hatchback': {
          bodyTypes: ['hatchback'],
          models: [],
          makes: []
        },
        'convertible': {
          bodyTypes: ['convertible'],
          models: [],
          makes: []
        },
        'minivan': {
          bodyTypes: ['minivan'],
          models: ['pacifica', 'sienna', 'odyssey', 'carnival', 'grand caravan'],
          makes: []
        },
        'wagon': {
          bodyTypes: ['wagon'],
          models: [],
          makes: []
        },
        'van': {
          bodyTypes: ['van', 'passenger van', 'cargo van'],
          models: ['promaster', 'transit', 'sprinter', 'metris'],
          makes: []
        },
        'crossover': {
          bodyTypes: ['crossover', 'sport utility'],
          models: [],
          makes: []
        },
      };

      const mapping = bodyTypeMapping[bodyType.toLowerCase()] || { bodyTypes: [bodyType], models: [], makes: [] };

      // Build OR conditions for body type patterns, model keywords, and makes
      const orConditions: any[] = [];

      // Add body type pattern matches
      mapping.bodyTypes.forEach(pattern => {
        orConditions.push({ bodyType: { contains: pattern, mode: 'insensitive' } });
      });

      // Add model keyword matches (for vehicles with null bodyType)
      mapping.models.forEach(modelKeyword => {
        orConditions.push({ model: { contains: modelKeyword, mode: 'insensitive' } });
      });

      // Add make matches (e.g., Ram trucks)
      mapping.makes.forEach(makeName => {
        orConditions.push({ make: { equals: makeName, mode: 'insensitive' } });
      });

      const bodyTypeCondition = { OR: orConditions };

      if (where.AND) {
        where.AND.push(bodyTypeCondition);
      } else {
        where.AND = [bodyTypeCondition];
      }
    }

    // Filter by fuel type
    if (fuelType && fuelType !== 'all') {
      where.fuelType = { contains: fuelType, mode: 'insensitive' };
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      where.salePrice = {};
      if (minPrice) {
        const min = parseInt(minPrice, 10);
        if (!isNaN(min)) where.salePrice.gte = min;
      }
      if (maxPrice) {
        const max = parseInt(maxPrice, 10);
        if (!isNaN(max)) where.salePrice.lte = max;
      }
    }

    const cars = await prisma.car.findMany({
      where,
      include: {
        dealer: {
          select: {
            businessName: true,
            websiteUrl: true,
            verificationStatus: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate distance and filter/sort if zipcode is provided
    let processedCars = cars.map(car => {
      let distance: number | null = null;

      if (userLat !== null && userLon !== null && car.latitude && car.longitude) {
        distance = calculateDistance(userLat, userLon, car.latitude, car.longitude);
      }

      return {
        ...car,
        distance: distance !== null ? Math.round(distance) : null,
        isDemo: car.dealer.email?.endsWith('@iqautodeals.com') || false,
        dealer: {
          businessName: car.dealer.businessName,
          websiteUrl: car.dealer.websiteUrl,
          verificationStatus: car.dealer.verificationStatus,
        },
      };
    });

    // Filter by radius if specified
    if (maxRadius !== null && userLat !== null) {
      processedCars = processedCars.filter(car =>
        car.distance !== null && car.distance <= maxRadius!
      );
    }

    // Sort by distance if zipcode was provided (closest first)
    if (userLat !== null) {
      processedCars.sort((a, b) => {
        // Cars without distance go to the end
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return NextResponse.json({ cars: processedCars });
  } catch (error: any) {
    console.error('Error searching cars:', error);
    return NextResponse.json({
      error: 'Search failed',
      details: error?.message || 'Unknown error',
      code: error?.code
    }, { status: 500 });
  }
}
