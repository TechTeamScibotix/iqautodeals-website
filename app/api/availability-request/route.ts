import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendDealerAvailabilityRequestNotification } from '@/lib/email';
import { getNotificationRecipients } from '@/lib/notification-recipients';

const prisma = new PrismaClient();

// Webhook configuration for Scibotix Solutions integration
const DEALERHUB_WEBHOOK_URL = process.env.DEALERHUB_AVAILABILITY_WEBHOOK_URL || 'https://scibotixsolutions.com/api/webhooks/iqautodeals/availability-request';
const WEBHOOK_SECRET = process.env.IQAUTODEALS_WEBHOOK_SECRET || 'iq-dealerhub-sync-2024';

// Notify Scibotix Solutions of new availability request (fire and forget)
async function notifyDealerHub(
  dealerId: string,
  requestId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  zipCode: string,
  comments: string | null,
  car: { carId: string; vin: string; year: number; make: string; model: string; price: number }
) {
  try {
    const response = await fetch(DEALERHUB_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        dealerId,
        requestId,
        firstName,
        lastName,
        email,
        phone,
        zipCode,
        comments,
        car,
      }),
    });

    if (!response.ok) {
      console.error('DealerHub availability webhook failed:', response.status, await response.text());
    } else {
      console.log('DealerHub availability webhook success:', await response.json());
    }
  } catch (error) {
    console.error('DealerHub availability webhook error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { carId, dealerId, firstName, lastName, email, phone, zipCode, comments, userId, requestType } = data;

    // Validation
    if (!carId || !dealerId || !firstName || !lastName || !email || !phone || !zipCode) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Verify the car exists and get dealer info
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        dealer: {
          select: {
            id: true,
            email: true,
            notificationEmail: true,
            name: true,
            businessName: true,
            showCustomMessage: true,
            availabilityMessage: true,
          }
        }
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Create the availability request
    const availabilityRequest = await prisma.availabilityRequest.create({
      data: {
        carId,
        dealerId,
        firstName,
        lastName,
        email,
        phone,
        zipCode,
        comments: comments || null,
        requestType: requestType || 'check_availability', // photo_request, check_availability, test_drive
        userId: userId || null,
        status: 'pending',
      },
    });

    // Log for tracking
    console.log(`[Availability Request] ${firstName} ${lastName} (${email}) - Car: ${car.year} ${car.make} ${car.model} - Dealer: ${car.dealer.businessName}`);

    // Send email notification to dealer and configured team members
    try {
      const recipients = await getNotificationRecipients(car.dealer.id, 'availability');

      for (const recipient of recipients) {
        await sendDealerAvailabilityRequestNotification(
          recipient.email,
          recipient.name,
          {
            year: car.year,
            make: car.make,
            model: car.model,
            vin: car.vin,
            price: car.salePrice,
          },
          {
            firstName,
            lastName,
            email,
            phone,
            zipCode,
            comments: comments || undefined,
          }
        );
      }
      console.log(`[Availability Request] Email sent to ${recipients.length} recipient(s): ${recipients.map(r => r.email).join(', ')}`);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error(`[Availability Request] Failed to send email to dealer:`, emailError);
    }

    // Notify Scibotix Solutions - must await in serverless to prevent early termination
    await notifyDealerHub(
      dealerId,
      availabilityRequest.id,
      firstName,
      lastName,
      email,
      phone,
      zipCode,
      comments || null,
      {
        carId,
        vin: car.vin,
        year: car.year,
        make: car.make,
        model: car.model,
        price: car.salePrice,
      }
    );

    return NextResponse.json({
      success: true,
      requestId: availabilityRequest.id,
      message: 'Availability request submitted successfully',
      showCustomMessage: car.dealer.showCustomMessage || false,
      dealerMessage: car.dealer.availabilityMessage || null,
    });

  } catch (error: any) {
    console.error('Availability request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit availability request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint to fetch availability requests for a dealer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    const requests = await prisma.availabilityRequest.findMany({
      where: { dealerId },
      orderBy: { createdAt: 'desc' },
    });

    // Get car details for each request
    const requestsWithCars = await Promise.all(
      requests.map(async (req) => {
        const car = await prisma.car.findUnique({
          where: { id: req.carId },
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            vin: true,
            salePrice: true,
          },
        });
        return { ...req, car };
      })
    );

    return NextResponse.json({ requests: requestsWithCars });

  } catch (error: any) {
    console.error('Get availability requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability requests' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
