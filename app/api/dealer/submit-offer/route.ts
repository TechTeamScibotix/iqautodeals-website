import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCustomerOfferNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { selectedCarId, dealerId, offerPrice, isFirmPrice } = await request.json();

    if (!selectedCarId || !dealerId || !offerPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the selected car to check its status
    const selectedCarCheck = await prisma.selectedCar.findUnique({
      where: { id: selectedCarId },
      select: { status: true },
    });

    if (!selectedCarCheck) {
      return NextResponse.json(
        { error: 'Selected car not found' },
        { status: 404 }
      );
    }

    // Check if the deal has been cancelled
    if (selectedCarCheck.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This deal has been cancelled. No more offers can be submitted.' },
        { status: 400 }
      );
    }

    // Check how many offers this dealer has already submitted for this selected car
    const existingOffers = await prisma.negotiation.findMany({
      where: {
        selectedCarId,
        dealerId,
      },
    });

    if (existingOffers.length >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 offers per car allowed' },
        { status: 400 }
      );
    }

    // Check if dealer has a pending offer that hasn't been responded to yet
    const pendingOffer = existingOffers.find(offer => offer.status === 'pending');
    if (pendingOffer) {
      return NextResponse.json(
        { error: 'You already have a pending offer. Please wait for the customer to respond before making another offer.' },
        { status: 400 }
      );
    }

    // Create the negotiation/offer
    const negotiation = await prisma.negotiation.create({
      data: {
        selectedCarId,
        dealerId,
        offeredPrice: parseFloat(offerPrice),
      },
    });

    // Update the selected car's current offer price and negotiation count
    const selectedCar = await prisma.selectedCar.findUnique({
      where: { id: selectedCarId },
      include: {
        car: {
          select: {
            year: true,
            make: true,
            model: true,
          },
        },
        dealList: {
          select: {
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

    if (selectedCar) {
      await prisma.selectedCar.update({
        where: { id: selectedCarId },
        data: {
          currentOfferPrice: Math.min(
            selectedCar.currentOfferPrice,
            parseFloat(offerPrice)
          ),
          negotiationCount: selectedCar.negotiationCount + 1,
        },
      });

      // Get dealer info for the email
      const dealer = await prisma.user.findUnique({
        where: { id: dealerId },
        select: { businessName: true, name: true },
      });

      // Send email notification to customer (fire and forget)
      if (selectedCar.dealList?.customer?.email) {
        sendCustomerOfferNotification(
          selectedCar.dealList.customer.email,
          selectedCar.dealList.customer.name || 'Customer',
          dealer?.businessName || dealer?.name || 'A Dealer',
          {
            year: selectedCar.car.year,
            make: selectedCar.car.make,
            model: selectedCar.car.model,
          },
          selectedCar.originalPrice,
          parseFloat(offerPrice),
          isFirmPrice || false
        ).catch(err => console.error('Failed to send customer offer email:', err));
      }
    }

    return NextResponse.json({
      success: true,
      negotiation,
      message: 'Offer submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting offer:', error);
    return NextResponse.json(
      { error: 'Failed to submit offer' },
      { status: 500 }
    );
  }
}
