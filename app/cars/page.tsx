import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import CarsClient from './CarsClient';

export const revalidate = 3600; // Re-generate every hour with fresh inventory

export const metadata: Metadata = {
  title: 'Used Cars for Sale - Browse & Compare | IQ Auto Deals',
  description: 'Browse thousands of quality used cars for sale from certified dealers. Compare prices, filter by make, model, price, and location. Save thousands with dealer competition.',
  keywords: ['used cars for sale', 'buy used cars', 'used car dealers', 'compare car prices', 'certified pre-owned cars'],
};

export default async function CarsPage() {
  // Fetch active inventory for server-rendered HTML that crawlers can see
  let cars: {
    id: string;
    slug: string | null;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    salePrice: number;
    mileage: number;
    color: string;
    city: string;
    state: string;
    condition: string | null;
    bodyType: string | null;
    fuelType: string | null;
    transmission: string;
    dealer: { businessName: string | null };
  }[] = [];

  try {
    cars = await prisma.car.findMany({
      where: {
        status: 'active',
        dealer: { verificationStatus: 'approved' },
      },
      select: {
        id: true,
        slug: true,
        year: true,
        make: true,
        model: true,
        trim: true,
        salePrice: true,
        mileage: true,
        color: true,
        city: true,
        state: true,
        condition: true,
        bodyType: true,
        fuelType: true,
        transmission: true,
        dealer: { select: { businessName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    // If DB query fails, page still renders with empty inventory
  }

  // Group cars by make for the inventory summary
  const makeCount: Record<string, number> = {};
  const bodyTypeCount: Record<string, number> = {};
  for (const car of cars) {
    makeCount[car.make] = (makeCount[car.make] || 0) + 1;
    if (car.bodyType) {
      bodyTypeCount[car.bodyType] = (bodyTypeCount[car.bodyType] || 0) + 1;
    }
  }
  const topMakes = Object.entries(makeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const formatPrice = (price: number) =>
    price > 0 ? `$${price.toLocaleString()}` : 'Call For Price';

  return (
    <>
      {/* Interactive client component - the main UI users see */}
      <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading cars...</div>}>
        <CarsClient />
      </Suspense>

      {/* Server-rendered inventory index below the interactive UI.
          Visible to all crawlers (including JS-disabled like Semrush).
          Users who scroll past the interactive UI can also see this. */}
      <section className="bg-gray-50 border-t border-gray-200 px-4 py-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Used Cars for Sale - Browse {cars.length}+ Vehicles from Certified Dealers
        </h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Browse quality used and new cars for sale from certified dealers across the United States on IQ Auto Deals.
          Compare prices, filter by make, model, year, price range, and location. Our dealer competition model
          lets multiple dealers compete to offer you their best price.
        </p>

        {topMakes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Browse by Make</h2>
            <div className="flex flex-wrap gap-2">
              {topMakes.map(([make, count]) => (
                <Link
                  key={make}
                  href={`/cars?make=${encodeURIComponent(make)}`}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
                >
                  {make} ({count})
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Popular Body Types</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'SUV', label: 'SUVs' },
              { type: 'Sedan', label: 'Sedans' },
              { type: 'Truck', label: 'Trucks' },
              { type: 'Coupe', label: 'Coupes' },
              { type: 'Hatchback', label: 'Hatchbacks' },
              { type: 'Convertible', label: 'Convertibles' },
              { type: 'Minivan', label: 'Minivans' },
              { type: 'Wagon', label: 'Wagons' },
            ].map(({ type, label }) => (
              <Link
                key={type}
                href={`/cars?bodyType=${type}`}
                className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
              >
                {label}{bodyTypeCount[type] ? ` (${bodyTypeCount[type]})` : ''}
              </Link>
            ))}
          </div>
        </div>

        <nav className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Browse More</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/locations" className="text-blue-600 hover:underline text-sm">Browse by Location</Link>
            <span className="text-gray-300">|</span>
            <Link href="/models" className="text-blue-600 hover:underline text-sm">Browse by Model</Link>
            <span className="text-gray-300">|</span>
            <Link href="/new-cars" className="text-blue-600 hover:underline text-sm">New Cars for Sale</Link>
            <span className="text-gray-300">|</span>
            <Link href="/cars?condition=used" className="text-blue-600 hover:underline text-sm">Used Cars for Sale</Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="text-blue-600 hover:underline text-sm">Home</Link>
          </div>
        </nav>

        {cars.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Inventory - {cars.length} Vehicles for Sale
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.slug || car.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition"
                >
                  <p className="font-semibold text-gray-900 text-sm">
                    {car.year} {car.make} {car.model}{car.trim ? ` ${car.trim}` : ''}
                  </p>
                  <p className="text-blue-600 font-bold text-sm">{formatPrice(car.salePrice)}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {car.mileage.toLocaleString()} mi | {car.color} | {car.transmission}
                    {car.fuelType ? ` | ${car.fuelType}` : ''}
                    {car.bodyType ? ` | ${car.bodyType}` : ''}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {car.city}, {car.state}
                    {car.dealer.businessName ? ` - ${car.dealer.businessName}` : ''}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
