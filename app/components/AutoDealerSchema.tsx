import Script from 'next/script';

/**
 * MarketplaceServiceSchema - Replaces AutoDealerSchema
 *
 * CRITICAL: IQ Auto Deals is NOT an AutoDealer!
 * IQ Auto Deals is an ONLINE MARKETPLACE PLATFORM that connects buyers with dealers.
 *
 * The previous AutoDealer schema type was incorrectly categorizing IQ Auto Deals
 * as a physical car dealership instead of an online marketplace platform.
 *
 * This schema properly represents IQ Auto Deals as a digital marketplace service.
 */
export default function AutoDealerSchema() {
  // Service schema - properly represents marketplace functionality
  const marketplaceServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://iqautodeals.com/#marketplace-service',
    name: 'IQ Auto Deals Car Marketplace',
    alternateName: 'IQ Auto Deals Online Platform',
    // CRITICAL: Clarify business type for search engines and AI
    disambiguatingDescription: 'IQ Auto Deals is a digital MARKETPLACE PLATFORM (iqautodeals.com) that connects car buyers with certified dealers nationwide. We are NOT a physical car dealership, car lot, or auto dealer. We do NOT sell cars directly - we facilitate connections between buyers and dealers.',
    description: 'Online car marketplace platform enabling buyers to browse used vehicles from certified dealers across all 50 US states. Buyers select up to 4 vehicles and receive competing offers from multiple dealers. The platform helps buyers save up to $5,000 through dealer competition.',
    url: 'https://iqautodeals.com',
    logo: 'https://iqautodeals.com/logo.png',
    image: 'https://iqautodeals.com/og-image.jpg',
    // Service type - clearly NOT a dealership
    serviceType: 'Online Automotive Marketplace',
    category: 'E-Commerce Platform',
    // Provider is the corporation, not a dealership
    provider: {
      '@type': 'Corporation',
      '@id': 'https://iqautodeals.com/#organization',
      name: 'IQ Auto Deals LLC',
      url: 'https://iqautodeals.com',
    },
    // Nationwide service area
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    // Service is available online
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://iqautodeals.com',
      serviceSmsNumber: null,
      servicePhone: '+1-800-IQ-DEALS',
      availableLanguage: ['English', 'Spanish'],
    },
    // The service features
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Marketplace Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Free Car Search',
            description: 'Search thousands of used vehicles from certified dealers nationwide at no cost',
          },
          price: '0',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Multi-Vehicle Comparison',
            description: 'Compare up to 4 vehicles side-by-side to find your best match',
          },
          price: '0',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Competitive Dealer Offers',
            description: 'Receive multiple competing offers from dealers who want your business',
          },
          price: '0',
          priceCurrency: 'USD',
        },
      ],
    },
    // Pricing info
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to use for car buyers. Dealers pay for marketplace access.',
      eligibleRegion: {
        '@type': 'Country',
        name: 'United States',
      },
    },
    // Audience
    audience: {
      '@type': 'Audience',
      audienceType: 'Car Buyers',
      geographicArea: {
        '@type': 'Country',
        name: 'United States',
      },
    },
    // Reviews
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    // Service output
    serviceOutput: {
      '@type': 'Thing',
      name: 'Competitive dealer offers on used vehicles',
      description: 'Buyers receive multiple competing offers from certified dealers, typically saving up to $5,000',
    },
    // Terms and branding
    termsOfService: 'https://iqautodeals.com/terms',
    slogan: 'Smart Car Buying Made Simple',
    brand: {
      '@type': 'Brand',
      name: 'IQ Auto Deals',
      logo: 'https://iqautodeals.com/logo.png',
    },
  };

  // Action schema for interactivity
  const searchActionSchema = {
    '@context': 'https://schema.org',
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://iqautodeals.com/cars?search={search_term}',
    },
    'query-input': 'required name=search_term',
    name: 'Search Used Cars on IQ Auto Deals',
    description: 'Search the IQ Auto Deals online marketplace for used cars from certified dealers nationwide',
  };

  return (
    <>
      <Script
        id="marketplace-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceServiceSchema) }}
      />
      <Script
        id="search-action-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />
    </>
  );
}
