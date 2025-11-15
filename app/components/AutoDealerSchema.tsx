export default function AutoDealerSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "IQ Auto Deals",
    "description": "Nationwide online marketplace for buying quality used cars from certified dealers. Compare prices and save thousands on pre-owned vehicles.",
    "url": "https://iqautodeals.com",
    "telephone": "+1-555-IQ-AUTOS",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "$5,000 - $100,000"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
