'use client';

import { useState, useEffect, useRef, Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Car, Search, TrendingDown, CheckCircle, Sparkles, ArrowRight, LogIn, UserPlus, MapPin, Globe } from 'lucide-react';
import AIChat from './components/AIChat';
import FinancingCalculator from './components/FinancingCalculator';
import Footer from './components/Footer';
import { BorderBeam } from '@/components/AnimatedBorder';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { trackFunnelStep } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { useGeoLocation } from '@/lib/useGeoLocation';

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
  lang?: 'en' | 'es';
}

const t = {
  en: {
    heroTitle: 'Buy New & Used Cars Online — Dealers Compete, You Save',
    heroSub: 'Browse thousands of vehicles from verified dealers nationwide. Select up to 4 cars and receive competing offers —',
    heroSubBold: 'no haggling required.',
    searchPlaceholder: 'Search make, model, or type',
    search: 'Search',
    states: 'States',
    vehicles: 'Vehicles',
    nationwide: 'Nationwide Shipping',
    shopNew: 'Shop New',
    shopUsed: 'Shop Used',
    shopElectric: 'Shop Electric',
    buyOnline: 'Buy Online',
    sources: 'Sources',
    browseByBody: 'Browse by Body Type',
    featuredInventory: 'Featured Inventory',
    featuredNear: 'Featured Cars Near',
    newInventory: 'New Inventory',
    newNear: 'New Cars Near',
    viewAll: 'View All',
    hoverPause: 'Hover to pause',
    calcTitle: 'Car Loan Calculator',
    calcSub: 'Calculate your monthly car payment and see how different loan terms affect your budget. Find the perfect financing plan for your next vehicle.',
    calcCta: 'Start shopping now',
    calcCtaPrefix: 'Ready to find your perfect car?',
    calcCtaSuffix: 'and compare prices from local dealers.',
    newVehicles: 'New Vehicles',
    usedVehicles: 'Used Vehicles',
    forDealers: 'For Dealers',
    research: 'Research & Reviews',
    financing: 'Financing',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    langSwitch: 'ES',
    langHref: '/es',
  },
  es: {
    heroTitle: 'Compra Autos Nuevos y Usados en Línea — Los Concesionarios Compiten, Tú Ahorras',
    heroSub: 'Explora miles de vehículos de concesionarios verificados en todo el país. Selecciona hasta 4 autos y recibe ofertas competitivas —',
    heroSubBold: 'sin regatear.',
    searchPlaceholder: 'Buscar marca, modelo o tipo',
    search: 'Buscar',
    states: 'Estados',
    vehicles: 'Vehículos',
    nationwide: 'Envío Nacional',
    shopNew: 'Nuevos',
    shopUsed: 'Usados',
    shopElectric: 'Eléctricos',
    buyOnline: 'Comprar',
    sources: 'Fuentes',
    browseByBody: 'Buscar por Tipo de Carrocería',
    featuredInventory: 'Inventario Destacado',
    featuredNear: 'Autos Cerca de',
    newInventory: 'Inventario Nuevo',
    newNear: 'Autos Nuevos Cerca de',
    viewAll: 'Ver Todo',
    hoverPause: 'Pausa al pasar el cursor',
    calcTitle: 'Calculadora de Préstamo de Auto',
    calcSub: 'Calcula tu pago mensual y ve cómo diferentes plazos afectan tu presupuesto.',
    calcCta: 'Empieza a buscar ahora',
    calcCtaPrefix: '¿Listo para encontrar tu auto perfecto?',
    calcCtaSuffix: 'y compara precios de concesionarios locales.',
    newVehicles: 'Nuevos',
    usedVehicles: 'Usados',
    forDealers: 'Concesionarios',
    research: 'Investigación',
    financing: 'Financiamiento',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    langSwitch: 'EN',
    langHref: '/',
  },
};

export default function HomeClient({ howItWorksSection, benefitsSection, resourcesSection, browseSection, faqSection, lang = 'en' }: HomeClientProps) {
  const i = t[lang];
  // Prefix helper: appends lang=es to links when on Spanish page
  const lp = (href: string) => lang === 'es' ? `${href}${href.includes('?') ? '&' : '?'}lang=es` : href;
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

  // Geo location
  const geoLocation = useGeoLocation();

  // Get models for selected make
  const availableModels = searchForm.make
    ? filterOptions.modelsByMake[searchForm.make.toUpperCase()] || []
    : [];

  // Set html lang attribute for Spanish page
  useEffect(() => {
    if (lang === 'es') {
      document.documentElement.lang = 'es';
      return () => { document.documentElement.lang = 'en'; };
    }
  }, [lang]);

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
    if (lang === 'es') params.append('lang', 'es');
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

  // Fetch nearby cars when geo location is available
  useEffect(() => {
    if (!geoLocation) return;

    // Pre-fill search form ZIP
    setSearchForm(prev => prev.zipCode ? prev : { ...prev, zipCode: geoLocation.zip });

    // Fetch nearby featured cars
    fetch(`/api/nearby-cars?lat=${geoLocation.lat}&lng=${geoLocation.lng}&limit=12`)
      .then(res => res.json())
      .then(data => {
        if (data.cars?.length > 0) setFeaturedCars(data.cars);
      })
      .catch(() => {});

    // Fetch nearby new cars
    fetch(`/api/nearby-cars?lat=${geoLocation.lat}&lng=${geoLocation.lng}&limit=12&condition=new`)
      .then(res => res.json())
      .then(data => {
        if (data.cars?.length > 0) setNewCars(data.cars);
      })
      .catch(() => {});
  }, [geoLocation]);

  return (
    <div className="min-h-screen bg-light-dark font-sans">
      <AIChat />
      {/* Header */}
      <header className="bg-black sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-3 md:px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center h-full py-1" aria-label="IQ Auto Deals - Home">
              <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex gap-8 text-sm font-semibold">
              <Link href={lp("/cars?condition=new")} className="text-white hover:text-primary transition-colors py-2">
                {i.newVehicles}
              </Link>
              <Link href={lp("/cars?condition=used")} className="text-white hover:text-primary transition-colors py-2">
                {i.usedVehicles}
              </Link>
              <Link href="/for-dealers" className="text-white hover:text-primary transition-colors py-2">
                {i.forDealers}
              </Link>
              <Link href="/blog" className="text-white hover:text-primary transition-colors py-2">
                {i.research}
              </Link>
              <Link href="/guides/car-financing-guide" className="text-white hover:text-primary transition-colors py-2">
                {i.financing}
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <Link href={i.langHref} className="text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2">
                <Globe className="w-3 h-3 md:w-4 md:h-4" />
                {i.langSwitch}
              </Link>
              <Link href="/login" className="text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2">
                <LogIn className="w-3 h-3 md:w-4 md:h-4" />
                {i.signIn}
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2"
              >
                <UserPlus className="w-3 h-3 md:w-4 md:h-4" />
                {i.signUp}
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
          preload="auto"
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          aria-label="IQ Auto Deals nationwide online car marketplace - browse new and used cars from verified dealers"
        >
          <source src="/New.mp4" type="video/mp4" />
        </video>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
            {i.heroTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-6 drop-shadow-lg">
            {i.heroSub} <span className="font-bold text-white">{i.heroSubBold}</span>
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
                  placeholder={i.searchPlaceholder}
                  aria-label={i.searchPlaceholder}
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

          {/* Quick Action Tiles — link to SEO pages for link equity */}
          <div className="flex gap-2">
            <Link
              href={lp("/new-cars")}
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
              href={lp("/cars-for-sale-near-me")}
              className="bg-black/50 backdrop-blur-sm rounded-lg px-5 py-3 hover:bg-black/60 transition-all group text-center"
            >
              <div className="w-8 h-8 mb-1 mx-auto flex items-center justify-center">
                <Car className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-white text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                Near Me <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href={lp("/trucks-for-sale-near-me")}
              className="bg-black/50 backdrop-blur-sm rounded-lg px-5 py-3 hover:bg-black/60 transition-all group text-center"
            >
              <div className="w-8 h-8 mb-1 mx-auto flex items-center justify-center">
                <Car className="w-6 h-6 text-teal-400" />
              </div>
              <div className="text-white text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                Trucks <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href={lp("/cars")}
              className="bg-black/50 backdrop-blur-sm rounded-lg px-5 py-3 hover:bg-black/60 transition-all group text-center relative"
            >
              <div className="w-8 h-8 mb-1 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-white text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                Browse All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Browse by Body Type</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Minivan', 'Wagon', 'Van', 'Crossover'].map((type) => (
              <Link
                key={type}
                href={lp(`/cars?bodyType=${encodeURIComponent(type)}`)}
                className="px-5 py-2.5 bg-white/10 hover:bg-primary hover:text-white rounded-pill font-medium text-white transition-all"
              >
                {type}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <Link
              href={lp("/cars?fuelType=Electric")}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/20 hover:bg-accent hover:text-white rounded-pill font-medium text-accent transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Electric
            </Link>
            <Link
              href={lp("/cars?fuelType=Hybrid")}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/20 hover:bg-accent hover:text-white rounded-pill font-medium text-accent transition-all"
            >
              <TrendingDown className="w-4 h-4" />
              Hybrid
            </Link>
          </div>
        </div>
      </section>

      {/* Server-rendered: How It Works — placed early for SEO weight */}
      <Fragment key="how-it-works">{howItWorksSection}</Fragment>

      {/* Featured Cars Carousel */}
      <section className="bg-light-dark py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {geoLocation ? `Used Cars for Sale Near ${geoLocation.label}` : 'Featured Used Cars for Sale'}
            </h2>
            <Link href={lp("/cars")} className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-4 pb-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-border shadow-card overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 border-t border-border space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
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
                      href={lp(`/cars/${car.slug || car.id}`)}
                      key={`${car.id}-${index}`}
                      className="flex-shrink-0 w-72 bg-white rounded-xl border border-border shadow-card overflow-hidden hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="relative h-44 bg-light-dark overflow-hidden">
                        <Image
                          src={photoUrl || getPlaceholderImage(car.bodyType)}
                          alt={`${car.year} ${car.make} ${car.model} for sale in ${car.dealer.city} ${car.dealer.state} - IQ Auto Deals`}
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

      {/* New Inventory Carousel */}
      {(loadingNew || newCars.length > 0) && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {geoLocation ? `New Cars for Sale Near ${geoLocation.label}` : 'New Cars for Sale'}
              </h2>
              <Link href={lp("/cars?condition=new")} className="text-primary font-semibold hover:text-primary-dark flex items-center gap-1 group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loadingNew ? (
              <div className="flex gap-4 pb-4 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-border shadow-card overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-200" />
                    <div className="p-4 border-t border-border space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
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
                        href={lp(`/cars/${car.slug || car.id}`)}
                        key={`new-${car.id}-${index}`}
                        className="flex-shrink-0 w-72 bg-white rounded-xl border border-border shadow-card overflow-hidden hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer group"
                      >
                        <div className="relative h-44 bg-light-dark overflow-hidden">
                          <Image
                            src={photoUrl || getPlaceholderImage(car.bodyType)}
                            alt={`New ${car.year} ${car.make} ${car.model} for sale in ${car.dealer.city} ${car.dealer.state} - IQ Auto Deals`}
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
                  Ready to find your perfect car? <Link href={lp("/cars")} className="text-accent font-semibold hover:text-accent-light transition-colors">Start shopping now</Link> and compare prices from local dealers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Server-rendered: Benefits */}
      <Fragment key="benefits">{benefitsSection}</Fragment>

      {/* Server-rendered: Resources & Guides */}
      <Fragment key="resources">{resourcesSection}</Fragment>

      {/* Server-rendered: Browse by Location & Model */}
      <Fragment key="browse">{browseSection}</Fragment>

      {/* Server-rendered: FAQ */}
      <Fragment key="faq">{faqSection}</Fragment>

      {/* Footer */}
      <Footer />
    </div>
  );
}
