'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, UserPlus, Globe, Menu, X } from 'lucide-react';
import { LogoWithBeam } from '@/components/LogoWithBeam';

interface HeaderProps {
  lang?: 'en' | 'es';
  /** Which nav item is currently active (auto-detected from pathname if not provided) */
  activeItem?: 'new' | 'used' | 'dealers' | 'research' | 'financing';
}

const navItems = {
  en: [
    { key: 'new', label: 'New Vehicles', href: '/cars?condition=new' },
    { key: 'used', label: 'Used Vehicles', href: '/cars?condition=used' },
    { key: 'dealers', label: 'For Dealers', href: '/for-dealers' },
    { key: 'research', label: 'Research & Reviews', href: '/blog' },
    { key: 'financing', label: 'Financing', href: '/guides/car-financing-guide' },
  ],
  es: [
    { key: 'new', label: 'Nuevos', href: '/cars?condition=new&lang=es' },
    { key: 'used', label: 'Usados', href: '/cars?condition=used&lang=es' },
    { key: 'dealers', label: 'Concesionarios', href: '/for-dealers' },
    { key: 'research', label: 'Investigacion', href: '/blog' },
    { key: 'financing', label: 'Financiamiento', href: '/guides/car-financing-guide' },
  ],
};

export function Header({ lang = 'en', activeItem }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ userType?: string } | null>(null);
  const pathname = usePathname();

  const isES = lang === 'es';
  const items = navItems[lang];

  // Detect active nav from pathname
  const detected = activeItem || (() => {
    if (pathname === '/for-dealers' || pathname.startsWith('/for-dealers/')) return 'dealers';
    if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'research';
    if (pathname.startsWith('/guides/')) return 'financing';
    if (pathname.startsWith('/new-cars')) return 'new';
    return undefined;
  })();

  // Check auth from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch {}
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="bg-black sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-3 md:px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center h-full py-1" aria-label="IQ Auto Deals - Home">
              <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 text-sm font-semibold">
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={
                    detected === item.key
                      ? 'text-primary transition-colors py-2'
                      : 'text-white hover:text-primary transition-colors py-2'
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side: lang + auth + hamburger */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language Toggle */}
              <Link
                href={isES ? '/' : '/es'}
                className="text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2"
              >
                <Globe className="w-3 h-3 md:w-4 md:h-4" />
                {isES ? 'EN' : 'ES'}
              </Link>

              {/* Auth Buttons (desktop) */}
              {user ? (
                <Link
                  href={user.userType === 'customer' ? '/customer' : '/dealer'}
                  className="hidden md:flex bg-primary text-white px-4 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold items-center gap-2"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:flex text-white hover:text-primary border border-white hover:border-primary px-3 py-1.5 md:px-5 md:py-2.5 rounded-pill transition-colors text-xs md:text-sm font-semibold items-center gap-1 md:gap-2"
                  >
                    <LogIn className="w-3 h-3 md:w-4 md:h-4" />
                    {isES ? 'Iniciar Sesion' : 'Sign In'}
                  </Link>
                  <Link
                    href="/register"
                    className="hidden md:flex bg-primary text-white px-3 py-1.5 md:px-6 md:py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-xs md:text-sm font-semibold items-center gap-1 md:gap-2"
                  >
                    <UserPlus className="w-3 h-3 md:w-4 md:h-4" />
                    {isES ? 'Registrarse' : 'Sign Up'}
                  </Link>
                </>
              )}

              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-white hover:text-primary transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 w-72 bg-black shadow-2xl flex flex-col animate-slide-in-right">
            {/* Close */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <span className="text-white font-bold text-lg">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-4">
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`block px-6 py-3 text-base font-semibold transition-colors ${
                    detected === item.key
                      ? 'text-primary bg-primary/10'
                      : 'text-white hover:text-primary hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth (mobile) */}
            <div className="border-t border-gray-800 p-4 space-y-3">
              {user ? (
                <Link
                  href={user.userType === 'customer' ? '/customer' : '/dealer'}
                  className="block w-full bg-primary text-white text-center px-6 py-3 rounded-pill hover:bg-primary-dark transition-colors font-semibold"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center text-white border border-white px-6 py-3 rounded-pill hover:border-primary hover:text-primary transition-colors font-semibold"
                  >
                    {isES ? 'Iniciar Sesion' : 'Sign In'}
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center bg-primary text-white px-6 py-3 rounded-pill hover:bg-primary-dark transition-colors font-semibold"
                  >
                    {isES ? 'Registrarse' : 'Sign Up'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
