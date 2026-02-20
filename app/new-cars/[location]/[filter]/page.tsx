import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import zipcodes from 'zipcodes';
import Footer from '../../../components/Footer';
import { locations } from '@/lib/data/locations';
import { bodyTypes } from '@/lib/data/bodyTypes';
import { models } from '@/lib/data/models';
import { ArrowRight, Car, CheckCircle } from 'lucide-react';
import { fetchInventoryForLocation, type InventoryResult } from '@/lib/inventory';
import ItemListSchema from '@/app/components/ItemListSchema';
import CarsClient from '@/app/cars/CarsClient';

// Generate on-demand and cache for 24 hours (ISR) — too many combinations to prebuild
export const dynamicParams = true;
export const revalidate = 86400;

// Price range configurations for new cars
const priceRanges = {
  'under-25000': { label: 'Under $25,000', min: 0, max: 25000, slug: 'under-25000' },
  'under-30000': { label: 'Under $30,000', min: 0, max: 30000, slug: 'under-30000' },
  'under-35000': { label: 'Under $35,000', min: 0, max: 35000, slug: 'under-35000' },
  'under-40000': { label: 'Under $40,000', min: 0, max: 40000, slug: 'under-40000' },
  'under-50000': { label: 'Under $50,000', min: 0, max: 50000, slug: 'under-50000' },
  'under-60000': { label: 'Under $60,000', min: 0, max: 60000, slug: 'under-60000' },
  '25000-to-35000': { label: '$25,000 - $35,000', min: 25000, max: 35000, slug: '25000-to-35000' },
  '35000-to-50000': { label: '$35,000 - $50,000', min: 35000, max: 50000, slug: '35000-to-50000' },
  '50000-to-75000': { label: '$50,000 - $75,000', min: 50000, max: 75000, slug: '50000-to-75000' },
  '75000-to-100000': { label: '$75,000 - $100,000', min: 75000, max: 100000, slug: '75000-to-100000' },
  'over-100000': { label: 'Over $100,000', min: 100000, max: 999999, slug: 'over-100000' },
};

export async function generateStaticParams() {
  // Return empty — pages are generated on-demand and cached (ISR)
  // The full cartesian product (locations × filters) is too large for build-time
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ location: string; filter: string }> }): Promise<Metadata> {
  const { location, filter } = await params;
  const locationData = locations[location as keyof typeof locations];
  const priceData = priceRanges[filter as keyof typeof priceRanges];
  const bodyTypeData = bodyTypes[filter as keyof typeof bodyTypes];
  const modelData = models[filter as keyof typeof models];

  if (!locationData || (!priceData && !bodyTypeData && !modelData)) {
    return { title: 'Not Found' };
  }

  const { city, state, stateCode } = locationData;

  // Price range metadata
  if (priceData) {
    const { label } = priceData;
    return {
      title: `New Cars ${label} in ${city}, ${stateCode}`,
      description: `${label} new cars in ${city}, ${state}. Compare dealer prices and save. Quality new vehicles. No haggling. Trusted dealers. Browse new cars, SUVs and trucks now.`,
      keywords: [
        `new cars ${label.toLowerCase()} ${city}`,
        `affordable new cars ${city}`,
        `cheap new cars ${city} ${stateCode}`,
        `new cars for sale ${city} ${label.toLowerCase()}`,
        `budget new cars ${city}`,
      ],
      openGraph: {
        title: `New Cars ${label} - ${city}, ${stateCode}`,
        description: `Shop new cars ${label.toLowerCase()} in ${city}. Compare prices and save.`,
        url: `https://iqautodeals.com/new-cars/${location}/${filter}`,
      },
      alternates: {
        canonical: `https://iqautodeals.com/new-cars/${location}/${filter}`,
      },
    };
  }

  // Body type metadata
  if (bodyTypeData) {
    const { label, singular } = bodyTypeData;
    return {
      title: `New ${label} in ${city}, ${stateCode} - Best Deals`,
      description: `New ${label.toLowerCase()} for sale in ${city}, ${state}. Compare dealer prices and save. Certified new ${singular.toLowerCase()}s. No haggling. Browse now.`,
      keywords: [
        `new ${label.toLowerCase()} ${city}`,
        `new ${label.toLowerCase()} for sale ${city}`,
        `best new ${singular.toLowerCase()} deals ${city}`,
        `new ${label.toLowerCase()} ${city} ${stateCode}`,
        `${singular.toLowerCase()} dealers ${city}`,
      ],
      openGraph: {
        title: `New ${label} - ${city}, ${stateCode}`,
        description: `Shop new ${label.toLowerCase()} in ${city}. Compare prices and save on your new ${singular.toLowerCase()}.`,
        url: `https://iqautodeals.com/new-cars/${location}/${filter}`,
      },
      alternates: {
        canonical: `https://iqautodeals.com/new-cars/${location}/${filter}`,
      },
    };
  }

  // Model metadata
  const { brand, model, fullName } = modelData;
  return {
    title: `New ${fullName} in ${city}, ${stateCode}`,
    description: `New ${fullName} for sale in ${city}, ${state}. Compare ${brand} dealer prices and save. Full warranty. No haggling. Browse new ${fullName} inventory now.`,
    keywords: [
      `new ${fullName.toLowerCase()} ${city}`,
      `new ${fullName} for sale ${city}`,
      `${brand} ${model} ${city}`,
      `2026 ${fullName} ${city} ${stateCode}`,
      `${fullName.toLowerCase()} dealers near me`,
    ],
    openGraph: {
      title: `New ${fullName} - ${city}, ${stateCode}`,
      description: `Shop new ${fullName} in ${city}. Compare prices and save.`,
      url: `https://iqautodeals.com/new-cars/${location}/${filter}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/new-cars/${location}/${filter}`,
    },
  };
}

export default async function NewCarsFilterPage({ params }: { params: Promise<{ location: string; filter: string }> }) {
  const { location, filter } = await params;
  const locationData = locations[location as keyof typeof locations];
  const priceData = priceRanges[filter as keyof typeof priceRanges];
  const bodyTypeData = bodyTypes[filter as keyof typeof bodyTypes];
  const modelData = models[filter as keyof typeof models];

  if (!locationData || (!priceData && !bodyTypeData && !modelData)) {
    notFound();
  }

  const { city, state, stateCode } = locationData;
  const zip = zipcodes.lookupByName(city, state)?.[0]?.zip;

  // Determine page type
  const isPriceRange = !!priceData;
  const isBodyType = !!bodyTypeData;
  const isModel = !!modelData;

  const label = isPriceRange
    ? priceData.label
    : isBodyType
      ? bodyTypeData.label
      : modelData.fullName;

  // Build filtered /cars URL with condition=new + zip + context params
  const carsParams = new URLSearchParams();
  carsParams.set('condition', 'new');
  if (zip) carsParams.set('zipCode', zip);
  if (isPriceRange) {
    if (priceData.max < 999999) carsParams.set('maxPrice', String(priceData.max));
    if (priceData.min > 0) carsParams.set('minPrice', String(priceData.min));
  } else if (isBodyType) {
    carsParams.set('bodyType', bodyTypeData.label);
  } else if (isModel) {
    carsParams.set('make', modelData.brand);
    carsParams.set('model', modelData.model);
  }
  const carsHref = `/cars?${carsParams.toString()}`;

  // Fetch real inventory from DB
  let inventory: InventoryResult = { cars: [], totalCount: 0, scope: 'city', scopeLabel: `in ${city}, ${stateCode}` };
  try {
    inventory = await fetchInventoryForLocation({
      city,
      stateCode,
      condition: 'new',
      ...(isPriceRange ? { minPrice: priceData.min > 0 ? priceData.min : undefined, maxPrice: priceData.max < 999999 ? priceData.max : undefined } : {}),
      ...(isBodyType ? { bodyType: filter } : {}),
      ...(isModel ? { make: modelData.brand, model: modelData.model } : {}),
    });
  } catch {}

  return (
    <>
      <ItemListSchema cars={inventory.cars} listName={`New ${label} for Sale in ${city}, ${stateCode}`} />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://iqautodeals.com" },
              { "@type": "ListItem", "position": 2, "name": "New Cars", "item": "https://iqautodeals.com/new-cars" },
              { "@type": "ListItem", "position": 3, "name": city, "item": `https://iqautodeals.com/new-cars/${location}` },
              { "@type": "ListItem", "position": 4, "name": label, "item": `https://iqautodeals.com/new-cars/${location}/${filter}` }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-light-dark font-sans">
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading inventory...</div></div>}>
          <CarsClient
            pageTitle={isPriceRange
              ? `New Cars ${label} in ${city}, ${stateCode}`
              : `New ${label} for Sale in ${city}, ${stateCode}`
            }
            pageSubtitle={`Shop Brand New ${isPriceRange ? 'Vehicles' : label} from Certified ${city} Dealers`}
            initialZipCode={zip}
            initialCondition="new"
            {...(isPriceRange ? { initialMinPrice: priceData.min > 0 ? priceData.min : undefined, initialMaxPrice: priceData.max < 999999 ? priceData.max : undefined } : {})}
            {...(isBodyType ? { initialBodyType: bodyTypeData.label } : {})}
            {...(isModel ? { initialMake: modelData.brand, initialModel: modelData.model } : {})}
            showFooter={false}
          />
        </Suspense>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-text-primary">
                  {isPriceRange
                    ? `Why Buy a New Car ${label} in ${city}?`
                    : isBodyType
                      ? `Why Buy a New ${bodyTypeData.singular} in ${city}?`
                      : `Why Buy a New ${label} in ${city}?`
                  }
                </h2>
                <p className="text-text-secondary mb-6">
                  {isPriceRange
                    ? `Looking for a new car ${label.toLowerCase()} in ${city}, ${state}? IQ Auto Deals helps you find the perfect new vehicle in your budget from certified local dealers.`
                    : isBodyType
                      ? `Looking for a new ${bodyTypeData.singular.toLowerCase()} in ${city}, ${state}? IQ Auto Deals connects you with trusted dealers offering the best new ${label.toLowerCase()} at competitive prices.`
                      : `Looking for a new ${label} in ${city}, ${state}? IQ Auto Deals connects you with certified ${isModel ? modelData.brand : ''} dealers offering the best prices on new ${label}.`
                  }
                </p>
                <ul className="space-y-4">
                  {[
                    'Full manufacturer warranty included',
                    'Latest 2026 models available',
                    `Compare prices from multiple ${city} dealers`,
                    'Save through dealer competition',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6 text-text-primary">Browse More in {city}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {isPriceRange ? (
                    Object.entries(priceRanges)
                      .filter(([slug]) => slug !== filter)
                      .slice(0, 6)
                      .map(([slug, data]) => (
                        <Link
                          key={slug}
                          href={`/new-cars/${location}/${slug}`}
                          className="bg-light-dark p-3 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center text-sm"
                        >
                          <span className="font-medium text-text-primary">{data.label}</span>
                        </Link>
                      ))
                  ) : isBodyType ? (
                    Object.entries(bodyTypes)
                      .filter(([slug]) => slug !== filter)
                      .slice(0, 6)
                      .map(([slug, data]) => (
                        <Link
                          key={slug}
                          href={`/new-cars/${location}/${slug}`}
                          className="bg-light-dark p-3 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center text-sm"
                        >
                          <span className="font-medium text-text-primary">New {data.label}</span>
                        </Link>
                      ))
                  ) : (
                    Object.entries(models)
                      .filter(([slug, data]) => data.brand === modelData.brand && slug !== filter)
                      .slice(0, 6)
                      .map(([slug, data]) => (
                        <Link
                          key={slug}
                          href={`/new-cars/${location}/${slug}`}
                          className="bg-light-dark p-3 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center text-sm"
                        >
                          <span className="font-medium text-text-primary">New {data.fullName}</span>
                        </Link>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-light-dark">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Find Your New {isPriceRange ? 'Car' : label} in {city}?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Browse new vehicles and let dealers compete for your business
              </p>
              <Link
                href={carsHref}
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg"
              >
                <Car className="w-5 h-5" />
                Browse Inventory
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
