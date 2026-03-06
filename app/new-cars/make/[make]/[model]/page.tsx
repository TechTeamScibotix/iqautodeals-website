import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '../../../../components/Footer';
import { makes } from '@/lib/data/makes';
import { models } from '@/lib/data/models';
import { bodyTypes } from '@/lib/data/bodyTypes';
import { locations } from '@/lib/data/locations';
import { ArrowRight, Car, CheckCircle } from 'lucide-react';

// Force static generation for SEO
export const dynamic = 'force-static';

// Helper to convert model name to URL-friendly slug
function modelNameToSlug(modelName: string): string {
  return modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper to find model by make and model slug
function findModelByMakeAndSlug(makeSlug: string, modelUrlSlug: string) {
  const makeData = makes[makeSlug as keyof typeof makes];
  if (!makeData) return null;

  const entry = Object.entries(models).find(([, data]) => {
    const matchesBrand = data.brand.toLowerCase() === makeData.name.toLowerCase();
    const modelSlug = modelNameToSlug(data.model);
    return matchesBrand && modelSlug === modelUrlSlug;
  });

  return entry ? { slug: entry[0], data: entry[1] } : null;
}

// Define which make+bodyType combos to generate
const makeBodyTypeCombos = [
  { make: 'ford', bodyType: 'truck' },
  { make: 'ram', bodyType: 'truck' },
  { make: 'chevrolet', bodyType: 'truck' },
  { make: 'gmc', bodyType: 'truck' },
  { make: 'lexus', bodyType: 'sedan' },
  { make: 'nissan', bodyType: 'sedan' },
  { make: 'honda', bodyType: 'sedan' },
  { make: 'kia', bodyType: 'sedan' },
  { make: 'mercedes-benz', bodyType: 'sedan' },
  { make: 'ford', bodyType: 'suv' },
  { make: 'chevrolet', bodyType: 'suv' },
  { make: 'gmc', bodyType: 'suv' },
  { make: 'honda', bodyType: 'suv' },
  { make: 'nissan', bodyType: 'suv' },
  { make: 'kia', bodyType: 'suv' },
  { make: 'lexus', bodyType: 'luxury' },
  { make: 'mercedes-benz', bodyType: 'luxury' },
  { make: 'toyota', bodyType: 'truck' },
  { make: 'toyota', bodyType: 'suv' },
  { make: 'toyota', bodyType: 'sedan' },
  { make: 'jeep', bodyType: 'suv' },
];

// Friendly label: "Cars" for sedans, "Trucks" for trucks, etc.
function bodyTypeLabel(btSlug: string): string {
  const bt = bodyTypes[btSlug as keyof typeof bodyTypes];
  if (!bt) return 'Vehicles';
  if (btSlug === 'sedan') return 'Cars';
  if (btSlug === 'luxury') return 'Cars';
  return bt.label;
}

// Check if a slug is a body type
function isBodyTypeSlug(slug: string): boolean {
  return slug in bodyTypes;
}

export async function generateStaticParams() {
  const params: { make: string; model: string }[] = [];

  // Model pages
  Object.entries(models).forEach(([, modelData]) => {
    const makeSlug = Object.entries(makes).find(
      ([, makeData]) => makeData.name.toLowerCase() === modelData.brand.toLowerCase()
    )?.[0];

    if (makeSlug) {
      const modelUrlSlug = modelNameToSlug(modelData.model);
      params.push({ make: makeSlug, model: modelUrlSlug });
    }
  });

  // Body type pages (e.g., /new-cars/make/ford/truck)
  makeBodyTypeCombos.forEach((combo) => {
    params.push({ make: combo.make, model: combo.bodyType });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; model: string }> }): Promise<Metadata> {
  const { make: makeSlug, model: slug } = await params;
  const makeData = makes[makeSlug as keyof typeof makes];

  if (!makeData) return { title: 'Not Found' };

  // Body type page
  if (isBodyTypeSlug(slug)) {
    const btData = bodyTypes[slug as keyof typeof bodyTypes];
    if (!btData) return { title: 'Not Found' };

    const { name } = makeData;
    const label = bodyTypeLabel(slug);

    return {
      title: `New ${name} ${label} for Sale (2026) - Compare Prices | IQ Auto Deals`,
      description: `Shop new ${name} ${label.toLowerCase()} for sale. Compare prices from certified ${name} dealers near you. Browse the latest 2026 ${name} ${label.toLowerCase()} inventory and save.`,
      keywords: [
        `new ${name.toLowerCase()} ${label.toLowerCase()}`,
        `new ${name.toLowerCase()} ${label.toLowerCase()} for sale`,
        `${name.toLowerCase()} ${label.toLowerCase()} for sale near me`,
        `2026 ${name.toLowerCase()} ${label.toLowerCase()}`,
        `buy new ${name.toLowerCase()} ${label.toLowerCase()}`,
        `${name.toLowerCase()} ${label.toLowerCase()} deals`,
        `${name.toLowerCase()} ${label.toLowerCase()} prices`,
        `best ${name.toLowerCase()} ${label.toLowerCase()}`,
      ],
      openGraph: {
        title: `New ${name} ${label} for Sale`,
        description: `Shop new ${name} ${label.toLowerCase()}. Compare prices from certified dealers and save.`,
        url: `https://iqautodeals.com/new-cars/make/${makeSlug}/${slug}`,
      },
      alternates: {
        canonical: `https://iqautodeals.com/new-cars/make/${makeSlug}/${slug}`,
      },
    };
  }

  // Model page
  const modelEntry = findModelByMakeAndSlug(makeSlug, slug);
  if (!modelEntry) return { title: 'Not Found' };

  const { fullName, brand, model } = modelEntry.data;

  return {
    title: `New ${fullName} for Sale - Best Prices`,
    description: `Shop new ${fullName} for sale. Compare prices from certified ${brand} dealers and save. Full warranty. Latest 2026 ${model} inventory. No haggling required.`,
    keywords: [
      `new ${fullName.toLowerCase()}`,
      `new ${fullName.toLowerCase()} for sale`,
      `2026 ${fullName.toLowerCase()}`,
      `${fullName.toLowerCase()} price`,
      `buy new ${fullName.toLowerCase()}`,
      `${brand.toLowerCase()} ${model.toLowerCase()} dealers`,
      `new ${model.toLowerCase()}`,
      `${fullName.toLowerCase()} deals`,
    ],
    openGraph: {
      title: `New ${fullName} for Sale`,
      description: `Shop new ${fullName}. Compare prices from ${brand} dealers and save.`,
      url: `https://iqautodeals.com/new-cars/make/${makeSlug}/${slug}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/new-cars/make/${makeSlug}/${slug}`,
    },
  };
}

// ─── Body Type Page Component ───
function BodyTypePage({ makeSlug, btSlug }: { makeSlug: string; btSlug: string }) {
  const makeData = makes[makeSlug as keyof typeof makes]!;
  const btData = bodyTypes[btSlug as keyof typeof bodyTypes]!;
  const { name, country } = makeData;
  const label = bodyTypeLabel(btSlug);

  const matchingModels = Object.entries(models).filter(
    ([, data]) =>
      data.brand.toLowerCase() === name.toLowerCase() &&
      data.type === btSlug
  );

  const allMakeModels = Object.entries(models).filter(
    ([, data]) => data.brand.toLowerCase() === name.toLowerCase()
  );

  const otherBodyTypes = [...new Set(allMakeModels.map(([, d]) => d.type))].filter(t => t !== btSlug);

  const popularLocations = ['atlanta', 'miami', 'houston', 'dallas', 'chicago', 'los-angeles', 'phoenix', 'denver', 'seattle', 'orlando', 'tampa', 'charlotte'];

  const otherMakesWithType = makeBodyTypeCombos
    .filter(c => c.bodyType === btSlug && c.make !== makeSlug)
    .map(c => ({ slug: c.make, name: makes[c.make as keyof typeof makes]?.name }))
    .filter(m => m.name);

  return (
    <div className="min-h-screen bg-light-dark font-sans">
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
              <Link href="/login" className="text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold">Sign In</Link>
              <Link href="/register" className="bg-primary text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-primary hover:text-primary-dark">Home</Link></li>
            <li className="text-text-secondary">/</li>
            <li><Link href="/new-cars" className="text-primary hover:text-primary-dark">New Cars</Link></li>
            <li className="text-text-secondary">/</li>
            <li><Link href={`/new-cars/make/${makeSlug}`} className="text-primary hover:text-primary-dark">{name}</Link></li>
            <li className="text-text-secondary">/</li>
            <li className="text-text-primary">{label}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">New {name} {label} for Sale</h1>
            <p className="text-xl mb-4 text-white/90">Browse New {name} {label} from Certified Dealers Nationwide</p>
            <p className="text-lg mb-8 text-white/80">Compare prices on new {name} {label.toLowerCase()} and let dealers compete for your business</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/cars?condition=new&make=${encodeURIComponent(name)}&bodyType=${encodeURIComponent(btData.singular)}`} className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition">
                <Car className="w-5 h-5" />Browse New {name} {label}
              </Link>
              <Link href={`/new-cars/make/${makeSlug}`} className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30">
                All New {name}<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {matchingModels.length > 0 && (
        <section className="bg-black py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">New {name} {label} Models</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {matchingModels.map(([slug, data]) => (
                <Link key={slug} href={`/new-cars/make/${makeSlug}/${modelNameToSlug(data.model)}`} className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all">
                  {data.model}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Buy a New {name} {btData.singular}?</h2>
              <p className="text-text-secondary mb-4">
                {name} is one of the most trusted names in the {label.toLowerCase()} segment.
                {country === 'Japan' && ` Japanese engineering means ${name} ${label.toLowerCase()} deliver exceptional reliability and fuel efficiency.`}
                {country === 'USA' && ` As an American brand, ${name} builds ${label.toLowerCase()} with powerful performance, rugged capability, and bold styling.`}
                {country === 'Germany' && ` German precision engineering makes ${name} ${label.toLowerCase()} among the finest in their class.`}
                {country === 'South Korea' && ` ${name} ${label.toLowerCase()} offer outstanding value with impressive features and strong warranties.`}
              </p>
              <p className="text-text-secondary mb-6">
                IQ Auto Deals connects you with certified {name} dealers who compete to offer you the best price on brand new {label.toLowerCase()}. Compare multiple offers and save.
              </p>
              <ul className="space-y-4">
                {[
                  `Full ${name} manufacturer warranty`,
                  `Latest 2026 ${name} ${label.toLowerCase()} available`,
                  `Compare prices from multiple ${name} dealers`,
                  'Save through dealer competition',
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
                  { num: 1, title: `Browse New ${name} ${label}`, desc: `Search new ${name} ${label.toLowerCase()} from certified dealers.` },
                  { num: 2, title: 'Dealers Compete', desc: 'Multiple dealers bid on your selected vehicles to win your business.' },
                  { num: 3, title: 'Save Money', desc: `Choose the best offer and drive away in your new ${name} for less.` },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">{step.num}</div>
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

      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Find New {name} {label} Near You</h2>
            <Link href="/locations" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">All Locations <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularLocations.map((locationSlug) => {
              const location = locations[locationSlug as keyof typeof locations];
              if (!location) return null;
              return (
                <Link key={locationSlug} href={`/new-cars/${locationSlug}/${btSlug}`} className="bg-white p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center">
                  <span className="font-semibold text-text-primary">{location.city}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {otherBodyTypes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Other New {name} Vehicles</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {otherBodyTypes.map((bt) => {
                const btInfo = bodyTypes[bt as keyof typeof bodyTypes];
                if (!btInfo) return null;
                const combo = makeBodyTypeCombos.find(c => c.make === makeSlug && c.bodyType === bt);
                const href = combo
                  ? `/new-cars/make/${makeSlug}/${bt}`
                  : `/cars?condition=new&make=${encodeURIComponent(name)}&bodyType=${encodeURIComponent(btInfo.singular)}`;
                return (
                  <Link key={bt} href={href} className="bg-light-dark px-6 py-3 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all">
                    <span className="font-semibold text-text-primary">New {name} {btInfo.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {otherMakesWithType.length > 0 && (
        <section className="py-16 bg-light-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-text-primary">Shop Other New {label}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {otherMakesWithType.map((m) => (
                <Link key={m.slug} href={`/new-cars/make/${m.slug}/${btSlug}`} className="bg-white p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center">
                  <span className="font-semibold text-text-primary">New {m.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your New {name} {btData.singular}?</h2>
            <p className="text-xl mb-8 text-white/90">Browse new {name} {label.toLowerCase()} and let dealers compete for your business</p>
            <Link href={`/cars?condition=new&make=${encodeURIComponent(name)}&bodyType=${encodeURIComponent(btData.singular)}`} className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg">
              <Car className="w-5 h-5" />Browse {name} {label}
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `New ${name} ${label} for Sale`,
            description: `Shop new ${name} ${label.toLowerCase()} for sale from certified dealers.`,
            url: `https://iqautodeals.com/new-cars/make/${makeSlug}/${btSlug}`,
            isPartOf: { '@type': 'WebSite', name: 'IQ Auto Deals', url: 'https://iqautodeals.com' },
            about: { '@type': 'Brand', name: name },
          }),
        }}
      />

      <Footer />
    </div>
  );
}

// ─── Model Page Component ───
function ModelPage({ makeSlug, modelUrlSlug }: { makeSlug: string; modelUrlSlug: string }) {
  const makeData = makes[makeSlug as keyof typeof makes]!;
  const modelEntry = findModelByMakeAndSlug(makeSlug, modelUrlSlug)!;
  const modelSlug = modelEntry.slug;
  const modelData = modelEntry.data;
  const { name: makeName } = makeData;
  const { fullName, brand, model, type } = modelData;

  const otherModels = Object.entries(models).filter(
    ([slug, data]) => data.brand.toLowerCase() === brand.toLowerCase() && slug !== modelSlug
  );

  const popularLocations = ['atlanta', 'miami', 'houston', 'dallas', 'chicago', 'los-angeles', 'phoenix', 'denver', 'seattle', 'orlando'];

  return (
    <div className="min-h-screen bg-light-dark font-sans">
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
              <Link href="/login" className="text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold">Sign In</Link>
              <Link href="/register" className="bg-primary text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

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

      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">New {fullName} for Sale</h1>
            <p className="text-xl mb-4 text-white/90">Shop the Latest 2026 {fullName} from Certified {brand} Dealers</p>
            <p className="text-lg mb-2 text-white/80">Vehicle Type: <span className="capitalize">{type}</span></p>
            <p className="text-lg mb-8 text-white/80">Compare prices and save on your new {fullName}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/cars?condition=new" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition">
                <Car className="w-5 h-5" />Browse New {fullName} Inventory
              </Link>
              <Link href={`/new-cars/make/${makeSlug}`} className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-pill font-semibold hover:bg-white/20 transition border border-white/30">
                All {brand} Models<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {otherModels.length > 0 && (
        <section className="bg-black py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Other New {brand} Models</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {otherModels.slice(0, 10).map(([slug, data]) => (
                <Link key={slug} href={`/new-cars/make/${makeSlug}/${modelNameToSlug(data.model)}`} className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all">
                  {data.model}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
                the best price on the new {fullName}. Compare multiple offers and save.
              </p>
              <ul className="space-y-4">
                {[
                  `Full ${brand} manufacturer warranty`,
                  `Latest 2026 ${model} with newest features`,
                  `Compare prices from multiple ${brand} dealers`,
                  `Save on your new ${fullName}`,
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
                  { num: 3, title: 'Save Money', desc: `Choose the best offer and drive away in your new ${fullName} for less.` },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">{step.num}</div>
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

      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Find a New {fullName} Near You</h2>
            <Link href="/locations" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">All Locations <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularLocations.map((locationSlug) => {
              const location = locations[locationSlug as keyof typeof locations];
              if (!location) return null;
              return (
                <Link key={locationSlug} href={`/new-cars/${locationSlug}`} className="bg-white p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center">
                  <span className="font-semibold text-text-primary">{location.city}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
                  <Link key={slug} href={`/new-cars/make/${modelMakeSlug}/${modelNameToSlug(data.model)}`} className="bg-light-dark p-4 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center">
                    <span className="font-semibold text-text-primary">New {data.fullName}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Buy Your New {fullName}?</h2>
            <p className="text-xl mb-8 text-white/90">Browse new {fullName} inventory and let dealers compete for your business</p>
            <Link href="/cars?condition=new" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg">
              <Car className="w-5 h-5" />Browse {fullName} Inventory
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `New ${fullName}`,
            description: `New ${fullName} for sale from certified ${brand} dealers. Compare prices and save.`,
            brand: { '@type': 'Brand', name: brand },
            category: type,
            url: `https://iqautodeals.com/new-cars/make/${makeSlug}/${modelNameToSlug(model)}`,
            image: 'https://iqautodeals.com/og-image.jpg',
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              offerCount: '50+',
              lowPrice: '20000',
              highPrice: '100000',
              seller: { '@type': 'Organization', name: 'IQ Auto Deals Certified Dealers' },
            },
          }),
        }}
      />

      <Footer />
    </div>
  );
}

// ─── Main Page Component (routes to body type or model) ───
export default async function NewCarsMakeSubPage({ params }: { params: Promise<{ make: string; model: string }> }) {
  const { make: makeSlug, model: slug } = await params;
  const makeData = makes[makeSlug as keyof typeof makes];

  if (!makeData) notFound();

  // Body type page
  if (isBodyTypeSlug(slug)) {
    const btData = bodyTypes[slug as keyof typeof bodyTypes];
    if (!btData) notFound();
    return <BodyTypePage makeSlug={makeSlug} btSlug={slug} />;
  }

  // Model page
  const modelEntry = findModelByMakeAndSlug(makeSlug, slug);
  if (!modelEntry) notFound();

  return <ModelPage makeSlug={makeSlug} modelUrlSlug={slug} />;
}
