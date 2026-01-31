import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendDealerOfferDeclinedNotification } from '@/lib/email';
import { getNotificationRecipients, getParentDealerId } from '@/lib/notification-recipients';

export async function POST(request: NextRequest) {
  try {
    const { negotiationId, customerId } = await request.json();

    if (!negotiationId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the negotiation with related data
    const negotiation = await prisma.negotiation.findUnique({
      where: { id: negotiationId },
      include: {
        dealer: {
          select: {
            id: true,
            email: true,
            notificationEmail: true,
            name: true,
            businessName: true,
          },
        },
        selectedCar: {
          include: {
            car: {
              select: {
                year: true,
                make: true,
                model: true,
                vin: true,
              },
            },
            dealList: {
              select: {
                customerId: true,
                customer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: 'Negotiation not found' },
        { status: 404 }
      );
    }

    // Verify the customer owns this deal
    if (negotiation.selectedCar.dealList.customerId !== customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update negotiation status to declined
    await prisma.negotiation.update({
      where: { id: negotiationId },
      data: { status: 'declined' },
    });

    // Check if all 3 offers from this dealer have been declined
    const allOffersFromDealer = await prisma.negotiation.findMany({
      where: {
        selectedCarId: negotiation.selectedCar.id,
        dealerId: negotiation.dealer.id,
      },
    });

    const allDeclined = allOffersFromDealer.length >= 3 &&
      allOffersFromDealer.every(offer => offer.status === 'declined' || offer.id === negotiationId);

    let dealAutoCancelled = false;

    if (allDeclined) {
      // Auto-cancel the deal for this car since all 3 offers were declined
      await prisma.selectedCar.update({
        where: { id: negotiation.selectedCar.id },
        data: { status: 'cancelled' },
      });
      dealAutoCancelled = true;
    }

    // Send email notification to dealer and configured team members
    const customerName = negotiation.selectedCar.dealList.customer.name || 'A customer';
    const car = negotiation.selectedCar.car;

    // Get the parent dealer ID (in case the negotiation was from a team member)
    const parentDealerId = await getParentDealerId(negotiation.dealer.id);

    getNotificationRecipients(parentDealerId, 'offerDeclined')
      .then(recipients => {
        for (const recipient of recipients) {
          sendDealerOfferDeclinedNotification(
            recipient.email,
            recipient.name,
            customerName,
            {
              year: car.year,
              make: car.make,
              model: car.model,
            },
            negotiation.offeredPrice
          ).catch(err => console.error('Failed to send dealer decline notification:', err));
        }
      })
      .catch(err => console.error('Failed to get notification recipients:', err));

    return NextResponse.json({
      success: true,
      message: dealAutoCancelled
        ? 'All 3 offers declined. This deal has been automatically cancelled.'
        : 'Offer declined successfully',
      dealCancelled: dealAutoCancelled,
    });
  } catch (error) {
    console.error('Error declining offer:', error);
    return NextResponse.json(
      { error: 'Failed to decline offer' },
      { status: 500 }
    );
  }
}
