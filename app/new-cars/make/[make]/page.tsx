import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '../../../components/Footer';
import { makes } from '@/lib/data/makes';
import { models } from '@/lib/data/models';
import { locations } from '@/lib/data/locations';
import { ArrowRight, Car, CheckCircle } from 'lucide-react';

// Force static generation for SEO
export const dynamic = 'force-static';

// Helper to convert model name to URL-friendly slug
function modelNameToSlug(modelName: string): string {
  return modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function generateStaticParams() {
  return Object.keys(makes).map((make) => ({
    make,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make: makeSlug } = await params;
  const makeData = makes[makeSlug as keyof typeof makes];

  if (!makeData) {
    return { title: 'Make Not Found' };
  }

  const { name } = makeData;

  return {
    title: `New ${name} for Sale (2025) - Compare Prices from Local Dealers`,
    description: `Shop new ${name} vehicles for sale. Compare prices from certified ${name} dealers and save hundreds. Browse new ${name} SUVs, trucks, sedans and more. Full warranty included.`,
    keywords: [
      `new ${name.toLowerCase()}`,
      `new ${name.toLowerCase()} for sale`,
      `${name.toLowerCase()} dealers`,
      `2025 ${name.toLowerCase()}`,
      `buy new ${name.toLowerCase()}`,
      `${name.toLowerCase()} dealerships`,
      `new ${name.toLowerCase()} prices`,
      `${name.toLowerCase()} deals`,
    ],
    openGraph: {
      title: `New ${name} for Sale`,
      description: `Shop new ${name} vehicles. Compare prices from dealers and save hundreds.`,
      url: `https://iqautodeals.com/new-cars/make/${makeSlug}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/new-cars/make/${makeSlug}`,
    },
  };
}

export default async function NewCarsMakePage({ params }: { params: Promise<{ make: string }> }) {
  const { make: makeSlug } = await params;
  const makeData = makes[makeSlug as keyof typeof makes];

  if (!makeData) {
    notFound();
  }

  const { name, country } = makeData;

  // Get models for this make
  const makeModels = Object.entries(models).filter(
    ([, data]) => data.brand.toLowerCase() === name.toLowerCase()
  );

  const popularLocations = ['atlanta', 'miami', 'houston', 'dallas', 'chicago', 'los-angeles', 'phoenix', 'denver', 'seattle', 'orlando', 'tampa', 'charlotte'];

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
            <li className="text-text-primary">{name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New {name} for Sale
            </h1>
            <p className="text-xl mb-4 text-white/90">
              Shop Brand New {name} Vehicles from Certified Dealers
            </p>
            <p className="text-lg mb-8 text-white/80">
              Compare prices and save hundreds on your new {name}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars?condition=new"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
              >
                <Car className="w-5 h-5" />
                Browse New {name} Inventory
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

      {/* Models Section */}
      {makeModels.length > 0 && (
        <section className="bg-black py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">New {name} Models</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {makeModels.map(([slug, data]) => (
                <Link
                  key={slug}
                  href={`/new-cars/make/${makeSlug}/${modelNameToSlug(data.model)}`}
                  className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all"
                >
                  {data.model}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About the Make */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Buy a New {name}?</h2>
              <p className="text-text-secondary mb-4">
                {name} is known for producing reliable, high-quality vehicles that hold their value.
                {country === 'Japan' && ` As a Japanese automaker, ${name} is renowned for reliability and efficiency.`}
                {country === 'USA' && ` As an American brand, ${name} offers powerful performance and bold styling.`}
                {country === 'Germany' && ` As a German manufacturer, ${name} delivers precision engineering and luxury.`}
                {country === 'South Korea' && ` As a Korean brand, ${name} offers excellent value with impressive features.`}
              </p>
              <p className="text-text-secondary mb-6">
                IQ Auto Deals connects you with certified {name} dealers who compete to offer you the best price
                on brand new vehicles. Compare multiple offers and save hundreds on your purchase.
              </p>
              <ul className="space-y-4">
                {[
                  `Full ${name} manufacturer warranty`,
                  `Latest 2025 ${name} models available`,
                  `Compare prices from multiple ${name} dealers`,
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
              <h2 className="text-3xl font-bold mb-6 text-text-primary">How It Works</h2>
              <div className="space-y-6">
                {[
                  { num: 1, title: 'Browse New Inventory', desc: `Search new ${name} vehicles from certified dealers.` },
                  { num: 2, title: 'Dealers Compete', desc: 'Multiple dealers bid on your selected vehicles to win your business.' },
                  { num: 3, title: 'Save Hundreds', desc: `Choose the best offer and drive away in your new ${name} for less.` },
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

      {/* Find by Location */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Find New {name} Near You</h2>
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
                  className="bg-white p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary">{location.city}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other Makes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Shop Other Makes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(makes)
              .filter(([slug]) => slug !== makeSlug)
              .slice(0, 12)
              .map(([slug, data]) => (
                <Link
                  key={slug}
                  href={`/new-cars/make/${slug}`}
                  className="bg-light-dark p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary">New {data.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your New {name}?</h2>
            <p className="text-xl mb-8 text-white/90">
              Browse new {name} vehicles and let dealers compete for your business
            </p>
            <Link
              href="/cars?condition=new"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg"
            >
              <Car className="w-5 h-5" />
              Browse {name} Inventory
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
            '@type': 'Brand',
            name: name,
            description: `New ${name} vehicles for sale`,
            url: `https://iqautodeals.com/new-cars/make/${makeSlug}`,
          }),
        }}
      />

      <Footer />
    </div>
  );
}
