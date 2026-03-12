import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { seoPageMap, allSeoSlugs } from '@/lib/data/seo-pages';
import { fetchSeoInventory } from '@/lib/seo-inventory';
import CarsClientWrapper from '@/app/cars/CarsClientWrapper';
import Footer from '@/app/components/Footer';

export const revalidate = 3600; // ISR: regenerate every hour

// Only build pages for approved slugs
export function generateStaticParams() {
  return allSeoSlugs.map((slug) => ({ seoSlug: slug }));
}

type Props = {
  params: Promise<{ seoSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const config = seoPageMap.get(seoSlug);
  if (!config) return {};

  return {
    title: config.title,
    description: config.metaDescription,
    alternates: {
      canonical: `https://iqautodeals.com/${config.slug}`,
    },
    openGraph: {
      title: `${config.title} | IQ Auto Deals`,
      description: config.metaDescription,
      url: `https://iqautodeals.com/${config.slug}`,
      siteName: 'IQ Auto Deals',
      type: 'website',
    },
  };
}

export default async function SeoPage({ params }: Props) {
  const { seoSlug } = await params;
  const config = seoPageMap.get(seoSlug);
  if (!config) notFound();

  // Fetch inventory count for structured data (grid is handled by CarsClient)
  const { cars, total } = await fetchSeoInventory(config.prismaWhere, 10);

  // Resolve related page configs for cross-links
  const relatedPages = config.relatedSlugs
    .map((s) => seoPageMap.get(s))
    .filter(Boolean);

  // noindex only if zero inventory
  const shouldNoindex = total === 0;

  // JSON-LD: CollectionPage + ItemList + BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: config.title,
        description: config.metaDescription,
        url: `https://iqautodeals.com/${config.slug}`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'IQ Auto Deals',
          url: 'https://iqautodeals.com',
        },
        ...(total > 0 && {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: total,
            itemListElement: cars.slice(0, 10).map((car, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://iqautodeals.com/cars/${car.slug || car.id}`,
              name: `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`,
            })),
          },
        }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://iqautodeals.com' },
          { '@type': 'ListItem', position: 2, name: 'Cars for Sale', item: 'https://iqautodeals.com/cars' },
          { '@type': 'ListItem', position: 3, name: config.breadcrumbLabel, item: `https://iqautodeals.com/${config.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      {shouldNoindex && (
        <meta name="robots" content="noindex, follow" />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* CarsClient renders the full search UI: header, filter sidebar, car grid, footer */}
      <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading vehicles...</div>}>
        <CarsClientWrapper
          pageTitle={config.h1}
          pageSubtitle={config.intro}
          showHeader={true}
          showFooter={false}
          {...config.clientProps}
        />
      </Suspense>

      {/* SEO content below the interactive search UI */}
      <section className="bg-gray-50 border-t border-gray-200 px-4 py-12 max-w-7xl mx-auto">
        {/* Related Searches */}
        {relatedPages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Related Searches</h2>
            <div className="flex flex-wrap gap-2">
              {relatedPages.map((rp) => (
                <Link
                  key={rp!.slug}
                  href={`/${rp!.slug}`}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
                >
                  {rp!.breadcrumbLabel}
                </Link>
              ))}
              <Link
                href="/cars"
                className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
              >
                All Vehicles
              </Link>
            </div>
          </div>
        )}

        {/* Bottom SEO copy */}
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Why Buy on IQ Auto Deals?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            IQ Auto Deals is a nationwide online car marketplace that connects you with certified dealers across the United States.
            When you find a vehicle you like, dealers compete to offer you their best price — so you get a great deal without the hassle of negotiating.
            All listings come from verified dealers with transparent pricing.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
