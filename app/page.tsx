'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Car, Search, TrendingDown, CheckCircle, Users, DollarSign, Award, Sparkles, ArrowRight, LogIn, UserPlus, MapPin, HelpCircle } from 'lucide-react';
import FAQSchema from './components/FAQSchema';
import AIChat from './components/AIChat';
import FinancingCalculator from './components/FinancingCalculator';
import Footer from './components/Footer';
import { BorderBeam } from '@/components/AnimatedBorder';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { trackFunnelStep } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';

interface FeaturedCar {
  id: string;
  slug: string | null;
  make: string;
  model: string;
  year: number;
  salePrice: number;
  photos: string;
  bodyType?: string;
  isDemo?: boolean;
  dealer: {
    businessName: string;
    city: string;
    state: string;
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
}

export default function Home() {
  const router = useRouter();
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>([]);
  const [newCars, setNewCars] = useState<FeaturedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter options from database
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    makes: [],
    years: [],
    states: [],
    fuelTypes: [],
    modelsByMake: {},
    totalCount: 0,
  });

  // Search form state
  const [searchForm, setSearchForm] = useState({
    condition: '',
    make: '',
    model: '',
    state: '',
    fuelType: '',
    zipCode: '',
    radius: '50',
  });

  // Quick search state
  const [quickSearch, setQuickSearch] = useState('');
  const [searchCount, setSearchCount] = useState<number | null>(null);

  // Get models for selected make
  const availableModels = searchForm.make
    ? filterOptions.modelsByMake[searchForm.make.toUpperCase()] || []
    : [];

  // Track funnel step: homepage landed
  useEffect(() => {
    trackFunnelStep({
      step: 'homepage_landed',
    });
  }, []);

  // Fetch filter options from database
  useEffect(() => {
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
  }, []);

  // Reset model when make changes
  useEffect(() => {
    if (searchForm.make && searchForm.model) {
      const models = filterOptions.modelsByMake[searchForm.make.toUpperCase()] || [];
      if (!models.includes(searchForm.model)) {
        setSearchForm((prev) => ({ ...prev, model: '' }));
      }
    }
  }, [searchForm.make, searchForm.model, filterOptions.modelsByMake]);

  // Handle search submission
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (quickSearch.trim()) {
      params.append('q', quickSearch.trim());
    } else {
      if (searchForm.make) params.append('make', searchForm.make);
      if (searchForm.model) params.append('model', searchForm.model);
      if (searchForm.state) params.append('state', searchForm.state);
      if (searchForm.fuelType) params.append('fuelType', searchForm.fuelType);
      if (searchForm.condition) params.append('condition', searchForm.condition);
    }
    if (searchForm.zipCode) params.append('zipCode', searchForm.zipCode);
    router.push(`/cars?${params.toString()}`);
  };

  // Debounced search count when typing in quick search
  useEffect(() => {
    if (!quickSearch.trim()) {
      setSearchCount(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/customer/search?q=${encodeURIComponent(quickSearch.trim())}`);
        const data = await res.json();
        setSearchCount(data.cars?.length || 0);
      } catch (error) {
        console.error('Failed to fetch search count:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [quickSearch]);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const res = await fetch('/api/featured-cars', {
          next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await res.json();
        setFeaturedCars(data.cars || []);
      } catch (error) {
        console.error('Failed to load featured cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  // Fetch new cars for New Inventory section
  useEffect(() => {
    const fetchNewCars = async () => {
      try {
        const res = await fetch('/api/new-cars', {
          next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await res.json();
        setNewCars(data.cars || []);
      } catch (error) {
        console.error('Failed to load new cars:', error);
      } finally {
        setLoadingNew(false);
      }
    };

    fetchNewCars();
  }, []);

  return (
    <div className="min-h-screen bg-light-dark font-sans">
      <AIChat />
      {/* Header - TrueCar dark style */}
      <header className="bg-black sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-3 md:px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center h-full py-1">
              <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
            </Link>

            {/* Navigation Menu - TrueCar dark style */}
            <nav className="hidden lg:flex gap-8 text-sm font-semibold">
              <Link href="/cars?condition=new" className="text-white hover:text-primary transition-colors py-2">
                New Vehicles
              </Link>
              <Link href="/cars?condition=used" className="text-white hover:text-primary transition-colors py-2">
                Used Vehicles
              </Link>
              <Link href="/for-dealers" className="text-white hover:text-primary transition-colors py-2">
                For Dealers
              </Link>
              <Link href="/blog" className="text-white hover:text-primary transition-colors py-2">
                Research & Reviews
              </Link>
              <Link href="/guides/car-financing-guide" className="text-white hover:text-primary transition-colors py-2">
                Financing
              </Link>
            </nav>

            {/* Auth Buttons - TrueCar pill style */}
            <div className="flex gap-2 md:gap-3">
              <Link href="/login" className="text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2">
                <LogIn className="w-3 h-3 md:w-4 md:h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2"
              >
                <UserPlus className="w-3 h-3 md:w-4 md:h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative py-16 min-h-[600px]">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/New.mp4" type="video/mp4" />
        </video>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: TrueCar-style Search Panel */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                Shop Cars. Compare Offers. Save More.
              </h1>

              {/* Search Bar - TrueCar style */}
              <div className="bg-white rounded-pill shadow-xl p-1 mb-8 max-w-md">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-gray-400 ml-4" />
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search make, model, or type"
                    aria-label="Search for vehicles"
                    className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-text-primary placeholder-gray-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-primary text-white px-6 py-3 rounded-pill font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Quick Action Tiles - TrueCar style */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Link
                  href="/cars?condition=new"
                  className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/60 transition-all group text-center"
                >
                  <div className="w-9 h-9 mb-1 mx-auto flex items-center justify-center">
                    <Car className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                    Shop New <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/cars?condition=used"
                  className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/60 transition-all group text-center"
                >
                  <div className="w-9 h-9 mb-1 mx-auto flex items-center justify-center">
                    <Car className="w-7 h-7 text-pink-400" />
                  </div>
                  <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                    Shop Used <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/cars?fuelType=Electric"
                  className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/60 transition-all group text-center"
                >
                  <div className="w-9 h-9 mb-1 mx-auto flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-teal-400" />
                  </div>
                  <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                    Shop Electric <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/cars"
                  className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/60 transition-all group text-center relative"
                >
                  <div className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </div>
                  <div className="w-9 h-9 mb-1 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                    Buy Online <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right: Value Proposition Text */}
            <div className="lg:col-span-3 flex flex-col justify-center text-white">
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed drop-shadow-lg max-w-lg">
                Compare prices and receive competitive offers from verified dealers nationwide. Save <span className="font-bold text-accent">hundreds</span> on your next vehicle.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">50+</div>
                  <div className="text-sm text-gray-200">States</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">1000+</div>
                  <div className="text-sm text-gray-200">Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent drop-shadow-lg uppercase">Nationwide Shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Body Type - Simple Text Pills */}
      <section className="bg-black py-10">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Browse by Body Type</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Minivan', 'Wagon', 'Van', 'Crossover'].map((type) => (
              <Link
                key={type}
                href={`/cars?bodyType=${encodeURIComponent(type)}`}
                className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all"
              >
                {type}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <Link
              href="/cars?fuelType=Electric"
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/20 hover:bg-accent hover:text-white rounded-pill font-medium text-accent transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Electric
            </Link>
            <Link
              href="/cars?fuelType=Hybrid"
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/20 hover:bg-accent hover:text-white rounded-pill font-medium text-accent transition-all"
            >
              <TrendingDown className="w-4 h-4" />
              Hybrid
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars Carousel - TrueCar style */}
      <section className="bg-light-dark py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-text-primary">Featured Inventory</h3>
            <Link href="/cars" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading featured cars...</div>
            </div>
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No cars available yet
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <style jsx>{`
                @keyframes scroll {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .scroll-container {
                  animation: scroll 6s linear infinite;
                }
                @media (min-width: 768px) {
                  .scroll-container {
                    animation: scroll 12s linear infinite;
                  }
                }
                .scroll-container:hover {
                  animation-play-state: paused;
                }
              `}</style>

              <div className="scroll-container flex gap-4 pb-4">
                {[...featuredCars, ...featuredCars].map((car, index) => {
                  let photoUrl = '';
                  try {
                    const photos = JSON.parse(car.photos || '[]');
                    photoUrl = photos[0] || '';
                  } catch (e) {
                    console.error('Failed to parse photos:', e);
                  }

                  return (
                    <Link
                      href={`/cars/${car.slug || car.id}`}
                      key={`${car.id}-${index}`}
                      className="flex-shrink-0 w-72 bg-white rounded-xl border border-border shadow-card overflow-hidden hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="relative h-44 bg-light-dark overflow-hidden">
                        <Image
                          src={photoUrl || getPlaceholderImage(car.bodyType)}
                          alt={`${car.year} ${car.make} ${car.model}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="288px"
                        />
                      </div>
                      <div className="p-4 border-t border-border">
                        <h4 className="font-bold text-base text-text-primary mb-2 line-clamp-1">
                          {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}`}
                        </h4>
                        <p className="text-xl font-bold text-primary mb-2">
                          {formatPrice(car.salePrice)}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-text-secondary flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {car.dealer.city}, {car.dealer.state}
                          </p>
                          <p className="text-xs text-text-muted truncate max-w-[100px]">{car.dealer.businessName}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-4 text-sm text-gray-500">
                Hover to pause
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">How to Buy New & Pre-Owned Vehicles Online</h2>
          <p className="text-base text-text-secondary">Browse vehicles, request competitive offers from verified dealers, and save thousands.</p>
        </div>

        {/* Features - Dark theme card style - Compact */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-bold mb-2 text-white">1. Search Locally</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Browse thousands of vehicles from dealers near you.
            </p>
          </div>

          <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <TrendingDown className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-base font-bold mb-2 text-white">2. Request Deals</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Select up to 4 cars and get dealers competing for your business.
            </p>
          </div>

          <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-base font-bold mb-2 text-white">3. Choose & Reserve</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Accept the best offer and reserve your vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* New Inventory Carousel - TrueCar style */}
      {newCars.length > 0 && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-text-primary">New Inventory</h3>
              <Link href="/cars?condition=new" className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1 group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loadingNew ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading new cars...</div>
              </div>
            ) : (
              <div className="relative overflow-hidden">
                <style jsx>{`
                  @keyframes scrollNew {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  .scroll-container-new {
                    animation: scrollNew 6s linear infinite;
                  }
                  @media (min-width: 768px) {
                    .scroll-container-new {
                      animation: scrollNew 12s linear infinite;
                    }
                  }
                  .scroll-container-new:hover {
                    animation-play-state: paused;
                  }
                `}</style>

                <div className="scroll-container-new flex gap-4 pb-4">
                  {[...newCars, ...newCars].map((car, index) => {
                    let photoUrl = '';
                    try {
                      const photos = JSON.parse(car.photos || '[]');
                      photoUrl = photos[0] || '';
                    } catch (e) {
                      console.error('Failed to parse photos:', e);
                    }

                    return (
                      <Link
                        href={`/cars/${car.slug || car.id}`}
                        key={`new-${car.id}-${index}`}
                        className="flex-shrink-0 w-72 bg-white rounded-xl border border-border shadow-card overflow-hidden hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer group"
                      >
                        <div className="relative h-44 bg-light-dark overflow-hidden">
                          <Image
                            src={photoUrl || getPlaceholderImage(car.bodyType)}
                            alt={`${car.year} ${car.make} ${car.model}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="288px"
                          />
                          <div className="absolute top-3 left-3 bg-success text-white text-xs font-bold px-3 py-1 rounded-pill shadow-md">
                            NEW
                          </div>
                        </div>
                        <div className="p-4 border-t border-border">
                          <h4 className="font-bold text-base text-text-primary mb-2 line-clamp-1">
                            {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}`}
                          </h4>
                          <p className="text-xl font-bold text-primary mb-2">
                            {formatPrice(car.salePrice)}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-text-secondary flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {car.dealer.city}, {car.dealer.state}
                            </p>
                            <p className="text-xs text-text-muted truncate max-w-[100px]">{car.dealer.businessName}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="text-center mt-4 text-sm text-text-muted">
                  Hover to pause
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Car Loan Calculator Section */}
      <section className="bg-light-dark py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Car Loan Calculator</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Calculate your monthly car payment and see how different loan terms affect your budget. Find the perfect financing plan for your next vehicle.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-black rounded-xl shadow-card p-8">
              <FinancingCalculator darkMode={true} />

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 text-center">
                  Ready to find your perfect car? <Link href="/cars" className="text-accent font-semibold hover:text-accent-light transition-colors">Start shopping now</Link> and compare prices from local dealers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Why Choose Our Nationwide Car Marketplace?</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              The trusted online marketplace for new, certified pre-owned, and quality pre-owned vehicles. Compare prices from verified dealers and save up to $5,000.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* For Buyers */}
            <div className="bg-black p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Buyers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Search thousands of vehicles from local dealers</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Select up to 4 cars and watch dealers compete for your business</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Get up to 4 competitive offers per vehicle</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Reserve your car at the best price</span>
                </li>
              </ul>
            </div>

            {/* For Dealers */}
            <div className="bg-black p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Dealers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">90-day free trial - Silver, Gold, Platinum packages</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Connect with serious, motivated buyers</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Submit competitive offers to win deals</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Close more sales faster</span>
                </li>
              </ul>
              <Link
                href="/for-dealers"
                className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors"
              >
                Learn More About Dealer Benefits
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Guides Section */}
      <section className="bg-white py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Car Buying Guides & Resources</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Expert advice to help you make informed decisions about buying your next used car
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Blog Articles */}
            <Link href="/blog/how-to-finance-used-car-2025" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                How to Finance a Used Car
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Complete guide to getting the best auto loan rates and terms
              </p>
              <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/blog/new-vs-used-cars-first-time-buyers" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                New vs Used Cars
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Which option is best for first-time buyers? Compare costs and benefits
              </p>
              <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/blog/best-used-cars-under-20k" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                Best Used Cars Under $20k
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Our expert picks for reliable, affordable vehicles in 2025
              </p>
              <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/guides/how-to-buy-used-car" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">
                How to Buy a Used Car
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Step-by-step guide to avoid problems and get the best deal
              </p>
              <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Guide <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/guides/car-financing-guide" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">
                Car Financing Guide
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Improve your credit, compare lenders, and negotiate better rates
              </p>
              <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Guide <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link href="/guides/pre-purchase-inspection" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">
                Pre-Purchase Inspection
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Complete checklist to inspect any used car before buying
              </p>
              <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Checklist <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block bg-primary text-white px-8 py-4 rounded-pill text-lg font-bold hover:bg-primary-dark transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Location & Model Section */}
      <section className="bg-white py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Shop Cars by Location or Model
            </h2>
            <p className="text-lg text-text-secondary">Find the perfect vehicle in your area or browse by your favorite make and model</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Browse by Location */}
            <Link href="/locations" className="bg-black rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">Browse by Location</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Find used cars from trusted dealers in your city. We cover all 50 states and 180+ major cities across the US.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Atlanta</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Los Angeles</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Houston</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Chicago</span>
                <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-pill text-sm font-medium">+178 more</span>
              </div>
              <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                View All Locations
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Browse by Model */}
            <Link href="/models" className="bg-black rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                  <Car className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-white">Browse by Model</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Shop used cars by your favorite make and model. Find popular vehicles from Toyota, Honda, Ford, Chevrolet, and more.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Toyota Tacoma</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Honda Civic</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Ford F-150</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Jeep Wrangler</span>
                <span className="bg-accent/20 text-accent px-3 py-1.5 rounded-pill text-sm font-medium">+58 more</span>
              </div>
              <div className="flex items-center text-accent font-semibold group-hover:gap-3 transition-all">
                View All Models
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-light-dark py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="w-10 h-10 text-primary" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-text-secondary">Everything you need to know about buying and selling cars on IQ Auto Deals</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">How does our platform work?</h3>
              <p className="text-gray-400 leading-relaxed">
                Our nationwide marketplace connects you with the best deals on quality used cars. Browse thousands of vehicles from local dealers within 50 miles, select up to 4 cars you love, and request competitive offers. Dealers compete to win your business by offering their lowest prices. You simply choose the best deal and reserve your car.
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">Is it free for car buyers?</h3>
              <p className="text-gray-400 leading-relaxed">
                Yes! Searching for cars and requesting dealer offers is completely free. There are no hidden fees, no membership costs, and no obligations. You only pay when you decide to purchase a vehicle from a dealer.
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">How much can I save with online car shopping?</h3>
              <p className="text-gray-400 leading-relaxed">
                Buyers typically save $1,500 to $5,000 compared to traditional dealership prices. By creating competition between dealers, you get their absolute best price upfront without negotiating at multiple dealerships. Dealers bring their A-game to win your business!
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">How many dealer offers will I receive?</h3>
              <p className="text-gray-400 leading-relaxed">
                You can receive up to 4 competitive offers per vehicle from different dealers. This gives you multiple options to compare and ensures you get the best deal available in your area.
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">What types of vehicles are available?</h3>
              <p className="text-gray-400 leading-relaxed">
                We offer a wide selection of new and used cars from certified dealers nationwide. Our inventory includes sedans, SUVs, trucks, luxury vehicles, and certified pre-owned cars. All vehicles are inspected and verified by licensed dealerships.
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">How do I accept a deal and purchase a car?</h3>
              <p className="text-gray-400 leading-relaxed">
                Once you receive offers from dealers, you can review and compare them in your dashboard. When you find the best deal, simply accept the offer to reserve the vehicle. The dealer will contact you to schedule a test drive and complete the purchase process at their dealership.
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">Can I negotiate the price after receiving an offer?</h3>
              <p className="text-gray-400 leading-relaxed">
                While dealers submit their most competitive prices through our platform, you can still communicate directly with them after accepting an offer. However, most buyers find the offers already represent the best possible prices since dealers compete hard to win your business!
              </p>
            </div>

            <div className="bg-black p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-bold text-white mb-3">Are the dealers certified and legitimate?</h3>
              <p className="text-gray-400 leading-relaxed">
                Yes! All dealers on our marketplace are licensed, certified automotive dealerships. We verify each dealer's credentials, business license, and reputation before approval. You can buy with confidence knowing you're working with legitimate, professional dealers.
              </p>
            </div>
          </div>

          <FAQSchema faqs={[
            {
              question: 'How does the platform work?',
              answer: "Our nationwide marketplace connects you with the best deals on quality used cars. Browse thousands of vehicles from local dealers within 50 miles, select up to 4 cars you love, and request competitive offers. Dealers compete to win your business by offering their lowest prices. You simply choose the best deal and reserve your car."
            },
            {
              question: 'Is it free for car buyers?',
              answer: 'Yes! Searching for cars and requesting dealer offers is completely free. There are no hidden fees, no membership costs, and no obligations. You only pay when you decide to purchase a vehicle from a dealer.'
            },
            {
              question: 'How much can I save with online car shopping?',
              answer: 'Buyers typically save $1,500 to $5,000 compared to traditional dealership prices. By creating competition between dealers, you get their absolute best price upfront without negotiating at multiple dealerships.'
            },
            {
              question: 'How many dealer offers will I receive?',
              answer: 'You can receive up to 4 competitive offers per vehicle from different dealers. This gives you multiple options to compare and ensures you get the best deal available in your area.'
            },
            {
              question: 'What types of vehicles are available?',
              answer: 'We offer a wide selection of new and used cars from certified dealers nationwide. Our inventory includes sedans, SUVs, trucks, luxury vehicles, and certified pre-owned cars.'
            },
            {
              question: 'How do I accept a deal and purchase a car?',
              answer: 'Once you receive offers from dealers, you can review and compare them in your dashboard. When you find the best deal, simply accept the offer to reserve the vehicle. The dealer will contact you to schedule a test drive and complete the purchase.'
            },
            {
              question: 'Can I negotiate the price after receiving an offer?',
              answer: 'While dealers submit their most competitive prices through our platform, you can still communicate directly with them after accepting an offer. However, most buyers find the offers already represent the best possible prices since dealers compete hard to win your business!'
            },
            {
              question: 'Are the dealers certified and legitimate?',
              answer: 'Yes! All dealers on our marketplace are licensed, certified automotive dealerships. We verify each dealer credentials, business license, and reputation before approval.'
            }
          ]} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
