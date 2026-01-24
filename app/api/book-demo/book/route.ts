import { NextRequest, NextResponse } from 'next/server';
import { createDemoBooking } from '@/lib/google-calendar';
import { prisma } from '@/lib/prisma';

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

    // Log the booking (optional - you could create a DemoBooking table)
    console.log('[Book Demo] Demo booked:', {
      dealershipName,
      email,
      phone,
      startTime,
      endTime,
      eventId,
      meetLink,
    });

    // Optionally create a contact submission for lead tracking
    try {
      await prisma.contactSubmission.create({
        data: {
          name: dealershipName,
          email,
          phone,
          message: `Demo booking for ${new Date(startTime).toLocaleString('en-US', {
            timeZone: 'America/New_York',
            dateStyle: 'full',
            timeStyle: 'short',
          })}`,
          source: 'demo-booking',
        },
      });
    } catch (e) {
      // Don't fail if contact submission fails
      console.warn('[Book Demo] Failed to create contact submission:', e);
    }

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
