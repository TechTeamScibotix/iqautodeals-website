import { Metadata } from 'next';
import { Suspense } from 'react';
import TermsClient from './TermsClient';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Terms and Conditions - IQ Auto Deals',
  description: 'Read the IQ Auto Deals terms and conditions of use for our nationwide online car marketplace connecting car buyers with certified dealers.',
};

export default function TermsPage() {
  return (
    <>
      <div className="sr-only">
        <h1>IQ Auto Deals Terms and Conditions of Use</h1>
        <p>These terms and conditions govern your use of IQ Auto Deals, a nationwide online car marketplace operated by Scibotix Solutions LLC. Review the terms for customers and dealers, prohibited activities, and other important legal information.</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
        <TermsClient />
      </Suspense>
    </>
  );
}
