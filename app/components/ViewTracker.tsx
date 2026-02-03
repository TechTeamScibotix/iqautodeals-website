'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  vin: string;
}

/**
 * Tracks vehicle views by calling the Scibotix API
 * This component renders nothing - it just fires a tracking call on mount
 */
export default function ViewTracker({ vin }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return;
    tracked.current = true;

    // Fire and forget - don't block rendering
    const trackView = async () => {
      try {
        // Call Scibotix Solutions API to track the view
        await fetch(`https://scibotixsolutions.com/api/vehicles/${vin}/track-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: 'iqautodeals',
          }),
        });
      } catch (error) {
        // Silently fail - don't break the page
        console.debug('View tracking failed:', error);
      }
    };

    trackView();
  }, [vin]);

  // This component renders nothing
  return null;
}
