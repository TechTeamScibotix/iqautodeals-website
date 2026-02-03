import { Metadata } from 'next';
import { Suspense } from 'react';
import BookDemoClient from './BookDemoClient';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Book a Demo - IQ Auto Deals for Dealers',
  description: 'Schedule a free demo to see how IQ Auto Deals can help your dealership reach more buyers, increase sales, and grow your business with our nationwide car marketplace.',
};

export default function BookDemoPage() {
  return (
    <>
      <div className="sr-only">
        <h1>Book a Demo with IQ Auto Deals</h1>
        <p>Schedule a personalized demo to discover how our nationwide online car marketplace connects certified dealers with qualified car buyers. See how IQ Auto Deals can help transform your dealership with competitive offers, qualified leads, and streamlined inventory management.</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
        <BookDemoClient />
      </Suspense>
    </>
  );
}
