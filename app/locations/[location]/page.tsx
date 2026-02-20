import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import zipcodes from 'zipcodes';
import Footer from '../../components/Footer';
import { locations } from '@/lib/data/locations';
import { fetchInventoryForLocation, type InventoryResult } from '@/lib/inventory';
import ItemListSchema from '@/app/components/ItemListSchema';
import CarsClient from '@/app/cars/CarsClient';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params;
  const locationData = locations[location as keyof typeof locations];

  if (!locationData) {
    return {
      title: 'Location Not Found',
    };
  }

  const { city, state, stateCode } = locationData;

  return {
    title: `New and Used Cars in ${city}, ${stateCode}`,
    description: `Browse quality used cars for sale in ${city}, ${state}. Compare dealer prices instantly. Save. No haggling required. Browse SUVs, trucks, sedans & certified pre-owned vehicles now.`,
    keywords: [
      `used cars ${city}`,
      `used cars for sale ${city}`,
      `car dealers ${city}`,
      `used cars ${city} ${stateCode}`,
      `buy used cars ${city}`,
      `certified pre-owned ${city}`,
      `used SUVs ${city}`,
      `used trucks ${city}`,
      `used sedans ${city}`,
      `car dealerships ${city}`,
      `best used car deals ${city}`,
      `affordable cars ${city}`,
    ],
    openGraph: {
      title: `New and Used Cars in ${city}, ${stateCode}`,
      description: `Shop quality used cars in ${city}. Compare prices from local dealers and save.`,
      url: `https://iqautodeals.com/locations/${location}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/locations/${location}`,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const locationData = locations[location as keyof typeof locations];

  if (!locationData) {
    notFound();
  }

  const { city, state, stateCode } = locationData;
  const zip = zipcodes.lookupByName(city, state)?.[0]?.zip;
  const carsHref = zip ? `/cars?zipCode=${zip}` : '/cars';

  // Fetch real inventory from DB
  let inventory: InventoryResult = { cars: [], totalCount: 0, scope: 'city', scopeLabel: `in ${city}, ${stateCode}` };
  try {
    inventory = await fetchInventoryForLocation({ city, stateCode });
  } catch {}

  return (
    <div className="min-h-screen bg-white">
      <ItemListSchema cars={inventory.cars} listName={`Cars for Sale in ${city}, ${stateCode}`} />

      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading inventory...</div></div>}>
        <CarsClient
          pageTitle={`Used Cars for Sale in ${city}, ${stateCode}`}
          pageSubtitle={`Shop Quality Pre-Owned Vehicles from Trusted Dealers in ${city}, ${state}`}
          initialZipCode={zip}
          showFooter={false}
        />
      </Suspense>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Buy a Used Car in {city}?</h2>
            <p className="text-gray-700 mb-4">
              IQ Auto Deals makes it easy to find quality used cars for sale in {city}, {state}.
              Our platform connects you with trusted local dealers who compete to offer you the best price.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you're looking for a reliable sedan, a spacious SUV, or a powerful truck,
              you'll find exactly what you need from dealers right here in {city}.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Compare prices from multiple dealers in {city}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Get instant offers on certified pre-owned vehicles</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Save on your next vehicle</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Transparent pricing from trusted local dealers</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Select Your Cars</h3>
                  <p className="text-gray-700">Browse quality used cars from dealers in {city} and add to your deal list.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Dealers Compete</h3>
                  <p className="text-gray-700">Local {city} dealers bid on your selected vehicles to win your business.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">You Save Money</h3>
                  <p className="text-gray-700">Choose the best offer and save on your next vehicle purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Vehicle Types */}
        <div className="mb-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
          <h2 className="text-3xl font-bold mb-8">Popular Used Vehicles in {city}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Used SUVs in {city}</h3>
              <p className="text-gray-700 mb-4">
                Find spacious and reliable SUVs perfect for {city} roads and {state} adventures.
              </p>
              <Link href={zip ? `/cars?zipCode=${zip}&bodyType=SUV` : '/cars?bodyType=SUV'} className="text-blue-600 font-semibold hover:underline">
                Browse SUVs →
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Used Sedans in {city}</h3>
              <p className="text-gray-700 mb-4">
                Discover fuel-efficient and comfortable sedans from top brands available in {city}.
              </p>
              <Link href={zip ? `/cars?zipCode=${zip}&bodyType=Sedan` : '/cars?bodyType=Sedan'} className="text-blue-600 font-semibold hover:underline">
                Browse Sedans →
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Used Trucks in {city}</h3>
              <p className="text-gray-700 mb-4">
                Powerful trucks for work or play, available from trusted dealers in {city}, {stateCode}.
              </p>
              <Link href={zip ? `/cars?zipCode=${zip}&bodyType=Truck` : '/cars?bodyType=Truck'} className="text-blue-600 font-semibold hover:underline">
                Browse Trucks →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-lg p-8 text-center" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car in {city}?</h2>
          <p className="text-xl text-gray-700 mb-6">
            Browse quality used cars from trusted dealers in {city}, {state}.
          </p>
          <Link
            href={zip ? `/cars?zipCode=${zip}` : '/cars'}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Inventory
          </Link>
        </div>
      </section>

      {/* Browse Popular Models Section */}
      <section className="bg-gray-50 py-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Used Cars in {city}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/models/toyota-tacoma" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota Tacoma</span>
            </Link>
            <Link href="/models/toyota-4runner" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota 4Runner</span>
            </Link>
            <Link href="/models/honda-civic" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda Civic</span>
            </Link>
            <Link href="/models/honda-cr-v" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda CR-V</span>
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
            <Link href="/models/jeep-grand-cherokee" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jeep Grand Cherokee</span>
            </Link>
            <Link href="/models/toyota-rav4" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota RAV4</span>
            </Link>
            <Link href="/models/honda-pilot" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda Pilot</span>
            </Link>
            <Link href="/models/bmw-x5" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">BMW X5</span>
            </Link>
            <Link href="/models/lexus-rx350" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Lexus RX 350</span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/models" className="text-blue-600 font-semibold hover:underline">
              View All Models →
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Cities Section */}
      <section className="py-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Used Cars in Other {state} Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(locations)
              .filter(([slug, data]) => data.state === state && slug !== location)
              .slice(0, 12)
              .map(([slug, data]) => (
                <Link
                  key={slug}
                  href={`/locations/${slug}`}
                  className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center"
                >
                  <span className="font-semibold text-gray-900">{data.city}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Browse Other Major Cities */}
      <section className="bg-gray-50 py-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse Used Cars in Major Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/locations/atlanta" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Atlanta</span>
            </Link>
            <Link href="/locations/los-angeles" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Los Angeles</span>
            </Link>
            <Link href="/locations/chicago" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Chicago</span>
            </Link>
            <Link href="/locations/houston" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Houston</span>
            </Link>
            <Link href="/locations/phoenix" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Phoenix</span>
            </Link>
            <Link href="/locations/philadelphia" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Philadelphia</span>
            </Link>
            <Link href="/locations/san-antonio" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Antonio</span>
            </Link>
            <Link href="/locations/san-diego" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Diego</span>
            </Link>
            <Link href="/locations/dallas" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Dallas</span>
            </Link>
            <Link href="/locations/san-jose" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Jose</span>
            </Link>
            <Link href="/locations/austin" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Austin</span>
            </Link>
            <Link href="/locations/jacksonville" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jacksonville</span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/locations" className="text-blue-600 font-semibold hover:underline">
              View All Locations →
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
            '@type': 'Service',
            '@id': `https://iqautodeals.com/locations/${location}`,
            name: `IQ Auto Deals - ${city}, ${stateCode}`,
            description: `Used car marketplace connecting buyers with dealers in ${city}, ${state}`,
            serviceType: 'Online Automotive Marketplace',
            address: {
              '@type': 'PostalAddress',
              addressLocality: city,
              addressRegion: stateCode,
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: locationData.lat,
              longitude: locationData.lng,
            },
            url: `https://iqautodeals.com/locations/${location}`,
            areaServed: {
              '@type': 'City',
              name: city,
              containedIn: {
                '@type': 'State',
                name: state,
              },
            },
          }),
        }}
      />

      <Footer />
    </div>
  );
}
