'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Car, MapPin, Camera, X, ChevronLeft, ChevronRight, LogIn, Phone, Globe, ExternalLink, Sparkles, TrendingDown, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import Footer from '../components/Footer';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import CheckAvailabilityModal from '../components/CheckAvailabilityModal';
import {
  trackSearchPerformed,
  trackSearchNoResults,
  trackFilterApplied,
  trackCarGalleryOpened,
  trackCarPhotoSwiped,
  trackFunnelStep,
} from '@/lib/analytics';
import { formatPrice } from '@/lib/format';

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
  fuelType?: string;
  bodyType?: string;
  vin: string;
  isDemo?: boolean;
  dealerId: string;
  distance?: number | null; // Distance in miles from searched zipcode
  dealer: {
    businessName: string;
    websiteUrl?: string;
  };
}

// Helper function to get placeholder image based on body type
function getPlaceholderImage(bodyType?: string): string {
  if (bodyType?.toLowerCase().includes('truck') ||
      bodyType?.toLowerCase().includes('cab') ||
      bodyType?.toLowerCase().includes('pickup')) {
    return '/placeholder_IQ_Truck.png';
  }
  return '/placeholder_IQ_Car.png';
}

interface FilterOptions {
  makes: string[];
  years: number[];
  states: string[];
  fuelTypes: string[];
  modelsByMake: Record<string, string[]>;
  totalCount: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export default function CarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    q: searchParams.get('q') || '', // Free-text search query
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    state: searchParams.get('state') || 'all',
    condition: searchParams.get('condition') || 'all',
    fuelType: searchParams.get('fuelType') || 'all',
    bodyType: searchParams.get('bodyType') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    zipCode: searchParams.get('zipCode') || '',
  });
  const [viewingPhotos, setViewingPhotos] = useState<{ car: CarListing; photos: string[] } | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [checkingAvailability, setCheckingAvailability] = useState<CarListing | null>(null);

  // TrueCar-style filter panel state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    distance: true,
    price: true,
    state: false,
    bodyType: false,
    condition: false,
  });
  const [searchRadius, setSearchRadius] = useState(75);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Dynamic filter options from database
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    makes: [],
    years: [],
    states: [],
    fuelTypes: [],
    modelsByMake: {},
    totalCount: 0,
    priceRange: { min: 0, max: 100000 },
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

  // Reload when URL params change (e.g., clicking New Vehicles / Used Vehicles links, or search query)
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    const urlCondition = searchParams.get('condition') || 'all';
    const urlMake = searchParams.get('make') || '';
    const urlModel = searchParams.get('model') || '';
    const urlZipCode = searchParams.get('zipCode') || '';
    const urlBodyType = searchParams.get('bodyType') || 'all';
    const urlFuelType = searchParams.get('fuelType') || 'all';

    // Update state and reload if URL params changed
    const newSearch = {
      ...search,
      q: urlQ,
      condition: urlCondition,
      make: urlMake,
      model: urlModel,
      zipCode: urlZipCode,
      bodyType: urlBodyType,
      fuelType: urlFuelType,
    };

    if (urlQ !== search.q || urlCondition !== search.condition || urlMake !== search.make || urlModel !== search.model || urlZipCode !== search.zipCode || urlBodyType !== search.bodyType || urlFuelType !== search.fuelType) {
      setSearch(newSearch);
      loadCarsWithParams(newSearch);
    }
  }, [searchParams]);

  const loadCarsWithParams = async (searchOverride?: typeof search) => {
    const currentSearch = searchOverride || search;
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (currentSearch.q) params.append('q', currentSearch.q); // Free-text search
      if (currentSearch.make) params.append('make', currentSearch.make);
      if (currentSearch.model) params.append('model', currentSearch.model);
      if (currentSearch.state && currentSearch.state !== 'all') params.append('state', currentSearch.state);
      if (currentSearch.condition && currentSearch.condition !== 'all') params.append('condition', currentSearch.condition);
      if (currentSearch.bodyType && currentSearch.bodyType !== 'all') params.append('bodyType', currentSearch.bodyType);
      if (currentSearch.fuelType && currentSearch.fuelType !== 'all') params.append('fuelType', currentSearch.fuelType);
      if (currentSearch.minPrice) params.append('minPrice', currentSearch.minPrice);
      if (currentSearch.maxPrice) params.append('maxPrice', currentSearch.maxPrice);
      if (currentSearch.zipCode) {
        params.append('zipCode', currentSearch.zipCode);
        params.append('radius', searchRadius.toString());
      }

      const res = await fetch(`/api/customer/search?${params.toString()}`);
      const data = await res.json();
      const loadedCars = data.cars || [];
      setCars(loadedCars);

      // Track search performed
      trackSearchPerformed({
        query: `${currentSearch.make} ${currentSearch.model}`.trim(),
        resultsCount: loadedCars.length,
        location: currentSearch.state,
        filters: {
          make: currentSearch.make,
          model: currentSearch.model,
          state: currentSearch.state,
          condition: currentSearch.condition,
          fuelType: currentSearch.fuelType,
        },
      });

      // Track if no results
      if (loadedCars.length === 0) {
        trackSearchNoResults({
          query: `${currentSearch.make} ${currentSearch.model}`.trim(),
          location: currentSearch.state,
          filters: {
            make: currentSearch.make,
            model: currentSearch.model,
            state: currentSearch.state,
            condition: currentSearch.condition,
          },
        });
      }
    } catch (error) {
      console.error('Failed to load cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCars = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (search.q) params.append('q', search.q); // Free-text search
      if (search.make) params.append('make', search.make);
      if (search.model) params.append('model', search.model);
      if (search.state && search.state !== 'all') params.append('state', search.state);
      if (search.condition && search.condition !== 'all') params.append('condition', search.condition);
      if (search.bodyType && search.bodyType !== 'all') params.append('bodyType', search.bodyType);
      if (search.fuelType && search.fuelType !== 'all') params.append('fuelType', search.fuelType);
      if (search.minPrice) params.append('minPrice', search.minPrice);
      if (search.maxPrice) params.append('maxPrice', search.maxPrice);
      if (search.zipCode) {
        params.append('zipCode', search.zipCode);
        params.append('radius', searchRadius.toString());
      }

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
          bodyType: search.bodyType,
          fuelType: search.fuelType,
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
            bodyType: search.bodyType,
            fuelType: search.fuelType,
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
        // No photos - navigate to car detail page instead
        router.push(`/cars/${car.slug || car.id}`);
      }
    } catch (error) {
      // Error parsing photos - navigate to car detail page
      router.push(`/cars/${car.slug || car.id}`);
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
    const fuelTypeMatch = search.fuelType === 'all' || (car.fuelType || 'Gasoline') === search.fuelType;
    const minPriceMatch = !search.minPrice || car.salePrice >= parseInt(search.minPrice, 10);
    const maxPriceMatch = !search.maxPrice || car.salePrice <= parseInt(search.maxPrice, 10);
    // Filter by distance if zipcode is entered
    const distanceMatch = !search.zipCode || car.distance === null || car.distance === undefined || car.distance <= searchRadius;
    return makeMatch && modelMatch && stateMatch && fuelTypeMatch && minPriceMatch && maxPriceMatch && distanceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <Link href="/cars?condition=new" className={search.condition === 'new' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-300 hover:text-primary transition-colors'}>
              New Vehicles
            </Link>
            <Link href="/cars?condition=used" className={search.condition === 'used' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-300 hover:text-primary transition-colors'}>
              Used Vehicles
            </Link>
            <Link href="/for-dealers" className="text-gray-300 hover:text-primary transition-colors">
              For Dealers
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
              Research & Reviews
            </Link>
            <Link href="/guides/car-financing-guide" className="text-gray-300 hover:text-primary transition-colors">
              Financing
            </Link>
          </nav>
          <div className="flex gap-3">
            {user ? (
              <Link
                href={user.userType === 'customer' ? '/customer' : '/dealer'}
                className="bg-primary text-white px-6 py-2.5 rounded-pill hover:bg-primary-dark transition-colors font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white border border-gray-600 hover:border-white px-5 py-2.5 rounded-pill transition-colors font-semibold flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-6 py-2.5 rounded-pill hover:bg-primary-dark transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Filters Button */}
      <div className="lg:hidden sticky top-20 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">FILTERS</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              {/* Mobile Filter Content - Same as sidebar */}
              {/* Brand Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('brand')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold text-lg">Brand</span>
                  {openSections.brand ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.brand && (
                  <div className="mt-4 space-y-3">
                    <select
                      value={search.make}
                      onChange={(e) => setSearch(prev => ({ ...prev, make: e.target.value, model: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">All Makes</option>
                      {filterOptions.makes.map((make) => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                    <select
                      value={search.model}
                      onChange={(e) => setSearch(prev => ({ ...prev, model: e.target.value }))}
                      disabled={!search.make}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    >
                      <option value="">{search.make ? 'All Models' : 'Select Make First'}</option>
                      {availableModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Distance Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('distance')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold text-lg">Distance</span>
                  {openSections.distance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.distance && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">ZIP Code</label>
                      <input
                        type="text"
                        value={search.zipCode}
                        onChange={(e) => setSearch(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                        placeholder="Enter ZIP"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Search radius</label>
                      <div className="text-center font-semibold mt-1">{searchRadius} miles</div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        value={searchRadius}
                        onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                        className="w-full mt-2 accent-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold text-lg">Price</span>
                  {openSections.price ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.price && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Min price</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={search.minPrice ? parseInt(search.minPrice).toLocaleString() : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearch(prev => ({ ...prev, minPrice: value }));
                          }}
                          placeholder="Min"
                          className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Max price</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={search.maxPrice ? parseInt(search.maxPrice).toLocaleString() : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearch(prev => ({ ...prev, maxPrice: value }));
                          }}
                          placeholder="Max"
                          className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* State Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('state')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold text-lg">State</span>
                  {openSections.state ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.state && (
                  <div className="mt-4">
                    <select
                      value={search.state}
                      onChange={(e) => setSearch(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="all">All States</option>
                      {filterOptions.states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Body Type Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('bodyType')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold text-lg">Body Type</span>
                  {openSections.bodyType ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.bodyType && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Minivan', 'Wagon', 'Van', 'Crossover'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSearch(prev => ({ ...prev, bodyType: prev.bodyType === type ? 'all' : type }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          search.bodyType === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Condition Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('condition')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold text-lg">Condition</span>
                  {openSections.condition ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.condition && (
                  <div className="mt-4 flex gap-2">
                    {['all', 'new', 'used'].map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setSearch(prev => ({ ...prev, condition: cond }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          search.condition === cond ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cond === 'all' ? 'All' : cond.charAt(0).toUpperCase() + cond.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button
                onClick={() => {
                  setSearch({ q: '', make: '', model: '', state: 'all', condition: 'all', fuelType: 'all', bodyType: 'all', minPrice: '', maxPrice: '', zipCode: '' });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-50"
              >
                Clear all
              </button>
              <button
                onClick={() => {
                  loadCars();
                  setShowMobileFilters(false);
                }}
                className="flex-1 px-4 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">
          {search.fuelType && search.fuelType !== 'all'
            ? `${search.fuelType} Vehicles for Sale`
            : search.bodyType && search.bodyType !== 'all'
            ? `${search.bodyType}s for Sale`
            : search.condition === 'new'
            ? 'New Vehicles for Sale'
            : search.condition === 'used'
            ? 'Used Cars for Sale'
            : 'Cars for Sale'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              {/* Brand Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('brand')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Brand</span>
                  {openSections.brand ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.brand && (
                  <div className="mt-3 space-y-2">
                    <select
                      value={search.make}
                      onChange={(e) => {
                        setSearch(prev => ({ ...prev, make: e.target.value, model: '' }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">All Makes</option>
                      {filterOptions.makes.map((make) => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                    <select
                      value={search.model}
                      onChange={(e) => setSearch(prev => ({ ...prev, model: e.target.value }))}
                      disabled={!search.make}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    >
                      <option value="">{search.make ? 'All Models' : 'Select Make First'}</option>
                      {availableModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Distance Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('distance')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Distance</span>
                  {openSections.distance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.distance && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={search.zipCode}
                        onChange={(e) => setSearch(prev => ({ ...prev, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                        placeholder="Enter ZIP"
                        maxLength={5}
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Search radius</div>
                      <div className="text-center font-semibold text-sm">{searchRadius} miles</div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        value={searchRadius}
                        onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                        className="w-full mt-1 accent-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Price</span>
                  {openSections.price ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.price && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Min price</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="text"
                          value={search.minPrice ? parseInt(search.minPrice).toLocaleString() : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearch(prev => ({ ...prev, minPrice: value }));
                          }}
                          placeholder="Min"
                          className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Max price</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="text"
                          value={search.maxPrice ? parseInt(search.maxPrice).toLocaleString() : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearch(prev => ({ ...prev, maxPrice: value }));
                          }}
                          placeholder="Max"
                          className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* State Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('state')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">State</span>
                  {openSections.state ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.state && (
                  <div className="mt-3">
                    <select
                      value={search.state}
                      onChange={(e) => setSearch(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="all">All States</option>
                      {filterOptions.states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Body Type Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('bodyType')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Body Type</span>
                  {openSections.bodyType ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.bodyType && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Minivan', 'Wagon', 'Van', 'Crossover'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSearch(prev => ({ ...prev, bodyType: prev.bodyType === type ? 'all' : type }))}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          search.bodyType === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Condition Section */}
              <div className="border-b border-gray-200 py-4">
                <button onClick={() => toggleSection('condition')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Condition</span>
                  {openSections.condition ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openSections.condition && (
                  <div className="mt-3 flex gap-1.5">
                    {['all', 'new', 'used'].map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setSearch(prev => ({ ...prev, condition: cond }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          search.condition === cond ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cond === 'all' ? 'All' : cond.charAt(0).toUpperCase() + cond.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Apply & Clear Buttons */}
              <div className="py-4 space-y-2">
                <button
                  onClick={loadCars}
                  className="w-full px-4 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Apply filters
                </button>
                <button
                  onClick={() => {
                    setSearch({ q: '', make: '', model: '', state: 'all', condition: 'all', fuelType: 'all', bodyType: 'all', minPrice: '', maxPrice: '', zipCode: '' });
                    router.push('/cars');
                  }}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-lg font-semibold">
                {loading ? 'Loading...' : `${filteredCars.length} Listings`}
              </p>
            </div>

            {/* Cars Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading inventory...</div>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dark">No vehicles found</h3>
                <p className="text-gray-600">Try adjusting your search filters to see more results</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={(e) => openPhotoGallery(car, e)}>
                    <Image
                      src={photoUrl || getPlaceholderImage(car.bodyType)}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-pill text-xs font-semibold backdrop-blur-sm">
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
                      {formatPrice(car.salePrice)}
                    </p>
                    <div className="text-sm text-gray-600 mb-1">
                      <Car className="w-4 h-4 inline mr-1" />
                      {car.color} • {car.mileage.toLocaleString()} mi
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {car.city}, {car.state}
                      {car.distance !== null && car.distance !== undefined && (
                        <span className="ml-2 text-primary font-medium">
                          ({car.distance} mi away)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{car.dealer.businessName}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleCheckAvailability(car, e)}
                        className="flex-1 bg-primary text-white px-4 py-2.5 rounded-pill font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
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
          </main>
        </div>
      </div>

      {/* Check Availability Modal */}
      {checkingAvailability && (
        <CheckAvailabilityModal
          car={checkingAvailability}
          user={user}
          onClose={() => setCheckingAvailability(null)}
        />
      )}

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
                    {formatPrice(viewingPhotos.car.salePrice)}
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
                    className="w-full bg-primary text-white px-6 py-4 rounded-pill font-bold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Check Availability - Schedule Test Drive
                  </button>
                  <Link
                    href={`/cars/${viewingPhotos.car.slug || viewingPhotos.car.id}`}
                    className="w-full border-2 border-primary text-primary px-6 py-3 rounded-pill font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
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
                className="w-full bg-primary text-white px-4 py-3 rounded-pill font-bold text-base hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Check Availability - Test Drive
              </button>
              <Link
                href={`/cars/${viewingPhotos.car.slug || viewingPhotos.car.id}`}
                className="w-full border-2 border-primary text-primary px-4 py-2.5 rounded-pill font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
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
