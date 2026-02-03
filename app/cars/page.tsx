import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CarsClient from './CarsClient';

// Force static generation for SEO - sr-only content renders as HTML
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Used Cars for Sale - Browse & Compare | IQ Auto Deals',
  description: 'Browse thousands of quality used cars for sale from certified dealers. Compare prices, filter by make, model, price, and location. Save thousands with dealer competition.',
  keywords: ['used cars for sale', 'buy used cars', 'used car dealers', 'compare car prices', 'certified pre-owned cars'],
};

// Server component wrapper - renders SEO content visible to crawlers
export default function CarsPage() {
  return (
    <>
      {/* SEO content visible to crawlers (server-rendered) */}
      <div className="sr-only">
        <h1>Used Cars for Sale - Browse Quality Pre-Owned Vehicles</h1>
        <p>
          Browse thousands of quality used cars for sale from certified dealers across the United States.
          IQ Auto Deals makes it easy to compare prices, filter by make, model, year, price range, and
          location. Our unique dealer competition model helps you save thousands on your next vehicle.
        </p>
        <h2>Search Used Cars</h2>
        <p>
          Filter by body type (SUV, Sedan, Truck, Coupe), fuel type (Gas, Electric, Hybrid), condition
          (New, Used), price range, mileage, and more. Find the perfect car near you.
        </p>
        <h2>Popular Body Types</h2>
        <ul>
          <li><Link href="/cars?bodyType=SUV">Used SUVs</Link></li>
          <li><Link href="/cars?bodyType=Sedan">Used Sedans</Link></li>
          <li><Link href="/cars?bodyType=Truck">Used Trucks</Link></li>
          <li><Link href="/cars?bodyType=Coupe">Used Coupes</Link></li>
          <li><Link href="/cars?bodyType=Hatchback">Used Hatchbacks</Link></li>
        </ul>
        <nav aria-label="Related pages">
          <ul>
            <li><Link href="/locations">Browse by Location</Link></li>
            <li><Link href="/models">Browse by Model</Link></li>
            <li><Link href="/new-cars">New Cars for Sale</Link></li>
            <li><Link href="/">Home</Link></li>
          </ul>
        </nav>
      </div>

      {/* Interactive client component */}
      <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading cars...</div>}>
        <CarsClient />
      </Suspense>
    </>
  );
}
