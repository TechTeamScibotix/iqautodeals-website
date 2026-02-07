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

  const prompt = `You are an SEO expert and experienced automotive copywriter creating a vehicle listing that will rank well in Google search results. Write a description optimized for search engines while remaining compelling for buyers.

${vehicleInfo}

SEO OPTIMIZATION REQUIREMENTS:
1. NATURALLY INCLUDE these high-value keywords in the text (don't force them):
   - "${car.year} ${car.make} ${car.model} for sale"
   - "${car.make} ${car.model}" (repeat 2-3 times naturally)
   - "used ${car.make}" or "pre-owned ${car.make}"
   - Location terms like "${car.city}" and "${car.state}" if provided

2. STRUCTURE for SEO:
   - Start with the primary keyword phrase in the first sentence
   - Use short paragraphs (2-3 sentences each)
   - Include specific numbers (mileage, year, price if available)
   - Mention year, make, and model in the opening and closing
   - Reference the specific color: "${car.color}"

3. CONTENT REQUIREMENTS:
   - Write in second person addressing the buyer ("You'll love...", "Imagine yourself...")
   - Highlight key features and benefits with specifics
   - Include a compelling value proposition
   - Address common buyer concerns (reliability, condition, value)
   - End with a soft call-to-action that encourages inquiry
   - BE SPECIFIC to THIS exact vehicle - mention the color, mileage, and location

4. DO NOT:
   - Mention any dealership name or business name
   - Include website URLs
   - Use generic filler phrases that could apply to any car
   - Keyword stuff (must read naturally)
   - Use "click here" or similar web-only CTAs
   - Use emojis or special characters
   - Write generic content - this must be UNIQUE to this specific vehicle

5. FORMAT:
   - 2-3 paragraphs of description (200-350 words)
   - Then include a FAQ section with EXACTLY these two questions and answers
   - No bullet points in the description paragraphs (flowing prose only)

6. REQUIRED FAQ SECTION (include at the end):
   After the description paragraphs, add this FAQ section with the exact format below:

   **Am I getting a good deal?**
   Yes! [Write 1-2 sentences highlighting THIS vehicle's value - mention specific selling points like low mileage, reliability, features, or brand reputation. Always be positive.]

   **Can I negotiate?**
   Yes! Create a free account to add this vehicle to your Deal Request. As a member, dealers compete to offer you their best price.

Write content that would rank for searches like "${car.year} ${car.make} ${car.model} for sale" and "${car.make} ${car.model} near me".

Return ONLY the description text followed by the FAQ section. No other headers, labels, or quotes.`;

  // Use Vercel AI SDK with built-in rate limit handling
  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
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

    // Get all active cars for this dealer
    const cars = await prisma.car.findMany({
      where: {
        dealerId: dealerId,
        status: 'active',
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
      return new Response(JSON.stringify({ error: 'No active cars found' }), {
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
