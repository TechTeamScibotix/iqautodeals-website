# IQ Auto Deals - Infrastructure & High-Level Architecture

## Complete System Infrastructure Map

This document provides a visual representation of the complete infrastructure, showing how all services connect from the domain registration through to data storage.

---

## Table of Contents
1. [Infrastructure Overview](#infrastructure-overview)
2. [DNS & Domain Routing](#dns--domain-routing)
3. [Request Flow Architecture](#request-flow-architecture)
4. [Service Connections](#service-connections)
5. [Data Flow Routes](#data-flow-routes)
6. [Complete End-to-End Flow](#complete-end-to-end-flow)

---

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IQ AUTO DEALS - COMPLETE INFRASTRUCTURE                  │
└─────────────────────────────────────────────────────────────────────────────┘


                              INTERNET (Public Web)
                                       │
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
              [HTTP/HTTPS Request]              [HTTP/HTTPS Request]
                    │                                     │
                    ▼                                     ▼
        ┌────────────────────────┐          ┌────────────────────────┐
        │   iqautodeals.com      │          │  www.iqautodeals.com   │
        │   (Apex Domain)        │          │  (WWW Subdomain)       │
        └───────────┬────────────┘          └──────────┬─────────────┘
                    │                                  │
                    └──────────────┬───────────────────┘
                                   │
                                   │ DNS Resolution
                                   ▼
        ┌──────────────────────────────────────────────────────────┐
        │              GODADDY (Domain Registrar)                  │
        ├──────────────────────────────────────────────────────────┤
        │  Domain Owner: IQ Auto Deals                             │
        │  Registered: iqautodeals.com                             │
        │                                                          │
        │  DNS Configuration:                                      │
        │  ┌────────────────────────────────────────────┐         │
        │  │  Nameservers (Delegated to Vercel):       │         │
        │  │  • ns1.vercel-dns.com                      │         │
        │  │  • ns2.vercel-dns.com                      │         │
        │  └────────────────────────────────────────────┘         │
        └───────────────────────────┬──────────────────────────────┘
                                    │
                                    │ DNS Lookup
                                    ▼
        ┌──────────────────────────────────────────────────────────┐
        │           VERCEL DNS (Nameserver Authority)              │
        ├──────────────────────────────────────────────────────────┤
        │  DNS Records:                                            │
        │  ┌────────────────────────────────────────────┐         │
        │  │  @ (apex)     ALIAS  → Vercel Edge IP      │         │
        │  │  www          CNAME  → cname.vercel-dns.com│         │
        │  │  CAA          0      → letsencrypt.org     │         │
        │  │  TXT (verify) →  google-site-verification │         │
        │  └────────────────────────────────────────────┘         │
        │                                                          │
        │  Resolves to:                                            │
        │  • 76.76.21.21 (Vercel Edge IP)                         │
        │  • 76.223.105.230 (Vercel Edge IP)                      │
        │  • 13.248.243.5 (Vercel Edge IP)                        │
        └───────────────────────────┬──────────────────────────────┘
                                    │
                                    │ Routes traffic to
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         VERCEL PLATFORM                                   │
│                    (Hosting & Edge Network)                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │                    VERCEL EDGE NETWORK                      │        │
│  │               (Global CDN & Load Balancing)                 │        │
│  ├─────────────────────────────────────────────────────────────┤        │
│  │                                                             │        │
│  │  • SSL/TLS Termination (Auto HTTPS)                        │        │
│  │  • DDoS Protection                                         │        │
│  │  • Geographic Load Balancing                               │        │
│  │  • Edge Caching                                            │        │
│  │  • Request Routing                                         │        │
│  │                                                             │        │
│  │  Edge Locations:                                           │        │
│  │  • IAD (Washington DC) - Primary                           │        │
│  │  • SFO (San Francisco)                                     │        │
│  │  • LHR (London)                                            │        │
│  │  • + 70+ global locations                                  │        │
│  └──────────────────────────┬──────────────────────────────────┘        │
│                             │                                            │
│                             │ Routes to                                  │
│                             ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │              SERVERLESS FUNCTIONS (AWS Lambda)              │        │
│  │                   us-east-1 (Virginia)                      │        │
│  ├─────────────────────────────────────────────────────────────┤        │
│  │                                                             │        │
│  │  Runtime: Node.js 20.x                                     │        │
│  │  Framework: Next.js 15.1.6                                 │        │
│  │                                                             │        │
│  │  Function Types:                                           │        │
│  │  ┌───────────────────────────────────────────┐            │        │
│  │  │  1. Page Rendering (SSR/ISR)              │            │        │
│  │  │     • React Server Components             │            │        │
│  │  │     • Dynamic routes                      │            │        │
│  │  │                                           │            │        │
│  │  │  2. API Routes (Serverless APIs)          │            │        │
│  │  │     • /api/auth/*                         │            │        │
│  │  │     • /api/customer/*                     │            │        │
│  │  │     • /api/dealer/*                       │            │        │
│  │  │     • /api/upload                         │            │        │
│  │  │     • /api/featured-cars                  │            │        │
│  │  │                                           │            │        │
│  │  │  3. Middleware                            │            │        │
│  │  │     • Request interception                │            │        │
│  │  └───────────────────────────────────────────┘            │        │
│  │                                                             │        │
│  │  Environment Variables (Injected):                         │        │
│  │  • DATABASE_URL                                            │        │
│  │  • NEXTAUTH_SECRET                                         │        │
│  │  • NEXTAUTH_URL                                            │        │
│  │  • BLOB_READ_WRITE_TOKEN                                   │        │
│  └──────────────────────────┬──────────────────────────────────┘        │
│                             │                                            │
└─────────────────────────────┼────────────────────────────────────────────┘
                              │
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│  VERCEL BLOB   │  │  NEON DATABASE   │  │     VERCEL      │
│   STORAGE      │  │   (PostgreSQL)   │  │   ANALYTICS     │
└────────────────┘  └──────────────────┘  └─────────────────┘
```

---

## DNS & Domain Routing

### Complete DNS Resolution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DNS RESOLUTION FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘


Step 1: User enters URL
────────────────────────
User types: https://iqautodeals.com
           or
           https://www.iqautodeals.com


Step 2: Browser DNS Lookup
───────────────────────────
Browser → Local DNS Cache
   │
   ├─ Cache Hit? → Use cached IP
   │
   └─ Cache Miss? → Query DNS Resolver


Step 3: DNS Resolver Query Chain
─────────────────────────────────

┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ "What's the IP for iqautodeals.com?"
       ▼
┌──────────────────┐
│  ISP DNS Resolver│  (e.g., 8.8.8.8, 1.1.1.1)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Root DNS Server │  (.)
└──────┬───────────┘
       │ "Ask .com nameserver"
       ▼
┌──────────────────┐
│  TLD DNS Server  │  (.com)
└──────┬───────────┘
       │ "iqautodeals.com uses ns1.vercel-dns.com"
       ▼
┌─────────────────────────────────────────┐
│    GODADDY DOMAIN REGISTRATION          │
│    (Authoritative for nameservers)      │
├─────────────────────────────────────────┤
│                                         │
│  Domain: iqautodeals.com                │
│  Registrar: GoDaddy                     │
│  Status: Active                         │
│                                         │
│  Nameserver Delegation:                 │
│  ┌───────────────────────────┐         │
│  │  ns1.vercel-dns.com       │◄────────┼─── Points to Vercel
│  │  ns2.vercel-dns.com       │◄────────┼─── Points to Vercel
│  └───────────────────────────┘         │
│                                         │
│  Note: GoDaddy only stores domain       │
│  registration. DNS management           │
│  delegated to Vercel.                   │
└──────────────┬──────────────────────────┘
               │
               │ "Query Vercel DNS"
               ▼
┌─────────────────────────────────────────┐
│       VERCEL DNS NAMESERVERS            │
│    (Authoritative for iqautodeals.com)  │
├─────────────────────────────────────────┤
│                                         │
│  Zone: iqautodeals.com                  │
│                                         │
│  DNS Records:                           │
│  ┌─────────────────────────────────┐   │
│  │ Record Type  Name   Value        │   │
│  ├─────────────────────────────────┤   │
│  │ ALIAS        @      76.76.21.21 │   │
│  │                     (Vercel Edge)│   │
│  │                                  │   │
│  │ ALIAS        @      76.223.105.2│   │
│  │                     (Vercel Edge)│   │
│  │                                  │   │
│  │ CNAME        www    cname.vercel-│   │
│  │                     dns.com      │   │
│  │                                  │   │
│  │ CAA          @      letsencrypt. │   │
│  │                     org          │   │
│  │                                  │   │
│  │ TXT          @      google-site- │   │
│  │                     verification │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │
               │ Returns IP addresses
               ▼
┌──────────────────┐
│  ISP DNS Resolver│
└──────┬───────────┘
       │ IP: 76.76.21.21
       ▼
┌──────────────┐
│   Browser    │
└──────────────┘

Browser now has IP address and connects via HTTPS


Step 4: HTTPS Connection to Vercel Edge
────────────────────────────────────────

Browser connects to: 76.76.21.21:443

┌──────────────┐         TLS Handshake         ┌──────────────┐
│   Browser    │◄──────────────────────────────►│ Vercel Edge  │
└──────────────┘                                └──────────────┘
                                                        │
                SSL Certificate:                        │
                • Issued by: Let's Encrypt              │
                • Valid for: iqautodeals.com,           │
                             www.iqautodeals.com        │
                • Auto-renewed by Vercel                │
                                                        │
                                                        ▼
                                          Route to Next.js App
```

### DNS Record Details

```
┌─────────────────────────────────────────────────────────────────┐
│              VERCEL DNS ZONE: iqautodeals.com                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Record ID: rec_ffd69fc8299909ab642dbec8                       │
│  ┌─────────────────────────────────────────────────┐          │
│  │ Type:    ALIAS                                  │          │
│  │ Name:    @ (apex domain)                        │          │
│  │ Value:   387116e6f5326092.vercel-dns-017.com    │          │
│  │ TTL:     Default                                │          │
│  │ Purpose: Route apex domain to Vercel            │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
│  Record ID: rec_2f492e14ab50adb069d56ae8                       │
│  ┌─────────────────────────────────────────────────┐          │
│  │ Type:    TXT                                    │          │
│  │ Name:    @                                      │          │
│  │ Value:   google-site-verification=N3HZ1t...     │          │
│  │ Purpose: Google Search Console verification     │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │ Type:    CAA                                    │          │
│  │ Name:    @                                      │          │
│  │ Value:   0 issue "letsencrypt.org"              │          │
│  │ Purpose: Authorize Let's Encrypt for SSL certs  │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │ Type:    ALIAS (wildcard)                       │          │
│  │ Name:    *                                      │          │
│  │ Value:   cname.vercel-dns-017.com               │          │
│  │ Purpose: Catch-all for subdomains               │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Architecture

### Complete HTTP Request Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    END-TO-END REQUEST FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: CLIENT (Browser)                                             │
└────────────────────────────────────────────────────────────────────────┘
         │
         │ User Action: Navigate to iqautodeals.com/customer
         │
         ▼
┌────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: DNS RESOLUTION                                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Browser DNS Cache → ISP DNS → GoDaddy (nameserver info) →            │
│  Vercel DNS (returns IP: 76.76.21.21)                                 │
│                                                                        │
└────────────┬───────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: VERCEL EDGE NETWORK                                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Step 1: TLS/SSL Termination                                          │
│  ┌──────────────────────────────────────────┐                        │
│  │  • HTTPS handshake                       │                        │
│  │  • Certificate validation (Let's Encrypt)│                        │
│  │  • Decrypt request                       │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
│  Step 2: Edge Middleware                                              │
│  ┌──────────────────────────────────────────┐                        │
│  │  • Rate limiting                         │                        │
│  │  • DDoS protection                       │                        │
│  │  • Request logging                       │                        │
│  │  • Header manipulation                   │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
│  Step 3: Cache Check                                                  │
│  ┌──────────────────────────────────────────┐                        │
│  │  Cache Hit?                              │                        │
│  │  ├─ Yes → Return cached response         │                        │
│  │  └─ No  → Continue to origin             │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
│  Step 4: Geographic Routing                                           │
│  ┌──────────────────────────────────────────┐                        │
│  │  Route to nearest region:                │                        │
│  │  • User in US → us-east-1 (IAD)          │                        │
│  │  • User in EU → eu-west-1 (LHR)          │                        │
│  │  • User in Asia → ap-southeast-1 (SIN)   │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
└────────────┬───────────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────────────┐
│  LAYER 4: VERCEL SERVERLESS FUNCTION (AWS Lambda)                      │
│  Region: us-east-1 (N. Virginia)                                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Container: Node.js 20.x                                              │
│                                                                        │
│  Step 1: Cold Start / Warm Start                                      │
│  ┌──────────────────────────────────────────┐                        │
│  │  Cold Start (first request):             │                        │
│  │  • Spin up container (~500ms)            │                        │
│  │  • Load Next.js runtime                  │                        │
│  │  • Initialize Prisma Client              │                        │
│  │                                          │                        │
│  │  Warm Start (subsequent):                │                        │
│  │  • Reuse existing container (~50ms)      │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
│  Step 2: Next.js App Router Processing                                │
│  ┌──────────────────────────────────────────┐                        │
│  │  Request: GET /customer                  │                        │
│  │                                          │                        │
│  │  1. Match route: /app/customer/page.tsx  │                        │
│  │  2. Check auth (client-side, no server)  │                        │
│  │  3. Server Component rendering            │                        │
│  │  4. Data fetching (if ISR/SSR)           │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
│  OR                                                                    │
│                                                                        │
│  Step 2b: API Route Processing                                        │
│  ┌──────────────────────────────────────────┐                        │
│  │  Request: POST /api/customer/deal-request│                        │
│  │                                          │                        │
│  │  1. Match route handler                  │                        │
│  │  2. Parse request body                   │                        │
│  │  3. Validate input                       │                        │
│  │  4. Execute business logic               │                        │
│  │  5. Database operations (see Layer 5)    │                        │
│  │  6. Return JSON response                 │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
└────────────┬───────────────────────────────────────────────────────────┘
             │
             │ (If database access needed)
             ▼
┌────────────────────────────────────────────────────────────────────────┐
│  LAYER 5: DATABASE CONNECTION (Prisma → Neon)                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Step 1: Connection Pooling                                           │
│  ┌──────────────────────────────────────────┐                        │
│  │  Prisma Client establishes connection    │                        │
│  │  via DATABASE_URL:                       │                        │
│  │                                          │                        │
│  │  postgresql://user:pass@                │                        │
│  │    ep-xyz.us-east-1.aws.neon.tech:5432   │                        │
│  │    /neondb                               │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
│  Step 2: Query Execution                                              │
│  ┌──────────────────────────────────────────┐                        │
│  │  Prisma generates SQL:                   │                        │
│  │                                          │                        │
│  │  SELECT * FROM "User"                    │                        │
│  │  WHERE "email" = 'user@example.com'      │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
└────────────┬───────────────────────────────────────────────────────────┘
             │
             │ TCP/IP over AWS PrivateLink or Public Internet
             ▼
┌────────────────────────────────────────────────────────────────────────┐
│  LAYER 6: NEON DATABASE (PostgreSQL)                                   │
│  Region: AWS us-east-1 (Same as Lambda for low latency)                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Neon Compute Node (Serverless)                                       │
│  ┌──────────────────────────────────────────┐                        │
│  │  • Auto-scaling based on load            │                        │
│  │  • Auto-suspend after 5 min idle         │                        │
│  │  • Auto-resume on query                  │                        │
│  │  • Connection pooler (PgBouncer)         │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
│  Query Processing:                                                     │
│  1. Parse SQL                                                         │
│  2. Query planner                                                     │
│  3. Execute on storage layer                                          │
│  4. Return result set                                                 │
│                                                                        │
│  Storage Layer:                                                        │
│  • Data stored in AWS S3 (durable)                                    │
│  • Hot data cached in compute node                                    │
│  • Point-in-time recovery enabled                                     │
│                                                                        │
└────────────┬───────────────────────────────────────────────────────────┘
             │
             │ Return query results
             ▼
┌────────────────────────────────────────────────────────────────────────┐
│  RESPONSE PATH (Reverse of request)                                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Database → Prisma → Lambda Function → Vercel Edge → Browser          │
│                                                                        │
│  Response Headers:                                                     │
│  ┌──────────────────────────────────────────┐                        │
│  │  server: Vercel                          │                        │
│  │  x-vercel-cache: HIT/MISS/PRERENDER      │                        │
│  │  x-vercel-id: iad1::xyz-timestamp-id     │                        │
│  │  cache-control: public, max-age=0,       │                        │
│  │                 must-revalidate          │                        │
│  │  content-type: text/html; charset=utf-8  │                        │
│  └──────────────────────────────────────────┘                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Service Connections

### Service Connection Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVICE INTERCONNECTIONS                             │
└─────────────────────────────────────────────────────────────────────────┘


                    ┌──────────────────────────┐
                    │       GODADDY            │
                    │   (Domain Registrar)     │
                    ├──────────────────────────┤
                    │  iqautodeals.com         │
                    │                          │
                    │  Nameservers:            │
                    │  → ns1.vercel-dns.com    │
                    │  → ns2.vercel-dns.com    │
                    └──────────┬───────────────┘
                               │
                               │ DNS Delegation
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          VERCEL PLATFORM                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │              1. VERCEL DNS                                 │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │  • Authoritative nameserver for iqautodeals.com            │        │
│  │  • Manages all DNS records                                 │        │
│  │  • Auto SSL certificate provisioning                       │        │
│  └────────────────────────────────────────────────────────────┘        │
│                             │                                           │
│                             │ Routes traffic                            │
│                             ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │              2. VERCEL EDGE NETWORK                        │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │  Global CDN with 70+ locations                             │        │
│  │  • SSL/TLS termination                                     │        │
│  │  • DDoS protection                                         │        │
│  │  • Edge caching                                            │        │
│  │  • Request routing                                         │        │
│  └────────────────────────────────────────────────────────────┘        │
│                             │                                           │
│                             │ Forwards to                               │
│                             ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │         3. VERCEL SERVERLESS FUNCTIONS                     │        │
│  │            (AWS Lambda - us-east-1)                        │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │  Next.js App:                                              │        │
│  │  • Server-side rendering                                   │        │
│  │  • API routes                                              │        │
│  │  • Business logic                                          │        │
│  │                                                             │        │
│  │  Environment:                                              │        │
│  │  • DATABASE_URL (connects to Neon) ──────────────┐        │        │
│  │  • BLOB_READ_WRITE_TOKEN (connects to Blob) ─────┼───┐    │        │
│  │  • NEXTAUTH_SECRET                                │   │    │        │
│  │  • NEXTAUTH_URL                                   │   │    │        │
│  └───────────────────────────────────────────────────┼───┼────┘        │
│                                                       │   │             │
└───────────────────────────────────────────────────────┼───┼─────────────┘
                                                        │   │
                    ┌───────────────────────────────────┘   │
                    │                                       │
                    ▼                                       ▼
    ┌───────────────────────────┐         ┌─────────────────────────────┐
    │     NEON DATABASE         │         │    VERCEL BLOB STORAGE      │
    │   (PostgreSQL Cloud)      │         │    (Image/File Storage)     │
    ├───────────────────────────┤         ├─────────────────────────────┤
    │                           │         │                             │
    │ Provider: Neon.tech       │         │ Provider: Vercel            │
    │ Region: us-east-1 (AWS)   │         │ Backend: AWS S3             │
    │ Type: Serverless Postgres │         │                             │
    │                           │         │ Usage:                      │
    │ Connection:               │         │ • Car photos                │
    │ • Host: ep-*.neon.tech    │         │ • User uploads              │
    │ • Port: 5432              │         │                             │
    │ • SSL: Required           │         │ Access:                     │
    │ • Pooling: PgBouncer      │         │ • Public URLs               │
    │                           │         │ • CDN-backed                │
    │ Features:                 │         │                             │
    │ • Auto-scaling            │         │ API Endpoint:               │
    │ • Auto-suspend (5min)     │         │ POST /api/upload            │
    │ • Point-in-time recovery  │         │                             │
    │ • Branching (DB per env)  │         │ Max File: 10 MB             │
    │                           │         │ Types: JPEG, PNG, WebP      │
    │ Storage:                  │         │                             │
    │ • Backed by AWS S3        │         │                             │
    │ • Separate compute/storage│         │                             │
    └───────────────────────────┘         └─────────────────────────────┘
                    │
                    │ Monitored by
                    ▼
    ┌───────────────────────────┐
    │   VERCEL ANALYTICS        │
    │   (Application Metrics)   │
    ├───────────────────────────┤
    │                           │
    │ Tracks:                   │
    │ • Page views              │
    │ • User sessions           │
    │ • Web vitals (LCP, FID)   │
    │ • Geographic data         │
    │ • Performance metrics     │
    │                           │
    │ Integration:              │
    │ <Analytics /> component   │
    │ in root layout            │
    └───────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW BETWEEN SERVICES                         │
└─────────────────────────────────────────────────────────────────────────┘

Request Path:
─────────────
User → GoDaddy (nameserver lookup) → Vercel DNS (IP resolution) →
Vercel Edge (SSL/routing) → Lambda Function (app logic) →
Neon DB (data query) → Response back through chain


Image Upload Path:
──────────────────
User → Upload form → POST /api/upload → Vercel Blob put() →
AWS S3 storage → Return public URL → Store URL in Neon DB


Analytics Path:
───────────────
Page load → <Analytics /> component → Beacon to Vercel →
Analytics dashboard (analytics.vercel.com)
```

---

## Data Flow Routes

### Database Connection Details

```
┌─────────────────────────────────────────────────────────────────────────┐
│              VERCEL LAMBDA → NEON DATABASE CONNECTION                   │
└─────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────┐
│  Vercel Lambda Function        │
│  (us-east-1)                   │
└────────────┬───────────────────┘
             │
             │ Environment Variable:
             │ DATABASE_URL
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│  Connection String:                                          │
│  postgresql://[username]:[password]@                         │
│    ep-[identifier].us-east-1.aws.neon.tech:5432/neondb      │
│                                                              │
│  Breaking down the URL:                                      │
│  ┌────────────────────────────────────────────────┐         │
│  │ Protocol:  postgresql://                       │         │
│  │ Username:  [generated by Neon]                 │         │
│  │ Password:  [secure token]                      │         │
│  │ Host:      ep-xyz.us-east-1.aws.neon.tech      │         │
│  │ Port:      5432 (standard PostgreSQL)          │         │
│  │ Database:  neondb                              │         │
│  │ SSL Mode:  require (forced by Neon)            │         │
│  └────────────────────────────────────────────────┘         │
└────────────┬─────────────────────────────────────────────────┘
             │
             │ Prisma Client connects
             ▼
┌──────────────────────────────────────────────────────────────┐
│  Neon Connection Architecture                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Connection Pooler (PgBouncer)                       │
│  ┌────────────────────────────────────────────────┐         │
│  │  • Accepts client connections                  │         │
│  │  • Connection pooling (transaction mode)       │         │
│  │  • Max connections: 100 per database           │         │
│  │  • Timeout: 30 seconds                         │         │
│  └────────────────────────────────────────────────┘         │
│               │                                              │
│               ▼                                              │
│  Step 2: Neon Proxy                                          │
│  ┌────────────────────────────────────────────────┐         │
│  │  • Routes to correct compute endpoint          │         │
│  │  • Auto-wake if compute is suspended           │         │
│  │  • Load balancing across replicas              │         │
│  └────────────────────────────────────────────────┘         │
│               │                                              │
│               ▼                                              │
│  Step 3: Compute Node (PostgreSQL 16)                        │
│  ┌────────────────────────────────────────────────┐         │
│  │  • Executes queries                            │         │
│  │  • Transaction management                      │         │
│  │  • Query cache                                 │         │
│  │  • Auto-suspend: 5 minutes idle                │         │
│  │  • Cold start: ~500ms wake time                │         │
│  └────────────────────────────────────────────────┘         │
│               │                                              │
│               ▼                                              │
│  Step 4: Storage Layer (Pageserver)                          │
│  ┌────────────────────────────────────────────────┐         │
│  │  • Stores data pages                           │         │
│  │  • Backed by AWS S3                            │         │
│  │  • Separated from compute                      │         │
│  │  • Multi-version concurrency control (MVCC)    │         │
│  │  • Point-in-time recovery (7 days retention)   │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
└──────────────────────────────────────────────────────────────┘


Network Path:
─────────────

Vercel Lambda (AWS us-east-1)
       │
       │ TCP/IP over AWS network
       │ (Low latency: ~1-5ms same region)
       ▼
Neon Proxy (AWS us-east-1)
       │
       │
       ▼
PostgreSQL Compute (AWS us-east-1)
       │
       │
       ▼
S3 Storage (AWS us-east-1)


Security:
─────────
• All connections require SSL/TLS
• Passwords never in plain text
• Database credentials in Vercel env vars (encrypted at rest)
• Network isolation via VPC (Neon side)
• IP allowlist option available (not currently used)
```

### Image Storage Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 IMAGE UPLOAD & STORAGE FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘


Step 1: User uploads photo
──────────────────────────

┌────────────────┐
│  Browser       │
│  (Dealer adds  │
│   car listing) │
└────────┬───────┘
         │
         │ 1. User selects image file
         │ 2. File added to FormData
         │
         ▼
┌──────────────────────────────────────┐
│  JavaScript (Client-side)            │
├──────────────────────────────────────┤
│  const formData = new FormData()     │
│  formData.append('file', imageFile)  │
│                                      │
│  fetch('/api/upload', {              │
│    method: 'POST',                   │
│    body: formData                    │
│  })                                  │
└────────┬─────────────────────────────┘
         │
         │ HTTP POST multipart/form-data
         ▼


Step 2: Vercel Edge receives request
─────────────────────────────────────

┌──────────────────────────────────────┐
│  Vercel Edge Network                 │
├──────────────────────────────────────┤
│  • Validates request                 │
│  • Routes to /api/upload handler     │
│  • Forwards multipart data           │
└────────┬─────────────────────────────┘
         │
         ▼


Step 3: Upload API handler processing
──────────────────────────────────────

┌──────────────────────────────────────────────────────────┐
│  /api/upload/route.ts                                    │
│  (Lambda Function)                                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. Extract file from FormData                           │
│     const file = formData.get('file')                    │
│                                                          │
│  2. Validate file type                                   │
│     Allowed: image/jpeg, image/png, image/webp           │
│     Reject others → 400 error                            │
│                                                          │
│  3. Validate file size                                   │
│     Max: 10 MB (10,485,760 bytes)                        │
│     Exceed → 400 error                                   │
│                                                          │
│  4. Generate unique filename                             │
│     Format: ${timestamp}-${random}.${ext}                │
│     Example: 1698765432-abc123.jpg                       │
│                                                          │
│  5. Upload to Vercel Blob                                │
│     import { put } from '@vercel/blob'                   │
│                                                          │
│     const blob = await put(filename, file, {             │
│       access: 'public',                                  │
│       token: process.env.BLOB_READ_WRITE_TOKEN           │
│     })                                                   │
│                                                          │
└────────┬─────────────────────────────────────────────────┘
         │
         │ API call to Vercel Blob service
         ▼


Step 4: Vercel Blob Storage
────────────────────────────

┌──────────────────────────────────────────────────────────┐
│  Vercel Blob Service                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Backend: AWS S3 (Vercel-managed bucket)                 │
│  Region: Auto-selected (closest to function)             │
│                                                          │
│  Process:                                                │
│  1. Authenticate with token                              │
│  2. Generate unique blob ID                              │
│  3. Store in S3 bucket                                   │
│  4. Configure public access                              │
│  5. Return public URL                                    │
│                                                          │
│  Generated URL format:                                   │
│  https://[blob-id].public.blob.vercel-storage.com/       │
│    [filename]?[signature]                                │
│                                                          │
│  Example:                                                │
│  https://abc123def456.public.blob.vercel-storage.com/    │
│    1698765432-xyz.jpg?signature=sig123                   │
│                                                          │
│  Features:                                               │
│  • CDN-backed (fast global access)                       │
│  • Automatic HTTPS                                       │
│  • No expiration (permanent storage)                     │
│  • Automatic image optimization on request               │
│                                                          │
└────────┬─────────────────────────────────────────────────┘
         │
         │ Returns URL
         ▼


Step 5: Store URL in database
──────────────────────────────

┌──────────────────────────────────────────────────────────┐
│  /api/upload/route.ts (continued)                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Return JSON response:                                   │
│  {                                                       │
│    "url": "https://abc.public.blob.vercel-storage.com/   │
│            image.jpg?sig=xyz"                            │
│  }                                                       │
│                                                          │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Client receives URL                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend adds URL to photos array:                      │
│  photos: [                                               │
│    "https://blob1.public.blob.vercel-storage.com/...",   │
│    "https://blob2.public.blob.vercel-storage.com/...",   │
│  ]                                                       │
│                                                          │
│  When creating/updating car:                             │
│  POST /api/dealer/cars                                   │
│  {                                                       │
│    make: "Toyota",                                       │
│    model: "Camry",                                       │
│    photos: JSON.stringify(photos)  ← URLs stored as JSON │
│  }                                                       │
│                                                          │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Neon Database                                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Car table:                                              │
│  ┌────────────────────────────────────────┐             │
│  │ id         | uuid                      │             │
│  │ make       | Toyota                    │             │
│  │ model      | Camry                     │             │
│  │ photos     | ["https://blob1...",      │             │
│  │            |  "https://blob2..."]      │             │
│  │            | ↑ JSON string             │             │
│  └────────────────────────────────────────┘             │
│                                                          │
└──────────────────────────────────────────────────────────┘


Step 6: Displaying images
──────────────────────────

When customer views car listing:

┌──────────────────────────────────────┐
│  Frontend fetches car data           │
│  GET /api/customer/search            │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Parse photos JSON string            │
│  const photos = JSON.parse(car.photos)│
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Render images                       │
│  {photos.map(url => (                │
│    <img src={url} alt="Car" />       │
│  ))}                                 │
└────────┬─────────────────────────────┘
         │
         │ Browser fetches from CDN
         ▼
┌──────────────────────────────────────┐
│  Vercel Blob CDN                     │
│  • Fast delivery (edge-cached)       │
│  • Auto WebP conversion              │
│  • Responsive sizing                 │
└──────────────────────────────────────┘
```

---

## Complete End-to-End Flow

### Example: Customer Searches for Cars

```
┌─────────────────────────────────────────────────────────────────────────┐
│        COMPLETE FLOW: Customer Searches for Toyota Camry in GA          │
└─────────────────────────────────────────────────────────────────────────┘


[1] User Action
────────────────
User: Goes to iqautodeals.com/customer
      Enters: Make="Toyota", Model="Camry", State="GA"
      Clicks: Search


[2] DNS Resolution (100-200ms)
───────────────────────────────
Browser → Local cache (miss) → ISP DNS → GoDaddy (nameserver) →
Vercel DNS → Returns IP: 76.76.21.21


[3] HTTPS Connection (50-100ms)
────────────────────────────────
Browser → Vercel Edge (76.76.21.21:443)
  • TLS handshake
  • SSL certificate validated
  • Connection established


[4] Edge Processing (10-20ms)
──────────────────────────────
Vercel Edge:
  • Check cache (miss - dynamic search)
  • Route to us-east-1 Lambda
  • Forward request


[5] Page Load (200-500ms)
──────────────────────────
Lambda (us-east-1):
  • Cold/warm start
  • Load /customer page
  • Render React components
  • Return HTML

Browser:
  • Render page
  • Execute JavaScript
  • User sees search form


[6] API Call (when user clicks Search)
───────────────────────────────────────
JavaScript:
  fetch('/api/customer/search?make=Toyota&model=Camry&state=GA')


[7] Edge Routing (10ms)
────────────────────────
Vercel Edge → Routes to API handler Lambda


[8] API Handler Execution (50-100ms)
─────────────────────────────────────
Lambda: /api/customer/search/route.ts
  • Parse query params
  • Extract: make=Toyota, model=Camry, state=GA
  • Prepare Prisma query


[9] Database Query (20-50ms)
────────────────────────────
Lambda → Neon Connection:

  Connection:
  postgresql://user:pass@ep-xyz.us-east-1.aws.neon.tech:5432/neondb

  Prisma query:
  ```
  prisma.car.findMany({
    where: {
      make: { contains: "Toyota", mode: "insensitive" },
      model: { contains: "Camry", mode: "insensitive" },
      state: "GA",
      status: "active"
    },
    include: { dealer: true },
    take: 50
  })
  ```

  Generated SQL:
  ```sql
  SELECT c.*, d.*
  FROM "Car" c
  INNER JOIN "User" d ON c."dealerId" = d."id"
  WHERE LOWER(c."make") LIKE '%toyota%'
    AND LOWER(c."model") LIKE '%camry%'
    AND c."state" = 'GA'
    AND c."status" = 'active'
  LIMIT 50
  ```

Neon Database:
  • PgBouncer receives connection
  • Routes to compute node
  • Compute executes query
  • Reads from storage (S3-backed)
  • Returns 15 matching cars


[10] Response Processing (10ms)
────────────────────────────────
Lambda:
  • Receives 15 car records
  • Format as JSON
  • Return response:

  Response:
  ```json
  [
    {
      "id": "abc-123",
      "make": "Toyota",
      "model": "Camry",
      "year": 2022,
      "mileage": 25000,
      "photos": "[\"https://blob.vercel-storage.com/img1.jpg\"]",
      "city": "Atlanta",
      "state": "GA",
      "dealer": {
        "name": "ABC Motors",
        "businessName": "ABC Auto Sales"
      }
    },
    // ... 14 more cars
  ]
  ```


[11] Edge Caching (5ms)
────────────────────────
Vercel Edge:
  • Cache response (if cacheable)
  • Add headers:
    x-vercel-cache: MISS
    x-vercel-id: iad1::xyz-timestamp


[12] Browser Receives Data (network time)
──────────────────────────────────────────
JavaScript:
  • Parse JSON response
  • Update React state
  • Re-render car grid


[13] Image Loading (parallel, 100-500ms)
─────────────────────────────────────────
Browser requests each car photo:

  For each photo URL:
  GET https://abc123.public.blob.vercel-storage.com/car1.jpg

  Vercel Blob CDN:
  • Serve from nearest edge location
  • Apply image optimizations
  • Return WebP (if supported)

  Browser:
  • Display images as they load
  • Progressive rendering


[14] Analytics Tracking (background)
─────────────────────────────────────
<Analytics /> component:
  • Beacon to Vercel Analytics
  • Track: page view, search action, timing metrics


TOTAL TIME BREAKDOWN:
─────────────────────
DNS Resolution:         100ms
HTTPS Handshake:         50ms
Initial Page Load:      300ms
API Call (search):      150ms
Database Query:          30ms
Image Loading:          200ms (parallel)
─────────────────────────────
TOTAL:                  ~830ms (perceived: ~450ms with parallel loading)


NETWORK HOPS:
─────────────
User → ISP → Internet → Vercel Edge (CDN) → Lambda (us-east-1) →
Neon DB (us-east-1) → Response back through same path
```

---

## Infrastructure Costs & Limits

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SERVICE COSTS & QUOTAS                              │
└─────────────────────────────────────────────────────────────────────────┘


GODADDY
───────
Service: Domain Registration
Cost: ~$15/year for .com domain
What you get:
  • Domain ownership
  • WHOIS privacy
  • Nameserver delegation


VERCEL
──────
Plan: Pro (likely based on features used)
Cost: $20/month per user + usage

Included:
  • Unlimited bandwidth
  • Unlimited serverless function executions (up to limits)
  • 100GB-hours compute/month
  • Edge Network (global CDN)
  • SSL certificates
  • 1TB Edge Middleware invocations
  • Analytics (basic)

Limits:
  • Function timeout: 60 seconds (Pro)
  • Function memory: 3GB max
  • Deployment size: 500MB
  • Edge Config: 512KB


VERCEL BLOB
───────────
Pricing: Pay as you go
  • Storage: $0.15/GB/month
  • Bandwidth: $0.10/GB

Current usage estimate (if 100 cars with 5 photos each):
  • 500 images × 2MB avg = 1GB storage = $0.15/month
  • 1000 views/month × 2MB × 5 photos = 10GB bandwidth = $1.00/month

Total: ~$1-2/month


NEON DATABASE
─────────────
Plan: Free Tier (currently) or Pro ($19/month)

Free Tier includes:
  • 0.5 GB storage
  • 3 GB data transfer/month
  • Auto-suspend after 5 min
  • 7-day point-in-time recovery

Pro Plan ($19/month):
  • Autoscaling compute (0.25-8 CU)
  • 10 GB storage included
  • 50 GB data transfer/month
  • 30-day point-in-time recovery
  • No auto-suspend delay

Recommended: Upgrade to Pro for production


ESTIMATED MONTHLY COST:
───────────────────────
GoDaddy Domain:          $1.25/month ($15/year)
Vercel Pro:             $20.00/month
Vercel Blob:             $2.00/month (estimate)
Neon Pro:               $19.00/month
───────────────────────────────────────
TOTAL:                  ~$42/month ($504/year)

Note: Scales with usage (more photos, traffic, etc.)
```

---

## Security & Compliance

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────┘


TRANSPORT SECURITY
──────────────────
✅ HTTPS enforced (Vercel auto-redirects HTTP → HTTPS)
✅ TLS 1.3 supported
✅ SSL certificates auto-renewed (Let's Encrypt)
✅ HSTS header enabled (max-age: 63072000)


DATABASE SECURITY
─────────────────
✅ SSL/TLS required for all connections
✅ Password hashing (bcryptjs, 10 rounds)
✅ Connection pooling (prevents exhaustion)
✅ Credentials in environment variables (encrypted at rest)
❌ Database credentials exposed in repo (RISK!)
❌ No IP allowlist configured
❌ No read-only replicas for reporting


APPLICATION SECURITY
────────────────────
❌ Client-side auth only (localStorage)
❌ No CSRF protection
❌ No rate limiting
❌ API accepts user IDs in request body (spoofing risk)
✅ Password never returned in API responses
✅ Input validation on file uploads (type, size)


INFRASTRUCTURE SECURITY
───────────────────────
✅ DDoS protection (Vercel Edge)
✅ Automatic security updates (serverless)
✅ Isolated function execution (Lambda containers)
✅ Environment variable encryption (Vercel)


RECOMMENDED IMPROVEMENTS:
─────────────────────────
1. Implement JWT tokens for API authentication
2. Move auth to server-side sessions (Redis/database)
3. Add CSRF tokens for state-changing operations
4. Implement rate limiting (Vercel Edge Config or Upstash)
5. Remove database URL from repo, use Vercel secrets only
6. Add IP allowlist for database (restrict to Vercel IPs)
7. Implement API request validation (Zod schemas)
8. Add audit logging for sensitive operations
9. Set up WAF rules (Web Application Firewall)
10. Implement proper RBAC (Role-Based Access Control)
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  MONITORING ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────┘


VERCEL ANALYTICS
────────────────
Dashboard: analytics.vercel.com

Metrics tracked:
  • Real User Metrics (RUM):
    - Page views
    - Unique visitors
    - Session duration
    - Geographic distribution

  • Web Vitals:
    - LCP (Largest Contentful Paint)
    - FID (First Input Delay)
    - CLS (Cumulative Layout Shift)
    - TTFB (Time to First Byte)

  • Performance:
    - Function execution time
    - Edge cache hit rate
    - Build times


VERCEL DEPLOYMENT LOGS
──────────────────────
Dashboard: vercel.com/[project]/deployments

Logs include:
  • Build logs (npm install, Next.js build)
  • Runtime logs (console.log, errors)
  • Function invocations
  • Request/response details


NEON MONITORING
───────────────
Dashboard: console.neon.tech

Metrics:
  • Active connections
  • Query duration
  • Storage usage
  • Compute usage (CU hours)
  • Data transfer
  • Auto-suspend/wake events


CURRENT GAPS:
─────────────
❌ No error tracking (Sentry, Datadog)
❌ No APM (Application Performance Monitoring)
❌ No uptime monitoring (Pingdom, UptimeRobot)
❌ No log aggregation (Logtail, Datadog)
❌ No alerting configured


RECOMMENDED ADDITIONS:
──────────────────────
1. Sentry for error tracking
2. Uptime monitoring service
3. Custom CloudWatch alarms (if using AWS directly)
4. Slack/email alerts for critical errors
5. Database query performance monitoring
```

---

## Summary

This infrastructure document provides a complete visual map of how IQ Auto Deals operates from domain registration through data storage.

**Key Takeaways:**

1. **Domain Flow**: GoDaddy (registrar) → Vercel DNS (management) → Vercel Edge (hosting)

2. **Request Path**: User → DNS → Edge CDN → Lambda Functions → Database/Blob Storage

3. **Core Services**:
   - **GoDaddy**: Domain registration only
   - **Vercel**: Hosting, DNS, CDN, Functions, Blob Storage, Analytics
   - **Neon**: PostgreSQL database (serverless, auto-scaling)

4. **Data Routes**:
   - User data: Browser ↔ Lambda ↔ Neon DB
   - Images: Browser ↔ Lambda ↔ Vercel Blob ↔ S3

5. **Geographic Layout**: All in AWS us-east-1 for low latency

For detailed application architecture (API routes, database schema, user flows), see `ARCHITECTURE.md`.

**Infrastructure Diagram Legend:**
- → Direct connection/routing
- ↔ Bidirectional communication
- ║ Data flow
- ├─ Branch/option
- └─ Terminal endpoint
