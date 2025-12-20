import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { make, model, year, mileage, color, transmission, salePrice, city, state } = await req.json();

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
`.trim();

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
   - Include specific numbers (mileage, year)
   - Mention year, make, and model in the opening and closing

3. CONTENT REQUIREMENTS:
   - Write in second person addressing the buyer ("You'll love...", "Imagine yourself...")
   - Highlight key features and benefits with specifics
   - Include a compelling value proposition
   - Address common buyer concerns (reliability, condition, value)
   - End with a soft call-to-action that encourages inquiry

4. DO NOT:
   - Mention any dealership name or business name
   - Include website URLs
   - Use generic filler phrases
   - Keyword stuff (must read naturally)
   - Use "click here" or similar web-only CTAs
   - Use emojis or special characters

5. FORMAT:
   - 2-3 paragraphs
   - Maximum 400 characters
   - No headers or bullet points (flowing prose only)

Write content that would rank for searches like "${year} ${make} ${model} for sale" and "${make} ${model} near me".

Return ONLY the description text, no headers, labels, or quotes.`;

    const model_ai = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model_ai.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();

    return NextResponse.json({ description: content });
  } catch (error) {
    console.error('Generate SEO error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate description: ${errorMessage}` },
      { status: 500 }
    );
  }
}
