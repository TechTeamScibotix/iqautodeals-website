require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { PrismaClient } = require('@prisma/client');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { generateText } = require('ai');

const prisma = new PrismaClient();
const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

const DELAY = 1500;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function generateSEO(car) {
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

  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    prompt,
    maxRetries: 5,
  });
  return text.trim();
}

async function main() {
  const dealerId = process.argv[2];
  if (!dealerId) {
    console.error('Usage: node scripts/run-bulk-seo.js <dealerId>');
    process.exit(1);
  }

  const cars = await prisma.car.findMany({
    where: { dealerId, status: 'active', seoDescriptionGenerated: false },
    select: { id: true, vin: true, year: true, make: true, model: true, mileage: true, color: true, transmission: true, salePrice: true, city: true, state: true },
  });

  console.log(`Found ${cars.length} vehicles to process for dealer ${dealerId}`);
  let success = 0, failed = 0;

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const name = `${car.year} ${car.make} ${car.model}`;
    process.stdout.write(`[${i + 1}/${cars.length}] ${name}... `);

    try {
      const desc = await generateSEO(car);
      if (!desc || desc.length < 100) throw new Error('Description too short');

      await prisma.car.update({
        where: { id: car.id },
        data: { description: desc, seoDescriptionGenerated: true },
      });
      success++;
      console.log('OK');
    } catch (err) {
      failed++;
      console.log('FAILED: ' + err.message);
    }

    if (i < cars.length - 1) await sleep(DELAY);
  }

  console.log(`\nDone! ${success} success, ${failed} failed out of ${cars.length}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
