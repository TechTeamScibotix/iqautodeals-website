import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get customer's current deal status (how many cars in active deal)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get any ongoing deal list (active or accepted) with non-cancelled cars
    const ongoingDealList = await prisma.dealList.findFirst({
      where: {
        customerId,
        status: { in: ['active', 'accepted'] },
      },
      include: {
        selectedCars: {
          where: { status: { not: 'cancelled' } },
          include: {
            car: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
              }
            }
          }
        }
      }
    });

    const currentCount = ongoingDealList?.selectedCars.length || 0;
    // If deal is 'accepted', no slots available - they need to complete or cancel it
    const remainingSlots = ongoingDealList?.status === 'accepted' ? 0 : (4 - currentCount);
    const carIdsInDeal = ongoingDealList?.selectedCars.map(sc => sc.carId) || [];

    return NextResponse.json({
      hasActiveDeal: !!ongoingDealList,
      dealStatus: ongoingDealList?.status || null,
      currentCount,
      remainingSlots,
      maxCars: 4,
      carIdsInDeal,
      carsInDeal: ongoingDealList?.selectedCars.map(sc => ({
        id: sc.carId,
        make: sc.car.make,
        model: sc.car.model,
        year: sc.car.year,
      })) || [],
    });
  } catch (error) {
    console.error('Error fetching deal status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal status' },
      { status: 500 }
    );
  }
}
