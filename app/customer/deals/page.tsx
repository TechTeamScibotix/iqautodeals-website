'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FileText, Search, LogOut, Car, TrendingDown, DollarSign, Phone, Building2, User, CheckCircle, Clock, Award, X } from 'lucide-react';

interface Negotiation {
  id: string;
  dealerId: string;
  selectedCarId: string;
  offeredPrice: number;
  createdAt: string;
  dealer: {
    name: string;
    businessName: string;
    phone: string;
  };
}

interface SelectedCar {
  id: string;
  carId: string;
  originalPrice: number;
  currentOfferPrice: number;
  negotiationCount: number;
  status: string;
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    photos: string;
    salePrice: number;
    dealer: {
      name: string;
      businessName: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
    };
    acceptedDeals: Array<{
      id: string;
      verificationCode: string;
      finalPrice: number;
      createdAt: string;
      testDrive?: {
        id: string;
        status: string;
        scheduledDate?: string;
        scheduledTime?: string;
      };
    }>;
  };
  negotiations: Negotiation[];
}

interface DealList {
  id: string;
  status: string;
  createdAt: string;
  selectedCars: SelectedCar[];
}

export default function CustomerDeals() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dealLists, setDealLists] = useState<DealList[]>([]);
  const [loading, setLoading] = useState(true);

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
    loadDeals(parsed.id);
  }, [router]);

  const loadDeals = async (customerId: string) => {
    try {
      const res = await fetch(`/api/customer/deal-request?customerId=${customerId}`);
      const data = await res.json();
      setDealLists(data.dealLists || []);
    } catch (error) {
      console.error('Failed to load deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (negotiationId: string) => {
    if (!confirm('Accept this offer? You will need to pay a $59 refundable deposit.')) {
      return;
    }

    try {
      const res = await fetch('/api/customer/accept-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ negotiationId, customerId: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          `Offer accepted!\n\n` +
          `Your 6-digit verification code is: ${data.verificationCode}\n\n` +
          `Show this code at the dealership to complete your purchase.\n` +
          `$59 deposit payment would be processed here.`
        );
        loadDeals(user.id);
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  const handleScheduleTestDrive = async (acceptedDealId: string) => {
    try {
      const res = await fetch('/api/customer/schedule-test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptedDealId,
          customerId: user.id,
          scheduledDate: '',
          scheduledTime: '',
        }),
      });

      if (res.ok) {
        alert('Test drive appointment requested! The dealer will contact you shortly to confirm the time.');
        loadDeals(user.id);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to request test drive');
      }
    } catch (error) {
      console.error('Error requesting test drive:', error);
      alert('Failed to request test drive');
    }
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

  const handleCancelDeal = async (selectedCarId: string) => {
    if (!confirm('Are you sure you want to cancel this deal? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch('/api/customer/cancel-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedCarId,
          customerId: user.id,
        }),
      });

      if (res.ok) {
        alert('Deal cancelled successfully');
        loadDeals(user.id);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel deal');
      }
    } catch (error) {
      console.error('Error cancelling deal:', error);
      alert('Failed to cancel deal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Filter out deal lists with no cars
  const activeDealLists = dealLists.filter(dl => dl.selectedCars.length > 0);

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
            <p className="text-sm text-white/80">My Active Deals</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/customer')}
              className="bg-white text-primary px-5 py-2.5 rounded-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105"
            >
              <Search className="w-4 h-4" />
              Search Cars
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
        <h2 className="text-4xl font-bold mb-8 text-dark flex items-center gap-3 animate-slide-in">
          <FileText className="w-10 h-10 text-primary" />
          My Deal Requests
        </h2>

        {activeDealLists.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-lg p-8 text-center border border-primary/20">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-dark">No deal requests yet</h3>
            <p className="text-gray-600 text-sm mb-4">
              Start by searching for cars and selecting up to 4 vehicles to get the absolute best offers from dealers
            </p>
            <button
              onClick={() => router.push('/customer')}
              className="bg-gradient-to-r from-primary to-purple text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-semibold text-sm flex items-center gap-2 mx-auto"
            >
              <Search className="w-4 h-4" />
              Search Cars Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDealLists.map((dealList) => {
              const minPrice = Math.min(...dealList.selectedCars.map(sc => sc.car.salePrice));
              const maxPrice = Math.max(...dealList.selectedCars.map(sc => sc.car.salePrice));

              return (
                <div key={dealList.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-primary/20">
                  {/* Deal Header */}
                  <div className="bg-gradient-to-r from-primary via-purple to-secondary text-white p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                          <Car className="w-5 h-5" />
                          Deal Request - {dealList.selectedCars.length} Vehicles
                        </h3>
                        <p className="text-sm font-semibold mb-1 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
                        </p>
                        <p className="text-xs opacity-90 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(dealList.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                          dealList.status === 'pending'
                            ? 'bg-yellow-400 text-yellow-900'
                            : 'bg-accent text-white'
                        }`}
                      >
                        {dealList.status === 'pending' ? 'ACTIVE' : 'COMPLETED'}
                      </span>
                    </div>
                  </div>

                  {/* Selected Cars with Offers */}
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                    <h4 className="font-bold text-lg mb-3 text-dark flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      Your Selected Vehicles & Dealer Offers
                    </h4>

                    <div className="space-y-3">
                      {dealList.selectedCars.map((selectedCar, index) => {
                        const bestOffer = selectedCar.negotiations.length > 0
                          ? Math.min(...selectedCar.negotiations.map(n => n.offeredPrice))
                          : null;

                        return (
                          <div
                            key={selectedCar.id}
                            className="border border-primary/20 rounded-lg overflow-hidden hover:shadow-lg transition-all bg-white"
                          >
                            {/* Car Header */}
                            <div className={`p-3 flex gap-3 items-center border-b ${
                              selectedCar.status === 'won'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                : 'bg-gradient-to-r from-blue-50 to-purple-50 border-primary/10'
                            }`}>
                              <div className="relative h-20 w-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                                          sizes="144px"
                                        />
                                      );
                                    }
                                  } catch (e) {
                                    console.error('Failed to parse photos:', e);
                                  }
                                  return (
                                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-purple/20">
                                      <Car className="w-12 h-12 text-primary/40" />
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-bold text-base text-dark">
                                    {selectedCar.car.year} {selectedCar.car.make} {selectedCar.car.model}
                                  </h5>
                                  {selectedCar.status === 'won' && selectedCar.car.acceptedDeals?.[0] && (
                                    (selectedCar.car.acceptedDeals[0] as any).deadDeal ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold">
                                        <X className="w-3 h-3" />
                                        Cancelled by Dealer
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-bold animate-pulse">
                                        <CheckCircle className="w-3 h-3" />
                                        ACCEPTED!
                                      </span>
                                    )
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {selectedCar.car.dealer.businessName}
                                </p>
                                {bestOffer ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Award className="w-4 h-4 text-accent" />
                                      <span className="text-xs text-gray-600 font-medium">Best:</span>
                                    </div>
                                    <span className="text-lg font-bold text-accent">
                                      ${bestOffer.toLocaleString()}
                                    </span>
                                    <span className="px-2 py-1 bg-accent text-white rounded-full text-xs font-semibold">
                                      {selectedCar.negotiations.length} {selectedCar.negotiations.length === 1 ? 'offer' : 'offers'}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
                                    <Clock className="w-4 h-4" />
                                    <p className="text-xs font-semibold">
                                      Waiting for offers...
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Cancel Button - Only for pending deals */}
                            {selectedCar.status === 'pending' && (
                              <div className="px-3 pb-3">
                                <button
                                  onClick={() => handleCancelDeal(selectedCar.id)}
                                  className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all font-semibold text-xs"
                                >
                                  Cancel This Deal
                                </button>
                              </div>
                            )}

                            {/* Dealer Offers for This Car */}
                            {selectedCar.negotiations.length > 0 && (
                              <div className="p-3 bg-gradient-to-br from-white to-gray-50">
                                <p className="text-sm font-bold text-dark mb-2 flex items-center gap-1">
                                  <TrendingDown className="w-4 h-4 text-primary" />
                                  All Offers:
                                </p>
                                <div className="space-y-2">
                                  {selectedCar.negotiations
                                    .sort((a, b) => a.offeredPrice - b.offeredPrice)
                                    .map((negotiation, index) => (
                                      <div
                                        key={negotiation.id}
                                        className={`p-3 rounded-lg border flex justify-between items-center transition-all ${
                                          index === 0
                                            ? 'border-accent bg-gradient-to-r from-green-50 to-emerald-50'
                                            : 'border-gray-200 bg-white hover:border-primary/30'
                                        }`}
                                      >
                                        <div>
                                          {index === 0 && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full mb-1">
                                              <Award className="w-3 h-3" />
                                              BEST
                                            </span>
                                          )}
                                          <p className="font-bold text-sm mb-1 flex items-center gap-1">
                                            <Building2 className="w-4 h-4 text-primary" />
                                            {negotiation.dealer.businessName}
                                          </p>
                                          <p className="text-xs text-gray-600 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {negotiation.dealer.name}
                                          </p>
                                          <p className="text-xs text-gray-600 flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {negotiation.dealer.phone}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xl font-bold text-accent mb-2 flex items-center justify-end gap-1">
                                            <DollarSign className="w-5 h-5" />
                                            {negotiation.offeredPrice.toLocaleString()}
                                          </p>
                                          {selectedCar.status === 'pending' ? (
                                            <button
                                              onClick={() => handleAcceptOffer(negotiation.id)}
                                              className="bg-gradient-to-r from-accent to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-semibold text-sm"
                                            >
                                              Accept Offer
                                            </button>
                                          ) : selectedCar.status === 'won' && selectedCar.car.acceptedDeals?.[0] ? (
                                            (selectedCar.car.acceptedDeals[0] as any).deadDeal ? (
                                              <div className="space-y-2">
                                                <div className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold text-xs">
                                                  <X className="w-4 h-4" />
                                                  Cancelled by Dealer
                                                </div>
                                                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400 rounded-lg p-3">
                                                  <p className="text-sm text-red-700 text-center">
                                                    This deal was cancelled by the dealership. Please contact them for more information.
                                                  </p>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="space-y-2">
                                                <div className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg font-semibold text-xs">
                                                  <CheckCircle className="w-4 h-4" />
                                                  Accepted
                                                </div>
                                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-3">
                                                  <p className="text-xs font-semibold text-green-700 mb-1">Verification Code:</p>
                                                  <p className="text-2xl font-bold text-green-700 tracking-wider">
                                                    {selectedCar.car.acceptedDeals[0].verificationCode}
                                                  </p>
                                                </div>
                                                {selectedCar.car.acceptedDeals[0].testDrive ? (
                                                  <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-primary rounded-lg px-3 py-2">
                                                    <p className="text-xs font-semibold text-primary text-center">
                                                      {selectedCar.car.acceptedDeals[0].testDrive.status === 'scheduled'
                                                        ? 'Test Drive Confirmed!'
                                                        : 'Appointment Requested - Dealer will contact you shortly'}
                                                    </p>
                                                    {selectedCar.car.acceptedDeals[0].testDrive.status === 'scheduled' &&
                                                     selectedCar.car.acceptedDeals[0].testDrive.scheduledDate &&
                                                     selectedCar.car.acceptedDeals[0].testDrive.scheduledTime && (
                                                      <p className="text-xs text-center mt-1 text-primary font-bold">
                                                        {formatDate(selectedCar.car.acceptedDeals[0].testDrive.scheduledDate)} at {formatTime(selectedCar.car.acceptedDeals[0].testDrive.scheduledTime)}
                                                      </p>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <button
                                                    onClick={() => handleScheduleTestDrive(selectedCar.car.acceptedDeals[0].id)}
                                                    className="w-full bg-gradient-to-r from-primary to-purple text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all font-semibold text-xs"
                                                  >
                                                    Request Test Drive Appointment
                                                  </button>
                                                )}
                                              </div>
                                            )
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg font-semibold text-xs">
                                              <CheckCircle className="w-4 h-4" />
                                              Accepted
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
