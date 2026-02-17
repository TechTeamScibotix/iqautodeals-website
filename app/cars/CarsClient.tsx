'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Car, MapPin, Camera, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LogIn, Globe, ExternalLink, Sparkles, TrendingDown, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import Footer from '../components/Footer';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import CheckAvailabilityModal from '../components/CheckAvailabilityModal';
import DealerWebsiteLink from '../components/DealerWebsiteLink';
import RequestPhotosModal from '../components/RequestPhotosModal';
import {
  trackSearchPerformed,
  trackSearchNoResults,
  trackFilterApplied,
  trackCarGalleryOpened,
  trackCarPhotoSwiped,
  trackFunnelStep,
} from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import {
  generateStandsOutPoints,
  generateBuyerPersonas,
  parseStructuredDescription,
} from '../components/AIDealSummary';

/**
 * Extract a clean preview paragraph from a car description.
 * Strips ## headings (new format) and **bold** patterns (old format)
 * so the modal shows a concise summary without raw markdown artifacts.
 */
function getDescriptionPreview(description: string): string {
  // New structured format: extract first section content only
  if (description.includes('## ')) {
    const parts = description.split(/^## /m).filter(Boolean);
    if (parts.length >= 3) {
      const firstPart = parts[0];
      const newlineIndex = firstPart.indexOf('\n');
      if (newlineIndex !== -1) {
        return firstPart.slice(newlineIndex + 1).trim();
      }
    }
  }

  // Old format with **bold questions**: show only the prose before first question
  const questionMatch = description.match(/\*\*[^*]+\?\*\*/);
  if (questionMatch && questionMatch.index !== undefined) {
    const prose = description.slice(0, questionMatch.index).trim();
    if (prose) return prose;
  }

  return description;
}

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
  trim?: string;
  drivetrain?: string;
  engine?: string;
  interiorColor?: string;
  vin: string;
  isDemo?: boolean;
  dealerId: string;
  features?: string;
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

// Helper function to check if car has real photos
function hasRealPhotos(photosJson: string): boolean {
  try {
    const photos = JSON.parse(photosJson || '[]');
    return photos.length > 0 && photos[0];
  } catch {
    return false;
  }
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

export default function CarsClient() {
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
  const [requestingPhotos, setRequestingPhotos] = useState<CarListing | null>(null);
  const [similarCars, setSimilarCars] = useState<CarListing[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Filter panel state
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

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
      // If no photos, use placeholder image
      const displayPhotos = photos.length > 0 ? photos : [getPlaceholderImage(car.bodyType)];

      setViewingPhotos({ car, photos: displayPhotos });
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
    } catch (error) {
      // Error parsing photos - use placeholder
      setViewingPhotos({ car, photos: [getPlaceholderImage(car.bodyType)] });
      setCurrentPhotoIndex(0);
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

  // Distance filtering is handled server-side by the search API (with fallback to
  // all cars sorted by closest when 0 are within radius). Do NOT re-filter by
  // distance here — the API already returns the best set of results.
  const filteredCars = cars.filter(car => {
    const makeMatch = !search.make || car.make.toLowerCase().includes(search.make.toLowerCase());
    const modelMatch = !search.model || car.model.toLowerCase().includes(search.model.toLowerCase());
    const stateMatch = search.state === 'all' || car.state === search.state;
    const fuelTypeMatch = search.fuelType === 'all' || (car.fuelType || 'Gasoline') === search.fuelType;
    const minPriceMatch = !search.minPrice || car.salePrice >= parseInt(search.minPrice, 10);
    const maxPriceMatch = !search.maxPrice || car.salePrice <= parseInt(search.maxPrice, 10);
    return makeMatch && modelMatch && stateMatch && fuelTypeMatch && minPriceMatch && maxPriceMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  // Fetch similar vehicles when no results found
  useEffect(() => {
    if (loading || filteredCars.length > 0) {
      setSimilarCars([]);
      return;
    }

    // Only fetch if we have some active filters (not a bare /cars page with zero inventory)
    const hasFilters = search.make || search.model || search.q ||
      (search.bodyType && search.bodyType !== 'all') ||
      (search.fuelType && search.fuelType !== 'all') ||
      (search.condition && search.condition !== 'all') ||
      search.minPrice || search.maxPrice;
    if (!hasFilters) return;

    let cancelled = false;
    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        // Tier 1: Same make, drop model
        if (search.make) {
          const params = new URLSearchParams({ make: search.make });
          const res = await fetch(`/api/customer/search?${params}`);
          const data = await res.json();
          if (!cancelled && data.cars?.length > 0) {
            setSimilarCars(data.cars.slice(0, 8));
            setLoadingSimilar(false);
            return;
          }
        }

        // Tier 2: Same bodyType, drop make+model
        if (search.bodyType && search.bodyType !== 'all') {
          const params = new URLSearchParams({ bodyType: search.bodyType });
          const res = await fetch(`/api/customer/search?${params}`);
          const data = await res.json();
          if (!cancelled && data.cars?.length > 0) {
            setSimilarCars(data.cars.slice(0, 8));
            setLoadingSimilar(false);
            return;
          }
        }

        // Tier 3: No filters — popular/recent inventory
        const res = await fetch('/api/customer/search');
        const data = await res.json();
        if (!cancelled && data.cars?.length > 0) {
          setSimilarCars(data.cars.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to load similar vehicles:', err);
      } finally {
        if (!cancelled) setLoadingSimilar(false);
      }
    };

    fetchSimilar();
    return () => { cancelled = true; };
  }, [loading, filteredCars.length, search.make, search.model, search.q, search.bodyType, search.fuelType, search.condition, search.minPrice, search.maxPrice]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search.make, search.model, search.state, search.condition, search.fuelType, search.bodyType, search.minPrice, search.maxPrice, search.zipCode, searchRadius]);

  // Page navigation handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

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
                  const cleared = { q: '', make: '', model: '', state: 'all', condition: 'all', fuelType: 'all', bodyType: 'all', minPrice: '', maxPrice: '', zipCode: '' };
                  setSearch(cleared);
                  router.push('/cars');
                  loadCarsWithParams(cleared);
                  setShowMobileFilters(false);
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
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">
          {search.fuelType && search.fuelType !== 'all'
            ? `${search.fuelType} Vehicles for Sale`
            : search.bodyType && search.bodyType !== 'all'
            ? `${search.bodyType}s for Sale`
            : search.condition === 'new'
            ? 'New Vehicles for Sale'
            : search.condition === 'used'
            ? 'Used Cars for Sale'
            : 'Cars for Sale'}
        </h2>

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
                    const cleared = { q: '', make: '', model: '', state: 'all', condition: 'all', fuelType: 'all', bodyType: 'all', minPrice: '', maxPrice: '', zipCode: '' };
                    setSearch(cleared);
                    router.push('/cars');
                    loadCarsWithParams(cleared);
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
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-semibold">
                {loading ? 'Loading...' : `${filteredCars.length} Listings`}
              </p>
              {!loading && totalPages > 1 && (
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Cars Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading inventory...</div>
              </div>
            ) : filteredCars.length === 0 ? (
              <div>
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-dark">No vehicles found</h3>
                  <p className="text-gray-600">Try adjusting your search filters to see more results</p>
                </div>

                {/* Similar Vehicles Section */}
                {loadingSimilar && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-dark mb-4">Similar Vehicles You Might Like</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                          <div className="aspect-[4/3] bg-gray-200" />
                          <div className="p-2 md:p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                            <div className="h-10 bg-gray-200 rounded-full w-full mt-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loadingSimilar && similarCars.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-dark mb-4">Similar Vehicles You Might Like</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {similarCars.map((car) => {
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
                            <div className="relative aspect-[4/3] bg-gray-200 cursor-pointer" onClick={(e) => openPhotoGallery(car, e)}>
                              <Image
                                src={photoUrl || getPlaceholderImage(car.bodyType)}
                                alt={`${car.year} ${car.make} ${car.model}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              />
                              {photoUrl && (
                                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-pill text-[10px] md:text-xs font-semibold backdrop-blur-sm">
                                  <Camera className="w-3 h-3 inline mr-1" />
                                  <span className="hidden sm:inline">View Photos</span>
                                  <span className="sm:hidden">Photos</span>
                                </div>
                              )}
                            </div>

                            <div className="p-2 md:p-4">
                              <h3 className="font-bold text-xs md:text-lg text-dark line-clamp-2 mb-1">
                                {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`}
                              </h3>
                              <p className="text-lg md:text-2xl font-bold text-primary mb-1 md:mb-2">
                                {formatPrice(car.salePrice)}
                              </p>
                              <div className="text-[10px] md:text-sm text-gray-600 mb-0.5 md:mb-1">
                                {car.color} • {car.mileage.toLocaleString()} mi
                              </div>
                              <div className="text-[10px] md:text-sm text-gray-600 mb-1 md:mb-3">
                                {car.city}, {car.state}
                                {car.distance !== null && car.distance !== undefined && (
                                  <span className="ml-1 text-primary font-medium">
                                    ({car.distance} mi)
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3 line-clamp-1">{car.dealer.businessName}</p>

                              <div className="flex flex-col gap-1.5 md:gap-2">
                                <button
                                  onClick={(e) => handleCheckAvailability(car, e)}
                                  className="w-full bg-black text-white px-2 md:px-4 py-1.5 md:py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 text-[10px] md:text-sm"
                                >
                                  Check Availability - Test Drive
                                </button>
                                {!photoUrl && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRequestingPhotos(car);
                                    }}
                                    className="w-full bg-black text-white px-2 md:px-4 py-1.5 md:py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 text-[10px] md:text-sm"
                                  >
                                    <Camera className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Request Photos</span>
                                    <span className="sm:hidden">Photos</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!loadingSimilar && similarCars.length === 0 && (search.make || search.model || search.q) && (
                  <div className="mt-8 text-center">
                    <Link
                      href="/cars"
                      className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Browse All Inventory
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedCars.map((car) => {
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
                  <div className="relative aspect-[4/3] bg-gray-200 cursor-pointer" onClick={(e) => openPhotoGallery(car, e)}>
                    <Image
                      src={photoUrl || getPlaceholderImage(car.bodyType)}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {photoUrl && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-pill text-[10px] md:text-xs font-semibold backdrop-blur-sm">
                        <Camera className="w-3 h-3 inline mr-1" />
                        <span className="hidden sm:inline">View Photos</span>
                        <span className="sm:hidden">Photos</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 md:p-4">
                    <h3 className="font-bold text-xs md:text-lg text-dark line-clamp-2 mb-1">
                      {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`}
                    </h3>
                    <p className="text-lg md:text-2xl font-bold text-primary mb-1 md:mb-2">
                      {formatPrice(car.salePrice)}
                    </p>
                    <div className="text-[10px] md:text-sm text-gray-600 mb-0.5 md:mb-1">
                      {car.color} • {car.mileage.toLocaleString()} mi
                    </div>
                    <div className="text-[10px] md:text-sm text-gray-600 mb-1 md:mb-3">
                      {car.city}, {car.state}
                      {car.distance !== null && car.distance !== undefined && (
                        <span className="ml-1 text-primary font-medium">
                          ({car.distance} mi)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3 line-clamp-1">{car.dealer.businessName}</p>

                    <div className="flex flex-col gap-1.5 md:gap-2">
                      <button
                        onClick={(e) => handleCheckAvailability(car, e)}
                        className="w-full bg-black text-white px-2 md:px-4 py-1.5 md:py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 text-[10px] md:text-sm"
                      >
                        Check Availability - Test Drive
                      </button>
                      {!photoUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRequestingPhotos(car);
                          }}
                          className="w-full bg-black text-white px-2 md:px-4 py-1.5 md:py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1 text-[10px] md:text-sm"
                        >
                          <Camera className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Request Photos</span>
                          <span className="sm:hidden">Photos</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* Results info */}
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredCars.length)} of {filteredCars.length} vehicles
                  </p>

                  {/* Page controls */}
                  <div className="flex items-center gap-1">
                    {/* First page */}
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="First page"
                    >
                      <ChevronsLeft className="w-5 h-5" />
                    </button>

                    {/* Previous page */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1 mx-2">
                      {getPageNumbers().map((page, index) => (
                        typeof page === 'number' ? (
                          <button
                            key={index}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-primary text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ) : (
                          <span key={index} className="px-2 text-gray-400">
                            {page}
                          </span>
                        )
                      ))}
                    </div>

                    {/* Next page */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Last page */}
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Last page"
                    >
                      <ChevronsRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Items per page selector */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Show:</span>
                    {[12, 24, 48, 96].map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          setItemsPerPage(count);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          itemsPerPage === count
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </>
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

      {/* Request Photos Modal */}
      {requestingPhotos && (
        <RequestPhotosModal
          car={requestingPhotos}
          user={user}
          onClose={() => setRequestingPhotos(null)}
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
                    {viewingPhotos.car.year} {viewingPhotos.car.make} {viewingPhotos.car.model}{viewingPhotos.car.trim ? ` ${viewingPhotos.car.trim}` : ''}
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
                  {viewingPhotos.car.interiorColor && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Interior Color</p>
                      <p className="font-semibold text-dark">{viewingPhotos.car.interiorColor}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.city}, {viewingPhotos.car.state}</p>
                  </div>
                  {viewingPhotos.car.drivetrain && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Drivetrain</p>
                      <p className="font-semibold text-dark capitalize">{viewingPhotos.car.drivetrain}</p>
                    </div>
                  )}
                  {viewingPhotos.car.engine && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Engine</p>
                      <p className="font-semibold text-dark">{viewingPhotos.car.engine}</p>
                    </div>
                  )}
                </div>

                {/* Key Features Preview */}
                {viewingPhotos.car.features && (() => {
                  try {
                    const allFeatures: string[] = JSON.parse(viewingPhotos.car.features);
                    if (allFeatures.length === 0) return null;
                    const preview = allFeatures.slice(0, 6);
                    return (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-dark mb-2">{viewingPhotos.car.year} {viewingPhotos.car.make} {viewingPhotos.car.model}{viewingPhotos.car.trim ? ` ${viewingPhotos.car.trim}` : ''} Features &amp; Equipment Highlights</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                          {preview.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        {allFeatures.length > 6 && (
                          <Link
                            href={`/cars/${viewingPhotos.car.slug || viewingPhotos.car.id}`}
                            className="inline-block mt-2 text-sm text-primary font-semibold hover:underline"
                            onClick={closePhotoGallery}
                          >
                            View all {allFeatures.length} features &rarr;
                          </Link>
                        )}
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}

                {/* Why Buyers Consider This Vehicle */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-dark mb-2">Why Buyers Consider This {viewingPhotos.car.year} {viewingPhotos.car.make} {viewingPhotos.car.model}{viewingPhotos.car.trim ? ` ${viewingPhotos.car.trim}` : ''}</h3>
                  <ul className="space-y-1.5 text-gray-700 text-sm">
                    {generateStandsOutPoints(
                      viewingPhotos.car.year,
                      viewingPhotos.car.make,
                      viewingPhotos.car.model,
                      viewingPhotos.car.mileage,
                      viewingPhotos.car.fuelType,
                      viewingPhotos.car.bodyType,
                    ).map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 text-xs">&#9679;</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Description Sections */}
                {viewingPhotos.car.description && (() => {
                  const sections = parseStructuredDescription(viewingPhotos.car.description);
                  if (!sections) {
                    // Legacy format — show as plain "About This Vehicle"
                    return (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-dark mb-2">About This Vehicle</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {getDescriptionPreview(viewingPhotos.car.description)}
                        </p>
                      </div>
                    );
                  }

                  // Filter out old problematic sections
                  const problemKeywords = ['negotiate', 'alternative', 'before purchasing', 'should buyers know', 'good alternatives'];
                  const cleanSections = sections.filter(s => {
                    const lower = s.heading.toLowerCase();
                    return !problemKeywords.some(kw => lower.includes(kw));
                  });

                  // Try new-format headings first
                  const standsOutAI = cleanSections.find(s => s.heading.toLowerCase().includes('stands out'));
                  const specialAI = cleanSections.find(s => s.heading.toLowerCase().includes('makes this one special'));
                  const ownershipAI = cleanSections.find(s => s.heading.toLowerCase().includes('ownership experience'));
                  const confidenceAI = cleanSections.find(s => s.heading.toLowerCase().includes('buyer confidence'));

                  // New format detected
                  if (standsOutAI) {
                    return (
                      <>
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-dark mb-2">Why This Vehicle Stands Out</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">{standsOutAI.content}</p>
                        </div>
                        {specialAI && (
                          <div className="mb-6">
                            <h3 className="text-lg font-bold text-dark mb-2">What Makes This One Special</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{specialAI.content}</p>
                          </div>
                        )}
                        {ownershipAI && (
                          <div className="mb-6">
                            <h3 className="text-lg font-bold text-dark mb-2">Ownership Experience</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{ownershipAI.content}</p>
                          </div>
                        )}
                        {confidenceAI && (
                          <div className="mb-6">
                            <h3 className="text-lg font-bold text-dark mb-2">Buyer Confidence</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{confidenceAI.content}</p>
                          </div>
                        )}
                      </>
                    );
                  }

                  // Old structured format — show "good deal" section as About
                  const goodDeal = cleanSections.find(s => s.heading.toLowerCase().includes('good deal'));
                  if (goodDeal) {
                    return (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-dark mb-2">About This Vehicle</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">{goodDeal.content}</p>
                      </div>
                    );
                  }

                  return null;
                })()}

                {/* Who This Vehicle Is Best For */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-dark mb-2">Who This {viewingPhotos.car.make} {viewingPhotos.car.model} Is Best For</h3>
                  <ul className="space-y-1.5 text-gray-700 text-sm">
                    {generateBuyerPersonas(
                      viewingPhotos.car.make,
                      viewingPhotos.car.model,
                      viewingPhotos.car.bodyType,
                      viewingPhotos.car.fuelType,
                    ).map((persona, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 text-xs">&#9679;</span>
                        <span>{persona}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    IQAutoDeals allows you to move forward confidently. Create a free account, add this vehicle to your Deal Request, and let certified dealers compete to offer you their best price.
                  </p>
                  <Link
                    href="/register?type=customer"
                    className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-primary-dark transition-colors"
                  >
                    Create Free Account
                  </Link>
                </div>

                {/* Dealer Info */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sold By</p>
                  <p className="font-semibold text-dark">{viewingPhotos.car.dealer.businessName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {viewingPhotos.car.city}, {viewingPhotos.car.state}
                  </p>
                  {viewingPhotos.car.dealer.websiteUrl && (
                    <DealerWebsiteLink
                      websiteUrl={viewingPhotos.car.dealer.websiteUrl}
                      dealerId={viewingPhotos.car.dealerId}
                      carId={viewingPhotos.car.id}
                      referrerPage="/cars"
                    />
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

                {/* Similar Vehicle Recommendations — scoped to same dealer */}
                {(() => {
                  const cur = viewingPhotos.car;
                  const sameDealer = cars.filter(c => c.id !== cur.id && c.dealerId === cur.dealerId);

                  const similarVehicles = sameDealer.filter(c => c.make === cur.make).slice(0, 4);
                  const sameModel = sameDealer.filter(c => c.make === cur.make && c.model === cur.model).slice(0, 2);
                  const dealerOther = sameDealer.slice(0, 4);

                  const renderTile = (car: CarListing) => {
                    let photo = '';
                    try { photo = JSON.parse(car.photos || '[]')[0] || ''; } catch {}
                    return (
                      <Link
                        key={car.id}
                        href={`/cars/${car.slug || car.id}`}
                        className="block"
                        onClick={closePhotoGallery}
                      >
                        <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={photo || getPlaceholderImage(car.bodyType)}
                            alt={`${car.year} ${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        </div>
                        <p className="font-semibold text-xs text-dark mt-1 line-clamp-1">{car.year} {car.make} {car.model}{car.trim ? ` ${car.trim}` : ''}</p>
                        <p className="text-xs text-primary font-bold">{formatPrice(car.salePrice)}</p>
                      </Link>
                    );
                  };

                  return (
                    <>
                      {similarVehicles.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h3 className="font-bold text-dark text-sm mb-3">Similar Vehicles You Might Like</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {similarVehicles.map(renderTile)}
                          </div>
                        </div>
                      )}
                      {sameModel.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h3 className="font-bold text-dark text-sm mb-3">More {cur.make} {cur.model}s</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {sameModel.map(renderTile)}
                          </div>
                        </div>
                      )}
                      {similarVehicles.length === 0 && sameModel.length === 0 && dealerOther.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h3 className="font-bold text-dark text-sm mb-3">Other Vehicles Offered by {cur.dealer.businessName}</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {dealerOther.map(renderTile)}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
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
