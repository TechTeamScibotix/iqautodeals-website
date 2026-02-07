import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { Car, MapPin, Gauge, Calendar, Palette, Settings, ArrowLeft, AlertCircle, ArrowRight, Globe, ExternalLink, Fuel } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import VehicleSchema from '@/app/components/VehicleSchema';
import VehicleFAQSchema from '@/app/components/VehicleFAQSchema';
import Footer from '@/app/components/Footer';
import CheckAvailabilityButton from '@/app/components/CheckAvailabilityButton';
import CarPhotoGallery from '@/app/components/CarPhotoGallery';
import ViewTracker from '@/app/components/ViewTracker';
import VehicleFAQ from '@/app/components/VehicleFAQ';

// Force dynamic rendering to ensure redirects work on every request
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper to check if string is UUID format
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Generate a positive "good deal" answer based on vehicle attributes (for schema)
function generateGoodDealAnswer(car: { make: string; model: string; year: number; mileage: number; fuelType?: string | null }): string {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - car.year;

  const sellingPoints: string[] = [];

  const avgMilesPerYear = 12000;
  const expectedMileage = vehicleAge * avgMilesPerYear;
  if (car.mileage < expectedMileage) {
    sellingPoints.push('lower-than-average mileage for its age');
  }
  if (car.mileage < 50000) {
    sellingPoints.push('plenty of life left with under 50,000 miles');
  } else if (car.mileage < 100000) {
    sellingPoints.push('well within the reliable mileage range');
  }

  if (vehicleAge <= 3) {
    sellingPoints.push('nearly new with modern features and technology');
  } else if (vehicleAge <= 6) {
    sellingPoints.push('a great balance of value and modern features');
  }

  if (car.fuelType?.toLowerCase().includes('hybrid')) {
    sellingPoints.push('excellent fuel efficiency as a hybrid');
  } else if (car.fuelType?.toLowerCase().includes('electric')) {
    sellingPoints.push('zero emissions and low operating costs');
  }

  const reliableMakes = ['toyota', 'honda', 'lexus', 'mazda', 'subaru'];
  if (reliableMakes.includes(car.make.toLowerCase())) {
    sellingPoints.push(`${car.make}'s reputation for reliability and strong resale value`);
  }

  let answer = `Yes! This ${car.year} ${car.make} ${car.model} offers solid value. `;
  if (sellingPoints.length > 0) {
    const points = sellingPoints.slice(0, 2);
    if (points.length === 1) {
      answer += `It has ${points[0]}.`;
    } else {
      answer += `It has ${points[0]} and ${points[1]}.`;
    }
  } else {
    answer += `With ${car.mileage.toLocaleString()} miles, it's priced competitively for the market.`;
  }

  return answer;
}

// Helper to find car by ID or slug
async function findCar(idOrSlug: string) {
  // Try by slug first (more likely for SEO traffic)
  let car = await prisma.car.findUnique({
    where: { slug: idOrSlug },
    include: {
      dealer: {
        select: {
          businessName: true,
          websiteUrl: true,
          city: true,
          state: true,
        },
      },
    },
  });

  // If not found by slug, try by UUID
  if (!car && isUUID(idOrSlug)) {
    car = await prisma.car.findUnique({
      where: { id: idOrSlug },
      include: {
        dealer: {
          select: {
            businessName: true,
            websiteUrl: true,
            city: true,
            state: true,
          },
        },
      },
    });
  }

  return car;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const car = await findCar(id);

  if (!car) {
    return {
      title: 'Vehicle Not Found | IQ Auto Deals',
      description: 'This vehicle is no longer available. Browse our inventory for similar cars.',
    };
  }

  const title = `${car.year} ${car.make} ${car.model} for Sale in ${car.city}, ${car.state} | IQ Auto Deals`;
  const description = car.description ||
    `${car.year} ${car.make} ${car.model} with ${car.mileage.toLocaleString()} miles. ${car.color} exterior, ${car.transmission} transmission. Located in ${car.city}, ${car.state}. Get competitive offers from dealers.`;

  let imageUrl = '';
  try {
    const photos = JSON.parse(car.photos || '[]');
    imageUrl = photos[0] || '';
  } catch (e) {
    // Invalid JSON, no image
  }

  // Use slug for canonical URL (SEO-friendly) - slug is required
  const canonicalPath = car.slug!;

  return {
    title,
    description: description.slice(0, 160),
    keywords: [
      `${car.year} ${car.make} ${car.model}`,
      `${car.make} ${car.model} for sale`,
      `used ${car.make} ${car.model}`,
      `${car.make} for sale ${car.city}`,
      `buy ${car.make} ${car.model} ${car.state}`,
      `pre-owned ${car.make}`,
      `${car.year} ${car.make} ${car.model} ${car.city}`,
    ],
    openGraph: {
      title,
      description: description.slice(0, 160),
      type: 'website',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: `${car.year} ${car.make} ${car.model}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `https://iqautodeals.com/cars/${canonicalPath}`,
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;

  const car = await findCar(id);

  // Car not found - hard deleted
  if (!car) {
    notFound();
  }

  // Note: UUID to slug redirects are handled by middleware for better SEO

  // Parse photos
  let photos: string[] = [];
  try {
    photos = JSON.parse(car.photos || '[]');
  } catch (e) {
    // Invalid JSON
  }

  // Car is sold, pending, or removed - show appropriate page with similar cars
  if (car.status === 'sold' || car.status === 'pending' || car.status === 'removed') {
    const similarCars = await prisma.car.findMany({
      where: {
        status: 'active',
        make: car.make,
        id: { not: car.id },
        dealer: {
          verificationStatus: 'approved',
        },
      },
      select: {
        id: true,
        slug: true,
        year: true,
        make: true,
        model: true,
        salePrice: true,
        mileage: true,
        city: true,
        state: true,
        photos: true,
        dealer: {
          select: { businessName: true },
        },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });

    // If no similar cars by make, get any active cars
    const carsToShow = similarCars.length > 0 ? similarCars : await prisma.car.findMany({
      where: {
        status: 'active',
        id: { not: car.id },
        dealer: {
          verificationStatus: 'approved',
        },
      },
      select: {
        id: true,
        slug: true,
        year: true,
        make: true,
        model: true,
        salePrice: true,
        mileage: true,
        city: true,
        state: true,
        photos: true,
        dealer: {
          select: { businessName: true },
        },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
          <div className="container mx-auto px-4 h-full flex justify-between items-center">
            <Link href="/" className="flex items-center h-full py-1">
              <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
            </Link>
            <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors font-semibold">
              Browse All Cars
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Link */}
          <Link href="/cars" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Search Results
          </Link>

          {/* Status Notice */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              car.status === 'sold' ? 'bg-green-100' : car.status === 'removed' ? 'bg-gray-100' : 'bg-amber-100'
            }`}>
              <AlertCircle className={`w-10 h-10 ${
                car.status === 'sold' ? 'text-green-600' : car.status === 'removed' ? 'text-gray-600' : 'text-amber-600'
              }`} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {car.year} {car.make} {car.model}
            </h1>
            <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold mb-4 ${
              car.status === 'sold' ? 'bg-green-100 text-green-700' : car.status === 'removed' ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {car.status === 'sold' ? 'SOLD' : car.status === 'removed' ? 'No Longer Available' : 'Reserved'}
            </div>
            <p className="text-gray-600 max-w-lg mx-auto">
              {car.status === 'sold'
                ? `Great news! This ${car.make} found a new home. Browse similar vehicles below or search our full inventory.`
                : car.status === 'removed'
                ? `This vehicle is no longer available. Browse similar vehicles below or search our full inventory.`
                : `This vehicle has been reserved. Browse similar vehicles below or search our full inventory.`
              }
            </p>
          </div>

          {/* Similar Cars */}
          {carsToShow.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Similar Vehicles Available
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {carsToShow.map((similarCar) => {
                  let photoUrl = '';
                  try {
                    const carPhotos = JSON.parse(similarCar.photos || '[]');
                    photoUrl = carPhotos[0] || '';
                  } catch (e) {}

                  return (
                    <Link
                      key={similarCar.id}
                      href={`/cars/${similarCar.slug || similarCar.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                    >
                      <div className="relative h-48 bg-gray-200">
                        {photoUrl ? (
                          <Image
                            src={photoUrl}
                            alt={`${similarCar.year} ${similarCar.make} ${similarCar.model}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-lg">
                              IN STOCK
                            </div>
                            <p className="text-gray-400 text-xs mt-1">Photos Coming Soon</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900">
                          {similarCar.year} {similarCar.make} {similarCar.model}
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(similarCar.salePrice)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {similarCar.mileage.toLocaleString()} mi • {similarCar.city}, {similarCar.state}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-pill font-bold text-lg hover:bg-primary-dark transition"
            >
              Browse All Vehicles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Active car - show full details
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Vehicle Schema for SEO */}
      <VehicleSchema
        make={car.make}
        model={car.model}
        year={car.year}
        mileage={car.mileage}
        color={car.color}
        price={car.salePrice}
        description={car.description}
        imageUrl={photos[0]}
        vin={car.vin}
        dealerName={car.dealer.businessName || undefined}
        city={car.city}
        state={car.state}
      />

      {/* FAQ Schema for SEO */}
      <VehicleFAQSchema
        make={car.make}
        model={car.model}
        year={car.year}
        goodDealAnswer={generateGoodDealAnswer(car)}
      />

      {/* Track view in Scibotix for Price Pulse analytics */}
      <ViewTracker vin={car.vin} />

      {/* Header */}
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors">
              Cars for Sale
            </Link>
            <Link href="/locations" className="text-gray-300 hover:text-primary transition-colors">
              Locations
            </Link>
          </nav>
          <Link
            href="/register"
            className="bg-primary text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-pill hover:bg-primary-dark transition-colors font-semibold text-sm sm:text-base"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl overflow-x-hidden">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm overflow-x-auto">
          <ol className="flex items-center gap-2 text-gray-600 whitespace-nowrap">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/cars" className="hover:text-primary">Cars</Link></li>
            <li>/</li>
            <li><Link href={`/locations/${car.city.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">{car.city}</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{car.year} {car.make} {car.model}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8 w-full max-w-full">
          {/* Left: Photos & Details */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* Photo Gallery */}
            <CarPhotoGallery
              photos={photos}
              carName={`${car.year} ${car.make} ${car.model}`}
              bodyType={car.bodyType || undefined}
            />

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                {formatPrice(car.salePrice)}
              </p>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4 text-center min-w-0">
                  <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Mileage</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base truncate">{car.mileage.toLocaleString()} mi</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4 text-center min-w-0">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Trans.</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base truncate">{car.transmission}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4 text-center min-w-0">
                  <Fuel className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Fuel Type</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base truncate">{car.fuelType || 'Gasoline'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4 text-center min-w-0">
                  <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Color</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base truncate">{car.color}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4 text-center min-w-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase">Location</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-base truncate">{car.city}, {car.state}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Vehicle</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
                  {car.description}
                </p>
              </div>

              {/* FAQ Section */}
              <VehicleFAQ
                make={car.make}
                model={car.model}
                year={car.year}
                mileage={car.mileage}
                color={car.color}
                transmission={car.transmission}
                fuelType={car.fuelType || undefined}
                condition={car.condition || undefined}
              />

              {/* VIN */}
              <div className="border-t pt-4 mt-6">
                <p className="text-sm text-gray-500 break-all">
                  <span className="font-semibold">VIN:</span> {car.vin}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Dealer Card & CTA */}
          <div className="space-y-6 min-w-0">
            {/* Dealer Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sold By</h3>
              <div className="mb-6">
                <p className="font-semibold text-gray-900 text-lg">{car.dealer.businessName}</p>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {car.city}, {car.state}
                </p>
                {car.dealer.websiteUrl && (
                  <a
                    href={car.dealer.websiteUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 mt-2 font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Dealer Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* CTA Button */}
              <CheckAvailabilityButton
                car={{
                  id: car.id,
                  make: car.make,
                  model: car.model,
                  year: car.year,
                  salePrice: car.salePrice,
                  dealerId: car.dealerId,
                  dealer: {
                    businessName: car.dealer.businessName || '',
                  },
                }}
              />
              <p className="text-xs text-gray-500 text-center mt-3">
                Free • No obligation • Get a response within 24 hours
              </p>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</span>
                  Verified dealer
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</span>
                  Vehicle history available
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</span>
                  Test drive available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
