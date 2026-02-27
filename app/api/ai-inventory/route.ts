import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Cache for 5 minutes

const BLOB_HOST = 'yzkbvk1txue5y0ml.public.blob.vercel-storage.com';
const SITE_CDN = 'https://iqautodeals.com/cdn';

// Rewrite blob URLs to go through our domain so ChatGPT renders them
function proxyImageUrl(url: string): string {
  return url.replace(`https://${BLOB_HOST}`, SITE_CDN);
}

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

// Generate search variants to handle hyphen/no-hyphen differences
// "f150" → ["f150", "f-150"], "cx5" → ["cx5", "cx-5"]
function searchVariants(term: string): string[] {
  const variants = new Set<string>();
  variants.add(term);
  const noHyphens = term.replace(/-/g, '');
  variants.add(noHyphens);
  const withHyphens = noHyphens
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-zA-Z])/g, '$1-$2');
  variants.add(withHyphens);
  return Array.from(variants);
}

const VALID_SORT = ['relevance', 'distance', 'priceAsc', 'priceDesc', 'yearDesc', 'mileageAsc'] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Free-text search
    const q = searchParams.get('q')?.trim();

    // Structured filters
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

    // Location-based search
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radiusMiles = parseFloat(searchParams.get('radiusMiles') || '100');

    // Sort & pagination
    const sortParam = searchParams.get('sort')?.trim() || 'relevance';
    const sort = VALID_SORT.includes(sortParam as typeof VALID_SORT[number])
      ? sortParam
      : 'relevance';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Validate: if distance sort requested, lat/lng must be provided
    if (sort === 'distance' && (isNaN(lat) || isNaN(lng))) {
      return NextResponse.json(
        { error: 'lat and lng are required when sort=distance', details: 'Provide lat and lng query parameters for distance-based sorting.' },
        { status: 400 }
      );
    }

    // Validate: if lat or lng given, both must be present
    if ((!isNaN(lat) && isNaN(lng)) || (isNaN(lat) && !isNaN(lng))) {
      return NextResponse.json(
        { error: 'Both lat and lng must be provided together', details: 'Provide both lat and lng query parameters for location search.' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: Record<string, unknown> = {
      status: 'active',
      photos: { not: '' },
      dealer: { verificationStatus: 'approved' },
    };

    // Free-text search across make, model, trim
    if (q) {
      const terms = q.split(/\s+/).filter(Boolean);
      where.AND = terms.map((term) => {
        const variants = searchVariants(term);
        const conditions: Record<string, unknown>[] = variants.flatMap((v) => [
          { make: { contains: v, mode: 'insensitive' } },
          { model: { contains: v, mode: 'insensitive' } },
          { trim: { contains: v, mode: 'insensitive' } },
          { bodyType: { contains: v, mode: 'insensitive' } },
          { fuelType: { contains: v, mode: 'insensitive' } },
          { drivetrain: { contains: v, mode: 'insensitive' } },
        ]);
        if (!isNaN(Number(term)) && term.length === 4) {
          conditions.push({ year: Number(term) });
        }
        return { OR: conditions };
      });
    }

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
      const bt = bodyType.toLowerCase();
      if (bt === 'truck') {
        where.OR = [
          { bodyType: { contains: 'truck', mode: 'insensitive' } },
          { bodyType: { contains: 'pickup', mode: 'insensitive' } },
        ];
      } else if (bt === 'suv') {
        where.OR = [
          { bodyType: { contains: 'suv', mode: 'insensitive' } },
          { bodyType: { contains: 'crossover', mode: 'insensitive' } },
        ];
      } else {
        where.bodyType = { contains: bodyType, mode: 'insensitive' };
      }
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

    // Determine Prisma orderBy based on sort
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sort === 'priceAsc') orderBy = { salePrice: 'asc' };
    else if (sort === 'priceDesc') orderBy = { salePrice: 'desc' };
    else if (sort === 'yearDesc') orderBy = { year: 'desc' };
    else if (sort === 'mileageAsc') orderBy = { mileage: 'asc' };
    // 'distance' and 'relevance' sort in-memory after fetch

    const needsInMemorySort = sort === 'distance' || (sort === 'relevance' && q);
    const hasGeo = !isNaN(lat) && !isNaN(lng);

    // For distance/relevance sort or geo filtering, fetch all matching then sort/filter in memory
    // For DB-sortable fields, let Prisma handle pagination
    const [cars, total] = needsInMemorySort || hasGeo
      ? await (async () => {
          const allCars = await prisma.car.findMany({
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
              latitude: true,
              longitude: true,
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
          });

          // Calculate distance and filter by radius if geo provided
          // Skip distance calc for vehicles with 0,0 coords (not geocoded)
          const hasCoords = (car: { latitude: number; longitude: number }) =>
            car.latitude !== 0 || car.longitude !== 0;

          let filtered = allCars.map((car) => ({
            ...car,
            _distance: hasGeo && hasCoords(car)
              ? calculateDistance(lat, lng, car.latitude, car.longitude)
              : null,
          }));

          if (hasGeo) {
            filtered = filtered.filter((car) =>
              // Include cars with valid distance within radius
              (car._distance !== null && car._distance <= radiusMiles) ||
              // Also include cars without coordinates (they passed city/state WHERE filters)
              !hasCoords(car)
            );
          }

          // Sort (vehicles without coordinates go to the end for distance sorts)
          if (sort === 'distance' && hasGeo) {
            filtered.sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity));
          } else if (sort === 'priceAsc') {
            filtered.sort((a, b) => a.salePrice - b.salePrice);
          } else if (sort === 'priceDesc') {
            filtered.sort((a, b) => b.salePrice - a.salePrice);
          } else if (sort === 'yearDesc') {
            filtered.sort((a, b) => b.year - a.year);
          } else if (sort === 'mileageAsc') {
            filtered.sort((a, b) => a.mileage - b.mileage);
          } else if (hasGeo) {
            // Default: sort by distance when geo is available
            filtered.sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity));
          }

          const count = filtered.length;
          const page = filtered.slice(offset, offset + limit);
          return [page, count] as const;
        })()
      : await Promise.all([
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
              latitude: true,
              longitude: true,
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
            orderBy,
            take: limit,
            skip: offset,
          }),
          prisma.car.count({ where }),
        ]);

    const results = cars.map((car) => {
      // Parse photos and proxy through our domain for ChatGPT image rendering
      let photoUrls: string[] = [];
      try {
        const parsed = JSON.parse(car.photos);
        if (Array.isArray(parsed)) {
          photoUrls = parsed.slice(0, 5).map((u: string) => proxyImageUrl(u));
        }
      } catch {
        if (car.photos && car.photos.startsWith('http')) {
          photoUrls = [proxyImageUrl(car.photos)];
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

      const distance = '_distance' in car ? (car as Record<string, unknown>)._distance as number | null : null;

      return {
        title,
        primaryImage: photoUrls[0] || null,
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
        ...(distance !== null ? { distanceMiles: Math.round(distance * 10) / 10 } : {}),
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
