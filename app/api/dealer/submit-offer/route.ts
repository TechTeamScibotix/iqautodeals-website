import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { selectedCarId, dealerId, offerPrice } = await request.json();

    if (!selectedCarId || !dealerId || !offerPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check how many offers this dealer has already submitted for this selected car
    const existingOffers = await prisma.negotiation.count({
      where: {
        selectedCarId,
        dealerId,
      },
    });

    if (existingOffers >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 offers per car allowed' },
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
