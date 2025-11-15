import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { acceptedDealId, finalPrice } = await request.json();

    if (!acceptedDealId) {
      return NextResponse.json(
        { error: 'Accepted deal ID is required' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {
      sold: true,
    };

    // If a final price is provided, update it
    if (finalPrice !== undefined && finalPrice !== null) {
      updateData.finalPrice = finalPrice;
    }

    // Update the accepted deal to mark as sold and optionally update price
    const updatedDeal = await prisma.acceptedDeal.update({
      where: { id: acceptedDealId },
      data: updateData,
      include: { car: true },
    });

    // Update car status to sold
    await prisma.car.update({
      where: { id: updatedDeal.carId },
      data: { status: 'sold' },
    });

    return NextResponse.json({
      success: true,
      message: 'Deal marked as sold successfully',
      deal: updatedDeal,
    });
  } catch (error) {
    console.error('Error marking deal as sold:', error);
    return NextResponse.json(
      { error: 'Failed to mark deal as sold' },
      { status: 500 }
    );
  }
}
