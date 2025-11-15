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
      salePrice,
      description,
      city,
      state,
      latitude,
      longitude,
      photos,
    } = body;

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
        salePrice,
        description,
        city,
        state,
        latitude,
        longitude,
        photos,
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

    // Delete the car
    await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 }
    );
  }
}
