'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, LogOut, FileText, Check, Car, MapPin, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
  }, [router]);

  const loadCars = async () => {
    try {
      const res = await fetch('/api/customer/search');
      const data = await res.json();
      setCars(data.cars || []);
    } catch (error) {
      console.error('Failed to load cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCar = (carId: string) => {
    const newSelected = new Set(selectedCars);
    if (newSelected.has(carId)) {
      newSelected.delete(carId);
    } else {
      if (newSelected.size >= 4) {
        alert('You can only select up to 4 cars');
        return;
      }
      newSelected.add(carId);
    }
    setSelectedCars(newSelected);
  };

  const handleMakeDeal = async () => {
    if (selectedCars.size === 0) {
      alert('Please select at least one car');
      return;
    }

    try {
      const res = await fetch('/api/customer/deal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          carIds: Array.from(selectedCars),
        }),
      });

      if (res.ok) {
        alert('Deal request submitted! Dealers will be notified.');
        router.push('/customer/deals');
      } else {
        alert('Failed to submit deal request');
      }
    } catch (error) {
      console.error('Error submitting deal:', error);
      alert('Error submitting deal request');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-purple to-secondary shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="animate-slide-in">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Car className="w-8 h-8" />
              IQ Auto Deals
            </h1>
            <p className="text-sm text-white/80">Find Your Perfect Deal</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/customer/deals')}
              className="bg-white text-primary px-5 py-2.5 rounded-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              My Deals
            </button>
            <span className="text-white font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-white/90 hover:text-white transition flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-lg p-4 mb-4 border border-primary/20">
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
              className="bg-gradient-to-r from-primary to-purple text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Selected Cars Summary */}
        {selectedCars.size > 0 && (
          <div className="bg-gradient-to-r from-accent via-green-500 to-primary text-white rounded-lg shadow-lg p-4 mb-4 border border-white/30">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Check className="w-5 h-5 bg-white text-accent rounded-full p-1" />
                  {selectedCars.size} Car{selectedCars.size !== 1 ? 's' : ''} Selected
                </h3>
                <p className="text-sm font-semibold mb-1">
                  Price Range: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
                </p>
                <p className="text-xs opacity-90">
                  Up to 4 cars ({4 - selectedCars.size} remaining)
                </p>
              </div>
              <button
                onClick={handleMakeDeal}
                className="bg-white text-accent px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all text-sm"
              >
                Make Me A Deal!
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
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg p-8 text-center border border-gray-200">
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
              return (
                <div
                  key={car.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-accent shadow-lg' : 'hover:shadow-lg'
                  }`}
                  onClick={() => toggleCar(car.id)}
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
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-purple/20">
                          <Car className="w-16 h-16 text-primary/40" />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-1 text-dark">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <Car className="w-3 h-3" />
                      {car.color} • {car.mileage.toLocaleString()} mi
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      {car.city}, {car.state}
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={(e) => openPhotoGallery(car, e)}
                        className="flex-1 px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800"
                      >
                        <Camera className="w-3 h-3" />
                        View Photos
                      </button>
                      <button
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 text-xs ${
                          isSelected
                            ? 'bg-accent text-white'
                            : 'bg-gradient-to-r from-primary to-purple text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            Selected
                          </>
                        ) : (
                          'Select'
                        )}
                      </button>
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
    </div>
  );
}
