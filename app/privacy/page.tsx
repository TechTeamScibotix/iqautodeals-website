import { Metadata } from 'next';
import { Suspense } from 'react';
import PrivacyClient from './PrivacyClient';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Privacy Notice - IQ Auto Deals',
  description: 'Read the IQ Auto Deals privacy notice to understand how we collect, use, and protect your personal information on our nationwide online car marketplace.',
};

export default function PrivacyPage() {
  return (
    <>
      <div className="sr-only">
        <h1>IQ Auto Deals Privacy Notice</h1>
        <p>Learn how IQ Auto Deals, operated by Scibotix Solutions LLC, handles your personal information. This privacy notice covers data collection, usage, protection, and your rights regarding personal information on our nationwide online car marketplace platform.</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
        <PrivacyClient />
      </Suspense>
    </>
  );
}
