import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const state = searchParams.get('state') || 'GA';

    const where: any = {
      status: 'active',
      state,
    };

    if (make) where.make = { contains: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };

    const cars = await prisma.car.findMany({
      where,
      include: {
        dealer: {
          select: {
            businessName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ cars });
  } catch (error) {
    console.error('Error searching cars:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
