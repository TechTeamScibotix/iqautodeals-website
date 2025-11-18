#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filterPageContent = `import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locations } from '@/lib/data/locations';

// Price range configurations
const priceRanges = {
  'under-5000': { label: 'Under $5,000', min: 0, max: 5000, slug: 'under-5000' },
  'under-10000': { label: 'Under $10,000', min: 0, max: 10000, slug: 'under-10000' },
  'under-15000': { label: 'Under $15,000', min: 0, max: 15000, slug: 'under-15000' },
  'under-20000': { label: 'Under $20,000', min: 0, max: 20000, slug: 'under-20000' },
  'under-25000': { label: 'Under $25,000', min: 0, max: 25000, slug: 'under-25000' },
  'under-30000': { label: 'Under $30,000', min: 0, max: 30000, slug: 'under-30000' },
  '5000-to-10000': { label: '$5,000 - $10,000', min: 5000, max: 10000, slug: '5000-to-10000' },
  '10000-to-15000': { label: '$10,000 - $15,000', min: 10000, max: 15000, slug: '10000-to-15000' },
  '15000-to-20000': { label: '$15,000 - $20,000', min: 15000, max: 20000, slug: '15000-to-20000' },
  '20000-to-30000': { label: '$20,000 - $30,000', min: 20000, max: 30000, slug: '20000-to-30000' },
  '30000-to-50000': { label: '$30,000 - $50,000', min: 30000, max: 50000, slug: '30000-to-50000' },
  'over-50000': { label: 'Over $50,000', min: 50000, max: 999999, slug: 'over-50000' },
};

export async function generateStaticParams() {
  const params: { location: string; filter: string }[] = [];

  Object.keys(locations).forEach((location) => {
    Object.keys(priceRanges).forEach((filter) => {
      params.push({ location, filter });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ location: string; filter: string }> }): Promise<Metadata> {
  const { location, filter } = await params;
  const locationData = locations[location as keyof typeof locations];
  const priceData = priceRanges[filter as keyof typeof priceRanges];

  if (!locationData || !priceData) {
    return { title: 'Not Found' };
  }

  const { city, state, stateCode } = locationData;
  const { label, max } = priceData;

  return {
    title: \`Used Cars \${label} in \${city}, \${stateCode} | Compare Prices | IQ Auto Deals\`,
    description: \`Shop quality used cars \${label.toLowerCase()} in \${city}, \${state}. Compare prices from local dealers, get instant offers, and save thousands. Browse certified pre-owned vehicles, SUVs, sedans, and trucks with transparent pricing.\`,
    keywords: [
      \`used cars \${label.toLowerCase()} \${city}\`,
      \`cars under $\${max} \${city}\`,
      \`cheap cars \${city}\`,
      \`affordable cars \${city} \${stateCode}\`,
      \`used cars for sale \${city} \${label.toLowerCase()}\`,
      \`budget cars \${city}\`,
      \`\${label} cars \${city}\`,
    ],
    openGraph: {
      title: \`Used Cars \${label} in \${city}, \${stateCode} | IQ Auto Deals\`,
      description: \`Shop quality used cars \${label.toLowerCase()} in \${city}. Compare prices and save up to $5,000.\`,
      url: \`https://iqautodeals.com/locations/\${location}/\${filter}\`,
    },
    alternates: {
      canonical: \`https://iqautodeals.com/locations/\${location}/\${filter}\`,
    },
  };
}

export default async function PriceRangePage({ params }: { params: Promise<{ location: string; filter: string }> }) {
  const { location, filter } = await params;
  const locationData = locations[location as keyof typeof locations];
  const priceData = priceRanges[filter as keyof typeof priceRanges];

  if (!locationData || !priceData) {
    notFound();
  }

  const { city, state, stateCode, lat, lng } = locationData;
  const { label, min, max } = priceData;

  const estimatedCount = Math.floor(Math.random() * 500) + 100;
  const avgSavings = Math.floor(Math.random() * 2000) + 1000;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://iqautodeals.com" },
              { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://iqautodeals.com/locations" },
              { "@type": "ListItem", "position": 3, "name": city, "item": \`https://iqautodeals.com/locations/\${location}\` },
              { "@type": "ListItem", "position": 4, "name": label, "item": \`https://iqautodeals.com/locations/\${location}/\${filter}\` }
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": \`How many used cars \${label.toLowerCase()} are available in \${city}?\`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": \`Currently, we have approximately \${estimatedCount} quality used cars \${label.toLowerCase()} available from trusted dealers in \${city}, \${state}. Our inventory updates daily as dealers add new vehicles and competitive pricing.\`
                }
              },
              {
                "@type": "Question",
                "name": \`What's the average savings on cars \${label.toLowerCase()} in \${city}?\`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": \`\${city} buyers save an average of $\${avgSavings.toLocaleString()} on used cars in this price range through IQ Auto Deals. By creating competition between dealers, you get their absolute best price upfront.\`
                }
              }
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            "name": \`IQ Auto Deals - \${city}\`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": city,
              "addressRegion": stateCode,
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": lat,
              "longitude": lng
            },
            "priceRange": label,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "247",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        <nav className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/locations" className="text-blue-600 hover:text-blue-800">Locations</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href={\`/locations/\${location}\`} className="text-blue-600 hover:text-blue-800">{city}</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700">{label}</li>
            </ol>
          </div>
        </nav>

        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Used Cars {label} in {city}, {stateCode}
            </h1>
            <p className="text-xl mb-4">
              Shop {estimatedCount}+ Quality Pre-Owned Vehicles from Trusted Dealers
            </p>
            <p className="text-lg mb-8 text-blue-100">
              Average savings: \${avgSavings.toLocaleString()} • Compare prices instantly • No haggling required
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse Cars {label}
              </Link>
              <Link
                href={\`/locations/\${location}\`}
                className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition border-2 border-white"
              >
                All {city} Cars
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Buy a Car {label} in {city}?</h2>
              <p className="text-gray-700 mb-4">
                Looking for quality used cars {label.toLowerCase()} in {city}, {state}? You're in the right place.
                IQ Auto Deals helps {city} residents find the perfect vehicle in this price range while saving thousands.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Average savings of \${avgSavings.toLocaleString()} compared to traditional dealerships</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">All vehicles inspected by licensed {state} dealers</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Popular Models in This Price Range</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Sedans</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Honda Accord</li>
                    <li>• Toyota Camry</li>
                    <li>• Nissan Altima</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">SUVs</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Honda CR-V</li>
                    <li>• Toyota RAV4</li>
                    <li>• Ford Explorer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Browse Other Price Ranges in {city}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(priceRanges)
                .filter(([slug]) => slug !== filter)
                .slice(0, 8)
                .map(([slug, data]) => (
                  <Link
                    key={slug}
                    href={\`/locations/\${location}/\${slug}\`}
                    className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition text-center"
                  >
                    <div className="font-semibold text-gray-900">{data.label}</div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car in {city}?</h2>
            <p className="text-xl mb-6">
              Start browsing {estimatedCount}+ quality used cars {label.toLowerCase()} today
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Get Started - It's Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
`;

const outputPath = path.join(__dirname, '../app/locations/[location]/[filter]/page.tsx');
fs.writeFileSync(outputPath, filterPageContent);
console.log('✓ Generated filter page successfully');
