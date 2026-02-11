'use client';

import { Globe, ExternalLink } from 'lucide-react';

interface DealerWebsiteLinkProps {
  websiteUrl: string;
  dealerId: string;
  carId: string;
  referrerPage?: string;
}

export default function DealerWebsiteLink({ websiteUrl, dealerId, carId, referrerPage }: DealerWebsiteLinkProps) {
  const trackClick = () => {
    const payload = JSON.stringify({ dealerId, carId, referrerPage });

    // sendBeacon guarantees delivery even during page navigation
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/track-dealer-click', blob);
    } else {
      // Fallback for older browsers
      fetch('/api/track-dealer-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    }
  };

  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener"
      onClick={trackClick}
      className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 mt-2 font-medium"
    >
      <Globe className="w-4 h-4" />
      Visit Dealer Website
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
