'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Car, Mail, Lock, User, Phone, Building2, MapPin, Hash, LogIn, UserPlus, Briefcase } from 'lucide-react';
import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'customer';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    userType: defaultType,
    businessName: '',
    address: '',
    city: '',
    state: 'GA',
    zip: '',
    workHoursStart: '09:00',
    workHoursEnd: '18:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto login after registration
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.userType === 'dealer') {
        router.push('/dealer');
      } else {
        router.push('/customer');
      }
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  const isDealer = formData.userType === 'dealer';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl mx-auto relative z-10 border-2 border-primary/10 animate-slide-up">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-purple to-secondary bg-clip-text text-transparent">
            IQ Auto Deals
          </h1>
          <h2 className="text-2xl font-bold mb-2 text-dark">
            Create Account
          </h2>
          <p className="text-gray-600 text-lg">Join IQ Auto Deals today</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-slide-in">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, userType: 'customer' })}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              !isDealer
                ? 'bg-gradient-to-r from-primary to-purple text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <User className="w-5 h-5" />
            I'm a Customer
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, userType: 'dealer' })}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isDealer
                ? 'bg-gradient-to-r from-secondary to-orange-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            I'm a Dealer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 hover:bg-white"
                required
              />
            </div>

            <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 hover:bg-white"
              required
            />
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Password * <span className="text-xs text-gray-500">(min 6 characters)</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a secure password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 hover:bg-white"
              required
              minLength={6}
            />
          </div>

          {isDealer && (
            <>
              <div className="pt-6 border-t-2 border-gray-100 animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <h3 className="font-bold text-xl mb-5 flex items-center gap-2 text-secondary">
                  <Building2 className="w-6 h-6" />
                  Dealership Information
                </h3>
              </div>

              <div className="animate-slide-in" style={{ animationDelay: '0.7s' }}>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-secondary" />
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Premium Auto Sales"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-gray-50 hover:bg-white"
                  required={isDealer}
                />
              </div>

              <div className="animate-slide-in" style={{ animationDelay: '0.8s' }}>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-gray-50 hover:bg-white"
                  required={isDealer}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 animate-slide-in" style={{ animationDelay: '0.9s' }}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Atlanta"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-gray-50 hover:bg-white"
                    required={isDealer}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-gray-50 hover:bg-white"
                    required={isDealer}
                  >
                    <option value="GA">GA</option>
                    <option value="FL">FL</option>
                    <option value="AL">AL</option>
                    <option value="SC">SC</option>
                    <option value="NC">NC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    ZIP *
                  </label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="30301"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-gray-50 hover:bg-white"
                    required={isDealer}
                    maxLength={5}
                  />
                </div>
              </div>

              <div className="pt-4 border-t-2 border-gray-100 animate-slide-in" style={{ animationDelay: '1s' }}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary">
                  <Building2 className="w-5 h-5" />
                  Business Hours
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 animate-slide-in" style={{ animationDelay: '1.1s' }}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Opening Time *
                  </label>
                  <input
                    type="time"
                    value={formData.workHoursStart}
                    onChange={(e) => setFormData({ ...formData, workHoursStart: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-gray-50 hover:bg-white"
                    required={isDealer}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Closing Time *
                  </label>
                  <input
                    type="time"
                    value={formData.workHoursEnd}
                    onChange={(e) => setFormData({ ...formData, workHoursEnd: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-gray-50 hover:bg-white"
                    required={isDealer}
                  />
                </div>
              </div>

              <div className="animate-slide-in" style={{ animationDelay: '1.2s' }}>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Working Days *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newWorkDays = formData.workDays.includes(day)
                          ? formData.workDays.filter(d => d !== day)
                          : [...formData.workDays, day];
                        setFormData({ ...formData, workDays: newWorkDays });
                      }}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        formData.workDays.includes(day)
                          ? 'bg-secondary text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary via-purple to-secondary text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-105 mt-8 animate-slide-in"
            style={{ animationDelay: '1s' }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 animate-fade-in" style={{ animationDelay: '1.1s' }}>
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline flex items-center gap-1 justify-center mt-2 hover:scale-105 transition-transform inline-flex">
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 py-12 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
