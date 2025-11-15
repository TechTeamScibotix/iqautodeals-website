import Script from 'next/script';

export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'IQ Auto Deals',
    description: 'THE place to find the absolute best deals on quality used cars. Online marketplace connecting buyers with dealers across the United States. Compare prices and save thousands!',
    url: 'https://iqautodeals.com',
    telephone: '+1-800-IQ-DEALS',
    email: 'support@iqautodeals.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Auto Plaza',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      postalCode: '30301',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.7490',
      longitude: '-84.3880',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
