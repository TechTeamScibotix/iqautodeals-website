import Link from 'next/link';
import Image from 'next/image';
import type { SeoCarResult } from '@/lib/seo-inventory';

function getFirstPhoto(photosJson: string): string | null {
  try {
    const arr = JSON.parse(photosJson);
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  } catch { /* ignore */ }
  return null;
}

function formatPrice(price: number) {
  return price > 0 ? `$${price.toLocaleString()}` : 'Call For Price';
}

function getPlaceholder(bodyType: string | null): string {
  const bt = bodyType?.toLowerCase() || '';
  if (bt.includes('truck') || bt.includes('pickup')) return '/placeholder_IQ_Truck.png';
  return '/placeholder_IQ_Car.png';
}

export default function SeoCarGrid({
  cars,
  total,
  filterUrl,
}: {
  cars: SeoCarResult[];
  total: number;
  filterUrl?: string;
}) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No vehicles match this search right now.</p>
        <p className="text-gray-400 mt-2">Check back soon — our inventory updates daily.</p>
        <Link href="/cars" className="inline-block mt-6 btn-pill-primary">
          Browse All Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Showing {cars.length} of {total.toLocaleString()} vehicles
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {cars.map((car) => {
          const photo = getFirstPhoto(car.photos);
          const title = `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`;
          const href = `/cars/${car.slug || car.id}`;

          return (
            <Link
              key={car.id}
              href={href}
              className="bg-white rounded-xl shadow-card border border-border overflow-hidden hover:shadow-card-hover transition-all duration-200"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={photo || getPlaceholder(car.bodyType)}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
                {car.condition && (
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {car.condition.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="p-2 md:p-3">
                <h3 className="font-bold text-xs md:text-sm text-gray-900 line-clamp-2">{title}</h3>
                <p className="text-primary font-bold text-sm md:text-lg mt-0.5">{formatPrice(car.salePrice)}</p>
                <p className="text-gray-500 text-[10px] md:text-xs mt-1">
                  {car.mileage.toLocaleString()} mi &middot; {car.city}, {car.state}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {total > cars.length && (
        <div className="text-center mt-8">
          <Link href={filterUrl || '/cars'} className="btn-pill-primary inline-block">
            View All {total.toLocaleString()} Vehicles
          </Link>
        </div>
      )}
    </div>
  );
}
