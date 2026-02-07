import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await context.params;
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    // Fetch the car and verify ownership
    const car = await prisma.car.findFirst({
      where: {
        id: carId,
        dealerId: dealerId || undefined,
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await context.params;
    const body = await request.json();

    const {
      make,
      model,
      year,
      vin,
      mileage,
      color,
      transmission,
      fuelType,
      salePrice,
      description,
      city,
      state,
      latitude,
      longitude,
      photos,
    } = body;

    // Check if description is being changed (Agentix SEO or manual edit)
    // so the cron sync knows not to overwrite it
    let seoDescriptionGenerated: boolean | undefined;
    if (description !== undefined) {
      const existing = await prisma.car.findUnique({
        where: { id: carId },
        select: { description: true },
      });
      if (existing && description !== existing.description) {
        seoDescriptionGenerated = true;
      }
    }

    // Update the car
    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        make,
        model,
        year,
        vin,
        mileage,
        color,
        transmission,
        fuelType,
        salePrice,
        description,
        city,
        state,
        latitude,
        longitude,
        photos,
        ...(seoDescriptionGenerated !== undefined && { seoDescriptionGenerated }),
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      { error: 'Failed to update car' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await context.params;
    const { searchParams } = new URL(request.url);
    const wasSold = searchParams.get('sold') === 'true';

    // Instead of deleting, change status to preserve SEO value
    const newStatus = wasSold ? 'sold' : 'removed';

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        status: newStatus,
        statusChangedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: wasSold ? 'Car marked as sold' : 'Car removed from inventory',
      status: newStatus,
      car: updatedCar,
    });
  } catch (error) {
    console.error('Error updating car status:', error);
    return NextResponse.json(
      { error: 'Failed to update car status' },
      { status: 500 }
    );
  }
}

// New endpoint to relist a car (change status back to active)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await context.params;
    const body = await request.json();
    const { action } = body;

    if (action === 'relist') {
      const updatedCar = await prisma.car.update({
        where: { id: carId },
        data: {
          status: 'active',
          statusChangedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: 'Car relisted successfully',
        car: updatedCar,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error relisting car:', error);
    return NextResponse.json(
      { error: 'Failed to relist car' },
      { status: 500 }
    );
  }
}
