import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
import OrganizationSchema from "./components/OrganizationSchema";
import LocalBusinessSchema from "./components/LocalBusinessSchema";
import WebsiteSchema from "./components/WebsiteSchema";
import AutoDealerSchema from "./components/AutoDealerSchema";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { PostHogProvider, PostHogPageView } from "./components/PostHogProvider";
import CookieConsent from "./components/CookieConsent";
import PromoPopup from "./components/PromoPopup";

export const metadata: Metadata = {
  metadataBase: new URL('https://iqautodeals.com'),
  title: {
    default: "Buy New & Used Cars Online | Dealers Compete, You Save",
    template: "%s | IQ Auto Deals"
  },
  description: "Shop thousands of new and used cars online. Compare prices from verified dealers who compete for your business. ✓ No haggling ✓ Free for buyers ✓ Nationwide.",
  authors: [{ name: 'IQ Auto Deals' }],
  creator: 'IQ Auto Deals',
  publisher: 'IQ Auto Deals',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iqautodeals.com',
    title: 'Buy New & Used Cars Online | Dealers Compete, You Save',
    description: 'Shop thousands of new and used cars online. Compare prices from verified dealers who compete to offer you the lowest price. Free for buyers, nationwide coverage.',
    siteName: 'IQ Auto Deals',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IQ Auto Deals - Buy Quality Used Cars Online from Trusted Dealers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy New & Used Cars Online | Dealers Compete, You Save',
    description: 'Shop thousands of new and used cars online. Compare prices from verified dealers who compete to offer you the lowest price.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'N3HZ1t7u01ngDcGCcclhlISQ6Bu8tD3E4tEFAylIMSE',
  },
  alternates: {
    canonical: 'https://iqautodeals.com',
    languages: {
      'en': 'https://iqautodeals.com',
      'es': 'https://iqautodeals.com/es',
      'x-default': 'https://iqautodeals.com',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // ADA Compliance: Allow users to zoom for accessibility
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} font-sans`}>
      <head>
        <meta name="msvalidate.01" content="3BCD417E7943B96A06FC27AF503F3523" />
        <meta name="google-site-verification" content="c3bc0iS_ATQI5PqBRyvuSAjZ8kn1MedWPylEA8O_P_Y" />
        {/* Google Ads Tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17892289492"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17892289492');
            `,
          }}
        />
        <OrganizationSchema />
        <LocalBusinessSchema />
        <WebsiteSchema />
        <AutoDealerSchema />
      </head>
      <body className="font-sans antialiased">
        {/* Skip link for keyboard navigation - ADA compliance */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
            <AnalyticsProvider>
              <main id="main-content">
                {children}
              </main>
            </AnalyticsProvider>
          </Suspense>
          <Analytics debug={true} />
          <CookieConsent />
          {/* <PromoPopup /> */}
        </PostHogProvider>
      </body>
    </html>
  );
}
