import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Popular car models data
const models = {
  // Toyota
  'toyota-tacoma': { make: 'Toyota', model: 'Tacoma', type: 'Truck', avgPrice: 28500 },
  'toyota-tundra': { make: 'Toyota', model: 'Tundra', type: 'Truck', avgPrice: 35000 },
  'toyota-4runner': { make: 'Toyota', model: '4Runner', type: 'SUV', avgPrice: 32000 },
  'toyota-camry': { make: 'Toyota', model: 'Camry', type: 'Sedan', avgPrice: 19500 },
  'toyota-prius': { make: 'Toyota', model: 'Prius', type: 'Sedan', avgPrice: 17000 },
  'toyota-rav4': { make: 'Toyota', model: 'RAV4', type: 'SUV', avgPrice: 23000 },
  'toyota-sienna': { make: 'Toyota', model: 'Sienna', type: 'Minivan', avgPrice: 25000 },
  'toyota-sequoia': { make: 'Toyota', model: 'Sequoia', type: 'SUV', avgPrice: 38000 },

  // Honda
  'honda-civic': { make: 'Honda', model: 'Civic', type: 'Sedan', avgPrice: 18000 },
  'honda-accord': { make: 'Honda', model: 'Accord', type: 'Sedan', avgPrice: 21000 },
  'honda-cr-v': { make: 'Honda', model: 'CR-V', type: 'SUV', avgPrice: 24000 },
  'honda-pilot': { make: 'Honda', model: 'Pilot', type: 'SUV', avgPrice: 28000 },
  'honda-passport': { make: 'Honda', model: 'Passport', type: 'SUV', avgPrice: 30000 },
  'honda-odyssey': { make: 'Honda', model: 'Odyssey', type: 'Minivan', avgPrice: 26000 },
  'honda-ridgeline': { make: 'Honda', model: 'Ridgeline', type: 'Truck', avgPrice: 32000 },

  // Ford
  'ford-f150': { make: 'Ford', model: 'F-150', type: 'Truck', avgPrice: 35000 },
  'ford-explorer': { make: 'Ford', model: 'Explorer', type: 'SUV', avgPrice: 28000 },
  'ford-expedition': { make: 'Ford', model: 'Expedition', type: 'SUV', avgPrice: 42000 },
  'ford-fusion': { make: 'Ford', model: 'Fusion', type: 'Sedan', avgPrice: 16000 },
  'ford-raptor': { make: 'Ford', model: 'Raptor', type: 'Truck', avgPrice: 55000 },

  // Chevrolet
  'chevy-silverado': { make: 'Chevrolet', model: 'Silverado', type: 'Truck', avgPrice: 33000 },
  'chevy-equinox': { make: 'Chevrolet', model: 'Equinox', type: 'SUV', avgPrice: 20000 },
  'chevy-tahoe': { make: 'Chevrolet', model: 'Tahoe', type: 'SUV', avgPrice: 42000 },
  'chevy-suburban': { make: 'Chevrolet', model: 'Suburban', type: 'SUV', avgPrice: 45000 },
  'chevy-colorado': { make: 'Chevrolet', model: 'Colorado', type: 'Truck', avgPrice: 27000 },
  'chevy-malibu': { make: 'Chevrolet', model: 'Malibu', type: 'Sedan', avgPrice: 17000 },
  'chevy-camaro': { make: 'Chevrolet', model: 'Camaro', type: 'Coupe', avgPrice: 28000 },

  // Jeep
  'jeep-wrangler': { make: 'Jeep', model: 'Wrangler', type: 'SUV', avgPrice: 32000 },
  'jeep-grand-cherokee': { make: 'Jeep', model: 'Grand Cherokee', type: 'SUV', avgPrice: 30000 },
  'jeep-cherokee': { make: 'Jeep', model: 'Cherokee', type: 'SUV', avgPrice: 23000 },
  'jeep-gladiator': { make: 'Jeep', model: 'Gladiator', type: 'Truck', avgPrice: 37000 },
  'jeep-renegade': { make: 'Jeep', model: 'Renegade', type: 'SUV', avgPrice: 19000 },

  // BMW
  'bmw-x3': { make: 'BMW', model: 'X3', type: 'SUV', avgPrice: 32000 },
  'bmw-x5': { make: 'BMW', model: 'X5', type: 'SUV', avgPrice: 42000 },
  'bmw-3-series': { make: 'BMW', model: '3 Series', type: 'Sedan', avgPrice: 28000 },
  'bmw-m4': { make: 'BMW', model: 'M4', type: 'Coupe', avgPrice: 45000 },

  // Mercedes
  'mercedes-g-wagon': { make: 'Mercedes-Benz', model: 'G-Wagon', type: 'SUV', avgPrice: 95000 },

  // Lexus
  'lexus-rx350': { make: 'Lexus', model: 'RX 350', type: 'SUV', avgPrice: 35000 },

  // Mazda
  'mazda-cx5': { make: 'Mazda', model: 'CX-5', type: 'SUV', avgPrice: 22000 },
  'mazda-miata': { make: 'Mazda', model: 'Miata', type: 'Convertible', avgPrice: 22000 },

  // Nissan
  'nissan-pathfinder': { make: 'Nissan', model: 'Pathfinder', type: 'SUV', avgPrice: 24000 },
  'nissan-altima': { make: 'Nissan', model: 'Altima', type: 'Sedan', avgPrice: 17000 },

  // Dodge
  'dodge-durango': { make: 'Dodge', model: 'Durango', type: 'SUV', avgPrice: 30000 },
  'dodge-charger': { make: 'Dodge', model: 'Charger', type: 'Sedan', avgPrice: 26000 },
  'dodge-challenger': { make: 'Dodge', model: 'Challenger', type: 'Coupe', avgPrice: 28000 },

  // Ram
  'ram-1500': { make: 'Ram', model: '1500', type: 'Truck', avgPrice: 34000 },

  // Subaru
  'subaru-outback': { make: 'Subaru', model: 'Outback', type: 'SUV', avgPrice: 24000 },
  'subaru-forester': { make: 'Subaru', model: 'Forester', type: 'SUV', avgPrice: 22000 },
  'subaru-wrx': { make: 'Subaru', model: 'WRX', type: 'Sedan', avgPrice: 26000 },

  // Kia
  'kia-telluride': { make: 'Kia', model: 'Telluride', type: 'SUV', avgPrice: 32000 },
  'kia-stinger': { make: 'Kia', model: 'Stinger', type: 'Sedan', avgPrice: 28000 },
  'kia-carnival': { make: 'Kia', model: 'Carnival', type: 'Minivan', avgPrice: 29000 },

  // Hyundai
  'hyundai-sonata': { make: 'Hyundai', model: 'Sonata', type: 'Sedan', avgPrice: 19000 },
  'hyundai-tucson': { make: 'Hyundai', model: 'Tucson', type: 'SUV', avgPrice: 21000 },
  'hyundai-santa-fe': { make: 'Hyundai', model: 'Santa Fe', type: 'SUV', avgPrice: 24000 },

  // Audi
  'audi-q5': { make: 'Audi', model: 'Q5', type: 'SUV', avgPrice: 33000 },
  'audi-a4': { make: 'Audi', model: 'A4', type: 'Sedan', avgPrice: 26000 },

  // Volkswagen
  'volkswagen-tiguan': { make: 'Volkswagen', model: 'Tiguan', type: 'SUV', avgPrice: 22000 },
  'volkswagen-atlas': { make: 'Volkswagen', model: 'Atlas', type: 'SUV', avgPrice: 28000 },

  // GMC
  'gmc-acadia': { make: 'GMC', model: 'Acadia', type: 'SUV', avgPrice: 28000 },
  'gmc-sierra': { make: 'GMC', model: 'Sierra', type: 'Truck', avgPrice: 35000 },

  // Buick
  'buick-enclave': { make: 'Buick', model: 'Enclave', type: 'SUV', avgPrice: 30000 },
};

export async function generateStaticParams() {
  return Object.keys(models).map((model) => ({
    model,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model: modelSlug } = await params;
  const modelData = models[modelSlug as keyof typeof models];

  if (!modelData) {
    return {
      title: 'Model Not Found',
    };
  }

  const { make, model: modelName } = modelData;

  return {
    title: `Used ${make} ${modelName} for Sale | Buy Certified Pre-Owned ${make} ${modelName} | IQ Auto Deals`,
    description: `Shop quality used ${make} ${modelName} for sale. Compare prices from local dealers, get instant offers, and save thousands on certified pre-owned ${make} ${modelName} vehicles. Browse our inventory with transparent pricing.`,
    keywords: [
      `used ${make} ${modelName}`,
      `${make} ${modelName} for sale`,
      `used ${make} ${modelName} price`,
      `certified pre-owned ${make} ${modelName}`,
      `${make} ${modelName} near me`,
      `buy used ${make} ${modelName}`,
      `${make} ${modelName} dealer`,
      `affordable ${make} ${modelName}`,
      `best price ${make} ${modelName}`,
      `${modelName}`,
      `used ${modelName}`,
    ],
    openGraph: {
      title: `Used ${make} ${modelName} for Sale | IQ Auto Deals`,
      description: `Shop quality used ${make} ${modelName}. Compare prices from local dealers and save up to $5,000.`,
      url: `https://iqautodeals.com/models/${modelSlug}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/models/${modelSlug}`,
    },
  };
}

export default async function ModelPage({ params }: { params: Promise<{ model: string }> }) {
  const { model: modelSlug } = await params;
  const modelData = models[modelSlug as keyof typeof models];

  if (!modelData) {
    notFound();
  }

  const { make, model: modelName, type, avgPrice } = modelData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used {make} {modelName} for Sale
          </h1>
          <p className="text-xl mb-4">
            Shop Quality Certified Pre-Owned {make} {modelName} from Trusted Dealers
          </p>
          <p className="text-lg mb-8">
            Average Price: ${avgPrice.toLocaleString()} | Vehicle Type: {type}
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse {make} {modelName} Inventory
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Buy a Used {make} {modelName}?</h2>
            <p className="text-gray-700 mb-4">
              The {make} {modelName} is one of the most popular {type.toLowerCase()}s on the market, known for its
              reliability, performance, and value retention. IQ Auto Deals makes it easy to find quality used
              {make} {modelName} vehicles for sale from trusted dealers nationwide.
            </p>
            <p className="text-gray-700 mb-4">
              Our platform connects you with certified dealers who compete to offer you the best price on
              pre-owned {make} {modelName} vehicles. Compare multiple offers and save thousands on your purchase.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Compare prices on used {make} {modelName} from multiple dealers</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Get instant offers on certified pre-owned {make} {modelName} vehicles</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Save up to $5,000 on your {make} {modelName} purchase</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Transparent pricing from verified dealers nationwide</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">How to Buy a {make} {modelName}</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Browse Inventory</h3>
                  <p className="text-gray-700">Search our extensive inventory of used {make} {modelName} vehicles from dealers across the country.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Get Competing Offers</h3>
                  <p className="text-gray-700">Dealers compete to offer you the best price on your selected {make} {modelName}.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Save Thousands</h3>
                  <p className="text-gray-700">Choose the best offer and drive away in your dream {make} {modelName} for less.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Why Choose IQ Auto Deals for Your {make} {modelName}?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Competitive Pricing</h3>
              <p className="text-gray-700">
                Get the best price on used {make} {modelName} vehicles by letting dealers compete for your business.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Certified Pre-Owned</h3>
              <p className="text-gray-700">
                Shop certified pre-owned {make} {modelName} vehicles that have been thoroughly inspected and verified.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Nationwide Coverage</h3>
              <p className="text-gray-700">
                Access {make} {modelName} inventory from trusted dealers across all 50 states.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Buy Your {make} {modelName}?</h2>
          <p className="text-xl text-gray-700 mb-6">
            Join thousands of happy customers who saved money on quality used {make} {modelName} vehicles.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse {make} {modelName} Inventory
          </Link>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `Used ${make} ${modelName}`,
            description: `Shop quality used ${make} ${modelName} for sale. Compare prices from local dealers and save thousands.`,
            brand: {
              '@type': 'Brand',
              name: make,
            },
            offers: {
              '@type': 'AggregateOffer',
              lowPrice: avgPrice * 0.8,
              highPrice: avgPrice * 1.2,
              priceCurrency: 'USD',
              offerCount: 100,
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: 4.5,
              reviewCount: 250,
            },
          }),
        }}
      />
    </div>
  );
}
