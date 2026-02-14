# IQ Auto Deals - Comprehensive Site Audit
## February 13, 2026

> Based on Semrush AI Brand Performance data, full codebase review, and page-by-page analysis of iqautodeals.com

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Semrush AI Brand Performance Analysis](#semrush-ai-brand-performance-analysis)
3. [Page-by-Page Audit](#page-by-page-audit)
   - [Homepage](#homepage)
   - [About Page](#about-page)
   - [For Dealers Page](#for-dealers-page)
   - [Cars Listing Page](#cars-listing-page)
   - [Vehicle Detail Pages (VIN)](#vehicle-detail-pages)
   - [Make Pages](#make-pages)
   - [Location Pages](#location-pages)
   - [Model Pages](#model-pages)
   - [New Cars Pages](#new-cars-pages)
   - [Blog & Guides](#blog--guides)
   - [Login & Registration](#login--registration)
   - [Legal Pages](#legal-pages)
4. [Cross-Site Critical Issues](#cross-site-critical-issues)
5. [Competitive Gap Analysis](#competitive-gap-analysis)
6. [Prioritized Fix List](#prioritized-fix-list)

---

## Executive Summary

IQ Auto Deals has **0% Share of Voice** in AI search compared to Cars.com, CarGurus, Autotrader, and Edmunds. The site suffers from a classic **"strong product, weak brand"** problem -- the underlying concept (dealer competition model) is genuinely differentiated, but the execution has critical trust, content, and technical gaps that prevent AI systems from recommending it.

**Top 5 issues killing AI visibility:**

1. **Unsubstantiated claims** -- "$5,000 savings", "1,250+ reviews", "16,000+ vehicles" with zero evidence
2. **Fabricated structured data** -- Fake aggregateRating (4.5 stars, 250 reviews) on model pages, wrong schema types on location pages
3. **235+ thin/duplicate template pages** -- Location and model pages are identical templates with city/model name swapped
4. **CTA disconnect** -- Brand promises "dealers compete" but actual button sends lead to ONE dealer
5. **Zero buyer protection messaging** -- No returns, warranties, history reports, or dispute resolution

---

## Semrush AI Brand Performance Analysis

### Share of Voice: 0%

IQ Auto Deals has **zero visibility** in AI-powered search (ChatGPT, Perplexity, Google AI Overviews) compared to:

| Brand | Share of Voice | Favorable Sentiment |
|-------|---------------|-------------------|
| Edmunds | ~25% | 57% |
| Cars.com | ~30% | 42% |
| CarGurus | ~25% | 54% |
| Autotrader | ~20% | 48% |
| **IQ Auto Deals** | **0%** | **30%** |

### Sentiment: 30% Favorable (Lowest)

When AI systems do encounter IQ Auto Deals content, only 30% of the sentiment is favorable -- the lowest of any brand in the competitive set. This is driven by:

- **"Exaggerated savings and predatory finance"** perception risk
- Over-spread across too many business drivers without anchoring on one
- No single defining benefit that AI can associate with the brand

### Business Driver Spread: Over-Dispersed

IQ Auto Deals tries to claim every business driver simultaneously (price savings, dealer competition, AI technology, nationwide coverage, no haggling) without owning any single one. Competitors own clear anchors:

- **CarGurus** → Deal ratings / price transparency
- **Edmunds** → Expert reviews / research authority
- **Cars.com** → Dealer reviews / local connections
- **Autotrader** → Inventory breadth / new + used

**Recommended anchor for IQ Auto Deals:** "Guided, low-anxiety path for younger, payment-focused, non-negotiating buyers"

### AI Perception: "Strong Product, Weak Brand"

In ChatGPT testing, IQ Auto Deals appears as a legitimate marketplace concept but with insufficient trust signals for the AI to recommend it. The AI detects:

- Claims without evidence (savings figures, review counts)
- Template-generated content across hundreds of pages
- Missing buyer protection compared to established competitors
- Schema markup inconsistencies that undermine credibility

---

## Page-by-Page Audit

---

### Homepage

**URL:** `https://iqautodeals.com/`
**Source:** `app/page.tsx`

#### Meta/SEO
- **Title:** "Used Cars for Sale Near You - Compare Prices & Save Hundreds"
- **Description:** "Shop 1000+ quality used cars online. Compare prices from local dealers instantly..."
- **Canonical:** `https://iqautodeals.com`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Featured Inventory renders "Loading..."** | CRITICAL | SSR output shows loading state. Search engines and AI crawlers see no vehicle data on the homepage. |
| 2 | **Meta keywords stuffing** | HIGH | Hundreds of keywords including competitor brand names ("carmax alternative", "better than carvana", "driveway alternative"). Google ignores this tag but it reveals spam-like SEO intent. |
| 3 | **Inconsistent savings claims** | HIGH | Meta says "save hundreds", body says "save hundreds", "Why Choose" section says "save up to $5,000". Three different magnitudes on one page. |
| 4 | **"1000+" vehicles in hero** | MEDIUM | But About page claims "16,000+". Which is it? |
| 5 | **84-month loan calculator** | MEDIUM | Offers 84-month terms without any risk education about negative equity, total interest, or being underwater. Contributes to "predatory finance" perception. |
| 6 | **No FAQ section** | MEDIUM | Homepage has no FAQ, missing a common trust-building element. |
| 7 | **No competitive differentiation** | MEDIUM | "Why Choose Our Nationwide Car Marketplace?" section lists features but never explains how this differs from Cars.com, CarGurus, Autotrader, or Edmunds. |

#### Missing Elements
- No deal ratings or price analysis
- No customer testimonials or reviews
- No security/trust badges
- No media mentions or press logos
- No buyer protection messaging
- No "What is IQ Auto Deals?" explainer

---

### About Page

**URL:** `https://iqautodeals.com/about`
**Source:** `app/about/page.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **"$5,000 Average Buyer Savings" with no source** | CRITICAL | Presented as a fact in the Key Facts stats section. No methodology, no asterisk, no data source. For a company founded in 2024, this needs substantiation. |
| 2 | **"1,250+ Customer Reviews" and "4.8/5 Average Rating"** | CRITICAL | Displayed prominently but there is no link to any review platform (Google, Trustpilot, BBB). Where are these reviews hosted? |
| 3 | **"16,000+ Vehicles Listed"** | HIGH | Homepage says "1000+". About says "16,000+". Contradictory claims. |
| 4 | **Navigation inconsistency** | MEDIUM | Homepage nav: "New Vehicles, Used Vehicles, For Dealers, Research & Reviews, Financing". About nav: "Cars for Sale, About Us, Blog". Three different navs across three pages. |
| 5 | **Anonymous Content Standards** | LOW | "Content Standards" section claims "automotive industry professionals" but names no authors, no credentials, no team bios. |

---

### For Dealers Page

**URL:** `https://iqautodeals.com/for-dealers`
**Source:** `app/for-dealers/page.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Canonical URL bug** | CRITICAL | `<link rel="canonical" href="https://iqautodeals.com">` points to homepage, NOT to `/for-dealers`. Google treats this page as a duplicate of the homepage. Severe indexing issue. |
| 2 | **"Dummy inventory" admission** | CRITICAL | Hero text: "all with dummy inventory. Imagine what it can do with your real vehicles." Admitting fake inventory while claiming 40,000+ clicks severely undermines credibility. |
| 3 | **Anonymous testimonials** | HIGH | 2 of 3 testimonials are from "Early Pilot Dealer" and "Used Car Manager" with no names. The third is from "Rafael Martinez / Industry Expert" (not a dealer customer). |
| 4 | **OG metadata points to homepage** | MEDIUM | OpenGraph title/description are homepage content, not dealer-specific. |
| 5 | **"Save $10,000-$15,000/month" dealer claim** | MEDIUM | Unsubstantiated cost comparison vs competitors. |

---

### Cars Listing Page

**URL:** `https://iqautodeals.com/cars`
**Source:** `app/cars/page.tsx` + `app/cars/CarsClient.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **"Check Availability" sends to ONE dealer** | CRITICAL | Brand promises "dealers compete for your business" but the primary CTA sends a lead to a single dealer. The multi-dealer Deal Request system is hidden behind registration. |
| 2 | **No deal ratings on car cards** | HIGH | Every competitor (CarGurus, Cars.com, Autotrader, Edmunds) shows deal quality indicators (Great Deal, Good Deal, Fair Price). IQ Auto Deals shows none. |
| 3 | **No monthly payment estimates** | HIGH | Competitors show "est. $XXX/mo" on every card. IQ Auto Deals shows nothing. |
| 4 | **No dealer reviews/ratings** | HIGH | Just dealer name and city -- no star ratings, no review counts. |
| 5 | **Client-rendered content invisible to crawlers** | MEDIUM | The interactive listing grid is client-only. Crawlers see only the server-rendered "Current Inventory" text list at the bottom. |
| 6 | **FinancingCalculator component exists but isn't used** | MEDIUM | The component is built and works but is not embedded on `/cars` or any vehicle detail page. |

---

### Vehicle Detail Pages

**URL pattern:** `https://iqautodeals.com/cars/{vin}-{year}-{make}-{model}-{city}-{state}`
**Source:** `app/cars/[id]/page.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **VehicleFAQ still contains old problematic questions** | CRITICAL | FAQ includes "Can I negotiate the price?" (answer: "Yes! Create a free account...") and "What are good alternatives?" -- both contradict the new SEO strategy. |
| 2 | **VehicleFAQSchema has old questions in structured data** | CRITICAL | Schema.org FAQPage markup still includes "Can I negotiate?", "What are good alternatives?", and "What should buyers know before purchasing?" These feed directly into AI search answers. |
| 3 | **"Vehicle history available" is misleading** | HIGH | Green checkmark says "Vehicle history available" but provides NO link to any Carfax/AutoCheck report and shows no actual history data. |
| 4 | **Deal quality always positive** | HIGH | The "Am I getting a good deal?" FAQ generates a positive answer for EVERY vehicle regardless of actual market data. Never says "overpriced" or "above market." |
| 5 | **No monthly payment estimate** | MEDIUM | No financing calculator on the detail page despite the component existing. |
| 6 | **Similar vehicles only from same dealer** | MEDIUM | Sidebar shows vehicles from the same dealer only, not from competing dealers. Contradicts the competitive model. |

---

### Make Pages

**URL pattern:** `https://iqautodeals.com/cars/make/{make}`
**Source:** `app/cars/make/[make]/page.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Title says "Compare Prices" but page shows NO prices** | HIGH | Zero pricing data, no price ranges, no average prices, no market comparisons. Misleading title. |
| 2 | **Generic template content for all makes** | HIGH | Lexus page says "Browse used Lexus SUVs, trucks, sedans" -- Lexus does not make trucks. Template doesn't account for brand-specific vehicle types. |
| 3 | **Static page with no live inventory** | HIGH | No actual listings, no inventory count, no dealer count. Just template text with CTA links. |
| 4 | **"Save thousands" with no evidence** | MEDIUM | No customer savings data, no price comparisons, no case studies. |

---

### Location Pages

**URL pattern:** `https://iqautodeals.com/locations/{city}`
**Source:** `app/locations/[location]/page.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Wrong schema type: `LocalBusiness`** | CRITICAL | IQ Auto Deals is NOT a local business (per CLAUDE.md). Should use `@type: Service` with `areaServed`. Google could penalize for misrepresentation. |
| 2 | **404 errors for natural URL patterns** | CRITICAL | `/locations/atlanta-ga` returns 404 (working URL is `/locations/atlanta`). Same for `/locations/nashville-tn`, `/locations/spokane-wa`. No redirects in middleware for these common patterns. |
| 3 | **180+ pages with 100% duplicate content** | HIGH | Every location page is identical except city/state name substitution. Semrush will flag as thin/duplicate content. |
| 4 | **"500+ quality used cars" in every meta description** | HIGH | Static string, not based on actual inventory per location. Likely inaccurate for most cities. |
| 5 | **Contradictory deal list limits** | MEDIUM | Location pages say "Add up to 20 to your deal list" but other pages say "Select up to 4 vehicles." |
| 6 | **No location-specific content** | MEDIUM | No local market data, no local tax info, no weather-based recommendations, no local dealer names. |
| 7 | **No header/navigation component** | LOW | Inconsistent with other page types. |

---

### Model Pages

**URL pattern:** `https://iqautodeals.com/models/{model-slug}`
**Source:** `app/models/[model]/page.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Fabricated aggregateRating schema** | CRITICAL | Hardcoded `ratingValue: 4.5` and `reviewCount: 250` for EVERY model. No review system exists. This is fake structured data that Google can penalize. |
| 2 | **Fabricated offerCount** | HIGH | `offerCount: 100` is hardcoded for every model, not based on actual inventory. |
| 3 | **Stale "(2025)" in titles** | HIGH | All model page titles say "(2025)" but it is now 2026. |
| 4 | **404 for `ford-f-150` (hyphenated)** | HIGH | Working URL is `ford-f150`. Common search pattern returns 404. No redirect. |
| 5 | **55+ pages with identical template structure** | MEDIUM | Same issue as location pages -- template content with make/model substitution. |
| 6 | **No model-specific content** | MEDIUM | No specs, no trim levels, no year-over-year changes, no reliability data, no owner reviews. |

---

### New Cars Pages

**URL:** `https://iqautodeals.com/new-cars` and `/new-cars/deals`
**Source:** `app/new-cars/page.tsx`, `app/new-cars/deals/page.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **"(2025)" in titles and keywords** | HIGH | Currently 2026. Stale year references across all new-car pages. |
| 2 | **`/new-cars/deals` has zero actual deals** | HIGH | Page called "Deals & Specials" contains only educational content about deal types. No real offers, pricing, or expiration dates. |
| 3 | **Design system inconsistency** | MEDIUM | New-cars pages use newer design tokens (`bg-primary`, `rounded-pill`) while locations/models pages use basic Tailwind. Two visual languages on one site. |

**Strengths:** New-cars/deals page has the best educational content on the site (deal types, buying tips). Good model for other pages.

---

### Blog & Guides

**URLs:** `https://iqautodeals.com/blog`, `/blog/*`, `/guides/*`
**Source:** `app/blog/`, `app/guides/`

**14 total pages:** 3 blog posts + 11 guides

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Stale "2025" year references throughout** | HIGH | Blog titles: "How to Finance a Used Car in 2025", "Best Used Cars Under $20,000 in 2025". Guide titles: "Complete Step-by-Step Guide 2025". All dates show "November 1, 2025". |
| 2 | **Blog index nav is inconsistent** | MEDIUM | Blog header has only "Back to Home" link. Individual blog posts have "Back to Blog". No main site navigation on either. |
| 3 | **No author bios or photos** | MEDIUM | Blog posts reference `authors['editorial-team']` but no author page, no photos, no credentials shown. Hurts E-E-A-T. |
| 4 | **Guide pages link to "Back to Home" not "Back to Guides"** | LOW | Navigation inconsistency between blog posts and guides. |
| 5 | **Guides reference competitor tools positively** | LOW | "How to Buy" guide says "Use Kelley Blue Book, Edmunds, and IQ Auto Deals to see fair market value." Mentioning competitors by name may send users to those sites. |

**Strengths:** Blog posts have proper BlogPosting schema, breadcrumb schema, author attribution, and structured content. This is the best-structured content on the site.

---

### Login & Registration

**URLs:** `/login`, `/register`
**Source:** `app/login/LoginClient.tsx`, `app/register/RegisterClient.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **localStorage for auth** | CRITICAL (Security) | Authentication stored in `localStorage.setItem('user', ...)` instead of httpOnly secure cookies. Vulnerable to XSS attacks. |
| 2 | **No rate limiting on auth endpoints** | CRITICAL (Security) | No brute-force protection. Unlimited password attempts. |
| 3 | **No CAPTCHA on login or registration** | HIGH (Security) | No bot protection. Credential stuffing and fake account risk. |
| 4 | **Console.log of user data in production** | HIGH (Security) | Login handler logs emails and response data to browser console. |
| 5 | **Password hash sent via webhook** | HIGH (Security) | `notifyDealerHubNewDealer` transmits bcrypt password hash to external webhook. |
| 6 | **Hardcoded webhook secret fallback** | HIGH (Security) | `'iq-dealerhub-sync-2024'` as fallback if env var not set. |
| 7 | **No email verification** | MEDIUM | Users auto-login immediately. No confirmation email. Fake account risk. |
| 8 | **6-character password minimum** | MEDIUM | Industry standard is 8+ with complexity requirements. |
| 9 | **No social login** | LOW | Every competitor offers Google Sign-In at minimum. |
| 10 | **Terms link missing from customer TCPA consent** | LOW | Only present in dealer version. |

---

### Legal Pages

**URLs:** `/terms`, `/privacy`
**Source:** `app/terms/TermsClient.tsx`, `app/privacy/PrivacyClient.tsx`

#### Issues Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Dealer fee structure not published** | MEDIUM | Terms say fees are "as agreed upon during registration" with no link to pricing page. |
| 2 | **No cookie consent banner** | MEDIUM | Privacy Notice describes cookies but no opt-in/opt-out mechanism exists. Colorado and Connecticut require this. |
| 3 | **No Do-Not-Track disclosure** | MEDIUM | FTC/CCPA expects disclosure of DNT signal handling. |
| 4 | **Google Analytics opt-out link** | LOW | Links to Google Analytics opt-out tool but site uses PostHog and Vercel Analytics, not GA. Template error. |
| 5 | **No return/refund policy** | LOW | No guidance on what happens if a purchase goes wrong. |

**Strengths:** Privacy Notice is above average -- names specific third-party providers, has structured data collection table, multi-state compliance. No forced arbitration clause (consumer-friendly).

---

## Cross-Site Critical Issues

### 1. The CTA Disconnect (CRITICAL)

**Brand promise:** "Buyers browse vehicles, select up to 4, receive competing dealer offers"

**Actual experience:**
- Every "Check Availability" button sends a lead to ONE dealer
- The Deal Request system is hidden behind: Register → Dashboard → Create Deal List → Add Cars → Wait
- No page explains or promotes the core value proposition in the actual user flow

**Impact:** AI systems read the brand copy about "dealer competition" but see a standard single-dealer lead form. This creates a trust gap that contributes to the 30% favorable sentiment.

### 2. Unsubstantiated Claims (CRITICAL)

| Claim | Where | Evidence Provided |
|-------|-------|-------------------|
| "$5,000 Average Buyer Savings" | About page stats | None |
| "1,250+ Customer Reviews" | About page stats | No link to any review platform |
| "4.8/5 Average Rating" | About page stats | No source attribution |
| "16,000+ Vehicles Listed" | About page stats | Homepage says "1000+" |
| "40,000 clicks in 40 days" | For-Dealers page | Admitted with "dummy inventory" |
| "500+ quality used cars in {City}" | Every location page meta | Static string, not real data |
| "4.5 stars, 250 reviews" | Model page schema | Fabricated, no review system |

### 3. Fabricated Schema Markup (CRITICAL)

| Page Type | Schema Issue | Risk |
|-----------|-------------|------|
| Model pages | `aggregateRating: 4.5 stars, 250 reviews` hardcoded | Google penalty for fake reviews |
| Model pages | `offerCount: 100` hardcoded | False inventory claims in structured data |
| Model pages | `lowPrice: 5000, highPrice: 80000` calculated | Not from real inventory data |
| Location pages | `@type: LocalBusiness` | Wrong type -- IQ Auto Deals is not a local business |
| Location pages | `openingHours: 00:00-23:59` | Misleading when combined with LocalBusiness type |

### 4. Navigation Inconsistency (HIGH)

| Page | Navigation Links |
|------|-----------------|
| Homepage | New Vehicles, Used Vehicles, For Dealers, Research & Reviews, Financing |
| About | Cars for Sale, About Us, Blog |
| For Dealers | Cars for Sale, For Dealers, About Us |
| Cars | New Vehicles, Used Vehicles, For Dealers, Research & Reviews, Financing |
| Blog | Back to Home (only) |
| Locations | No nav header at all |
| Models | No nav header at all |
| New Cars | Proper sticky header with Sign In/Sign Up |

### 5. 235+ Thin/Duplicate Template Pages (HIGH)

- **~180 location pages:** Identical content with city/state substitution only
- **~55 model pages:** Identical content with make/model substitution only
- **~83 make pages:** Identical content with make name substitution only

These pages add no unique value. Semrush and Google will flag them as thin content, diluting the site's overall authority.

### 6. Stale Year References (HIGH)

Every page with a year reference says "2025" instead of "2026":
- Blog titles: "How to Finance a Used Car in 2025"
- Model page titles: "Used Ford F-150 for Sale (2025)"
- New Cars title: "New Cars for Sale (2025)"
- Guide titles: "Complete Step-by-Step Guide 2025"

### 7. Zero Buyer Protection Messaging (HIGH)

Across the entire site, there is NO mention of:
- Return policies or money-back guarantees
- Vehicle history report integration (Carfax/AutoCheck)
- Vehicle inspection requirements
- Warranty information
- Dispute resolution process
- Buyer protection program
- Escrow or payment protection

The "Vehicle history available" checkmark on VDP pages links to nothing.

### 8. VehicleFAQ/Schema Still Has Old Content (HIGH)

Despite the AISEO rewrite removing competitor mentions from vehicle descriptions, the FAQ components still contain:

- **VehicleFAQ.tsx:** "Can I negotiate the price?" with answer "Yes! Create a free account..."
- **VehicleFAQSchema.tsx:** Full structured data for:
  - "Can I negotiate the price on this {year} {make} {model}?"
  - "What are good alternatives to this {year} {make} {model}?"
  - "What should buyers know before purchasing this {year} {make} {model}?"

These directly contradict the new strategy of removing negotiation advice, alternatives, and external research prompts.

---

## Competitive Gap Analysis

### Features Missing vs Every Major Competitor

| Feature | IQ Auto Deals | Cars.com | CarGurus | Autotrader | Edmunds |
|---------|:---:|:---:|:---:|:---:|:---:|
| Deal ratings on listings | -- | Yes | Yes | Yes | Yes |
| Market price analysis | -- | Yes | Yes | Yes | Yes |
| Est. monthly payment on cards | -- | Yes | Yes | Yes | Yes |
| Dealer reviews/ratings | -- | Yes | Yes | Yes | Yes |
| Vehicle history badges | -- | Yes | Yes | Yes | Yes |
| Trade-in value tool | -- | Yes | Yes | Yes | Yes |
| Financing pre-approval | -- | Yes | Yes | Yes | Yes |
| Saved searches/alerts | -- | Yes | Yes | Yes | Yes |
| Side-by-side comparison | -- | Yes | Yes | Yes | Yes |
| Expert editorial reviews | -- | Yes | -- | -- | Yes |
| Social login (Google) | -- | Yes | Yes | Yes | Yes |
| Mobile app | -- | Yes | Yes | Yes | Yes |
| Return/guarantee policy | -- | -- | -- | -- | -- |
| Buyer protection program | -- | -- | -- | -- | -- |
| **Multi-dealer competition** | **Yes** | -- | -- | -- | -- |

**The multi-dealer competition model IS a genuine differentiator** -- but it's buried and not accessible through the primary CTA flow.

---

## Prioritized Fix List

### P0 -- Critical (Blocks AI Trust & Could Trigger Penalties)

| # | Fix | Files Affected | Impact |
|---|-----|---------------|--------|
| 1 | **Remove fabricated aggregateRating from model page schema** | `app/models/[model]/page.tsx` | Eliminates Google penalty risk for fake reviews |
| 2 | **Fix canonical URL on /for-dealers** | `app/for-dealers/page.tsx` | Fixes severe indexing issue |
| 3 | **Remove/replace VehicleFAQ "negotiate" and "alternatives" questions** | `app/components/VehicleFAQ.tsx`, `app/components/VehicleFAQSchema.tsx` | Aligns FAQ with new SEO strategy |
| 4 | **Change location page schema from LocalBusiness to Service** | `app/locations/[location]/page.tsx` | Fixes schema misrepresentation |
| 5 | **Fix or remove unsubstantiated stats** | `app/about/page.tsx` | Remove "1,250+ reviews", "4.8/5 rating", "16,000+ vehicles" or link to verifiable sources |
| 6 | **Remove "dummy inventory" admission from /for-dealers** | `app/for-dealers/page.tsx` | Eliminates self-undermining credibility claim |

### P1 -- High (Major Trust & Content Gaps)

| # | Fix | Files Affected | Impact |
|---|-----|---------------|--------|
| 7 | **Add 301 redirects for location URL variations** | `middleware.ts` | `/atlanta-ga` → `/atlanta`, etc. Captures lost traffic |
| 8 | **Add 301 redirect for `ford-f-150` → `ford-f150`** | `middleware.ts` | Captures common search patterns |
| 9 | **Update all "(2025)" references to "(2026)"** | Model pages, new-cars pages, blog titles, guide titles | Fixes stale content signals |
| 10 | **Unify navigation across all pages** | All page layouts | Consistent brand experience |
| 11 | **Make Featured Inventory SSR-rendered** | `app/page.tsx` | Crawlers see actual vehicle data |
| 12 | **Add real inventory counts to template pages** | Location pages, model pages, make pages | Replaces static fake numbers |
| 13 | **Surface the Deal Request system in the primary CTA flow** | `app/cars/CarsClient.tsx`, VDP pages | Aligns CTA with brand promise |
| 14 | **Remove meta keywords stuffing** | `app/page.tsx` | Remove competitor brand names from meta keywords |
| 15 | **Fix fabricated offerCount and price ranges in model schema** | `app/models/[model]/page.tsx` | Use real inventory data or remove |

### P2 -- Medium (Competitive Parity & Trust Building)

| # | Fix | Files Affected | Impact |
|---|-----|---------------|--------|
| 16 | **Add deal quality indicators to car cards** | `app/cars/CarsClient.tsx` | Even basic "below/at/above market" badges |
| 17 | **Add monthly payment estimates to car cards** | `app/cars/CarsClient.tsx` | Match competitor UX |
| 18 | **Embed FinancingCalculator on VDP** | `app/cars/[id]/page.tsx` | Free tool that already exists, just needs placement |
| 19 | **Add unique content to location pages** | `app/locations/[location]/page.tsx` | Local market data, tax info, weather recommendations |
| 20 | **Add unique content to model pages** | `app/models/[model]/page.tsx` | Specs, trim levels, reliability data |
| 21 | **Fix 84-month loan calculator** | `app/page.tsx` | Add risk education about long loan terms |
| 22 | **Standardize savings claims** | All pages | Pick one consistent number and methodology |
| 23 | **Add breadcrumbs to all pages** | All page layouts | Improves navigation and schema |
| 24 | **Unify design system** | Location/model pages vs new-cars pages | One visual language site-wide |
| 25 | **Add cookie consent mechanism** | Root layout | Multi-state compliance |

### P3 -- Lower Priority (Security & Polish)

| # | Fix | Files Affected | Impact |
|---|-----|---------------|--------|
| 26 | **Move auth from localStorage to httpOnly cookies** | Login, Register, auth flow | Fixes XSS vulnerability |
| 27 | **Add rate limiting to auth endpoints** | `/api/auth/login`, `/api/auth/register` | Prevents brute force |
| 28 | **Add CAPTCHA to login/registration** | Login, Register pages | Prevents bot accounts |
| 29 | **Remove console.log from production auth** | `app/login/LoginClient.tsx` | Prevents data leakage |
| 30 | **Stop sending password hash via webhook** | `/api/auth/register/route.ts` | Security anti-pattern |
| 31 | **Remove hardcoded webhook secret fallback** | `/api/auth/register/route.ts` | Credential in source code |
| 32 | **Add email verification flow** | Registration flow | Reduces fake accounts |
| 33 | **Increase password minimum to 8 chars** | Registration validation | Industry standard |
| 34 | **Fix Google Analytics opt-out link in privacy policy** | `app/privacy/PrivacyClient.tsx` | Site uses PostHog, not GA |
| 35 | **Add Do-Not-Track disclosure** | Privacy policy | FTC/CCPA compliance |
| 36 | **Add Terms link to customer TCPA consent** | `app/register/RegisterClient.tsx` | Currently only in dealer version |

---

## Solutions Summary (No Code Changes)

### Immediate wins (can fix in 1-2 sessions):
1. Remove fabricated schema data (aggregateRating, offerCount)
2. Fix /for-dealers canonical URL
3. Update VehicleFAQ/VehicleFAQSchema to remove old questions
4. Change location schema from LocalBusiness to Service
5. Update "(2025)" → "(2026)" everywhere
6. Add URL redirects in middleware for common patterns
7. Remove "dummy inventory" text from /for-dealers

### Short-term (1-2 weeks):
1. Unify navigation across all pages
2. SSR the Featured Inventory section
3. Surface Deal Request system in primary CTA
4. Add real inventory counts to template pages
5. Remove/replace unverifiable stats
6. Embed FinancingCalculator on VDP

### Medium-term (2-4 weeks):
1. Add deal quality indicators (requires market data integration)
2. Add unique content to location and model pages
3. Unify design system
4. Add cookie consent
5. Move auth to httpOnly cookies
6. Add rate limiting and CAPTCHA

### Long-term (1-3 months):
1. Build trade-in value tool
2. Build saved searches/alerts
3. Build dealer reviews system
4. Build vehicle comparison tool
5. Build real buyer protection program
6. Launch mobile app

---

*Audit conducted February 13, 2026. All findings based on source code review and live page analysis.*
