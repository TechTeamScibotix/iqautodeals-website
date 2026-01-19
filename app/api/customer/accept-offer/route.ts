import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { negotiationId, customerId } = await request.json();

    if (!negotiationId || !customerId) {
      return NextResponse.json(
        { error: 'Negotiation ID and Customer ID are required' },
        { status: 400 }
      );
    }

    // Get the negotiation with related data
    const negotiation = await prisma.negotiation.findUnique({
      where: { id: negotiationId },
      include: {
        selectedCar: {
          include: {
            car: true,
            dealList: true,
          },
        },
        dealer: true,
      },
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: 'Negotiation not found' },
        { status: 404 }
      );
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create accepted deal record
    const acceptedDeal = await prisma.acceptedDeal.create({
      data: {
        customerId,
        carId: negotiation.selectedCar.carId,
        finalPrice: negotiation.offeredPrice,
        verificationCode,
        depositReleased: false,
        customerShowedUp: false,
      },
    });

    // Update selected car status to won
    await prisma.selectedCar.update({
      where: { id: negotiation.selectedCarId },
      data: { status: 'won' },
    });

    // Update car status to sold (shows as "sale pending" until dealer confirms)
    // Set statusChangedAt to track when the 3-day auto-complete timer starts
    await prisma.car.update({
      where: { id: negotiation.selectedCar.carId },
      data: {
        status: 'sold',
        statusChangedAt: new Date(),
      },
    });

    // Update deal list status
    await prisma.dealList.update({
      where: { id: negotiation.selectedCar.dealListId },
      data: { status: 'accepted' },
    });

    return NextResponse.json({
      success: true,
      acceptedDeal,
      verificationCode,
      message: 'Offer accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting offer:', error);
    return NextResponse.json(
      { error: 'Failed to accept offer' },
      { status: 500 }
    );
  }
}
