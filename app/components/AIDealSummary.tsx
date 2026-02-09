import Link from 'next/link';
import { Bot, UserPlus } from 'lucide-react';
import VehicleFAQ from './VehicleFAQ';
import { parseFeatures, categorizeFeatures } from '@/lib/vehicle-features';

interface AIDealSummaryProps {
  description: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color?: string;
  transmission?: string;
  fuelType?: string;
  condition?: string;
  bodyType?: string;
  salePrice?: number;
  features?: string;
}

interface Section {
  heading: string;
  content: string;
}

export function parseStructuredDescription(description: string): Section[] | null {
  // Check if description contains ## headings (new structured format)
  if (!description.includes('## ')) {
    return null;
  }

  const parts = description.split(/^## /m).filter(Boolean);

  // Need at least 3 sections to be considered structured
  if (parts.length < 3) {
    return null;
  }

  const sections: Section[] = [];
  for (const part of parts) {
    const newlineIndex = part.indexOf('\n');
    if (newlineIndex === -1) continue;

    const heading = part.slice(0, newlineIndex).trim();
    const content = part.slice(newlineIndex + 1).trim();

    if (heading && content) {
      sections.push({ heading, content });
    }
  }

  return sections.length >= 3 ? sections : null;
}

/**
 * Parse old-format descriptions that have **bold question?** patterns
 * from legacy Gemini output. Splits into prose paragraphs and Q&A entries.
 */
export function parseOldFormatQuestions(description: string): { prose: string; questions: Section[] } | null {
  // Match lines like "**Am I getting a good deal?**" or "**Can I negotiate?**"
  const questionPattern = /\*\*([^*]+\?)\*\*/g;
  const matches = [...description.matchAll(questionPattern)];

  if (matches.length === 0) {
    return null;
  }

  // Split at the first question marker to get prose vs Q&A
  const firstMatchIndex = matches[0].index!;
  const prose = description.slice(0, firstMatchIndex).trim();

  // Parse each question and its answer
  const questions: Section[] = [];
  for (let i = 0; i < matches.length; i++) {
    const heading = matches[i][1].trim();
    const startAfterHeading = matches[i].index! + matches[i][0].length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index! : description.length;
    const content = description.slice(startAfterHeading, endIndex).trim();

    if (heading && content) {
      questions.push({ heading, content });
    }
  }

  return questions.length > 0 ? { prose, questions } : null;
}

export function isNegotiateSection(heading: string): boolean {
  const lower = heading.toLowerCase();
  return lower.includes('negotiate') || lower.includes('can i negotiate') || lower.includes('can you negotiate');
}

/**
 * Transform generic old-format question headings into vehicle-specific ones.
 * e.g. "Am I getting a good deal?" → "Is this 2026 Lexus TX a good deal?"
 */
export function toVehicleSpecificHeading(heading: string, year: number, make: string, model: string): string {
  const lower = heading.toLowerCase();
  if (lower.includes('good deal')) {
    return `Is this ${year} ${make} ${model} a good deal?`;
  }
  if (lower.includes('negotiate')) {
    return `Can you negotiate the price of this ${make} ${model}?`;
  }
  return heading;
}

/**
 * Competitor vehicles by make for comparative context.
 * Returns 2 competitor names for "vs" style comparisons.
 */
export function getCompetitors(make: string, model: string, bodyType?: string): string[] {
  const key = `${make} ${model}`.toLowerCase();

  // Specific model competitors
  const modelCompetitors: Record<string, string[]> = {
    'lexus tx': ['Acura MDX', 'BMW X5'],
    'lexus rx': ['BMW X3', 'Mercedes GLC'],
    'lexus es': ['BMW 3 Series', 'Mercedes C-Class'],
    'lexus nx': ['Acura RDX', 'BMW X1'],
    'toyota camry': ['Honda Accord', 'Hyundai Sonata'],
    'toyota corolla': ['Honda Civic', 'Mazda3'],
    'toyota rav4': ['Honda CR-V', 'Mazda CX-5'],
    'toyota tacoma': ['Chevrolet Colorado', 'Ford Ranger'],
    'toyota tundra': ['Ford F-150', 'Chevrolet Silverado'],
    'toyota highlander': ['Honda Pilot', 'Hyundai Palisade'],
    'toyota 4runner': ['Jeep Wrangler', 'Ford Bronco'],
    'honda civic': ['Toyota Corolla', 'Mazda3'],
    'honda accord': ['Toyota Camry', 'Hyundai Sonata'],
    'honda cr-v': ['Toyota RAV4', 'Mazda CX-5'],
    'honda pilot': ['Toyota Highlander', 'Hyundai Palisade'],
    'ford f-150': ['Chevrolet Silverado', 'RAM 1500'],
    'ford explorer': ['Chevrolet Traverse', 'Toyota Highlander'],
    'ford bronco': ['Jeep Wrangler', 'Toyota 4Runner'],
    'ford mustang': ['Chevrolet Camaro', 'Dodge Challenger'],
    'ford escape': ['Toyota RAV4', 'Honda CR-V'],
    'chevrolet silverado': ['Ford F-150', 'RAM 1500'],
    'chevrolet equinox': ['Toyota RAV4', 'Honda CR-V'],
    'chevrolet traverse': ['Ford Explorer', 'Toyota Highlander'],
    'hyundai tucson': ['Toyota RAV4', 'Honda CR-V'],
    'hyundai palisade': ['Toyota Highlander', 'Honda Pilot'],
    'hyundai sonata': ['Toyota Camry', 'Honda Accord'],
    'hyundai elantra': ['Toyota Corolla', 'Honda Civic'],
    'kia telluride': ['Hyundai Palisade', 'Toyota Highlander'],
    'kia sportage': ['Hyundai Tucson', 'Toyota RAV4'],
    'kia forte': ['Hyundai Elantra', 'Toyota Corolla'],
    'subaru outback': ['Toyota RAV4', 'Honda CR-V'],
    'subaru forester': ['Toyota RAV4', 'Mazda CX-5'],
    'mazda cx-5': ['Toyota RAV4', 'Honda CR-V'],
    'mazda3': ['Honda Civic', 'Toyota Corolla'],
    'jeep wrangler': ['Ford Bronco', 'Toyota 4Runner'],
    'jeep grand cherokee': ['Ford Explorer', 'Toyota Highlander'],
    'ram 1500': ['Ford F-150', 'Chevrolet Silverado'],
    'bmw x5': ['Mercedes GLE', 'Lexus TX'],
    'bmw 3 series': ['Mercedes C-Class', 'Lexus ES'],
    'mercedes gle': ['BMW X5', 'Lexus TX'],
    'tesla model 3': ['BMW i4', 'Polestar 2'],
    'tesla model y': ['Ford Mustang Mach-E', 'Hyundai Ioniq 5'],
  };

  if (modelCompetitors[key]) return modelCompetitors[key];

  // Fallback by brand
  const brandFallback: Record<string, string[]> = {
    toyota: ['Honda', 'Hyundai'],
    honda: ['Toyota', 'Mazda'],
    ford: ['Chevrolet', 'Toyota'],
    chevrolet: ['Ford', 'Toyota'],
    lexus: ['Acura', 'BMW'],
    hyundai: ['Toyota', 'Kia'],
    kia: ['Hyundai', 'Toyota'],
    subaru: ['Toyota', 'Mazda'],
    mazda: ['Toyota', 'Honda'],
    bmw: ['Mercedes-Benz', 'Lexus'],
    mercedes: ['BMW', 'Lexus'],
    'mercedes-benz': ['BMW', 'Lexus'],
    jeep: ['Ford', 'Toyota'],
    ram: ['Ford', 'Chevrolet'],
    tesla: ['BMW', 'Hyundai'],
  };

  return brandFallback[make.toLowerCase()] || ['comparable vehicles', 'similar models'];
}

/**
 * Generate bullet points for "Why Buyers Consider This Vehicle" with comparative context.
 */
export function generateStandsOutPoints(year: number, make: string, model: string, mileage: number, fuelType?: string, bodyType?: string): string[] {
  const points: string[] = [];
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const competitors = getCompetitors(make, model, bodyType);

  // Comparative context — competitor mention
  const segment = bodyType?.toLowerCase() || 'vehicle';
  const segmentLabel = segment === 'suv' ? 'SUV' : segment === 'truck' ? 'truck' : segment === 'sedan' ? 'sedan' : 'vehicle';
  points.push(`Compared to the ${competitors[0]} and ${competitors[1]}, the ${make} ${model} is known for strong reliability and lower long-term ownership costs`);

  // Age / freshness
  if (age <= 2) {
    points.push(`A ${year} model with the latest safety technology and modern features`);
  } else if (age <= 5) {
    points.push(`A relatively recent model that balances modern features with value`);
  }

  // Mileage
  const avgExpected = Math.max(age, 1) * 12000;
  if (mileage < avgExpected * 0.8) {
    points.push(`Lower-than-average mileage at ${mileage.toLocaleString()} miles for a ${year} model`);
  }

  // Fuel type
  if (fuelType?.toLowerCase().includes('hybrid')) {
    points.push('Hybrid powertrain delivers excellent fuel economy and lower running costs');
  } else if (fuelType?.toLowerCase().includes('electric')) {
    points.push('Fully electric with zero emissions and minimal maintenance costs');
  }

  // Ensure at least 2 points
  if (points.length < 2) {
    points.push(`The ${make} ${model} is a popular choice in the ${segmentLabel} segment with proven demand`);
  }

  return points.slice(0, 4);
}

/**
 * Generate buyer personas for "Who This Vehicle Is Best For" section.
 */
export function generateBuyerPersonas(make: string, model: string, bodyType?: string, fuelType?: string): string[] {
  const personas: string[] = [];
  const bt = bodyType?.toLowerCase() || '';
  const ft = fuelType?.toLowerCase() || '';

  // Body type personas
  if (bt === 'suv' || bt === 'crossover') {
    personas.push('Families who need space, safety, and versatility for daily life');
    personas.push('Buyers planning long-term ownership with low maintenance costs');
    personas.push('Drivers who want a comfortable ride for both city and highway commuting');
  } else if (bt === 'truck') {
    personas.push('Professionals who need hauling and towing capability for work');
    personas.push('Outdoor enthusiasts who want off-road capability and cargo space');
    personas.push('Buyers looking for a durable, long-lasting vehicle with strong resale value');
  } else if (bt === 'sedan') {
    personas.push('Daily commuters who value fuel efficiency and a comfortable ride');
    personas.push('First-time buyers looking for an affordable, reliable vehicle');
    personas.push('Professionals who want a polished, practical car for everyday driving');
  } else if (bt === 'coupe' || bt === 'convertible') {
    personas.push('Driving enthusiasts who prioritize performance and style');
    personas.push('Buyers looking for a fun weekend car or daily driver with personality');
    personas.push('Professionals who want a sporty, head-turning vehicle');
  } else if (bt === 'van' || bt === 'minivan') {
    personas.push('Large families who need maximum passenger and cargo space');
    personas.push('Road trip planners who want built-in comfort and entertainment');
    personas.push('Buyers who prioritize practicality and easy access for kids');
  } else {
    // Generic
    personas.push('Families looking for a dependable and versatile vehicle');
    personas.push('Daily commuters who value reliability and comfort');
    personas.push('Buyers seeking strong value and low cost of ownership');
  }

  // Luxury modifier
  const luxuryBrands = ['lexus', 'bmw', 'mercedes', 'mercedes-benz', 'audi', 'acura', 'infiniti', 'genesis', 'porsche', 'volvo', 'lincoln', 'cadillac'];
  if (luxuryBrands.includes(make.toLowerCase())) {
    personas[2] = 'Drivers prioritizing comfort, premium features, and refined craftsmanship';
  }

  // EV modifier
  if (ft.includes('electric')) {
    personas.push('Eco-conscious buyers who want zero emissions and minimal fuel costs');
  } else if (ft.includes('hybrid')) {
    personas.push('Budget-minded drivers who want excellent fuel economy without range anxiety');
  }

  return personas.slice(0, 3);
}

export default function AIDealSummary({
  description,
  make,
  model,
  year,
  mileage,
  color,
  transmission,
  fuelType,
  condition,
  bodyType,
  salePrice,
  features: featuresJson,
}: AIDealSummaryProps) {
  // Features section rendered after "Why Buyers Consider" for AI content priority
  const featuresList = parseFeatures(featuresJson);
  const FeaturesSection = () => {
    if (featuresList.length === 0) return null;
    const grouped = categorizeFeatures(featuresList);
    return (
      <div className="border-t border-gray-200 pt-6 mt-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{year} {make} {model} Features &amp; Equipment Highlights</h2>
        <div className="space-y-5">
          {Array.from(grouped.entries()).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {items.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sections = parseStructuredDescription(description);

  // Unstructured (old format) — parse **bold questions** or fall back to VehicleFAQ accordion
  if (!sections) {
    const parsed = parseOldFormatQuestions(description);

    const standsOutPoints = generateStandsOutPoints(year, make, model, mileage, fuelType, bodyType);
    const buyerPersonas = generateBuyerPersonas(make, model, bodyType, fuelType);

    const StandsOutSection = () => (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Why Buyers Consider This {year} {make} {model}</h2>
        <ul className="space-y-1.5 text-gray-700">
          {standsOutPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1.5 text-xs">&#9679;</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    );

    const BestForSection = () => (
      <div className="border-t border-gray-200 pt-6 mt-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Who This {year} {make} {model} Is Best For</h2>
        <ul className="space-y-1.5 text-gray-700">
          {buyerPersonas.map((persona, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1.5 text-xs">&#9679;</span>
              <span>{persona}</span>
            </li>
          ))}
        </ul>
      </div>
    );

    if (parsed) {
      // Old format WITH bold questions — render Stands Out + About + Buying & Decision Guide
      return (
        <>
          <StandsOutSection />
          <FeaturesSection />

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Vehicle</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
              {parsed.prose}
            </p>
          </div>

          <BestForSection />

          <div className="border-t border-gray-200 pt-6 mt-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Buying &amp; Decision Guide</h2>
            <div className="space-y-4">
              {parsed.questions.map((q, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{toVehicleSpecificHeading(q.heading, year, make, model)}</h3>
                  <p className="text-gray-700 leading-relaxed">{q.content}</p>
                  {isNegotiateSection(q.heading) && (
                    <Link
                      href="/register?type=customer"
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors mt-3"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create Free Account
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    // Old format WITHOUT bold questions — Stands Out + About + accordion FAQ
    return (
      <>
        <StandsOutSection />
        <FeaturesSection />

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Vehicle</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {description}
          </p>
        </div>
        <BestForSection />
        <VehicleFAQ
          make={make}
          model={model}
          year={year}
          mileage={mileage}
          color={color}
          transmission={transmission}
          fuelType={fuelType}
          condition={condition}
        />
      </>
    );
  }

  // Structured (new format) — 4 H2 sections with Gemini content
  // Categorize sections by topic
  const goodDealSection = sections.find(s => s.heading.toLowerCase().includes('good deal'));
  const bestForSection = sections.find(s => s.heading.toLowerCase().includes('best for'));
  const guideSections = sections.filter(s => {
    const lower = s.heading.toLowerCase();
    return !lower.includes('good deal') && !lower.includes('best for');
  });

  const standsOutPoints = generateStandsOutPoints(year, make, model, mileage, fuelType, bodyType);

  return (
    <>
      {/* H2 #1: Why Buyers Consider This Vehicle — static comparative context */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Why Buyers Consider This {year} {make} {model}</h2>
        <ul className="space-y-1.5 text-gray-700">
          {standsOutPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1.5 text-xs">&#9679;</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* H2 #2: Features & Equipment — evidence backing the decision summary */}
      <FeaturesSection />

      {/* H2 #3: About This Vehicle — Gemini section 1 (good deal analysis) */}
      {goodDealSection && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Vehicle</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {goodDealSection.content}
          </p>
        </div>
      )}

      {/* H2 #3: Who This Vehicle Is Best For — Gemini section 3 */}
      {bestForSection && (
        <div className="border-t border-gray-200 pt-6 mt-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who This {year} {make} {model} Is Best For</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {bestForSection.content}
          </div>
        </div>
      )}

      {/* H2 #4: Buying & Decision Guide — Gemini sections 2, 4, 5 as H3s */}
      {guideSections.length > 0 && (
        <div className="border-t border-gray-200 pt-6 mt-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Buying &amp; Decision Guide</h2>
          </div>

          <div className="space-y-6">
            {guideSections.map((section, index) => (
              <div key={index} className="flex gap-4">
                {/* Numbered circle */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {section.heading}
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
                    {section.content}
                  </div>

                  {/* CTA for negotiate section */}
                  {isNegotiateSection(section.heading) && (
                    <Link
                      href="/register?type=customer"
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors mt-3"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create Free Account
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
