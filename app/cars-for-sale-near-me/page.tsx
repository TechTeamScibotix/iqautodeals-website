import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../components/Footer';
import { Header } from '@/components/Header';
import { locations } from '@/lib/data/locations';
import { makes } from '@/lib/data/makes';
import { bodyTypes } from '@/lib/data/bodyTypes';
import { ArrowRight, Car, CheckCircle, MapPin } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Cars for Sale Near Me - Find New & Used Cars | IQ Auto Deals',
  description: 'Find cars for sale near you. Browse thousands of new and used cars from certified dealers in your area. Compare prices, get competing offers, and save on your next car purchase.',
  keywords: [
    'cars for sale near me',
    'cars for sale',
    'used cars near me',
    'new cars near me',
    'cars for sale in my area',
    'buy a car near me',
    'local car dealers',
    'car dealerships near me',
    'cheap cars for sale near me',
    'certified used cars near me',
  ],
  openGraph: {
    title: 'Cars for Sale Near Me',
    description: 'Find new and used cars for sale near you. Compare prices from certified dealers.',
    url: 'https://iqautodeals.com/cars-for-sale-near-me',
  },
  alternates: {
    canonical: 'https://iqautodeals.com/cars-for-sale-near-me',
  },
};

export default function CarsForSaleNearMePage() {
  // Organize locations by state
  const locationsByState: Record<string, { slug: string; city: string; stateCode: string }[]> = {};
  Object.entries(locations).forEach(([slug, loc]) => {
    const state = loc.stateCode;
    if (!locationsByState[state]) locationsByState[state] = [];
    locationsByState[state].push({ slug, city: loc.city, stateCode: loc.stateCode });
  });
  const sortedStates = Object.keys(locationsByState).sort();

  const popularLocations = ['atlanta', 'miami', 'houston', 'dallas', 'chicago', 'los-angeles', 'phoenix', 'denver', 'seattle', 'orlando', 'tampa', 'charlotte', 'san-antonio', 'new-york', 'philadelphia', 'detroit'];
  const popularMakes = ['toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'jeep', 'hyundai', 'kia', 'bmw', 'mercedes-benz', 'ram', 'gmc'];
  const popularBodyTypes = ['suv', 'sedan', 'truck', 'coupe', 'minivan', 'luxury', 'electric'];

  return (
    <div className="min-h-screen bg-light-dark font-sans">
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
            <li className="text-text-secondary">/</li>
            <li className="text-text-primary">Cars for Sale Near Me</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cars for Sale Near Me
            </h1>
            <p className="text-xl mb-4 text-white/90">
              Find New and Used Cars from Certified Dealers in Your Area
            </p>
            <p className="text-lg mb-8 text-white/80">
              Browse thousands of vehicles, compare prices, and let dealers compete for your business
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
              >
                <Car className="w-5 h-5" />
                Browse All Cars
              </Link>
              <Link
                href="/trucks-for-sale-near-me"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30"
              >
                Trucks for Sale
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Type */}
      <section className="bg-black py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Find Cars by Type</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {popularBodyTypes.map((btSlug) => {
              const bt = bodyTypes[btSlug as keyof typeof bodyTypes];
              if (!bt) return null;
              return (
                <Link
                  key={btSlug}
                  href={`/cars?bodyType=${encodeURIComponent(bt.singular)}`}
                  className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all"
                >
                  {bt.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">
              <MapPin className="w-6 h-6 inline-block mr-2 text-primary" />
              Cars for Sale in Popular Cities
            </h2>
            <Link href="/locations" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
              All Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {popularLocations.map((locationSlug) => {
              const location = locations[locationSlug as keyof typeof locations];
              if (!location) return null;
              return (
                <Link
                  key={locationSlug}
                  href={`/locations/${locationSlug}`}
                  className="bg-light-dark p-5 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all"
                >
                  <span className="font-semibold text-text-primary block">Cars for Sale in {location.city}</span>
                  <span className="text-text-secondary text-sm">{location.city}, {location.stateCode}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why IQ Auto Deals */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Use IQ Auto Deals to Find Cars Near You?</h2>
              <p className="text-text-secondary mb-6">
                IQ Auto Deals is a nationwide online car marketplace that connects you with certified dealers in your area.
                Instead of visiting multiple dealerships, browse inventory from the comfort of your home and let dealers
                compete to offer you the best price.
              </p>
              <ul className="space-y-4">
                {[
                  'Browse new and used cars from certified dealers',
                  'Compare prices from multiple dealers at once',
                  'Dealers compete for your business — you save money',
                  'No pressure, no haggling — transparent pricing',
                  'Nationwide inventory from trusted dealerships',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">How It Works</h2>
              <div className="space-y-6">
                {[
                  { num: 1, title: 'Search Cars Near You', desc: 'Enter your location to find cars from certified dealers in your area.' },
                  { num: 2, title: 'Select Up to 4 Vehicles', desc: 'Pick your favorite vehicles and submit them to dealers.' },
                  { num: 3, title: 'Dealers Compete', desc: 'Multiple dealers send you their best offers on your selected cars.' },
                  { num: 4, title: 'Save Money', desc: 'Choose the best deal and drive away in your new car for less.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">{step.title}</h3>
                      <p className="text-text-secondary text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Make */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Cars for Sale by Make</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularMakes.map((makeSlug) => {
              const make = makes[makeSlug as keyof typeof makes];
              if (!make) return null;
              return (
                <Link
                  key={makeSlug}
                  href={`/new-cars/make/${makeSlug}`}
                  className="bg-light-dark p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary">{make.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Locations by State */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Cars for Sale by State</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedStates.map((state) => (
              <div key={state}>
                <h3 className="font-bold text-text-primary mb-2">{state}</h3>
                <ul className="space-y-1">
                  {locationsByState[state].map((loc) => (
                    <li key={loc.slug}>
                      <Link href={`/locations/${loc.slug}`} className="text-primary hover:text-primary-dark text-sm">
                        Cars in {loc.city}, {loc.stateCode}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Find Your Next Car Today</h2>
            <p className="text-xl mb-8 text-white/90">
              Browse thousands of cars for sale near you and let dealers compete for your business
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg"
            >
              <Car className="w-5 h-5" />
              Start Browsing
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
            '@type': 'CollectionPage',
            name: 'Cars for Sale Near Me',
            description: 'Find new and used cars for sale near you from certified dealers.',
            url: 'https://iqautodeals.com/cars-for-sale-near-me',
            isPartOf: {
              '@type': 'WebSite',
              name: 'IQ Auto Deals',
              url: 'https://iqautodeals.com',
            },
          }),
        }}
      />

      <Footer />
    </div>
  );
}
