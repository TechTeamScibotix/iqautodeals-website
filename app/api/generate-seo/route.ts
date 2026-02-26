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
    'Focus on the emotional appeal of driving this vehicle.',
    'Emphasize the practical lifestyle benefits of ownership.',
    'Highlight what makes this specific listing stand out from others.',
    'Focus on the confidence and peace of mind this vehicle offers.',
    'Emphasize the everyday usability and comfort.',
  ];
  return variations[attemptNumber % variations.length];
}

export async function POST(req: NextRequest) {
  try {
    const { make, model, year, mileage, color, transmission, salePrice, city, state, vin, features, trim, engine, drivetrain, bodyType, fuelType, interiorColor, condition, certified, mpgCity, mpgHighway } = await req.json();

    // Validate required fields
    if (!make || !model || !year) {
      return NextResponse.json(
        { error: 'Make, model, and year are required' },
        { status: 400 }
      );
    }

    // Build full vehicle name including trim
    const fullName = [year, make, model, trim].filter(Boolean).join(' ');

    // Inject engine and drivetrain as top-priority features
    const injectedFeatures: string[] = [];
    if (engine) injectedFeatures.push(`${engine} Engine`);
    if (drivetrain) injectedFeatures.push(`${drivetrain} Drivetrain`);

    // Parse and pick top features to feed into the prompt
    let topFeatures: string[] = [];
    if (features) {
      try {
        const all: string[] = typeof features === 'string' ? JSON.parse(features) : features;
        const priorityKeywords = ['engine', 'ecoboost', 'v6', 'v8', 'turbo', 'diesel', 'hybrid', 'electric', 'awd', 'four wheel', '4wd', '4x4', 'leather', 'sunroof', 'moonroof', 'navigation', 'heated', 'cooled', 'premium', 'bose', 'harman', 'adaptive cruise', 'blind spot', 'lane', 'camera', 'carplay', 'android auto', 'remote start', 'keyless', 'tow', 'payload', 'bed liner', 'running board', 'panoramic', 'power liftgate'];
        const priority = all.filter((f: string) => priorityKeywords.some(kw => f.toLowerCase().includes(kw)));
        const rest = all.filter((f: string) => !priority.includes(f));
        topFeatures = [...priority.slice(0, 8), ...rest.slice(0, Math.max(0, 10 - priority.length))].slice(0, 10);
      } catch { /* ignore parse errors */ }
    }

    // Prepend engine/drivetrain so the AI always sees them, dedup against parsed features
    topFeatures = [...injectedFeatures, ...topFeatures.filter(f => !injectedFeatures.some(inj => f.toLowerCase().includes(inj.toLowerCase().replace(' engine', '').replace(' drivetrain', ''))))].slice(0, 12);

    const featuresBlock = topFeatures.length > 0
      ? `\nKey Features & Equipment:\n${topFeatures.map(f => `- ${f}`).join('\n')}\n`
      : '';

    // Build enhanced vehicle info block with all available specs
    const specLines: string[] = [
      `Vehicle: ${fullName}`,
    ];
    if (trim) specLines.push(`Trim: ${trim}`);
    if (engine) specLines.push(`Engine: ${engine}`);
    if (drivetrain) specLines.push(`Drivetrain: ${drivetrain}`);
    if (bodyType) specLines.push(`Body Type: ${bodyType}`);
    if (fuelType) specLines.push(`Fuel Type: ${fuelType}`);
    if (mpgCity && mpgHighway) specLines.push(`Fuel Economy: ${mpgCity} city / ${mpgHighway} highway MPG`);
    if (interiorColor) specLines.push(`Interior: ${interiorColor}`);
    if (condition) specLines.push(`Condition: ${condition}`);
    if (certified) specLines.push(`Certified Pre-Owned: Yes`);
    specLines.push(`Mileage: ${mileage?.toLocaleString() || 'Low'} miles`);
    specLines.push(`Transmission: ${transmission || 'Automatic'}`);
    specLines.push(`Exterior Color: ${color || 'N/A'}`);
    specLines.push(`Location: ${city || ''}, ${state || ''}`);
    specLines.push(salePrice ? `Price: $${salePrice.toLocaleString()}` : 'Contact for pricing');
    specLines.push(`VIN: ${vin || 'N/A'}`);

    const vehicleInfo = `${specLines.join('\n')}
${featuresBlock}`.trim();

    const MAX_ATTEMPTS = 3;
    let content = '';
    let attempt = 0;
    let uniquenessResult: { isUnique: boolean; similarTo?: string; similarity?: number } = { isUnique: false };

    while (attempt < MAX_ATTEMPTS) {
      const variationPrompt = attempt > 0 ? `\n\nIMPORTANT: ${getVariationPrompt(attempt)} Make this description COMPLETELY DIFFERENT from typical listings.` : '';

      const trimInstruction = trim ? `\nIf this vehicle has a notable trim level, prominently feature it — the trim is what differentiates this vehicle from base models.` : '';

      const prompt = `You are an SEO expert and experienced automotive copywriter. Write a structured vehicle description with 4 sections that builds excitement and buyer confidence. This description should make the reader want THIS vehicle — no comparisons, no second-guessing.

${vehicleInfo}

FORMAT: Write EXACTLY 4 sections. Each section MUST start with "## " followed by the heading on its own line, then the content below it. Do NOT use any other markdown formatting (no bold **, no italic, no ###). Bullet points are allowed.

SECTION 1:
## Why This Vehicle Stands Out
Write 4-5 sentences creating an excitement hook about the ${fullName}. Open with energy — make the reader feel something. Highlight the vehicle's reputation, what makes it desirable, and the emotional appeal of driving it.${topFeatures.length > 0 ? ' Call out 2-3 standout features from the equipment list (e.g., engine specs, drivetrain, premium packages, safety tech) that make this vehicle thrilling.' : ''} Naturally include "${fullName} for sale" and "used ${make}" or "pre-owned ${make}".${trimInstruction}

SECTION 2:
## What Makes This One Special
Write 4-5 sentences about THIS specific listing's unique value. Reference the mileage (${mileage?.toLocaleString() || 'low'} miles), ${color || ''} exterior color, location (${city}, ${state}), and ${salePrice ? `price ($${salePrice.toLocaleString()})` : 'pricing'}.${topFeatures.length > 0 ? ' Weave in 3-4 notable features or equipment highlights that make this listing exciting — be specific about what the buyer is actually getting and why each feature matters for their daily life.' : ''} Paint a picture of why this particular vehicle is a standout find that won't last long.

SECTION 3:
## Ownership Experience
Write 4-5 sentences helping the reader vividly imagine owning this ${fullName}. Describe specific scenarios — the morning commute, the weekend adventure, the road trip, pulling into the driveway. Focus on how it feels, not just what it does.${topFeatures.length > 0 ? ' Reference specific comfort, tech, safety, or convenience features from the equipment list to make the ownership picture come alive.' : ''}

SECTION 4:
## Buyer Confidence
Write 3-4 sentences providing strong reassurance and forward momentum. Emphasize the vehicle's proven track record, the value at this price point, and why this is a decision the buyer will feel great about. End with urgency — vehicles like this move fast.

RULES:
- Total length: 350-500 words across all 4 sections
- NEVER mention competitor brands or models by name
- NEVER give negotiation advice or pricing tactics
- NEVER suggest alternative vehicles or recommend other models
- NEVER suggest external research, vehicle history reports, or comparison shopping
- NEVER use language that undermines dealers or the buying process
- No markdown bold (**), no italic, no ### sub-headings
- Bullet points are allowed within sections
- Be specific to THIS vehicle — reference the color, mileage, location, and price
- Do NOT mention any dealership name or business name
- Do NOT include website URLs
- Write naturally, no keyword stuffing
- Naturally include the year, make, model, trim level, vehicle type, and location for SEO
- Each section heading must start with exactly "## " on its own line${variationPrompt}

Return ONLY the 4 sections. No intro text, no closing text, no quotes around the output.`;

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
