import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import DealerIntegrationClient from './DealerIntegrationClient';

export const metadata: Metadata = {
  title: 'Dealer API Integration - IQ Auto Deals',
  description: 'Programmatically manage your dealership inventory with our powerful RESTful API. Upload vehicles, manage deals, and sync inventory automatically.',
  keywords: 'dealer API, automotive API, car dealer integration, inventory management API, dealer inventory sync',
};

// Force static generation
export const dynamic = 'force-static';

// Server component wrapper - renders SEO content visible to crawlers
export default function DealerIntegrationPage() {
  return (
    <>
      {/* SEO content visible to crawlers (server-rendered) */}
      <div className="sr-only">
        <p>
          IQ Auto Deals provides a powerful RESTful API for dealerships to programmatically
          manage their vehicle inventory. Our enterprise-grade API allows dealers with 50+
          vehicles to automate listing creation, updates, and synchronization with their
          existing dealer management systems.
        </p>
        <h2>API Features</h2>
        <ul>
          <li>High Performance: 10,000 requests per hour for enterprise dealers</li>
          <li>Bulk Operations: Add, update, or delete hundreds of vehicles at once</li>
          <li>Secure: TLS 1.3 encryption, GDPR and CCPA compliant</li>
          <li>RESTful JSON: Standard REST API with JSON request and response format</li>
        </ul>
        <h2>Available Endpoints</h2>
        <ul>
          <li>POST /api/auth/login - Authenticate and get dealer credentials</li>
          <li>GET /api/dealer/cars - List all dealer inventory</li>
          <li>POST /api/dealer/cars - Add new vehicle listings</li>
          <li>PUT /api/dealer/cars/:id - Update existing vehicle information</li>
          <li>DELETE /api/dealer/cars/:id - Remove vehicle from inventory</li>
          <li>POST /api/upload - Upload vehicle photos</li>
          <li>GET /api/dealer/deal-requests - View incoming deal requests</li>
          <li>POST /api/dealer/submit-offer - Submit price offers to customers</li>
        </ul>
        <h2>Getting Started</h2>
        <p>
          Sign up for a dealer account to get immediate API access. All new dealers
          receive a 90-day free trial. Our API documentation provides complete examples
          for authentication, vehicle listing creation, and deal management.
        </p>
        <nav aria-label="Related pages">
          <ul>
            <li><Link href="/for-dealers">Dealer Portal</Link></li>
            <li><Link href="/register?type=dealer">Sign Up as Dealer</Link></li>
            <li><Link href="/login">Dealer Login</Link></li>
            <li><Link href="/">IQ Auto Deals Home</Link></li>
          </ul>
        </nav>
      </div>

      {/* Interactive client component */}
      <Suspense fallback={<div>Loading...</div>}>
        <DealerIntegrationClient />
      </Suspense>
    </>
  );
}
