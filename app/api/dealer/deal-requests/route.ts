import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    // Find all deal lists that include cars from this dealer
    const dealLists = await prisma.dealList.findMany({
      where: {
        selectedCars: {
          some: {
            car: {
              dealerId,
            },
          },
        },
      },
      include: {
        customer: true,
        selectedCars: {
          include: {
            car: {
              include: {
                dealer: {
                  select: {
                    id: true,
                    businessName: true,
                    name: true,
                  },
                },
                acceptedDeals: true, // Get all acceptedDeals first, we'll filter in the response
              },
            },
            negotiations: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter acceptedDeals to only include the one matching the dealList's customer
    const filteredDealLists = dealLists.map(dealList => ({
      ...dealList,
      selectedCars: dealList.selectedCars.map(sc => ({
        ...sc,
        car: {
          ...sc.car,
          acceptedDeals: sc.car.acceptedDeals
            .filter(ad => ad.customerId === dealList.customerId)
            .map(ad => ({
              ...ad,
              testDrive: null, // Will fetch separately
            })),
        },
      })),
    }));

    // Now fetch testDrives for the filtered acceptedDeals
    for (const dealList of filteredDealLists) {
      for (const sc of dealList.selectedCars) {
        for (const ad of sc.car.acceptedDeals) {
          const testDrive = await prisma.testDrive.findUnique({
            where: { acceptedDealId: ad.id },
            select: {
              id: true,
              status: true,
              scheduledDate: true,
              scheduledTime: true,
            },
          });
          if (testDrive) {
            (ad as any).testDrive = testDrive;
          }
        }
      }
    }

    return NextResponse.json({ dealLists: filteredDealLists });
  } catch (error) {
    console.error('Error fetching deal requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal requests' },
      { status: 500 }
    );
  }
}
