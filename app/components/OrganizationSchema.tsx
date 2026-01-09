import Script from 'next/script';

export default function OrganizationSchema() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    '@id': 'https://iqautodeals.com/#organization',
    name: 'IQ Auto Deals',
    legalName: 'IQ Auto Deals LLC',
    alternateName: ['IQ Auto Deals', 'IQAutoDeals', 'IQ AutoDeals'],
    url: 'https://iqautodeals.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://iqautodeals.com/logo.png',
      width: 512,
      height: 512,
    },
    image: 'https://iqautodeals.com/og-image.jpg',
    description: 'IQ Auto Deals is an online used car marketplace connecting buyers with certified dealers nationwide. Customers browse thousands of quality pre-owned vehicles, select up to 4 cars, and receive competitive offers from dealers who compete for their business. The platform helps buyers save up to $5,000 compared to traditional dealership prices.',
    slogan: 'Smart Car Buying Made Simple',
    foundingDate: '2024',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Atlanta',
        addressRegion: 'GA',
        addressCountry: 'US',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 39.8283,
        longitude: -98.5795,
      },
      geoRadius: '3000 miles',
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 10,
    },
    naics: '441120',
    isicV4: '4510',
    sameAs: [
      'https://www.facebook.com/iqautodeals',
      'https://twitter.com/iqautodeals',
      'https://www.instagram.com/iqautodeals',
      'https://www.linkedin.com/company/iqautodeals',
      'https://www.youtube.com/@iqautodeals',
      'https://www.crunchbase.com/organization/iq-auto-deals',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@iqautodeals.com',
        availableLanguage: ['English', 'Spanish'],
        areaServed: 'US',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'dealers@iqautodeals.com',
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
      'Used cars',
      'Car buying',
      'Auto dealerships',
      'Vehicle marketplace',
      'Car pricing',
      'Pre-owned vehicles',
      'Certified pre-owned cars',
      'Auto financing',
      'Car shopping online',
      'Dealer competition',
    ],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Online Car Marketplace',
        description: 'Connect with certified dealers and receive competitive offers on quality used cars',
        provider: {
          '@id': 'https://iqautodeals.com/#organization',
        },
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Used Car Inventory',
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
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'IQ Auto Deals',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
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
