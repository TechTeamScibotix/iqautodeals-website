'use client';

import { useEffect } from 'react';
import { trackPageError, trackJavascriptError } from '@/lib/analytics';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Track the error
    trackPageError({
      errorCode: 500,
      path: window.location.pathname,
      message: error.message,
    });

    trackJavascriptError({
      message: error.message,
      stack: error.stack,
      path: window.location.pathname,
    });

    // Log to console for debugging
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Something went wrong</h2>
        <p className="text-gray-500 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
