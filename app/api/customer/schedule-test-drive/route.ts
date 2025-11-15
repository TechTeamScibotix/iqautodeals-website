import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { acceptedDealId, customerId, scheduledDate, scheduledTime, customerNotes } = await request.json();

    if (!acceptedDealId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the accepted deal to find the dealer
    const acceptedDeal = await prisma.acceptedDeal.findUnique({
      where: { id: acceptedDealId },
      include: {
        car: {
          select: {
            dealerId: true,
          },
        },
      },
    });

    if (!acceptedDeal) {
      return NextResponse.json(
        { error: 'Accepted deal not found' },
        { status: 404 }
      );
    }

    // Check if a test drive already exists for this accepted deal
    const existingTestDrive = await prisma.testDrive.findFirst({
      where: {
        acceptedDealId,
        status: { not: 'cancelled' },
      },
    });

    if (existingTestDrive) {
      return NextResponse.json(
        { error: 'A test drive is already scheduled for this vehicle' },
        { status: 400 }
      );
    }

    // Create the test drive appointment
    const testDrive = await prisma.testDrive.create({
      data: {
        customerId,
        dealerId: acceptedDeal.car.dealerId,
        acceptedDealId,
        scheduledDate: scheduledDate || 'TBD',
        scheduledTime: scheduledTime || 'TBD',
        customerNotes: customerNotes || null,
        status: (scheduledDate && scheduledTime) ? 'scheduled' : 'requested',
      },
    });

    return NextResponse.json({
      success: true,
      testDrive,
      message: 'Test drive scheduled successfully',
    });
  } catch (error) {
    console.error('Error scheduling test drive:', error);
    return NextResponse.json(
      { error: 'Failed to schedule test drive' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch test drives for a customer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const acceptedDealId = searchParams.get('acceptedDealId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      );
    }

    const where: any = {
      customerId,
    };

    if (acceptedDealId) {
      where.acceptedDealId = acceptedDealId;
    }

    const testDrives = await prisma.testDrive.findMany({
      where,
      include: {
        dealer: {
          select: {
            name: true,
            businessName: true,
            phone: true,
            address: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'asc',
      },
    });

    return NextResponse.json({ testDrives });
  } catch (error) {
    console.error('Error fetching test drives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test drives' },
      { status: 500 }
    );
  }
}
