import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Only count cars from approved dealers
    const totalCars = await prisma.car.count({
      where: {
        status: 'active',
        photos: { not: '[]' },
        dealer: {
          verificationStatus: 'approved',
        },
      },
    });

    if (totalCars === 0) {
      return NextResponse.json({ cars: [] });
    }

    // Get 30 random cars (or all if less than 30)
    const limit = Math.min(30, totalCars);

    // Generate random skip offset
    const skip = Math.max(0, Math.floor(Math.random() * (totalCars - limit)));

    const cars = await prisma.car.findMany({
      where: {
        status: 'active',
        photos: { not: '[]' },
        dealer: {
          verificationStatus: 'approved',
        },
      },
      take: limit,
      skip: skip,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Shuffle the results for more randomness
    const shuffled = cars.sort(() => Math.random() - 0.5);

    // Add isDemo flag based on dealer email
    const carsWithDemo = shuffled.map(car => ({
      ...car,
      isDemo: car.dealer.email?.endsWith('@iqautodeals.com') || false,
      dealer: {
        businessName: car.dealer.businessName,
        websiteUrl: car.dealer.websiteUrl,
        city: car.dealer.city,
        state: car.dealer.state,
      },
    }));

    return NextResponse.json({ cars: carsWithDemo });
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured cars' },
      { status: 500 }
    );
  }
}
