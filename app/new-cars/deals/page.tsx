import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import { makes } from '@/lib/data/makes';
import { ArrowRight, Car, CheckCircle, Tag, Percent, Calendar } from 'lucide-react';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'New Car Deals & Specials (2025) - Best Prices from Local Dealers',
  description: 'Find the best new car deals and specials from certified dealers. Compare manufacturer incentives, rebates, and financing offers. Save hundreds on your new vehicle purchase.',
  keywords: [
    'new car deals',
    'new car specials',
    'new car incentives',
    'new car rebates',
    '0% financing new cars',
    'new car discounts',
    'best new car deals 2025',
    'new car lease deals',
    'manufacturer rebates',
    'new car promotions',
  ],
  openGraph: {
    title: 'New Car Deals & Specials - Best Prices',
    description: 'Find the best new car deals from certified dealers. Compare incentives and save.',
    url: 'https://iqautodeals.com/new-cars/deals',
  },
  alternates: {
    canonical: 'https://iqautodeals.com/new-cars/deals',
  },
};

export default function NewCarDealsPage() {
  const popularMakes = ['toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'jeep', 'hyundai', 'kia'];

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
            <li className="text-text-primary">Deals & Specials</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New Car Deals & Specials
            </h1>
            <p className="text-xl mb-4 text-white/90">
              Find the Best Prices on Brand New Vehicles
            </p>
            <p className="text-lg mb-8 text-white/80">
              Compare manufacturer incentives, rebates, and dealer specials
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cars?condition=new"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition"
              >
                <Car className="w-5 h-5" />
                Browse New Car Deals
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

      {/* Types of Deals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-text-primary">Types of New Car Deals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-light-dark rounded-card p-6 border border-border">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Tag className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary">Cash Rebates</h3>
              <p className="text-text-secondary mb-4">
                Manufacturer cash back offers that reduce your purchase price instantly.
                Rebates can range from $500 to $5,000+ depending on the vehicle.
              </p>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Applied directly to purchase price
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Can be combined with other offers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Available on select models
                </li>
              </ul>
            </div>
            <div className="bg-light-dark rounded-card p-6 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Percent className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary">Low APR Financing</h3>
              <p className="text-text-secondary mb-4">
                Special financing rates as low as 0% APR for qualified buyers.
                Save thousands in interest over the life of your loan.
              </p>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  0% APR available on select models
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Terms from 36 to 72 months
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Requires good credit
                </li>
              </ul>
            </div>
            <div className="bg-light-dark rounded-card p-6 border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary">Lease Specials</h3>
              <p className="text-text-secondary mb-4">
                Low monthly lease payments with minimal down payment required.
                Drive a new car every few years for less.
              </p>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Lower monthly payments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Always drive a new vehicle
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Warranty coverage included
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deals by Make */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">New Car Deals by Make</h2>
            <Link href="/new-cars/make/toyota" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularMakes.map((makeSlug) => {
              const make = makes[makeSlug as keyof typeof makes];
              if (!make) return null;
              return (
                <Link
                  key={makeSlug}
                  href={`/new-cars/make/${makeSlug}`}
                  className="bg-white p-6 rounded-card border border-border hover:border-primary hover:shadow-card-hover transition-all text-center"
                >
                  <span className="font-semibold text-text-primary text-lg">{make.name} Deals</span>
                  <p className="text-sm text-text-secondary mt-2">View current offers</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-text-primary">Tips for Getting the Best Deal</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              {[
                { num: 1, title: 'Shop at the End of the Month', desc: 'Dealers are more motivated to meet sales quotas at month-end.' },
                { num: 2, title: 'Compare Multiple Dealers', desc: 'Get quotes from several dealers to ensure the best price.' },
                { num: 3, title: 'Check for Stackable Offers', desc: 'Some rebates can be combined for maximum savings.' },
              ].map((tip) => (
                <div key={tip.num} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mr-3">
                    {tip.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{tip.title}</h3>
                    <p className="text-text-secondary text-sm">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { num: 4, title: "Consider Last Year's Model", desc: 'Previous model year vehicles often have larger discounts.' },
                { num: 5, title: 'Get Pre-Approved for Financing', desc: 'Know your rate before negotiating at the dealership.' },
                { num: 6, title: 'Use IQ Auto Deals', desc: 'Let dealers compete for your business automatically.' },
              ].map((tip) => (
                <div key={tip.num} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mr-3">
                    {tip.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{tip.title}</h3>
                    <p className="text-text-secondary text-sm">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-card p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Deal?</h2>
            <p className="text-xl mb-8 text-white/90">
              Browse new cars and let dealers compete to give you their best price
            </p>
            <Link
              href="/cars?condition=new"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-pill font-semibold hover:bg-gray-100 transition text-lg"
            >
              <Car className="w-5 h-5" />
              Start Shopping
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
            name: 'New Car Deals & Specials',
            description: 'Find the best new car deals from certified dealers. Compare incentives and save.',
            url: 'https://iqautodeals.com/new-cars/deals',
          }),
        }}
      />

      <Footer />
    </div>
  );
}
