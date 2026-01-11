'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Car, MapPin, Camera, X, ChevronLeft, ChevronRight, LogIn, Phone, Globe, ExternalLink } from 'lucide-react';
import Footer from '../components/Footer';
import CheckAvailabilityModal from '../components/CheckAvailabilityModal';
import {
  trackSearchPerformed,
  trackSearchNoResults,
  trackFilterApplied,
  trackCarGalleryOpened,
  trackCarPhotoSwiped,
  trackFunnelStep,
} from '@/lib/analytics';

interface CarListing {
  id: string;
  slug?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  city: string;
  state: string;
  salePrice: number;
  photos: string;
  description: string;
  transmission: string;
  vin: string;
  isDemo?: boolean;
  dealerId: string;
  dealer: {
    businessName: string;
    websiteUrl?: string;
  };
}

interface FilterOptions {
  makes: string[];
  years: number[];
  states: string[];
  modelsByMake: Record<string, string[]>;
  totalCount: number;
}

export default function CarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    make: '',
    model: '',
    state: 'all',  // Default to all states
    condition: 'all' // new, used, or all
  });
  const [viewingPhotos, setViewingPhotos] = useState<{ car: CarListing; photos: string[] } | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [checkingAvailability, setCheckingAvailability] = useState<CarListing | null>(null);

  // Dynamic filter options from database
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    makes: [],
    years: [],
    states: [],
    modelsByMake: {},
    totalCount: 0,
  });

  // Get models for selected make
  const availableModels = search.make
    ? filterOptions.modelsByMake[search.make.toUpperCase()] || []
    : [];

  useEffect(() => {
    // Track funnel step: search started
    trackFunnelStep({
      step: 'search_started',
      previousStep: 'homepage_landed',
    });

    // Check if user is logged in (but don't require it)
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch filter options from database
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/filters');
        const data = await res.json();
        if (data.makes) {
          setFilterOptions(data);
        }
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    };
    fetchFilters();

    loadCars();
  }, []);

  // Reset model when make changes
  useEffect(() => {
    if (search.make && search.model) {
      const models = filterOptions.modelsByMake[search.make.toUpperCase()] || [];
      if (!models.includes(search.model)) {
        setSearch((prev) => ({ ...prev, model: '' }));
      }
    }
  }, [search.make, search.model, filterOptions.modelsByMake]);

  const loadCars = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (search.make) params.append('make', search.make);
      if (search.model) params.append('model', search.model);
      if (search.state && search.state !== 'all') params.append('state', search.state);

      const res = await fetch(`/api/customer/search?${params.toString()}`);
      const data = await res.json();
      const loadedCars = data.cars || [];
      setCars(loadedCars);

      // Track search performed
      trackSearchPerformed({
        query: `${search.make} ${search.model}`.trim(),
        resultsCount: loadedCars.length,
        location: search.state,
        filters: {
          make: search.make,
          model: search.model,
          state: search.state,
          condition: search.condition,
        },
      });

      // Track if no results
      if (loadedCars.length === 0) {
        trackSearchNoResults({
          query: `${search.make} ${search.model}`.trim(),
          location: search.state,
          filters: {
            make: search.make,
            model: search.model,
            state: search.state,
            condition: search.condition,
          },
        });
      }
    } catch (error) {
      console.error('Failed to load cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeDeal = () => {
    if (!user) {
      // Redirect to login/register if not authenticated
      router.push('/register?type=customer&redirect=/cars');
    } else if (user.userType === 'customer') {
      // Redirect to customer dashboard to make a deal
      router.push('/customer');
    } else {
      alert('Only customers can request deals');
    }
  };

  const handleCheckAvailability = (car: CarListing, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckingAvailability(car);
  };

  const openPhotoGallery = (car: CarListing, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const photos = JSON.parse(car.photos || '[]');
      if (photos.length > 0) {
        setViewingPhotos({ car, photos });
        setCurrentPhotoIndex(0);

        // Track funnel step: car selected
        trackFunnelStep({
          step: 'car_selected',
          previousStep: 'search_started',
          metadata: {
            carMake: car.make,
            carModel: car.model,
            carYear: car.year,
            carPrice: car.salePrice,
          },
        });

        // Track gallery opened
        trackCarGalleryOpened({
          vin: car.id,
          make: car.make,
          model: car.model,
          photoCount: photos.length,
        });
      } else {
        alert('No photos available for this vehicle');
      }
    } catch (error) {
      alert('Unable to load photos');
    }
  };

  const closePhotoGallery = () => {
    setViewingPhotos(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (viewingPhotos) {
      const newIndex = (currentPhotoIndex + 1) % viewingPhotos.photos.length;
      setCurrentPhotoIndex(newIndex);

      // Track photo swiped
      trackCarPhotoSwiped({
        vin: viewingPhotos.car.id,
        photoIndex: newIndex,
        totalPhotos: viewingPhotos.photos.length,
      });
    }
  };

  const prevPhoto = () => {
    if (viewingPhotos) {
      const newIndex = currentPhotoIndex === 0 ? viewingPhotos.photos.length - 1 : currentPhotoIndex - 1;
      setCurrentPhotoIndex(newIndex);

      // Track photo swiped
      trackCarPhotoSwiped({
        vin: viewingPhotos.car.id,
        photoIndex: newIndex,
        totalPhotos: viewingPhotos.photos.length,
      });
    }
  };

  // Filter change handlers with tracking
  const handleFilterChange = (filterType: string, value: string) => {
    setSearch(prev => ({ ...prev, [filterType]: value }));

    // Track filter applied
    if (value) {
      trackFilterApplied({
        filterType,
        filterValue: value,
        resultsCount: filteredCars.length,
      });
    }
  };

  const filteredCars = cars.filter(car => {
    const makeMatch = !search.make || car.make.toLowerCase().includes(search.make.toLowerCase());
    const modelMatch = !search.model || car.model.toLowerCase().includes(search.model.toLowerCase());
    const stateMatch = search.state === 'all' || car.state === search.state;
    return makeMatch && modelMatch && stateMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl font-bold text-primary">
              IQ Auto Deals
            </div>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <Link href="/cars" className="text-primary border-b-2 border-primary pb-1">
              Cars for Sale
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
              Research & Reviews
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
              News & Videos
            </Link>
            <Link href="/guides/car-financing-guide" className="text-gray-300 hover:text-primary transition-colors">
              Financing
            </Link>
          </nav>
          <div className="flex gap-3">
            {user ? (
              <Link
                href={user.userType === 'customer' ? '/customer' : '/dealer'}
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-primary px-5 py-2.5 rounded-lg transition-colors font-semibold flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-6">
          Used Cars for Sale - Browse Quality Pre-Owned Vehicles
        </h1>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-dark">
            <Search className="w-6 h-6 text-primary" />
            Search Inventory
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Browse thousands of vehicles. {!user && 'Sign up to request deals from dealers.'}
          </p>

          <div className="grid md:grid-cols-5 gap-4">
            <select
              value={search.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
            >
              <option value="all">New/Used</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>

            <select
              value={search.make}
              onChange={(e) => {
                handleFilterChange('make', e.target.value);
                setSearch(prev => ({ ...prev, make: e.target.value, model: '' }));
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
            >
              <option value="">All Makes ({filterOptions.makes.length})</option>
              {filterOptions.makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>

            <select
              value={search.model}
              onChange={(e) => handleFilterChange('model', e.target.value)}
              disabled={!search.make}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {search.make ? `All ${search.make} Models (${availableModels.length})` : 'Select Make First'}
              </option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            <select
              value={search.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
            >
              <option value="all">All States ({filterOptions.states.length})</option>
              {filterOptions.states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <button
              onClick={loadCars}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Show Matches
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark">
            {loading ? 'Loading...' : `${filteredCars.length} Cars Available`}
          </h2>
          {!user && filteredCars.length > 0 && (
            <p className="text-gray-600 mt-2">
              <Link href="/register?type=customer" className="text-primary font-semibold hover:underline">
                Create a free account
              </Link> to request competitive deals from dealers
            </p>
          )}
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading inventory...</div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-dark">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search filters to see more results</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => {
              let photoUrl = '';
              try {
                const photos = JSON.parse(car.photos || '[]');
                photoUrl = photos[0] || '';
              } catch (e) {
                console.error('Failed to parse photos:', e);
              }

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={(e) => openPhotoGallery(car, e)}>
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={`${car.year} ${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <Car className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                      <Camera className="w-3 h-3 inline mr-1" />
                      View Photos
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-dark">
                        {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}`}
                      </h3>
                      {car.isDemo && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          Sample
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      ${car.salePrice.toLocaleString()}
                    </p>
                    <div className="text-sm text-gray-600 mb-1">
                      <Car className="w-4 h-4 inline mr-1" />
                      {car.color} • {car.mileage.toLocaleString()} mi
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {car.city}, {car.state}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{car.dealer.businessName}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleCheckAvailability(car, e)}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        Check Availability - Test Drive
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Check Availability Modal */}
      {checkingAvailability && (
        <CheckAvailabilityModal
          car={checkingAvailability}
          user={user}
          onClose={() => setCheckingAvailability(null)}
        />
      )}
      </div>

      {/* Vehicle Details Modal */}
      {viewingPhotos && (
        <div
          className="fixed inset-0 bg-black/80 z-50 lg:flex lg:items-center lg:justify-center lg:p-4"
          onClick={closePhotoGallery}
        >
          <div
            className="relative w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-7xl bg-white lg:rounded-xl overflow-hidden flex flex-col lg:block"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePhotoGallery}
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex-1 overflow-y-auto lg:overflow-visible lg:grid lg:grid-cols-5">
              {/* Left: Photo Gallery - takes 3 columns */}
              <div className="relative bg-gray-900 lg:col-span-3">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={viewingPhotos.photos[currentPhotoIndex]}
                    alt={`${viewingPhotos.car.year} ${viewingPhotos.car.make} ${viewingPhotos.car.model} - Photo ${currentPhotoIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />

                  {/* Photo Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentPhotoIndex + 1} / {viewingPhotos.photos.length}
                  </div>

                  {/* Navigation Arrows */}
                  {viewingPhotos.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {viewingPhotos.photos.length > 1 && (
                  <div className="flex gap-1 p-2 overflow-x-auto bg-gray-800">
                    {viewingPhotos.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden transition ${
                          index === currentPhotoIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Vehicle Details - takes 2 columns */}
              <div className="p-4 pb-24 lg:pb-8 lg:p-8 lg:overflow-y-auto lg:max-h-[80vh] lg:col-span-2">
                {/* Title & Price */}
                <div className="mb-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-dark mb-2">
                    {viewingPhotos.car.year} {viewingPhotos.car.make} {viewingPhotos.car.model}
                  </h2>
                  <p className="text-3xl lg:text-4xl font-bold text-primary">
                    ${viewingPhotos.car.salePrice.toLocaleString()}
                  </p>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Mileage</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.mileage.toLocaleString()} mi</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Transmission</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.transmission || 'Automatic'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Exterior Color</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.color}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.city}, {viewingPhotos.car.state}</p>
                  </div>
                </div>

                {/* Description */}
                {viewingPhotos.car.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-dark mb-2">About This Vehicle</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {viewingPhotos.car.description}
                    </p>
                  </div>
                )}

                {/* Dealer Info */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sold By</p>
                  <p className="font-semibold text-dark">{viewingPhotos.car.dealer.businessName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {viewingPhotos.car.city}, {viewingPhotos.car.state}
                  </p>
                  {viewingPhotos.car.dealer.websiteUrl && (
                    <a
                      href={viewingPhotos.car.dealer.websiteUrl}
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

                {/* CTA Buttons - Desktop only (mobile has fixed bottom bar) */}
                <div className="hidden lg:block space-y-3">
                  <button
                    onClick={(e) => {
                      closePhotoGallery();
                      handleCheckAvailability(viewingPhotos.car, e);
                    }}
                    className="w-full bg-primary text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Check Availability - Schedule Test Drive
                  </button>
                  <Link
                    href={`/cars/${viewingPhotos.car.slug}`}
                    className="w-full border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    View Full Listing
                  </Link>
                  {!user && (
                    <p className="text-center text-sm text-gray-600">
                      <Link href="/register?type=customer" className="text-primary font-semibold hover:underline">
                        Create a free account
                      </Link> to request competitive deals
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Fixed Bottom CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2 safe-area-bottom">
              <button
                onClick={(e) => {
                  closePhotoGallery();
                  handleCheckAvailability(viewingPhotos.car, e);
                }}
                className="w-full bg-primary text-white px-4 py-3 rounded-lg font-bold text-base hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Check Availability - Test Drive
              </button>
              <Link
                href={`/cars/${viewingPhotos.car.slug}`}
                className="w-full border-2 border-primary text-primary px-4 py-2.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
              >
                View Full Listing
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
