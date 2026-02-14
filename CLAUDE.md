# IQ Auto Deals Website - Project Context

---

## CRITICAL: Deployment & Git Info

### Git Repository
- **GitHub:** `https://github.com/TechTeamScibotix/iqautodeals-website.git`
- **Branch:** `main`
- **Always commit and push before deploying**

### Vercel Deployment
- **Project:** `priceyourauto`
- **URL:** https://iqautodeals.com
- **Deploy:** `vercel --prod` (from project root)

### SHARED DATABASE WARNING
This project shares a PostgreSQL database with Scibotix Solutions (`/Users/joeduran/scibotix-solutions`).
- **NEVER run `prisma db push`** — it will DROP 134+ Scibotix tables that aren't in this schema
- **NEVER run `prisma db push --accept-data-loss`** — same problem, even worse
- Schema changes in one project can break the other
- Both projects must have compatible schemas for shared tables (User, Car, etc.)
- Key shared tables: `User`, `Car`, `AcceptedDeal`, `DealList`, `SelectedCar`

### Safe Schema Change Procedure
Since `prisma db push` would destroy Scibotix tables, always use raw SQL for schema changes:

```bash
# 1. Add the model to prisma/schema.prisma (so Prisma client knows about it)

# 2. Preview the SQL diff (read-only, doesn't change anything)
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma

# 3. Run ONLY the additive SQL (CREATE TABLE, CREATE INDEX, ALTER TABLE ADD COLUMN)
#    NEVER run the destructive parts (DROP TABLE, DROP COLUMN, etc.)
npx prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
CREATE TABLE IF NOT EXISTS "my_new_table" (...);
CREATE INDEX IF NOT EXISTS "my_index" ON "my_new_table"(...);
SQL

# 4. Regenerate the Prisma client
npx prisma generate

# 5. Deploy code (no DB impact)
vercel --prod
```

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
- **Value Prop:** Dealers compete to offer you their best price
- **Languages:** English and Spanish
- **Contact:** support@iqautodeals.com, 1-800-IQ-DEALS

**IMPORTANT: IQ Auto Deals is a TECHNOLOGY PLATFORM, not a physical car dealership. Never describe it as a car lot, auto dealer, or local business.**

---

## Overview

This is the consumer-facing website for IQ Auto Deals - a nationwide online car marketplace. The project folder is named `priceyourauto` but the live site is **iqautodeals.com**.

**Live URL:** https://iqautodeals.com
**Local Dev Port:** 5050
**Deployment:** Vercel
**Database:** Neon PostgreSQL (cloud-hosted) - SHARED with Scibotix Solutions

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 15.5.7 |
| Language | TypeScript | 5 |
| Frontend | React | 18+ |
| Styling | Tailwind CSS | - |
| Database | PostgreSQL (Prisma) | 6.17.1 |
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
│   │   ├── auth/           # Authentication endpoints
│   │   ├── cars/           # Car listing APIs
│   │   ├── dealer/         # Dealer portal APIs
│   │   ├── customer/       # Customer APIs
│   │   └── admin/          # Admin APIs
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
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # Auth helpers
│   └── sync/               # Inventory sync
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
- Dealers compete for your business

### For Dealers
- Access to qualified buyer leads
- Compete for customer business
- Dealer portal for managing inventory
- Submit offers on deal requests
- Mark vehicles as sold
- Integration with Scibotix Solutions platform

---

## Database Models (Key Tables)

### Shared with Scibotix Solutions
- `User` - User accounts (customers & dealers)
  - Fields: `inventoryFeedUrl`, `inventoryFeedType`, `autoSyncEnabled`, `syncFrequencyDays`, `lastSyncAt`, `lastSyncStatus`, `lastSyncMessage`
- `Car` - Vehicle listings
  - Fields: `slug`, `bodyType`, `trim`, `drivetrain`, `fuelType`, `engine`, `statusChangedAt`

### IQ Auto Deals Specific
- `DealList` - Customer's list of selected cars
- `SelectedCar` - Cars in a deal list with offer prices
- `AcceptedDeal` - Accepted offers (tracks `sold`, `deadDeal`)
- `Blog` - Blog articles
- `ContactSubmission` - Contact form submissions

---

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Cars
- `GET /api/cars` - List cars with filters
- `GET /api/cars/[id]` - Get single car
- `GET /api/car-slug/[id]` - Get car by slug

### Dealer Portal
- `GET /api/dealer/cars` - Get dealer's inventory
- `POST /api/dealer/cars` - Add new car
- `GET /api/dealer/deal-requests` - Get deal requests
- `POST /api/dealer/submit-offer` - Submit offer on deal
- `POST /api/dealer/mark-as-sold` - Mark car as sold
- `POST /api/dealer/cancel-deal` - Cancel a deal
- `POST /api/dealer/dead-deal` - Mark deal as dead
- `GET /api/dealer/profile` - Get dealer profile
- `GET /api/dealer/reports` - Get dealer reports

### Customer Portal
- `GET /api/customer/deal-lists` - Get customer's deal lists
- `POST /api/customer/deal-lists` - Create deal list
- `GET /api/customer/accepted-deals` - Get accepted deals

### Cron Jobs
- `GET /api/cron/auto-sold` - Auto-mark cars as sold after 3 days (daily 4 AM UTC)

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
| `/cars` | Car search/listings with filters |
| `/cars/[slug]` | Individual car details (SEO-friendly URL) |
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
| `/customer/deals` | Active deals |
| `/customer/history` | Deal history |

### Dealer Portal
| Route | Purpose |
|-------|---------|
| `/dealer` | Dealer dashboard with inventory |
| `/dealer/add-car` | Add new vehicle |
| `/dealer/deals` | Deal requests |
| `/dealer/reports` | Sales reports |
| `/dealer/profile` | Dealer profile |

### Admin
| Route | Purpose |
|-------|---------|
| `/admin` | Admin dashboard |

---

## Car URL Slug Format

Car detail pages use SEO-friendly URLs with the following format:

```
/cars/{vin}-{year}-{make}-{model}-{city}-{state}
```

**Example:**
```
/cars/1ftew1cf1gfa15978-2016-ford-f-150-tampa-fl
```

**Key Points:**
- VIN comes first for uniqueness
- All lowercase, special characters replaced with hyphens
- Old UUID URLs (e.g., `/cars/d4d0d49c-...`) automatically 301 redirect to slug URLs
- Middleware in `middleware.ts` handles the redirect by looking up the slug via `/api/car-slug`
- Slug is generated when car is created (dealer portal or inventory sync)

**Slug Generation Files:**
- `app/api/dealer/cars/route.ts` - Manual car creation
- `lib/sync/inventory-sync.ts` - Automated inventory sync

---

## Environment Variables

```bash
# Database (SHARED with Scibotix Solutions)
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

# Cron
CRON_SECRET=...
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
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema (CAREFUL - shared DB!)
npx prisma studio     # Open Prisma Studio

# Deploy (ALWAYS commit first!)
git add -A && git commit -m "message" && git push
vercel --prod

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

Integration endpoints (in Scibotix):
- `/api/iqautodeals/leads`
- `/api/webhooks/iqautodeals/*`

---

## Related Projects

| Project | Path | GitHub Repo | Purpose |
|---------|------|-------------|---------|
| Scibotix Solutions | `/Users/joeduran/scibotix-solutions` | `TechTeamScibotix/iqautodeals` | Dealer platform (CRM, Showroom AI, etc.) |
| IQ Auto Deals Analytics | `/Users/joeduran/iqautodeals-analytics` | - | Geographic analytics dashboard |
| Scibotix Mobile | `/Users/joeduran/scibotix-mobile` | - | Mobile app |

---

## Important Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with all schema components |
| `app/page.tsx` | Homepage |
| `app/sitemap.ts` | Dynamic sitemap generation |
| `prisma/schema.prisma` | Database schema |
| `middleware.ts` | URL redirect middleware (UUID → slug for car pages) |
| `scripts/update-slugs.ts` | Script to batch update car slugs in database |
| `lib/auth.ts` | Password hashing/verification |

---

## Notes

1. **SHARED DATABASE:** This project shares a database with Scibotix Solutions - be careful with schema changes
2. **Project folder name:** `priceyourauto` (historical) but site is `iqautodeals.com`
3. **Dev port:** 5050 (not default 3000)
4. **Schema markup is critical** for SEO differentiation from IQautos.com
5. **Nationwide focus** - emphasize in all content and metadata
6. **PostHog analytics** - tracks user behavior for insights
7. **Dealer outreach files** - CSV files in root for sales outreach
8. **Always commit before deploy:** `vercel --prod` deploys working directory, not just committed code
9. **User table fields:** Inventory sync fields (`inventoryFeedUrl`, `autoSyncEnabled`, etc.) must exist
10. **Car table fields:** SEO fields (`slug`, `bodyType`, `statusChangedAt`, etc.) must exist
