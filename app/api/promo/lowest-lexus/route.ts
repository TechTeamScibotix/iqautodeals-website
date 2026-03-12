import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const car = await prisma.car.findFirst({
      where: {
        status: 'active',
        condition: { equals: 'new', mode: 'insensitive' },
        make: { equals: 'lexus', mode: 'insensitive' },
        salePrice: { gt: 0 },
        photos: { not: '[]' },
        dealer: {
          verificationStatus: 'approved',
        },
      },
      orderBy: {
        salePrice: 'asc',
      },
      include: {
        dealer: {
          select: {
            businessName: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ car: null });
    }

    return NextResponse.json({
      car: {
        id: car.id,
        slug: car.slug,
        make: car.make,
        model: car.model,
        year: car.year,
        trim: car.trim,
        salePrice: car.salePrice,
        photos: car.photos,
        bodyType: car.bodyType,
        dealer: {
          businessName: car.dealer.businessName,
          city: car.dealer.city,
          state: car.dealer.state,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching lowest price Lexus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promo car' },
      { status: 500 }
    );
  }
}
