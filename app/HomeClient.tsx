'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Car, Search, TrendingDown, CheckCircle, Sparkles, ArrowRight, LogIn, UserPlus, MapPin } from 'lucide-react';
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
  trim?: string;
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

interface HomeClientProps {
  howItWorksSection: ReactNode;
  benefitsSection: ReactNode;
  resourcesSection: ReactNode;
  browseSection: ReactNode;
  faqSection: ReactNode;
}

export default function HomeClient({ howItWorksSection, benefitsSection, resourcesSection, browseSection, faqSection }: HomeClientProps) {
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
      {/* Header */}
      <header className="bg-black sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-3 md:px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center h-full py-1">
              <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
            </Link>

            {/* Navigation Menu */}
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

            {/* Auth Buttons */}
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
          preload="none"
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/New.mp4" type="video/mp4" />
        </video>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
            Shop Cars. Compare Offers. Save More.
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-6 drop-shadow-lg">
            AI-powered vehicle comparisons, market insights, and competitive dealer offers — <span className="font-bold text-white">all in one place.</span>
          </p>

          {/* Search Bar + Stats Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="bg-white rounded-pill shadow-xl p-1 w-full sm:w-96">
              <div className="flex items-center">
                <Search className="w-4 h-4 text-gray-400 ml-4 flex-shrink-0" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search make, model, or type"
                  aria-label="Search for vehicles"
                  className="flex-1 min-w-0 px-3 py-2.5 bg-transparent border-none focus:outline-none text-text-primary placeholder-gray-400 text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="bg-primary text-white px-6 py-2.5 rounded-pill font-semibold hover:bg-primary-dark transition-colors text-sm flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white drop-shadow-lg">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold leading-none">50+</div>
                <div className="text-[10px] text-gray-300">States</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold leading-none">1000+</div>
                <div className="text-[10px] text-gray-300">Vehicles</div>
              </div>
              <div className="text-sm sm:text-lg font-bold text-accent uppercase leading-tight whitespace-nowrap">
                Nationwide Shipping
              </div>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="flex gap-2">
            <Link
              href="/cars?condition=new"
              className="bg-black/50 backdrop-blur-sm rounded-lg px-5 py-3 hover:bg-black/60 transition-all group text-center"
            >
              <div className="w-8 h-8 mb-1 mx-auto flex items-center justify-center">
                <Car className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-white text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                Shop New <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/cars?condition=used"
              className="bg-black/50 backdrop-blur-sm rounded-lg px-5 py-3 hover:bg-black/60 transition-all group text-center"
            >
              <div className="w-8 h-8 mb-1 mx-auto flex items-center justify-center">
                <Car className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-white text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                Shop Used <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/cars?fuelType=Electric"
              className="bg-black/50 backdrop-blur-sm rounded-lg px-5 py-3 hover:bg-black/60 transition-all group text-center"
            >
              <div className="w-8 h-8 mb-1 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-teal-400" />
              </div>
              <div className="text-white text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                Shop Electric <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/cars"
              className="bg-black/50 backdrop-blur-sm rounded-lg px-5 py-3 hover:bg-black/60 transition-all group text-center relative"
            >
              <div className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                NEW
              </div>
              <div className="w-8 h-8 mb-1 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-white text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                Buy Online <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Strip - Below Hero */}
      <section className="bg-black py-1">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-white mb-1">
            Compare prices and receive competitive offers from verified dealers nationwide. Let dealers compete for your business.
          </p>
          <div className="flex items-baseline justify-center gap-6 sm:gap-8">
            <div>
              <span className="text-xl sm:text-3xl font-bold text-white">50+</span>
              <span className="text-xs sm:text-sm text-gray-400 ml-1">Sources</span>
            </div>
            <div>
              <span className="text-xl sm:text-3xl font-bold text-white">1000+</span>
              <span className="text-xs sm:text-sm text-accent font-semibold uppercase ml-1">Nationwide Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Body Type - Simple Text Pills */}
      <section className="bg-black py-4">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Browse by Body Type</h3>
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

      {/* Featured Cars Carousel */}
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
                          {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`}
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

      {/* Server-rendered: How It Works */}
      {howItWorksSection}

      {/* New Inventory Carousel */}
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
                            {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`}
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

      {/* Server-rendered: Benefits */}
      {benefitsSection}

      {/* Server-rendered: Resources & Guides */}
      {resourcesSection}

      {/* Server-rendered: Browse by Location & Model */}
      {browseSection}

      {/* Server-rendered: FAQ */}
      {faqSection}

      {/* Footer */}
      <Footer />
    </div>
  );
}
