import Link from 'next/link';
import { UserPlus } from 'lucide-react';
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
 * Check if a section heading contains problematic old-format content
 * that should be filtered out for backward compatibility.
 */
function isProblematicSection(heading: string): boolean {
  const lower = heading.toLowerCase();
  return (
    lower.includes('negotiate') ||
    lower.includes('alternative') ||
    lower.includes('before purchasing') ||
    lower.includes('should buyers know') ||
    lower.includes('good alternatives')
  );
}

/**
 * Generate bullet points for "Why Buyers Consider This Vehicle".
 */
export function generateStandsOutPoints(year: number, make: string, model: string, mileage: number, fuelType?: string, bodyType?: string): string[] {
  const points: string[] = [];
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  const segment = bodyType?.toLowerCase() || 'vehicle';
  const segmentLabel = segment === 'suv' ? 'SUV' : segment === 'truck' ? 'truck' : segment === 'sedan' ? 'sedan' : 'vehicle';

  // Vehicle reputation (no competitor mentions)
  points.push(`The ${make} ${model} is known for strong reliability and lower long-term ownership costs`);

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

/**
 * Standard action CTA used across all description formats.
 */
function ActionCTA() {
  return (
    <div className="border-t border-gray-200 pt-6 mt-6 mb-8">
      <p className="text-gray-700 leading-relaxed mb-4">
        IQAutoDeals allows you to move forward confidently. Create a free account, add this vehicle to your Deal Request, and let certified dealers compete to offer you their best price.
      </p>
      <Link
        href="/register?type=customer"
        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Create Free Account
      </Link>
    </div>
  );
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

  const sections = parseStructuredDescription(description);

  // Legacy format (no ## sections) — render as "About This Vehicle" prose
  if (!sections) {
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

        <ActionCTA />

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

  // Structured format — filter out problematic old sections for backward compatibility
  const cleanSections = sections.filter(s => !isProblematicSection(s.heading));

  // Try to find new-format AI sections by heading keywords
  const standsOutAI = cleanSections.find(s => s.heading.toLowerCase().includes('stands out'));
  const specialAI = cleanSections.find(s => s.heading.toLowerCase().includes('makes this one special'));
  const ownershipAI = cleanSections.find(s => s.heading.toLowerCase().includes('ownership experience'));
  const confidenceAI = cleanSections.find(s => s.heading.toLowerCase().includes('buyer confidence'));

  // For old structured format: find "good deal" section to use as generic "About This Vehicle"
  const goodDealSection = cleanSections.find(s => s.heading.toLowerCase().includes('good deal'));
  const bestForSection = cleanSections.find(s => s.heading.toLowerCase().includes('best for'));

  // Remaining sections that don't match any known heading (render generically)
  const knownSections = new Set([standsOutAI, specialAI, ownershipAI, confidenceAI, goodDealSection, bestForSection].filter(Boolean));
  const otherSections = cleanSections.filter(s => !knownSections.has(s));

  return (
    <>
      {/* H2 #1: Why Buyers Consider This Vehicle — client-side generated */}
      <StandsOutSection />

      {/* H2 #2: Features & Equipment */}
      <FeaturesSection />

      {/* H2 #3: Why This Vehicle Stands Out — AI section 1 */}
      {standsOutAI && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why This Vehicle Stands Out</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {standsOutAI.content}
          </p>
        </div>
      )}

      {/* H2 #4: What Makes This One Special — AI section 2 */}
      {specialAI && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Makes This One Special</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {specialAI.content}
          </p>
        </div>
      )}

      {/* H2 #5: Ownership Experience — AI section 3 */}
      {ownershipAI && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ownership Experience</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {ownershipAI.content}
          </p>
        </div>
      )}

      {/* H2 #6: Buyer Confidence — AI section 4 */}
      {confidenceAI && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Buyer Confidence</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {confidenceAI.content}
          </p>
        </div>
      )}

      {/* Old-format "good deal" section rendered as "About This Vehicle" */}
      {!standsOutAI && goodDealSection && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Vehicle</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {goodDealSection.content}
          </p>
        </div>
      )}

      {/* Old-format "best for" section */}
      {!standsOutAI && bestForSection && (
        <div className="border-t border-gray-200 pt-6 mt-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who This {year} {make} {model} Is Best For</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {bestForSection.content}
          </div>
        </div>
      )}

      {/* Any remaining clean sections from old format rendered generically */}
      {!standsOutAI && otherSections.length > 0 && otherSections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
            {section.content}
          </div>
        </div>
      ))}

      {/* Action CTA */}
      <ActionCTA />
    </>
  );
}
