import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendDealerAvailabilityRequestNotification } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { carId, dealerId, firstName, lastName, email, phone, zipCode, comments, userId } = data;

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
        userId: userId || null,
        status: 'pending',
      },
    });

    // Log for tracking
    console.log(`[Availability Request] ${firstName} ${lastName} (${email}) - Car: ${car.year} ${car.make} ${car.model} - Dealer: ${car.dealer.businessName}`);

    // Send email notification to dealer
    try {
      await sendDealerAvailabilityRequestNotification(
        car.dealer.notificationEmail || car.dealer.email,
        car.dealer.businessName || car.dealer.name || 'Dealer',
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
      console.log(`[Availability Request] Email sent to dealer: ${car.dealer.email}`);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error(`[Availability Request] Failed to send email to dealer:`, emailError);
    }

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
