// Body type configurations for SEO pages
export const bodyTypes = {
  'suv': {
    label: 'SUVs',
    singular: 'SUV',
    slug: 'suv',
    description: 'Sport Utility Vehicles',
  },
  'sedan': {
    label: 'Sedans',
    singular: 'Sedan',
    slug: 'sedan',
    description: 'Four-door passenger cars',
  },
  'truck': {
    label: 'Trucks',
    singular: 'Truck',
    slug: 'truck',
    description: 'Pickup trucks',
  },
  'coupe': {
    label: 'Coupes',
    singular: 'Coupe',
    slug: 'coupe',
    description: 'Two-door sports cars',
  },
  'convertible': {
    label: 'Convertibles',
    singular: 'Convertible',
    slug: 'convertible',
    description: 'Open-top vehicles',
  },
  'minivan': {
    label: 'Minivans',
    singular: 'Minivan',
    slug: 'minivan',
    description: 'Family passenger vans',
  },
  'wagon': {
    label: 'Wagons',
    singular: 'Wagon',
    slug: 'wagon',
    description: 'Station wagons',
  },
  'hatchback': {
    label: 'Hatchbacks',
    singular: 'Hatchback',
    slug: 'hatchback',
    description: 'Compact cars with rear hatch',
  },
  'luxury': {
    label: 'Luxury Cars',
    singular: 'Luxury Car',
    slug: 'luxury',
    description: 'Premium and luxury vehicles',
  },
  'electric': {
    label: 'Electric Vehicles',
    singular: 'Electric Vehicle',
    slug: 'electric',
    description: 'Battery electric vehicles (EVs)',
  },
  'hybrid': {
    label: 'Hybrid Vehicles',
    singular: 'Hybrid',
    slug: 'hybrid',
    description: 'Gas-electric hybrid vehicles',
  },
  'sports-car': {
    label: 'Sports Cars',
    singular: 'Sports Car',
    slug: 'sports-car',
    description: 'High-performance vehicles',
  },
};

export const bodyTypeSlugs = Object.keys(bodyTypes);
export type BodyTypeData = typeof bodyTypes[keyof typeof bodyTypes];
