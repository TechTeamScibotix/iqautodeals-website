# Project Horizon: Sitemap Scaling for Millions of Vehicles

## Codename: **Project Horizon**
*"No limit in sight"*

---

## Executive Summary

IQ Auto Deals is built on Vercel (auto-scaling serverless) + Neon (auto-scaling Postgres). The infrastructure can handle millions of records. However, the current sitemap implementation has a code-level bottleneck that limits practical capacity to ~50,000 vehicles.

**Project Horizon** upgrades the sitemap architecture to support unlimited inventory growth.

---

## Current State

### Infrastructure (No Changes Needed)

| Service | Capability | Status |
|---------|------------|--------|
| Vercel Functions | Auto-scales to thousands of concurrent executions | ✅ Ready |
| Neon Postgres | Auto-scales compute, handles millions of rows | ✅ Ready |
| Vehicle Pages `/cars/[id]` | Dynamic rendering, no pre-generation | ✅ Ready |
| AI Uniqueness Check | Compares against 500 most recent only | ✅ Ready |

### Code Bottleneck (Needs Upgrade)

**File:** `app/sitemap.ts`

```typescript
// CURRENT: Fetches ALL cars in ONE query
const activeCars = await prisma.car.findMany({
  where: { status: 'active', dealer: { verificationStatus: 'approved' } },
  select: { id: true, createdAt: true },
  orderBy: { createdAt: 'desc' },
});
```

**Problems:**
1. Single query returns all records → timeout at scale
2. Single sitemap file → Google limit: 50,000 URLs per file
3. Memory pressure in serverless function

### Current Capacity

| Inventory Size | Status |
|----------------|--------|
| 10,000 cars | ✅ Works |
| 50,000 cars | ⚠️ Hits Google limit |
| 100,000+ cars | ❌ Query timeout + limit exceeded |

---

## Project Horizon Solution

### Architecture: Sitemap Index Pattern

Instead of one massive sitemap, create an index that points to chunked sitemaps:

```
https://iqautodeals.com/sitemap.xml
    │
    ├── /sitemap-static.xml      (static pages, locations, models)
    │
    ├── /sitemap-cars-0.xml      (cars 1 - 50,000)
    ├── /sitemap-cars-1.xml      (cars 50,001 - 100,000)
    ├── /sitemap-cars-2.xml      (cars 100,001 - 150,000)
    └── ... (grows automatically)
```

### How It Works

1. **Main sitemap.xml** → Returns sitemap index (list of sitemap files)
2. **Each chunk** → Queries only its range using `skip` and `take`
3. **Auto-expanding** → New chunks created as inventory grows
4. **Fast queries** → Each chunk fetches max 50,000 records

---

## Technical Implementation

### New File Structure

```
app/
├── sitemap.xml/
│   └── route.ts           # Sitemap index (lists all sitemap files)
├── sitemap-static.xml/
│   └── route.ts           # Static pages, locations, models
├── sitemap-cars/
│   └── [chunk]/
│       └── route.ts       # Dynamic car chunks (0, 1, 2, ...)
```

### Sitemap Index (`/sitemap.xml`)

```typescript
// app/sitemap.xml/route.ts
import { prisma } from '@/lib/prisma';

const CARS_PER_SITEMAP = 50000;

export async function GET() {
  const baseUrl = 'https://iqautodeals.com';

  // Count total active cars
  const totalCars = await prisma.car.count({
    where: { status: 'active', dealer: { verificationStatus: 'approved' } },
  });

  // Calculate number of car sitemap chunks needed
  const carChunks = Math.ceil(totalCars / CARS_PER_SITEMAP);

  // Build sitemap index
  const sitemaps = [
    `${baseUrl}/sitemap-static.xml`,
    ...Array.from({ length: carChunks }, (_, i) =>
      `${baseUrl}/sitemap-cars/${i}.xml`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### Car Chunk Sitemap (`/sitemap-cars/[chunk].xml`)

```typescript
// app/sitemap-cars/[chunk]/route.ts
import { prisma } from '@/lib/prisma';

const CARS_PER_SITEMAP = 50000;

export async function GET(
  request: Request,
  { params }: { params: { chunk: string } }
) {
  const baseUrl = 'https://iqautodeals.com';
  const chunkIndex = parseInt(params.chunk);

  // Fetch only this chunk's cars
  const cars = await prisma.car.findMany({
    where: { status: 'active', dealer: { verificationStatus: 'approved' } },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: 'desc' },
    skip: chunkIndex * CARS_PER_SITEMAP,
    take: CARS_PER_SITEMAP,
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cars.map(car => `  <url>
    <loc>${baseUrl}/cars/${car.id}</loc>
    <lastmod>${car.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### Static Sitemap (`/sitemap-static.xml`)

```typescript
// app/sitemap-static.xml/route.ts
// Contains: homepage, /cars, /locations, /models, all location pages, all model pages
// (Move existing static + location + model URLs here)
```

---

## Capacity After Project Horizon

| Inventory Size | Sitemap Files | Status |
|----------------|---------------|--------|
| 50,000 cars | 2 (static + 1 chunk) | ✅ Works |
| 100,000 cars | 3 (static + 2 chunks) | ✅ Works |
| 500,000 cars | 11 (static + 10 chunks) | ✅ Works |
| 1,000,000 cars | 21 (static + 20 chunks) | ✅ Works |
| 5,000,000 cars | 101 (static + 100 chunks) | ✅ Works |

**No code changes needed as inventory grows — system auto-expands.**

---

## Database Optimization (Recommended)

Add index for sitemap queries:

```sql
CREATE INDEX idx_cars_active_approved ON cars (status, created_at DESC)
WHERE status = 'active';
```

This makes paginated queries O(1) instead of O(n).

---

## Implementation Checklist

### Phase 1: Core Implementation
- [ ] Create `app/sitemap.xml/route.ts` (sitemap index)
- [ ] Create `app/sitemap-cars/[chunk]/route.ts` (chunked car sitemaps)
- [ ] Create `app/sitemap-static.xml/route.ts` (static pages)
- [ ] Remove old `app/sitemap.ts`
- [ ] Add database index for optimized queries

### Phase 2: Testing
- [ ] Test with current inventory (~39 cars)
- [ ] Verify Google Search Console accepts new format
- [ ] Load test sitemap generation

### Phase 3: Monitoring
- [ ] Add logging for sitemap generation times
- [ ] Set up alerts if generation exceeds 5 seconds

---

## Performance Comparison

| Metric | Before (Current) | After (Horizon) |
|--------|------------------|-----------------|
| Max cars supported | ~50,000 | Unlimited |
| Query per sitemap | All records | Max 50,000 |
| Memory usage | O(n) | O(1) constant |
| Generation time at 1M cars | Timeout | ~2 seconds per chunk |
| Google compatibility | Single file limit | Sitemap index standard |

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Google rejects sitemap index | Low | Standard format, widely used |
| Chunk query slow | Low | Database index + pagination |
| Cache issues | Medium | Add cache headers, CDN caching |

---

## Timeline

**Estimated Implementation: 2-3 hours**

| Task | Time |
|------|------|
| Create sitemap index route | 30 min |
| Create chunked car sitemap route | 45 min |
| Create static sitemap route | 30 min |
| Remove old sitemap, test | 30 min |
| Deploy + verify in Search Console | 30 min |

---

## Success Metrics

After implementation:
- [ ] Sitemap index accessible at `/sitemap.xml`
- [ ] Car chunks accessible at `/sitemap-cars/0.xml`
- [ ] Google Search Console shows all sitemaps
- [ ] No timeout errors in Vercel logs
- [ ] System handles 100,000+ test records

---

## Summary

**Project Horizon** transforms IQ Auto Deals from a 50,000 vehicle limit to **unlimited capacity** with a simple architectural change to sitemap generation. The infrastructure (Vercel + Neon) already supports millions — this update removes the last code-level bottleneck.

**Name:** Project Horizon
**Tagline:** "No limit in sight"
**Status:** Ready for implementation
**Scheduled:** Next week

---

*Document created: December 2025*
*Author: Scibotix Solutions Engineering*
