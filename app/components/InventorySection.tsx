import Link from 'next/link';
import type { InventoryResult } from '@/lib/inventory';
import InventoryCard from './InventoryCard';

type Props = {
  inventory: InventoryResult;
  filterLabel: string;
  carsHref: string;
};

export default function InventorySection({ inventory, filterLabel, carsHref }: Props) {
  const { cars, totalCount, scope, scopeLabel } = inventory;

  if (cars.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-500">
          No {filterLabel.toLowerCase()} currently listed. Check back soon or{' '}
          <Link href="/cars" className="text-blue-600 hover:underline">browse all inventory</Link>.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {totalCount.toLocaleString()} {filterLabel} Available {scopeLabel}
        </h2>
        {scope !== 'city' && (
          <p className="text-sm text-gray-500 mt-1">
            Showing vehicles {scope === 'state' ? `across ${scopeLabel}` : 'nationwide'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cars.map((car) => (
          <InventoryCard key={car.id} car={car} />
        ))}
      </div>

      {totalCount > cars.length && (
        <div className="text-center mt-8">
          <Link
            href={carsHref}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All {totalCount.toLocaleString()} Vehicles
          </Link>
        </div>
      )}
    </section>
  );
}
