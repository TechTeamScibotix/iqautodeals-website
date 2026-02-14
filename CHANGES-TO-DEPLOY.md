# Changes To Be Deployed

## Location Pages: Auto-Filter "Browse Cars" Links by City

**Date:** 2026-02-12
**Status:** Ready to deploy

### Problem

When users clicked "Browse Cars in {City}" or any CTA on location pages, they were sent to `/cars` with no filters applied — showing all cars nationwide. This defeated the purpose of location-specific landing pages and created a poor user experience.

### Solution

Used the `zipcodes` npm package (already installed) to look up each city's primary zip code at build time and pass it as a query parameter. Since all location pages use `force-static`, the zip codes are resolved during static generation with zero runtime cost.

### Files Changed

**1. `app/locations/[location]/page.tsx`** (Used cars by city)
- Added `zipcodes` import and zip lookup
- Updated 5 links:
  - Hero CTA "Browse Cars in {City}" → `/cars?zipCode={zip}`
  - Browse SUVs → `/cars?zipCode={zip}&bodyType=SUV`
  - Browse Sedans → `/cars?zipCode={zip}&bodyType=Sedan`
  - Browse Trucks → `/cars?zipCode={zip}&bodyType=Truck`
  - Bottom CTA "Browse Inventory" → `/cars?zipCode={zip}`

**2. `app/locations/[location]/[filter]/page.tsx`** (Used cars filtered by price/body type/model)
- Added `zipcodes` import and zip lookup
- Builds a smart `carsHref` with `zipCode` plus contextual filters:
  - Price range pages include `minPrice`/`maxPrice`
  - Body type pages include `bodyType`
  - Model pages include `make` and `model`
- Updated 2 links (hero CTA + bottom CTA)

**3. `app/new-cars/[location]/page.tsx`** (New cars by city)
- Added `zipcodes` import and zip lookup
- Updated 2 links (hero CTA + bottom CTA) to include `condition=new&zipCode={zip}`

**4. `app/new-cars/[location]/[filter]/page.tsx`** (New cars filtered by price/body type/model)
- Added `zipcodes` import and zip lookup
- Builds a smart `carsHref` with `condition=new` + `zipCode` plus contextual filters (same logic as used cars filter page)
- Updated 2 links (hero CTA + bottom CTA)

### How It Works

- All links include a graceful fallback — if `zipcodes.lookupByName()` returns no results for a city, links fall back to the unfiltered `/cars` page
- The `/cars` page `CarsClient` component already reads `zipCode`, `bodyType`, `condition`, `minPrice`, `maxPrice`, `make`, and `model` from URL search params, so no changes were needed on the receiving end
- Total: **11 links updated** across 4 files

### Example URLs Generated

| Page | Link Destination |
|------|-----------------|
| `/locations/kenosha` | `/cars?zipCode=53140` |
| `/locations/kenosha/suv` | `/cars?zipCode=53140&bodyType=SUVs` |
| `/locations/kenosha/under-15000` | `/cars?zipCode=53140&maxPrice=15000` |
| `/locations/kenosha/toyota-camry` | `/cars?zipCode=53140&make=Toyota&model=Camry` |
| `/new-cars/kenosha` | `/cars?condition=new&zipCode=53140` |
| `/new-cars/kenosha/suv` | `/cars?condition=new&zipCode=53140&bodyType=SUVs` |

### Verification

- `npx next build` passes — all 30,000+ static pages generate successfully
- Dev server tested at `http://localhost:5050`
