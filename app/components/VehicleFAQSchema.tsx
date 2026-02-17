interface VehicleFAQSchemaProps {
  make: string;
  model: string;
  year: number;
  trim?: string;
  goodDealAnswer: string;
}

export default function VehicleFAQSchema({ make, model, year, trim, goodDealAnswer }: VehicleFAQSchemaProps) {
  const fullModel = trim ? `${model} ${trim}` : model;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Am I getting a good deal on this ${year} ${make} ${fullModel}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: goodDealAnswer,
        },
      },
      {
        '@type': 'Question',
        name: `Who is this ${year} ${make} ${fullModel} best for?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${year} ${make} ${fullModel} is a versatile vehicle well-suited for families, daily commuters, and anyone looking for a reliable and comfortable ride. Its combination of features and value makes it a great choice for a wide range of drivers.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can I get the best price on this ${year} ${make} ${fullModel}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Create a free IQ Auto Deals account and add this vehicle to your Deal Request. Multiple certified dealers compete to offer their best price — no haggling needed.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is this ${year} ${make} ${fullModel} a reliable vehicle?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${make} ${fullModel} has a strong reputation among buyers. Check the vehicle details, mileage, and condition above, then create a free account to request competing dealer offers.`,
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
