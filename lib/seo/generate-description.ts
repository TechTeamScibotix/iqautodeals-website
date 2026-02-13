import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Create Google AI instance with the existing GEMINI_API_KEY
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export interface SEOCarInput {
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
  features?: string | null;
}

export async function generateSEODescription(car: SEOCarInput): Promise<string> {
  // Parse and pick top features to feed into the prompt
  let topFeatures: string[] = [];
  if (car.features) {
    try {
      const all: string[] = JSON.parse(car.features);
      // Pick the most exciting/notable features (engine, drivetrain, safety, tech, comfort)
      const priorityKeywords = ['engine', 'ecoboost', 'v6', 'v8', 'turbo', 'diesel', 'hybrid', 'electric', 'awd', 'four wheel', '4wd', '4x4', 'leather', 'sunroof', 'moonroof', 'navigation', 'heated', 'cooled', 'premium', 'bose', 'harman', 'adaptive cruise', 'blind spot', 'lane', 'camera', 'carplay', 'android auto', 'remote start', 'keyless', 'tow', 'payload', 'bed liner', 'running board', 'panoramic', 'power liftgate'];
      const priority = all.filter(f => priorityKeywords.some(kw => f.toLowerCase().includes(kw)));
      const rest = all.filter(f => !priority.includes(f));
      topFeatures = [...priority.slice(0, 8), ...rest.slice(0, Math.max(0, 10 - priority.length))].slice(0, 10);
    } catch { /* ignore parse errors */ }
  }

  const featuresBlock = topFeatures.length > 0
    ? `\nKey Features & Equipment:\n${topFeatures.map(f => `- ${f}`).join('\n')}\n`
    : '';

  const vehicleInfo = `
Vehicle: ${car.year} ${car.make} ${car.model}
Mileage: ${car.mileage?.toLocaleString() || 'Low'} miles
Transmission: ${car.transmission || 'Automatic'}
Exterior Color: ${car.color || 'N/A'}
Location: ${car.city || ''}, ${car.state || ''}
${car.salePrice ? `Price: $${car.salePrice.toLocaleString()}` : 'Contact for pricing'}
VIN: ${car.vin || 'N/A'}
${featuresBlock}`.trim();

  const prompt = `You are an SEO expert and experienced automotive copywriter. Write a structured vehicle description with 4 sections that builds excitement and buyer confidence. This description should make the reader want THIS vehicle — no comparisons, no second-guessing.

${vehicleInfo}

FORMAT: Write EXACTLY 4 sections. Each section MUST start with "## " followed by the heading on its own line, then the content below it. Do NOT use any other markdown formatting (no bold **, no italic, no ###). Bullet points are allowed.

SECTION 1:
## Why This Vehicle Stands Out
Write 4-5 sentences creating an excitement hook about the ${car.year} ${car.make} ${car.model}. Open with energy — make the reader feel something. Highlight the vehicle's reputation, what makes it desirable, and the emotional appeal of driving it.${topFeatures.length > 0 ? ' Call out 2-3 standout features from the equipment list (e.g., engine specs, drivetrain, premium packages, safety tech) that make this vehicle thrilling.' : ''} Naturally include "${car.year} ${car.make} ${car.model} for sale" and "used ${car.make}" or "pre-owned ${car.make}".

SECTION 2:
## What Makes This One Special
Write 4-5 sentences about THIS specific listing's unique value. Reference the mileage (${car.mileage?.toLocaleString() || 'low'} miles), ${car.color || ''} exterior color, location (${car.city}, ${car.state}), and ${car.salePrice ? `price ($${car.salePrice.toLocaleString()})` : 'pricing'}.${topFeatures.length > 0 ? ' Weave in 3-4 notable features or equipment highlights that make this listing exciting — be specific about what the buyer is actually getting and why each feature matters for their daily life.' : ''} Paint a picture of why this particular vehicle is a standout find that won't last long.

SECTION 3:
## Ownership Experience
Write 4-5 sentences helping the reader vividly imagine owning this ${car.year} ${car.make} ${car.model}. Describe specific scenarios — the morning commute, the weekend adventure, the road trip, pulling into the driveway. Focus on how it feels, not just what it does.${topFeatures.length > 0 ? ' Reference specific comfort, tech, safety, or convenience features from the equipment list to make the ownership picture come alive.' : ''}

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
- Naturally include the year, make, model, vehicle type, and location for SEO
- Each section heading must start with exactly "## " on its own line

Return ONLY the 4 sections. No intro text, no closing text, no quotes around the output.`;

  // Use Vercel AI SDK with built-in rate limit handling
  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    prompt,
    maxRetries: 5, // Built-in retry with exponential backoff
  });

  return text.trim();
}

/**
 * Validates that a generated description looks like proper structured SEO content.
 * Returns true if it contains section headers (##) and is long enough.
 */
export function isValidSEODescription(description: string): boolean {
  return description.includes('##') && description.length > 200;
}
