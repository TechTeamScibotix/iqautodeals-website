import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { MapPin, Gauge, Settings, ArrowLeft, AlertCircle, ArrowRight, Globe, ExternalLink, Fuel, DoorOpen, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import VehicleSchema from '@/app/components/VehicleSchema';
import VehicleFAQSchema from '@/app/components/VehicleFAQSchema';
import Footer from '@/app/components/Footer';
import CheckAvailabilityButton from '@/app/components/CheckAvailabilityButton';
import CarPhotoGallery from '@/app/components/CarPhotoGallery';
import ViewTracker from '@/app/components/ViewTracker';
import AIDealSummary from '@/app/components/AIDealSummary';

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

  // Sidebar vehicle recommendations (only for active cars, fetched in parallel)
  const sidebarSelect = {
    id: true,
    slug: true,
    year: true,
    make: true,
    model: true,
    trim: true,
    salePrice: true,
    photos: true,
  } as const;

  const sidebarWhere = {
    status: 'active' as const,
    id: { not: car.id },
    dealer: { verificationStatus: 'approved' as const },
  };

  const [similarVehicles, sameModelVehicles, sameCategoryVehicles] = car.status === 'active'
    ? await Promise.all([
        prisma.car.findMany({
          where: { ...sidebarWhere, make: car.make },
          select: sidebarSelect,
          take: 4,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.car.findMany({
          where: { ...sidebarWhere, make: car.make, model: car.model },
          select: sidebarSelect,
          take: 2,
          orderBy: { createdAt: 'desc' },
        }),
        car.bodyType && car.salePrice
          ? prisma.car.findMany({
              where: {
                ...sidebarWhere,
                bodyType: car.bodyType,
                salePrice: {
                  gte: car.salePrice * 0.7,
                  lte: car.salePrice * 1.3,
                },
              },
              select: sidebarSelect,
              take: 2,
              orderBy: { createdAt: 'desc' },
            })
          : Promise.resolve([]),
      ])
    : [[], [], []];

  // Car is sold, pending, or removed - show full content page with status banner
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
        trim: true,
        salePrice: true,
        mileage: true,
        city: true,
        state: true,
        photos: true,
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
        trim: true,
        salePrice: true,
        mileage: true,
        city: true,
        state: true,
        photos: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });

    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Vehicle Schema for SEO (still valuable for sold pages) */}
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
          features={car.features || undefined}
          fuelType={car.fuelType || undefined}
          numberOfDoors={car.doors || undefined}
          mpgCity={car.mpgCity || undefined}
          mpgHighway={car.mpgHighway || undefined}
          drivetrain={car.drivetrain || undefined}
          condition={car.condition || undefined}
        />

        {/* FAQ Schema for SEO */}
        <VehicleFAQSchema
          make={car.make}
          model={car.model}
          year={car.year}
          goodDealAnswer={generateGoodDealAnswer(car)}
        />

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

          {/* Compact SOLD banner */}
          <div className={`rounded-lg px-4 py-3 mb-6 flex items-center gap-3 ${
            car.status === 'sold' ? 'bg-green-50 border border-green-200' : car.status === 'removed' ? 'bg-gray-50 border border-gray-200' : 'bg-amber-50 border border-amber-200'
          }`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
              car.status === 'sold' ? 'text-green-600' : car.status === 'removed' ? 'text-gray-600' : 'text-amber-600'
            }`} />
            <p className={`text-sm font-medium ${
              car.status === 'sold' ? 'text-green-800' : car.status === 'removed' ? 'text-gray-800' : 'text-amber-800'
            }`}>
              {car.status === 'sold'
                ? 'This vehicle has been sold. Browse similar vehicles below.'
                : car.status === 'removed'
                ? 'This vehicle is no longer available. Browse similar vehicles below.'
                : 'This vehicle has been reserved. Browse similar vehicles below.'
              }
            </p>
            <Link href="/cars" className="ml-auto text-sm font-semibold text-primary hover:text-primary-dark whitespace-nowrap">
              Browse Similar
            </Link>
          </div>

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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  {car.year} {car.make} {car.model}
                </h1>

                {/* AI Deal Summary or legacy About This Vehicle + FAQ */}
                <AIDealSummary
                  description={car.description}
                  make={car.make}
                  model={car.model}
                  year={car.year}
                  mileage={car.mileage}
                  color={car.color}
                  transmission={car.transmission}
                  fuelType={car.fuelType || undefined}
                  condition={car.condition || undefined}
                  bodyType={car.bodyType || undefined}
                  salePrice={car.salePrice}
                  features={car.features || undefined}
                />

                {/* VIN */}
                <div className="border-t pt-4 mt-6">
                  <p className="text-sm text-gray-500 break-all">
                    <span className="font-semibold">VIN:</span> {car.vin}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Vehicle Info Card & Similar */}
            <div className="space-y-6 min-w-0">
              {/* Vehicle Info Card (no CTA for sold) */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Status Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                  car.status === 'sold' ? 'bg-green-100 text-green-700' : car.status === 'removed' ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {car.status === 'sold' ? 'SOLD' : car.status === 'removed' ? 'No Longer Available' : 'Reserved'}
                </div>

                {/* Price */}
                <p className="text-3xl font-bold text-gray-400 line-through mb-3">
                  {formatPrice(car.salePrice)}
                </p>

                {/* Key Specs */}
                <div className="flex flex-wrap gap-2 mb-4 text-sm">
                  <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                    <Gauge className="w-3.5 h-3.5 text-primary" />
                    {car.mileage.toLocaleString()} mi
                  </span>
                  <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                    <Settings className="w-3.5 h-3.5 text-primary" />
                    {car.transmission}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                    <Fuel className="w-3.5 h-3.5 text-primary" />
                    {car.fuelType || 'Gasoline'}
                  </span>
                  {car.mpgCity && car.mpgHighway && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      {car.mpgCity}/{car.mpgHighway} MPG
                    </span>
                  )}
                  {car.doors && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                      <DoorOpen className="w-3.5 h-3.5 text-primary" />
                      {car.doors} Door
                    </span>
                  )}
                </div>

                <div className="border-t pt-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Sold By</h3>
                  <p className="font-semibold text-gray-900">{car.dealer.businessName}</p>
                  <p className="text-gray-600 flex items-center gap-1 mt-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    {car.city}, {car.state}
                  </p>
                </div>

                {/* Browse similar instead of Check Availability */}
                <Link
                  href={`/cars?make=${encodeURIComponent(car.make)}`}
                  className="block w-full text-center bg-primary text-white py-3 rounded-pill font-semibold hover:bg-primary-dark transition"
                >
                  Browse Similar {car.make} Vehicles
                </Link>
              </div>

              {/* Similar Vehicles */}
              {carsToShow.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Vehicles Available</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {carsToShow.map((v) => {
                      let photoUrl = '';
                      try { photoUrl = JSON.parse(v.photos || '[]')[0] || ''; } catch {}
                      return (
                        <Link key={v.id} href={`/cars/${v.slug || v.id}`} className="group">
                          <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden mb-2">
                            {photoUrl ? (
                              <Image src={photoUrl} alt={`${v.year} ${v.make} ${v.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="150px" />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                                <span className="text-gray-400 text-xs">No Photo</span>
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-sm text-gray-900 truncate">{v.year} {v.make} {v.model}</p>
                          {v.trim && <p className="text-xs text-gray-500 truncate">{v.trim}</p>}
                          <p className="text-sm font-bold text-primary">{formatPrice(v.salePrice)}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Browse All CTA */}
          <div className="text-center mt-12">
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
        features={car.features || undefined}
        fuelType={car.fuelType || undefined}
        numberOfDoors={car.doors || undefined}
        mpgCity={car.mpgCity || undefined}
        mpgHighway={car.mpgHighway || undefined}
        drivetrain={car.drivetrain || undefined}
        condition={car.condition || undefined}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                {car.year} {car.make} {car.model}
              </h1>

              {/* AI Deal Summary or legacy About This Vehicle + FAQ */}
              <AIDealSummary
                description={car.description}
                make={car.make}
                model={car.model}
                year={car.year}
                mileage={car.mileage}
                color={car.color}
                transmission={car.transmission}
                fuelType={car.fuelType || undefined}
                condition={car.condition || undefined}
                bodyType={car.bodyType || undefined}
                salePrice={car.salePrice}
                features={car.features || undefined}
              />

              {/* VIN */}
              <div className="border-t pt-4 mt-6">
                <p className="text-sm text-gray-500 break-all">
                  <span className="font-semibold">VIN:</span> {car.vin}
                </p>
              </div>
            </div>

          </div>

          {/* Right: Dealer Card & Recommendations */}
          <div className="space-y-6 min-w-0">
            {/* Dealer Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Price */}
              <p className="text-3xl font-bold text-primary mb-3">
                {formatPrice(car.salePrice)}
              </p>

              {/* Key Specs */}
              <div className="flex flex-wrap gap-2 mb-4 text-sm">
                <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                  <Gauge className="w-3.5 h-3.5 text-primary" />
                  {car.mileage.toLocaleString()} mi
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                  <Settings className="w-3.5 h-3.5 text-primary" />
                  {car.transmission}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                  <Fuel className="w-3.5 h-3.5 text-primary" />
                  {car.fuelType || 'Gasoline'}
                </span>
                {car.mpgCity && car.mpgHighway && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    {car.mpgCity}/{car.mpgHighway} MPG
                  </span>
                )}
                {car.doors && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                    <DoorOpen className="w-3.5 h-3.5 text-primary" />
                    {car.doors} Door
                  </span>
                )}
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sold By</h3>
                <p className="font-semibold text-gray-900">{car.dealer.businessName}</p>
                <p className="text-gray-600 flex items-center gap-1 mt-1 text-sm">
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

            {/* Similar Vehicles */}
            {similarVehicles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Vehicles You Might Like</h3>
                <div className="grid grid-cols-2 gap-3">
                  {similarVehicles.map((v) => {
                    let photoUrl = '';
                    try { photoUrl = JSON.parse(v.photos || '[]')[0] || ''; } catch {}
                    return (
                      <Link key={v.id} href={`/cars/${v.slug || v.id}`} className="group">
                        <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden mb-2">
                          {photoUrl ? (
                            <Image src={photoUrl} alt={`${v.year} ${v.make} ${v.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="150px" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm text-gray-900 truncate">{v.year} {v.make} {v.model}</p>
                        {v.trim && <p className="text-xs text-gray-500 truncate">{v.trim}</p>}
                        <p className="text-sm font-bold text-primary">{formatPrice(v.salePrice)}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* More Same Model */}
            {sameModelVehicles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">More {car.make} {car.model}s</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sameModelVehicles.map((v) => {
                    let photoUrl = '';
                    try { photoUrl = JSON.parse(v.photos || '[]')[0] || ''; } catch {}
                    return (
                      <Link key={v.id} href={`/cars/${v.slug || v.id}`} className="group">
                        <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden mb-2">
                          {photoUrl ? (
                            <Image src={photoUrl} alt={`${v.year} ${v.make} ${v.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="150px" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm text-gray-900 truncate">{v.year} {v.make} {v.model}</p>
                        {v.trim && <p className="text-xs text-gray-500 truncate">{v.trim}</p>}
                        <p className="text-sm font-bold text-primary">{formatPrice(v.salePrice)}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Same Category / Price Range */}
            {sameCategoryVehicles.length > 0 && car.bodyType && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Other {car.bodyType}s in This Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sameCategoryVehicles.map((v) => {
                    let photoUrl = '';
                    try { photoUrl = JSON.parse(v.photos || '[]')[0] || ''; } catch {}
                    return (
                      <Link key={v.id} href={`/cars/${v.slug || v.id}`} className="group">
                        <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden mb-2">
                          {photoUrl ? (
                            <Image src={photoUrl} alt={`${v.year} ${v.make} ${v.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="150px" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm text-gray-900 truncate">{v.year} {v.make} {v.model}</p>
                        {v.trim && <p className="text-xs text-gray-500 truncate">{v.trim}</p>}
                        <p className="text-sm font-bold text-primary">{formatPrice(v.salePrice)}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
