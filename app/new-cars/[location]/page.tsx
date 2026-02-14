import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import zipcodes from 'zipcodes';
import Footer from '../../components/Footer';
import { locations } from '@/lib/data/locations';
import { makes } from '@/lib/data/makes';
import { bodyTypes } from '@/lib/data/bodyTypes';
import { ArrowRight, Car, CheckCircle } from 'lucide-react';

// Force static generation for SEO
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return Object.keys(locations).map((location) => ({
    location,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params;
  const locationData = locations[location as keyof typeof locations];

  if (!locationData) {
    return { title: 'Location Not Found' };
  }

  const { city, state, stateCode } = locationData;

  return {
    title: `New Cars in ${city}, ${stateCode} - Best Prices`,
    description: `Shop new cars for sale in ${city}, ${state}. Compare prices from local dealers and save hundreds. Browse new SUVs, trucks, sedans and more from certified ${city} dealers.`,
    keywords: [
      `new cars ${city}`,
      `new cars for sale ${city}`,
      `new car dealers ${city}`,
      `new cars ${city} ${stateCode}`,
      `buy new car ${city}`,
      `new car dealerships ${city}`,
      `2026 cars ${city}`,
      `new SUVs ${city}`,
      `new trucks ${city}`,
    ],
    openGraph: {
      title: `New Cars in ${city}, ${stateCode}`,
      description: `Shop new cars in ${city}. Compare prices from local dealers and save hundreds.`,
      url: `https://iqautodeals.com/new-cars/${location}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/new-cars/${location}`,
    },
  };
}

export default async function NewCarsLocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const locationData = locations[location as keyof typeof locations];

  if (!locationData) {
    notFound();
  }

  const { city, state, stateCode } = locationData;
  const zip = zipcodes.lookupByName(city, state)?.[0]?.zip;
  const newCarsHref = zip ? `/cars?condition=new&zipCode=${zip}` : '/cars?condition=new';
  const popularMakes = ['toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'jeep', 'hyundai', 'kia', 'bmw', 'lexus', 'mazda', 'subaru'];

  return (
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

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
            <li className="text-text-secondary">/</li>
            <li><Link href="/new-cars" className="text-primary hover:text-primary-dark">New Cars</Link></li>
            <li className="text-text-secondary">/</li>
            <li className="text-text-primary">{city}, {stateCode}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New Cars for Sale in {city}, {stateCode}
            </h1>
            <p className="text-xl mb-4 text-white/90">
              Shop Brand New Vehicles from Certified {city} Dealers
            </p>
            <p className="text-lg mb-8 text-white/80">
              Compare prices from multiple dealers and save hundreds on your new car
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={newCarsHref}
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
              >
                <Car className="w-5 h-5" />
                Browse New Cars in {city}
              </Link>
              <Link
                href="/new-cars"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30"
              >
                All New Cars
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Body Type */}
      <section className="bg-black py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular New Car Types in {city}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(bodyTypes).slice(0, 10).map(([slug, data]) => (
              <Link
                key={slug}
                href={`/new-cars/${location}/${slug}`}
                className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all"
              >
                New {data.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Buy a New Car in {city}?</h2>
              <p className="text-text-secondary mb-6">
                {city}, {state} is home to numerous certified new car dealers offering competitive prices
                on the latest models. IQ Auto Deals helps you compare offers from multiple {city} dealers
                to ensure you get the best deal.
              </p>
              <ul className="space-y-4">
                {[
                  `Compare prices from multiple ${city} dealers`,
                  'Full manufacturer warranty on all new vehicles',
                  'Save hundreds through dealer competition',
                  'Access to latest manufacturer incentives',
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
                  { num: 1, title: 'Browse New Inventory', desc: `Search new vehicles from certified ${city} dealers.` },
                  { num: 2, title: 'Dealers Compete', desc: 'Multiple dealers bid on your selected vehicles to win your business.' },
                  { num: 3, title: 'Save Hundreds', desc: 'Choose the best offer and drive away in your new car for less.' },
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

      {/* Browse by Make */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">New Cars by Make in {city}</h2>
            <Link href="/new-cars/make/toyota" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularMakes.map((makeSlug) => {
              const make = makes[makeSlug as keyof typeof makes];
              if (!make) return null;
              return (
                <Link
                  key={makeSlug}
                  href={`/new-cars/make/${makeSlug}`}
                  className="bg-white p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary">New {make.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other Cities in State */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">New Cars in Other {state} Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(locations)
              .filter(([slug, data]) => data.state === state && slug !== location)
              .slice(0, 12)
              .map(([slug, data]) => (
                <Link
                  key={slug}
                  href={`/new-cars/${slug}`}
                  className="bg-light-dark p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary">{data.city}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your New Car in {city}?</h2>
            <p className="text-xl mb-8 text-white/90">
              Browse new vehicles and let {city} dealers compete for your business
            </p>
            <Link
              href={newCarsHref}
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg"
            >
              <Car className="w-5 h-5" />
              Browse New Car Inventory
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
            '@type': 'AutoDealer',
            name: `IQ Auto Deals - New Cars in ${city}`,
            description: `Shop new cars for sale in ${city}, ${state}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: city,
              addressRegion: stateCode,
              addressCountry: 'US',
            },
            areaServed: {
              '@type': 'City',
              name: city,
            },
          }),
        }}
      />

      <Footer />
    </div>
  );
}
