import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { makes as makesData } from '@/lib/data/makes'
import { models as modelsData } from '@/lib/data/models'
import { bodyTypes as bodyTypesData } from '@/lib/data/bodyTypes'
import { locations as locationsData } from '@/lib/data/locations'

const baseUrl = 'https://iqautodeals.com'

// Fixed date for static content — only update when content actually changes
const STATIC_LAST_MODIFIED = new Date('2025-06-01T00:00:00Z')

const VEHICLE_CHUNK_SIZE = 45000

// Helper to convert model name to URL slug (matches new-cars page logic)
function modelNameToSlug(modelName: string): string {
  return modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ============================================
// Sitemap Index: generateSitemaps()
// ============================================
// ID 0: Core pages
// ID 1: Guides + Blog
// ID 2: Model pages (/models/[model])
// ID 3: Location base pages (/locations/[location])
// ID 4: Location filter pages (/locations/[location]/[filter])
// ID 5: New cars (all /new-cars/* subsections)
// ID 6: Make pages (/cars/make/*)
// ID 7+: VIN pages — chunked at 45,000 per sitemap

export async function generateSitemaps() {
  let carCount = 0
  try {
    carCount = await prisma.car.count({
      where: {
        status: { in: ['active', 'sold'] },
        dealer: { verificationStatus: 'approved' },
      },
    })
  } catch (error) {
    console.error('Error counting cars for sitemap index:', error)
  }

  const vehicleChunks = Math.max(1, Math.ceil(carCount / VEHICLE_CHUNK_SIZE))

  return [
    { id: 0 }, // Core pages
    { id: 1 }, // Guides + Blog
    { id: 2 }, // Model pages
    { id: 3 }, // Location base pages
    { id: 4 }, // Location filter pages
    { id: 5 }, // New cars
    { id: 6 }, // Make pages (/cars/make/*)
    ...Array.from({ length: vehicleChunks }, (_, i) => ({ id: 7 + i })),
  ]
}

// ============================================
// Sitemap content by ID
// ============================================

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  // Next.js passes id as string through URL params — coerce to number
  const numId = Number(id)

  switch (numId) {
    case 0:
      return getCorePages()
    case 1:
      return getGuideAndBlogPages()
    case 2:
      return getModelPages()
    case 3:
      return getLocationBasePages()
    case 4:
      return getLocationFilterPages()
    case 5:
      return getNewCarsPages()
    case 6:
      return getMakePages()
    default:
      return getVehiclePages(numId)
  }
}

// ============================================
// ID 0: Core pages (~12 URLs)
// ============================================
function getCorePages(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cars`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/models`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/locations`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/about`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/new-cars`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/new-cars/deals`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/terms`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/for-dealers`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
  ]
}

// ============================================
// ID 1: Guides + Blog (~16 URLs)
// ============================================
function getGuideAndBlogPages(): MetadataRoute.Sitemap {
  const guides = [
    'how-to-buy-used-car',
    'car-financing-guide',
    'pre-purchase-inspection',
    'vehicle-maintenance',
    'trade-in-value',
    'vin-decoder',
    'warranty-guide',
    'car-insurance-basics',
    'first-time-buyer-faq',
    'lease-vs-buy',
    'credit-score-auto-loans',
  ]

  const blogs = [
    'how-to-finance-used-car-2025',
    'new-vs-used-cars-first-time-buyers',
    'best-used-cars-under-20k',
  ]

  return [
    { url: `${baseUrl}/blog`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
    ...blogs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...guides.map((slug) => ({
      url: `${baseUrl}/guides/${slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}

// ============================================
// ID 2: Model pages (/models/[model]) ~62 URLs
// ============================================
function getModelPages(): MetadataRoute.Sitemap {
  return Object.keys(modelsData).map((slug) => ({
    url: `${baseUrl}/models/${slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))
}

// ============================================
// ID 3: Location base pages (/locations/[location]) ~182 URLs
// ============================================
function getLocationBasePages(): MetadataRoute.Sitemap {
  return Object.keys(locationsData).map((slug) => ({
    url: `${baseUrl}/locations/${slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))
}

// ============================================
// ID 4: Location filter pages (/locations/[location]/[filter]) ~15,652 URLs
// ============================================
function getLocationFilterPages(): MetadataRoute.Sitemap {
  const locationSlugs = Object.keys(locationsData)
  const modelSlugs = Object.keys(modelsData)
  const bodyTypeSlugs = Object.keys(bodyTypesData)

  const priceRanges = [
    'under-5000', 'under-10000', 'under-15000', 'under-20000', 'under-25000', 'under-30000',
    '5000-to-10000', '10000-to-15000', '15000-to-20000', '20000-to-30000', '30000-to-50000', 'over-50000',
  ]

  const pages: MetadataRoute.Sitemap = []

  locationSlugs.forEach((location) => {
    // Price range pages
    priceRanges.forEach((range) => {
      pages.push({
        url: `${baseUrl}/locations/${location}/${range}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    })
    // Body type pages
    bodyTypeSlugs.forEach((type) => {
      pages.push({
        url: `${baseUrl}/locations/${location}/${type}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    })
    // Model pages
    modelSlugs.forEach((model) => {
      pages.push({
        url: `${baseUrl}/locations/${location}/${model}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    })
  })

  return pages
}

// ============================================
// ID 5: New cars (all /new-cars/* subsections) ~15,800+ URLs
// ============================================
function getNewCarsPages(): MetadataRoute.Sitemap {
  const locationSlugs = Object.keys(locationsData)
  const modelSlugs = Object.keys(modelsData)
  const bodyTypeSlugs = Object.keys(bodyTypesData)

  const newCarsPriceRanges = [
    'under-25000', 'under-30000', 'under-35000', 'under-40000', 'under-50000', 'under-60000',
    '25000-to-35000', '35000-to-50000', '50000-to-75000', '75000-to-100000', 'over-100000',
  ]

  const pages: MetadataRoute.Sitemap = []

  // /new-cars/make/[make] — 21 makes
  Object.keys(makesData).forEach((makeSlug) => {
    pages.push({
      url: `${baseUrl}/new-cars/make/${makeSlug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  })

  // /new-cars/make/[make]/[model] — 62 make+model combos
  Object.entries(modelsData).forEach(([, modelData]) => {
    const makeSlug = Object.entries(makesData).find(
      ([, makeData]) => makeData.name.toLowerCase() === modelData.brand.toLowerCase()
    )?.[0]
    if (makeSlug) {
      pages.push({
        url: `${baseUrl}/new-cars/make/${makeSlug}/${modelNameToSlug(modelData.model)}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  })

  // /new-cars/[location] — 182 locations
  locationSlugs.forEach((loc) => {
    pages.push({
      url: `${baseUrl}/new-cars/${loc}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  })

  // /new-cars/[location]/[filter] — location × (price ranges + body types + models)
  locationSlugs.forEach((loc) => {
    newCarsPriceRanges.forEach((range) => {
      pages.push({
        url: `${baseUrl}/new-cars/${loc}/${range}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    })
    bodyTypeSlugs.forEach((type) => {
      pages.push({
        url: `${baseUrl}/new-cars/${loc}/${type}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    })
    modelSlugs.forEach((model) => {
      pages.push({
        url: `${baseUrl}/new-cars/${loc}/${model}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    })
  })

  return pages
}

// ============================================
// ID 6: Make pages (/cars/make/*) ~83 URLs
// ============================================
function getMakePages(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = []

  // /cars/make/[make] — 21 makes
  Object.keys(makesData).forEach((makeSlug) => {
    pages.push({
      url: `${baseUrl}/cars/make/${makeSlug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  })

  // /cars/make/[make]/[model] — 62 make+model combos
  Object.entries(modelsData).forEach(([, modelData]) => {
    const makeSlug = Object.entries(makesData).find(
      ([, makeData]) => makeData.name.toLowerCase() === modelData.brand.toLowerCase()
    )?.[0]
    if (makeSlug) {
      pages.push({
        url: `${baseUrl}/cars/make/${makeSlug}/${modelNameToSlug(modelData.model)}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    }
  })

  return pages
}

// ============================================
// ID 7+: VIN pages — chunked at 45,000 per sitemap
// ============================================
async function getVehiclePages(id: number): Promise<MetadataRoute.Sitemap> {
  const chunkIndex = id - 7
  const skip = chunkIndex * VEHICLE_CHUNK_SIZE

  try {
    const cars = await prisma.car.findMany({
      where: {
        status: { in: ['active', 'sold'] },
        dealer: { verificationStatus: 'approved' },
      },
      select: {
        slug: true,
        id: true,
        status: true,
        createdAt: true,
        statusChangedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: VEHICLE_CHUNK_SIZE,
    })

    return cars.map((car) => ({
      url: `${baseUrl}/cars/${car.slug || car.id}`,
      lastModified: car.statusChangedAt || car.createdAt,
      changeFrequency: car.status === 'sold' ? 'monthly' as const : 'weekly' as const,
      priority: car.status === 'sold' ? 0.5 : 0.9,
    }))
  } catch (error) {
    console.error(`Error fetching vehicle chunk ${chunkIndex} for sitemap:`, error)
    return []
  }
}
