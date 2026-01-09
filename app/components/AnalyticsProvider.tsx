'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  trackPageViewed,
  trackUtmCaptured,
  trackSessionStarted,
  trackSessionEnded,
  trackJavascriptError,
  trackImageLoadFailed,
  trackSlowPageLoad,
  trackApiError,
  trackExternalLinkClicked,
  trackBackButtonClicked,
  trackDeviceInfo,
  trackAdClicked,
  getDeviceType,
  getBrowserType,
  getOSType,
  captureUtmParams,
  captureAdParams
} from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change
  useEffect(() => {
    const deviceType = getDeviceType();
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined;

    trackPageViewed({
      path: pathname,
      referrer,
      deviceType,
    });
  }, [pathname]);

  // Capture UTM params on initial load
  useEffect(() => {
    const utmParams = captureUtmParams();

    if (Object.keys(utmParams).length > 0) {
      trackUtmCaptured({
        utmSource: utmParams.utm_source,
        utmMedium: utmParams.utm_medium,
        utmCampaign: utmParams.utm_campaign,
        utmTerm: utmParams.utm_term,
        utmContent: utmParams.utm_content,
        referrer: document.referrer || undefined,
      });
    }

    // Track session start
    const isNewSession = !sessionStorage.getItem('session_started');
    if (isNewSession) {
      sessionStorage.setItem('session_started', 'true');
      trackSessionStarted({
        referrer: document.referrer || undefined,
        utmSource: utmParams.utm_source,
        utmMedium: utmParams.utm_medium,
        utmCampaign: utmParams.utm_campaign,
      });
    }
  }, []);

  // Global error handler for uncaught JS errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackJavascriptError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        path: window.location.pathname,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackJavascriptError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        path: window.location.pathname,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Track image load failures
  useEffect(() => {
    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      if (target.tagName === 'IMG') {
        trackImageLoadFailed({
          imageUrl: target.src,
          path: window.location.pathname,
          context: target.alt || 'unknown',
        });
      }
    };

    document.addEventListener('error', handleImageError, true);

    return () => {
      document.removeEventListener('error', handleImageError, true);
    };
  }, []);

  // Track slow page loads
  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.startTime;
          if (loadTime > 3000) { // Slow if > 3 seconds
            trackSlowPageLoad({
              path: window.location.pathname,
              loadTimeMs: Math.round(loadTime),
              deviceType: getDeviceType(),
            });
          }
        }
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [pathname]);

  // Track external link clicks
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const url = new URL(link.href, window.location.origin);
        const isExternal = url.hostname !== window.location.hostname;

        if (isExternal) {
          trackExternalLinkClicked({
            url: link.href,
            linkText: link.textContent?.trim() || undefined,
            source: window.location.pathname,
          });
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Track session end on page unload
  useEffect(() => {
    const sessionStartTime = Date.now();
    let pagesViewed = 1;

    const incrementPageCount = () => {
      pagesViewed++;
    };

    const handleBeforeUnload = () => {
      const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
      trackSessionEnded({
        durationSeconds,
        pagesViewed,
        lastPage: window.location.pathname,
      });
    };

    // Track page changes within session
    window.addEventListener('popstate', incrementPageCount);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', incrementPageCount);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Track back button navigation
  useEffect(() => {
    let previousPage = pathname;

    const handlePopState = () => {
      trackBackButtonClicked({
        fromPage: previousPage,
        toPage: window.location.pathname,
      });
      previousPage = window.location.pathname;
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname]);

  // Track device info on initial load
  useEffect(() => {
    const hasTrackedDevice = sessionStorage.getItem('device_tracked');
    if (!hasTrackedDevice && typeof window !== 'undefined') {
      trackDeviceInfo({
        deviceType: getDeviceType(),
        browserType: getBrowserType(),
        osType: getOSType(),
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      });
      sessionStorage.setItem('device_tracked', 'true');
    }
  }, []);

  // Track ad clicks (gclid, fbclid, msclkid)
  useEffect(() => {
    const adParams = captureAdParams();
    if (adParams) {
      trackAdClicked({
        adPlatform: adParams.platform as 'google' | 'facebook' | 'bing' | 'other',
        clickId: adParams.clickId,
      });
    }
  }, []);

  return <>{children}</>;
}

// Wrapper for fetch that tracks API errors
export async function trackedFetch(url: string, options?: RequestInit): Promise<Response> {
  const startTime = Date.now();
  const method = options?.method || 'GET';

  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      trackApiError({
        endpoint: url,
        method,
        statusCode: response.status,
        errorMessage: response.statusText,
        requestDuration: duration,
      });
    }

    // Track slow API responses (> 2 seconds)
    if (duration > 2000) {
      const { trackSlowApiResponse } = await import('@/lib/analytics');
      trackSlowApiResponse({
        endpoint: url,
        responseTimeMs: duration,
      });
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    trackApiError({
      endpoint: url,
      method,
      statusCode: 0,
      errorMessage: error instanceof Error ? error.message : 'Network error',
      requestDuration: duration,
    });
    throw error;
  }
}
