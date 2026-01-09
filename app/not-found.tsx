'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackPageError } from '@/lib/analytics';

export default function NotFound() {
  useEffect(() => {
    trackPageError({
      errorCode: 404,
      path: window.location.pathname,
      message: 'Page not found',
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/cars"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Browse Cars
          </Link>
        </div>
      </div>
    </div>
  );
}
