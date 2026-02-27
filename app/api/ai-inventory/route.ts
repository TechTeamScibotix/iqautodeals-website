import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const make = searchParams.get('make')?.trim();
    const model = searchParams.get('model')?.trim();
    const yearMin = parseInt(searchParams.get('yearMin') || '', 10);
    const yearMax = parseInt(searchParams.get('yearMax') || '', 10);
    const minPrice = parseFloat(searchParams.get('minPrice') || '');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '');
    const state = searchParams.get('state')?.trim();
    const city = searchParams.get('city')?.trim();
    const bodyType = searchParams.get('bodyType')?.trim();
    const fuelType = searchParams.get('fuelType')?.trim();
    const drivetrain = searchParams.get('drivetrain')?.trim();
    const condition = searchParams.get('condition')?.trim();
    const maxMileage = parseInt(searchParams.get('maxMileage') || '', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build where clause
    const where: Record<string, unknown> = {
      status: 'active',
      photos: { not: '' },
      dealer: { verificationStatus: 'approved' },
    };

    if (make) {
      where.make = { equals: make, mode: 'insensitive' };
    }
    if (model) {
      where.model = { contains: model, mode: 'insensitive' };
    }
    if (!isNaN(yearMin) || !isNaN(yearMax)) {
      const yearFilter: Record<string, number> = {};
      if (!isNaN(yearMin)) yearFilter.gte = yearMin;
      if (!isNaN(yearMax)) yearFilter.lte = yearMax;
      where.year = yearFilter;
    }
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      const priceFilter: Record<string, number> = {};
      if (!isNaN(minPrice)) priceFilter.gte = minPrice;
      if (!isNaN(maxPrice)) priceFilter.lte = maxPrice;
      where.salePrice = priceFilter;
    }
    if (state) {
      where.state = { equals: state, mode: 'insensitive' };
    }
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (bodyType) {
      where.bodyType = { equals: bodyType, mode: 'insensitive' };
    }
    if (fuelType) {
      where.fuelType = { equals: fuelType, mode: 'insensitive' };
    }
    if (drivetrain) {
      where.drivetrain = { equals: drivetrain, mode: 'insensitive' };
    }
    if (condition) {
      where.condition = { equals: condition, mode: 'insensitive' };
    }
    if (!isNaN(maxMileage)) {
      where.mileage = { lte: maxMileage };
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        select: {
          id: true,
          vin: true,
          year: true,
          make: true,
          model: true,
          trim: true,
          bodyType: true,
          condition: true,
          salePrice: true,
          msrp: true,
          mileage: true,
          color: true,
          interiorColor: true,
          transmission: true,
          engine: true,
          fuelType: true,
          drivetrain: true,
          mpgCity: true,
          mpgHighway: true,
          doors: true,
          certified: true,
          photos: true,
          city: true,
          state: true,
          slug: true,
          features: true,
          createdAt: true,
          dealer: {
            select: {
              businessName: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.car.count({ where }),
    ]);

    const results = cars.map((car) => {
      // Parse photos
      let photoUrls: string[] = [];
      try {
        const parsed = JSON.parse(car.photos);
        if (Array.isArray(parsed)) {
          photoUrls = parsed.slice(0, 5); // Limit to 5 photos for AI responses
        }
      } catch {
        if (car.photos && car.photos.startsWith('http')) {
          photoUrls = [car.photos];
        }
      }

      // Parse features
      let featureList: string[] = [];
      if (car.features) {
        try {
          const parsed = JSON.parse(car.features);
          if (Array.isArray(parsed)) {
            featureList = parsed;
          }
        } catch {
          // ignore
        }
      }

      const title = [car.year, car.make, car.model, car.trim]
        .filter(Boolean)
        .join(' ');

      return {
        title,
        vin: car.vin,
        year: car.year,
        make: car.make,
        model: car.model,
        trim: car.trim || null,
        bodyType: car.bodyType || null,
        condition: car.condition || null,
        price: car.salePrice,
        msrp: car.msrp || null,
        mileage: car.mileage,
        exteriorColor: car.color,
        interiorColor: car.interiorColor || null,
        transmission: car.transmission,
        engine: car.engine || null,
        fuelType: car.fuelType || null,
        drivetrain: car.drivetrain || null,
        mpgCity: car.mpgCity || null,
        mpgHighway: car.mpgHighway || null,
        doors: car.doors || null,
        certifiedPreOwned: car.certified,
        features: featureList,
        photos: photoUrls,
        dealer: {
          name: car.dealer?.businessName || null,
          city: car.dealer?.city || null,
          state: car.dealer?.state || null,
        },
        location: {
          city: car.city,
          state: car.state,
        },
        url: car.slug
          ? `https://iqautodeals.com/cars/${car.slug}`
          : `https://iqautodeals.com/cars/${car.id}`,
        listedAt: car.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      vehicles: results,
      total,
      limit,
      offset,
      source: 'IQ Auto Deals - https://iqautodeals.com',
      description: 'Nationwide online car marketplace. Buyers receive competing offers from certified dealers.',
    });
  } catch (error) {
    console.error('AI Inventory API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
