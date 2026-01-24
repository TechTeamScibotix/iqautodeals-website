import { NextRequest, NextResponse } from 'next/server';
import { createDemoBooking } from '@/lib/google-calendar';

// POST - Book a demo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dealershipName, email, phone, startTime, endTime } = body;

    // Validate required fields
    if (!dealershipName || !email || !phone || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate time slot is in the future
    const slotStart = new Date(startTime);
    if (slotStart <= new Date()) {
      return NextResponse.json(
        { error: 'Cannot book a slot in the past' },
        { status: 400 }
      );
    }

    // Create the booking in Google Calendar
    const { eventId, meetLink } = await createDemoBooking({
      dealershipName,
      email,
      phone,
      startTime,
      endTime,
    });

    // Log the booking
    console.log('[Book Demo] Demo booked:', {
      dealershipName,
      email,
      phone,
      startTime,
      endTime,
      eventId,
      meetLink,
    });

    return NextResponse.json({
      success: true,
      eventId,
      meetLink,
      message: 'Demo booked successfully! Check your email for the calendar invitation.',
    });
  } catch (error) {
    console.error('[Book Demo] Error booking demo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to book demo' },
      { status: 500 }
    );
  }
}
