'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Pencil, AlertCircle, CheckCircle, XCircle, Clock, Mail, Settings, Search, X, Sparkles, Loader2, Car } from 'lucide-react';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { formatPrice } from '@/lib/format';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  color: string;
  fuelType?: string;
  salePrice: number;
  status: string;
  photos: string;
  acceptedDeals?: { sold: boolean }[];
}

export default function DealerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [soldCount, setSoldCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddCar, setShowAddCar] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMake, setFilterMake] = useState('');
  const [filterModel, setFilterModel] = useState('');

  // Bulk SEO update state
  const [updatingSEO, setUpdatingSEO] = useState(false);
  const [seoProgress, setSeoProgress] = useState({ current: 0, total: 0, currentCar: '' });
  const [seoResults, setSeoResults] = useState<{ success: number; failed: number } | null>(null);

  // Warn user if they try to leave during SEO update
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (updatingSEO) {
        e.preventDefault();
        e.returnValue = 'SEO update is in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [updatingSEO]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.userType !== 'dealer') {
      router.push('/customer');
      return;
    }

    setUser(parsed);
    loadCars(parsed.id);
  }, [router]);

  const loadCars = async (dealerId: string) => {
    try {
      const res = await fetch(`/api/dealer/cars?dealerId=${dealerId}`);
      const data = await res.json();
      setCars(data.cars || []);
      setSoldCount(data.soldCount || 0);
    } catch (error) {
      console.error('Failed to load cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDelete = async (carId: string, carInfo: string) => {
    if (!confirm(`Are you sure you want to delete ${carInfo}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/dealer/cars/${carId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Car deleted successfully');
        loadCars(user.id);
      } else {
        alert('Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  // Bulk update all car descriptions with AI-generated SEO content
  const handleBulkSEOUpdate = async () => {
    if (!user || cars.length === 0) return;

    const activeCars = cars.filter(c => c.status === 'active');
    if (activeCars.length === 0) {
      alert('No active listings to update');
      return;
    }

    if (!confirm(`This will update descriptions for ${activeCars.length} active listing(s) using AI. This may take a few minutes. Continue?`)) {
      return;
    }

    setUpdatingSEO(true);
    setSeoProgress({ current: 0, total: activeCars.length, currentCar: '' });
    setSeoResults(null);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < activeCars.length; i++) {
      const car = activeCars[i];
      const carName = `${car.year} ${car.make} ${car.model}`;
      setSeoProgress({ current: i + 1, total: activeCars.length, currentCar: carName });

      try {
        // First, get the full car details
        const carResponse = await fetch(`/api/dealer/cars/${car.id}?dealerId=${user.id}`);
        if (!carResponse.ok) {
          failedCount++;
          continue;
        }
        const carDetails = await carResponse.json();

        // Generate new SEO description
        const seoResponse = await fetch('/api/generate-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            make: carDetails.make,
            model: carDetails.model,
            year: carDetails.year,
            mileage: carDetails.mileage,
            color: carDetails.color,
            transmission: carDetails.transmission,
            salePrice: carDetails.salePrice,
            city: carDetails.city,
            state: carDetails.state,
            vin: carDetails.vin,
          }),
        });

        if (!seoResponse.ok) {
          failedCount++;
          continue;
        }

        const seoData = await seoResponse.json();

        // Update the car with the new description
        const updateResponse = await fetch(`/api/dealer/cars/${car.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...carDetails,
            description: seoData.description,
          }),
        });

        if (updateResponse.ok) {
          successCount++;
        } else {
          failedCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error updating ${carName}:`, error);
        failedCount++;
      }
    }

    setUpdatingSEO(false);
    setSeoResults({ success: successCount, failed: failedCount });

    // Reload cars to show updated descriptions
    loadCars(user.id);
  };

  // Compute unique filter options from cars
  const uniqueYears = [...new Set(cars.map(c => c.year))].sort((a, b) => b - a);
  const uniqueMakes = [...new Set(cars.map(c => c.make.toUpperCase()))].sort();
  const uniqueModels = filterMake
    ? [...new Set(cars.filter(c => c.make.toUpperCase() === filterMake).map(c => c.model))].sort()
    : [...new Set(cars.map(c => c.model))].sort();

  // Filter cars based on search and filters
  const filteredCars = cars.filter(car => {
    const matchesSearch = !searchQuery ||
      `${car.year} ${car.make} ${car.model} ${car.vin} ${car.color}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = !filterYear || car.year === parseInt(filterYear);
    const matchesMake = !filterMake || car.make.toUpperCase() === filterMake;
    const matchesModel = !filterModel || car.model === filterModel;
    return matchesSearch && matchesYear && matchesMake && matchesModel;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterYear('');
    setFilterMake('');
    setFilterModel('');
  };

  const hasActiveFilters = searchQuery || filterYear || filterMake || filterModel;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm h-20">
        <div className="container mx-auto px-4 h-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 h-full py-1">
            <Link href="/" className="flex items-center h-full">
              <LogoWithBeam className="h-full" variant="dark" />
            </Link>
            <p className="text-xs md:text-sm text-gray-600">Dealer Dashboard</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button
              onClick={() => router.push('/dealer/negotiations')}
              className="bg-accent text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-green-600 transition font-semibold text-xs md:text-sm"
            >
              Deal Requests
            </button>
            <button
              onClick={() => router.push('/dealer/reporting')}
              className="bg-purple-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-purple-700 transition font-semibold text-xs md:text-sm"
            >
              Reporting
            </button>
            <button
              onClick={() => router.push('/dealer/settings')}
              className="text-gray-600 hover:text-gray-800 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition"
              title="Account Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <span className="text-gray-700 text-xs md:text-sm">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 text-xs md:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Verification Status Banner */}
      {user?.verificationStatus === 'pending' && (
        <div className="bg-amber-50 border-b-2 border-amber-400">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800 text-lg">Account Under Review</span>
              </div>
              <div className="flex-1">
                <p className="text-amber-800 text-sm">
                  Please email a copy of your current business license for verification to{' '}
                  <a href="mailto:Techteam@scibotixsolutions.com" className="font-bold underline hover:text-amber-900">
                    Techteam@scibotixsolutions.com
                  </a>
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  Verification within 2 hours of license uploaded. Your inventory will not be visible to customers until approved.
                </p>
              </div>
              <a
                href="mailto:Techteam@scibotixsolutions.com?subject=Business License Verification - IQ Auto Deals&body=Please find attached my business license for verification.%0A%0ABusiness Name: %0ADealer Name: %0AEmail: "
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                Send License
              </a>
            </div>
          </div>
        </div>
      )}

      {user?.verificationStatus === 'rejected' && (
        <div className="bg-red-50 border-b-2 border-red-400">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800 text-lg">Verification Declined</span>
              </div>
              <div className="flex-1">
                <p className="text-red-800 text-sm">
                  Your account verification was not approved. Please contact us for more information.
                </p>
                <p className="text-red-700 text-xs mt-1">
                  Email: <a href="mailto:Techteam@scibotixsolutions.com" className="font-bold underline">Techteam@scibotixsolutions.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.verificationStatus === 'approved' && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 text-sm font-medium">Account Verified - Your inventory is live!</span>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-3 md:p-6 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Total Listings</div>
            <div className="text-xl md:text-3xl font-bold text-primary">{cars.length}</div>
          </div>
          <div className="bg-white p-3 md:p-6 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Active</div>
            <div className="text-xl md:text-3xl font-bold text-accent">
              {cars.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white p-3 md:p-6 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Pending</div>
            <div className="text-xl md:text-3xl font-bold text-orange-500">
              {cars.filter(c => c.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-3 md:p-6 rounded-lg shadow">
            <div className="text-xs md:text-sm text-gray-600">Sold</div>
            <div className="text-xl md:text-3xl font-bold text-secondary">
              {soldCount}
            </div>
          </div>
        </div>

        {/* Inventory Header */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg md:text-2xl font-bold">My Inventory</h2>
          <div className="flex flex-wrap items-center gap-2">
            {/* Agentix SEO Button */}
            <button
              onClick={handleBulkSEOUpdate}
              disabled={updatingSEO || cars.filter(c => c.status === 'active').length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 md:px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingSEO ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Updating {seoProgress.current}/{seoProgress.total}</span>
                  <span className="sm:hidden">{seoProgress.current}/{seoProgress.total}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Agentix SEO</span>
                  <span className="sm:hidden">SEO</span>
                </>
              )}
            </button>
            <Link
              href="/dealer/add-car"
              className="bg-primary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
            >
              + Add New Car
            </Link>
          </div>
        </div>

        {/* SEO Update Progress/Results */}
        {(updatingSEO || seoResults) && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow border-l-4 border-purple-600">
            {updatingSEO ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">
                    Updating descriptions with AI ({seoProgress.current} of {seoProgress.total})
                  </p>
                  <p className="text-sm text-gray-600">Currently processing: {seoProgress.currentCar}</p>
                </div>
              </div>
            ) : seoResults && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">SEO Update Complete</p>
                    <p className="text-sm text-gray-600">
                      {seoResults.success} updated successfully
                      {seoResults.failed > 0 && `, ${seoResults.failed} failed`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSeoResults(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search and Filters */}
        {cars.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by year, make, model, VIN, or color..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              {/* Year Filter */}
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white min-w-[100px]"
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Make Filter */}
              <select
                value={filterMake}
                onChange={(e) => {
                  setFilterMake(e.target.value);
                  setFilterModel(''); // Reset model when make changes
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white min-w-[120px]"
              >
                <option value="">All Makes</option>
                {uniqueMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>

              {/* Model Filter */}
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                disabled={!filterMake}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white min-w-[120px] disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">{filterMake ? 'All Models' : 'Select Make'}</option>
                {uniqueModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Results Count */}
            {hasActiveFilters && (
              <div className="mt-3 text-sm text-gray-600">
                Showing {filteredCars.length} of {cars.length} vehicles
              </div>
            )}
          </div>
        )}

        {/* Cars List */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
            <Car className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base md:text-lg font-semibold mb-2">No cars listed yet</h3>
            <p className="text-gray-600 mb-3 text-xs md:text-sm">Start listing your inventory to attract buyers</p>
            <Link
              href="/dealer/add-car"
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs md:text-sm"
            >
              List Your First Car
            </Link>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
            <div className="text-3xl md:text-4xl mb-3">🔍</div>
            <h3 className="text-base md:text-lg font-semibold mb-2">No vehicles match your search</h3>
            <p className="text-gray-600 mb-3 text-xs md:text-sm">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs md:text-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer group"
                onClick={() => router.push(`/dealer/edit-car/${car.id}`)}
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
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        );
                      }
                    } catch (e) {
                      console.error('Failed to parse photos:', e);
                    }
                    return (
                      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                        <div className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-lg">
                          IN STOCK
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Photos Coming Soon</p>
                      </div>
                    );
                  })()}
                  {/* Tap hint overlay on mobile */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white px-3 py-1 rounded text-xs font-medium">
                      Tap to edit
                    </span>
                  </div>
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="font-bold text-xs md:text-sm mb-1 truncate">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 mb-2 truncate">{car.color} • {car.mileage.toLocaleString()} mi{car.fuelType && ` • ${car.fuelType}`}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                    <span className="text-sm md:text-lg font-bold text-primary">
                      {formatPrice(car.salePrice)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      car.acceptedDeals?.[0]?.sold
                        ? 'bg-gray-100 text-gray-800'
                        : car.status === 'sold'
                        ? 'bg-yellow-100 text-yellow-800'
                        : car.status === 'pending'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {car.acceptedDeals?.[0]?.sold ? 'sold' : car.status === 'sold' ? 'sale pending' : car.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">VIN: {car.vin}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/dealer/edit-car/${car.id}`); }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-2 text-xs font-semibold"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(car.id, `${car.year} ${car.make} ${car.model}`); }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-2 text-xs font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
