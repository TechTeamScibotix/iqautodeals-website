import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PostHog } from 'posthog-node';
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from '@modelcontextprotocol/ext-apps/server';

const posthog = new PostHog('phc_T6Me1lGvz8Pci141n7HmsSiOuC3UZV0uAy7zq75apJe', {
  host: 'https://us.i.posthog.com',
  flushAt: 1,
  flushInterval: 0,
});

const BLOB_HOST = 'yzkbvk1txue5y0ml.public.blob.vercel-storage.com';

function proxyImageUrl(url: string): string {
  return url.replace(`https://${BLOB_HOST}`, 'https://iqautodeals.com/api/img');
}

function parsePhotos(photos: string): string[] {
  try {
    const parsed = JSON.parse(photos);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 10).map((u: string) => proxyImageUrl(u));
    }
  } catch {
    if (photos && photos.startsWith('http')) {
      return [proxyImageUrl(photos)];
    }
  }
  return [];
}

function parseFeatures(features: string | null): string[] {
  if (!features) return [];
  try {
    const parsed = JSON.parse(features);
    if (Array.isArray(parsed)) return parsed.slice(0, 10);
  } catch {
    // ignore
  }
  return [];
}

// Read widget HTML at module load time
let widgetHtml = '';
try {
  widgetHtml = readFileSync(join(process.cwd(), 'public', 'mcp-widget.html'), 'utf-8');
} catch {
  // Will be loaded from URL fallback
}

const WIDGET_URI = 'ui://widget/vehicle-results.html';

const handler = createMcpHandler(
  (server) => {
    // Register the vehicle search widget as an App resource
    registerAppResource(
      server,
      'vehicle-widget',
      WIDGET_URI,
      {},
      async () => ({
        contents: [{
          uri: WIDGET_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: widgetHtml || '<html><body>Widget loading...</body></html>',
          _meta: {
            ui: {
              prefersBorder: true,
              height: 900,
              domain: 'https://iqautodeals.com',
              csp: {
                connectDomains: ['https://iqautodeals.com'],
                resourceDomains: ['https://iqautodeals.com', 'https://*.public.blob.vercel-storage.com'],
              },
            },
          },
        }],
      }),
    );

    // Register the search tool linked to the widget
    registerAppTool(
      server,
      'search_vehicles',
      {
        title: 'Search Vehicles',
        description: 'Search the IQ Auto Deals nationwide vehicle inventory. Find cars by make, model, year, price, body type, fuel type, drivetrain, condition, mileage, and location. Returns vehicle details including photos, pricing, dealer info, and listing links.',
        inputSchema: {
          q: z.string().optional().describe('Free-text search (e.g. "reliable SUV 3rd row", "truck AWD")'),
          make: z.string().optional().describe('Vehicle make (Toyota, Ford, BMW, Honda, Lexus, etc.)'),
          model: z.string().optional().describe('Vehicle model (Camry, F-150, 3 Series, Civic, etc.)'),
          yearMin: z.number().int().optional().describe('Minimum model year'),
          yearMax: z.number().int().optional().describe('Maximum model year'),
          minPrice: z.number().optional().describe('Minimum price in USD'),
          maxPrice: z.number().optional().describe('Maximum price in USD'),
          bodyType: z.enum(['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Minivan', 'Wagon']).optional().describe('Vehicle body type'),
          fuelType: z.enum(['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-In Hybrid']).optional().describe('Fuel type'),
          drivetrain: z.enum(['AWD', 'FWD', 'RWD', '4WD']).optional().describe('Drivetrain type'),
          condition: z.enum(['New', 'Used', 'Certified Pre-Owned']).optional().describe('Vehicle condition'),
          maxMileage: z.number().int().optional().describe('Maximum mileage'),
          state: z.string().optional().describe('US state abbreviation (GA, FL, TX, CA)'),
          city: z.string().optional().describe('City name'),
          sort: z.enum(['relevance', 'priceAsc', 'priceDesc', 'yearDesc', 'mileageAsc']).optional().describe('Sort order'),
          limit: z.number().int().min(1).max(20).optional().describe('Number of results (max 20, default 10)'),
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          openWorldHint: true,
        },
        _meta: {
          ui: { resourceUri: WIDGET_URI },
        },
      },
      async (params) => {
        const limit = params.limit ?? 10;

        // Build Prisma where clause
        const where: Record<string, unknown> = {
          status: 'active',
          photos: { notIn: ['', '[]'] },
          dealer: { verificationStatus: 'approved' },
        };

        // Free-text search
        if (params.q) {
          const terms = params.q.split(/\s+/).filter(Boolean);
          where.AND = terms.map((term) => {
            const conditions: Record<string, unknown>[] = [
              { make: { contains: term, mode: 'insensitive' } },
              { model: { contains: term, mode: 'insensitive' } },
              { trim: { contains: term, mode: 'insensitive' } },
              { bodyType: { contains: term, mode: 'insensitive' } },
              { fuelType: { contains: term, mode: 'insensitive' } },
              { drivetrain: { contains: term, mode: 'insensitive' } },
            ];
            if (!isNaN(Number(term)) && term.length === 4) {
              conditions.push({ year: Number(term) });
            }
            return { OR: conditions };
          });
        }

        if (params.make) where.make = { equals: params.make, mode: 'insensitive' };
        if (params.model) where.model = { contains: params.model, mode: 'insensitive' };

        if (params.yearMin || params.yearMax) {
          const yearFilter: Record<string, number> = {};
          if (params.yearMin) yearFilter.gte = params.yearMin;
          if (params.yearMax) yearFilter.lte = params.yearMax;
          where.year = yearFilter;
        }

        if (params.minPrice || params.maxPrice) {
          const priceFilter: Record<string, number> = {};
          if (params.minPrice) priceFilter.gte = params.minPrice;
          if (params.maxPrice) priceFilter.lte = params.maxPrice;
          where.salePrice = priceFilter;
        }

        if (params.state) where.state = { equals: params.state, mode: 'insensitive' };
        if (params.city) where.city = { contains: params.city, mode: 'insensitive' };

        if (params.bodyType) {
          const bt = params.bodyType.toLowerCase();
          if (bt === 'truck') {
            where.OR = [
              { bodyType: { contains: 'truck', mode: 'insensitive' } },
              { bodyType: { contains: 'pickup', mode: 'insensitive' } },
            ];
          } else if (bt === 'suv') {
            where.OR = [
              { bodyType: { contains: 'suv', mode: 'insensitive' } },
              { bodyType: { contains: 'crossover', mode: 'insensitive' } },
            ];
          } else {
            where.bodyType = { contains: params.bodyType, mode: 'insensitive' };
          }
        }

        if (params.fuelType) where.fuelType = { equals: params.fuelType, mode: 'insensitive' };
        if (params.drivetrain) where.drivetrain = { equals: params.drivetrain, mode: 'insensitive' };
        if (params.condition) where.condition = { equals: params.condition, mode: 'insensitive' };
        if (params.maxMileage) where.mileage = { lte: params.maxMileage };

        // Sort
        let orderBy: Record<string, string> = { createdAt: 'desc' };
        if (params.sort === 'priceAsc') orderBy = { salePrice: 'asc' };
        else if (params.sort === 'priceDesc') orderBy = { salePrice: 'desc' };
        else if (params.sort === 'yearDesc') orderBy = { year: 'desc' };
        else if (params.sort === 'mileageAsc') orderBy = { mileage: 'asc' };

        const [cars, total] = await Promise.all([
          prisma.car.findMany({
            where,
            select: {
              id: true, vin: true, year: true, make: true, model: true, trim: true,
              bodyType: true, condition: true, salePrice: true, msrp: true, mileage: true,
              color: true, interiorColor: true, transmission: true, engine: true,
              fuelType: true, drivetrain: true, mpgCity: true, mpgHighway: true,
              doors: true, certified: true, photos: true, city: true, state: true,
              slug: true, features: true, createdAt: true,
              dealer: { select: { businessName: true, city: true, state: true } },
            },
            orderBy,
            take: limit,
            skip: 0,
          }),
          prisma.car.count({ where }),
        ]);

        const vehicles = cars.map((car) => {
          const photoUrls = parsePhotos(car.photos);
          const featureList = parseFeatures(car.features);
          const title = [car.year, car.make, car.model, car.trim].filter(Boolean).join(' ');
          const listingUrl = car.slug
            ? `https://iqautodeals.com/cars/${car.slug}`
            : `https://iqautodeals.com/cars/${car.id}`;

          return {
            title,
            image_url: photoUrls[0] || null,
            photos: photoUrls,
            vin: car.vin,
            year: car.year,
            make: car.make,
            model: car.model,
            trim: car.trim || null,
            bodyType: car.bodyType || null,
            condition: car.condition || null,
            price: car.salePrice,
            mileage: car.mileage,
            exteriorColor: car.color,
            interiorColor: car.interiorColor || null,
            transmission: car.transmission || null,
            engine: car.engine || null,
            fuelType: car.fuelType || null,
            drivetrain: car.drivetrain || null,
            mpgCity: car.mpgCity || null,
            mpgHighway: car.mpgHighway || null,
            doors: car.doors || null,
            features: featureList,
            dealer: {
              name: car.dealer?.businessName || null,
              city: car.dealer?.city || null,
              state: car.dealer?.state || null,
            },
            listing_url: listingUrl,
          };
        });

        // Track MCP search in PostHog
        posthog.capture({
          distinctId: 'chatgpt-mcp-user',
          event: 'mcp_search_vehicles',
          properties: {
            source: 'chatgpt_app',
            query: params.q || null,
            make: params.make || null,
            model: params.model || null,
            bodyType: params.bodyType || null,
            condition: params.condition || null,
            state: params.state || null,
            city: params.city || null,
            minPrice: params.minPrice || null,
            maxPrice: params.maxPrice || null,
            fuelType: params.fuelType || null,
            drivetrain: params.drivetrain || null,
            results_count: vehicles.length,
            total_matches: total,
          },
        });

        // Build text summary for the model
        const summary = vehicles.map((v) => {
          const price = v.price > 0 ? `$${v.price.toLocaleString()}` : 'Contact dealer';
          const miles = v.mileage ? `${v.mileage.toLocaleString()} mi` : '';
          const location = [v.dealer.city, v.dealer.state].filter(Boolean).join(', ');
          const details = [miles, location].filter(Boolean).join(' · ');
          return `${v.title} — ${price}, ${details} — ${v.listing_url}`;
        }).join('\n');

        return {
          structuredContent: { vehicles, total },
          content: [{
            type: 'text' as const,
            text: `Found ${total} vehicles on IQ Auto Deals. Showing ${vehicles.length}:\n\n${summary}\n\nBrowse all results at https://iqautodeals.com/cars`,
          }],
        };
      },
    );
  },
  {},
  { basePath: '/api' },
);

export { handler as GET, handler as POST, handler as DELETE };
