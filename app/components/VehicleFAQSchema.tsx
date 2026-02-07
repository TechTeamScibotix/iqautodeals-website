interface VehicleFAQSchemaProps {
  make: string;
  model: string;
  year: number;
  goodDealAnswer: string;
}

export default function VehicleFAQSchema({ make, model, year, goodDealAnswer }: VehicleFAQSchemaProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Am I getting a good deal on this ${year} ${make} ${model}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: goodDealAnswer,
        },
      },
      {
        '@type': 'Question',
        name: `Can I negotiate the price on this ${year} ${make} ${model}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Create a free account to add this vehicle to your Deal Request. As a member, dealers compete to offer you their best price.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
