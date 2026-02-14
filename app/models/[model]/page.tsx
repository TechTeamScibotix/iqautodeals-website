import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '../../components/Footer';
import { makes } from '@/lib/data/makes';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

// Popular car models data
const models = {
  // Toyota
  'toyota-tacoma': { make: 'Toyota', model: 'Tacoma', type: 'Truck' },
  'toyota-tundra': { make: 'Toyota', model: 'Tundra', type: 'Truck' },
  'toyota-4runner': { make: 'Toyota', model: '4Runner', type: 'SUV' },
  'toyota-camry': { make: 'Toyota', model: 'Camry', type: 'Sedan' },
  'toyota-prius': { make: 'Toyota', model: 'Prius', type: 'Sedan' },
  'toyota-rav4': { make: 'Toyota', model: 'RAV4', type: 'SUV' },
  'toyota-sienna': { make: 'Toyota', model: 'Sienna', type: 'Minivan' },
  'toyota-sequoia': { make: 'Toyota', model: 'Sequoia', type: 'SUV' },

  // Honda
  'honda-civic': { make: 'Honda', model: 'Civic', type: 'Sedan' },
  'honda-accord': { make: 'Honda', model: 'Accord', type: 'Sedan' },
  'honda-cr-v': { make: 'Honda', model: 'CR-V', type: 'SUV' },
  'honda-pilot': { make: 'Honda', model: 'Pilot', type: 'SUV' },
  'honda-passport': { make: 'Honda', model: 'Passport', type: 'SUV' },
  'honda-odyssey': { make: 'Honda', model: 'Odyssey', type: 'Minivan' },
  'honda-ridgeline': { make: 'Honda', model: 'Ridgeline', type: 'Truck' },

  // Ford
  'ford-f150': { make: 'Ford', model: 'F-150', type: 'Truck' },
  'ford-explorer': { make: 'Ford', model: 'Explorer', type: 'SUV' },
  'ford-expedition': { make: 'Ford', model: 'Expedition', type: 'SUV' },
  'ford-fusion': { make: 'Ford', model: 'Fusion', type: 'Sedan' },
  'ford-raptor': { make: 'Ford', model: 'Raptor', type: 'Truck' },

  // Chevrolet
  'chevy-silverado': { make: 'Chevrolet', model: 'Silverado', type: 'Truck' },
  'chevy-equinox': { make: 'Chevrolet', model: 'Equinox', type: 'SUV' },
  'chevy-tahoe': { make: 'Chevrolet', model: 'Tahoe', type: 'SUV' },
  'chevy-suburban': { make: 'Chevrolet', model: 'Suburban', type: 'SUV' },
  'chevy-colorado': { make: 'Chevrolet', model: 'Colorado', type: 'Truck' },
  'chevy-malibu': { make: 'Chevrolet', model: 'Malibu', type: 'Sedan' },
  'chevy-camaro': { make: 'Chevrolet', model: 'Camaro', type: 'Coupe' },

  // Jeep
  'jeep-wrangler': { make: 'Jeep', model: 'Wrangler', type: 'SUV' },
  'jeep-grand-cherokee': { make: 'Jeep', model: 'Grand Cherokee', type: 'SUV' },
  'jeep-cherokee': { make: 'Jeep', model: 'Cherokee', type: 'SUV' },
  'jeep-gladiator': { make: 'Jeep', model: 'Gladiator', type: 'Truck' },
  'jeep-renegade': { make: 'Jeep', model: 'Renegade', type: 'SUV' },

  // BMW
  'bmw-x3': { make: 'BMW', model: 'X3', type: 'SUV' },
  'bmw-x5': { make: 'BMW', model: 'X5', type: 'SUV' },
  'bmw-3-series': { make: 'BMW', model: '3 Series', type: 'Sedan' },
  'bmw-m4': { make: 'BMW', model: 'M4', type: 'Coupe' },

  // Mercedes
  'mercedes-g-wagon': { make: 'Mercedes-Benz', model: 'G-Wagon', type: 'SUV' },

  // Lexus
  'lexus-rx350': { make: 'Lexus', model: 'RX 350', type: 'SUV' },

  // Mazda
  'mazda-cx5': { make: 'Mazda', model: 'CX-5', type: 'SUV' },
  'mazda-miata': { make: 'Mazda', model: 'Miata', type: 'Convertible' },

  // Nissan
  'nissan-pathfinder': { make: 'Nissan', model: 'Pathfinder', type: 'SUV' },
  'nissan-altima': { make: 'Nissan', model: 'Altima', type: 'Sedan' },

  // Dodge
  'dodge-durango': { make: 'Dodge', model: 'Durango', type: 'SUV' },
  'dodge-charger': { make: 'Dodge', model: 'Charger', type: 'Sedan' },
  'dodge-challenger': { make: 'Dodge', model: 'Challenger', type: 'Coupe' },

  // Ram
  'ram-1500': { make: 'Ram', model: '1500', type: 'Truck' },

  // Subaru
  'subaru-outback': { make: 'Subaru', model: 'Outback', type: 'SUV' },
  'subaru-forester': { make: 'Subaru', model: 'Forester', type: 'SUV' },
  'subaru-wrx': { make: 'Subaru', model: 'WRX', type: 'Sedan' },

  // Kia
  'kia-telluride': { make: 'Kia', model: 'Telluride', type: 'SUV' },
  'kia-stinger': { make: 'Kia', model: 'Stinger', type: 'Sedan' },
  'kia-carnival': { make: 'Kia', model: 'Carnival', type: 'Minivan' },

  // Hyundai
  'hyundai-sonata': { make: 'Hyundai', model: 'Sonata', type: 'Sedan' },
  'hyundai-tucson': { make: 'Hyundai', model: 'Tucson', type: 'SUV' },
  'hyundai-santa-fe': { make: 'Hyundai', model: 'Santa Fe', type: 'SUV' },

  // Audi
  'audi-q5': { make: 'Audi', model: 'Q5', type: 'SUV' },
  'audi-a4': { make: 'Audi', model: 'A4', type: 'Sedan' },

  // Volkswagen
  'volkswagen-tiguan': { make: 'Volkswagen', model: 'Tiguan', type: 'SUV' },
  'volkswagen-atlas': { make: 'Volkswagen', model: 'Atlas', type: 'SUV' },

  // GMC
  'gmc-acadia': { make: 'GMC', model: 'Acadia', type: 'SUV' },
  'gmc-sierra': { make: 'GMC', model: 'Sierra', type: 'Truck' },

  // Buick
  'buick-enclave': { make: 'Buick', model: 'Enclave', type: 'SUV' },

  // Tesla
  'tesla-model-3': { make: 'Tesla', model: 'Model 3', type: 'Electric Sedan' },
  'tesla-model-y': { make: 'Tesla', model: 'Model Y', type: 'Electric SUV' },
  'tesla-model-s': { make: 'Tesla', model: 'Model S', type: 'Electric Sedan' },
  'tesla-model-x': { make: 'Tesla', model: 'Model X', type: 'Electric SUV' },
  'tesla-cybertruck': { make: 'Tesla', model: 'Cybertruck', type: 'Electric Truck' },
};

async function getLowestPrice(make: string, model: string): Promise<number | null> {
  try {
    const result = await prisma.car.findFirst({
      where: {
        make: { contains: make, mode: 'insensitive' },
        model: { contains: model, mode: 'insensitive' },
        status: 'active',
        salePrice: { gt: 0 },
        dealer: { verificationStatus: 'approved' },
      },
      select: { salePrice: true },
      orderBy: { salePrice: 'asc' },
    });
    return result?.salePrice ?? null;
  } catch {
    return null;
  }
}

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
    title: `New and Used ${make} ${modelName} for Sale`,
    description: `Find the best deals on used ${make} ${modelName}. Compare prices from multiple dealers & save hundreds. Certified pre-owned available. No haggling required. Browse ${make} ${modelName} inventory now.`,
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
      title: `New and Used ${make} ${modelName} for Sale`,
      description: `Shop quality used ${make} ${modelName}. Compare prices from local dealers and save hundreds.`,
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

  const { make, model: modelName, type } = modelData;
  const lowestPrice = await getLowestPrice(make, modelName);

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
            {lowestPrice
              ? `Lowest Priced ${modelName} Available: $${lowestPrice.toLocaleString()} | Vehicle Type: ${type}`
              : `Vehicle Type: ${type}`}
          </p>
          <Link
            href={`/cars?make=${encodeURIComponent(make)}&model=${encodeURIComponent(modelName)}`}
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
                <span>Save hundreds on your {make} {modelName} purchase</span>
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
            href={`/cars?make=${encodeURIComponent(make)}&model=${encodeURIComponent(modelName)}`}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse {make} {modelName} Inventory
          </Link>
        </div>
      </section>

      {/* Browse Make & Buying Guides */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Make Page Link */}
            {(() => {
              const makeSlug = Object.entries(makes).find(([, d]) => d.name.toLowerCase() === make.toLowerCase())?.[0];
              const modelUrlSlug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              return (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Explore {make}</h2>
                  <div className="space-y-4">
                    {makeSlug && (
                      <Link
                        href={`/cars/make/${makeSlug}`}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition"
                      >
                        <span className="font-semibold text-gray-900">Browse all {make} vehicles</span>
                        <ArrowRight className="w-5 h-5 text-blue-600" />
                      </Link>
                    )}
                    {makeSlug && (
                      <Link
                        href={`/cars/make/${makeSlug}/${modelUrlSlug}`}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition"
                      >
                        <span className="font-semibold text-gray-900">Detailed {make} {modelName} buying guide</span>
                        <ArrowRight className="w-5 h-5 text-blue-600" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Buying Guides */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Buying Guides</h2>
              <div className="space-y-4">
                <Link
                  href="/guides/how-to-buy-used-car"
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition"
                >
                  <span className="font-semibold text-gray-900">How to Buy a Used Car</span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
                <Link
                  href="/guides/pre-purchase-inspection"
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition"
                >
                  <span className="font-semibold text-gray-900">Pre-Purchase Inspection Guide</span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
                <Link
                  href="/guides/car-financing-guide"
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition"
                >
                  <span className="font-semibold text-gray-900">Car Financing Guide</span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
                <Link
                  href="/guides/trade-in-value"
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition"
                >
                  <span className="font-semibold text-gray-900">Trade-In Value Guide</span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Models from Same Brand */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Other {make} Models</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(models)
              .filter(([slug, data]) => data.make === make && slug !== modelSlug)
              .slice(0, 6)
              .map(([slug, data]) => (
                <Link
                  key={slug}
                  href={`/models/${slug}`}
                  className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center"
                >
                  <span className="font-semibold text-gray-900">{data.make} {data.model}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Browse by Location Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Find a {make} {modelName} Near You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/locations/atlanta" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Atlanta</span>
            </Link>
            <Link href="/locations/los-angeles" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Los Angeles</span>
            </Link>
            <Link href="/locations/chicago" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Chicago</span>
            </Link>
            <Link href="/locations/houston" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Houston</span>
            </Link>
            <Link href="/locations/phoenix" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Phoenix</span>
            </Link>
            <Link href="/locations/philadelphia" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Philadelphia</span>
            </Link>
            <Link href="/locations/san-antonio" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Antonio</span>
            </Link>
            <Link href="/locations/san-diego" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Diego</span>
            </Link>
            <Link href="/locations/dallas" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Dallas</span>
            </Link>
            <Link href="/locations/denver" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Denver</span>
            </Link>
            <Link href="/locations/seattle" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Seattle</span>
            </Link>
            <Link href="/locations/miami" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Miami</span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/locations" className="text-blue-600 font-semibold hover:underline">
              View All Locations →
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Models Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Other Popular Models</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/models/toyota-tacoma" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota Tacoma</span>
            </Link>
            <Link href="/models/honda-civic" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda Civic</span>
            </Link>
            <Link href="/models/ford-f150" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Ford F-150</span>
            </Link>
            <Link href="/models/chevy-silverado" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Chevy Silverado</span>
            </Link>
            <Link href="/models/jeep-wrangler" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jeep Wrangler</span>
            </Link>
            <Link href="/models/toyota-4runner" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota 4Runner</span>
            </Link>
            <Link href="/models/honda-cr-v" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda CR-V</span>
            </Link>
            <Link href="/models/bmw-x5" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">BMW X5</span>
            </Link>
            <Link href="/models/lexus-rx350" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Lexus RX 350</span>
            </Link>
            <Link href="/models/subaru-outback" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Subaru Outback</span>
            </Link>
            <Link href="/models/kia-telluride" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Kia Telluride</span>
            </Link>
            <Link href="/models/mazda-cx5" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Mazda CX-5</span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/models" className="text-blue-600 font-semibold hover:underline">
              View All Models →
            </Link>
          </div>
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
            ...(lowestPrice
              ? { offers: { '@type': 'AggregateOffer', lowPrice: lowestPrice, highPrice: lowestPrice, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } }
              : {}),
          }),
        }}
      />

      <Footer />
    </div>
  );
}
