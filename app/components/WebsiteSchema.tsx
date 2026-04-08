// Using inline <script> instead of next/script <Script> so JSON-LD is
// present in the initial server-rendered HTML for Googlebot indexing.

export default function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IQ Auto Deals',
    url: 'https://iqautodeals.com',
    description: 'Find the best car deals online. Browse thousands of vehicles and get competitive offers from multiple dealers.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://iqautodeals.com/cars?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
