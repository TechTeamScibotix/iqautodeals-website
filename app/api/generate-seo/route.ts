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

      const prompt = `You are an SEO expert and experienced automotive copywriter creating a vehicle listing that will rank well in Google search results. Write a description optimized for search engines while remaining compelling for buyers.

${vehicleInfo}

SEO OPTIMIZATION REQUIREMENTS:
1. NATURALLY INCLUDE these high-value keywords in the text (don't force them):
   - "${year} ${make} ${model} for sale"
   - "${make} ${model}" (repeat 2-3 times naturally)
   - "used ${make}" or "pre-owned ${make}"
   - Location terms like "${city}" and "${state}" if provided

2. STRUCTURE for SEO:
   - Start with the primary keyword phrase in the first sentence
   - Use short paragraphs (2-3 sentences each)
   - Include specific numbers (mileage, year, price if available)
   - Mention year, make, and model in the opening and closing
   - Reference the specific color: "${color}"

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
   - 2-3 paragraphs
   - 200-400 words (longer, more detailed content)
   - No headers or bullet points (flowing prose only)

Write content that would rank for searches like "${year} ${make} ${model} for sale" and "${make} ${model} near me".${variationPrompt}

Return ONLY the description text, no headers, labels, or quotes.`;

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
