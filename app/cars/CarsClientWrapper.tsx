'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CarsClient, { type CarsClientProps } from './CarsClient';

/**
 * Wraps CarsClient in a client-side Suspense boundary so that
 * useSearchParams() doesn't trigger BAILOUT_TO_CLIENT_SIDE_RENDERING
 * on the parent server component. This ensures server-rendered content
 * (h1 tags, SEO text) remains in the initial HTML for crawlers.
 */
function CarsClientInner(props: CarsClientProps) {
  const searchParams = useSearchParams();
  return <CarsClient {...props} urlSearchParams={searchParams} />;
}

export default function CarsClientWrapper(props: CarsClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    }>
      <CarsClientInner {...props} />
    </Suspense>
  );
}
