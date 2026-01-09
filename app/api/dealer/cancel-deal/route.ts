import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCustomerDealCancelledByDealerNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { selectedCarId, dealerId } = await request.json();

    if (!selectedCarId || !dealerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the selected car with related data
    const selectedCar = await prisma.selectedCar.findUnique({
      where: { id: selectedCarId },
      include: {
        car: {
          select: {
            id: true,
            year: true,
            make: true,
            model: true,
            dealerId: true,
          },
        },
        dealList: {
          select: {
            id: true,
            customerId: true,
            customer: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!selectedCar) {
      return NextResponse.json(
        { error: 'Selected car not found' },
        { status: 404 }
      );
    }

    // Verify the dealer owns this car
    if (selectedCar.car.dealerId !== dealerId) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not own this vehicle' },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (selectedCar.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This deal is already cancelled' },
        { status: 400 }
      );
    }

    // Update selected car status to cancelled
    await prisma.selectedCar.update({
      where: { id: selectedCarId },
      data: { status: 'cancelled' },
    });

    // Get dealer info for the email
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: { businessName: true, name: true },
    });

    // Send email notification to customer
    if (selectedCar.dealList?.customer?.email) {
      sendCustomerDealCancelledByDealerNotification(
        selectedCar.dealList.customer.email,
        selectedCar.dealList.customer.name || 'Customer',
        dealer?.businessName || dealer?.name || 'A Dealer',
        {
          year: selectedCar.car.year,
          make: selectedCar.car.make,
          model: selectedCar.car.model,
        }
      ).catch(err => console.error('Failed to send customer deal cancelled email:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Deal cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling deal:', error);
    return NextResponse.json(
      { error: 'Failed to cancel deal' },
      { status: 500 }
    );
  }
}
