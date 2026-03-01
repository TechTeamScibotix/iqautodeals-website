'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import posthog from 'posthog-js';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if user already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    // Opt out of PostHog tracking
    if (posthog.__loaded) {
      posthog.opt_out_capturing();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-gray-900 border-t border-gray-700 shadow-lg">
      <div className="w-full px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center gap-3">
        <p className="flex-1 text-sm text-gray-300 leading-relaxed text-center sm:text-left">
          We use cookies to enhance your experience, analyze site traffic, and understand which vehicles interest you.
          Your browsing activity may be linked to your profile when you register or log in.{' '}
          <Link href="/privacy" className="text-primary font-semibold hover:underline">
            Privacy Notice
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-5 py-2 text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
