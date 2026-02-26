import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSEODescription } from '@/lib/seo/generate-description';

// Vercel Pro has 300s max, we'll use streaming to keep alive
const DELAY_BETWEEN_CARS = 1500; // 1.5 seconds between each car (AI SDK handles rate limits)

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const maxDuration = 300; // 5 minutes max for Vercel Pro

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { dealerId } = await req.json();

    if (!dealerId) {
      return new Response(JSON.stringify({ error: 'Dealer ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get ALL cars (any status) that haven't been SEO'd yet — supports backfilling sold vehicles
    const cars = await prisma.car.findMany({
      where: {
        dealerId: dealerId,
        seoDescriptionGenerated: false,
      },
      select: {
        id: true,
        vin: true,
        year: true,
        make: true,
        model: true,
        mileage: true,
        color: true,
        transmission: true,
        salePrice: true,
        city: true,
        state: true,
        features: true,
        trim: true,
        engine: true,
        drivetrain: true,
        bodyType: true,
        fuelType: true,
        interiorColor: true,
        condition: true,
        certified: true,
        mpgCity: true,
        mpgHighway: true,
      },
    });

    if (cars.length === 0) {
      return new Response(JSON.stringify({ error: 'All vehicles already have SEO descriptions. To regenerate, edit a vehicle first.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use streaming response to prevent timeout and show progress
    const stream = new ReadableStream({
      async start(controller) {
        let successCount = 0;
        let failedCount = 0;
        const failedCars: { vin: string; name: string; error: string }[] = [];

        const sendProgress = (message: object) => {
          controller.enqueue(encoder.encode(JSON.stringify(message) + '\n'));
        };

        sendProgress({ type: 'start', total: cars.length });

        for (let i = 0; i < cars.length; i++) {
          const car = cars[i];
          const carName = `${car.year} ${car.make} ${car.model}`;

          sendProgress({
            type: 'progress',
            current: i + 1,
            total: cars.length,
            car: carName,
          });

          try {
            const description = await generateSEODescription(car);

            if (!description || description.length < 100) {
              throw new Error('Generated description too short');
            }

            // Update the car in the database
            await prisma.car.update({
              where: { id: car.id },
              data: {
                description: description,
                seoDescriptionGenerated: true,
              },
            });

            successCount++;
            sendProgress({
              type: 'success',
              car: carName,
              vin: car.vin,
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Failed for ${carName}:`, errorMessage);
            failedCount++;
            failedCars.push({ vin: car.vin, name: carName, error: errorMessage });
            sendProgress({
              type: 'failed',
              car: carName,
              vin: car.vin,
              error: errorMessage,
            });
          }

          // Delay between cars (shorter since AI SDK handles rate limits)
          if (i < cars.length - 1) {
            await sleep(DELAY_BETWEEN_CARS);
          }
        }

        // Send final results
        sendProgress({
          type: 'complete',
          total: cars.length,
          successCount,
          failedCount,
          failedCars,
        });

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Bulk SEO error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Bulk SEO failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
