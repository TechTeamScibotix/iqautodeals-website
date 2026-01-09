import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About IQ Auto Deals - Online Used Car Marketplace',
  description: 'IQ Auto Deals is an online used car marketplace connecting buyers with certified dealers across the United States. Founded in 2024 in Atlanta, Georgia. Browse thousands of quality pre-owned vehicles and receive competitive offers.',
  keywords: [
    'IQ Auto Deals',
    'about IQ Auto Deals',
    'what is IQ Auto Deals',
    'IQ Auto Deals company',
    'online car marketplace',
    'used car marketplace',
    'car buying platform',
    'Atlanta car marketplace',
  ],
  openGraph: {
    title: 'About IQ Auto Deals - Online Used Car Marketplace',
    description: 'IQ Auto Deals is an online used car marketplace connecting buyers with certified dealers across the United States. Founded in 2024 in Atlanta, Georgia.',
    url: 'https://iqautodeals.com/about',
    type: 'website',
  },
  alternates: {
    canonical: 'https://iqautodeals.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
