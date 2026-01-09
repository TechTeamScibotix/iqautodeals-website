'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { trackLoginSuccess, trackLoginFailed, trackAuthError } from '@/lib/analytics';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Login failed:', data);
        trackLoginFailed({
          reason: data.error || 'Login failed',
        });
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store user in localStorage (simple demo auth)
      try {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('User stored in localStorage successfully');

        // Track successful login
        trackLoginSuccess({
          userType: data.user.userType,
          method: 'email',
        });
      } catch (storageErr) {
        console.error('localStorage error:', storageErr);
        trackAuthError({
          errorType: 'storage_blocked',
          path: '/login',
          message: 'Browser storage blocked',
        });
        setError('Browser storage blocked. Please enable cookies and try again.');
        setLoading(false);
        return;
      }

      // Redirect based on user type
      if (data.user.userType === 'dealer') {
        router.push('/dealer');
      } else {
        router.push('/customer');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 border-2 border-primary/20 animate-slide-up">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 text-primary">
            IQ Auto Deals
          </h1>
          <p className="text-gray-600 text-lg">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-slide-in">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 hover:bg-white"
              required
            />
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 hover:bg-white"
              required
            />
            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline font-semibold">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 animate-slide-in"
            style={{ animationDelay: '0.3s' }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline flex items-center gap-1 justify-center mt-2 hover:scale-105 transition-transform inline-flex">
            <UserPlus className="w-4 h-4" />
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
