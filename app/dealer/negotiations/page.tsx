'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface DealList {
  id: string;
  customerId: string;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  selectedCars: Array<{
    id: string;
    carId: string;
    originalPrice: number;
    currentOfferPrice: number;
    negotiationCount: number;
    status?: string;
    car: {
      id: string;
      make: string;
      model: string;
      year: number;
      photos: string;
      salePrice: number;
      mileage: number;
      dealerId: string;
      dealer?: {
        id: string;
        businessName: string | null;
        name: string;
      };
      acceptedDeals?: Array<{
        id: string;
        verificationCode: string;
        finalPrice: number;
        createdAt: string;
        sold: boolean;
        deadDeal: boolean;
        testDrive?: {
          id: string;
          status: string;
          scheduledDate?: string;
          scheduledTime?: string;
        };
      }>;
    };
    negotiations: Array<{
      id: string;
      dealerId: string;
      offeredPrice: number;
    }>;
  }>;
}

export default function DealerNegotiations() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dealLists, setDealLists] = useState<DealList[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'pending' | 'lost' | 'deadDeals'>('incoming');
  const [offerForm, setOfferForm] = useState<{
    selectedCarId: string;
    offerPrice: string;
  } | null>(null);
  const [scheduleForm, setScheduleForm] = useState<{
    testDriveId: string;
    scheduledDate: string;
    scheduledTime: string;
  } | null>(null);
  const [soldForm, setSoldForm] = useState<{
    acceptedDealId: string;
    offeredPrice: number;
    finalPrice: string;
    useDifferentPrice: boolean;
  } | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

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
    loadDealRequests(parsed.id);
  }, [router]);

  const loadDealRequests = async (dealerId: string) => {
    try {
      const res = await fetch(`/api/dealer/deal-requests?dealerId=${dealerId}`);
      const data = await res.json();
      setDealLists(data.dealLists || []);
    } catch (error) {
      console.error('Failed to load deal requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!offerForm || !offerForm.offerPrice) {
      alert('Please enter an offer price');
      return;
    }

    try {
      const res = await fetch('/api/dealer/submit-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedCarId: offerForm.selectedCarId,
          dealerId: user.id,
          offerPrice: offerForm.offerPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Offer submitted successfully!');
        setOfferForm(null);
        loadDealRequests(user.id);
      } else {
        alert(data.error || 'Failed to submit offer');
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('Error submitting offer');
    }
  };

  const handleScheduleAppointment = async () => {
    if (!scheduleForm || !scheduleForm.scheduledDate || !scheduleForm.scheduledTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      const res = await fetch('/api/dealer/update-test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testDriveId: scheduleForm.testDriveId,
          scheduledDate: scheduleForm.scheduledDate,
          scheduledTime: scheduleForm.scheduledTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Appointment scheduled successfully!');
        setScheduleForm(null);
        loadDealRequests(user.id);
      } else {
        alert(data.error || 'Failed to schedule appointment');
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Error scheduling appointment');
    }
  };

  const handleMarkAsSold = async () => {
    if (!soldForm) return;

    const finalPrice = soldForm.useDifferentPrice
      ? parseFloat(soldForm.finalPrice)
      : soldForm.offeredPrice;

    if (soldForm.useDifferentPrice && (!soldForm.finalPrice || isNaN(finalPrice) || finalPrice <= 0)) {
      alert('Please enter a valid sale price');
      return;
    }

    try {
      const res = await fetch('/api/dealer/mark-as-sold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptedDealId: soldForm.acceptedDealId,
          finalPrice: finalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Deal marked as sold successfully!');
        setSoldForm(null);
        loadDealRequests(user.id);
      } else {
        alert(data.error || 'Failed to mark deal as sold');
      }
    } catch (error) {
      console.error('Error marking deal as sold:', error);
      alert('Error marking deal as sold');
    }
  };

  const handleDeadDeal = async (acceptedDealId: string | undefined) => {
    if (!acceptedDealId) {
      alert('Error: No accepted deal found for this car');
      return;
    }

    if (!confirm('Are you sure you want to mark this deal as dead? This will cancel the deal and make the car available again.')) {
      return;
    }

    try {
      const res = await fetch('/api/dealer/dead-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptedDealId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Deal marked as dead successfully!');
        loadDealRequests(user.id);
      } else {
        alert(data.error || 'Failed to mark deal as dead');
      }
    } catch (error) {
      console.error('Error marking deal as dead:', error);
      alert('Error marking deal as dead');
    }
  };

  const getOfferCount = (selectedCarId: string) => {
    for (const dealList of dealLists) {
      const selectedCar = dealList.selectedCars.find((sc) => sc.id === selectedCarId);
      if (selectedCar) {
        return selectedCar.negotiations.filter((n) => n.dealerId === user.id).length;
      }
    }
    return 0;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'TBD') return 'TBD';
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayName} - ${monthName} ${day}, ${year}`;
  };

  const formatTime = (timeString: string) => {
    if (timeString === 'TBD') return 'TBD';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              IQ Auto Deals
            </h1>
            <p className="text-sm text-gray-600">Deal Requests & Negotiations</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dealer')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              My Inventory
            </button>
            <button
              onClick={() => router.push('/dealer/reporting')}
              className="bg-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Reporting
            </button>
            <span className="text-gray-700">{user?.name}</span>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">
          Deal Management Dashboard
        </h2>

        {/* Sold Deals Notification */}
        {(() => {
          const soldDeals = dealLists.filter(d =>
            d.selectedCars.some(sc => sc.car.acceptedDeals?.[0]?.sold === true)
          );
          const soldCarsCount = dealLists.reduce((count, d) =>
            count + d.selectedCars.filter(sc => sc.car.acceptedDeals?.[0]?.sold === true).length,
            0
          );

          if (soldCarsCount > 0) {
            return (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 mb-6 animate-slide-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      Congratulations! {soldCarsCount} Vehicle{soldCarsCount > 1 ? 's' : ''} Sold!
                    </h3>
                    <p className="text-sm opacity-90">
                      {soldCarsCount} vehicle{soldCarsCount > 1 ? 's' : ''} sold from {soldDeals.length} deal request{soldDeals.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/dealer/reporting')}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold text-sm"
                  >
                    View Reports
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-600 mb-1">Incoming Requests</div>
            <div className="text-2xl font-bold text-yellow-600">
              {dealLists.filter(d => d.status === 'active' && d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.status !== 'cancelled')).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-green-600">
              {dealLists.filter(d => d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.status === 'won' && !sc.car.acceptedDeals?.[0]?.sold && !sc.car.acceptedDeals?.[0]?.deadDeal)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <div className="text-sm text-gray-600 mb-1">Dead Deals</div>
            <div className="text-2xl font-bold text-gray-600">
              {dealLists.filter(d => d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.car.acceptedDeals?.[0]?.deadDeal)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="text-sm text-gray-600 mb-1">Lost/Expired</div>
            <div className="text-2xl font-bold text-red-600">
              {dealLists.filter(d => d.status === 'lost' || d.status === 'expired').length}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex border-b">
            <button
              onClick={() => {
                setActiveTab('incoming');
                setSelectedCustomerId(null);
              }}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition ${
                activeTab === 'incoming'
                  ? 'bg-yellow-50 text-yellow-700 border-b-2 border-yellow-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Incoming Requests ({dealLists.filter(d => d.status === 'active' && d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.status !== 'cancelled')).length})
            </button>
            <button
              onClick={() => {
                setActiveTab('pending');
                setSelectedCustomerId(null);
              }}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition ${
                activeTab === 'pending'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending ({dealLists.filter(d => d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.status === 'won' && !sc.car.acceptedDeals?.[0]?.sold && !sc.car.acceptedDeals?.[0]?.deadDeal)).length})
            </button>
            <button
              onClick={() => {
                setActiveTab('deadDeals');
                setSelectedCustomerId(null);
              }}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition ${
                activeTab === 'deadDeals'
                  ? 'bg-gray-50 text-gray-700 border-b-2 border-gray-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Dead Deals ({dealLists.filter(d => d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.car.acceptedDeals?.[0]?.deadDeal)).length})
            </button>
            <button
              onClick={() => {
                setActiveTab('lost');
                setSelectedCustomerId(null);
              }}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition ${
                activeTab === 'lost'
                  ? 'bg-red-50 text-red-700 border-b-2 border-red-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Lost/Expired ({dealLists.filter(d => d.status === 'lost' || d.status === 'expired').length})
            </button>
          </div>
        </div>

        {(() => {
          const filteredDeals = dealLists.filter(d => {
            if (activeTab === 'incoming') return d.status === 'active' && d.selectedCars.some(sc => sc.status !== 'cancelled');
            if (activeTab === 'pending') return d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.status === 'won' && !sc.car.acceptedDeals?.[0]?.sold && !sc.car.acceptedDeals?.[0]?.deadDeal);
            if (activeTab === 'deadDeals') return d.selectedCars.some(sc => sc.car.dealerId === user.id && sc.car.acceptedDeals?.[0]?.deadDeal);
            if (activeTab === 'lost') return d.status === 'lost' || d.status === 'expired' || d.status === 'cancelled';
            return false;
          });

          // For incoming tab, show customer list if no customer is selected
          if (activeTab === 'incoming' && !selectedCustomerId) {
            // Group by customer
            const customerMap = new Map<string, { customer: any; dealLists: typeof filteredDeals; totalCars: number }>();

            filteredDeals.forEach(dl => {
              const existing = customerMap.get(dl.customerId);
              const carCount = dl.selectedCars.length;

              if (existing) {
                existing.dealLists.push(dl);
                existing.totalCars += carCount;
              } else {
                customerMap.set(dl.customerId, {
                  customer: dl.customer,
                  dealLists: [dl],
                  totalCars: carCount,
                });
              }
            });

            const customers = Array.from(customerMap.values());

            return customers.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-4xl mb-3">📬</div>
                <h3 className="text-lg font-semibold mb-2">No incoming requests</h3>
                <p className="text-gray-600 text-sm">
                  When customers select your vehicles, incoming requests will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4 mb-2">
                  <h3 className="font-bold text-lg">Customers with Active Requests</h3>
                  <p className="text-sm text-gray-600">Click on a customer to view their deal details</p>
                </div>

                {customers.map(({ customer, dealLists, totalCars }) => {
                  const yourCars = dealLists.reduce((count, dl) =>
                    count + dl.selectedCars.filter(sc => sc.car.dealerId === user.id).length, 0
                  );

                  return (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <div className="p-4 flex items-center justify-between gap-4">
                        {/* Customer Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="bg-gradient-to-br from-primary to-purple rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{customer.name}</h3>
                            <p className="text-sm text-gray-600">{customer.email} • {customer.phone}</p>
                          </div>
                        </div>

                        {/* Stats - Compact */}
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Requests</div>
                            <div className="text-2xl font-bold text-primary">{dealLists.length}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Total Cars</div>
                            <div className="text-2xl font-bold text-gray-700">{totalCars}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Your Cars</div>
                            <div className="text-2xl font-bold text-green-600">{yourCars}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Competitors</div>
                            <div className="text-2xl font-bold text-orange-600">{totalCars - yourCars}</div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap">
                          View Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // If customer is selected, filter to show only that customer's deals
          const dealsToShow = selectedCustomerId
            ? filteredDeals.filter(d => d.customerId === selectedCustomerId)
            : filteredDeals;

          return dealsToShow.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-3">
              {activeTab === 'incoming' ? '📬' : activeTab === 'pending' ? '⏳' : '❌'}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {activeTab === 'incoming' && 'No incoming requests'}
              {activeTab === 'pending' && 'No pending deals yet'}
              {activeTab === 'lost' && 'No lost/expired deals'}
            </h3>
            <p className="text-gray-600 text-sm">
              {activeTab === 'incoming' && 'When customers select your vehicles, incoming requests will appear here'}
              {activeTab === 'pending' && 'Accepted deals that are pending completion will appear here'}
              {activeTab === 'lost' && 'Lost or expired deals will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedCustomerId && (
              <div className="bg-white rounded-lg shadow p-4">
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="text-primary hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  ← Back to Customer List
                </button>
              </div>
            )}

            {dealsToShow.map((dealList) => (
              <div key={dealList.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Deal Header */}
                <div className="bg-gradient-to-r from-primary to-purple text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        Customer Request - {dealList.selectedCars.length} Total Cars ({dealList.selectedCars.filter(sc => sc.car.dealerId === user.id).length} Yours)
                      </h3>
                      <p className="text-sm opacity-90">{dealList.customer.name}</p>
                      <p className="text-xs opacity-75">{dealList.customer.email} • {dealList.customer.phone}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(dealList.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                        dealList.status === 'active'
                          ? 'bg-yellow-400 text-yellow-900'
                          : dealList.selectedCars.some(sc => sc.status === 'won' && !sc.car.acceptedDeals?.[0]?.sold)
                          ? 'bg-green-400 text-green-900'
                          : 'bg-red-400 text-red-900'
                      }`}
                    >
                      {dealList.status === 'active' ? 'Active' : dealList.selectedCars.some(sc => sc.status === 'won' && !sc.car.acceptedDeals?.[0]?.sold) ? 'Pending' : 'Lost'}
                    </span>
                  </div>
                </div>

                {/* Your Cars in This Request */}
                <div className="p-4">
                  <h4 className="font-bold text-base mb-3">Your Vehicles in This Request</h4>
                  <div className="space-y-3">
                    {dealList.selectedCars.filter(sc => {
                      // Filter by dealer ID
                      if (sc.car.dealerId !== user.id) return false;

                      // Additional filtering based on active tab
                      if (activeTab === 'pending') {
                        // Exclude dead deals from pending tab
                        return !sc.car.acceptedDeals?.[0]?.deadDeal;
                      }
                      if (activeTab === 'deadDeals') {
                        // Only show dead deals in dead deals tab
                        return sc.car.acceptedDeals?.[0]?.deadDeal === true;
                      }

                      // For other tabs, just show dealer's cars
                      return true;
                    }).map((selectedCar) => {
                      const offerCount = getOfferCount(selectedCar.id);
                      const canSubmitMore = offerCount < 3;
                      const isAccepted = selectedCar.status === 'won';
                      const isCancelled = selectedCar.status === 'cancelled';
                      const isDeadDeal = selectedCar.car.acceptedDeals?.[0]?.deadDeal || false;

                      // Check if a competitor won this deal request
                      const competitorWon = dealList.selectedCars.find(sc =>
                        sc.car.dealerId !== user.id &&
                        sc.car.acceptedDeals &&
                        sc.car.acceptedDeals.length > 0
                      );
                      const isOutbid = competitorWon && !isAccepted;

                      return (
                        <div
                          key={selectedCar.id}
                          className={`border rounded-lg p-3 transition relative ${
                            isDeadDeal
                              ? 'border-red-600 bg-red-50 shadow-lg opacity-90'
                              : isAccepted
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : isOutbid
                              ? 'border-red-500 bg-red-50 shadow-lg'
                              : isCancelled
                              ? 'border-gray-400 bg-gray-100 shadow-lg opacity-75'
                              : 'border-gray-200 hover:border-primary'
                          }`}
                        >
                          {isDeadDeal && (
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              ❌ DEAD DEAL
                            </div>
                          )}
                          {isAccepted && !isDeadDeal && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                              ACCEPTED!
                            </div>
                          )}
                          {isOutbid && !isDeadDeal && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              OUTBID
                            </div>
                          )}
                          {isCancelled && !isAccepted && !isOutbid && !isDeadDeal && (
                            <div className="absolute -top-2 -right-2 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              CANCELLED
                            </div>
                          )}
                          <div className="flex gap-3 items-start">
                            <div className="relative h-24 w-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              {(() => {
                                try {
                                  const photoUrls = JSON.parse(selectedCar.car.photos || '[]');
                                  const firstPhoto = photoUrls[0];
                                  if (firstPhoto) {
                                    return (
                                      <Image
                                        src={firstPhoto}
                                        alt={`${selectedCar.car.year} ${selectedCar.car.make} ${selectedCar.car.model}`}
                                        fill
                                        className="object-cover"
                                        sizes="192px"
                                      />
                                    );
                                  }
                                } catch (e) {
                                  console.error('Failed to parse photos:', e);
                                }
                                return (
                                  <div className="flex items-center justify-center h-full text-4xl">
                                    🚗
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex-1">
                              <h5 className="font-bold text-base mb-1">
                                {selectedCar.car.year} {selectedCar.car.make} {selectedCar.car.model}
                              </h5>
                              <p className="text-sm text-gray-700 mb-1">
                                Asking: ${selectedCar.car.salePrice.toLocaleString()}
                              </p>
                              {isOutbid && competitorWon && competitorWon.car.acceptedDeals?.[0] && (
                                <div className="bg-red-100 border border-red-300 rounded-lg p-2 mb-2">
                                  <p className="text-xs font-semibold text-red-700 mb-1">
                                    Customer chose competitor:
                                  </p>
                                  <p className="text-sm font-bold text-red-700">
                                    {competitorWon.car.dealer?.businessName || competitorWon.car.dealer?.name}
                                  </p>
                                  <p className="text-xs text-red-600 mt-1">
                                    Won at: ${competitorWon.car.acceptedDeals[0].finalPrice.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Date: {new Date(competitorWon.car.acceptedDeals[0].createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {isAccepted ? (
                                <>
                                  <p className="text-xs text-green-600 font-semibold mb-1">
                                    Sold for: ${selectedCar.currentOfferPrice.toLocaleString()}
                                  </p>
                                  {selectedCar.car.acceptedDeals?.[0]?.verificationCode && !isDeadDeal && (
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-2 mb-2">
                                      <p className="text-xs font-semibold text-green-700 mb-0.5">Verification Code:</p>
                                      <p className="text-xl font-bold text-green-700 tracking-wider">
                                        {selectedCar.car.acceptedDeals[0].verificationCode}
                                      </p>
                                    </div>
                                  )}
                                  {selectedCar.car.acceptedDeals?.[0]?.testDrive && !isDeadDeal && (
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary rounded-lg p-2 mb-2">
                                      <p className="text-xs font-semibold text-primary mb-0.5">
                                        {selectedCar.car.acceptedDeals[0].testDrive.status === 'scheduled'
                                          ? 'Test Drive Appointment:'
                                          : 'Customer Requested Appointment'}
                                      </p>
                                      {selectedCar.car.acceptedDeals[0].testDrive.status === 'scheduled' &&
                                       selectedCar.car.acceptedDeals[0].testDrive.scheduledDate &&
                                       selectedCar.car.acceptedDeals[0].testDrive.scheduledTime ? (
                                        <p className="text-sm font-bold text-primary">
                                          {formatDate(selectedCar.car.acceptedDeals[0].testDrive.scheduledDate)} at {formatTime(selectedCar.car.acceptedDeals[0].testDrive.scheduledTime)}
                                        </p>
                                      ) : scheduleForm?.testDriveId === selectedCar.car.acceptedDeals[0].testDrive.id ? (
                                        <div className="space-y-2 mt-2">
                                          <input
                                            type="date"
                                            value={scheduleForm.scheduledDate}
                                            onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                                            className="w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary text-xs"
                                          />
                                          <input
                                            type="time"
                                            value={scheduleForm.scheduledTime}
                                            onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                                            className="w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary text-xs"
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={handleScheduleAppointment}
                                              className="flex-1 bg-primary text-white px-2 py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold text-xs"
                                            >
                                              Confirm
                                            </button>
                                            <button
                                              onClick={() => setScheduleForm(null)}
                                              className="flex-1 bg-gray-200 text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-300 transition font-semibold text-xs"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            const testDrive = selectedCar.car.acceptedDeals?.[0]?.testDrive;
                                            if (testDrive) {
                                              setScheduleForm({
                                                testDriveId: testDrive.id,
                                                scheduledDate: '',
                                                scheduledTime: '',
                                              });
                                            }
                                          }}
                                          className="w-full bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold text-xs mt-2"
                                        >
                                          Schedule Appointment
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p className="text-xs text-gray-600 mb-1">
                                  Offers: {offerCount} / 3
                                </p>
                              )}

                              {dealList.status === 'active' && !isAccepted ? (
                                canSubmitMore ? (
                                  offerForm?.selectedCarId === selectedCar.id ? (
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="number"
                                        placeholder="Offer Price"
                                        value={offerForm.offerPrice}
                                        onChange={(e) =>
                                          setOfferForm({ ...offerForm, offerPrice: e.target.value })
                                        }
                                        className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary w-32 text-sm"
                                      />
                                      <button
                                        onClick={handleSubmitOffer}
                                        className="bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                                      >
                                        Submit
                                      </button>
                                      <button
                                        onClick={() => setOfferForm(null)}
                                        className="text-gray-600 hover:text-gray-800 text-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setOfferForm({
                                          selectedCarId: selectedCar.id,
                                          offerPrice: selectedCar.car.salePrice.toString(),
                                        })
                                      }
                                      className="bg-accent text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                                    >
                                      Make Offer ({3 - offerCount} left)
                                    </button>
                                  )
                                ) : (
                                  <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-semibold text-xs">
                                    Max offers (3/3)
                                  </span>
                                )
                              ) : isAccepted ? (
                                <>
                                  {soldForm && soldForm.acceptedDealId === selectedCar.car.acceptedDeals?.[0]?.id ? (
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary rounded-lg p-3 mt-2">
                                      <p className="text-sm font-semibold text-primary mb-2">Confirm Sale Details</p>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="radio"
                                            id={`offered-${selectedCar.id}`}
                                            name={`price-${selectedCar.id}`}
                                            checked={!soldForm.useDifferentPrice}
                                            onChange={() => setSoldForm({ ...soldForm, useDifferentPrice: false })}
                                            className="w-4 h-4 text-primary"
                                          />
                                          <label htmlFor={`offered-${selectedCar.id}`} className="text-sm text-gray-700">
                                            Sold at offered price: <span className="font-bold">${soldForm.offeredPrice.toLocaleString()}</span>
                                          </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="radio"
                                            id={`different-${selectedCar.id}`}
                                            name={`price-${selectedCar.id}`}
                                            checked={soldForm.useDifferentPrice}
                                            onChange={() => setSoldForm({ ...soldForm, useDifferentPrice: true })}
                                            className="w-4 h-4 text-primary"
                                          />
                                          <label htmlFor={`different-${selectedCar.id}`} className="text-sm text-gray-700">
                                            Sold at different price
                                          </label>
                                        </div>
                                        {soldForm.useDifferentPrice && (
                                          <input
                                            type="number"
                                            placeholder="Enter final sale price"
                                            value={soldForm.finalPrice}
                                            onChange={(e) => setSoldForm({ ...soldForm, finalPrice: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                          />
                                        )}
                                        <div className="flex gap-2 pt-2">
                                          <button
                                            onClick={handleMarkAsSold}
                                            className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                                          >
                                            Confirm Sale
                                          </button>
                                          <button
                                            onClick={() => setSoldForm(null)}
                                            className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      {selectedCar.car.acceptedDeals?.[0] && !selectedCar.car.acceptedDeals[0].sold && !selectedCar.car.acceptedDeals[0].deadDeal && (
                                        <>
                                          <button
                                            onClick={() => {
                                              const deal = selectedCar.car.acceptedDeals?.[0];
                                              if (deal) {
                                                setSoldForm({
                                                  acceptedDealId: deal.id,
                                                  offeredPrice: deal.finalPrice,
                                                  finalPrice: '',
                                                  useDifferentPrice: false,
                                                });
                                              }
                                            }}
                                            className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                                          >
                                            Mark as Sold
                                          </button>
                                          <button
                                            onClick={() => handleDeadDeal(selectedCar.car.acceptedDeals?.[0]?.id)}
                                            className="bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                                          >
                                            Dead Deal
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => router.push('/dealer/reporting')}
                                        className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                                      >
                                        View in Reports
                                      </button>
                                      {isDeadDeal && (
                                        <span className="inline-block px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold text-xs border border-red-300">
                                          ❌ Dead Deal
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className={`inline-block px-3 py-1.5 rounded-lg font-semibold text-xs ${
                                  dealList.status === 'accepted' || dealList.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {dealList.status === 'accepted' || dealList.status === 'completed' ? 'Deal Closed' : 'Deal Lost'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Competitor Vehicles in This Request */}
                  {(() => {
                    // Check if any of our cars have a dead deal
                    const hasDeadDeal = dealList.selectedCars
                      .filter(sc => sc.car.dealerId === user.id)
                      .some(sc => sc.car.acceptedDeals?.[0]?.deadDeal);

                    if (hasDeadDeal) return null; // Hide competitors if deal is dead

                    const competitorCars = dealList.selectedCars.filter(sc => sc.car.dealerId !== user.id);
                    if (competitorCars.length === 0) return null;

                    return (
                      <>
                        <div className="border-t border-gray-300 my-4"></div>
                        <h4 className="font-bold text-base mb-3 text-gray-700">
                          Competitor Vehicles in This Request ({competitorCars.length})
                        </h4>
                        <div className="space-y-3">
                          {competitorCars.map((selectedCar) => {
                            const latestOffer = selectedCar.negotiations.length > 0
                              ? selectedCar.negotiations[0].offeredPrice
                              : selectedCar.originalPrice;
                            const isWon = selectedCar.car.acceptedDeals && selectedCar.car.acceptedDeals.length > 0;
                            const wonDeal = isWon ? selectedCar.car.acceptedDeals?.[0] : null;

                            return (
                              <div
                                key={selectedCar.id}
                                className={`border rounded-lg p-3 relative ${
                                  isWon
                                    ? 'bg-red-50 border-red-300'
                                    : 'bg-gray-50 border-gray-300'
                                }`}
                              >
                                {isWon && (
                                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    WON BY COMPETITOR
                                  </div>
                                )}
                                <div className="flex gap-3 items-start">
                                  <div className="relative h-24 w-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                    {(() => {
                                      try {
                                        const photoUrls = JSON.parse(selectedCar.car.photos || '[]');
                                        const firstPhoto = photoUrls[0];
                                        if (firstPhoto) {
                                          return (
                                            <Image
                                              src={firstPhoto}
                                              alt={`${selectedCar.car.year} ${selectedCar.car.make} ${selectedCar.car.model}`}
                                              fill
                                              className="object-cover"
                                              sizes="192px"
                                            />
                                          );
                                        }
                                      } catch (e) {
                                        console.error('Failed to parse photos:', e);
                                      }
                                      return (
                                        <div className="flex items-center justify-center h-full text-4xl">
                                          🚗
                                        </div>
                                      );
                                    })()}
                                  </div>

                                  <div className="flex-1">
                                    <h5 className="font-bold text-base mb-1 text-gray-800">
                                      {selectedCar.car.year} {selectedCar.car.make} {selectedCar.car.model}
                                    </h5>
                                    <p className="text-sm text-gray-600 mb-1">
                                      Mileage: {selectedCar.car.mileage?.toLocaleString()} mi
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      <div>
                                        <p className="text-xs text-gray-500">Original Price</p>
                                        <p className="text-sm font-semibold text-gray-700">
                                          ${selectedCar.originalPrice.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">
                                          {isWon ? 'Won at Price' : 'Current Offer'}
                                        </p>
                                        <p className={`text-sm font-semibold ${isWon ? 'text-red-600' : 'text-primary'}`}>
                                          ${isWon ? wonDeal!.finalPrice.toLocaleString() : latestOffer.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    {selectedCar.car.dealer && (
                                      <p className={`text-xs mt-2 ${isWon ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                        {isWon ? 'Winner: ' : 'Dealer: '}
                                        {selectedCar.car.dealer.businessName || selectedCar.car.dealer.name}
                                      </p>
                                    )}
                                    {isWon && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Accepted on: {new Date(wonDeal!.createdAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      </div>
    </div>
  );
}
