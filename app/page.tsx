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
  isDemo?: boolean;
  dealer: {
    businessName: string;
    city: string;
    state: string;
  };
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
  const [loading, setLoading] = useState(true);
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
    if (searchForm.make) params.append('make', searchForm.make);
    if (searchForm.model) params.append('model', searchForm.model);
    if (searchForm.state) params.append('state', searchForm.state);
    if (searchForm.fuelType) params.append('fuelType', searchForm.fuelType);
    router.push(`/cars?${params.toString()}`);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AIChat />
      {/* Header */}
      <header className="bg-dark shadow-md sticky top-0 z-50 h-20">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center h-full py-1">
              <LogoWithBeam className="h-full" />
            </Link>

            {/* Navigation Menu - cars.com style */}
            <nav className="hidden lg:flex gap-6 text-sm font-semibold">
              <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors">
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

            {/* Auth Buttons */}
            <div className="flex gap-3">
              <Link href="/login" className="text-gray-300 hover:text-primary px-5 py-2.5 rounded-lg transition-colors font-semibold flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative py-16 min-h-[600px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/car-lot-bg.png)' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: Search Panel */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-6">
              <h1 className="text-3xl font-bold mb-3 text-dark">
                Imagine the possibilities
              </h1>

              <p className="text-gray-600 mb-4 text-sm">
                Browse thousands of quality vehicles from trusted dealers. Search is free - no account needed!
              </p>

              {/* Search Form */}
              <div className="space-y-3">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-dark mb-3">Shop cars for sale</h3>
                </div>

                {/* Quick Search */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <input
                    type="text"
                    placeholder="Try great deals under $20k"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                  />
                </div>

                {/* Or Divider */}
                <div className="text-center text-gray-500 font-medium text-xs">
                  - Or search by -
                </div>

                {/* Advanced Filters */}
                <div className="space-y-2">
                  <select
                    value={searchForm.condition}
                    onChange={(e) => setSearchForm({ ...searchForm, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                  >
                    <option value="">New/Used</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>

                  <select
                    value={searchForm.make}
                    onChange={(e) => setSearchForm({ ...searchForm, make: e.target.value, model: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                  >
                    <option value="">All Makes ({filterOptions.makes.length})</option>
                    {filterOptions.makes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>

                  <select
                    value={searchForm.model}
                    onChange={(e) => setSearchForm({ ...searchForm, model: e.target.value })}
                    disabled={!searchForm.make}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {searchForm.make ? `All ${searchForm.make} Models (${availableModels.length})` : 'Select Make First'}
                    </option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>

                  <select
                    value={searchForm.state}
                    onChange={(e) => setSearchForm({ ...searchForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                  >
                    <option value="">All States ({filterOptions.states.length})</option>
                    {filterOptions.states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    value={searchForm.fuelType}
                    onChange={(e) => setSearchForm({ ...searchForm, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white text-sm"
                  >
                    <option value="">All Fuel Types</option>
                    {filterOptions.fuelTypes.length > 0 ? (
                      filterOptions.fuelTypes.map((fuelType) => (
                        <option key={fuelType} value={fuelType}>
                          {fuelType}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Flex Fuel">Flex Fuel</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  Show {filterOptions.totalCount > 0 ? filterOptions.totalCount.toLocaleString() : ''} Matches
                </button>
              </div>

              {/* Promotional Banner */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-secondary text-white px-3 py-2 rounded-lg text-center">
                  <p className="font-bold text-sm">Dealers: Sign Up Free - Trial 90 Days Free!</p>
                </div>
              </div>
            </div>

            {/* Right: Value Proposition */}
            <div className="lg:col-span-3 text-white space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-lg">
                Buy Used Cars Online<br />
                Compare Prices from<br />
                Nationwide Dealers
              </h2>
              <p className="text-xl text-gray-100 leading-relaxed drop-shadow-md">
                Shop thousands of certified pre-owned vehicles from trusted dealers. Get competitive quotes. Compare prices. Save up to $5,000 on your next car.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="text-3xl font-bold text-primary mb-1">Free</div>
                  <div className="text-sm text-gray-600">No fees to browse or request deals</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="text-3xl font-bold text-primary mb-1">Up to 3</div>
                  <div className="text-sm text-gray-600">Competitive offers per vehicle</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="text-3xl font-bold text-primary mb-1">$5,000</div>
                  <div className="text-sm text-gray-600">Average savings vs dealership</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="text-3xl font-bold text-primary mb-1">50mi</div>
                  <div className="text-sm text-gray-600">Search radius from your location</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Carousel */}
      <section className="bg-white py-12 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-dark">Featured Inventory</h3>
            <Link href="/cars" className="text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
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
                  animation: scroll 40s linear infinite;
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
                      className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary transition-all cursor-pointer"
                    >
                      <div className="relative h-48 bg-gray-200">
                        {photoUrl ? (
                          <Image
                            src={photoUrl}
                            alt={`${car.year} ${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                            sizes="288px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <Car className="w-16 h-16 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-lg text-dark">
                            {car.isDemo ? 'List Your Vehicle Today' : `${car.year} ${car.make} ${car.model}`}
                          </h4>
                          {car.isDemo && (
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                              Sample
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {car.dealer.city}, {car.dealer.state}
                        </p>
                        <p className="text-2xl font-bold text-primary mb-2">
                          {formatPrice(car.salePrice)}
                        </p>
                        <p className="text-xs text-gray-500">{car.dealer.businessName}</p>
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
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">How to Buy Used Cars Online - Simple 3-Step Process</h2>
          <p className="text-lg text-gray-600">Browse quality pre-owned vehicles, request dealer quotes, and save thousands in minutes</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="bg-primary w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">1. Search Locally</h3>
            <p className="text-gray-600 leading-relaxed">
              Browse thousands of vehicles from dealers within 50 miles of your location.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="bg-primary w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">2. Request Deals</h3>
            <p className="text-gray-600 leading-relaxed">
              Select up to 4 cars and get dealers competing to give you their absolute best price.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="bg-primary w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark">3. Choose & Reserve</h3>
            <p className="text-gray-600 leading-relaxed">
              Accept the best offer and reserve your vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* Car Loan Calculator Section */}
      <section className="bg-light-dark py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Car Loan Calculator</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate your monthly car payment and see how different loan terms affect your budget. Find the perfect financing plan for your next vehicle.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <FinancingCalculator />

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Ready to find your perfect car? <Link href="/cars" className="text-primary font-semibold hover:underline">Start shopping now</Link> and compare prices from local dealers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Why Choose Our Nationwide Car Marketplace?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The trusted online marketplace for quality used cars - compare dealer prices and save up to $5,000 on certified pre-owned vehicles
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Buyers */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary p-3 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark">For Buyers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Search thousands of vehicles from local dealers</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Select up to 4 cars and watch dealers compete for your business</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Get up to 3 competitive offers per vehicle</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Reserve your car at the best price</span>
                </li>
              </ul>
            </div>

            {/* For Dealers */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark">For Dealers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">90-day free trial - Silver, Gold, Platinum packages</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Connect with serious, motivated buyers</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Submit competitive offers to win deals</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Close more sales faster</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Guides Section */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Car Buying Guides & Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert advice to help you make informed decisions about buying your next used car
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Articles */}
            <Link href="/blog/how-to-finance-used-car-2025" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">
                How to Finance a Used Car
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Complete guide to getting the best auto loan rates and terms
              </p>
              <span className="text-primary font-semibold text-sm">Read Article →</span>
            </Link>

            <Link href="/blog/new-vs-used-cars-first-time-buyers" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">
                New vs Used Cars
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Which option is best for first-time buyers? Compare costs and benefits
              </p>
              <span className="text-primary font-semibold text-sm">Read Article →</span>
            </Link>

            <Link href="/blog/best-used-cars-under-20k" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">
                Best Used Cars Under $20k
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Our expert picks for reliable, affordable vehicles in 2025
              </p>
              <span className="text-primary font-semibold text-sm">Read Article →</span>
            </Link>

            <Link href="/guides/how-to-buy-used-car" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">
                How to Buy a Used Car
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Step-by-step guide to avoid problems and get the best deal
              </p>
              <span className="text-primary font-semibold text-sm">View Guide →</span>
            </Link>

            <Link href="/guides/car-financing-guide" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">
                Car Financing Guide
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Improve your credit, compare lenders, and negotiate better rates
              </p>
              <span className="text-primary font-semibold text-sm">View Guide →</span>
            </Link>

            <Link href="/guides/pre-purchase-inspection" className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">
                Pre-Purchase Inspection
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Complete checklist to inspect any used car before buying
              </p>
              <span className="text-primary font-semibold text-sm">View Checklist →</span>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-primary-dark transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Location & Model Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Shop Cars by Location or Model
            </h2>
            <p className="text-lg text-gray-600">Find the perfect vehicle in your area or browse by your favorite make and model</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Browse by Location */}
            <Link href="/locations" className="bg-white border border-border rounded-xl p-8 hover:shadow-xl hover:border-primary transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary w-16 h-16 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark">Browse by Location</h3>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Find used cars from trusted dealers in your city. We cover all 50 states and 180+ major cities across the US.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Atlanta</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Los Angeles</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Houston</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Chicago</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">+178 more</span>
              </div>
              <div className="flex items-center text-primary font-semibold text-lg group-hover:gap-3 transition-all">
                View All Locations
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Browse by Model */}
            <Link href="/models" className="bg-white border border-border rounded-xl p-8 hover:shadow-xl hover:border-accent transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-accent w-16 h-16 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark">Browse by Model</h3>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Shop used cars by your favorite make and model. Find popular vehicles from Toyota, Honda, Ford, Chevrolet, and more.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Toyota Tacoma</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Honda Civic</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Ford F-150</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">Jeep Wrangler</span>
                <span className="bg-light-dark px-3 py-1 rounded-full text-sm font-medium text-text-secondary">+58 more</span>
              </div>
              <div className="flex items-center text-accent font-semibold text-lg group-hover:gap-3 transition-all">
                View All Models
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-light py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-primary" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Everything you need to know about buying and selling cars on IQ Auto Deals</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">How does our platform work?</h3>
              <p className="text-gray-700 leading-relaxed">
                Our nationwide marketplace connects you with the best deals on quality used cars. Browse thousands of vehicles from local dealers within 50 miles, select up to 4 cars you love, and request competitive offers. Dealers compete to win your business by offering their lowest prices. You simply choose the best deal and reserve your car.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">Is it free for car buyers?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! Searching for cars and requesting dealer offers is completely free. There are no hidden fees, no membership costs, and no obligations. You only pay when you decide to purchase a vehicle from a dealer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">How much can I save with online car shopping?</h3>
              <p className="text-gray-700 leading-relaxed">
                Buyers typically save $1,500 to $5,000 compared to traditional dealership prices. By creating competition between dealers, you get their absolute best price upfront without negotiating at multiple dealerships. Dealers bring their A-game to win your business!
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">How many dealer offers will I receive?</h3>
              <p className="text-gray-700 leading-relaxed">
                You can receive up to 3 competitive offers per vehicle from different dealers. This gives you multiple options to compare and ensures you get the best deal available in your area.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">What types of vehicles are available?</h3>
              <p className="text-gray-700 leading-relaxed">
                We offer a wide selection of new and used cars from certified dealers nationwide. Our inventory includes sedans, SUVs, trucks, luxury vehicles, and certified pre-owned cars. All vehicles are inspected and verified by licensed dealerships.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">How do I accept a deal and purchase a car?</h3>
              <p className="text-gray-700 leading-relaxed">
                Once you receive offers from dealers, you can review and compare them in your dashboard. When you find the best deal, simply accept the offer to reserve the vehicle. The dealer will contact you to schedule a test drive and complete the purchase process at their dealership.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">Can I negotiate the price after receiving an offer?</h3>
              <p className="text-gray-700 leading-relaxed">
                While dealers submit their most competitive prices through our platform, you can still communicate directly with them after accepting an offer. However, most buyers find the offers already represent the best possible prices since dealers compete hard to win your business!
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-dark mb-3">Are the dealers certified and legitimate?</h3>
              <p className="text-gray-700 leading-relaxed">
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
              answer: 'You can receive up to 3 competitive offers per vehicle from different dealers. This gives you multiple options to compare and ensures you get the best deal available in your area.'
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
