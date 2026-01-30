'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Car } from 'lucide-react';

interface CarPhotoGalleryProps {
  photos: string[];
  carName: string;
  bodyType?: string;
}

// Helper function to get placeholder image based on body type
function getPlaceholderImage(bodyType?: string): string {
  if (bodyType?.toLowerCase().includes('truck') ||
      bodyType?.toLowerCase().includes('cab') ||
      bodyType?.toLowerCase().includes('pickup')) {
    return '/placeholder_IQ_Truck.png';
  }
  return '/placeholder_IQ_Car.png';
}

export default function CarPhotoGallery({ photos, carName, bodyType }: CarPhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextPhoto = () => {
    setSelectedIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-full">
        {/* Main Photo */}
        <div
          className="relative aspect-[16/10] bg-gray-200 cursor-pointer group"
          onClick={() => photos[0] && openLightbox(selectedIndex)}
        >
          <Image
            src={photos[selectedIndex] || getPlaceholderImage(bodyType)}
            alt={`${carName} - Photo ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          {photos[selectedIndex] && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Click to enlarge
              </span>
            </div>
          )}

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto bg-gray-100 w-full max-w-full">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition ${
                  index === selectedIndex
                    ? 'ring-2 ring-primary'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo}
                  alt={`${carName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <div className="relative w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-center p-4 text-white">
              <div className="bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-lg">{carName}</h3>
                <p className="text-sm opacity-90">
                  Photo {selectedIndex + 1} of {photos.length}
                </p>
              </div>
              <button
                onClick={closeLightbox}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Photo Container */}
            <div className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0">
              <div className="relative w-full h-full max-w-6xl">
                <Image
                  src={photos[selectedIndex]}
                  alt={`${carName} - Photo ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="p-4 bg-black/50">
                <div className="flex gap-2 overflow-x-auto justify-center pb-2">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition ${
                        index === selectedIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
