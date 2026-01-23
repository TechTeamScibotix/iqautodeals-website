import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch available filter options from active inventory
export async function GET() {
  try {
    // Get distinct values from active cars with approved dealers
    const [makes, years, states, fuelTypes] = await Promise.all([
      // Get unique makes
      prisma.car.findMany({
        where: {
          status: 'active',
          dealer: { verificationStatus: 'approved' },
        },
        select: { make: true },
        distinct: ['make'],
        orderBy: { make: 'asc' },
      }),

      // Get unique years
      prisma.car.findMany({
        where: {
          status: 'active',
          dealer: { verificationStatus: 'approved' },
        },
        select: { year: true },
        distinct: ['year'],
        orderBy: { year: 'desc' },
      }),

      // Get unique states
      prisma.car.findMany({
        where: {
          status: 'active',
          dealer: { verificationStatus: 'approved' },
        },
        select: { state: true },
        distinct: ['state'],
        orderBy: { state: 'asc' },
      }),

      // Get unique fuel types
      prisma.car.findMany({
        where: {
          status: 'active',
          dealer: { verificationStatus: 'approved' },
        },
        select: { fuelType: true },
        distinct: ['fuelType'],
        orderBy: { fuelType: 'asc' },
      }),
    ]);

    // Get models grouped by make for cascading dropdowns
    const modelsRaw = await prisma.car.findMany({
      where: {
        status: 'active',
        dealer: { verificationStatus: 'approved' },
      },
      select: { make: true, model: true },
      distinct: ['make', 'model'],
      orderBy: [{ make: 'asc' }, { model: 'asc' }],
    });

    // Group models by make (normalized to uppercase)
    const modelsByMake: Record<string, string[]> = {};
    for (const item of modelsRaw) {
      const make = item.make.toUpperCase();
      if (!modelsByMake[make]) {
        modelsByMake[make] = [];
      }
      if (!modelsByMake[make].includes(item.model)) {
        modelsByMake[make].push(item.model);
      }
    }

    // Get inventory counts for stats
    const totalCount = await prisma.car.count({
      where: {
        status: 'active',
        dealer: { verificationStatus: 'approved' },
      },
    });

    // Get min and max prices for price range filter
    const priceStats = await prisma.car.aggregate({
      where: {
        status: 'active',
        dealer: { verificationStatus: 'approved' },
        salePrice: { gt: 0 },
      },
      _min: { salePrice: true },
      _max: { salePrice: true },
    });

    // Normalize makes to uppercase and remove duplicates
    const uniqueMakes = [...new Set(makes.map((m) => m.make.toUpperCase()))].sort();

    // Get unique fuel types, filter out null/empty and sort
    const uniqueFuelTypes = [...new Set(fuelTypes.map((f) => f.fuelType).filter(Boolean))].sort() as string[];

    return NextResponse.json({
      makes: uniqueMakes,
      years: years.map((y) => y.year),
      states: states.map((s) => s.state).filter(Boolean),
      fuelTypes: uniqueFuelTypes,
      modelsByMake,
      totalCount,
      priceRange: {
        min: priceStats._min.salePrice || 0,
        max: priceStats._max.salePrice || 100000,
      },
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
