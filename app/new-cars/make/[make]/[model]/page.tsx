import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '../../../../components/Footer';
import { makes } from '@/lib/data/makes';
import { models } from '@/lib/data/models';
import { locations } from '@/lib/data/locations';
import { ArrowRight, Car, CheckCircle } from 'lucide-react';

// Helper to convert model name to URL-friendly slug
function modelNameToSlug(modelName: string): string {
  return modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper to find model by make and model slug
function findModelByMakeAndSlug(makeSlug: string, modelUrlSlug: string) {
  const makeData = makes[makeSlug as keyof typeof makes];
  if (!makeData) return null;

  // Find model that matches this make and model name slug
  const entry = Object.entries(models).find(([, data]) => {
    const matchesBrand = data.brand.toLowerCase() === makeData.name.toLowerCase();
    const modelSlug = modelNameToSlug(data.model);
    return matchesBrand && modelSlug === modelUrlSlug;
  });

  return entry ? { slug: entry[0], data: entry[1] } : null;
}

export async function generateStaticParams() {
  const params: { make: string; model: string }[] = [];

  Object.entries(models).forEach(([, modelData]) => {
    // Find the make slug for this model
    const makeSlug = Object.entries(makes).find(
      ([, makeData]) => makeData.name.toLowerCase() === modelData.brand.toLowerCase()
    )?.[0];

    if (makeSlug) {
      // Use just the model name as the URL slug (e.g., "camry" instead of "toyota-camry")
      const modelUrlSlug = modelNameToSlug(modelData.model);
      params.push({ make: makeSlug, model: modelUrlSlug });
    }
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; model: string }> }): Promise<Metadata> {
  const { make: makeSlug, model: modelUrlSlug } = await params;
  const makeData = makes[makeSlug as keyof typeof makes];
  const modelEntry = findModelByMakeAndSlug(makeSlug, modelUrlSlug);

  if (!makeData || !modelEntry) {
    return { title: 'Not Found' };
  }

  const modelData = modelEntry.data;
  const { fullName, brand, model } = modelData;

  return {
    title: `New ${fullName} for Sale (2025) - Best Prices from ${brand} Dealers`,
    description: `Shop new ${fullName} for sale. Compare prices from certified ${brand} dealers and save hundreds. Full warranty. Latest 2025 ${model} inventory. No haggling required.`,
    keywords: [
      `new ${fullName.toLowerCase()}`,
      `new ${fullName.toLowerCase()} for sale`,
      `2025 ${fullName.toLowerCase()}`,
      `${fullName.toLowerCase()} price`,
      `buy new ${fullName.toLowerCase()}`,
      `${brand.toLowerCase()} ${model.toLowerCase()} dealers`,
      `new ${model.toLowerCase()}`,
      `${fullName.toLowerCase()} deals`,
    ],
    openGraph: {
      title: `New ${fullName} for Sale`,
      description: `Shop new ${fullName}. Compare prices from ${brand} dealers and save hundreds.`,
      url: `https://iqautodeals.com/new-cars/make/${makeSlug}/${modelUrlSlug}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/new-cars/make/${makeSlug}/${modelUrlSlug}`,
    },
  };
}

export default async function NewCarsModelPage({ params }: { params: Promise<{ make: string; model: string }> }) {
  const { make: makeSlug, model: modelUrlSlug } = await params;
  const makeData = makes[makeSlug as keyof typeof makes];
  const modelEntry = findModelByMakeAndSlug(makeSlug, modelUrlSlug);

  if (!makeData || !modelEntry) {
    notFound();
  }

  const modelSlug = modelEntry.slug;
  const modelData = modelEntry.data;
  const { name: makeName } = makeData;
  const { fullName, brand, model, type } = modelData;

  // Get other models from same make
  const otherModels = Object.entries(models).filter(
    ([slug, data]) => data.brand.toLowerCase() === brand.toLowerCase() && slug !== modelSlug
  );

  const popularLocations = ['atlanta', 'miami', 'houston', 'dallas', 'chicago', 'los-angeles', 'phoenix', 'denver', 'seattle', 'orlando'];

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
            <li><Link href={`/new-cars/make/${makeSlug}`} className="text-primary hover:text-primary-dark">{makeName}</Link></li>
            <li className="text-text-secondary">/</li>
            <li className="text-text-primary">{model}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New {fullName} for Sale
            </h1>
            <p className="text-xl mb-4 text-white/90">
              Shop the Latest 2025 {fullName} from Certified {brand} Dealers
            </p>
            <p className="text-lg mb-2 text-white/80">
              Vehicle Type: <span className="capitalize">{type}</span>
            </p>
            <p className="text-lg mb-8 text-white/80">
              Compare prices and save hundreds on your new {fullName}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars?condition=new"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
              >
                <Car className="w-5 h-5" />
                Browse New {fullName} Inventory
              </Link>
              <Link
                href={`/new-cars/make/${makeSlug}`}
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30"
              >
                All {brand} Models
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Models Section */}
      {otherModels.length > 0 && (
        <section className="bg-black py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Other New {brand} Models</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {otherModels.slice(0, 10).map(([slug, data]) => (
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

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Buy a New {fullName}?</h2>
              <p className="text-text-secondary mb-4">
                The {fullName} is one of the most popular {type}s on the market, known for its
                reliability, performance, and value. Buying new means you get the latest features,
                full warranty coverage, and the peace of mind that comes with a brand new vehicle.
              </p>
              <p className="text-text-secondary mb-6">
                IQ Auto Deals connects you with certified {brand} dealers who compete to offer you
                the best price on the new {fullName}. Compare multiple offers and save hundreds.
              </p>
              <ul className="space-y-4">
                {[
                  `Full ${brand} manufacturer warranty`,
                  `Latest 2025 ${model} with newest features`,
                  `Compare prices from multiple ${brand} dealers`,
                  `Save hundreds on your new ${fullName}`,
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
                  { num: 1, title: 'Browse New Inventory', desc: `Search new ${fullName} from certified ${brand} dealers.` },
                  { num: 2, title: 'Dealers Compete', desc: 'Multiple dealers bid on your selected vehicle to win your business.' },
                  { num: 3, title: 'Save Hundreds', desc: `Choose the best offer and drive away in your new ${fullName} for less.` },
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
            <h2 className="text-2xl font-bold text-text-primary">Find a New {fullName} Near You</h2>
            <Link href="/locations" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
              All Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

      {/* Also Consider */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Also Consider</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(models)
              .filter(([slug, data]) => data.type === type && slug !== modelSlug)
              .slice(0, 6)
              .map(([slug, data]) => {
                const modelMakeSlug = Object.entries(makes).find(
                  ([, makeData]) => makeData.name.toLowerCase() === data.brand.toLowerCase()
                )?.[0];
                return (
                  <Link
                    key={slug}
                    href={`/new-cars/make/${modelMakeSlug}/${modelNameToSlug(data.model)}`}
                    className="bg-light-dark p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                  >
                    <span className="font-semibold text-text-primary">New {data.fullName}</span>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Buy Your New {fullName}?</h2>
            <p className="text-xl mb-8 text-white/90">
              Browse new {fullName} inventory and let dealers compete for your business
            </p>
            <Link
              href="/cars?condition=new"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg"
            >
              <Car className="w-5 h-5" />
              Browse {fullName} Inventory
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
            name: `New ${fullName}`,
            description: `New ${fullName} for sale from certified ${brand} dealers`,
            brand: {
              '@type': 'Brand',
              name: brand,
            },
            category: type,
            url: `https://iqautodeals.com/new-cars/make/${makeSlug}/${modelNameToSlug(model)}`,
          }),
        }}
      />

      <Footer />
    </div>
  );
}
