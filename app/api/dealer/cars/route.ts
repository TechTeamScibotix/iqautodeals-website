import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json({ error: 'Dealer ID required' }, { status: 400 });
    }

    const cars = await prisma.car.findMany({
      where: { dealerId },
      include: {
        acceptedDeals: {
          where: {
            deadDeal: false, // Exclude dead deals
          },
          select: {
            sold: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Count cars by status
    const statusCounts = {
      active: cars.filter(c => c.status === 'active').length,
      pending: cars.filter(c => c.status === 'pending').length,
      sold: cars.filter(c => c.status === 'sold').length,
      removed: cars.filter(c => c.status === 'removed').length,
    };

    // Also get sold count from AcceptedDeals (for deals made through the platform)
    const dealsSoldCount = await prisma.acceptedDeal.count({
      where: {
        sold: true,
        deadDeal: false,
        car: {
          dealerId,
        },
      },
    });

    // Total sold = cars marked sold + deals marked sold (avoid double counting)
    const soldCount = statusCounts.sold + dealsSoldCount;

    return NextResponse.json({ cars, soldCount, statusCounts });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

// Helper to generate SEO-friendly slug: vin-year-make-model-city-state
function generateSlug(data: { year: number; make: string; model: string; city: string; state: string; vin: string }): string {
  return [
    data.vin.toLowerCase(),
    data.year,
    data.make.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    data.model.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    data.city.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    data.state.toLowerCase()
  ].join('-').replace(/-+/g, '-');
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Handle photos - avoid double-stringifying
    // Frontend may send already-stringified JSON or an array
    let photos = data.photos;
    if (typeof photos === 'string') {
      // Already stringified, use as-is
      photos = photos;
    } else if (Array.isArray(photos)) {
      // Array needs to be stringified
      photos = JSON.stringify(photos);
    } else {
      photos = '[]';
    }

    // Check if VIN already exists
    const existingCar = await prisma.car.findUnique({
      where: { vin: data.vin },
    });

    if (existingCar) {
      // If same dealer and car is sold/removed, they can relist it
      if (existingCar.dealerId === data.dealerId) {
        if (existingCar.status === 'sold' || existingCar.status === 'removed') {
          // Relist the existing car with updated data
          const updatedCar = await prisma.car.update({
            where: { id: existingCar.id },
            data: {
              ...data,
              photos,
              status: 'active',
              statusChangedAt: new Date(),
            },
          });
          return NextResponse.json({ car: updatedCar, relisted: true });
        } else {
          return NextResponse.json(
            { error: 'You already have an active listing for this VIN' },
            { status: 400 }
          );
        }
      }

      // Different dealer - check if old listing is sold/removed
      if (existingCar.status === 'sold' || existingCar.status === 'removed') {
        // Archive the old listing by changing its VIN
        const archivedVin = `${existingCar.vin}-archived-${Date.now()}`;
        const archivedSlug = existingCar.slug ? `${existingCar.slug}-archived-${Date.now()}` : null;

        await prisma.car.update({
          where: { id: existingCar.id },
          data: {
            vin: archivedVin,
            slug: archivedSlug,
          },
        });

        // Now create the new listing
        const slug = generateSlug({
          year: data.year,
          make: data.make,
          model: data.model,
          city: data.city,
          state: data.state,
          vin: data.vin,
        });

        const car = await prisma.car.create({
          data: {
            ...data,
            photos,
            slug,
            listingFeePaid: true,
          },
        });

        return NextResponse.json({ car, archivedPreviousListing: true });
      } else {
        // VIN is currently active with another dealer
        return NextResponse.json(
          { error: 'This VIN is already listed by another dealer' },
          { status: 400 }
        );
      }
    }

    // Generate SEO-friendly slug: 2024-toyota-camry-atlanta-ga-vin123
    const slug = generateSlug({
      year: data.year,
      make: data.make,
      model: data.model,
      city: data.city,
      state: data.state,
      vin: data.vin,
    });

    const car = await prisma.car.create({
      data: {
        ...data,
        photos,
        slug,
        listingFeePaid: true, // Simulated for demo
      },
    });

    return NextResponse.json({ car });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
