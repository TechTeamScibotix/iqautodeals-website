import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../components/Footer';
import { locations } from '@/lib/data/locations';
import { makes } from '@/lib/data/makes';
import Image from 'next/image';
import { ArrowRight, Sparkles, TrendingDown, Car, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Cars for Sale (2025) - Compare Prices from Local Dealers',
  description: 'Shop new cars for sale from certified dealers nationwide. Compare prices, get competing offers, and save hundreds on your new vehicle purchase. Browse new SUVs, trucks, sedans and more.',
  keywords: [
    'new cars for sale',
    'new car deals',
    'new car prices',
    'buy new car online',
    'new car dealers near me',
    'new cars 2025',
    '2025 new cars',
    'new car specials',
    'new car inventory',
    'compare new car prices',
  ],
  openGraph: {
    title: 'New Cars for Sale - Compare Dealer Prices',
    description: 'Shop new cars from certified dealers. Compare prices and save hundreds on your new vehicle.',
    url: 'https://iqautodeals.com/new-cars',
  },
  alternates: {
    canonical: 'https://iqautodeals.com/new-cars',
  },
};

export default function NewCarsPage() {
  const popularLocations = ['atlanta', 'miami', 'houston', 'dallas', 'chicago', 'los-angeles', 'phoenix', 'denver', 'seattle', 'orlando', 'tampa', 'charlotte'];
  const popularMakes = ['toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'jeep', 'hyundai', 'kia', 'bmw', 'mercedes-benz', 'audi', 'lexus'];
  const bodyTypes = ['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Minivan', 'Wagon', 'Van', 'Crossover'];

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New Cars for Sale
            </h1>
            <p className="text-xl mb-4 text-white/90">
              Shop Brand New Vehicles from Certified Dealers Nationwide
            </p>
            <p className="text-lg mb-8 text-white/80">
              Compare prices from multiple dealers and save hundreds on your new car purchase
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars?condition=new"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
              >
                <Car className="w-5 h-5" />
                Browse New Car Inventory
              </Link>
              <Link
                href="/new-cars/deals"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30"
              >
                View New Car Deals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Body Type */}
      <section className="bg-black py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Browse New Cars by Type</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {bodyTypes.map((type) => (
              <Link
                key={type}
                href={`/cars?condition=new&bodyType=${encodeURIComponent(type)}`}
                className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all"
              >
                {type}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <Link
              href="/cars?condition=new&fuelType=Electric"
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/20 hover:bg-accent hover:text-white rounded-pill font-medium text-accent transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Electric
            </Link>
            <Link
              href="/cars?condition=new&fuelType=Hybrid"
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/20 hover:bg-accent hover:text-white rounded-pill font-medium text-accent transition-all"
            >
              <TrendingDown className="w-4 h-4" />
              Hybrid
            </Link>
          </div>
        </div>
      </section>

      {/* Why Buy New Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Buy a New Car?</h2>
              <p className="text-text-secondary mb-6">
                Buying a new car offers peace of mind with the latest safety features, full manufacturer warranties,
                and the newest technology. IQ Auto Deals connects you with certified dealers who compete to offer
                you the best price on brand new vehicles.
              </p>
              <ul className="space-y-4">
                {[
                  'Full manufacturer warranty coverage',
                  'Latest safety features and technology',
                  'Better financing rates for new vehicles',
                  'No hidden history or previous damage',
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
                  { num: 1, title: 'Browse New Inventory', desc: 'Search thousands of new vehicles from certified dealers across the country.' },
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

      {/* Shop by Make */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Shop New Cars by Make</h2>
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
                  <span className="font-semibold text-text-primary">{make.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Find by Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Find New Cars Near You</h2>
            <Link href="/locations" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
              All Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularLocations.map((locationSlug) => {
              const location = locations[locationSlug as keyof typeof locations];
              if (!location) return null;
              return (
                <Link
                  key={locationSlug}
                  href={`/new-cars/${locationSlug}`}
                  className="bg-light-dark p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary">{location.city}, {location.stateCode}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your New Car?</h2>
            <p className="text-xl mb-8 text-white/90">
              Browse thousands of new vehicles and let dealers compete for your business
            </p>
            <Link
              href="/cars?condition=new"
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
            '@type': 'WebPage',
            name: 'New Cars for Sale',
            description: 'Shop new cars for sale from certified dealers nationwide. Compare prices and save.',
            url: 'https://iqautodeals.com/new-cars',
          }),
        }}
      />

      <Footer />
    </div>
  );
}
