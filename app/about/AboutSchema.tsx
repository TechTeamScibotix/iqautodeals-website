import Script from 'next/script';

export default function AboutSchema() {
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://iqautodeals.com/about#webpage',
    url: 'https://iqautodeals.com/about',
    name: 'About IQ Auto Deals',
    description: 'Learn about IQ Auto Deals, the online used car marketplace connecting buyers with certified dealers across the United States.',
    isPartOf: {
      '@id': 'https://iqautodeals.com/#website',
    },
    about: {
      '@id': 'https://iqautodeals.com/#organization',
    },
    mainEntity: {
      '@type': 'Corporation',
      '@id': 'https://iqautodeals.com/#organization',
      name: 'IQ Auto Deals',
      legalName: 'IQ Auto Deals LLC',
      url: 'https://iqautodeals.com',
      logo: 'https://iqautodeals.com/logo.png',
      foundingDate: '2024',
      foundingLocation: {
        '@type': 'Place',
        name: 'Atlanta, Georgia',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Atlanta',
          addressRegion: 'GA',
          addressCountry: 'US',
        },
      },
      description: 'IQ Auto Deals is an online used car marketplace that connects car buyers with certified dealers across the United States. The platform enables customers to browse thousands of quality pre-owned vehicles and receive competitive offers from dealers who compete for their business.',
      slogan: 'Smart Car Buying Made Simple',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 10,
      },
      naics: '441120',
      sameAs: [
        'https://www.facebook.com/iqautodeals',
        'https://twitter.com/iqautodeals',
        'https://www.instagram.com/iqautodeals',
        'https://www.linkedin.com/company/iqautodeals',
        'https://www.youtube.com/@iqautodeals',
        'https://www.crunchbase.com/organization/iq-auto-deals',
      ],
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
      knowsAbout: [
        'Used car sales',
        'Online car marketplace',
        'Auto dealership solutions',
        'Certified pre-owned vehicles',
        'Car buying and selling',
        'Dealer competition pricing',
        'Automotive e-commerce',
      ],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://iqautodeals.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://iqautodeals.com/about',
        },
      ],
    },
  };

  return (
    <Script
      id="about-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
    />
  );
}
