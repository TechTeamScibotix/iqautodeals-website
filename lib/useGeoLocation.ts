'use client';

import { useState, useEffect } from 'react';

interface GeoLocation {
  zip: string;
  lat: number;
  lng: number;
  label: string; // e.g. "Atlanta, GA"
}

const SESSION_KEY = 'iq_geo_zip';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function useGeoLocation(): GeoLocation | null {
  const [geo, setGeo] = useState<GeoLocation | null>(null);

  useEffect(() => {
    // Check sessionStorage cache first
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try {
        setGeo(JSON.parse(cached));
        return;
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }

    const cookie = getCookie('iq_geo');
    if (!cookie) return;

    // Cookie format: lat|lng|city|state (pipe-delimited)
    const parts = cookie.split('|');
    if (parts.length < 4) return;

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    const city = parts[2];
    const state = parts[3];

    if (isNaN(lat) || isNaN(lng) || !city || !state) return;

    const label = `${city}, ${state}`;

    // Resolve ZIP from lat/lng
    fetch(`/api/geo/zip?lat=${lat}&lng=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.zip) {
          const result: GeoLocation = { zip: data.zip, lat, lng, label };
          setGeo(result);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(result));
        }
      })
      .catch(() => {
        // Silently fail — no geo is fine
      });
  }, []);

  return geo;
}
