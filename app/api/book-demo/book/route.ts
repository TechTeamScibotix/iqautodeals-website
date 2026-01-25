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
    const slotEnd = new Date(endTime);
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

    // Create Centrix Calendar Event so it appears in Centrix CRM
    try {
      // Get the default Centrix user for IQ Auto Deals bookings
      // Use techteam@scibotixsolutions.com or the first active admin
      const centrixOwner = await prisma.centrixUser.findFirst({
        where: {
          OR: [
            { email: 'techteam@scibotixsolutions.com' },
            { email: 'joe@scibotixsolutions.com' },
          ],
          isActive: true,
        },
        select: { id: true },
      });

      if (centrixOwner) {
        await prisma.centrixCalendarEvent.create({
          data: {
            title: `IQ Auto Deals Demo - ${dealershipName}`,
            description: `Demo booking from IQ Auto Deals website\n\nDealership: ${dealershipName}\nEmail: ${email}\nPhone: ${phone}`,
            eventType: 'DEMO',
            startTime: slotStart,
            endTime: slotEnd,
            timezone: 'America/New_York',
            ownerId: centrixOwner.id,
            status: 'SCHEDULED',
            isPublicBooking: true,
            bookedByName: dealershipName,
            bookedByEmail: email,
            bookedByPhone: phone,
            bookedByCompany: dealershipName,
            googleSharedEventId: eventId,
            googleMeetLink: meetLink || undefined,
            googleSyncStatus: 'SYNCED',
            lastGoogleSyncAt: new Date(),
          },
        });
        console.log('[Book Demo] Created Centrix calendar event');
      } else {
        console.warn('[Book Demo] No Centrix owner found, skipping Centrix event creation');
      }
    } catch (centrixError) {
      // Don't fail the booking if Centrix sync fails
      console.error('[Book Demo] Failed to create Centrix event:', centrixError);
    }

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
