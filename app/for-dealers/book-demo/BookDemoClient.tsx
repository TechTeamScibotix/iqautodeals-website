'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Video,
} from 'lucide-react';
import Footer from '../../components/Footer';
import { LogoWithBeam } from '@/components/LogoWithBeam';

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface DaySlots {
  date: string;
  slots: TimeSlot[];
}

export default function BookDemoClient() {
  const [step, setStep] = useState(1); // 1 = form, 2 = calendar, 3 = confirmation
  const [formData, setFormData] = useState({
    dealershipName: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<DaySlots[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    meetLink?: string;
    message?: string;
    error?: string;
  } | null>(null);

  // Fetch availability when entering step 2
  useEffect(() => {
    if (step === 2) {
      fetchAvailability();
    }
  }, [step]);

  const fetchAvailability = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch('/api/book-demo/availability');
      const data = await res.json();
      if (data.slots) {
        setAvailability(data.slots);
        // Auto-select first available date
        const firstAvailable = data.slots.find((d: DaySlots) =>
          d.slots.some((s: TimeSlot) => s.available)
        );
        if (firstAvailable) {
          setSelectedDate(firstAvailable.date);
        }
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.dealershipName.trim()) {
      errors.dealershipName = 'Dealership name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleBookDemo = async () => {
    if (!selectedSlot) return;

    setBooking(true);
    try {
      const res = await fetch('/api/book-demo/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingResult({
          success: true,
          meetLink: data.meetLink,
          message: data.message,
        });
        setStep(3);
      } else {
        setBookingResult({
          success: false,
          error: data.error || 'Failed to book demo',
        });
      }
    } catch (error) {
      setBookingResult({
        success: false,
        error: 'Network error. Please try again.',
      });
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York',
    });
  };

  const formatFullDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York',
    });
  };

  const selectedDaySlots = availability.find((d) => d.date === selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <nav className="hidden lg:flex gap-6 text-sm font-semibold">
            <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors">
              Cars for Sale
            </Link>
            <Link href="/for-dealers" className="text-primary transition-colors">
              For Dealers
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
              About Us
            </Link>
          </nav>
          <div className="flex gap-2 md:gap-3">
            <Link href="/login" className="text-gray-300 hover:text-white border border-gray-600 hover:border-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold">
              Dealer Login
            </Link>
            <Link href="/register?type=dealer" className="bg-primary text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold">
              Start Free Pilot
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/for-dealers" className="text-primary hover:underline flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to For Dealers
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="font-medium hidden sm:inline">Your Info</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="font-medium hidden sm:inline">Select Time</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className="font-medium hidden sm:inline">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Step 1: Contact Form */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-3">
                  Book Your Demo
                </h2>
                <p className="text-gray-600 text-lg">
                  See how IQ Auto Deals can transform your dealership
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Dealership Name
                  </label>
                  <input
                    type="text"
                    value={formData.dealershipName}
                    onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${formErrors.dealershipName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="ABC Motors"
                  />
                  {formErrors.dealershipName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.dealershipName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="you@dealership.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="(555) 123-4567"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-pill font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  Continue to Select Time
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                30-minute video call with our team
              </p>
            </div>
          )}

          {/* Step 2: Calendar Selection */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-3">
                  Select a Time
                </h2>
                <p className="text-gray-600">
                  Choose a time that works for you (Eastern Time)
                </p>
              </div>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600">Loading availability...</span>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Select a Date
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {availability.map((day) => {
                        const hasAvailable = day.slots.some((s) => s.available);
                        return (
                          <button
                            key={day.date}
                            onClick={() => {
                              setSelectedDate(day.date);
                              setSelectedSlot(null);
                            }}
                            disabled={!hasAvailable}
                            className={`p-3 rounded-lg text-center transition-all ${
                              selectedDate === day.date
                                ? 'bg-primary text-white'
                                : hasAvailable
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <div className="text-xs font-medium">
                              {formatDate(day.date).split(' ')[0]}
                            </div>
                            <div className="text-lg font-bold">
                              {formatDate(day.date).split(' ')[2]}
                            </div>
                            <div className="text-xs">
                              {formatDate(day.date).split(' ')[1]}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Select a Time
                    </h3>
                    {selectedDaySlots ? (
                      <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
                        {selectedDaySlots.slots
                          .filter((slot) => slot.available)
                          .map((slot, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 rounded-lg text-center transition-all ${
                                selectedSlot?.start === slot.start
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {formatTime(slot.start)}
                            </button>
                          ))}
                        {selectedDaySlots.slots.filter((s) => s.available).length === 0 && (
                          <p className="text-gray-500 col-span-2 text-center py-8">
                            No available slots on this day
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Select a date to see available times
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Summary & Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                {selectedSlot && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-1">Selected Time:</p>
                    <p className="text-lg font-semibold text-dark">
                      {formatFullDateTime(selectedSlot.start)} ET
                    </p>
                  </div>
                )}

                {bookingResult?.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
                    {bookingResult.error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-pill font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleBookDemo}
                    disabled={!selectedSlot || booking}
                    className="flex-1 bg-primary text-white py-3 rounded-pill font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {booking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-3">
                Demo Booked!
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                {bookingResult?.message || "We've sent a calendar invitation to your email."}
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{formData.dealershipName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      {selectedSlot && formatFullDateTime(selectedSlot.start)} ET
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">30 minutes</span>
                  </div>
                  {bookingResult?.meetLink && (
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-gray-400" />
                      <a
                        href={bookingResult.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Meet Link
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/for-dealers"
                  className="px-8 py-3 border border-gray-300 rounded-pill font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to For Dealers
                </Link>
                <Link
                  href="/register?type=dealer"
                  className="bg-primary text-white px-8 py-3 rounded-pill font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  Start Free Pilot
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
