'use client';

import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export function Header() {
  return (
    <header className="bg-black shadow-md sticky top-0 z-50 h-20">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full" />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex gap-6 text-sm font-semibold">
            <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors">
              Cars for Sale
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
              Research & Reviews
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
              News & Videos
            </Link>
            <Link href="/guides/car-financing-guide" className="text-gray-300 hover:text-primary transition-colors">
              Financing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-300 hover:text-white border border-gray-600 hover:border-white px-5 py-2.5 rounded-pill transition-colors font-semibold flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-primary text-white px-6 py-2.5 rounded-pill hover:bg-primary-dark transition-colors font-semibold flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
