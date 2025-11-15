import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Get total count of cars
    const totalCars = await prisma.car.count();

    if (totalCars === 0) {
      return NextResponse.json({ cars: [] });
    }

    // Get 30 random cars (or all if less than 30)
    const limit = Math.min(30, totalCars);

    // Generate random skip offset
    const skip = Math.max(0, Math.floor(Math.random() * (totalCars - limit)));

    const cars = await prisma.car.findMany({
      take: limit,
      skip: skip,
      include: {
        dealer: {
          select: {
            businessName: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Shuffle the results for more randomness
    const shuffled = cars.sort(() => Math.random() - 0.5);

    return NextResponse.json({ cars: shuffled });
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured cars' },
      { status: 500 }
    );
  }
}
