import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../components/Footer';
import { Header } from '@/components/Header';
import { locations } from '@/lib/data/locations';
import { makes } from '@/lib/data/makes';
import { models } from '@/lib/data/models';
import { ArrowRight, Car, CheckCircle, MapPin } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Trucks for Sale Near Me - Find New & Used Trucks | IQ Auto Deals',
  description: 'Find trucks for sale near you. Browse new and used trucks from Ford, RAM, Chevrolet, GMC, Toyota, and more. Compare prices from certified dealers and save on your next truck.',
  keywords: [
    'trucks for sale near me',
    'trucks for sale',
    'used trucks near me',
    'new trucks near me',
    'pickup trucks for sale',
    'trucks for sale in my area',
    'buy a truck near me',
    'ford trucks for sale near me',
    'ram trucks for sale near me',
    'chevy trucks for sale near me',
    'cheap trucks for sale near me',
  ],
  openGraph: {
    title: 'Trucks for Sale Near Me',
    description: 'Find new and used trucks for sale near you. Compare prices from certified dealers.',
    url: 'https://iqautodeals.com/trucks-for-sale-near-me',
  },
  alternates: {
    canonical: 'https://iqautodeals.com/trucks-for-sale-near-me',
  },
};

// Truck makes with their dedicated pages
const truckMakes = [
  { slug: 'ford', name: 'Ford', tagline: 'F-150, Raptor' },
  { slug: 'ram', name: 'RAM', tagline: '1500, 2500, 3500' },
  { slug: 'chevrolet', name: 'Chevrolet', tagline: 'Silverado, Colorado' },
  { slug: 'gmc', name: 'GMC', tagline: 'Sierra' },
  { slug: 'toyota', name: 'Toyota', tagline: 'Tacoma, Tundra' },
  { slug: 'nissan', name: 'Nissan', tagline: 'Frontier, Titan' },
  { slug: 'honda', name: 'Honda', tagline: 'Ridgeline' },
  { slug: 'jeep', name: 'Jeep', tagline: 'Gladiator' },
];

export default function TrucksForSaleNearMePage() {
  // Organize locations by state
  const locationsByState: Record<string, { slug: string; city: string; stateCode: string }[]> = {};
  Object.entries(locations).forEach(([slug, loc]) => {
    const state = loc.stateCode;
    if (!locationsByState[state]) locationsByState[state] = [];
    locationsByState[state].push({ slug, city: loc.city, stateCode: loc.stateCode });
  });
  const sortedStates = Object.keys(locationsByState).sort();

  const popularLocations = ['atlanta', 'miami', 'houston', 'dallas', 'chicago', 'los-angeles', 'phoenix', 'denver', 'seattle', 'orlando', 'tampa', 'charlotte', 'san-antonio', 'new-york', 'philadelphia', 'detroit'];

  // All truck models
  const truckModels = Object.entries(models).filter(([, d]) => d.type === 'truck');

  return (
    <div className="min-h-screen bg-light-dark font-sans">
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
            <li className="text-text-secondary">/</li>
            <li className="text-text-primary">Trucks for Sale Near Me</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trucks for Sale Near Me
            </h1>
            <p className="text-xl mb-4 text-white/90">
              Find New and Used Trucks from Certified Dealers in Your Area
            </p>
            <p className="text-lg mb-8 text-white/80">
              Browse Ford, RAM, Chevrolet, GMC, Toyota trucks and more. Compare prices and save.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars?bodyType=Truck"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
              >
                <Car className="w-5 h-5" />
                Browse All Trucks
              </Link>
              <Link
                href="/cars-for-sale-near-me"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30"
              >
                All Cars for Sale
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Trucks by Make */}
      <section className="bg-black py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Shop Trucks by Make</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {truckMakes.map((tm) => (
              <Link
                key={tm.slug}
                href={`/new-cars/make/${tm.slug}/truck`}
                className="bg-white/10 hover:bg-primary p-5 rounded-card text-center transition-all"
              >
                <span className="font-bold text-white text-lg block">{tm.name} Trucks</span>
                <span className="text-white/60 text-sm">{tm.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Truck Models */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Popular Truck Models</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {truckModels.map(([slug, data]) => {
              const makeSlug = Object.entries(makes).find(
                ([, m]) => m.name.toLowerCase() === data.brand.toLowerCase()
              )?.[0];
              return (
                <Link
                  key={slug}
                  href={makeSlug ? `/new-cars/make/${makeSlug}/${slug.split('-').slice(1).join('-') || slug}` : `/models/${slug}`}
                  className="bg-light-dark p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary">{data.fullName}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trucks by City */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">
              <MapPin className="w-6 h-6 inline-block mr-2 text-primary" />
              Trucks for Sale in Popular Cities
            </h2>
            <Link href="/locations" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
              All Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularLocations.map((locationSlug) => {
              const location = locations[locationSlug as keyof typeof locations];
              if (!location) return null;
              return (
                <Link
                  key={locationSlug}
                  href={`/locations/${locationSlug}/truck`}
                  className="bg-white p-5 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all"
                >
                  <span className="font-semibold text-text-primary block">Trucks in {location.city}</span>
                  <span className="text-text-secondary text-sm">{location.city}, {location.stateCode}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Buy a Truck */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Buy a Truck?</h2>
              <p className="text-text-secondary mb-6">
                Trucks are the most versatile vehicles on the road. Whether you need a work truck for the job site,
                a family hauler for weekend adventures, or a powerful tow vehicle, there is a truck for every need and budget.
              </p>
              <ul className="space-y-4">
                {[
                  'Powerful towing and hauling capability',
                  'Versatile for work, family, and adventure',
                  'Strong resale value — trucks hold their worth',
                  'Available in full-size, mid-size, and compact',
                  'Latest tech: adaptive cruise, lane assist, and more',
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
                  { num: 1, title: 'Search Trucks Near You', desc: 'Browse new and used trucks from certified dealers in your area.' },
                  { num: 2, title: 'Select Up to 4 Trucks', desc: 'Pick your favorite trucks and submit them to dealers.' },
                  { num: 3, title: 'Dealers Compete', desc: 'Multiple dealers send you their best offers on your selected trucks.' },
                  { num: 4, title: 'Save Money', desc: 'Choose the best deal and drive away in your new truck for less.' },
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

      {/* All Locations by State */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Trucks for Sale by State</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedStates.map((state) => (
              <div key={state}>
                <h3 className="font-bold text-text-primary mb-2">{state}</h3>
                <ul className="space-y-1">
                  {locationsByState[state].map((loc) => (
                    <li key={loc.slug}>
                      <Link href={`/locations/${loc.slug}/truck`} className="text-primary hover:text-primary-dark text-sm">
                        Trucks in {loc.city}, {loc.stateCode}
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
            <h2 className="text-3xl font-bold mb-4">Find Your Next Truck Today</h2>
            <p className="text-xl mb-8 text-white/90">
              Browse thousands of trucks for sale near you and let dealers compete for your business
            </p>
            <Link
              href="/cars?bodyType=Truck"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg"
            >
              <Car className="w-5 h-5" />
              Browse Trucks
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
            name: 'Trucks for Sale Near Me',
            description: 'Find new and used trucks for sale near you from certified dealers.',
            url: 'https://iqautodeals.com/trucks-for-sale-near-me',
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
