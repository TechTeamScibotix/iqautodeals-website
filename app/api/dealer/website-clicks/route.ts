import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get('dealerId');
    const period = searchParams.get('period'); // week | month
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!dealerId) {
      return NextResponse.json({ error: 'dealerId is required' }, { status: 400 });
    }

    // Determine date range
    let from: Date;
    let to: Date = new Date();

    if (startDate && endDate) {
      from = new Date(startDate);
      to = new Date(endDate);
      to.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
      from = new Date();
      from.setDate(from.getDate() - 30);
    } else {
      // Default to last 7 days
      from = new Date();
      from.setDate(from.getDate() - 7);
    }

    const where = {
      dealerId,
      clickedAt: { gte: from, lte: to },
    };

    // Total clicks
    const totalClicks = await prisma.dealerWebsiteClick.count({ where });

    // Unique visitors by ipHash
    const uniqueVisitors = await prisma.dealerWebsiteClick.groupBy({
      by: ['ipHash'],
      where,
    });

    // Breakdown by vehicle
    const byVehicle = await prisma.dealerWebsiteClick.groupBy({
      by: ['carId'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Fetch car details for each carId
    const carIds = byVehicle.map((v) => v.carId);
    const cars = await prisma.car.findMany({
      where: { id: { in: carIds } },
      select: { id: true, make: true, model: true, year: true, vin: true, slug: true },
    });
    const carMap = new Map(cars.map((c) => [c.id, c]));

    const vehicleBreakdown = byVehicle.map((v) => {
      const car = carMap.get(v.carId);
      return {
        carId: v.carId,
        clicks: v._count.id,
        car: car || null,
      };
    });

    return NextResponse.json({
      dealerId,
      period: startDate && endDate ? 'custom' : period || 'week',
      from: from.toISOString(),
      to: to.toISOString(),
      totalClicks,
      uniqueVisitors: uniqueVisitors.length,
      vehicleBreakdown,
    });
  } catch (error) {
    console.error('Website clicks report error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
