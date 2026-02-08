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
      {
        '@type': 'Question',
        name: `Who is this ${year} ${make} ${model} best for?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${year} ${make} ${model} is a versatile vehicle well-suited for families, daily commuters, and anyone looking for a reliable and comfortable ride. Its combination of features and value makes it a great choice for a wide range of drivers.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are good alternatives to this ${year} ${make} ${model}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There are several competitive alternatives to the ${year} ${make} ${model}. Browse similar vehicles on IQ Auto Deals to compare options and find the best fit for your needs and budget.`,
        },
      },
      {
        '@type': 'Question',
        name: `What should buyers know before purchasing this ${year} ${make} ${model}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Before purchasing this ${year} ${make} ${model}, check its current availability, review the vehicle history report, and consider getting competing offers from multiple dealers through IQ Auto Deals to ensure you get the best price.`,
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
