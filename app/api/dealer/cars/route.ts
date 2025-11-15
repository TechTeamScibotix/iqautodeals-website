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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const car = await prisma.car.create({
      data: {
        ...data,
        photos: JSON.stringify(data.photos || []),
        listingFeePaid: true, // Simulated for demo
      },
    });

    return NextResponse.json({ car });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
