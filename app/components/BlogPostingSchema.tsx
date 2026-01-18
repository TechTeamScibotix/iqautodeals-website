import Script from 'next/script';

export interface Author {
  name: string;
  url?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
}

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: Author;
  url: string;
  image?: string;
  articleBody?: string;
  wordCount?: number;
  keywords?: string[];
  category?: string;
}

export default function BlogPostingSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  url,
  image,
  articleBody,
  wordCount,
  keywords,
  category,
}: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url || 'https://iqautodeals.com/about',
      jobTitle: author.jobTitle,
      description: author.description,
      image: author.image,
      worksFor: {
        '@type': 'Organization',
        name: 'IQ Auto Deals',
        url: 'https://iqautodeals.com',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'IQ Auto Deals',
      url: 'https://iqautodeals.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://iqautodeals.com/logo.png',
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url: url,
    image: image || 'https://iqautodeals.com/og-image.jpg',
    wordCount: wordCount,
    keywords: keywords?.join(', '),
    articleSection: category,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    copyrightHolder: {
      '@type': 'Organization',
      name: 'IQ Auto Deals',
    },
    copyrightYear: new Date(datePublished).getFullYear(),
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <Script
      id={`blog-posting-schema-${title.slice(0, 20).replace(/\s/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}
