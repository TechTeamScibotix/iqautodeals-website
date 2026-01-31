'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import CheckAvailabilityModal from './CheckAvailabilityModal';

interface CarInfo {
  id: string;
  make: string;
  model: string;
  year: number;
  salePrice: number;
  dealerId: string;
  dealer: {
    businessName: string;
  };
}

interface CheckAvailabilityButtonProps {
  car: CarInfo;
}

export default function CheckAvailabilityButton({ car }: CheckAvailabilityButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        // Invalid JSON
      }
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-primary text-white px-6 py-4 rounded-pill font-bold text-lg hover:bg-primary-dark transition flex items-center justify-center gap-2"
      >
        <Phone className="w-5 h-5" />
        Check Availability
      </button>

      {showModal && (
        <CheckAvailabilityModal
          car={car}
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
