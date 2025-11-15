import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { customerId, carIds } = await request.json();

    if (!customerId || !carIds || carIds.length === 0) {
      return NextResponse.json(
        { error: 'Customer ID and car IDs are required' },
        { status: 400 }
      );
    }

    // Create a deal list
    const dealList = await prisma.dealList.create({
      data: {
        customerId,
        status: 'active',
      },
    });

    // Get car prices for the selected cars
    const cars = await prisma.car.findMany({
      where: { id: { in: carIds } },
    });

    // Add selected cars to the deal list with original prices
    const selectedCarsData = cars.map((car) => ({
      dealListId: dealList.id,
      carId: car.id,
      originalPrice: car.salePrice,
      currentOfferPrice: car.salePrice,
    }));

    await prisma.selectedCar.createMany({
      data: selectedCarsData,
    });

    return NextResponse.json({
      success: true,
      dealList,
      message: 'Deal request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating deal request:', error);
    return NextResponse.json(
      { error: 'Failed to create deal request' },
      { status: 500 }
    );
  }
}

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

    const dealLists = await prisma.dealList.findMany({
      where: { customerId },
      include: {
        selectedCars: {
          where: {
            status: {
              not: 'cancelled',
            },
          },
          include: {
            car: {
              include: {
                dealer: true,
                acceptedDeals: {
                  where: {
                    customerId,
                  },
                  include: {
                    testDrive: {
                      select: {
                        id: true,
                        status: true,
                        scheduledDate: true,
                        scheduledTime: true,
                      },
                    },
                  },
                },
              },
            },
            negotiations: {
              include: {
                dealer: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ dealLists });
  } catch (error) {
    console.error('Error fetching deal lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal lists' },
      { status: 500 }
    );
  }
}
