import Script from 'next/script';

interface VehicleSchemaProps {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  color?: string;
  price: number;
  description?: string;
  imageUrl?: string;
  vin?: string;
  dealerName?: string;
  city?: string;
  state?: string;
}

export default function VehicleSchema({
  make,
  model,
  year,
  mileage,
  color,
  price,
  description,
  imageUrl,
  vin,
  dealerName,
  city,
  state,
}: VehicleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${year} ${make} ${model}`,
    brand: {
      '@type': 'Brand',
      name: make,
    },
    model: model,
    productionDate: year.toString(),
    vehicleModelDate: year.toString(),
    mileageFromOdometer: mileage ? {
      '@type': 'QuantitativeValue',
      value: mileage,
      unitCode: 'SMI',
    } : undefined,
    color: color,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: dealerName ? {
        '@type': 'AutoDealer',
        name: dealerName,
        address: city && state ? {
          '@type': 'PostalAddress',
          addressLocality: city,
          addressRegion: state,
          addressCountry: 'US',
        } : undefined,
      } : undefined,
    },
    image: imageUrl,
    description: description || `${year} ${make} ${model} - Low mileage, excellent condition. Get competitive dealer offers now.`,
    vehicleIdentificationNumber: vin,
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <Script
      id={`vehicle-schema-${year}-${make}-${model}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}
