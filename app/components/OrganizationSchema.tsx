import Script from 'next/script';

export default function OrganizationSchema() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    '@id': 'https://iqautodeals.com/#organization',
    name: 'IQ Auto Deals',
    legalName: 'IQ Auto Deals LLC',
    alternateName: ['IQ Auto Deals', 'IQAutoDeals', 'IQ AutoDeals'],
    // CRITICAL: Clarify business type for search engines and AI
    disambiguatingDescription: 'IQ Auto Deals is a nationwide ONLINE car marketplace platform (iqautodeals.com) - NOT a physical dealership. We connect buyers with certified dealers across all 50 US states through our digital platform.',
    url: 'https://iqautodeals.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://iqautodeals.com/logo.png',
      width: 512,
      height: 512,
    },
    image: 'https://iqautodeals.com/og-image.jpg',
    description: 'IQ Auto Deals is a nationwide ONLINE car marketplace connecting buyers with certified dealers across all 50 US states. Unlike traditional dealerships, IQ Auto Deals is a digital platform where customers browse thousands of quality pre-owned vehicles, select up to 4 cars, and receive competitive offers from multiple dealers who compete for their business. Save up to $5,000 compared to traditional dealership prices.',
    slogan: 'Smart Car Buying Made Simple',
    foundingDate: '2024',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '345 W Washington Ave Ste 301',
        addressLocality: 'Madison',
        addressRegion: 'WI',
        postalCode: '53703',
        addressCountry: 'US',
      },
    },
    // Emphasize NATIONWIDE coverage - not a local business
    areaServed: [
      {
        '@type': 'Country',
        name: 'United States',
      },
      {
        '@type': 'State',
        name: 'All 50 US States',
      },
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 39.8283,
        longitude: -98.5795,
      },
      geoRadius: '3000 miles',
    },
    // Industry codes for ONLINE automotive marketplace
    naics: '454110', // Electronic Shopping and Mail-Order Houses
    isicV4: '4791', // Retail sale via mail order houses or via Internet
    // Official social profiles - helps search engines identify the real brand
    sameAs: [
      'https://www.facebook.com/iqautodeals',
      'https://twitter.com/iqautodeals',
      'https://www.instagram.com/iqautodeals',
      'https://www.linkedin.com/company/iqautodeals',
      'https://www.youtube.com/@iqautodeals',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+1-800-IQ-DEALS',
        email: 'support@iqautodeals.com',
        availableLanguage: ['English', 'Spanish'],
        areaServed: 'US',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'support@iqautodeals.com',
        availableLanguage: ['English'],
        areaServed: 'US',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    knowsAbout: [
      'Online car marketplace',
      'Used car comparison shopping',
      'Dealer competition platform',
      'Nationwide vehicle marketplace',
      'Digital car buying',
      'Pre-owned vehicle marketplace',
      'Certified pre-owned cars',
      'Car price comparison',
      'Online auto shopping',
      'Multi-dealer quotes',
    ],
    // Explicitly define what we offer as a PLATFORM/SERVICE
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': 'https://iqautodeals.com/#marketplace-service',
        name: 'Online Car Marketplace Platform',
        serviceType: 'Online Marketplace',
        description: 'Digital platform connecting car buyers with certified dealers nationwide. Compare vehicles, receive competing offers, and save thousands.',
        provider: {
          '@id': 'https://iqautodeals.com/#organization',
        },
        areaServed: {
          '@type': 'Country',
          name: 'United States',
        },
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Nationwide Used Car Inventory',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Sedans',
        },
        {
          '@type': 'OfferCatalog',
          name: 'SUVs',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Trucks',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Luxury Vehicles',
        },
      ],
    },
    // Additional structured data for brand recognition
    brand: {
      '@type': 'Brand',
      name: 'IQ Auto Deals',
      logo: 'https://iqautodeals.com/logo.png',
      slogan: 'Smart Car Buying Made Simple',
    },
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://iqautodeals.com/#webapp',
    name: 'IQ Auto Deals',
    alternateName: 'IQAutoDeals',
    applicationCategory: 'ShoppingApplication',
    applicationSubCategory: 'Automotive Marketplace',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Works on all modern browsers.',
    description: 'Online car marketplace platform for comparing used cars from certified dealers nationwide. NOT a physical dealership.',
    url: 'https://iqautodeals.com',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to use for car buyers',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
    creator: {
      '@id': 'https://iqautodeals.com/#organization',
    },
    featureList: [
      'Compare up to 4 vehicles at once',
      'Receive competing dealer offers',
      'Browse nationwide inventory',
      'Save up to $5,000',
      'No haggling required',
      'Free to use',
    ],
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </>
  );
}
