'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, UserPlus } from 'lucide-react';

interface VehicleFAQProps {
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  color?: string;
  transmission?: string;
  fuelType?: string;
  condition?: string;
}

// Generate a positive "good deal" answer based on vehicle attributes
function generateGoodDealAnswer(props: VehicleFAQProps): string {
  const { make, model, year, mileage, fuelType, transmission } = props;

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;

  // Build selling points based on vehicle data
  const sellingPoints: string[] = [];

  // Mileage-based points
  const avgMilesPerYear = 12000;
  const expectedMileage = vehicleAge * avgMilesPerYear;
  if (mileage < expectedMileage) {
    sellingPoints.push('lower-than-average mileage for its age');
  }
  if (mileage < 50000) {
    sellingPoints.push('plenty of life left with under 50,000 miles');
  } else if (mileage < 100000) {
    sellingPoints.push('well within the reliable mileage range');
  }

  // Year-based points
  if (vehicleAge <= 3) {
    sellingPoints.push('nearly new with modern features and technology');
  } else if (vehicleAge <= 6) {
    sellingPoints.push('a great balance of value and modern features');
  }

  // Fuel type points
  if (fuelType?.toLowerCase().includes('hybrid')) {
    sellingPoints.push('excellent fuel efficiency as a hybrid');
  } else if (fuelType?.toLowerCase().includes('electric')) {
    sellingPoints.push('zero emissions and low operating costs');
  }

  // Brand reputation (common reliable makes)
  const reliableMakes = ['toyota', 'honda', 'lexus', 'mazda', 'subaru'];
  if (reliableMakes.includes(make.toLowerCase())) {
    sellingPoints.push(`${make}'s reputation for reliability and strong resale value`);
  }

  // Truck/SUV specific
  const truckMakes = ['ford', 'chevrolet', 'ram', 'gmc'];
  const truckModels = ['f-150', 'f-250', 'f-350', 'silverado', 'sierra', 'tacoma', 'tundra', 'ranger', 'colorado', 'canyon'];
  if (truckModels.some(t => model.toLowerCase().includes(t)) ||
      (truckMakes.includes(make.toLowerCase()) && model.toLowerCase().includes('truck'))) {
    sellingPoints.push('trucks hold their value exceptionally well');
  }

  // Build the answer
  const fullModel = props.trim ? `${model} ${props.trim}` : model;
  let answer = `Yes! This ${year} ${make} ${fullModel} offers solid value. `;

  if (sellingPoints.length > 0) {
    // Pick up to 2 selling points
    const points = sellingPoints.slice(0, 2);
    if (points.length === 1) {
      answer += `It has ${points[0]}.`;
    } else {
      answer += `It has ${points[0]} and ${points[1]}.`;
    }
  } else {
    answer += `With ${mileage.toLocaleString()} miles, it's priced competitively for the market.`;
  }

  return answer;
}

export default function VehicleFAQ(props: VehicleFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Am I getting a good deal?",
      answer: generateGoodDealAnswer(props),
      icon: HelpCircle,
    },
    {
      question: "How do I move forward with this vehicle?",
      answer: "Create a free IQ Auto Deals account, add this vehicle to your Deal Request, and let certified dealers compete to offer you their best price. It's completely free with no obligation.",
      icon: UserPlus,
      showRegisterCTA: true,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-primary" />
        Decision Q&A
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">{faq.question}</h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-gray-700 mb-3">{faq.answer}</p>
                {faq.showRegisterCTA && (
                  <Link
                    href="/register?type=customer"
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create Free Account
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
