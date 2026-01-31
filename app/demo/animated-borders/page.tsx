'use client';

import { AnimatedBorder, BorderBeam, GlowingBorder } from '@/components/AnimatedBorder';
import { Car } from 'lucide-react';
import Link from 'next/link';

export default function AnimatedBordersDemo() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-primary-light font-bold">
            Back to Home
          </Link>
          <span className="text-gray-400 text-sm">Animated Border Demo</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Animated Border Styles</h1>
        <p className="text-gray-400 text-center mb-16">Choose your favorite style for IQ Auto Deals branding</p>

        {/* Style 1: Border Beam */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-2 text-primary-light">Style 1: Border Beam</h2>
          <p className="text-gray-400 mb-8">A single light beam travels around the border - similar to Augment Code</p>

          <div className="flex flex-col items-center gap-8 p-12 bg-gray-900/50 rounded-2xl">
            {/* Logo Version */}
            <BorderBeam>
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-primary-light" />
                <span className="text-3xl font-bold text-primary-light">IQ Auto Deals</span>
              </div>
            </BorderBeam>

            {/* Button Version */}
            <BorderBeam>
              <button className="text-lg font-semibold text-white">
                Get Started Today
              </button>
            </BorderBeam>

            {/* Tag Version */}
            <BorderBeam className="text-sm">
              <span className="text-accent-light font-medium">New Feature</span>
            </BorderBeam>
          </div>
        </section>

        {/* Style 2: Animated Border (Full Gradient) */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-2 text-primary-light">Style 2: Full Gradient Spin</h2>
          <p className="text-gray-400 mb-8">A full gradient border that rotates continuously</p>

          <div className="flex flex-col items-center gap-8 p-12 bg-gray-900/50 rounded-2xl">
            {/* Logo Version */}
            <AnimatedBorder>
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-primary-light" />
                <span className="text-3xl font-bold text-primary-light">IQ Auto Deals</span>
              </div>
            </AnimatedBorder>

            {/* Button Version */}
            <AnimatedBorder>
              <button className="text-lg font-semibold text-white">
                Get Started Today
              </button>
            </AnimatedBorder>

            {/* Tag Version */}
            <AnimatedBorder className="text-sm">
              <span className="text-accent-light font-medium">New Feature</span>
            </AnimatedBorder>
          </div>
        </section>

        {/* Style 3: Glowing Border */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold mb-2 text-primary-light">Style 3: Glowing Border</h2>
          <p className="text-gray-400 mb-8">A rotating gradient with a soft glow effect</p>

          <div className="flex flex-col items-center gap-8 p-12 bg-gray-900/50 rounded-2xl">
            {/* Logo Version */}
            <GlowingBorder>
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-primary-light" />
                <span className="text-3xl font-bold text-primary-light">IQ Auto Deals</span>
              </div>
            </GlowingBorder>

            {/* Button Version */}
            <GlowingBorder>
              <button className="text-lg font-semibold text-white">
                Get Started Today
              </button>
            </GlowingBorder>

            {/* Tag Version */}
            <GlowingBorder className="text-sm">
              <span className="text-accent-light font-medium">New Feature</span>
            </GlowingBorder>
          </div>
        </section>

        {/* Comparison Side by Side */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-2 text-primary-light text-center">Side by Side Comparison</h2>
          <p className="text-gray-400 mb-8 text-center">All three styles together</p>

          <div className="grid md:grid-cols-3 gap-8 p-8 bg-gray-900/50 rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Border Beam</span>
              <BorderBeam>
                <div className="flex items-center gap-2">
                  <Car className="w-6 h-6 text-primary-light" />
                  <span className="text-xl font-bold text-primary-light">IQ Auto Deals</span>
                </div>
              </BorderBeam>
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Full Gradient</span>
              <AnimatedBorder>
                <div className="flex items-center gap-2">
                  <Car className="w-6 h-6 text-primary-light" />
                  <span className="text-xl font-bold text-primary-light">IQ Auto Deals</span>
                </div>
              </AnimatedBorder>
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Glowing</span>
              <GlowingBorder>
                <div className="flex items-center gap-2">
                  <Car className="w-6 h-6 text-primary-light" />
                  <span className="text-xl font-bold text-primary-light">IQ Auto Deals</span>
                </div>
              </GlowingBorder>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <div className="text-center text-gray-400 text-sm">
          <p>Let me know which style you prefer and I&apos;ll add it to the homepage!</p>
        </div>
      </div>
    </div>
  );
}
