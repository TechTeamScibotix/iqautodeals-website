import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendDealerCustomerCancelledNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { selectedCarId, customerId } = await request.json();

    if (!selectedCarId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the selected car with related data for notification
    const selectedCar = await prisma.selectedCar.findUnique({
      where: { id: selectedCarId },
      include: {
        car: {
          select: {
            id: true,
            year: true,
            make: true,
            model: true,
            dealer: {
              select: {
                id: true,
                email: true,
                name: true,
                businessName: true,
              },
            },
            acceptedDeals: {
              where: { customerId },
            },
          },
        },
        dealList: {
          select: {
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!selectedCar) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Check if this is an accepted deal (has acceptedDeal record)
    const acceptedDeal = selectedCar.car.acceptedDeals?.[0];

    if (acceptedDeal) {
      // Mark the accepted deal as cancelled by customer
      await prisma.acceptedDeal.update({
        where: { id: acceptedDeal.id },
        data: { cancelledByCustomer: true },
      });
    }

    // Update the selected car status to cancelled
    await prisma.selectedCar.update({
      where: { id: selectedCarId },
      data: { status: 'cancelled' },
    });

    // Send notification to dealer
    const customerName = selectedCar.dealList.customer.name || 'A customer';
    const dealer = selectedCar.car.dealer;

    if (dealer?.email) {
      sendDealerCustomerCancelledNotification(
        dealer.email,
        dealer.businessName || dealer.name,
        customerName,
        {
          year: selectedCar.car.year,
          make: selectedCar.car.make,
          model: selectedCar.car.model,
        },
        !!acceptedDeal // wasAccepted - true if they had accepted an offer
      ).catch(err => console.error('Failed to send dealer cancellation notification:', err));
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
