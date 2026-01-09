'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, LogOut, FileText, Check, Car, MapPin, Camera, X, ChevronLeft, ChevronRight, AlertCircle, ShoppingCart, Phone } from 'lucide-react';
import CheckAvailabilityModal from '../components/CheckAvailabilityModal';
import {
  trackQuoteFormStarted,
  trackQuoteFormSubmitted,
  trackQuoteFormError,
  trackCarGalleryOpened,
  trackCarPhotoSwiped,
  trackFunnelStep,
} from '@/lib/analytics';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  city: string;
  state: string;
  salePrice: number;
  photos: string;
  isDemo?: boolean;
  dealerId: string;
  dealer: {
    businessName: string;
  };
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
  const [search, setSearch] = useState({ make: '', model: '', state: 'GA' });
  const [viewingPhotos, setViewingPhotos] = useState<{ car: Car; photos: string[] } | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dealStatus, setDealStatus] = useState<DealStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState<Car | null>(null);

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
    loadCars();
    loadDealStatus(parsed.id);
  }, [router, loadDealStatus]);

  const loadCars = async () => {
    try {
      const params = new URLSearchParams();
      if (search.make) params.append('make', search.make);
      if (search.model) params.append('model', search.model);
      if (search.state) params.append('state', search.state);

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
  const minPrice = selectedCarsList.length > 0 ? Math.min(...selectedCarsList.map(c => c.salePrice)) : 0;
  const maxPrice = selectedCarsList.length > 0 ? Math.max(...selectedCarsList.map(c => c.salePrice)) : 0;

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-dark shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-light flex items-center gap-2">
              <Car className="w-8 h-8" />
              IQ Auto Deals
            </h1>
            <p className="text-sm text-gray-400">Find Your Perfect Deal</p>
          </div>
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

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-border">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-dark">
            <Search className="w-5 h-5 text-primary" />
            Search Available Vehicles
          </h2>
          <div className="grid md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Make (e.g., Toyota)"
              value={search.make}
              onChange={(e) => setSearch({ ...search, make: e.target.value })}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
            />
            <input
              type="text"
              placeholder="Model (e.g., Camry)"
              value={search.model}
              onChange={(e) => setSearch({ ...search, model: e.target.value })}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
            />
            <select
              value={search.state}
              onChange={(e) => setSearch({ ...search, state: e.target.value })}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
            >
              <option value="GA">Georgia</option>
              <option value="FL">Florida</option>
              <option value="AL">Alabama</option>
            </select>
            <button
              onClick={loadCars}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
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
                  Price Range: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
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

        {/* Cars Grid */}
        <div className="mb-3">
          <h2 className="text-xl font-bold mb-2 text-dark flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Available Cars ({cars.length})
          </h2>
        </div>

        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-border">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-dark">No cars found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search filters to find more vehicles</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cars.map((car, index) => {
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
                  <div className="relative h-32 bg-gray-200 overflow-hidden">
                    {(() => {
                      try {
                        const photoUrls = JSON.parse(car.photos || '[]');
                        const firstPhoto = photoUrls[0];
                        if (firstPhoto) {
                          return (
                            <Image
                              src={firstPhoto}
                              alt={`${car.year} ${car.make} ${car.model}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          );
                        }
                      } catch (e) {
                        console.error('Failed to parse photos:', e);
                      }
                      return (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <Car className="w-16 h-16 text-gray-300" />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="font-bold text-sm text-dark">
                        {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}`}
                      </h3>
                      {car.isDemo && (
                        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          Sample
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <Car className="w-3 h-3" />
                      {car.color} • {car.mileage.toLocaleString()} mi
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      {car.city}, {car.state}
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckingAvailability(car);
                        }}
                        className="w-full px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs bg-primary text-white hover:bg-primary-dark"
                      >
                        <Phone className="w-3 h-3" />
                        Check Availability - Test Drive
                      </button>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={(e) => openPhotoGallery(car, e)}
                          className="flex-1 px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs bg-gray-600 text-white hover:bg-gray-700"
                        >
                          <Camera className="w-3 h-3" />
                          View Photos
                        </button>
                        <button
                          disabled={isInDeal || (!isSelected && !canAdd)}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 text-xs ${
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
                              <Check className="w-4 h-4" />
                              In Deal
                            </>
                          ) : isSelected ? (
                            <>
                              <Check className="w-4 h-4" />
                              Selected
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
      </div>

      {/* Photo Gallery Modal */}
      {viewingPhotos && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closePhotoGallery}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closePhotoGallery}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Car Info */}
            <div className="absolute top-4 left-4 z-10 bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-lg">
                {viewingPhotos.car.year} {viewingPhotos.car.make} {viewingPhotos.car.model}
              </h3>
              <p className="text-sm opacity-90">
                {viewingPhotos.car.city}, {viewingPhotos.car.state} • {viewingPhotos.car.mileage.toLocaleString()} mi
              </p>
            </div>

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              <p className="text-sm font-medium">
                {currentPhotoIndex + 1} / {viewingPhotos.photos.length}
              </p>
            </div>

            {/* Main Photo */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <Image
                src={viewingPhotos.photos[currentPhotoIndex]}
                alt={`${viewingPhotos.car.year} ${viewingPhotos.car.make} ${viewingPhotos.car.model} - Photo ${currentPhotoIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>

            {/* Navigation Buttons */}
            {viewingPhotos.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {viewingPhotos.photos.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {viewingPhotos.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition ${
                      index === currentPhotoIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
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
