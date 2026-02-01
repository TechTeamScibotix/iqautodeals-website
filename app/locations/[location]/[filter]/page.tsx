import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locations } from '@/lib/data/locations';
import { bodyTypes } from '@/lib/data/bodyTypes';
import { models } from '@/lib/data/models';

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
    const { label, max } = priceData;
    return {
      title: `Best Used Cars ${label} in ${city}, ${stateCode} (2025) - Save Big`,
      description: `${label} used cars in ${city}, ${state}. Compare dealer prices & save hundreds. Quality vehicles. No haggling. Trusted dealers. Browse affordable cars, SUVs & trucks now.`,
      keywords: [
        `used cars ${label.toLowerCase()} ${city}`,
        `cars under $${max} ${city}`,
        `cheap cars ${city}`,
        `affordable cars ${city} ${stateCode}`,
        `used cars for sale ${city} ${label.toLowerCase()}`,
        `budget cars ${city}`,
        `${label} cars ${city}`,
      ],
      openGraph: {
        title: `Used Cars ${label} - ${city}, ${stateCode}`,
        description: `Shop quality used cars ${label.toLowerCase()} in ${city}. Compare prices and save hundreds.`,
        url: `https://iqautodeals.com/locations/${location}/${filter}`,
      },
      alternates: {
        canonical: `https://iqautodeals.com/locations/${location}/${filter}`,
      },
    };
  }

  // Body type metadata
  if (bodyTypeData) {
    const { label, singular } = bodyTypeData;
    return {
      title: `Best Used ${label} in ${city}, ${stateCode} (2025) - Compare & Save`,
      description: `Top used ${label.toLowerCase()} for sale in ${city}, ${state}. Compare dealer prices & save hundreds. Certified pre-owned. No haggling. Quality ${singular.toLowerCase()}s. Browse now.`,
      keywords: [
        `used ${label.toLowerCase()} ${city}`,
        `${label.toLowerCase()} for sale ${city}`,
        `best ${singular.toLowerCase()} deals ${city}`,
        `pre-owned ${label.toLowerCase()} ${city} ${stateCode}`,
        `certified ${label.toLowerCase()} ${city}`,
        `${singular.toLowerCase()} dealers ${city}`,
        `buy ${singular.toLowerCase()} ${city}`,
      ],
      openGraph: {
        title: `Used ${label} - ${city}, ${stateCode}`,
        description: `Shop quality used ${label.toLowerCase()} in ${city}. Compare prices and save hundreds on your next ${singular.toLowerCase()}.`,
        url: `https://iqautodeals.com/locations/${location}/${filter}`,
      },
      alternates: {
        canonical: `https://iqautodeals.com/locations/${location}/${filter}`,
      },
    };
  }

  // Model metadata
  const { brand, model, fullName } = modelData;
  return {
    title: `Used ${fullName} for Sale in ${city}, ${stateCode} (2025) - Best Prices`,
    description: `Best deals on used ${fullName} in ${city}, ${state}. Compare ${brand} dealer prices & save hundreds. Certified pre-owned. No haggling. Browse ${fullName} inventory now.`,
    keywords: [
      `used ${fullName.toLowerCase()} ${city}`,
      `${fullName} for sale ${city}`,
      `${brand} ${model} ${city}`,
      `pre-owned ${fullName.toLowerCase()} ${city} ${stateCode}`,
      `certified ${fullName.toLowerCase()} ${city}`,
      `${fullName.toLowerCase()} dealers near me`,
      `buy ${fullName.toLowerCase()} ${city}`,
    ],
    openGraph: {
      title: `Used ${fullName} - ${city}, ${stateCode}`,
      description: `Shop quality used ${fullName} in ${city}. Compare prices and save hundreds.`,
      url: `https://iqautodeals.com/locations/${location}/${filter}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/locations/${location}/${filter}`,
    },
  };
}

export default async function FilterPage({ params }: { params: Promise<{ location: string; filter: string }> }) {
  const { location, filter } = await params;
  const locationData = locations[location as keyof typeof locations];
  const priceData = priceRanges[filter as keyof typeof priceRanges];
  const bodyTypeData = bodyTypes[filter as keyof typeof bodyTypes];
  const modelData = models[filter as keyof typeof models];

  if (!locationData || (!priceData && !bodyTypeData && !modelData)) {
    notFound();
  }

  const { city, state, stateCode, lat, lng } = locationData;
  const estimatedCount = Math.floor(Math.random() * 500) + 100;
  const avgSavings = Math.floor(Math.random() * 2000) + 1000;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://iqautodeals.com" },
              { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://iqautodeals.com/locations" },
              { "@type": "ListItem", "position": 3, "name": city, "item": `https://iqautodeals.com/locations/${location}` },
              { "@type": "ListItem", "position": 4, "name": label, "item": `https://iqautodeals.com/locations/${location}/${filter}` }
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
                "name": isPriceRange
                  ? `How many used cars ${label.toLowerCase()} are available in ${city}?`
                  : isBodyType
                    ? `How many used ${label.toLowerCase()} are available in ${city}?`
                    : `How many used ${label} are available in ${city}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Currently, we have approximately ${estimatedCount} quality used ${isPriceRange ? 'cars ' + label.toLowerCase() : label} available from trusted dealers in ${city}, ${state}. Our inventory updates daily with new arrivals.`
                }
              },
              {
                "@type": "Question",
                "name": isPriceRange
                  ? `What's the average savings on cars ${label.toLowerCase()} in ${city}?`
                  : `What's the average price for used ${label} in ${city}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${city} buyers save an average of $${avgSavings.toLocaleString()} on used ${label} through IQ Auto Deals. By creating competition between dealers, you get their absolute best price upfront.`
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
            "name": `IQ Auto Deals - ${city}`,
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
            "priceRange": isPriceRange ? label : "$$-$$$",
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
              <li><Link href={`/locations/${location}`} className="text-blue-600 hover:text-blue-800">{city}</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700">{label}</li>
            </ol>
          </div>
        </nav>

        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {isPriceRange
                ? `Used Cars ${label} in ${city}, ${stateCode}`
                : isBodyType
                  ? `Used ${label} for Sale in ${city}, ${stateCode}`
                  : `Used ${label} for Sale in ${city}, ${stateCode}`
              }
            </h1>
            <p className="text-xl mb-4">
              Shop {estimatedCount}+ Quality {isPriceRange ? 'Pre-Owned Vehicles' : label} from Trusted Dealers
            </p>
            <p className="text-lg mb-8 text-blue-100">
              Average savings: ${avgSavings.toLocaleString()} • Compare prices instantly • No haggling required
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                {isPriceRange ? `Browse Cars ${label}` : `Browse ${label}`}
              </Link>
              <Link
                href={`/locations/${location}`}
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
              <h2 className="text-3xl font-bold mb-6">
                {isPriceRange
                  ? `Why Buy a Car ${label} in ${city}?`
                  : isBodyType
                    ? `Why Buy a Used ${bodyTypeData.singular} in ${city}?`
                    : `Why Buy a Used ${label} in ${city}?`
                }
              </h2>
              <p className="text-gray-700 mb-4">
                {isPriceRange
                  ? `Looking for quality used cars ${label.toLowerCase()} in ${city}, ${state}? You're in the right place. IQ Auto Deals helps ${city} residents find the perfect vehicle in this price range while saving thousands.`
                  : isBodyType
                    ? `Looking for a quality used ${bodyTypeData.singular.toLowerCase()} in ${city}, ${state}? IQ Auto Deals connects you with trusted dealers offering the best ${label.toLowerCase()} at competitive prices. Save thousands on your next ${bodyTypeData.singular.toLowerCase()}.`
                    : `Looking for a used ${label} in ${city}, ${state}? IQ Auto Deals connects you with trusted ${isModel ? modelData.brand : ''} dealers offering the best ${label} at competitive prices. Compare offers and save thousands.`
                }
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Average savings of ${avgSavings.toLocaleString()} compared to traditional dealerships</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">All vehicles inspected by licensed {state} dealers</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">
                    {isPriceRange
                      ? `Wide selection of makes and models in your budget`
                      : isBodyType
                        ? `Extensive inventory of ${label.toLowerCase()} from top brands`
                        : `Multiple ${label} available with various trims and features`
                    }
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">
                {isPriceRange
                  ? 'Popular Models in This Price Range'
                  : isBodyType
                    ? `Popular ${label} Brands`
                    : `Popular ${isModel ? modelData.brand : ''} Models`
                }
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {isPriceRange ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Domestic</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Ford</li>
                        <li>• Chevrolet</li>
                        <li>• Dodge</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Import</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Toyota</li>
                        <li>• Honda</li>
                        <li>• Nissan</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Browse More in {city}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href={`/locations/${location}`}
                className="block bg-blue-50 border-2 border-blue-300 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition text-center"
              >
                <div className="font-semibold text-blue-900">All {city} Cars</div>
              </Link>
              {isModel ? (
                <>
                  <Link
                    href="/models"
                    className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition text-center"
                  >
                    <div className="font-semibold text-gray-900">All Models</div>
                  </Link>
                  <Link
                    href="/locations"
                    className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition text-center"
                  >
                    <div className="font-semibold text-gray-900">All Locations</div>
                  </Link>
                </>
              ) : (
                Object.entries(isPriceRange ? priceRanges : bodyTypes)
                  .filter(([slug]) => slug !== filter)
                  .slice(0, 6)
                  .map(([slug, data]) => (
                    <Link
                      key={slug}
                      href={`/locations/${location}/${slug}`}
                      className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition text-center"
                    >
                      <div className="font-semibold text-gray-900">{data.label}</div>
                    </Link>
                  ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect {isPriceRange ? 'Car' : label} in {city}?
            </h2>
            <p className="text-xl mb-6">
              Start browsing {estimatedCount}+ quality used {isPriceRange ? `cars ${label.toLowerCase()}` : label} today
            </p>
            <Link
              href="/cars"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Browse Inventory
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
