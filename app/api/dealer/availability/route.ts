import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');
    const date = searchParams.get('date');

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID required' },
        { status: 400 }
      );
    }

    // Get dealer work hours
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        workHoursStart: true,
        workHoursEnd: true,
        workDays: true,
      },
    });

    if (!dealer) {
      return NextResponse.json(
        { error: 'Dealer not found' },
        { status: 404 }
      );
    }

    // Parse work days
    let workDays = [];
    try {
      workDays = dealer.workDays ? JSON.parse(dealer.workDays) : [];
    } catch (e) {
      workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    const workHoursStart = dealer.workHoursStart || '09:00';
    const workHoursEnd = dealer.workHoursEnd || '18:00';

    // If date is provided, get existing appointments for that day
    let bookedSlots: string[] = [];
    if (date) {
      const testDrives = await prisma.testDrive.findMany({
        where: {
          dealerId,
          scheduledDate: date,
          status: { not: 'cancelled' },
        },
        select: {
          scheduledTime: true,
        },
      });

      bookedSlots = testDrives.map((td) => td.scheduledTime);
    }

    // Generate available time slots (every hour)
    const timeSlots: string[] = [];
    const startHour = parseInt(workHoursStart.split(':')[0]);
    const endHour = parseInt(workHoursEnd.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      timeSlots.push(timeSlot);
    }

    return NextResponse.json({
      workHoursStart,
      workHoursEnd,
      workDays,
      timeSlots,
      bookedSlots,
    });
  } catch (error) {
    console.error('Error fetching dealer availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
