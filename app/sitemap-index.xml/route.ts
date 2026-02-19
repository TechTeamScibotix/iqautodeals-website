import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const baseUrl = 'https://iqautodeals.com';
const VEHICLE_CHUNK_SIZE = 45000;

/**
 * Manual sitemap index because Next.js generateSitemaps() doesn't
 * reliably serve the index at /sitemap.xml in production.
 *
 * This serves a sitemap index at /sitemap-index.xml that points
 * to all individual sitemaps at /sitemap/[id].xml
 */
export async function GET() {
  let carCount = 0;
  try {
    carCount = await prisma.car.count({
      where: {
        status: { in: ['active', 'sold'] },
        dealer: { verificationStatus: 'approved' },
      },
    });
  } catch (error) {
    console.error('Error counting cars for sitemap index:', error);
  }

  const vehicleChunks = Math.max(1, Math.ceil(carCount / VEHICLE_CHUNK_SIZE));

  const sitemapIds = [
    0, // Core pages
    1, // Guides + Blog
    2, // Model pages
    3, // Location base pages
    4, // Location filter pages
    5, // New cars
    6, // Make pages
    ...Array.from({ length: vehicleChunks }, (_, i) => 7 + i),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIds.map((id) => `  <sitemap>
    <loc>${baseUrl}/sitemap/${id}.xml</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
