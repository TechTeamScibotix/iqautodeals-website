import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import zipcodes from 'zipcodes';

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
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const condition = searchParams.get('condition'); // optional: "new"

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 });
    }

    const where: any = {
      status: 'active',
      photos: { not: '[]' },
      dealer: { verificationStatus: 'approved' },
    };

    if (condition) {
      where.condition = { equals: condition, mode: 'insensitive' };
    }

    const cars = await prisma.car.findMany({
      where,
      include: {
        dealer: {
          select: {
            businessName: true,
            websiteUrl: true,
            city: true,
            state: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate distance for each car
    const carsWithDistance = cars.map(car => {
      let distance: number | null = null;

      if (car.latitude && car.longitude && !(car.latitude === 0 && car.longitude === 0)) {
        distance = calculateDistance(lat, lng, car.latitude, car.longitude);
      } else {
        const carLocation = zipcodes.lookupByName(car.city?.trim(), car.state?.trim());
        if (carLocation && carLocation.length > 0) {
          distance = calculateDistance(lat, lng, carLocation[0].latitude, carLocation[0].longitude);
        }
      }

      return {
        ...car,
        distance: distance !== null ? Math.round(distance) : null,
        isDemo: car.dealer.email?.endsWith('@iqautodeals.com') || false,
        dealer: {
          businessName: car.dealer.businessName,
          websiteUrl: car.dealer.websiteUrl,
          city: car.dealer.city,
          state: car.dealer.state,
        },
      };
    });

    // Sort: photos first, then by distance
    carsWithDistance.sort((a, b) => {
      // Cars with distance first
      if (a.distance === null && b.distance !== null) return 1;
      if (a.distance !== null && b.distance === null) return -1;
      if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
      return 0;
    });

    // Take nearby cars (within 200 miles), fallback to all sorted by distance
    const nearby = carsWithDistance.filter(c => c.distance !== null && c.distance <= 200);
    const result = nearby.length >= 4 ? nearby.slice(0, limit) : carsWithDistance.slice(0, limit);

    return NextResponse.json({ cars: result });
  } catch (error: any) {
    console.error('Error fetching nearby cars:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby cars' }, { status: 500 });
  }
}
