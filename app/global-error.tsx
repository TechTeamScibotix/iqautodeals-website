'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    track('page_error', {
      errorCode: 500,
      path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      message: error.message,
    });

    track('javascript_error', {
      message: error.message,
      stack: error.stack || 'No stack trace',
      path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    });

    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>
              Oops!
            </h1>
            <h2 style={{ fontSize: '1.5rem', color: '#4b5563', marginBottom: '1rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              We encountered a critical error. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
