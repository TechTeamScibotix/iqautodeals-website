'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Car, MapPin, Camera, X, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';

interface CarListing {
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
  dealer: {
    businessName: string;
  };
}

export default function CarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    make: '',
    model: '',
    state: 'GA',
    condition: 'all' // new, used, or all
  });
  const [viewingPhotos, setViewingPhotos] = useState<{ car: CarListing; photos: string[] } | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in (but don't require it)
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
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

  const openPhotoGallery = (car: CarListing, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const filteredCars = cars.filter(car => {
    const makeMatch = !search.make || car.make.toLowerCase().includes(search.make.toLowerCase());
    const modelMatch = !search.model || car.model.toLowerCase().includes(search.model.toLowerCase());
    const stateMatch = search.state === 'all' || car.state === search.state;
    return makeMatch && modelMatch && stateMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              IQ Auto Deals
            </div>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <Link href="/cars" className="text-primary hover:text-blue-700 transition-colors border-b-2 border-primary pb-1">
              Cars for Sale
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary transition-colors">
              Research & Reviews
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary transition-colors">
              News & Videos
            </Link>
            <Link href="/guides/car-financing-guide" className="text-gray-700 hover:text-primary transition-colors">
              Financing
            </Link>
          </nav>
          <div className="flex gap-3">
            {user ? (
              <Link
                href={user.userType === 'customer' ? '/customer' : '/dealer'}
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary px-5 py-2.5 rounded-lg transition-colors font-semibold flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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
              onChange={(e) => setSearch({ ...search, condition: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
            >
              <option value="all">New/Used</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>

            <input
              type="text"
              placeholder="Make (e.g., Toyota)"
              value={search.make}
              onChange={(e) => setSearch({ ...search, make: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
            />

            <input
              type="text"
              placeholder="Model (e.g., Camry)"
              value={search.model}
              onChange={(e) => setSearch({ ...search, model: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
            />

            <select
              value={search.state}
              onChange={(e) => setSearch({ ...search, state: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
            >
              <option value="all">All States</option>
              <option value="GA">Georgia</option>
              <option value="FL">Florida</option>
              <option value="AL">Alabama</option>
              <option value="NC">North Carolina</option>
              <option value="SC">South Carolina</option>
            </select>

            <button
              onClick={loadCars}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2"
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
                    <h3 className="font-bold text-lg text-dark mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
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

                    <button
                      onClick={handleMakeDeal}
                      className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {user ? 'Request Deal' : 'Sign In to Request Deal'}
                    </button>
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
            <button
              onClick={closePhotoGallery}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-4 left-4 z-10 bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-lg">
                {viewingPhotos.car.year} {viewingPhotos.car.make} {viewingPhotos.car.model}
              </h3>
              <p className="text-sm opacity-90">
                {viewingPhotos.car.city}, {viewingPhotos.car.state} • {viewingPhotos.car.mileage.toLocaleString()} mi
              </p>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              <p className="text-sm font-medium">
                {currentPhotoIndex + 1} / {viewingPhotos.photos.length}
              </p>
            </div>

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

      {/* Footer */}
      <footer className="bg-dark text-white py-12 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">IQ Auto Deals</h3>
              <p className="text-gray-400 text-sm">
                Your trusted marketplace for quality used cars online. Compare prices from local dealers and save thousands.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Popular Locations</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <Link href="/locations/atlanta" className="hover:text-white transition-colors">Atlanta</Link>
                <Link href="/locations/houston" className="hover:text-white transition-colors">Houston</Link>
                <Link href="/locations/los-angeles" className="hover:text-white transition-colors">Los Angeles</Link>
                <Link href="/locations/chicago" className="hover:text-white transition-colors">Chicago</Link>
                <Link href="/locations/miami" className="hover:text-white transition-colors">Miami</Link>
                <Link href="/locations" className="hover:text-white transition-colors text-primary">All Locations →</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Popular Models</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <Link href="/models/toyota-camry" className="hover:text-white transition-colors">Toyota Camry</Link>
                <Link href="/models/honda-accord" className="hover:text-white transition-colors">Honda Accord</Link>
                <Link href="/models/ford-f150" className="hover:text-white transition-colors">Ford F-150</Link>
                <Link href="/models/chevy-silverado" className="hover:text-white transition-colors">Chevy Silverado</Link>
                <Link href="/models/jeep-wrangler" className="hover:text-white transition-colors">Jeep Wrangler</Link>
                <Link href="/models" className="hover:text-white transition-colors text-primary">All Models →</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link href="/guides/how-to-buy-used-car" className="hover:text-white transition-colors">How to Buy a Used Car</Link>
                <Link href="/guides/car-financing-guide" className="hover:text-white transition-colors">Financing Guide</Link>
                <Link href="/login" className="hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="hover:text-white transition-colors">Sign Up</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-500 text-sm">&copy; 2025 IQ Auto Deals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
