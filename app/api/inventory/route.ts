import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Cache for 5 minutes

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
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'lat and lng query parameters are required' },
        { status: 400 }
      );
    }

    const cars = await prisma.car.findMany({
      where: {
        status: 'active',
        photos: { not: '' },
        dealer: { verificationStatus: 'approved' },
      },
      select: {
        id: true,
        year: true,
        make: true,
        model: true,
        trim: true,
        salePrice: true,
        photos: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
        slug: true,
        dealer: {
          select: {
            businessName: true,
          },
        },
      },
    });

    const carsWithDistance = cars.map((car) => {
      // Parse photos JSON string, take first photo
      let firstPhoto: string | null = null;
      try {
        const parsed = JSON.parse(car.photos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          firstPhoto = parsed[0];
        }
      } catch {
        // If not valid JSON, try as plain URL
        if (car.photos && car.photos.startsWith('http')) {
          firstPhoto = car.photos;
        }
      }

      const title = [car.year, car.make, car.model, car.trim]
        .filter(Boolean)
        .join(' ');

      const distance = calculateDistance(lat, lng, car.latitude, car.longitude);

      return {
        id: car.id,
        title,
        price: car.salePrice,
        photo: firstPhoto,
        city: car.city,
        state: car.state,
        lat: car.latitude,
        lng: car.longitude,
        slug: car.slug,
        dealer_name: car.dealer?.businessName || null,
        distance,
      };
    });

    // Sort by distance (closest first)
    carsWithDistance.sort((a, b) => a.distance - b.distance);

    // Apply pagination
    const paginated = carsWithDistance.slice(offset, offset + limit);

    return NextResponse.json({ cars: paginated });
  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
