import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { selectedCarId, customerId } = await request.json();

    if (!selectedCarId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the selected car status to cancelled
    const updatedSelectedCar = await prisma.selectedCar.update({
      where: { id: selectedCarId },
      data: {
        status: 'cancelled',
      },
    });

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
