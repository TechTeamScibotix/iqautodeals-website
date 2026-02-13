'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, LogOut, FileText, Check, Car, MapPin, Camera, X, ChevronLeft, ChevronRight, AlertCircle, ShoppingCart, Phone, SlidersHorizontal, ChevronDown, ChevronUp, Globe, ExternalLink } from 'lucide-react';
import CheckAvailabilityModal from '../components/CheckAvailabilityModal';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import {
  trackQuoteFormStarted,
  trackQuoteFormSubmitted,
  trackQuoteFormError,
  trackCarGalleryOpened,
  trackCarPhotoSwiped,
  trackFunnelStep,
} from '@/lib/analytics';
import { formatPrice } from '@/lib/format';

interface Car {
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
  description?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  isDemo?: boolean;
  dealerId: string;
  distance?: number | null;
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

interface DealStatus {
  hasActiveDeal: boolean;
  currentCount: number;
  remainingSlots: number;
  maxCars: number;
  carIdsInDeal: string[];
  carsInDeal: { id: string; make: string; model: string; year: number }[];
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCars, setSelectedCars] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    q: '',
    make: '',
    model: '',
    state: 'all',
    condition: 'all',
    fuelType: 'all',
    minPrice: '',
    maxPrice: '',
    zipCode: '',
  });
  const [viewingPhotos, setViewingPhotos] = useState<{ car: Car; photos: string[] } | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dealStatus, setDealStatus] = useState<DealStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState<Car | null>(null);

  // Filter panel state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    distance: true,
    price: true,
    state: false,
    condition: false,
  });
  const [searchRadius, setSearchRadius] = useState(75);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Dynamic filter options from database
  const [filterOptions, setFilterOptions] = useState<{
    makes: string[];
    states: string[];
    fuelTypes: string[];
    modelsByMake: Record<string, string[]>;
  }>({
    makes: [],
    states: [],
    fuelTypes: [],
    modelsByMake: {},
  });

  // Get models for selected make
  const availableModels = search.make
    ? filterOptions.modelsByMake[search.make.toUpperCase()] || []
    : [];

  const loadFilters = async () => {
    try {
      const res = await fetch('/api/filters');
      const data = await res.json();
      if (data.makes) {
        setFilterOptions({
          makes: data.makes || [],
          states: data.states || [],
          fuelTypes: data.fuelTypes || [],
          modelsByMake: data.modelsByMake || {},
        });
      }
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const loadDealStatus = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/customer/deal-status?customerId=${userId}`);
      const data = await res.json();
      setDealStatus(data);
    } catch (error) {
      console.error('Failed to load deal status:', error);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.userType !== 'customer') {
      router.push('/dealer');
      return;
    }

    setUser(parsed);
    loadFilters();
    loadCars();
    loadDealStatus(parsed.id);
  }, [router, loadDealStatus]);

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
      const params = new URLSearchParams();
      if (search.q) params.append('q', search.q);
      if (search.make) params.append('make', search.make);
      if (search.model) params.append('model', search.model);
      if (search.state && search.state !== 'all') params.append('state', search.state);
      if (search.condition && search.condition !== 'all') params.append('condition', search.condition);
      if (search.minPrice) params.append('minPrice', search.minPrice);
      if (search.maxPrice) params.append('maxPrice', search.maxPrice);
      if (search.zipCode) params.append('zipCode', search.zipCode);

      const res = await fetch(`/api/customer/search?${params.toString()}`);
      const data = await res.json();
      setCars(data.cars || []);
    } catch (error) {
      console.error('Failed to load cars:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total slots used (existing deal + current selection)
  const existingDealCount = dealStatus?.currentCount || 0;
  const totalSlotsUsed = existingDealCount + selectedCars.size;
  const remainingSlots = 4 - totalSlotsUsed;

  // Client-side filtering for additional refinement
  const filteredCars = cars.filter(car => {
    const fuelTypeMatch = search.fuelType === 'all' || (car.fuelType || 'Gasoline') === search.fuelType;
    const minPriceMatch = !search.minPrice || car.salePrice >= parseInt(search.minPrice, 10);
    const maxPriceMatch = !search.maxPrice || car.salePrice <= parseInt(search.maxPrice, 10);
    return fuelTypeMatch && minPriceMatch && maxPriceMatch;
  });

  const toggleCar = (carId: string) => {
    // Check if car is already in an existing deal
    if (dealStatus?.carIdsInDeal.includes(carId)) {
      alert('This car is already in your deal request. Go to My Deals to manage it.');
      return;
    }

    const newSelected = new Set(selectedCars);
    if (newSelected.has(carId)) {
      newSelected.delete(carId);
    } else {
      // Check if adding would exceed limit
      if (totalSlotsUsed >= 4) {
        alert('You already have 4 cars in your deal request. Cancel one from My Deals to add another.');
        return;
      }
      newSelected.add(carId);

      // Track quote form started when first car is selected
      if (selectedCars.size === 0) {
        trackQuoteFormStarted({
          vin: carId,
          source: 'customer-dashboard',
        });
        // Track funnel step: lead initiated
        trackFunnelStep({
          step: 'lead_initiated',
          previousStep: 'car_selected',
        });
      }
    }
    setSelectedCars(newSelected);
  };

  const handleMakeDeal = async () => {
    if (selectedCars.size === 0) {
      alert('Please select at least one car');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/customer/deal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          carIds: Array.from(selectedCars),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Track successful submission
        trackQuoteFormSubmitted({
          vin: Array.from(selectedCars).join(','),
          source: 'customer-dashboard',
        });

        // Track funnel step: lead completed
        trackFunnelStep({
          step: 'lead_completed',
          previousStep: 'lead_initiated',
          metadata: {
            carsCount: selectedCars.size,
          },
        });

        alert(data.message || 'Deal request submitted! Dealers will be notified.');
        setSelectedCars(new Set());
        loadDealStatus(user.id);
        router.push('/customer/deals');
      } else {
        // Track form error
        trackQuoteFormError({
          source: 'customer-dashboard',
          field: 'submission',
          errorMessage: data.error || 'Failed to submit deal request',
        });

        alert(data.error || 'Failed to submit deal request');
      }
    } catch (error) {
      console.error('Error submitting deal:', error);

      // Track form error
      trackQuoteFormError({
        source: 'customer-dashboard',
        field: 'submission',
        errorMessage: 'Network error submitting deal request',
      });

      alert('Error submitting deal request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const openPhotoGallery = (car: Car, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    try {
      const photos = JSON.parse(car.photos || '[]');
      if (photos.length > 0) {
        setViewingPhotos({ car, photos });
        setCurrentPhotoIndex(0);
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
      setCurrentPhotoIndex((prev) => (prev + 1) % viewingPhotos.photos.length);
    }
  };

  const prevPhoto = () => {
    if (viewingPhotos) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? viewingPhotos.photos.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const selectedCarsList = cars.filter(c => selectedCars.has(c.id));
  const pricedCars = selectedCarsList.filter(c => c.salePrice > 0);
  const minPrice = pricedCars.length > 0 ? Math.min(...pricedCars.map(c => c.salePrice)) : 0;
  const maxPrice = pricedCars.length > 0 ? Math.max(...pricedCars.map(c => c.salePrice)) : 0;
  const hasCallForPrice = selectedCarsList.some(c => !c.salePrice || c.salePrice <= 0);

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/customer/deals')}
              className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-all font-semibold flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              My Deals
            </button>
            <span className="text-gray-300 font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Deal Status Banner */}
        {dealStatus && (
          <div className={`rounded-lg shadow-md p-4 mb-4 ${
            dealStatus.currentCount >= 4
              ? 'bg-amber-50 border-2 border-amber-400'
              : dealStatus.currentCount > 0
                ? 'bg-blue-50 border-2 border-blue-400'
                : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  dealStatus.currentCount >= 4
                    ? 'bg-amber-100'
                    : dealStatus.currentCount > 0
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                }`}>
                  <ShoppingCart className={`w-5 h-5 ${
                    dealStatus.currentCount >= 4
                      ? 'text-amber-600'
                      : dealStatus.currentCount > 0
                        ? 'text-blue-600'
                        : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <p className={`font-bold ${
                    dealStatus.currentCount >= 4
                      ? 'text-amber-800'
                      : dealStatus.currentCount > 0
                        ? 'text-blue-800'
                        : 'text-gray-700'
                  }`}>
                    {dealStatus.currentCount === 0
                      ? 'No cars in your deal request yet'
                      : dealStatus.currentCount >= 4
                        ? 'Deal request full (4/4 cars)'
                        : `${dealStatus.currentCount} car${dealStatus.currentCount === 1 ? '' : 's'} in your deal request`
                    }
                  </p>
                  <p className={`text-sm ${
                    dealStatus.currentCount >= 4
                      ? 'text-amber-700'
                      : dealStatus.currentCount > 0
                        ? 'text-blue-700'
                        : 'text-gray-500'
                  }`}>
                    {dealStatus.currentCount >= 4
                      ? 'Cancel a car from My Deals to add another'
                      : `You can add ${4 - dealStatus.currentCount} more car${4 - dealStatus.currentCount === 1 ? '' : 's'}`
                    }
                  </p>
                </div>
              </div>
              {dealStatus.currentCount > 0 && (
                <button
                  onClick={() => router.push('/customer/deals')}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-dark transition"
                >
                  View My Deals
                </button>
              )}
            </div>
            {dealStatus.carsInDeal.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Cars awaiting dealer response:</p>
                <div className="flex flex-wrap gap-2">
                  {dealStatus.carsInDeal.map(car => (
                    <span key={car.id} className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border">
                      {car.year} {car.make} {car.model}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Filters Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 mb-4 rounded-lg shadow-md">
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
                    setSearch({ q: '', make: '', model: '', state: 'all', condition: 'all', fuelType: 'all', minPrice: '', maxPrice: '', zipCode: '' });
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

        {/* Desktop Search Bar */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md p-4 mb-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={search.q}
                onChange={(e) => setSearch({ ...search, q: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && loadCars()}
                placeholder="Search by make, model, year, color, body type, VIN..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              />
            </div>
            <button
              onClick={loadCars}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all font-semibold flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        {/* Selected Cars Summary */}
        {selectedCars.size > 0 && (
          <div className="bg-accent text-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Check className="w-5 h-5 bg-white text-accent rounded-full p-1" />
                  {selectedCars.size} New Car{selectedCars.size !== 1 ? 's' : ''} Selected
                </h3>
                <p className="text-sm font-semibold mb-1">
                  {pricedCars.length === 0
                    ? 'Price: Call For Price'
                    : hasCallForPrice
                    ? `Price Range: ${formatPrice(minPrice)} - ${formatPrice(maxPrice)} + Call For Price`
                    : `Price Range: ${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                </p>
                <p className="text-xs opacity-90">
                  {existingDealCount > 0
                    ? `Adding to existing deal (${existingDealCount} + ${selectedCars.size} = ${totalSlotsUsed}/4 cars)`
                    : `${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} remaining after this`
                  }
                </p>
              </div>
              <button
                onClick={handleMakeDeal}
                disabled={submitting}
                className="bg-white text-accent px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : existingDealCount > 0 ? 'Add to Deal Request' : 'Make Me A Deal!'}
              </button>
            </div>
          </div>
        )}

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-md p-4 border border-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                Filters
              </h3>

              {/* Brand Section */}
              <div className="border-b border-gray-200 py-3">
                <button onClick={() => toggleSection('brand')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Brand</span>
                  {openSections.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.brand && (
                  <div className="mt-3 space-y-2">
                    <select
                      value={search.make}
                      onChange={(e) => setSearch(prev => ({ ...prev, make: e.target.value, model: '' }))}
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
              <div className="border-b border-gray-200 py-3">
                <button onClick={() => toggleSection('distance')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Distance</span>
                  {openSections.distance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
              <div className="border-b border-gray-200 py-3">
                <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Price</span>
                  {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections.price && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Min</label>
                      <div className="relative mt-1">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="text"
                          value={search.minPrice ? parseInt(search.minPrice).toLocaleString() : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearch(prev => ({ ...prev, minPrice: value }));
                          }}
                          placeholder="Min"
                          className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Max</label>
                      <div className="relative mt-1">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="text"
                          value={search.maxPrice ? parseInt(search.maxPrice).toLocaleString() : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setSearch(prev => ({ ...prev, maxPrice: value }));
                          }}
                          placeholder="Max"
                          className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* State Section */}
              <div className="border-b border-gray-200 py-3">
                <button onClick={() => toggleSection('state')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">State</span>
                  {openSections.state ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

              {/* Condition Section */}
              <div className="border-b border-gray-200 py-3">
                <button onClick={() => toggleSection('condition')} className="w-full flex items-center justify-between text-left">
                  <span className="font-semibold">Condition</span>
                  {openSections.condition ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
              <div className="py-3 space-y-2">
                <button
                  onClick={loadCars}
                  className="w-full px-4 py-2.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm"
                >
                  Apply filters
                </button>
                <button
                  onClick={() => {
                    setSearch({ q: '', make: '', model: '', state: 'all', condition: 'all', fuelType: 'all', minPrice: '', maxPrice: '', zipCode: '' });
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
            {/* Cars Grid Header */}
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                {loading ? 'Loading...' : `${filteredCars.length} Cars Available`}
              </h2>
              {search.zipCode && filteredCars.length > 0 && (
                <p className="text-primary text-sm font-medium">
                  Sorted by distance from {search.zipCode}
                </p>
              )}
            </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading inventory...</div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-border">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-dark">No cars found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search filters to find more vehicles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCars.map((car, index) => {
              const isSelected = selectedCars.has(car.id);
              const isInDeal = dealStatus?.carIdsInDeal.includes(car.id) || false;
              const canAdd = !isInDeal && totalSlotsUsed < 4;

              return (
                <div
                  key={car.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
                    isInDeal
                      ? 'ring-2 ring-blue-400 opacity-75'
                      : isSelected
                        ? 'ring-2 ring-accent shadow-lg cursor-pointer'
                        : canAdd
                          ? 'hover:shadow-lg cursor-pointer'
                          : 'opacity-60'
                  }`}
                  onClick={() => !isInDeal && toggleCar(car.id)}
                >
                  <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                    {(() => {
                      try {
                        const photoUrls = JSON.parse(car.photos || '[]');
                        const firstPhoto = photoUrls[0];
                        return (
                          <Image
                            src={firstPhoto || getPlaceholderImage(car.bodyType)}
                            alt={`${car.year} ${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        );
                      } catch (e) {
                        console.error('Failed to parse photos:', e);
                        return (
                          <Image
                            src={getPlaceholderImage(car.bodyType)}
                            alt={`${car.year} ${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        );
                      }
                    })()}
                  </div>
                  <div className="p-2">
                    <h3 className="font-bold text-xs md:text-sm text-dark line-clamp-2 mb-1">
                      {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}`}
                    </h3>
                    <div className="text-[10px] md:text-xs text-gray-600 mb-1">
                      {car.color} • {car.mileage.toLocaleString()} mi
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-600 mb-2">
                      {car.city}, {car.state}
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckingAvailability(car);
                        }}
                        className="w-full px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-[10px] md:text-xs bg-primary text-white hover:bg-primary-dark"
                      >
                        <Phone className="w-3 h-3" />
                        <span className="hidden sm:inline">Check Availability</span>
                        <span className="sm:hidden">Availability</span>
                      </button>
                      <div className="flex gap-1.5 items-center">
                        <button
                          onClick={(e) => openPhotoGallery(car, e)}
                          className="flex-1 px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-[10px] md:text-xs bg-gray-600 text-white hover:bg-gray-700"
                        >
                          <Camera className="w-3 h-3" />
                          Photos
                        </button>
                        <button
                          disabled={isInDeal || (!isSelected && !canAdd)}
                          className={`px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 text-[10px] md:text-xs ${
                            isInDeal
                              ? 'bg-blue-500 text-white cursor-not-allowed'
                              : isSelected
                                ? 'bg-accent text-white'
                                : canAdd
                                  ? 'bg-secondary text-white hover:bg-secondary/90'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isInDeal ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span className="hidden sm:inline">In Deal</span>
                            </>
                          ) : isSelected ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span className="hidden sm:inline">Selected</span>
                            </>
                          ) : canAdd ? (
                            'Add'
                          ) : (
                            'Full'
                          )}
                        </button>
                      </div>
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
                <div className="mb-4">
                  <h2 className="text-xl lg:text-3xl font-bold text-dark mb-2">
                    {viewingPhotos.car.year} {viewingPhotos.car.make} {viewingPhotos.car.model}
                  </h2>
                  <p className="text-2xl lg:text-4xl font-bold text-primary">
                    {formatPrice(viewingPhotos.car.salePrice)}
                  </p>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Mileage</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.mileage.toLocaleString()} mi</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Transmission</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.transmission || 'Automatic'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Exterior Color</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.color}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="font-semibold text-dark">{viewingPhotos.car.city}, {viewingPhotos.car.state}</p>
                  </div>
                </div>

                {/* Description */}
                {viewingPhotos.car.description && (
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-dark mb-2">About This Vehicle</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {viewingPhotos.car.description}
                    </p>
                  </div>
                )}

                {/* Dealer Info */}
                <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Sold By</p>
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
                      setCheckingAvailability(viewingPhotos.car);
                    }}
                    className="w-full bg-primary text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Check Availability - Test Drive
                  </button>
                  <Link
                    href={`/cars/${viewingPhotos.car.slug || viewingPhotos.car.id}`}
                    className="w-full border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    View Full Listing
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Fixed Bottom CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2 safe-area-bottom">
              <button
                onClick={(e) => {
                  closePhotoGallery();
                  setCheckingAvailability(viewingPhotos.car);
                }}
                className="w-full bg-primary text-white px-4 py-3 rounded-lg font-bold text-base hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Check Availability - Test Drive
              </button>
              <Link
                href={`/cars/${viewingPhotos.car.slug || viewingPhotos.car.id}`}
                className="w-full border-2 border-primary text-primary px-4 py-2.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
              >
                View Full Listing
              </Link>
            </div>
          </div>
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
  );
}
