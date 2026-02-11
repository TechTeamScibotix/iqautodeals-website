'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import TCPAConsent from './TCPAConsent';
import {
  trackCheckAvailabilityOpened,
  trackCheckAvailabilitySubmitted,
  trackCheckAvailabilityError,
  trackCheckAvailabilityClosed,
} from '@/lib/analytics';

interface CarInfo {
  id: string;
  make: string;
  model: string;
  year: number;
  salePrice?: number;
  dealerId: string;
  dealer: {
    businessName: string;
  };
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  zip?: string;
}

interface CheckAvailabilityModalProps {
  car: CarInfo;
  user: UserInfo | null;
  onClose: () => void;
}

export default function CheckAvailabilityModal({ car, user, onClose }: CheckAvailabilityModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const [dealerMessage, setDealerMessage] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState(false);

  // Track modal opened and auto-populate form if user is logged in
  useEffect(() => {
    // Track modal opened
    trackCheckAvailabilityOpened({
      carId: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.salePrice || 0,
      dealerId: car.dealerId,
      dealerName: car.dealer.businessName,
      isLoggedIn: !!user,
    });

    if (user) {
      const nameParts = user.name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        zipCode: user.zip || '',
      }));
    }
  }, [user, car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (!formTouched) setFormTouched(true);
  };

  const handleClose = () => {
    // Track modal closed
    trackCheckAvailabilityClosed({
      carId: car.id,
      dealerId: car.dealerId,
      formStarted: formTouched,
      isLoggedIn: !!user,
    });
    onClose();
  };

  const formatPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.zipCode) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/availability-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          dealerId: car.dealerId,
          ...formData,
          userId: user?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      // Store dealer's custom message settings
      setShowCustomMessage(data.showCustomMessage || false);
      if (data.dealerMessage) {
        setDealerMessage(data.dealerMessage);
      }

      // Track successful submission
      trackCheckAvailabilitySubmitted({
        carId: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        dealerId: car.dealerId,
        dealerName: car.dealer.businessName,
        isLoggedIn: !!user,
        zipCode: formData.zipCode,
      });

      setSuccess(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong. Please try again.';

      // Track error
      trackCheckAvailabilityError({
        carId: car.id,
        dealerId: car.dealerId,
        errorMessage,
        isLoggedIn: !!user,
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your availability request has been sent to <strong>{car.dealer.businessName}</strong>.
            They will contact you shortly about the {car.year} {car.make} {car.model}.
          </p>

          {/* Show custom message if dealer has it enabled, otherwise show default */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-800 mb-1">Message from {car.dealer.businessName}:</p>
            <p className="text-sm text-blue-700 whitespace-pre-line">
              {showCustomMessage && dealerMessage
                ? dealerMessage
                : "Thank you for your interest! We will contact you shortly to schedule your test drive and answer any questions you may have."}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-black text-white py-3 rounded-pill font-semibold hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Check Availability</h2>
            <p className="text-sm text-gray-600">
              {car.year} {car.make} {car.model}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="(555) 555-5555"
              required
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              maxLength={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="30301"
              required
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Comments <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              placeholder="Any questions or specific requests?"
            />
          </div>

          <TCPAConsent
            actionText="Check Availability"
            sellerName={car.dealer.businessName}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-pill font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Check Availability - Test Drive
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
