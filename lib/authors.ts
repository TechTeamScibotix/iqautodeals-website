// Author data for E-E-A-T signals and BlogPosting schema
// Using Editorial Team until we have real people with permission

export interface Author {
  id: string;
  name: string;
  slug: string;
  jobTitle: string;
  description: string;
  expertise: string[];
  image?: string;
  url?: string;
}

export const authors: Record<string, Author> = {
  'editorial-team': {
    id: 'editorial-team',
    name: 'IQ Auto Deals Editorial Team',
    slug: 'editorial-team',
    jobTitle: 'Automotive Content Specialists',
    description: 'The IQ Auto Deals Editorial Team consists of automotive industry professionals dedicated to helping car buyers make informed decisions. Our team researches market trends, financing options, and vehicle reliability to provide accurate, up-to-date guidance.',
    expertise: ['Used Car Buying', 'Auto Financing', 'Vehicle Research', 'Consumer Advocacy'],
    url: 'https://iqautodeals.com/about',
  },
};

// Helper function to get author by ID
export function getAuthor(id: string): Author {
  return authors[id] || authors['editorial-team'];
}

// Default author for all content
export const defaultAuthor = authors['editorial-team'];
