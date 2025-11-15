import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { testDriveId, scheduledDate, scheduledTime } = await request.json();

    if (!testDriveId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the test drive with the scheduled date and time
    const updatedTestDrive = await prisma.testDrive.update({
      where: { id: testDriveId },
      data: {
        scheduledDate,
        scheduledTime,
        status: 'scheduled',
      },
    });

    return NextResponse.json({
      success: true,
      testDrive: updatedTestDrive,
      message: 'Test drive appointment scheduled successfully',
    });
  } catch (error) {
    console.error('Error updating test drive:', error);
    return NextResponse.json(
      { error: 'Failed to update test drive' },
      { status: 500 }
    );
  }
}
