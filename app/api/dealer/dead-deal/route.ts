import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { acceptedDealId } = await request.json();

    if (!acceptedDealId) {
      return NextResponse.json({ error: 'Accepted deal ID required' }, { status: 400 });
    }

    // Get the accepted deal with car info
    const acceptedDeal = await prisma.acceptedDeal.findUnique({
      where: { id: acceptedDealId },
      include: { car: true },
    });

    if (!acceptedDeal) {
      return NextResponse.json({ error: 'Accepted deal not found' }, { status: 404 });
    }

    // Cancel test drive if it exists
    await prisma.testDrive.updateMany({
      where: { acceptedDealId },
      data: { status: 'cancelled' },
    });

    // Mark the accepted deal as dead and unset sold flag
    await prisma.acceptedDeal.update({
      where: { id: acceptedDealId },
      data: {
        deadDeal: true,
        sold: false,
      },
    });

    // Set car status back to active
    await prisma.car.update({
      where: { id: acceptedDeal.carId },
      data: { status: 'active' },
    });

    return NextResponse.json({ message: 'Deal marked as dead successfully' });
  } catch (error) {
    console.error('Error marking deal as dead:', error);
    return NextResponse.json({ error: 'Failed to mark deal as dead' }, { status: 500 });
  }
}
