import { prisma } from '@/lib/prisma';

export type InventoryCar = {
  id: string;
  slug: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  salePrice: number;
  mileage: number;
  city: string;
  state: string;
  photos: string;
  bodyType: string | null;
  fuelType: string | null;
  condition: string | null;
};

export type InventoryResult = {
  cars: InventoryCar[];
  totalCount: number;
  scope: 'city' | 'state' | 'nationwide';
  scopeLabel: string;
};

const LUXURY_MAKES = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche', 'Jaguar',
  'Land Rover', 'Maserati', 'Bentley', 'Rolls-Royce', 'Ferrari',
  'Lamborghini', 'Aston Martin', 'McLaren', 'Genesis', 'Infiniti',
  'Acura', 'Lincoln', 'Cadillac', 'Volvo', 'Alfa Romeo',
];

const select = {
  id: true,
  slug: true,
  year: true,
  make: true,
  model: true,
  trim: true,
  salePrice: true,
  mileage: true,
  city: true,
  state: true,
  photos: true,
  bodyType: true,
  fuelType: true,
  condition: true,
} as const;

type FetchParams = {
  city: string;
  stateCode: string;
  minPrice?: number;
  maxPrice?: number;
  bodyType?: string;
  make?: string;
  model?: string;
  condition?: 'new' | 'used' | 'all';
  limit?: number;
};

export async function fetchInventoryForLocation(params: FetchParams): Promise<InventoryResult> {
  const { city, stateCode, minPrice, maxPrice, bodyType, make, model, condition, limit = 16 } = params;

  // Build filter conditions shared across all tiers
  const baseWhere: Record<string, unknown> = {
    status: 'active',
    dealer: { verificationStatus: 'approved' },
  };

  if (minPrice !== undefined) baseWhere.salePrice = { ...((baseWhere.salePrice as object) || {}), gte: minPrice };
  if (maxPrice !== undefined) baseWhere.salePrice = { ...((baseWhere.salePrice as object) || {}), lte: maxPrice };

  if (condition === 'new') {
    baseWhere.condition = { equals: 'new', mode: 'insensitive' };
  } else if (condition === 'used') {
    baseWhere.condition = { not: { equals: 'new', mode: 'insensitive' } };
  }

  // Body type filters (special slug handling)
  if (bodyType) {
    const bt = bodyType.toLowerCase();
    if (bt === 'luxury') {
      baseWhere.make = { in: LUXURY_MAKES, mode: 'insensitive' };
    } else if (bt === 'electric') {
      baseWhere.fuelType = { equals: 'Electric', mode: 'insensitive' };
    } else if (bt === 'hybrid') {
      baseWhere.fuelType = { contains: 'Hybrid', mode: 'insensitive' };
    } else if (bt === 'sports-car' || bt === 'sports car') {
      baseWhere.OR = [
        { bodyType: { contains: 'coupe', mode: 'insensitive' } },
        { bodyType: { contains: 'sports', mode: 'insensitive' } },
        { bodyType: { contains: 'convertible', mode: 'insensitive' } },
      ];
    } else if (bt === 'truck') {
      baseWhere.OR = [
        { bodyType: { contains: 'truck', mode: 'insensitive' } },
        { bodyType: { contains: 'pickup', mode: 'insensitive' } },
      ];
    } else {
      baseWhere.bodyType = { contains: bodyType, mode: 'insensitive' };
    }
  }

  if (make) baseWhere.make = { equals: make, mode: 'insensitive' };
  if (model) baseWhere.model = { equals: model, mode: 'insensitive' };

  // Tier 1: City match
  const cityWhere = { ...baseWhere, city: { equals: city, mode: 'insensitive' as const }, state: { equals: stateCode, mode: 'insensitive' as const } };
  const [cityCars, cityCount] = await Promise.all([
    prisma.car.findMany({ where: cityWhere as never, select, orderBy: { createdAt: 'desc' }, take: limit }),
    prisma.car.count({ where: cityWhere as never }),
  ]);

  if (cityCars.length > 0) {
    return { cars: cityCars as InventoryCar[], totalCount: cityCount, scope: 'city', scopeLabel: `in ${city}, ${stateCode}` };
  }

  // Tier 2: State match
  const stateWhere = { ...baseWhere, state: { equals: stateCode, mode: 'insensitive' as const } };
  const [stateCars, stateCount] = await Promise.all([
    prisma.car.findMany({ where: stateWhere as never, select, orderBy: { createdAt: 'desc' }, take: limit }),
    prisma.car.count({ where: stateWhere as never }),
  ]);

  if (stateCars.length > 0) {
    return { cars: stateCars as InventoryCar[], totalCount: stateCount, scope: 'state', scopeLabel: `in ${stateCode}` };
  }

  // Tier 3: Nationwide
  const [nationwideCars, nationwideCount] = await Promise.all([
    prisma.car.findMany({ where: baseWhere as never, select, orderBy: { createdAt: 'desc' }, take: limit }),
    prisma.car.count({ where: baseWhere as never }),
  ]);

  return { cars: nationwideCars as InventoryCar[], totalCount: nationwideCount, scope: 'nationwide', scopeLabel: 'nationwide' };
}
