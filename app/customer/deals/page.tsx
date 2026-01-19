'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Search, LogOut, Car, TrendingDown, DollarSign, Phone, Building2, User, CheckCircle, Clock, Award, X } from 'lucide-react';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { formatPrice } from '@/lib/format';

interface Negotiation {
  id: string;
  dealerId: string;
  selectedCarId: string;
  offeredPrice: number;
  status: string;
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
    if (!confirm('Accept this offer?')) {
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
          `Show this code at the dealership to complete your purchase.`
        );
        loadDeals(user.id);
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  const handleDeclineOffer = async (negotiationId: string) => {
    if (!confirm('Decline this offer? The dealer will be notified.')) {
      return;
    }

    try {
      const res = await fetch('/api/customer/decline-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ negotiationId, customerId: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.dealCancelled) {
          alert('All 3 offers have been declined. This deal has been automatically cancelled.');
        } else {
          alert('Offer declined. The dealer has been notified.');
        }
        loadDeals(user.id);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to decline offer');
      }
    } catch (error) {
      console.error('Error declining offer:', error);
      alert('Failed to decline offer');
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
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-dark shadow-md sticky top-0 z-50 h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/customer')}
              className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-all font-semibold flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Cars
            </button>
            <span className="text-gray-300 font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-dark flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          My Deal Requests
        </h2>

        {activeDealLists.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-dark">No deal requests yet</h3>
            <p className="text-gray-600 text-sm mb-4">
              Start by searching for cars and selecting up to 4 vehicles to get the absolute best offers from dealers
            </p>
            <button
              onClick={() => router.push('/customer')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm flex items-center gap-2 mx-auto"
            >
              <Search className="w-4 h-4" />
              Search Cars Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDealLists.map((dealList) => {
              const pricedCars = dealList.selectedCars.filter(sc => sc.car.salePrice > 0);
              const minPrice = pricedCars.length > 0 ? Math.min(...pricedCars.map(sc => sc.car.salePrice)) : 0;
              const maxPrice = pricedCars.length > 0 ? Math.max(...pricedCars.map(sc => sc.car.salePrice)) : 0;
              const hasCallForPrice = dealList.selectedCars.some(sc => !sc.car.salePrice || sc.car.salePrice <= 0);

              return (
                <div key={dealList.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  {/* Deal Header */}
                  <div className="bg-dark text-white p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                          <Car className="w-5 h-5" />
                          Deal Request - {dealList.selectedCars.length} Vehicles
                        </h3>
                        <p className="text-sm font-semibold mb-1 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {pricedCars.length === 0
                            ? 'Call For Price'
                            : hasCallForPrice
                            ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} + Call For Price`
                            : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
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
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {dealList.status === 'pending' ? 'ACTIVE' : 'COMPLETED'}
                      </span>
                    </div>
                  </div>

                  {/* Selected Cars with Offers */}
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-bold text-lg mb-3 text-dark flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      Your Selected Vehicles & Dealer Offers
                    </h4>

                    <div className="space-y-3">
                      {dealList.selectedCars.map((selectedCar, index) => {
                        // Filter out declined offers for best offer calculation
                        const activeOffers = selectedCar.negotiations.filter(n => n.status !== 'declined');
                        const bestOffer = activeOffers.length > 0
                          ? Math.min(...activeOffers.map(n => n.offeredPrice))
                          : null;

                        return (
                          <div
                            key={selectedCar.id}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all bg-white"
                          >
                            {/* Car Header */}
                            <div className={`p-3 flex gap-3 items-center border-b ${
                              selectedCar.status === 'won'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-gray-100'
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
                                    <div className="flex items-center justify-center h-full bg-gray-100">
                                      <Car className="w-12 h-12 text-gray-300" />
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
                                    (selectedCar.car.acceptedDeals[0] as any).cancelledByCustomer ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-500 text-white rounded-full text-xs font-bold">
                                        <X className="w-3 h-3" />
                                        Cancelled by You
                                      </span>
                                    ) : (selectedCar.car.acceptedDeals[0] as any).deadDeal ? (
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
                                      <Award className="w-4 h-4 text-green-600" />
                                      <span className="text-xs text-gray-600 font-medium">Best:</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">
                                      ${bestOffer.toLocaleString()}
                                    </span>
                                    <span className="px-2 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                                      {selectedCar.negotiations.length} {selectedCar.negotiations.length === 1 ? 'offer' : 'offers'}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
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
                              <div className="p-3 bg-gray-50">
                                <p className="text-sm font-bold text-dark mb-2 flex items-center gap-1">
                                  <TrendingDown className="w-4 h-4 text-primary" />
                                  All Offers:
                                </p>
                                <div className="space-y-2">
                                  {selectedCar.negotiations
                                    .sort((a, b) => {
                                      // Put declined offers at the end
                                      if (a.status === 'declined' && b.status !== 'declined') return 1;
                                      if (a.status !== 'declined' && b.status === 'declined') return -1;
                                      // Sort by price for active offers
                                      return a.offeredPrice - b.offeredPrice;
                                    })
                                    .map((negotiation, index) => {
                                      const isActiveOffer = negotiation.status !== 'declined';
                                      const isBestActiveOffer = isActiveOffer && index === 0;
                                      return (
                                      <div
                                        key={negotiation.id}
                                        className={`p-3 rounded-lg border flex justify-between items-center transition-all ${
                                          !isActiveOffer
                                            ? 'border-gray-200 bg-gray-100 opacity-60'
                                            : isBestActiveOffer
                                              ? 'border-green-300 bg-green-50'
                                              : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                      >
                                        <div>
                                          {isBestActiveOffer && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full mb-1">
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
                                          <p className="text-xl font-bold text-green-600 mb-2 flex items-center justify-end gap-1">
                                            <DollarSign className="w-5 h-5" />
                                            {negotiation.offeredPrice.toLocaleString()}
                                          </p>
                                          {selectedCar.status === 'pending' ? (
                                            negotiation.status === 'declined' ? (
                                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-500 rounded-lg font-semibold text-sm">
                                                <X className="w-4 h-4" />
                                                Declined
                                              </span>
                                            ) : index === 0 ? (
                                              <div className="flex flex-col gap-2">
                                                <button
                                                  onClick={() => handleAcceptOffer(negotiation.id)}
                                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all font-semibold text-sm"
                                                >
                                                  Accept Offer
                                                </button>
                                                <button
                                                  onClick={() => handleDeclineOffer(negotiation.id)}
                                                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-semibold text-sm"
                                                >
                                                  Decline Offer
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="flex flex-col gap-2">
                                                <button
                                                  disabled
                                                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
                                                  title="Accept the best offer first"
                                                >
                                                  Accept Offer
                                                </button>
                                                <button
                                                  disabled
                                                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
                                                  title="Respond to the best offer first"
                                                >
                                                  Decline Offer
                                                </button>
                                              </div>
                                            )
                                          ) : selectedCar.status === 'won' && selectedCar.car.acceptedDeals?.[0] ? (
                                            (selectedCar.car.acceptedDeals[0] as any).cancelledByCustomer ? (
                                              <div className="space-y-2">
                                                <div className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg font-semibold text-xs">
                                                  <X className="w-4 h-4" />
                                                  Cancelled by You
                                                </div>
                                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                                                  <p className="text-sm text-gray-700 text-center">
                                                    You cancelled this deal.
                                                  </p>
                                                </div>
                                              </div>
                                            ) : (selectedCar.car.acceptedDeals[0] as any).deadDeal ? (
                                              <div className="space-y-2">
                                                <div className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold text-xs">
                                                  <X className="w-4 h-4" />
                                                  Cancelled by Dealer
                                                </div>
                                                <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                                                  <p className="text-sm text-red-700 text-center">
                                                    This deal was cancelled by the dealership. Please contact them for more information.
                                                  </p>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="space-y-2">
                                                <div className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg font-semibold text-xs">
                                                  <CheckCircle className="w-4 h-4" />
                                                  Accepted
                                                </div>
                                                <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                                                  <p className="text-xs font-semibold text-green-700 mb-1">Verification Code:</p>
                                                  <p className="text-2xl font-bold text-green-700 tracking-wider">
                                                    {selectedCar.car.acceptedDeals[0].verificationCode}
                                                  </p>
                                                </div>
                                                {selectedCar.car.acceptedDeals[0].testDrive ? (
                                                  <div className="w-full bg-blue-50 border border-primary rounded-lg px-3 py-2">
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
                                                    className="w-full bg-primary text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold text-xs"
                                                  >
                                                    Request Test Drive Appointment
                                                  </button>
                                                )}
                                              </div>
                                            )
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg font-semibold text-xs">
                                              <CheckCircle className="w-4 h-4" />
                                              Accepted
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      );
                                    })}
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
