import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Jaccard similarity: measures overlap between two sets of words
function jaccardSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

// Check if new content is too similar to any existing description
async function checkUniqueness(newContent: string, excludeVin?: string): Promise<{ isUnique: boolean; similarTo?: string; similarity?: number }> {
  // Fetch existing descriptions from database (filter nulls in-memory for type safety)
  const allCars = await prisma.car.findMany({
    where: excludeVin ? { vin: { not: excludeVin } } : undefined,
    select: {
      vin: true,
      description: true,
      year: true,
      make: true,
      model: true,
    },
    take: 500, // Check against recent 500 listings
    orderBy: { createdAt: 'desc' },
  });

  // Filter to only cars with descriptions
  const existingCars = allCars.filter(car => car.description && car.description.length > 50);

  for (const car of existingCars) {
    if (!car.description || car.description.length < 50) continue;

    const similarity = jaccardSimilarity(newContent, car.description);

    if (similarity > 0.8) {
      return {
        isUnique: false,
        similarTo: `${car.year} ${car.make} ${car.model} (VIN: ${car.vin})`,
        similarity: Math.round(similarity * 100),
      };
    }
  }

  return { isUnique: true };
}

// Generate unique variation prompt additions
function getVariationPrompt(attemptNumber: number): string {
  const variations = [
    'Focus on the driving experience and how it feels behind the wheel.',
    'Emphasize the practical benefits for families and daily commuters.',
    'Highlight the technology features and modern conveniences.',
    'Focus on the value proposition and long-term ownership benefits.',
    'Emphasize the style, design, and curb appeal of this vehicle.',
  ];
  return variations[attemptNumber % variations.length];
}

export async function POST(req: NextRequest) {
  try {
    const { make, model, year, mileage, color, transmission, salePrice, city, state, vin } = await req.json();

    // Validate required fields
    if (!make || !model || !year) {
      return NextResponse.json(
        { error: 'Make, model, and year are required' },
        { status: 400 }
      );
    }

    const vehicleInfo = `
Vehicle: ${year} ${make} ${model}
Mileage: ${mileage?.toLocaleString() || 'Low'} miles
Transmission: ${transmission || 'Automatic'}
Exterior Color: ${color || 'N/A'}
Location: ${city || ''}, ${state || ''}
${salePrice ? `Price: $${salePrice.toLocaleString()}` : 'Contact for pricing'}
VIN: ${vin || 'N/A'}
`.trim();

    const MAX_ATTEMPTS = 3;
    let content = '';
    let attempt = 0;
    let uniquenessResult: { isUnique: boolean; similarTo?: string; similarity?: number } = { isUnique: false };

    while (attempt < MAX_ATTEMPTS) {
      const variationPrompt = attempt > 0 ? `\n\nIMPORTANT: ${getVariationPrompt(attempt)} Make this description COMPLETELY DIFFERENT from typical listings.` : '';

      const prompt = `You are an SEO expert and experienced automotive copywriter. Write a structured vehicle description with 5 sections that will rank well in Google search results and get featured in AI Overviews.

${vehicleInfo}

FORMAT: Write EXACTLY 5 sections. Each section MUST start with "## " followed by the heading on its own line, then the content below it. Do NOT use any other markdown formatting (no bold **, no italic, no ###). Bullet points are allowed.

SECTION 1:
## Is this ${year} ${make} ${model} a good deal?
Write 2-3 sentences analyzing the price and value. Mention specific details like mileage (${mileage?.toLocaleString() || 'low'} miles), the ${color || ''} exterior color, and location (${city}, ${state}). Naturally include "${year} ${make} ${model} for sale" and "used ${make}" or "pre-owned ${make}".

SECTION 2:
## Can you negotiate the price of this ${make} ${model}?
Write 2-3 sentences about negotiation possibilities. ALWAYS end this section with exactly: "Create a free account to add this vehicle to your Deal Request. As a member, dealers compete to offer you their best price."

SECTION 3:
## Who is this vehicle best for?
Write 2-3 buyer personas as bullet points (e.g., Families, Commuters, First-time buyers). Include why this specific ${year} ${make} ${model} suits each persona.

SECTION 4:
## What are good alternatives to this vehicle?
List 3 competitor vehicles with brief 1-sentence comparisons to this ${make} ${model}.

SECTION 5:
## What should buyers know before purchasing?
Write 2-3 practical tips specific to buying this ${year} ${make} ${model}. Mention things like checking the vehicle history, scheduling a test drive, and comparing offers.

RULES:
- Total length: 400-600 words across all 5 sections
- No markdown bold (**), no italic, no ### sub-headings
- Bullet points are allowed within sections
- Be specific to THIS vehicle — reference the color, mileage, location, and price
- Do NOT mention any dealership name or business name
- Do NOT include website URLs
- Write naturally, no keyword stuffing
- Each section heading must start with exactly "## " on its own line${variationPrompt}

Return ONLY the 5 sections. No intro text, no closing text, no quotes around the output.`;

      const model_ai = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model_ai.generateContent(prompt);
      const response = await result.response;
      content = response.text().trim();

      // Check uniqueness against existing descriptions
      uniquenessResult = await checkUniqueness(content, vin);

      if (uniquenessResult.isUnique) {
        break;
      }

      console.log(`Attempt ${attempt + 1}: Content too similar (${uniquenessResult.similarity}%) to ${uniquenessResult.similarTo}. Regenerating...`);
      attempt++;
    }

    // Return result with uniqueness metadata
    return NextResponse.json({
      description: content,
      uniqueness: {
        isUnique: uniquenessResult.isUnique,
        attempts: attempt + 1,
        ...(uniquenessResult.isUnique ? {} : {
          warning: `Content may be similar to existing listing. Similarity: ${uniquenessResult.similarity}%`,
          similarTo: uniquenessResult.similarTo,
        }),
      },
    });
  } catch (error) {
    console.error('Generate SEO error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate description: ${errorMessage}` },
      { status: 500 }
    );
  }
}
