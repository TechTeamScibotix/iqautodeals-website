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
  features?: string;
  fuelType?: string;
  numberOfDoors?: number;
  mpgCity?: number;
  mpgHighway?: number;
  drivetrain?: string;
  condition?: string;
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
  features,
  fuelType,
  numberOfDoors,
  mpgCity,
  mpgHighway,
  drivetrain,
  condition,
}: VehicleSchemaProps) {
  // Parse features JSON string into array
  let featureList: string[] = [];
  if (features) {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) featureList = parsed;
    } catch {}
  }

  // Map fuelType string to Schema.org value
  const schemaFuelType = (() => {
    if (!fuelType) return undefined;
    const lower = fuelType.toLowerCase();
    if (lower.includes('diesel')) return 'https://schema.org/DieselFuel';
    if (lower.includes('electric')) return 'https://schema.org/ElectricFuel';
    if (lower.includes('hybrid')) return 'https://schema.org/HybridFuel';
    return 'https://schema.org/GasolineFuel';
  })();

  // Map condition to Schema.org itemCondition
  const itemCondition = (() => {
    if (!condition) return undefined;
    const lower = condition.toLowerCase();
    if (lower.includes('new')) return 'https://schema.org/NewCondition';
    return 'https://schema.org/UsedCondition';
  })();

  // Map drivetrain to Schema.org driveWheelConfiguration
  const driveWheelConfiguration = (() => {
    if (!drivetrain) return undefined;
    const lower = drivetrain.toLowerCase();
    if (lower.includes('awd') || lower.includes('all-wheel') || lower.includes('all wheel')) return 'https://schema.org/AllWheelDriveConfiguration';
    if (lower.includes('fwd') || lower.includes('front')) return 'https://schema.org/FrontWheelDriveConfiguration';
    if (lower.includes('rwd') || lower.includes('rear')) return 'https://schema.org/RearWheelDriveConfiguration';
    if (lower.includes('4wd') || lower.includes('4x4') || lower.includes('four')) return 'https://schema.org/FourWheelDriveConfiguration';
    return drivetrain;
  })();

  const schema: Record<string, any> = {
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
    fuelType: schemaFuelType,
    numberOfDoors: numberOfDoors,
    driveWheelConfiguration: driveWheelConfiguration,
    itemCondition: itemCondition,
  };

  // Add fuel efficiency
  if (mpgCity || mpgHighway) {
    schema.fuelEfficiency = [];
    if (mpgCity) {
      schema.fuelEfficiency.push({
        '@type': 'QuantitativeValue',
        name: 'City MPG',
        value: mpgCity,
        unitText: 'MPG',
      });
    }
    if (mpgHighway) {
      schema.fuelEfficiency.push({
        '@type': 'QuantitativeValue',
        name: 'Highway MPG',
        value: mpgHighway,
        unitText: 'MPG',
      });
    }
  }

  // Add features as additionalProperty array
  if (featureList.length > 0) {
    schema.additionalProperty = featureList.map(feature => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature,
    }));
  }

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
