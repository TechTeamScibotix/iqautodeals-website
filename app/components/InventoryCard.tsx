import Link from 'next/link';
import Image from 'next/image';
import type { InventoryCar } from '@/lib/inventory';

function getFirstPhoto(photosJson: string): string | null {
  try {
    const arr = JSON.parse(photosJson);
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  } catch {}
  return null;
}

function formatPrice(price: number) {
  return price > 0 ? `$${price.toLocaleString()}` : 'Call For Price';
}

export default function InventoryCard({ car }: { car: InventoryCar }) {
  const photo = getFirstPhoto(car.photos);
  const title = `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`;
  const href = `/cars/${car.slug || car.id}`;

  return (
    <Link
      href={href}
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 hover:shadow-md transition"
    >
      <div className="relative w-full h-40 bg-gray-100">
        {photo ? (
          <Image
            src={photo}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Photo
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm truncate">{title}</p>
        <p className="text-blue-600 font-bold text-sm">{formatPrice(car.salePrice)}</p>
        <p className="text-gray-500 text-xs mt-1">
          {car.mileage.toLocaleString()} mi &middot; {car.city}, {car.state}
        </p>
      </div>
    </Link>
  );
}
