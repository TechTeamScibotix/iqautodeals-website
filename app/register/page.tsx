import { Metadata } from 'next';
import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Create Account - IQ Auto Deals',
  description: 'Create your free IQ Auto Deals account to start receiving competing offers from certified dealers, browse thousands of vehicles, and find your perfect car.',
};

export default function RegisterPage() {
  return (
    <>
      <div className="sr-only">
        <h1>Create Your IQ Auto Deals Account</h1>
        <p>Join IQ Auto Deals today to access our nationwide online car marketplace. Whether you are a car buyer looking for competitive offers or a dealer seeking qualified leads, create your free account to get started.</p>
        <h2>Why Create an Account?</h2>
        <ul>
          <li>Browse thousands of quality vehicles from certified dealers nationwide</li>
          <li>Save your favorite cars and compare up to 4 vehicles side by side</li>
          <li>Receive competing offers from multiple dealers on your selected vehicles</li>
          <li>Get competing offers from multiple dealers on your selected vehicles</li>
          <li>Track all your deal requests and offers in one convenient dashboard</li>
          <li>Get price drop alerts on vehicles you are interested in</li>
        </ul>
        <h2>For Car Buyers</h2>
        <p>Creating a free buyer account gives you access to our full inventory of used and new cars from certified dealers across all 50 US states. Select the vehicles you love, and let dealers compete to offer you the best price. No haggling, no hassle, just great deals delivered to your inbox.</p>
        <h2>For Dealers</h2>
        <p>Register as a dealer to access qualified buyer leads, list your inventory, and grow your sales. Our platform connects you with motivated car buyers who are ready to purchase. Manage your deals, submit competitive offers, and close more sales with IQ Auto Deals.</p>
        <h2>Free to Join</h2>
        <p>Creating an IQ Auto Deals account is completely free for car buyers. There are no hidden fees or obligations. Simply enter your email, create a password, and start browsing our extensive inventory of quality vehicles from trusted dealers nationwide.</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-black p-4 py-12 flex items-center justify-center"><div className="text-xl text-white">Loading...</div></div>}>
        <RegisterClient />
      </Suspense>
    </>
  );
}
