import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ForDealersClient from './ForDealersClient';

export const metadata: Metadata = {
  title: 'For Dealers - Join IQ Auto Deals Marketplace',
  description: 'Join IQ Auto Deals marketplace and get access to motivated car buyers. AI-powered SEO, proactive customer engagement, and 90-day free pilot. Start selling more cars today.',
  keywords: ['car dealer marketplace', 'sell cars online', 'dealer leads', 'automotive marketplace', 'car dealer platform'],
};

// Force static generation for SEO
export const dynamic = 'force-static';

// Server component wrapper - renders SEO content visible to crawlers
export default function ForDealersPage() {
  return (
    <>
      {/* SEO content visible to crawlers (server-rendered) */}
      <div className="sr-only">
        <p>
          IQ Auto Deals is an AI-native automotive marketplace helping dealers reach more car buyers.
          Our platform offers agentic AI SEO, proactive customer engagement, and a 90-day risk-free
          pilot program. Join leading dealers like Turpin Dodge, Lexus of Nashville, and Interstate
          Motors who are already seeing results.
        </p>
        <h2>Why Dealers Choose IQ Auto Deals</h2>
        <ul>
          <li>Agentic AI SEO - Unique descriptions optimized for local searches</li>
          <li>Proactive Customer Engagement - Get leads when customers browse your inventory</li>
          <li>SEO Boost for Your Website - Verified backlinks and authority building</li>
          <li>90-Day Free Pilot - No risk, no obligation</li>
          <li>Family Pricing Locked In - Early adopters get exclusive rates</li>
        </ul>
        <h2>Pricing</h2>
        <p>
          Start free for 90 days with full marketplace access. After pilot: $2,500/month for early
          adopters vs. $3,500-$4,000+ at legacy competitors. No long-term contracts required.
        </p>
        <nav aria-label="Related pages">
          <ul>
            <li><Link href="/for-dealers/book-demo">Book Demo</Link></li>
            <li><Link href="/register?type=dealer">Sign Up for Free Pilot</Link></li>
            <li><Link href="/login">Dealer Login</Link></li>
            <li><Link href="/dealer-integration">API Integration</Link></li>
            <li><Link href="/">Home</Link></li>
          </ul>
        </nav>
      </div>

      {/* Interactive client component */}
      <Suspense fallback={<div>Loading...</div>}>
        <ForDealersClient />
      </Suspense>
    </>
  );
}
