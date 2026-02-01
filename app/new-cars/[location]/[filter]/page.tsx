import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '../../../components/Footer';
import { locations } from '@/lib/data/locations';
import { bodyTypes } from '@/lib/data/bodyTypes';
import { models } from '@/lib/data/models';
import { ArrowRight, Car, CheckCircle } from 'lucide-react';

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
  const params: { location: string; filter: string }[] = [];

  Object.keys(locations).forEach((location) => {
    // Add price range pages
    Object.keys(priceRanges).forEach((filter) => {
      params.push({ location, filter });
    });

    // Add body type pages
    Object.keys(bodyTypes).forEach((filter) => {
      params.push({ location, filter });
    });

    // Add model pages
    Object.keys(models).forEach((filter) => {
      params.push({ location, filter });
    });
  });

  return params;
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
      title: `New Cars ${label} in ${city}, ${stateCode} (2025) - Best Deals`,
      description: `${label} new cars in ${city}, ${state}. Compare dealer prices and save hundreds. Quality new vehicles. No haggling. Trusted dealers. Browse new cars, SUVs and trucks now.`,
      keywords: [
        `new cars ${label.toLowerCase()} ${city}`,
        `affordable new cars ${city}`,
        `cheap new cars ${city} ${stateCode}`,
        `new cars for sale ${city} ${label.toLowerCase()}`,
        `budget new cars ${city}`,
      ],
      openGraph: {
        title: `New Cars ${label} - ${city}, ${stateCode}`,
        description: `Shop new cars ${label.toLowerCase()} in ${city}. Compare prices and save hundreds.`,
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
      title: `New ${label} for Sale in ${city}, ${stateCode} (2025) - Compare Prices`,
      description: `New ${label.toLowerCase()} for sale in ${city}, ${state}. Compare dealer prices and save hundreds. Certified new ${singular.toLowerCase()}s. No haggling. Browse now.`,
      keywords: [
        `new ${label.toLowerCase()} ${city}`,
        `new ${label.toLowerCase()} for sale ${city}`,
        `best new ${singular.toLowerCase()} deals ${city}`,
        `new ${label.toLowerCase()} ${city} ${stateCode}`,
        `${singular.toLowerCase()} dealers ${city}`,
      ],
      openGraph: {
        title: `New ${label} - ${city}, ${stateCode}`,
        description: `Shop new ${label.toLowerCase()} in ${city}. Compare prices and save hundreds on your new ${singular.toLowerCase()}.`,
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
    title: `New ${fullName} for Sale in ${city}, ${stateCode} (2025) - Best Prices`,
    description: `New ${fullName} for sale in ${city}, ${state}. Compare ${brand} dealer prices and save hundreds. Full warranty. No haggling. Browse new ${fullName} inventory now.`,
    keywords: [
      `new ${fullName.toLowerCase()} ${city}`,
      `new ${fullName} for sale ${city}`,
      `${brand} ${model} ${city}`,
      `2025 ${fullName} ${city} ${stateCode}`,
      `${fullName.toLowerCase()} dealers near me`,
    ],
    openGraph: {
      title: `New ${fullName} - ${city}, ${stateCode}`,
      description: `Shop new ${fullName} in ${city}. Compare prices and save hundreds.`,
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

  // Determine page type
  const isPriceRange = !!priceData;
  const isBodyType = !!bodyTypeData;
  const isModel = !!modelData;

  const label = isPriceRange
    ? priceData.label
    : isBodyType
      ? bodyTypeData.label
      : modelData.fullName;

  return (
    <>
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
        {/* Header */}
        <header className="bg-black sticky top-0 z-50 h-14 md:h-20">
          <div className="container mx-auto px-3 md:px-4 h-full">
            <div className="flex justify-between items-center h-full">
              <Link href="/" className="flex items-center h-full py-2">
                <Image src="/logo-header.png" alt="IQ Auto Deals" width={180} height={40} className="h-8 md:h-10 w-auto" priority />
              </Link>
              <nav className="hidden lg:flex gap-8 text-sm font-semibold">
                <Link href="/new-cars" className="text-primary transition-colors py-2">New Vehicles</Link>
                <Link href="/cars?condition=used" className="text-white hover:text-primary transition-colors py-2">Used Vehicles</Link>
                <Link href="/for-dealers" className="text-white hover:text-primary transition-colors py-2">For Dealers</Link>
              </nav>
              <div className="flex gap-2 md:gap-3">
                <Link href="/login" className="text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold">
                  Sign In
                </Link>
                <Link href="/register" className="bg-primary text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
              <li className="text-text-secondary">/</li>
              <li><Link href="/new-cars" className="text-primary hover:text-primary-dark">New Cars</Link></li>
              <li className="text-text-secondary">/</li>
              <li><Link href={`/new-cars/${location}`} className="text-primary hover:text-primary-dark">{city}</Link></li>
              <li className="text-text-secondary">/</li>
              <li className="text-text-primary">{label}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {isPriceRange
                  ? `New Cars ${label} in ${city}, ${stateCode}`
                  : `New ${label} for Sale in ${city}, ${stateCode}`
                }
              </h1>
              <p className="text-xl mb-4 text-white/90">
                Shop Brand New {isPriceRange ? 'Vehicles' : label} from Certified {city} Dealers
              </p>
              <p className="text-lg mb-8 text-white/80">
                Compare prices from multiple dealers and save hundreds
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/cars?condition=new"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
                >
                  <Car className="w-5 h-5" />
                  {isPriceRange ? `Browse Cars ${label}` : `Browse New ${label}`}
                </Link>
                <Link
                  href={`/new-cars/${location}`}
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30"
                >
                  All New Cars in {city}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

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
                    'Latest 2025 models available',
                    `Compare prices from multiple ${city} dealers`,
                    'Save hundreds through dealer competition',
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
                href="/cars?condition=new"
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
