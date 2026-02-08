import { NextRequest } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { prisma } from '@/lib/prisma';

// Create Google AI instance with the existing GEMINI_API_KEY
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Vercel Pro has 300s max, we'll use streaming to keep alive
const DELAY_BETWEEN_CARS = 1500; // 1.5 seconds between each car (AI SDK handles rate limits)

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateSEODescription(car: {
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string | null;
  transmission: string | null;
  salePrice: number | null;
  city: string | null;
  state: string | null;
  vin: string;
}): Promise<string> {
  const vehicleInfo = `
Vehicle: ${car.year} ${car.make} ${car.model}
Mileage: ${car.mileage?.toLocaleString() || 'Low'} miles
Transmission: ${car.transmission || 'Automatic'}
Exterior Color: ${car.color || 'N/A'}
Location: ${car.city || ''}, ${car.state || ''}
${car.salePrice ? `Price: $${car.salePrice.toLocaleString()}` : 'Contact for pricing'}
VIN: ${car.vin || 'N/A'}
`.trim();

  const prompt = `You are an SEO expert and experienced automotive copywriter. Write a structured vehicle description with 5 sections that will rank well in Google search results and get featured in AI Overviews.

${vehicleInfo}

FORMAT: Write EXACTLY 5 sections. Each section MUST start with "## " followed by the heading on its own line, then the content below it. Do NOT use any other markdown formatting (no bold **, no italic, no ###). Bullet points are allowed.

SECTION 1:
## Is this ${car.year} ${car.make} ${car.model} a good deal?
Write 2-3 sentences analyzing the price and value. Mention specific details like mileage (${car.mileage?.toLocaleString() || 'low'} miles), the ${car.color || ''} exterior color, and location (${car.city}, ${car.state}). Naturally include "${car.year} ${car.make} ${car.model} for sale" and "used ${car.make}" or "pre-owned ${car.make}".

SECTION 2:
## Can you negotiate the price of this ${car.make} ${car.model}?
Write 2-3 sentences about negotiation possibilities. ALWAYS end this section with exactly: "Create a free account to add this vehicle to your Deal Request. As a member, dealers compete to offer you their best price."

SECTION 3:
## Who is this vehicle best for?
Write 2-3 buyer personas as bullet points (e.g., Families, Commuters, First-time buyers). Include why this specific ${car.year} ${car.make} ${car.model} suits each persona.

SECTION 4:
## What are good alternatives to this vehicle?
List 3 competitor vehicles with brief 1-sentence comparisons to this ${car.make} ${car.model}.

SECTION 5:
## What should buyers know before purchasing?
Write 2-3 practical tips specific to buying this ${car.year} ${car.make} ${car.model}. Mention things like checking the vehicle history, scheduling a test drive, and comparing offers.

RULES:
- Total length: 400-600 words across all 5 sections
- No markdown bold (**), no italic, no ### sub-headings
- Bullet points are allowed within sections
- Be specific to THIS vehicle — reference the color, mileage, location, and price
- Do NOT mention any dealership name or business name
- Do NOT include website URLs
- Write naturally, no keyword stuffing
- Each section heading must start with exactly "## " on its own line

Return ONLY the 5 sections. No intro text, no closing text, no quotes around the output.`;

  // Use Vercel AI SDK with built-in rate limit handling
  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    prompt,
    maxRetries: 5, // Built-in retry with exponential backoff
  });

  return text.trim();
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

    // Get active cars that haven't been SEO'd yet
    const cars = await prisma.car.findMany({
      where: {
        dealerId: dealerId,
        status: 'active',
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
      },
    });

    if (cars.length === 0) {
      return new Response(JSON.stringify({ error: 'All active vehicles already have SEO descriptions. To regenerate, edit a vehicle first.' }), {
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
