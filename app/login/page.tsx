import { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from './LoginClient';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign In - IQ Auto Deals',
  description: 'Sign in to your IQ Auto Deals account to access your dashboard, manage deal requests, and connect with certified car dealers nationwide.',
};

export default function LoginPage() {
  return (
    <>
      <div className="sr-only">
        <h1>Sign In to IQ Auto Deals</h1>
        <p>Access your IQ Auto Deals account to manage your car buying journey. View deal requests, track offers from certified dealers, and find your perfect vehicle on our nationwide online car marketplace.</p>
        <h2>Account Benefits</h2>
        <ul>
          <li>Save your favorite vehicles and compare up to 4 cars at once</li>
          <li>Receive competing offers from multiple certified dealers</li>
          <li>Track your deal requests and offers in one dashboard</li>
          <li>Get notified when prices drop on vehicles you are interested in</li>
          <li>Access your purchase history and saved searches</li>
        </ul>
        <h2>For Car Buyers</h2>
        <p>IQ Auto Deals connects you with certified dealers across all 50 US states. Browse thousands of quality used and new vehicles, select your favorites, and let dealers compete for your business. Let dealers compete for your business with no haggling required.</p>
        <h2>For Dealers</h2>
        <p>Access qualified buyer leads, manage your inventory, and grow your sales. Our platform connects you with motivated car buyers actively looking to purchase. Sign in to your dealer portal to manage deals and submit competitive offers.</p>
        <h2>Secure Login</h2>
        <p>Your account is protected with industry-standard security. We never share your personal information without your consent. Forgot your password? Use our secure password reset feature to regain access to your account.</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-xl text-white">Loading...</div></div>}>
        <LoginClient />
      </Suspense>
    </>
  );
}
