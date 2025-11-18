// Body type configurations for SEO pages
export const bodyTypes = {
  'suv': {
    label: 'SUVs',
    singular: 'SUV',
    slug: 'suv',
    description: 'Sport Utility Vehicles',
    icon: '🚙',
  },
  'sedan': {
    label: 'Sedans',
    singular: 'Sedan',
    slug: 'sedan',
    description: 'Four-door passenger cars',
    icon: '🚗',
  },
  'truck': {
    label: 'Trucks',
    singular: 'Truck',
    slug: 'truck',
    description: 'Pickup trucks',
    icon: '🚚',
  },
  'coupe': {
    label: 'Coupes',
    singular: 'Coupe',
    slug: 'coupe',
    description: 'Two-door sports cars',
    icon: '🏎️',
  },
  'convertible': {
    label: 'Convertibles',
    singular: 'Convertible',
    slug: 'convertible',
    description: 'Open-top vehicles',
    icon: '🚗',
  },
  'minivan': {
    label: 'Minivans',
    singular: 'Minivan',
    slug: 'minivan',
    description: 'Family passenger vans',
    icon: '🚐',
  },
  'wagon': {
    label: 'Wagons',
    singular: 'Wagon',
    slug: 'wagon',
    description: 'Station wagons',
    icon: '🚙',
  },
  'hatchback': {
    label: 'Hatchbacks',
    singular: 'Hatchback',
    slug: 'hatchback',
    description: 'Compact cars with rear hatch',
    icon: '🚗',
  },
  'luxury': {
    label: 'Luxury Cars',
    singular: 'Luxury Car',
    slug: 'luxury',
    description: 'Premium and luxury vehicles',
    icon: '💎',
  },
  'electric': {
    label: 'Electric Vehicles',
    singular: 'Electric Vehicle',
    slug: 'electric',
    description: 'Battery electric vehicles (EVs)',
    icon: '⚡',
  },
  'hybrid': {
    label: 'Hybrid Vehicles',
    singular: 'Hybrid',
    slug: 'hybrid',
    description: 'Gas-electric hybrid vehicles',
    icon: '🔋',
  },
  'sports-car': {
    label: 'Sports Cars',
    singular: 'Sports Car',
    slug: 'sports-car',
    description: 'High-performance vehicles',
    icon: '🏁',
  },
};

export const bodyTypeSlugs = Object.keys(bodyTypes);
export type BodyTypeData = typeof bodyTypes[keyof typeof bodyTypes];
