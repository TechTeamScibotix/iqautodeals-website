import Script from 'next/script';

export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IQ Auto Deals',
    alternateName: 'IQ Auto Deals - Smart Car Buying Marketplace',
    url: 'https://iqautodeals.com',
    logo: 'https://iqautodeals.com/logo.png',
    description: 'IQ Auto Deals is THE place to find the absolute best deals on quality used cars. Browse thousands of vehicles from local dealers and watch them compete to give you their lowest prices. Smart car buying made simple.',
    sameAs: [
      'https://facebook.com/iqautodeals',
      'https://twitter.com/iqautodeals',
      'https://instagram.com/iqautodeals',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@iqautodeals.com',
      availableLanguage: ['English'],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
