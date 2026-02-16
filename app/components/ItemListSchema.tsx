import type { InventoryCar } from '@/lib/inventory';

function getFirstPhoto(photosJson: string): string | null {
  try {
    const arr = JSON.parse(photosJson);
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  } catch {}
  return null;
}

export default function ItemListSchema({ cars, listName }: { cars: InventoryCar[]; listName: string }) {
  if (cars.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: cars.length,
    itemListElement: cars.map((car, i) => {
      const photo = getFirstPhoto(car.photos);
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Car',
          name: `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`,
          brand: { '@type': 'Brand', name: car.make },
          model: car.model,
          vehicleModelDate: String(car.year),
          mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: car.mileage,
            unitCode: 'SMI',
          },
          offers: {
            '@type': 'Offer',
            price: car.salePrice,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `https://iqautodeals.com/cars/${car.slug || car.id}`,
          },
          ...(photo ? { image: photo } : {}),
          url: `https://iqautodeals.com/cars/${car.slug || car.id}`,
        },
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
