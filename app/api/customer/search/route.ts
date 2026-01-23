import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const state = searchParams.get('state');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = {
      status: 'active',
      // Only show cars from approved dealers
      dealer: {
        verificationStatus: 'approved',
      },
    };

    // Only filter by state if a specific state is provided (not 'all' or empty)
    if (state && state !== 'all') {
      where.state = state;
    }

    if (make) where.make = { contains: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };

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

    // Add isDemo flag based on dealer email
    const carsWithDemo = cars.map(car => ({
      ...car,
      isDemo: car.dealer.email?.endsWith('@iqautodeals.com') || false,
      dealer: {
        businessName: car.dealer.businessName,
        websiteUrl: car.dealer.websiteUrl,
        verificationStatus: car.dealer.verificationStatus,
      },
    }));

    return NextResponse.json({ cars: carsWithDemo });
  } catch (error: any) {
    console.error('Error searching cars:', error);
    return NextResponse.json({
      error: 'Search failed',
      details: error?.message || 'Unknown error',
      code: error?.code
    }, { status: 500 });
  }
}
