import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Redirect www to non-www (avoid duplicate pages)
  if (hostname.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = hostname.replace('www.', '');
    return NextResponse.redirect(url, { status: 301 });
  }

  const pathname = request.nextUrl.pathname;

  // Location redirects: strip state code suffix (e.g. /locations/atlanta-ga → /locations/atlanta)
  const locationMatch = pathname.match(/^\/locations\/(.+)-([a-z]{2})$/);
  if (locationMatch) {
    const city = locationMatch[1];
    return NextResponse.redirect(new URL(`/locations/${city}`, request.url), { status: 301 });
  }

  // Model redirects: correct common slug mismatches
  const modelRedirects: Record<string, string> = {
    'ford-f-150': 'ford-f150',
  };
  if (pathname.startsWith('/models/')) {
    const slug = pathname.replace('/models/', '');
    if (modelRedirects[slug]) {
      return NextResponse.redirect(new URL(`/models/${modelRedirects[slug]}`, request.url), { status: 301 });
    }
  }

  // Check if this is a car detail page with UUID
  if (pathname.startsWith('/cars/')) {
    const carIdOrSlug = pathname.replace('/cars/', '');

    // If it's a UUID, we need to redirect to the slug
    if (UUID_REGEX.test(carIdOrSlug)) {
      try {
        // Fetch the car's slug from the API
        const apiUrl = new URL('/api/car-slug', request.url);
        apiUrl.searchParams.set('id', carIdOrSlug);

        const response = await fetch(apiUrl.toString());
        if (response.ok) {
          const data = await response.json();
          if (data.slug) {
            // Permanent redirect (301) to the slug URL
            return NextResponse.redirect(
              new URL(`/cars/${data.slug}`, request.url),
              { status: 301 }
            );
          }
        }
      } catch (error) {
        // If error, let the page handle it
        console.error('Middleware redirect error:', error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except static files and API internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
