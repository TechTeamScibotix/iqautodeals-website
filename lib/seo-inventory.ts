import { prisma } from '@/lib/prisma';

export type SeoCarResult = {
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
  drivetrain: string | null;
  color: string | null;
  transmission: string | null;
};

const seoCarSelect = {
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
  drivetrain: true,
  color: true,
  transmission: true,
} as const;

/**
 * Fetch inventory for an SEO page.
 * Always filters to active, photo-having, approved-dealer vehicles.
 */
export async function fetchSeoInventory(
  pageWhere: Record<string, unknown>,
  limit = 30,
): Promise<{ cars: SeoCarResult[]; total: number }> {
  const where = {
    status: 'active',
    photos: { notIn: ['', '[]'] },
    dealer: { verificationStatus: 'approved' },
    ...pageWhere,
  };

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      select: seoCarSelect,
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.car.count({ where }),
  ]);

  return { cars: cars as SeoCarResult[], total };
}
