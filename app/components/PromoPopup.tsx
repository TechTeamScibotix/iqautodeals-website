'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, MapPin, Tag } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import {
  trackPromoPopupShown,
  trackPromoPopupClicked,
  trackPromoPopupDismissed,
} from '@/lib/analytics';

interface PromoCar {
  id: string;
  slug: string | null;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  salePrice: number;
  photos: string;
  bodyType: string | null;
  dealer: {
    businessName: string;
    city: string;
    state: string;
  };
}

const STORAGE_KEY = 'promo_popup_dismissed_at';
const COOLDOWN_MS = 20 * 1000; // 20 seconds

export default function PromoPopup() {
  const [promoCar, setPromoCar] = useState<PromoCar | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const shownAtRef = useRef<number>(0);

  const promoCarRef = useRef<PromoCar | null>(null);

  const showPopup = (car: PromoCar) => {
    setPromoCar(car);
    promoCarRef.current = car;
    setDismissed(false);
    setTimeout(() => {
      setVisible(true);
      shownAtRef.current = Date.now();
      trackPromoPopupShown({
        carId: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.salePrice,
      });
    }, 4000);
  };

  useEffect(() => {
    let cooldownTimer: NodeJS.Timeout | null = null;

    const fetchAndShow = async () => {
      try {
        const res = await fetch('/api/promo/lowest-lexus');
        const data = await res.json();
        if (!data.car) return;
        showPopup(data.car);
      } catch (error) {
        console.error('Failed to fetch promo car:', error);
      }
    };

    // Check if still in cooldown from a previous dismissal
    const dismissedAt = sessionStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < COOLDOWN_MS) {
        // Wait for remaining cooldown, then show
        cooldownTimer = setTimeout(() => {
          fetchAndShow();
        }, COOLDOWN_MS - elapsed);
        return () => { if (cooldownTimer) clearTimeout(cooldownTimer); };
      }
    }

    // No cooldown active — show immediately
    fetchAndShow();

    return () => { if (cooldownTimer) clearTimeout(cooldownTimer); };
  }, []);

  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString());

    if (promoCar) {
      const timeVisible = Math.round((Date.now() - shownAtRef.current) / 1000);
      trackPromoPopupDismissed({
        carId: promoCar.id,
        timeVisibleSeconds: timeVisible,
      });
    }

    // Remove from DOM after exit animation
    setTimeout(() => {
      setVisible(false);
    }, 500);

    // Schedule re-show after cooldown
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/promo/lowest-lexus');
        const data = await res.json();
        if (data.car) showPopup(data.car);
      } catch (error) {
        console.error('Failed to fetch promo car:', error);
      }
    }, COOLDOWN_MS);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current); };
  }, []);

  const handleClick = () => {
    if (promoCar) {
      trackPromoPopupClicked({
        carId: promoCar.id,
        make: promoCar.make,
        model: promoCar.model,
        year: promoCar.year,
        price: promoCar.salePrice,
      });
    }
  };

  if (!visible || !promoCar) return null;

  let photoUrl = '';
  try {
    const photos = JSON.parse(promoCar.photos || '[]');
    photoUrl = photos[0] || '';
  } catch {
    photoUrl = '';
  }

  const carLink = `/cars/${promoCar.slug || promoCar.id}`;

  return (
    <div>
      {/* Desktop: full card, center-right */}
      <div
        className={`fixed z-[60] hidden md:block ${
          dismissed ? 'animate-slide-out-right' : 'animate-slide-in-right'
        } right-6 top-1/2 -translate-y-1/2 w-80`}
      >
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full shadow-lg border border-border transition-colors"
          aria-label="Dismiss promo"
        >
          <X className="w-3.5 h-3.5 text-text-primary" strokeWidth={2.5} />
        </button>

        <div className="bg-white rounded-xl shadow-card-hover border border-border overflow-hidden">
          <div className="bg-accent text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            LOWEST PRICE LEXUS
          </div>

          <div className="relative h-40 bg-light-dark">
            <Image
              src={photoUrl || '/placeholder_IQ_Car.png'}
              alt={`${promoCar.year} ${promoCar.make} ${promoCar.model}`}
              fill
              className="object-cover"
              sizes="320px"
            />
            <div className="absolute top-2 left-2 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-pill shadow-md">
              NEW
            </div>
          </div>

          <div className="p-4">
            <h4 className="font-bold text-base text-text-primary line-clamp-1">
              {promoCar.year} {promoCar.make} {promoCar.model}
              {promoCar.trim ? ` ${promoCar.trim}` : ''}
            </h4>
            <p className="text-xl font-bold text-primary mt-1">
              {formatPrice(promoCar.salePrice)}
            </p>
            <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {promoCar.dealer.city}, {promoCar.dealer.state}
            </p>
            <Link
              href={carLink}
              onClick={handleClick}
              className="mt-3 block w-full bg-primary text-white text-center py-2.5 rounded-pill font-semibold hover:bg-primary-dark transition-colors text-sm"
            >
              View This Deal
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: compact horizontal card at bottom */}
      <div
        className={`fixed z-[60] md:hidden ${
          dismissed ? 'animate-slide-out-right' : 'animate-slide-in-right'
        } bottom-16 left-2 right-2`}
      >
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-1 z-10 w-5 h-5 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full shadow-lg border border-border transition-colors"
          aria-label="Dismiss promo"
        >
          <X className="w-3 h-3 text-text-primary" strokeWidth={2.5} />
        </button>

        <div className="bg-white rounded-lg shadow-card-hover border border-border overflow-hidden">
          {/* Compact teal bar */}
          <div className="bg-accent text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            LOWEST PRICE LEXUS
          </div>

          <Link href={carLink} onClick={handleClick} className="flex">
            {/* Thumbnail */}
            <div className="relative w-28 flex-shrink-0 bg-light-dark">
              <Image
                src={photoUrl || '/placeholder_IQ_Car.png'}
                alt={`${promoCar.year} ${promoCar.make} ${promoCar.model}`}
                fill
                className="object-cover"
                sizes="112px"
              />
              <div className="absolute top-1 left-1 bg-success text-white text-[8px] font-bold px-1.5 py-0.5 rounded-pill">
                NEW
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 p-2 min-w-0">
              <h4 className="font-bold text-xs text-text-primary line-clamp-1">
                {promoCar.year} {promoCar.make} {promoCar.model}
                {promoCar.trim ? ` ${promoCar.trim}` : ''}
              </h4>
              <p className="text-sm font-bold text-primary">
                {formatPrice(promoCar.salePrice)}
              </p>
              <p className="text-[10px] text-text-secondary flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />
                {promoCar.dealer.city}, {promoCar.dealer.state}
              </p>
              <span className="mt-1 inline-block bg-primary text-white text-[10px] text-center py-1 px-3 rounded-pill font-semibold">
                View This Deal
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
