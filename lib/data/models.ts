import { makes } from './makes';

// Vehicle models data for SEO pages
export const models = {
  // Toyota
  'toyota-tacoma': { brand: 'Toyota', model: 'Tacoma', fullName: 'Toyota Tacoma', type: 'truck', slug: 'toyota-tacoma' },
  'toyota-tundra': { brand: 'Toyota', model: 'Tundra', fullName: 'Toyota Tundra', type: 'truck', slug: 'toyota-tundra' },
  'toyota-4runner': { brand: 'Toyota', model: '4Runner', fullName: 'Toyota 4Runner', type: 'suv', slug: 'toyota-4runner' },
  'toyota-camry': { brand: 'Toyota', model: 'Camry', fullName: 'Toyota Camry', type: 'sedan', slug: 'toyota-camry' },
  'toyota-prius': { brand: 'Toyota', model: 'Prius', fullName: 'Toyota Prius', type: 'hybrid', slug: 'toyota-prius' },
  'toyota-rav4': { brand: 'Toyota', model: 'RAV4', fullName: 'Toyota RAV4', type: 'suv', slug: 'toyota-rav4' },
  'toyota-sienna': { brand: 'Toyota', model: 'Sienna', fullName: 'Toyota Sienna', type: 'minivan', slug: 'toyota-sienna' },
  'toyota-sequoia': { brand: 'Toyota', model: 'Sequoia', fullName: 'Toyota Sequoia', type: 'suv', slug: 'toyota-sequoia' },

  // Honda
  'honda-civic': { brand: 'Honda', model: 'Civic', fullName: 'Honda Civic', type: 'sedan', slug: 'honda-civic' },
  'honda-accord': { brand: 'Honda', model: 'Accord', fullName: 'Honda Accord', type: 'sedan', slug: 'honda-accord' },
  'honda-cr-v': { brand: 'Honda', model: 'CR-V', fullName: 'Honda CR-V', type: 'suv', slug: 'honda-cr-v' },
  'honda-pilot': { brand: 'Honda', model: 'Pilot', fullName: 'Honda Pilot', type: 'suv', slug: 'honda-pilot' },
  'honda-passport': { brand: 'Honda', model: 'Passport', fullName: 'Honda Passport', type: 'suv', slug: 'honda-passport' },
  'honda-odyssey': { brand: 'Honda', model: 'Odyssey', fullName: 'Honda Odyssey', type: 'minivan', slug: 'honda-odyssey' },
  'honda-ridgeline': { brand: 'Honda', model: 'Ridgeline', fullName: 'Honda Ridgeline', type: 'truck', slug: 'honda-ridgeline' },

  // Ford
  'ford-f150': { brand: 'Ford', model: 'F-150', fullName: 'Ford F-150', type: 'truck', slug: 'ford-f150' },
  'ford-explorer': { brand: 'Ford', model: 'Explorer', fullName: 'Ford Explorer', type: 'suv', slug: 'ford-explorer' },
  'ford-expedition': { brand: 'Ford', model: 'Expedition', fullName: 'Ford Expedition', type: 'suv', slug: 'ford-expedition' },
  'ford-fusion': { brand: 'Ford', model: 'Fusion', fullName: 'Ford Fusion', type: 'sedan', slug: 'ford-fusion' },
  'ford-raptor': { brand: 'Ford', model: 'Raptor', fullName: 'Ford F-150 Raptor', type: 'truck', slug: 'ford-raptor' },

  // Chevrolet
  'chevy-silverado': { brand: 'Chevrolet', model: 'Silverado', fullName: 'Chevrolet Silverado', type: 'truck', slug: 'chevy-silverado' },
  'chevy-equinox': { brand: 'Chevrolet', model: 'Equinox', fullName: 'Chevrolet Equinox', type: 'suv', slug: 'chevy-equinox' },
  'chevy-tahoe': { brand: 'Chevrolet', model: 'Tahoe', fullName: 'Chevrolet Tahoe', type: 'suv', slug: 'chevy-tahoe' },
  'chevy-suburban': { brand: 'Chevrolet', model: 'Suburban', fullName: 'Chevrolet Suburban', type: 'suv', slug: 'chevy-suburban' },
  'chevy-colorado': { brand: 'Chevrolet', model: 'Colorado', fullName: 'Chevrolet Colorado', type: 'truck', slug: 'chevy-colorado' },
  'chevy-malibu': { brand: 'Chevrolet', model: 'Malibu', fullName: 'Chevrolet Malibu', type: 'sedan', slug: 'chevy-malibu' },
  'chevy-camaro': { brand: 'Chevrolet', model: 'Camaro', fullName: 'Chevrolet Camaro', type: 'sports-car', slug: 'chevy-camaro' },

  // Jeep
  'jeep-wrangler': { brand: 'Jeep', model: 'Wrangler', fullName: 'Jeep Wrangler', type: 'suv', slug: 'jeep-wrangler' },
  'jeep-grand-cherokee': { brand: 'Jeep', model: 'Grand Cherokee', fullName: 'Jeep Grand Cherokee', type: 'suv', slug: 'jeep-grand-cherokee' },
  'jeep-cherokee': { brand: 'Jeep', model: 'Cherokee', fullName: 'Jeep Cherokee', type: 'suv', slug: 'jeep-cherokee' },
  'jeep-gladiator': { brand: 'Jeep', model: 'Gladiator', fullName: 'Jeep Gladiator', type: 'truck', slug: 'jeep-gladiator' },
  'jeep-renegade': { brand: 'Jeep', model: 'Renegade', fullName: 'Jeep Renegade', type: 'suv', slug: 'jeep-renegade' },

  // BMW
  'bmw-x3': { brand: 'BMW', model: 'X3', fullName: 'BMW X3', type: 'luxury', slug: 'bmw-x3' },
  'bmw-x5': { brand: 'BMW', model: 'X5', fullName: 'BMW X5', type: 'luxury', slug: 'bmw-x5' },
  'bmw-3-series': { brand: 'BMW', model: '3 Series', fullName: 'BMW 3 Series', type: 'luxury', slug: 'bmw-3-series' },
  'bmw-m4': { brand: 'BMW', model: 'M4', fullName: 'BMW M4', type: 'sports-car', slug: 'bmw-m4' },

  // Mercedes
  'mercedes-g-wagon': { brand: 'Mercedes-Benz', model: 'G-Class', fullName: 'Mercedes-Benz G-Wagon', type: 'luxury', slug: 'mercedes-g-wagon' },

  // Lexus
  'lexus-rx350': { brand: 'Lexus', model: 'RX 350', fullName: 'Lexus RX 350', type: 'luxury', slug: 'lexus-rx350' },

  // Mazda
  'mazda-cx5': { brand: 'Mazda', model: 'CX-5', fullName: 'Mazda CX-5', type: 'suv', slug: 'mazda-cx5' },
  'mazda-miata': { brand: 'Mazda', model: 'Miata', fullName: 'Mazda MX-5 Miata', type: 'sports-car', slug: 'mazda-miata' },

  // Nissan
  'nissan-pathfinder': { brand: 'Nissan', model: 'Pathfinder', fullName: 'Nissan Pathfinder', type: 'suv', slug: 'nissan-pathfinder' },
  'nissan-altima': { brand: 'Nissan', model: 'Altima', fullName: 'Nissan Altima', type: 'sedan', slug: 'nissan-altima' },

  // Dodge
  'dodge-durango': { brand: 'Dodge', model: 'Durango', fullName: 'Dodge Durango', type: 'suv', slug: 'dodge-durango' },
  'dodge-charger': { brand: 'Dodge', model: 'Charger', fullName: 'Dodge Charger', type: 'sedan', slug: 'dodge-charger' },
  'dodge-challenger': { brand: 'Dodge', model: 'Challenger', fullName: 'Dodge Challenger', type: 'sports-car', slug: 'dodge-challenger' },

  // RAM
  'ram-1500': { brand: 'RAM', model: '1500', fullName: 'RAM 1500', type: 'truck', slug: 'ram-1500' },

  // Subaru
  'subaru-outback': { brand: 'Subaru', model: 'Outback', fullName: 'Subaru Outback', type: 'wagon', slug: 'subaru-outback' },
  'subaru-forester': { brand: 'Subaru', model: 'Forester', fullName: 'Subaru Forester', type: 'suv', slug: 'subaru-forester' },
  'subaru-wrx': { brand: 'Subaru', model: 'WRX', fullName: 'Subaru WRX', type: 'sports-car', slug: 'subaru-wrx' },

  // Kia
  'kia-telluride': { brand: 'Kia', model: 'Telluride', fullName: 'Kia Telluride', type: 'suv', slug: 'kia-telluride' },
  'kia-stinger': { brand: 'Kia', model: 'Stinger', fullName: 'Kia Stinger', type: 'sports-car', slug: 'kia-stinger' },
  'kia-carnival': { brand: 'Kia', model: 'Carnival', fullName: 'Kia Carnival', type: 'minivan', slug: 'kia-carnival' },

  // Hyundai
  'hyundai-sonata': { brand: 'Hyundai', model: 'Sonata', fullName: 'Hyundai Sonata', type: 'sedan', slug: 'hyundai-sonata' },
  'hyundai-tucson': { brand: 'Hyundai', model: 'Tucson', fullName: 'Hyundai Tucson', type: 'suv', slug: 'hyundai-tucson' },
  'hyundai-santa-fe': { brand: 'Hyundai', model: 'Santa Fe', fullName: 'Hyundai Santa Fe', type: 'suv', slug: 'hyundai-santa-fe' },

  // Audi
  'audi-q5': { brand: 'Audi', model: 'Q5', fullName: 'Audi Q5', type: 'luxury', slug: 'audi-q5' },
  'audi-a4': { brand: 'Audi', model: 'A4', fullName: 'Audi A4', type: 'luxury', slug: 'audi-a4' },

  // Volkswagen
  'volkswagen-tiguan': { brand: 'Volkswagen', model: 'Tiguan', fullName: 'Volkswagen Tiguan', type: 'suv', slug: 'volkswagen-tiguan' },
  'volkswagen-atlas': { brand: 'Volkswagen', model: 'Atlas', fullName: 'Volkswagen Atlas', type: 'suv', slug: 'volkswagen-atlas' },

  // GMC
  'gmc-acadia': { brand: 'GMC', model: 'Acadia', fullName: 'GMC Acadia', type: 'suv', slug: 'gmc-acadia' },
  'gmc-sierra': { brand: 'GMC', model: 'Sierra', fullName: 'GMC Sierra', type: 'truck', slug: 'gmc-sierra' },

  // Buick
  'buick-enclave': { brand: 'Buick', model: 'Enclave', fullName: 'Buick Enclave', type: 'suv', slug: 'buick-enclave' },

  // Tesla
  'tesla-model-3': { brand: 'Tesla', model: 'Model 3', fullName: 'Tesla Model 3', type: 'electric', slug: 'tesla-model-3' },
  'tesla-model-y': { brand: 'Tesla', model: 'Model Y', fullName: 'Tesla Model Y', type: 'electric', slug: 'tesla-model-y' },
  'tesla-model-s': { brand: 'Tesla', model: 'Model S', fullName: 'Tesla Model S', type: 'electric', slug: 'tesla-model-s' },
  'tesla-model-x': { brand: 'Tesla', model: 'Model X', fullName: 'Tesla Model X', type: 'electric', slug: 'tesla-model-x' },
  'tesla-cybertruck': { brand: 'Tesla', model: 'Cybertruck', fullName: 'Tesla Cybertruck', type: 'electric', slug: 'tesla-cybertruck' },
};

export const modelSlugs = Object.keys(models);
export type ModelData = typeof models[keyof typeof models];

/**
 * Get all models for a given make slug (e.g. "ford" → all Ford models)
 */
export function getModelsByMake(makeSlug: string): [string, ModelData][] {
  const makeData = makes[makeSlug as keyof typeof makes];
  if (!makeData) return [];

  return Object.entries(models).filter(
    ([, data]) => (data as ModelData).brand.toLowerCase() === makeData.name.toLowerCase()
  ) as [string, ModelData][];
}
