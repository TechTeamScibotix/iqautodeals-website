'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Pencil, AlertCircle, CheckCircle, XCircle, Clock, Mail, Settings } from 'lucide-react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  color: string;
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
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              IQ Auto Deals
            </h1>
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
              className="bg-purple text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-purple-700 transition font-semibold text-xs md:text-sm"
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

        {/* Add Car Button */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg md:text-2xl font-bold">My Inventory</h2>
          <Link
            href="/dealer/add-car"
            className="bg-primary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
          >
            + Add New Car
          </Link>
        </div>

        {/* Cars List */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
            <div className="text-3xl md:text-4xl mb-3">🚗</div>
            <h3 className="text-base md:text-lg font-semibold mb-2">No cars listed yet</h3>
            <p className="text-gray-600 mb-3 text-xs md:text-sm">Start listing your inventory to attract buyers</p>
            <Link
              href="/dealer/add-car"
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs md:text-sm"
            >
              List Your First Car
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
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
                    return <div className="flex items-center justify-center h-full text-6xl">🚗</div>;
                  })()}
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="font-bold text-xs md:text-sm mb-1 truncate">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 mb-2 truncate">{car.color} • {car.mileage.toLocaleString()} mi</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                    <span className="text-sm md:text-lg font-bold text-primary">
                      ${car.salePrice.toLocaleString()}
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
                      onClick={() => router.push(`/dealer/edit-car/${car.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-2 text-xs font-semibold"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car.id, `${car.year} ${car.make} ${car.model}`)}
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
