import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json({ error: 'Dealer ID required' }, { status: 400 });
    }

    const cars = await prisma.car.findMany({
      where: { dealerId },
      include: {
        acceptedDeals: {
          where: {
            deadDeal: false, // Exclude dead deals
          },
          select: {
            sold: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get actual sold count from AcceptedDeals (source of truth)
    // Exclude dead deals from sold count
    const soldCount = await prisma.acceptedDeal.count({
      where: {
        sold: true,
        deadDeal: false,
        car: {
          dealerId,
        },
      },
    });

    return NextResponse.json({ cars, soldCount });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

// Helper to generate SEO-friendly slug: vin-year-make-model-city-state
function generateSlug(data: { year: number; make: string; model: string; city: string; state: string; vin: string }): string {
  return [
    data.vin.toLowerCase(),
    data.year,
    data.make.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    data.model.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    data.city.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    data.state.toLowerCase()
  ].join('-').replace(/-+/g, '-');
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Handle photos - avoid double-stringifying
    // Frontend may send already-stringified JSON or an array
    let photos = data.photos;
    if (typeof photos === 'string') {
      // Already stringified, use as-is
      photos = photos;
    } else if (Array.isArray(photos)) {
      // Array needs to be stringified
      photos = JSON.stringify(photos);
    } else {
      photos = '[]';
    }

    // Generate SEO-friendly slug: 2024-toyota-camry-atlanta-ga-vin123
    const slug = generateSlug({
      year: data.year,
      make: data.make,
      model: data.model,
      city: data.city,
      state: data.state,
      vin: data.vin,
    });

    const car = await prisma.car.create({
      data: {
        ...data,
        photos,
        slug,
        listingFeePaid: true, // Simulated for demo
      },
    });

    return NextResponse.json({ car });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
