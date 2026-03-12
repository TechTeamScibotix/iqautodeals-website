// SEO landing page configurations
// Only pages explicitly listed here will be indexed.
// Expand based on GSC data — start with the strongest ~35 pages.

export type SeoPageConfig = {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  prismaWhere: Record<string, unknown>;
  relatedSlugs: string[];
  breadcrumbLabel: string;
  category: 'body-type' | 'price' | 'make' | 'feature' | 'combo';
  /** URL to /cars with pre-applied filters matching this page */
  carsFilterUrl: string;
  /** Props passed to CarsClient to pre-apply filters */
  clientProps: {
    initialBodyType?: string;
    initialMake?: string;
    initialMinPrice?: number;
    initialMaxPrice?: number;
    initialCondition?: string;
  };
};

// Helper: body type where clause that also matches "pickup" for trucks, "crossover" for SUVs
function bodyTypeWhere(type: string): Record<string, unknown> {
  if (type === 'truck') {
    return {
      OR: [
        { bodyType: { contains: 'truck', mode: 'insensitive' } },
        { bodyType: { contains: 'pickup', mode: 'insensitive' } },
      ],
    };
  }
  if (type === 'suv') {
    return {
      OR: [
        { bodyType: { contains: 'suv', mode: 'insensitive' } },
        { bodyType: { contains: 'crossover', mode: 'insensitive' } },
      ],
    };
  }
  return { bodyType: { contains: type, mode: 'insensitive' } };
}

const seoPages: SeoPageConfig[] = [
  // ─── Body Type Pages ───────────────────────────────────────
  {
    slug: 'used-suvs',
    title: 'Used SUVs for Sale',
    h1: 'Used SUVs for Sale Nationwide',
    metaDescription: 'Browse used SUVs for sale from certified dealers across the US. Compare prices on compact, midsize, and full-size SUVs. Get competing offers from local dealers.',
    intro: 'Find the right used SUV for your needs. Whether you need a compact crossover for daily commuting or a full-size SUV for the whole family, IQ Auto Deals connects you with certified dealers who compete to offer you the best price.',
    prismaWhere: bodyTypeWhere('suv'),
    relatedSlugs: ['used-trucks', 'used-sedans', 'awd-cars', '3rd-row-suv', 'cars-under-30000'],
    breadcrumbLabel: 'Used SUVs',
    category: 'body-type',
    carsFilterUrl: '/cars?bodyType=suv',
    clientProps: { initialBodyType: 'suv' },
  },
  {
    slug: 'used-trucks',
    title: 'Used Trucks for Sale',
    h1: 'Used Trucks for Sale Nationwide',
    metaDescription: 'Shop used pickup trucks for sale from trusted dealers. Compare prices on half-ton, mid-size, and heavy-duty trucks. Find your next truck today.',
    intro: 'Looking for a reliable used truck? Browse pickup trucks from certified dealers across the country. From mid-size workhorses to full-size haulers, compare prices and get competing offers without the hassle.',
    prismaWhere: bodyTypeWhere('truck'),
    relatedSlugs: ['used-suvs', 'diesel-trucks', 'cars-under-30000', 'used-ford', 'used-toyota'],
    breadcrumbLabel: 'Used Trucks',
    category: 'body-type',
    carsFilterUrl: '/cars?bodyType=truck',
    clientProps: { initialBodyType: 'truck' },
  },
  {
    slug: 'used-sedans',
    title: 'Used Sedans for Sale',
    h1: 'Used Sedans for Sale Nationwide',
    metaDescription: 'Find quality used sedans for sale from certified dealers. Compare prices on compact, midsize, and full-size sedans. Reliable daily drivers at great prices.',
    intro: 'Find a dependable used sedan at a great price. From fuel-efficient compacts to spacious full-size models, browse listings from certified dealers and let them compete for your business.',
    prismaWhere: bodyTypeWhere('sedan'),
    relatedSlugs: ['used-suvs', 'hybrid-cars', 'cars-under-15000', 'cars-under-20000', 'used-honda'],
    breadcrumbLabel: 'Used Sedans',
    category: 'body-type',
    carsFilterUrl: '/cars?bodyType=sedan',
    clientProps: { initialBodyType: 'sedan' },
  },

  // ─── Price Pages ───────────────────────────────────────────
  {
    slug: 'cars-under-10000',
    title: 'Cars Under $10,000',
    h1: 'Cars for Sale Under $10,000',
    metaDescription: 'Find reliable used cars under $10,000 from certified dealers. Budget-friendly vehicles with transparent pricing. Compare deals and save.',
    intro: 'You don\'t have to break the bank to find a solid car. Browse used vehicles under $10,000 from verified dealers, and let them compete to get you the best price.',
    prismaWhere: { salePrice: { lte: 10000, gt: 0 } },
    relatedSlugs: ['cars-under-15000', 'cars-under-20000', 'used-sedans', 'low-mileage-cars'],
    breadcrumbLabel: 'Under $10,000',
    category: 'price',
    carsFilterUrl: '/cars?maxPrice=10000',
    clientProps: { initialMaxPrice: 10000 },
  },
  {
    slug: 'cars-under-15000',
    title: 'Cars Under $15,000',
    h1: 'Cars for Sale Under $15,000',
    metaDescription: 'Shop used cars under $15,000 from trusted dealers nationwide. Great selection of sedans, SUVs, and more at affordable prices.',
    intro: 'Get more car for your money. Browse quality used vehicles under $15,000 from certified dealers who compete to offer you the best deal.',
    prismaWhere: { salePrice: { lte: 15000, gt: 0 } },
    relatedSlugs: ['cars-under-10000', 'cars-under-20000', 'used-sedans', 'used-suvs'],
    breadcrumbLabel: 'Under $15,000',
    category: 'price',
    carsFilterUrl: '/cars?maxPrice=15000',
    clientProps: { initialMaxPrice: 15000 },
  },
  {
    slug: 'cars-under-20000',
    title: 'Cars Under $20,000',
    h1: 'Cars for Sale Under $20,000',
    metaDescription: 'Browse used cars under $20,000 from certified dealers. Wide selection of reliable vehicles including SUVs, trucks, and sedans.',
    intro: 'Under $20,000 opens up a huge selection of quality used vehicles. Browse SUVs, trucks, sedans, and more from certified dealers who compete for your business.',
    prismaWhere: { salePrice: { lte: 20000, gt: 0 } },
    relatedSlugs: ['cars-under-15000', 'cars-under-30000', 'used-suvs', 'used-trucks'],
    breadcrumbLabel: 'Under $20,000',
    category: 'price',
    carsFilterUrl: '/cars?maxPrice=20000',
    clientProps: { initialMaxPrice: 20000 },
  },
  {
    slug: 'cars-under-25000',
    title: 'Cars Under $25,000',
    h1: 'Cars for Sale Under $25,000',
    metaDescription: 'Find quality used cars under $25,000. Great selection of SUVs, trucks, sedans, and luxury vehicles from certified dealers.',
    intro: 'With a budget of $25,000, you have access to a wide range of well-equipped vehicles. Compare options from certified dealers and get competing offers.',
    prismaWhere: { salePrice: { lte: 25000, gt: 0 } },
    relatedSlugs: ['cars-under-20000', 'cars-under-30000', 'used-suvs', 'used-trucks'],
    breadcrumbLabel: 'Under $25,000',
    category: 'price',
    carsFilterUrl: '/cars?maxPrice=25000',
    clientProps: { initialMaxPrice: 25000 },
  },
  {
    slug: 'cars-under-30000',
    title: 'Cars Under $30,000',
    h1: 'Cars for Sale Under $30,000',
    metaDescription: 'Shop used cars under $30,000 from trusted dealers. Premium selection including luxury, SUVs, trucks, and more.',
    intro: 'At this price point, you can find low-mileage SUVs, well-equipped trucks, and even some luxury models. Browse certified dealer inventory and let them compete for your purchase.',
    prismaWhere: { salePrice: { lte: 30000, gt: 0 } },
    relatedSlugs: ['cars-under-25000', 'cars-under-20000', 'used-trucks', 'used-suvs'],
    breadcrumbLabel: 'Under $30,000',
    category: 'price',
    carsFilterUrl: '/cars?maxPrice=30000',
    clientProps: { initialMaxPrice: 30000 },
  },

  // ─── Make Pages ────────────────────────────────────────────
  {
    slug: 'used-toyota',
    title: 'Used Toyota for Sale',
    h1: 'Used Toyota Vehicles for Sale',
    metaDescription: 'Browse used Toyota vehicles for sale from certified dealers. Find Camry, RAV4, Tacoma, 4Runner, Tundra, and more at competitive prices.',
    intro: 'Toyota is known for reliability and value. Browse used Toyota vehicles from certified dealers and get competing offers on Camrys, RAV4s, Tacomas, 4Runners, and more.',
    prismaWhere: { make: { equals: 'Toyota', mode: 'insensitive' } },
    relatedSlugs: ['used-honda', 'used-ford', 'used-suvs', 'used-trucks', 'hybrid-cars'],
    breadcrumbLabel: 'Used Toyota',
    category: 'make',
    carsFilterUrl: '/cars?make=Toyota',
    clientProps: { initialMake: 'Toyota' },
  },
  {
    slug: 'used-honda',
    title: 'Used Honda for Sale',
    h1: 'Used Honda Vehicles for Sale',
    metaDescription: 'Find used Honda vehicles for sale from trusted dealers. Shop Civic, Accord, CR-V, Pilot, and more. Compare prices nationwide.',
    intro: 'Honda vehicles are built to last. Find used Civics, Accords, CR-Vs, Pilots, and more from certified dealers who compete to offer you the best price.',
    prismaWhere: { make: { equals: 'Honda', mode: 'insensitive' } },
    relatedSlugs: ['used-toyota', 'used-ford', 'used-sedans', 'used-suvs', 'cars-under-20000'],
    breadcrumbLabel: 'Used Honda',
    category: 'make',
    carsFilterUrl: '/cars?make=Honda',
    clientProps: { initialMake: 'Honda' },
  },
  {
    slug: 'used-ford',
    title: 'Used Ford for Sale',
    h1: 'Used Ford Vehicles for Sale',
    metaDescription: 'Shop used Ford vehicles from certified dealers. Find F-150, Explorer, Mustang, Expedition, and more at great prices.',
    intro: 'From the iconic F-150 to the versatile Explorer, Ford has something for everyone. Browse used Ford vehicles from certified dealers and compare competing offers.',
    prismaWhere: { make: { equals: 'Ford', mode: 'insensitive' } },
    relatedSlugs: ['used-toyota', 'used-honda', 'used-trucks', 'used-suvs', 'cars-under-30000'],
    breadcrumbLabel: 'Used Ford',
    category: 'make',
    carsFilterUrl: '/cars?make=Ford',
    clientProps: { initialMake: 'Ford' },
  },
  {
    slug: 'used-chevrolet',
    title: 'Used Chevrolet for Sale',
    h1: 'Used Chevrolet Vehicles for Sale',
    metaDescription: 'Browse used Chevrolet vehicles for sale. Find Silverado, Tahoe, Equinox, Camaro, and more from trusted dealers nationwide.',
    intro: 'Chevrolet offers a full lineup of trucks, SUVs, and cars. Browse used Chevy vehicles from certified dealers and get competing offers.',
    prismaWhere: { make: { equals: 'Chevrolet', mode: 'insensitive' } },
    relatedSlugs: ['used-ford', 'used-toyota', 'used-trucks', 'used-suvs'],
    breadcrumbLabel: 'Used Chevrolet',
    category: 'make',
    carsFilterUrl: '/cars?make=Chevrolet',
    clientProps: { initialMake: 'Chevrolet' },
  },
  {
    slug: 'used-jeep',
    title: 'Used Jeep for Sale',
    h1: 'Used Jeep Vehicles for Sale',
    metaDescription: 'Find used Jeep vehicles for sale from certified dealers. Wrangler, Grand Cherokee, Cherokee, Gladiator, and more.',
    intro: 'Built for adventure. Browse used Jeep Wranglers, Grand Cherokees, Gladiators, and more from certified dealers who compete for your business.',
    prismaWhere: { make: { equals: 'Jeep', mode: 'insensitive' } },
    relatedSlugs: ['used-suvs', 'awd-cars', 'used-ford', 'used-toyota', 'used-trucks'],
    breadcrumbLabel: 'Used Jeep',
    category: 'make',
    carsFilterUrl: '/cars?make=Jeep',
    clientProps: { initialMake: 'Jeep' },
  },
  {
    slug: 'used-bmw',
    title: 'Used BMW for Sale',
    h1: 'Used BMW Vehicles for Sale',
    metaDescription: 'Shop used BMW vehicles from trusted dealers. Find 3 Series, X3, X5, M4, and more luxury vehicles at competitive prices.',
    intro: 'Experience the ultimate driving machine for less. Browse used BMW sedans, SUVs, and performance vehicles from certified dealers.',
    prismaWhere: { make: { equals: 'BMW', mode: 'insensitive' } },
    relatedSlugs: ['used-lexus', 'used-suvs', 'awd-cars', 'cars-under-30000'],
    breadcrumbLabel: 'Used BMW',
    category: 'make',
    carsFilterUrl: '/cars?make=BMW',
    clientProps: { initialMake: 'BMW' },
  },
  {
    slug: 'used-lexus',
    title: 'Used Lexus for Sale',
    h1: 'Used Lexus Vehicles for Sale',
    metaDescription: 'Find used Lexus vehicles for sale. Browse RX, ES, IS, NX, and more luxury vehicles from certified dealers nationwide.',
    intro: 'Lexus combines luxury with legendary Toyota reliability. Browse used Lexus models from certified dealers and get competing offers.',
    prismaWhere: { make: { equals: 'Lexus', mode: 'insensitive' } },
    relatedSlugs: ['used-bmw', 'used-toyota', 'used-suvs', 'cars-under-30000'],
    breadcrumbLabel: 'Used Lexus',
    category: 'make',
    carsFilterUrl: '/cars?make=Lexus',
    clientProps: { initialMake: 'Lexus' },
  },
  {
    slug: 'used-nissan',
    title: 'Used Nissan for Sale',
    h1: 'Used Nissan Vehicles for Sale',
    metaDescription: 'Browse used Nissan vehicles for sale from certified dealers. Find Altima, Rogue, Pathfinder, Frontier, and more.',
    intro: 'Nissan offers versatile and affordable vehicles for every lifestyle. Browse used Nissan models from certified dealers and compare prices.',
    prismaWhere: { make: { equals: 'Nissan', mode: 'insensitive' } },
    relatedSlugs: ['used-toyota', 'used-honda', 'used-suvs', 'cars-under-20000'],
    breadcrumbLabel: 'Used Nissan',
    category: 'make',
    carsFilterUrl: '/cars?make=Nissan',
    clientProps: { initialMake: 'Nissan' },
  },
  {
    slug: 'used-hyundai',
    title: 'Used Hyundai for Sale',
    h1: 'Used Hyundai Vehicles for Sale',
    metaDescription: 'Shop used Hyundai vehicles from trusted dealers. Find Tucson, Santa Fe, Sonata, Kona, and more at great prices.',
    intro: 'Hyundai delivers great value with strong warranties and modern features. Browse used Hyundai models from certified dealers.',
    prismaWhere: { make: { equals: 'Hyundai', mode: 'insensitive' } },
    relatedSlugs: ['used-toyota', 'used-honda', 'used-suvs', 'cars-under-20000'],
    breadcrumbLabel: 'Used Hyundai',
    category: 'make',
    carsFilterUrl: '/cars?make=Hyundai',
    clientProps: { initialMake: 'Hyundai' },
  },

  // ─── Feature Pages ─────────────────────────────────────────
  {
    slug: 'hybrid-cars',
    title: 'Hybrid Cars for Sale',
    h1: 'Hybrid Cars for Sale Nationwide',
    metaDescription: 'Browse hybrid vehicles for sale from certified dealers. Save on fuel with gas-electric hybrids from Toyota, Honda, Lexus, and more.',
    intro: 'Save at the pump without going fully electric. Browse hybrid vehicles from certified dealers — from the Toyota Prius to the Lexus RX Hybrid, find the right fuel-efficient car for your commute.',
    prismaWhere: { fuelType: { equals: 'Hybrid', mode: 'insensitive' } },
    relatedSlugs: ['electric-cars', 'used-toyota', 'used-sedans', 'cars-under-25000'],
    breadcrumbLabel: 'Hybrid Cars',
    category: 'feature',
    carsFilterUrl: '/cars?fuelType=Hybrid',
    clientProps: {},
  },
  {
    slug: 'electric-cars',
    title: 'Electric Cars for Sale',
    h1: 'Electric Cars for Sale Nationwide',
    metaDescription: 'Find electric vehicles (EVs) for sale from certified dealers. Browse Tesla, BMW, Hyundai, and more EVs with zero emissions.',
    intro: 'Go electric. Browse battery-electric vehicles from certified dealers — from affordable commuters to luxury performance EVs. Compare prices and get competing offers.',
    prismaWhere: { fuelType: { equals: 'Electric', mode: 'insensitive' } },
    relatedSlugs: ['hybrid-cars', 'used-suvs', 'used-bmw', 'used-hyundai'],
    breadcrumbLabel: 'Electric Cars',
    category: 'feature',
    carsFilterUrl: '/cars?fuelType=Electric',
    clientProps: {},
  },
  {
    slug: 'awd-cars',
    title: 'AWD Cars for Sale',
    h1: 'All-Wheel Drive Vehicles for Sale',
    metaDescription: 'Browse AWD vehicles for sale from certified dealers. Find all-wheel drive SUVs, sedans, and trucks for all-weather confidence.',
    intro: 'All-wheel drive gives you confidence in any weather. Browse AWD-equipped SUVs, sedans, and trucks from certified dealers who compete for your business.',
    prismaWhere: {
      OR: [
        { drivetrain: { equals: 'AWD', mode: 'insensitive' } },
        { drivetrain: { equals: '4WD', mode: 'insensitive' } },
      ],
    },
    relatedSlugs: ['used-suvs', 'used-trucks', 'used-jeep', 'used-toyota'],
    breadcrumbLabel: 'AWD Vehicles',
    category: 'feature',
    carsFilterUrl: '/cars?q=AWD',
    clientProps: {},
  },
  {
    slug: '3rd-row-suv',
    title: '3rd Row SUVs for Sale',
    h1: 'Third Row SUVs for Sale',
    metaDescription: 'Find 3rd row SUVs for sale from certified dealers. Browse 7-passenger and 8-passenger SUVs perfect for families.',
    intro: 'Need seating for the whole crew? Browse 3rd-row SUVs that seat 7 or 8 passengers. From the Toyota Highlander to the Chevrolet Tahoe, find the right family hauler from certified dealers.',
    prismaWhere: {
      AND: [
        {
          OR: [
            { bodyType: { contains: 'suv', mode: 'insensitive' } },
            { bodyType: { contains: 'crossover', mode: 'insensitive' } },
          ],
        },
        {
          OR: [
            { features: { contains: '3rd Row', mode: 'insensitive' } },
            { features: { contains: 'Third Row', mode: 'insensitive' } },
            { features: { contains: '3rd-Row', mode: 'insensitive' } },
            { features: { contains: '7-Passenger', mode: 'insensitive' } },
            { features: { contains: '8-Passenger', mode: 'insensitive' } },
            { features: { contains: 'Seven Passenger', mode: 'insensitive' } },
            { features: { contains: 'Eight Passenger', mode: 'insensitive' } },
            { doors: { gte: 4 }, model: { in: ['Tahoe', 'Suburban', 'Expedition', 'Highlander', 'Pilot', 'Pathfinder', 'Telluride', 'Palisade', 'Atlas', 'Ascent', 'Traverse', 'Explorer', 'Durango', 'Sequoia', 'Armada', 'MDX', 'CX-9', 'Grand Cherokee L', 'Wagoneer'] } },
          ],
        },
      ],
    },
    relatedSlugs: ['used-suvs', 'used-toyota', 'used-chevrolet', 'cars-under-30000'],
    breadcrumbLabel: '3rd Row SUVs',
    category: 'feature',
    carsFilterUrl: '/cars?bodyType=suv&q=3rd+row',
    clientProps: { initialBodyType: 'suv' },
  },
  {
    slug: 'low-mileage-cars',
    title: 'Low Mileage Cars for Sale',
    h1: 'Low Mileage Used Cars for Sale',
    metaDescription: 'Find low mileage used cars under 30,000 miles from certified dealers. Near-new condition at used car prices.',
    intro: 'Get near-new quality at used car prices. Browse vehicles with under 30,000 miles from certified dealers and get competing offers.',
    prismaWhere: { mileage: { lte: 30000 } },
    relatedSlugs: ['cars-under-25000', 'cars-under-30000', 'used-suvs', 'used-sedans'],
    breadcrumbLabel: 'Low Mileage',
    category: 'feature',
    carsFilterUrl: '/cars',
    clientProps: {},
  },
  {
    slug: 'diesel-trucks',
    title: 'Diesel Trucks for Sale',
    h1: 'Diesel Trucks for Sale Nationwide',
    metaDescription: 'Browse diesel pickup trucks for sale from certified dealers. Heavy-duty and mid-size diesel trucks for towing and hauling.',
    intro: 'Diesel trucks deliver the torque and towing capacity you need. Browse diesel pickups from certified dealers — from heavy-duty to mid-size — and compare competing offers.',
    prismaWhere: {
      AND: [
        {
          OR: [
            { bodyType: { contains: 'truck', mode: 'insensitive' } },
            { bodyType: { contains: 'pickup', mode: 'insensitive' } },
          ],
        },
        { fuelType: { equals: 'Diesel', mode: 'insensitive' } },
      ],
    },
    relatedSlugs: ['used-trucks', 'used-ford', 'used-chevrolet', 'cars-under-30000'],
    breadcrumbLabel: 'Diesel Trucks',
    category: 'feature',
    carsFilterUrl: '/cars?bodyType=truck&fuelType=Diesel',
    clientProps: { initialBodyType: 'truck' },
  },

  // ─── Combo Pages (only high-inventory combos) ──────────────
  {
    slug: 'used-toyota-suv',
    title: 'Used Toyota SUVs for Sale',
    h1: 'Used Toyota SUVs for Sale',
    metaDescription: 'Find used Toyota SUVs including RAV4, 4Runner, Highlander, and Sequoia from certified dealers. Compare prices nationwide.',
    intro: 'Toyota SUVs combine reliability with capability. Browse used RAV4s, 4Runners, Highlanders, and more from certified dealers who compete for your business.',
    prismaWhere: {
      make: { equals: 'Toyota', mode: 'insensitive' },
      OR: [
        { bodyType: { contains: 'suv', mode: 'insensitive' } },
        { bodyType: { contains: 'crossover', mode: 'insensitive' } },
      ],
    },
    relatedSlugs: ['used-toyota', 'used-suvs', 'used-honda-suv', '3rd-row-suv'],
    breadcrumbLabel: 'Toyota SUVs',
    category: 'combo',
    carsFilterUrl: '/cars?make=Toyota&bodyType=suv',
    clientProps: { initialMake: 'Toyota', initialBodyType: 'suv' },
  },
  {
    slug: 'used-honda-suv',
    title: 'Used Honda SUVs for Sale',
    h1: 'Used Honda SUVs for Sale',
    metaDescription: 'Shop used Honda SUVs including CR-V, Pilot, Passport, and HR-V from certified dealers. Great prices nationwide.',
    intro: 'Honda SUVs deliver practicality and reliability. Browse used CR-Vs, Pilots, Passports, and more from certified dealers.',
    prismaWhere: {
      make: { equals: 'Honda', mode: 'insensitive' },
      OR: [
        { bodyType: { contains: 'suv', mode: 'insensitive' } },
        { bodyType: { contains: 'crossover', mode: 'insensitive' } },
      ],
    },
    relatedSlugs: ['used-honda', 'used-suvs', 'used-toyota-suv', '3rd-row-suv'],
    breadcrumbLabel: 'Honda SUVs',
    category: 'combo',
    carsFilterUrl: '/cars?make=Honda&bodyType=suv',
    clientProps: { initialMake: 'Honda', initialBodyType: 'suv' },
  },
  {
    slug: 'used-ford-truck',
    title: 'Used Ford Trucks for Sale',
    h1: 'Used Ford Trucks for Sale',
    metaDescription: 'Find used Ford trucks including F-150, F-250, F-350, and Ranger from certified dealers. Compare prices nationwide.',
    intro: 'The Ford F-Series has been America\'s best-selling truck for decades. Browse used Ford trucks from certified dealers and get competing offers.',
    prismaWhere: {
      make: { equals: 'Ford', mode: 'insensitive' },
      OR: [
        { bodyType: { contains: 'truck', mode: 'insensitive' } },
        { bodyType: { contains: 'pickup', mode: 'insensitive' } },
      ],
    },
    relatedSlugs: ['used-ford', 'used-trucks', 'diesel-trucks', 'cars-under-30000'],
    breadcrumbLabel: 'Ford Trucks',
    category: 'combo',
    carsFilterUrl: '/cars?make=Ford&bodyType=truck',
    clientProps: { initialMake: 'Ford', initialBodyType: 'truck' },
  },
  {
    slug: 'used-trucks-under-30000',
    title: 'Used Trucks Under $30,000',
    h1: 'Used Trucks for Sale Under $30,000',
    metaDescription: 'Browse used pickup trucks under $30,000 from certified dealers. Affordable trucks from Ford, Toyota, Chevrolet, and more.',
    intro: 'Get a capable truck without stretching your budget. Browse used trucks under $30,000 from certified dealers and compare competing offers.',
    prismaWhere: {
      salePrice: { lte: 30000, gt: 0 },
      OR: [
        { bodyType: { contains: 'truck', mode: 'insensitive' } },
        { bodyType: { contains: 'pickup', mode: 'insensitive' } },
      ],
    },
    relatedSlugs: ['used-trucks', 'cars-under-30000', 'used-ford-truck', 'used-toyota'],
    breadcrumbLabel: 'Trucks Under $30K',
    category: 'combo',
    carsFilterUrl: '/cars?bodyType=truck&maxPrice=30000',
    clientProps: { initialBodyType: 'truck', initialMaxPrice: 30000 },
  },
  {
    slug: 'used-suvs-under-25000',
    title: 'Used SUVs Under $25,000',
    h1: 'Used SUVs for Sale Under $25,000',
    metaDescription: 'Find used SUVs under $25,000 from certified dealers. Affordable SUVs and crossovers from top brands nationwide.',
    intro: 'Find a quality SUV without the premium price tag. Browse used SUVs under $25,000 from certified dealers who compete for your business.',
    prismaWhere: {
      salePrice: { lte: 25000, gt: 0 },
      OR: [
        { bodyType: { contains: 'suv', mode: 'insensitive' } },
        { bodyType: { contains: 'crossover', mode: 'insensitive' } },
      ],
    },
    relatedSlugs: ['used-suvs', 'cars-under-25000', 'used-toyota-suv', 'used-honda-suv'],
    breadcrumbLabel: 'SUVs Under $25K',
    category: 'combo',
    carsFilterUrl: '/cars?bodyType=suv&maxPrice=25000',
    clientProps: { initialBodyType: 'suv', initialMaxPrice: 25000 },
  },
];

// Build lookup map
export const seoPageMap = new Map<string, SeoPageConfig>(
  seoPages.map((p) => [p.slug, p])
);

export const allSeoSlugs = seoPages.map((p) => p.slug);

export default seoPages;
