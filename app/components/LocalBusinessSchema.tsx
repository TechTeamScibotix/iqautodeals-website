import Script from 'next/script';

/**
 * OnlineBusinessSchema - Replaces LocalBusinessSchema
 *
 * IMPORTANT: IQ Auto Deals is NOT a local business or physical dealership.
 * It is an ONLINE MARKETPLACE / PLATFORM that connects buyers with dealers nationwide.
 *
 * Using OnlineBusiness schema type to properly signal this to search engines and AI.
 */
export default function LocalBusinessSchema() {
  // Primary schema: Online Business / E-commerce Platform
  const onlineBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineBusiness',
    '@id': 'https://iqautodeals.com/#online-business',
    name: 'IQ Auto Deals',
    alternateName: ['IQAutoDeals', 'IQ AutoDeals'],
    // CRITICAL: Clarify business type
    disambiguatingDescription: 'IQ Auto Deals (iqautodeals.com) is an ONLINE car marketplace platform serving all 50 US states. We are a digital platform that connects buyers with certified dealers - NOT a physical dealership or car lot.',
    description: 'Nationwide online car marketplace platform where buyers compare used cars from certified dealers across the United States. Select up to 4 vehicles and receive competing offers from multiple dealers. No haggling required.',
    url: 'https://iqautodeals.com',
    logo: 'https://iqautodeals.com/logo.png',
    image: 'https://iqautodeals.com/og-image.jpg',
    telephone: '+1-800-IQ-DEALS',
    email: 'support@iqautodeals.com',
    // Headquarters address (not a car lot)
    address: {
      '@type': 'PostalAddress',
      streetAddress: '345 W Washington Ave Ste 301',
      addressLocality: 'Madison',
      addressRegion: 'WI',
      postalCode: '53703',
      addressCountry: 'US',
    },
    // Service area: NATIONWIDE
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    // Available online 24/7, support hours for contact
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
        description: 'Website available 24/7',
      },
    ],
    // Customer support hours
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
      description: 'Customer support hours',
    },
    priceRange: 'Free to use',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Dealers handle transactions directly',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    // Social profiles for brand identity
    sameAs: [
      'https://www.facebook.com/iqautodeals',
      'https://twitter.com/iqautodeals',
      'https://www.instagram.com/iqautodeals',
      'https://www.linkedin.com/company/iqautodeals',
      'https://www.youtube.com/@iqautodeals',
    ],
    // What the platform offers
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Online Car Marketplace Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Vehicle Comparison',
            description: 'Compare up to 4 vehicles side-by-side',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dealer Competition',
            description: 'Receive competing offers from multiple certified dealers',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Nationwide Inventory Access',
            description: 'Browse used cars from dealers across all 50 US states',
          },
        },
      ],
    },
    // Keywords for discovery
    keywords: [
      'online car marketplace',
      'nationwide used cars',
      'compare car prices',
      'dealer competition',
      'used car platform',
      'digital car buying',
    ],
  };

  // Additional schema to explicitly define platform type
  const platformSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://iqautodeals.com/#platform-features',
    name: 'IQ Auto Deals Platform Features',
    description: 'Key features of the IQ Auto Deals online car marketplace platform',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Nationwide Coverage',
        description: 'Access used cars from certified dealers across all 50 US states',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Compare Vehicles',
        description: 'Select and compare up to 4 vehicles at once',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Competing Dealer Offers',
        description: 'Dealers compete for your business, ensuring the best price',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Save Money',
        description: 'Compare competing dealer offers and choose the best price',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'No Haggling',
        description: 'Transparent pricing without negotiation stress',
      },
    ],
  };

  return (
    <>
      <Script
        id="online-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(onlineBusinessSchema) }}
      />
      <Script
        id="platform-features-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformSchema) }}
      />
    </>
  );
}
