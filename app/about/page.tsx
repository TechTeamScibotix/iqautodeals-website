import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About IQ Auto Deals - Online Car Marketplace',
  description: 'IQ Auto Deals is a nationwide online car marketplace connecting buyers with certified dealers. Learn about our mission, team, and how we help buyers save thousands on used cars.',
  keywords: ['about IQ Auto Deals', 'online car marketplace', 'used car platform', 'car buying company', 'automotive marketplace'],
};

// Force static generation for SEO
export const dynamic = 'force-static';

// Server component wrapper - renders SEO content visible to crawlers
export default function AboutPage() {
  return (
    <>
      {/* SEO content visible to crawlers (server-rendered) */}
      <div className="sr-only">
        <p>
          IQ Auto Deals is a technology company headquartered in Atlanta, Georgia, operating a nationwide
          online marketplace for used cars. Founded in 2024, we connect car buyers with certified dealers
          across all 50 states. Our unique dealer competition model helps buyers save up to $5,000 on their
          vehicle purchase.
        </p>
        <h2>Our Mission</h2>
        <p>
          To make car buying simple, transparent, and affordable for everyone. We believe every car buyer
          deserves access to competitive pricing without the hassle of visiting multiple dealerships.
        </p>
        <h2>Company Information</h2>
        <ul>
          <li>Legal Name: Scibotix Solutions LLC (DBA IQ Auto Deals)</li>
          <li>Founded: 2024</li>
          <li>Headquarters: Atlanta, Georgia, USA</li>
          <li>Industry: Automotive / E-Commerce / Technology</li>
          <li>Service Area: United States (Nationwide)</li>
          <li>Website: iqautodeals.com</li>
        </ul>
        <nav aria-label="Related pages">
          <ul>
            <li><Link href="/cars">Browse Cars</Link></li>
            <li><Link href="/for-dealers">For Dealers</Link></li>
            <li><Link href="/blog">Car Buying Guides</Link></li>
            <li><Link href="/">Home</Link></li>
          </ul>
        </nav>
      </div>

      {/* Interactive client component */}
      <Suspense fallback={<div>Loading...</div>}>
        <AboutClient />
      </Suspense>
    </>
  );
}
