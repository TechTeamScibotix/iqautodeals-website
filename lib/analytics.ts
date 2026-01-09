import { track } from '@vercel/analytics';
import posthog from 'posthog-js';

// Helper to track to both Vercel Analytics and PostHog
function trackBoth(eventName: string, properties: Record<string, any>) {
  // Send to Vercel Analytics
  track(eventName, properties);

  // Send to PostHog (only in browser)
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
}

// ============================================
// PAGE & NAVIGATION EVENTS
// ============================================

export const trackPageViewed = (data: {
  path: string;
  referrer?: string;
  deviceType?: string;
}) => {
  trackBoth('page_viewed', data);
};

export const trackPageError = (data: {
  errorCode: number;
  path: string;
  message?: string;
}) => {
  trackBoth('page_error', data);
};

export const trackSessionStarted = (data: {
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) => {
  trackBoth('session_started', data);
};

// ============================================
// SEARCH & FILTER EVENTS
// ============================================

export const trackSearchPerformed = (data: {
  query: string;
  resultsCount: number;
  location?: string;
  filters?: Record<string, string | number>;
}) => {
  // Flatten filters into the main object for Vercel Analytics
  const { filters, ...rest } = data;
  const flatData: Record<string, string | number | boolean | null> = { ...rest };
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      flatData[`filter_${key}`] = value;
    });
  }
  trackBoth('search_performed', flatData);
};

export const trackSearchNoResults = (data: {
  query: string;
  location?: string;
  filters?: Record<string, string | number>;
}) => {
  // Flatten filters into the main object for Vercel Analytics
  const { filters, ...rest } = data;
  const flatData: Record<string, string | number | boolean | null> = { ...rest };
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      flatData[`filter_${key}`] = value;
    });
  }
  trackBoth('search_no_results', flatData);
};

export const trackFilterApplied = (data: {
  filterType: string;
  filterValue: string | number;
  resultsCount: number;
}) => {
  trackBoth('filter_applied', data);
};

export const trackSortChanged = (data: {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}) => {
  trackBoth('sort_changed', data);
};

// ============================================
// INVENTORY & CAR VIEW EVENTS
// ============================================

export const trackCarViewed = (data: {
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  dealerId?: string;
  dealerName?: string;
}) => {
  trackBoth('car_viewed', data);
};

export const trackCarGalleryOpened = (data: {
  vin: string;
  make: string;
  model: string;
  photoCount: number;
}) => {
  trackBoth('car_gallery_opened', data);
};

export const trackCarPhotoSwiped = (data: {
  vin: string;
  photoIndex: number;
  totalPhotos: number;
}) => {
  trackBoth('car_photo_swiped', data);
};

export const trackCarNotFound = (data: {
  vin?: string;
  path: string;
  reason?: string;
}) => {
  trackBoth('car_not_found', data);
};

export const trackCarShared = (data: {
  vin: string;
  make: string;
  model: string;
  platform: string;
}) => {
  trackBoth('car_shared', data);
};

export const trackCarSaved = (data: {
  vin: string;
  make: string;
  model: string;
  action: 'saved' | 'unsaved';
}) => {
  trackBoth('car_saved', data);
};

// ============================================
// LEAD GENERATION EVENTS
// ============================================

export const trackQuoteFormStarted = (data: {
  vin?: string;
  source: string;
}) => {
  trackBoth('quote_form_started', data);
};

export const trackQuoteFormAbandoned = (data: {
  vin?: string;
  source: string;
  lastFieldCompleted?: string;
  timeSpentSeconds?: number;
}) => {
  trackBoth('quote_form_abandoned', data);
};

export const trackQuoteFormSubmitted = (data: {
  vin?: string;
  source: string;
  dealerId?: string;
}) => {
  trackBoth('quote_form_submitted', data);
};

export const trackQuoteFormError = (data: {
  vin?: string;
  source: string;
  field: string;
  errorMessage: string;
}) => {
  trackBoth('quote_form_error', data);
};

export const trackContactFormSubmitted = (data: {
  source: string;
  dealerId?: string;
  subject?: string;
}) => {
  trackBoth('contact_form_submitted', data);
};

export const trackPhoneNumberClicked = (data: {
  phoneNumber: string;
  source: string;
  dealerId?: string;
  vin?: string;
}) => {
  trackBoth('phone_number_clicked', data);
};

export const trackEmailClicked = (data: {
  email: string;
  source: string;
  dealerId?: string;
}) => {
  trackBoth('email_clicked', data);
};

export const trackScheduleTestDriveClicked = (data: {
  vin: string;
  make: string;
  model: string;
  dealerId?: string;
}) => {
  trackBoth('schedule_testdrive_clicked', data);
};

// ============================================
// CHECK AVAILABILITY EVENTS
// ============================================

export const trackCheckAvailabilityOpened = (data: {
  carId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  dealerId: string;
  dealerName: string;
  isLoggedIn: boolean;
}) => {
  trackBoth('check_availability_opened', data);
};

export const trackCheckAvailabilitySubmitted = (data: {
  carId: string;
  make: string;
  model: string;
  year: number;
  dealerId: string;
  dealerName: string;
  isLoggedIn: boolean;
  zipCode: string;
}) => {
  trackBoth('check_availability_submitted', data);
};

export const trackCheckAvailabilityError = (data: {
  carId: string;
  dealerId: string;
  errorMessage: string;
  isLoggedIn: boolean;
}) => {
  trackBoth('check_availability_error', data);
};

export const trackCheckAvailabilityClosed = (data: {
  carId: string;
  dealerId: string;
  formStarted: boolean;
  isLoggedIn: boolean;
}) => {
  trackBoth('check_availability_closed', data);
};

export const trackGetDirectionsClicked = (data: {
  dealerId: string;
  dealerName: string;
}) => {
  trackBoth('get_directions_clicked', data);
};

// ============================================
// DEALER EVENTS
// ============================================

export const trackDealerViewed = (data: {
  dealerId: string;
  dealerName: string;
  city?: string;
  state?: string;
}) => {
  trackBoth('dealer_viewed', data);
};

export const trackDealerContactClicked = (data: {
  dealerId: string;
  dealerName: string;
  contactType: 'phone' | 'email' | 'form';
}) => {
  trackBoth('dealer_contact_clicked', data);
};

export const trackDealerNotFound = (data: {
  dealerId?: string;
  path: string;
}) => {
  trackBoth('dealer_not_found', data);
};

// ============================================
// ERROR & DEBUGGING EVENTS
// ============================================

export const trackApiError = (data: {
  endpoint: string;
  method: string;
  statusCode: number;
  errorMessage?: string;
  requestDuration?: number;
}) => {
  trackBoth('api_error', data);
};

export const trackJavascriptError = (data: {
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  path: string;
}) => {
  trackBoth('javascript_error', data);
};

export const trackImageLoadFailed = (data: {
  imageUrl: string;
  path: string;
  context?: string;
}) => {
  trackBoth('image_load_failed', data);
};

export const trackFormValidationError = (data: {
  formName: string;
  field: string;
  errorMessage: string;
}) => {
  trackBoth('form_validation_error', data);
};

// ============================================
// PERFORMANCE EVENTS
// ============================================

export const trackSlowPageLoad = (data: {
  path: string;
  loadTimeMs: number;
  deviceType?: string;
}) => {
  trackBoth('slow_page_load', data);
};

export const trackSlowApiResponse = (data: {
  endpoint: string;
  responseTimeMs: number;
}) => {
  trackBoth('slow_api_response', data);
};

// ============================================
// EXTERNAL & MARKETING EVENTS
// ============================================

export const trackExternalLinkClicked = (data: {
  url: string;
  linkText?: string;
  source: string;
}) => {
  trackBoth('external_link_clicked', data);
};

export const trackUtmCaptured = (data: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
}) => {
  trackBoth('utm_captured', data);
};

// ============================================
// USER ACCOUNT EVENTS
// ============================================

export const trackSignupStarted = (data: {
  source: string;
  userType: 'customer' | 'dealer';
}) => {
  trackBoth('signup_started', data);
};

export const trackSignupCompleted = (data: {
  userType: 'customer' | 'dealer';
  method: 'email' | 'google' | 'facebook';
}) => {
  trackBoth('signup_completed', data);
};

export const trackSignupAbandoned = (data: {
  userType: 'customer' | 'dealer';
  lastFieldCompleted?: string;
  timeSpentSeconds?: number;
}) => {
  trackBoth('signup_abandoned', data);
};

export const trackLoginSuccess = (data: {
  userType: 'customer' | 'dealer';
  method: 'email' | 'google' | 'facebook';
}) => {
  trackBoth('login_success', data);
};

export const trackLoginFailed = (data: {
  reason: string;
  attemptedEmail?: string;
}) => {
  trackBoth('login_failed', { reason: data.reason });
};

export const trackPasswordResetRequested = (data: {
  source: string;
}) => {
  trackBoth('password_reset_requested', data);
};

export const trackAuthError = (data: {
  errorType: string;
  path: string;
  message?: string;
}) => {
  trackBoth('auth_error', data);
};

// ============================================
// SESSION & NAVIGATION EVENTS
// ============================================

export const trackSessionEnded = (data: {
  durationSeconds: number;
  pagesViewed: number;
  lastPage: string;
}) => {
  trackBoth('session_ended', data);
};

export const trackBackButtonClicked = (data: {
  fromPage: string;
  toPage: string;
}) => {
  trackBoth('back_button_clicked', data);
};

export const trackFilterCleared = (data: {
  filterType: string;
  previousValue: string;
}) => {
  trackBoth('filter_cleared', data);
};

// ============================================
// CONVERSION FUNNEL EVENTS
// ============================================

export const trackFunnelStep = (data: {
  step: 'homepage_landed' | 'search_started' | 'car_selected' | 'lead_initiated' | 'lead_completed';
  previousStep?: string;
  metadata?: Record<string, string | number>;
}) => {
  const { metadata, ...rest } = data;
  const flatData: Record<string, string | number | boolean | null> = { ...rest };
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      flatData[key] = value;
    });
  }
  trackBoth('funnel_step', flatData);
};

export const trackFunnelDropped = (data: {
  lastStep: string;
  lastAction: string;
  timeInFunnelSeconds?: number;
}) => {
  trackBoth('funnel_dropped', data);
};

// ============================================
// DEVICE & BROWSER DETECTION
// ============================================

export const trackDeviceInfo = (data: {
  deviceType: string;
  browserType: string;
  osType: string;
  screenWidth: number;
  screenHeight: number;
}) => {
  trackBoth('device_info', data);
};

export const trackLocationDetected = (data: {
  city?: string;
  state?: string;
  country?: string;
  source: 'ip' | 'geolocation' | 'manual';
}) => {
  trackBoth('location_detected', data);
};

// ============================================
// AD TRACKING
// ============================================

export const trackAdClicked = (data: {
  adPlatform: 'google' | 'facebook' | 'bing' | 'other';
  campaignId?: string;
  adId?: string;
  clickId?: string;
}) => {
  trackBoth('ad_clicked', data);
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const getBrowserType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Edg')) return 'edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'opera';
  return 'other';
};

export const getOSType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'windows';
  if (ua.includes('Mac')) return 'macos';
  if (ua.includes('Linux')) return 'linux';
  if (ua.includes('Android')) return 'android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'ios';
  return 'other';
};

export const captureUtmParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = params.get(param);
    if (value) utmParams[param] = value;
  });

  return utmParams;
};

export const captureAdParams = (): { platform: string; clickId: string } | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);

  // Google Ads
  const gclid = params.get('gclid');
  if (gclid) return { platform: 'google', clickId: gclid };

  // Facebook Ads
  const fbclid = params.get('fbclid');
  if (fbclid) return { platform: 'facebook', clickId: fbclid };

  // Bing Ads
  const msclkid = params.get('msclkid');
  if (msclkid) return { platform: 'bing', clickId: msclkid };

  return null;
};
