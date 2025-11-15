import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Used Cars by Make & Model - Browse Popular Vehicles | IQ Auto Deals',
  description: 'Shop used cars by make and model. Find quality pre-owned vehicles from top brands including Toyota, Honda, Ford, Chevrolet, and more. Compare prices from trusted dealers.',
  keywords: ['used cars by model', 'used Toyota', 'used Honda', 'used Ford', 'used Chevrolet', 'popular used cars'],
};

const modelsByMake = {
  'Toyota': [
    { slug: 'toyota-tacoma', name: 'Tacoma' },
    { slug: 'toyota-tundra', name: 'Tundra' },
    { slug: 'toyota-4runner', name: '4Runner' },
    { slug: 'toyota-camry', name: 'Camry' },
    { slug: 'toyota-prius', name: 'Prius' },
    { slug: 'toyota-rav4', name: 'RAV4' },
    { slug: 'toyota-sienna', name: 'Sienna' },
    { slug: 'toyota-sequoia', name: 'Sequoia' },
  ],
  'Honda': [
    { slug: 'honda-civic', name: 'Civic' },
    { slug: 'honda-accord', name: 'Accord' },
    { slug: 'honda-cr-v', name: 'CR-V' },
    { slug: 'honda-pilot', name: 'Pilot' },
    { slug: 'honda-passport', name: 'Passport' },
    { slug: 'honda-odyssey', name: 'Odyssey' },
    { slug: 'honda-ridgeline', name: 'Ridgeline' },
  ],
  'Ford': [
    { slug: 'ford-f150', name: 'F-150' },
    { slug: 'ford-explorer', name: 'Explorer' },
    { slug: 'ford-expedition', name: 'Expedition' },
    { slug: 'ford-fusion', name: 'Fusion' },
    { slug: 'ford-raptor', name: 'Raptor' },
  ],
  'Chevrolet': [
    { slug: 'chevy-silverado', name: 'Silverado' },
    { slug: 'chevy-equinox', name: 'Equinox' },
    { slug: 'chevy-tahoe', name: 'Tahoe' },
    { slug: 'chevy-suburban', name: 'Suburban' },
    { slug: 'chevy-colorado', name: 'Colorado' },
    { slug: 'chevy-malibu', name: 'Malibu' },
    { slug: 'chevy-camaro', name: 'Camaro' },
  ],
  'Jeep': [
    { slug: 'jeep-wrangler', name: 'Wrangler' },
    { slug: 'jeep-grand-cherokee', name: 'Grand Cherokee' },
    { slug: 'jeep-cherokee', name: 'Cherokee' },
    { slug: 'jeep-gladiator', name: 'Gladiator' },
    { slug: 'jeep-renegade', name: 'Renegade' },
  ],
  'BMW': [
    { slug: 'bmw-x3', name: 'X3' },
    { slug: 'bmw-x5', name: 'X5' },
    { slug: 'bmw-3-series', name: '3 Series' },
    { slug: 'bmw-m4', name: 'M4' },
  ],
  'Mazda': [
    { slug: 'mazda-cx5', name: 'CX-5' },
    { slug: 'mazda-miata', name: 'Miata' },
  ],
  'Nissan': [
    { slug: 'nissan-pathfinder', name: 'Pathfinder' },
    { slug: 'nissan-altima', name: 'Altima' },
  ],
  'Dodge': [
    { slug: 'dodge-durango', name: 'Durango' },
    { slug: 'dodge-charger', name: 'Charger' },
    { slug: 'dodge-challenger', name: 'Challenger' },
  ],
  'Subaru': [
    { slug: 'subaru-outback', name: 'Outback' },
    { slug: 'subaru-forester', name: 'Forester' },
    { slug: 'subaru-wrx', name: 'WRX' },
  ],
  'Kia': [
    { slug: 'kia-telluride', name: 'Telluride' },
    { slug: 'kia-stinger', name: 'Stinger' },
    { slug: 'kia-carnival', name: 'Carnival' },
  ],
  'Hyundai': [
    { slug: 'hyundai-sonata', name: 'Sonata' },
    { slug: 'hyundai-tucson', name: 'Tucson' },
    { slug: 'hyundai-santa-fe', name: 'Santa Fe' },
  ],
  'Audi': [
    { slug: 'audi-q5', name: 'Q5' },
    { slug: 'audi-a4', name: 'A4' },
  ],
  'Volkswagen': [
    { slug: 'volkswagen-tiguan', name: 'Tiguan' },
    { slug: 'volkswagen-atlas', name: 'Atlas' },
  ],
  'GMC': [
    { slug: 'gmc-acadia', name: 'Acadia' },
    { slug: 'gmc-sierra', name: 'Sierra' },
  ],
  'Other': [
    { slug: 'ram-1500', name: 'Ram 1500' },
    { slug: 'mercedes-g-wagon', name: 'Mercedes G-Wagon' },
    { slug: 'lexus-rx350', name: 'Lexus RX 350' },
    { slug: 'buick-enclave', name: 'Buick Enclave' },
  ],
};

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Shop Used Cars by Make & Model
          </h1>
          <p className="text-xl mb-8">
            Find your perfect vehicle from top brands. Compare prices and save thousands.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Models Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Browse by Make & Model</h2>
          <p className="text-xl text-gray-700">
            Select your preferred brand and model to view available inventory
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(modelsByMake).map(([make, models]) => (
            <div key={make} className="border-b border-gray-200 pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">{make}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {models.map((model) => (
                  <Link
                    key={model.slug}
                    href={`/models/${model.slug}`}
                    className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition group"
                  >
                    <span className="text-gray-900 group-hover:text-blue-600 font-medium">
                      {make} {model.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
