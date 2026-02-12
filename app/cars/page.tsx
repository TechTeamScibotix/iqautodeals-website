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
  // Fetch active inventory for server-rendered HTML that AI crawlers can see
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
      {/* Server-rendered inventory visible to crawlers and users */}
      <section className="sr-only">
        <h2>Used Cars for Sale - Browse {cars.length}+ Vehicles from Certified Dealers</h2>
        <p>
          Browse quality used and new cars for sale from certified dealers across the United States on IQ Auto Deals.
          Compare prices, filter by make, model, year, price range, and location. Our dealer competition model
          helps you save up to $5,000 on your next vehicle.
        </p>

        {topMakes.length > 0 && (
          <>
            <h2>Browse by Make</h2>
            <ul>
              {topMakes.map(([make, count]) => (
                <li key={make}>
                  <Link href={`/cars?make=${encodeURIComponent(make)}`}>
                    {make} ({count} vehicles available)
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2>Popular Body Types</h2>
        <ul>
          <li><Link href="/cars?bodyType=SUV">Used SUVs{bodyTypeCount['SUV'] ? ` (${bodyTypeCount['SUV']} available)` : ''}</Link></li>
          <li><Link href="/cars?bodyType=Sedan">Used Sedans{bodyTypeCount['Sedan'] ? ` (${bodyTypeCount['Sedan']} available)` : ''}</Link></li>
          <li><Link href="/cars?bodyType=Truck">Used Trucks{bodyTypeCount['Truck'] ? ` (${bodyTypeCount['Truck']} available)` : ''}</Link></li>
          <li><Link href="/cars?bodyType=Coupe">Used Coupes{bodyTypeCount['Coupe'] ? ` (${bodyTypeCount['Coupe']} available)` : ''}</Link></li>
          <li><Link href="/cars?bodyType=Hatchback">Used Hatchbacks{bodyTypeCount['Hatchback'] ? ` (${bodyTypeCount['Hatchback']} available)` : ''}</Link></li>
        </ul>

        {cars.length > 0 && (
          <>
            <h2>Current Inventory - {cars.length} Vehicles for Sale</h2>
            <ul>
              {cars.map((car) => (
                <li key={car.id}>
                  <Link href={`/cars/${car.slug || car.id}`}>
                    {car.year} {car.make} {car.model}{car.trim ? ` ${car.trim}` : ''} - {formatPrice(car.salePrice)}
                  </Link>
                  {' | '}
                  {car.mileage.toLocaleString()} miles | {car.color} | {car.transmission}
                  {car.fuelType ? ` | ${car.fuelType}` : ''}
                  {car.bodyType ? ` | ${car.bodyType}` : ''}
                  {' | '}Located in {car.city}, {car.state}
                  {car.dealer.businessName ? ` | Sold by ${car.dealer.businessName}` : ''}
                </li>
              ))}
            </ul>
          </>
        )}

        <nav aria-label="Related pages">
          <h2>Browse More</h2>
          <ul>
            <li><Link href="/locations">Browse Cars by Location</Link></li>
            <li><Link href="/models">Browse Cars by Model</Link></li>
            <li><Link href="/new-cars">New Cars for Sale</Link></li>
            <li><Link href="/cars?condition=used">Used Cars for Sale</Link></li>
            <li><Link href="/">IQ Auto Deals Home</Link></li>
          </ul>
        </nav>
      </section>

      {/* Interactive client component */}
      <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading cars...</div>}>
        <CarsClient />
      </Suspense>
    </>
  );
}
