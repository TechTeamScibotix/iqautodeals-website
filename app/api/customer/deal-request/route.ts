import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendDealerDealRequestNotification } from '@/lib/email';

// Webhook to notify DealerHub of new deal requests
const DEALERHUB_WEBHOOK_URL = process.env.DEALERHUB_WEBHOOK_URL || 'https://scibotixsolutions.com/api/webhooks/iqautodeals/deal-request';
const WEBHOOK_SECRET = process.env.IQAUTODEALS_WEBHOOK_SECRET || 'iq-dealerhub-sync-2024';

async function notifyDealerHub(dealerId: string, customerId: string, customerName: string, customerEmail: string | null, customerPhone: string | null, cars: { carId: string; vin: string; year: number; make: string; model: string; price: number }[]) {
  try {
    const response = await fetch(DEALERHUB_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        dealerId,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        cars,
      }),
    });

    if (!response.ok) {
      console.error('DealerHub webhook failed:', response.status, await response.text());
    } else {
      console.log('DealerHub webhook success:', await response.json());
    }
  } catch (error) {
    // Don't fail the main request if webhook fails
    console.error('DealerHub webhook error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, carIds } = await request.json();

    if (!customerId || !carIds || carIds.length === 0) {
      return NextResponse.json(
        { error: 'Customer ID and car IDs are required' },
        { status: 400 }
      );
    }

    // Check if customer already has any ongoing deal (active or accepted but not completed)
    const existingDealList = await prisma.dealList.findFirst({
      where: {
        customerId,
        status: { in: ['active', 'accepted'] }, // Block new deals for both active and accepted deals
      },
      include: {
        selectedCars: true // Include ALL selectedCars to check for duplicates properly
      }
    });

    // If customer has an existing deal, they cannot create a new one - only add to existing active deal
    if (existingDealList) {
      // If the existing deal is 'accepted' (offer accepted, not yet completed), block completely
      if (existingDealList.status === 'accepted') {
        return NextResponse.json(
          { error: 'You already have an accepted deal in progress. Please complete or cancel it before starting a new deal request.' },
          { status: 400 }
        );
      }

      // Count only NON-CANCELLED cars for slot limit
      const activeSelectedCars = existingDealList.selectedCars.filter(sc => sc.status !== 'cancelled');
      const currentCarCount = activeSelectedCars.length;

      // Check for cars that are already active (not cancelled) - these are true duplicates
      const activeCarIds = activeSelectedCars.map(sc => sc.carId);
      const trueDuplicates = carIds.filter((id: string) => activeCarIds.includes(id));
      if (trueDuplicates.length > 0) {
        return NextResponse.json(
          { error: 'One or more selected cars are already in your deal request.', currentCount: currentCarCount, maxCars: 4 },
          { status: 400 }
        );
      }

      // Check for cars that were cancelled - these can be reactivated
      const cancelledCars = existingDealList.selectedCars.filter(sc => sc.status === 'cancelled');
      const cancelledCarIds = cancelledCars.map(sc => sc.carId);
      const carsToReactivate = carIds.filter((id: string) => cancelledCarIds.includes(id));
      const newCarIds = carIds.filter((id: string) => !cancelledCarIds.includes(id));

      // Calculate available slots (only for truly new cars)
      const availableSlots = 4 - currentCarCount;
      const totalNewCars = newCarIds.length + carsToReactivate.length;

      if (totalNewCars > availableSlots) {
        if (availableSlots === 0) {
          return NextResponse.json(
            { error: 'You already have 4 cars in your deal request. Cancel one to add another.', currentCount: currentCarCount, maxCars: 4 },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: `You can only add ${availableSlots} more car${availableSlots === 1 ? '' : 's'}. You currently have ${currentCarCount} car${currentCarCount === 1 ? '' : 's'} in your deal request.`, currentCount: currentCarCount, maxCars: 4 },
          { status: 400 }
        );
      }

      // Reactivate cancelled cars instead of creating duplicates
      let reactivatedCount = 0;
      if (carsToReactivate.length > 0) {
        const selectedCarsToReactivate = cancelledCars.filter(sc => carsToReactivate.includes(sc.carId));
        for (const sc of selectedCarsToReactivate) {
          await prisma.selectedCar.update({
            where: { id: sc.id },
            data: { status: 'pending' }
          });
          reactivatedCount++;
        }
      }

      // Store the counts for the response
      const activeCountBefore = currentCarCount;
      const totalToAdd = newCarIds.length + reactivatedCount;

      // Update carIds to only include truly new cars (not reactivated ones)
      // This will be used for creating new SelectedCar entries
      (carIds as string[]).splice(0, carIds.length, ...newCarIds);

      // Store reactivated count for response message
      (request as any).reactivatedCount = reactivatedCount;
      (request as any).activeCountBefore = activeCountBefore;
    }

    // Use existing active deal list or create a new one (only if no existing deal)
    const dealList = existingDealList || await prisma.dealList.create({
      data: {
        customerId,
        status: 'active',
      },
    });

    // Get car details for the selected cars (including dealer info)
    const cars = await prisma.car.findMany({
      where: { id: { in: carIds } },
      include: {
        dealer: {
          select: {
            id: true,
            email: true,
            name: true,
            businessName: true,
          },
        },
      },
    });

    // Get customer info for webhook
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    // Add selected cars to the deal list with original prices
    const selectedCarsData = cars.map((car) => ({
      dealListId: dealList.id,
      carId: car.id,
      originalPrice: car.salePrice,
      currentOfferPrice: car.salePrice,
    }));

    await prisma.selectedCar.createMany({
      data: selectedCarsData,
    });

    // Notify DealerHub via webhook and email (group cars by dealer)
    const carsByDealer = new Map<string, { dealerEmail: string; dealerName: string; cars: { carId: string; vin: string; year: number; make: string; model: string; price: number }[] }>();
    for (const car of cars) {
      if (car.dealer?.id) {
        if (!carsByDealer.has(car.dealer.id)) {
          carsByDealer.set(car.dealer.id, {
            dealerEmail: car.dealer.email,
            dealerName: car.dealer.businessName || car.dealer.name || 'Dealer',
            cars: [],
          });
        }
        carsByDealer.get(car.dealer.id)!.cars.push({
          carId: car.id,
          vin: car.vin,
          year: car.year,
          make: car.make,
          model: car.model,
          price: car.salePrice,
        });
      }
    }

    // Send webhook and email for each dealer (don't await - fire and forget)
    for (const [dealerId, dealerData] of carsByDealer) {
      // Webhook to DealerHub
      notifyDealerHub(
        dealerId,
        customerId,
        customer?.name || 'Unknown Customer',
        customer?.email || null,
        customer?.phone || null,
        dealerData.cars
      );

      // Email notification to dealer
      sendDealerDealRequestNotification(
        dealerData.dealerEmail,
        dealerData.dealerName,
        customer?.name || 'A Customer',
        dealerData.cars.map(c => ({ year: c.year, make: c.make, model: c.model, price: c.price }))
      ).catch(err => console.error('Failed to send dealer deal request email:', err));
    }

    // Get accurate counts using stored values from earlier
    const reactivatedCount = (request as any).reactivatedCount || 0;
    const activeCountBefore = (request as any).activeCountBefore || 0;
    const newCarsCreated = selectedCarsData.length;
    const totalAdded = newCarsCreated + reactivatedCount;
    const newTotalCount = existingDealList ? (activeCountBefore + totalAdded) : newCarsCreated;
    const remainingSlots = 4 - newTotalCount;

    return NextResponse.json({
      success: true,
      dealList,
      message: existingDealList && totalAdded > 0
        ? `Added ${totalAdded} car${totalAdded === 1 ? '' : 's'} to your deal request.`
        : 'Deal request submitted successfully!',
      currentCount: newTotalCount,
      remainingSlots,
      maxCars: 4,
    });
  } catch (error) {
    console.error('Error creating deal request:', error);
    return NextResponse.json(
      { error: 'Failed to create deal request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const dealLists = await prisma.dealList.findMany({
      where: { customerId },
      include: {
        selectedCars: {
          where: {
            status: {
              not: 'cancelled',
            },
          },
          include: {
            car: {
              include: {
                dealer: true,
                acceptedDeals: {
                  where: {
                    customerId,
                  },
                  include: {
                    testDrive: {
                      select: {
                        id: true,
                        status: true,
                        scheduledDate: true,
                        scheduledTime: true,
                      },
                    },
                  },
                },
              },
            },
            negotiations: {
              include: {
                dealer: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ dealLists });
  } catch (error) {
    console.error('Error fetching deal lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal lists' },
      { status: 500 }
    );
  }
}
