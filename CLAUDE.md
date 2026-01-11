# IQ Auto Deals Website - Project Context

---

## CRITICAL: Brand Identity - READ THIS FIRST

### IQ Auto Deals (iqautodeals.com) - THIS PROJECT
- **Type:** Nationwide ONLINE car marketplace PLATFORM
- **Business Model:** Digital platform connecting buyers with certified dealers
- **How it works:** Buyers browse vehicles, select up to 4, receive competing dealer offers
- **Geographic Scope:** All 50 US states (NATIONWIDE)
- **Founded:** 2024
- **Headquarters:** Atlanta, GA (corporate office, NOT a car lot)
- **Tagline:** "Smart Car Buying Made Simple"
- **Value Prop:** Save up to $5,000 through dealer competition
- **Languages:** English and Spanish
- **Contact:** support@iqautodeals.com, 1-800-IQ-DEALS

**IMPORTANT: IQ Auto Deals is a TECHNOLOGY PLATFORM, not a physical car dealership. Never describe it as a car lot, auto dealer, or local business.**

---

## Overview

This is the consumer-facing website for IQ Auto Deals - a nationwide online car marketplace. The project folder is named `priceyourauto` but the live site is **iqautodeals.com**.

**Live URL:** https://iqautodeals.com
**Local Dev Port:** 5050
**Deployment:** Vercel

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 15.5.7 |
| Language | TypeScript | 5 |
| Frontend | React | 18+ |
| Styling | Tailwind CSS | - |
| Database | PostgreSQL (Prisma) | 6.2.0 |
| Auth | NextAuth.js | 4.24.11 |
| AI | Google Gemini | 0.24.1 |
| Analytics | PostHog + Vercel Analytics | - |
| Storage | Vercel Blob | 2.0.0 |
| Testing | Playwright | - |

---

## Project Structure

```
/Users/joeduran/priceyourauto/
├── app/
│   ├── api/                 # API routes
│   ├── about/               # About page
│   ├── admin/               # Admin dashboard
│   ├── blog/                # Blog pages
│   ├── cars/                # Car listings/search
│   ├── components/          # React components
│   ├── customer/            # Customer portal
│   ├── dealer/              # Dealer portal
│   ├── demo/                # Demo pages
│   ├── forgot-password/     # Password reset
│   ├── guides/              # SEO guide content
│   ├── locations/           # Location pages (SEO)
│   ├── login/               # Auth pages
│   ├── models/              # Vehicle model pages
│   ├── register/            # Registration
│   ├── reset-password/      # Password reset
│   ├── layout.tsx           # Root layout with schemas
│   ├── page.tsx             # Homepage
│   └── sitemap.ts           # Dynamic sitemap
├── components/              # Shared components
├── lib/                     # Utilities
├── prisma/                  # Database schema
├── public/                  # Static assets
├── scripts/                 # Utility scripts
└── docs/                    # Documentation
```

---

## Key Features

### For Buyers
- Browse nationwide used car inventory
- Compare up to 4 vehicles at once
- Receive competing offers from certified dealers
- No haggling - transparent pricing
- Save up to $5,000

### For Dealers
- Access to qualified buyer leads
- Compete for customer business
- Dealer portal for managing inventory
- Integration with Scibotix Solutions platform

---

## Schema Markup (SEO Critical)

The schema files are crucial for search engine and AI differentiation:

| File | Purpose |
|------|---------|
| `app/components/OrganizationSchema.tsx` | Corporation + WebApplication schema with disambiguation |
| `app/components/LocalBusinessSchema.tsx` | OnlineBusiness schema (NOT AutoDealer) |
| `app/components/AutoDealerSchema.tsx` | Service/Marketplace schema (NOT AutoDealer) |
| `app/components/WebsiteSchema.tsx` | WebSite schema with search action |
| `app/components/VehicleSchema.tsx` | Individual vehicle listings |
| `app/components/FAQSchema.tsx` | FAQ structured data |
| `app/components/BreadcrumbSchema.tsx` | Navigation breadcrumbs |

**Key Schema Properties for Disambiguation:**
- `disambiguatingDescription` - Explicitly states NOT a physical dealership
- `@type: 'OnlineBusiness'` instead of `AutoDealer`
- `@type: 'WebApplication'` instead of `SoftwareApplication`
- `@type: 'Service'` with `serviceType: 'Online Automotive Marketplace'`
- `sameAs` links to official social profiles

---

## Routes

### Public Pages
| Route | Purpose |
|-------|---------|
| `/` | Homepage - hero, search, featured cars |
| `/cars` | Car search/listings |
| `/cars/[id]` | Individual car details |
| `/about` | About IQ Auto Deals |
| `/blog` | Blog articles |
| `/guides/*` | SEO guide content |
| `/locations/*` | Location-based landing pages |
| `/models/*` | Vehicle model pages |
| `/login` | User login |
| `/register` | User registration |

### Customer Portal
| Route | Purpose |
|-------|---------|
| `/customer` | Customer dashboard |
| `/customer/*` | Customer features |

### Dealer Portal
| Route | Purpose |
|-------|---------|
| `/dealer` | Dealer dashboard |
| `/dealer/*` | Dealer management features |

### Admin
| Route | Purpose |
|-------|---------|
| `/admin` | Admin dashboard |

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://iqautodeals.com

# AI
GOOGLE_AI_API_KEY=...

# Analytics
POSTHOG_KEY=...
POSTHOG_HOST=...

# Email
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...

# Storage
BLOB_READ_WRITE_TOKEN=...
```

---

## Common Commands

```bash
# Development (runs on port 5050)
npm run dev

# Build
npm run build

# Start production
npm run start

# Database
npm run db:push      # Push Prisma schema
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Demo recordings
npm run demo:record  # Record demo video
npm run demo:deal    # Record deal request demo
```

---

## SEO Keywords Strategy

The site targets:
- Core: "used cars for sale", "buy used cars online", "car dealerships near me"
- Geographic: All 50 states + major cities
- Brand: Toyota, Honda, Ford, Chevrolet, etc.
- Model-specific: "Toyota Tacoma for sale", "Ford F-150 price", etc.
- Competitor alternatives: "carmax alternative", "carvana vs dealer"
- Nationwide: "nationwide car dealers", "national car marketplace"

See `SEO-KEYWORDS-STRATEGY.md` and `NATIONAL-SEO-KEYWORDS.md` for full strategy.

---

## Integration with Scibotix Solutions

IQ Auto Deals integrates with the Scibotix Solutions dealer platform:

**Scibotix → IQ Auto Deals:**
- Inventory sync (dealers list vehicles on marketplace)
- AI-generated listings from Showroom AI

**IQ Auto Deals → Scibotix:**
- Lead capture (buyer inquiries go to dealer CRM)
- Deal requests
- Analytics data

Integration endpoints:
- `/api/iqautodeals/leads` (in Scibotix)
- `/api/webhooks/iqautodeals/*` (in Scibotix)

---

## Related Projects

| Project | Path | Purpose |
|---------|------|---------|
| Scibotix Solutions | `/Users/joeduran/scibotix-solutions` | Dealer platform (CRM, Showroom AI, etc.) |
| IQ Auto Deals Analytics | `/Users/joeduran/iqautodeals-analytics` | Geographic analytics dashboard |
| Scibotix Mobile | `/Users/joeduran/scibotix-mobile` | Mobile app |

---

## Important Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with all schema components |
| `app/page.tsx` | Homepage (41K lines - complex) |
| `app/sitemap.ts` | Dynamic sitemap generation |
| `prisma/schema.prisma` | Database schema |
| `middleware.ts` | Auth middleware |

---

## Notes

1. **Project folder name:** `priceyourauto` (historical) but site is `iqautodeals.com`
2. **Dev port:** 5050 (not default 3000)
3. **Schema markup is critical** for SEO differentiation from IQautos.com
4. **Nationwide focus** - emphasize in all content and metadata
5. **PostHog analytics** - tracks user behavior for insights
6. **Dealer outreach files** - CSV files in root for sales outreach
