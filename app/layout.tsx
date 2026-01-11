import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import OrganizationSchema from "./components/OrganizationSchema";
import LocalBusinessSchema from "./components/LocalBusinessSchema";
import WebsiteSchema from "./components/WebsiteSchema";
import AutoDealerSchema from "./components/AutoDealerSchema";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { PostHogProvider, PostHogPageView } from "./components/PostHogProvider";

export const metadata: Metadata = {
  metadataBase: new URL('https://iqautodeals.com'),
  title: {
    default: "Used Cars for Sale Near You - Compare Prices & Save $5,000 | IQ Auto Deals",
    template: "%s | IQ Auto Deals"
  },
  description: "🚗 Shop 1000+ quality used cars online. Compare prices from local dealers instantly, get competing offers & save up to $5,000. ✓ No haggling ✓ Free to use ✓ Trusted dealers. Browse now →",
  keywords: [
    // Core Keywords
    'buy used cars online',
    'used cars for sale near me',
    'certified pre-owned cars',
    'best used car deals',
    'affordable used vehicles',
    'quality pre-owned cars online',
    'used car marketplace',
    'compare car prices online',
    'local car dealerships',
    'used SUVs for sale',
    'used sedans for sale',
    'used trucks for sale',
    'buy car from dealer online',
    'car dealer quotes online',
    'used Honda for sale',
    'used Toyota for sale',
    'used Ford for sale',
    'low mileage used cars',
    'best price used cars',
    'trusted used car dealers',

    // Alabama
    'used cars Birmingham', 'car dealers Birmingham AL', 'used cars Montgomery', 'used cars Mobile AL', 'car dealers Huntsville',

    // Alaska
    'used cars Anchorage', 'car dealers Alaska', 'used cars Fairbanks', 'used cars Juneau',

    // Arizona
    'used cars Phoenix', 'car dealers Phoenix AZ', 'used cars Tucson', 'used cars Mesa AZ', 'car dealers Scottsdale', 'used cars Chandler AZ',

    // Arkansas
    'used cars Little Rock', 'car dealers Arkansas', 'used cars Fort Smith AR', 'used cars Fayetteville AR',

    // California
    'used cars Los Angeles', 'car dealers Los Angeles', 'used cars San Diego', 'used cars San Jose', 'car dealers San Francisco', 'used cars Fresno', 'used cars Sacramento', 'car dealers Orange County',

    // Colorado
    'used cars Denver', 'car dealers Denver CO', 'used cars Colorado Springs', 'used cars Aurora CO', 'car dealers Fort Collins',

    // Connecticut
    'used cars Connecticut', 'car dealers Hartford', 'used cars Bridgeport', 'used cars New Haven', 'used cars Stamford',

    // Delaware
    'used cars Wilmington', 'car dealers Delaware', 'used cars Dover DE',

    // Florida
    'used cars Jacksonville', 'car dealers Jacksonville FL', 'used cars Miami', 'used cars Tampa', 'car dealers Orlando', 'used cars St Petersburg', 'used cars Fort Lauderdale',

    // Georgia
    'used cars Atlanta', 'car dealers Atlanta GA', 'used cars Augusta', 'used cars Columbus GA', 'car dealers Savannah', 'used cars Macon GA',

    // Hawaii
    'used cars Honolulu', 'car dealers Hawaii', 'used cars Maui',

    // Idaho
    'used cars Boise', 'car dealers Idaho', 'used cars Meridian ID', 'used cars Nampa',

    // Illinois
    'used cars Chicago', 'car dealers Chicago IL', 'used cars Aurora IL', 'used cars Naperville', 'car dealers Rockford', 'used cars Joliet',

    // Indiana
    'used cars Indianapolis', 'car dealers Indianapolis IN', 'used cars Fort Wayne', 'used cars Evansville', 'used cars South Bend',

    // Iowa
    'used cars Des Moines', 'car dealers Iowa', 'used cars Cedar Rapids', 'used cars Davenport IA',

    // Kansas
    'used cars Wichita', 'car dealers Kansas', 'used cars Overland Park', 'used cars Kansas City KS', 'used cars Topeka',

    // Kentucky
    'used cars Louisville', 'car dealers Louisville KY', 'used cars Lexington', 'used cars Bowling Green KY',

    // Louisiana
    'used cars New Orleans', 'car dealers New Orleans LA', 'used cars Baton Rouge', 'used cars Shreveport', 'car dealers Lafayette LA',

    // Maine
    'used cars Portland ME', 'car dealers Maine', 'used cars Bangor',

    // Maryland
    'used cars Baltimore', 'car dealers Baltimore MD', 'used cars Columbia MD', 'used cars Silver Spring', 'used cars Germantown MD',

    // Massachusetts
    'used cars Boston', 'car dealers Boston MA', 'used cars Worcester', 'used cars Springfield MA', 'car dealers Cambridge',

    // Michigan
    'used cars Detroit', 'car dealers Detroit MI', 'used cars Grand Rapids', 'used cars Warren MI', 'car dealers Ann Arbor',

    // Minnesota
    'used cars Minneapolis', 'car dealers Minneapolis MN', 'used cars St Paul', 'used cars Rochester MN', 'used cars Duluth',

    // Mississippi
    'used cars Jackson MS', 'car dealers Mississippi', 'used cars Gulfport', 'used cars Biloxi',

    // Missouri
    'used cars Kansas City MO', 'car dealers St Louis', 'used cars St Louis MO', 'used cars Springfield MO', 'used cars Columbia MO',

    // Montana
    'used cars Billings', 'car dealers Montana', 'used cars Missoula', 'used cars Bozeman',

    // Nebraska
    'used cars Omaha', 'car dealers Omaha NE', 'used cars Lincoln NE', 'used cars Nebraska',

    // Nevada
    'used cars Las Vegas', 'car dealers Las Vegas NV', 'used cars Henderson NV', 'used cars Reno', 'used cars North Las Vegas',

    // New Hampshire
    'used cars Manchester NH', 'car dealers New Hampshire', 'used cars Nashua',

    // New Jersey
    'used cars Newark', 'car dealers New Jersey', 'used cars Jersey City', 'used cars Paterson NJ', 'used cars Edison NJ',

    // New Mexico
    'used cars Albuquerque', 'car dealers Albuquerque NM', 'used cars Las Cruces', 'used cars Santa Fe',

    // New York
    'used cars New York', 'car dealers New York City', 'used cars NYC', 'used cars Buffalo', 'car dealers Rochester NY', 'used cars Syracuse', 'used cars Yonkers',

    // North Carolina
    'used cars Charlotte', 'car dealers Charlotte NC', 'used cars Raleigh', 'used cars Greensboro', 'car dealers Durham NC', 'used cars Winston-Salem',

    // North Dakota
    'used cars Fargo', 'car dealers North Dakota', 'used cars Bismarck',

    // Ohio
    'used cars Columbus OH', 'car dealers Columbus Ohio', 'used cars Cleveland', 'used cars Cincinnati', 'car dealers Toledo', 'used cars Akron',

    // Oklahoma
    'used cars Oklahoma City', 'car dealers Oklahoma City OK', 'used cars Tulsa', 'used cars Norman OK',

    // Oregon
    'used cars Portland OR', 'car dealers Portland Oregon', 'used cars Eugene', 'used cars Salem OR', 'used cars Gresham',

    // Pennsylvania
    'used cars Philadelphia', 'car dealers Philadelphia PA', 'used cars Pittsburgh', 'used cars Allentown', 'car dealers Erie PA',

    // Rhode Island
    'used cars Providence', 'car dealers Rhode Island', 'used cars Warwick RI',

    // South Carolina
    'used cars Charleston SC', 'car dealers Charleston South Carolina', 'used cars Columbia SC', 'used cars Greenville SC', 'used cars Myrtle Beach',

    // South Dakota
    'used cars Sioux Falls', 'car dealers South Dakota', 'used cars Rapid City',

    // Tennessee
    'used cars Nashville', 'car dealers Nashville TN', 'used cars Memphis', 'used cars Knoxville', 'car dealers Chattanooga', 'used cars Clarksville TN',

    // Texas
    'used cars Houston', 'car dealers Houston TX', 'used cars San Antonio', 'used cars Dallas', 'car dealers Austin TX', 'used cars Fort Worth', 'used cars El Paso', 'used cars Arlington TX',

    // Utah
    'used cars Salt Lake City', 'car dealers Salt Lake City UT', 'used cars Provo', 'used cars West Valley City',

    // Vermont
    'used cars Burlington VT', 'car dealers Vermont',

    // Virginia
    'used cars Virginia Beach', 'car dealers Virginia Beach VA', 'used cars Norfolk', 'used cars Chesapeake VA', 'car dealers Richmond VA', 'used cars Newport News',

    // Washington
    'used cars Seattle', 'car dealers Seattle WA', 'used cars Spokane', 'used cars Tacoma', 'car dealers Bellevue WA', 'used cars Vancouver WA',

    // West Virginia
    'used cars Charleston WV', 'car dealers West Virginia', 'used cars Huntington WV',

    // Wisconsin
    'used cars Milwaukee', 'car dealers Milwaukee WI', 'used cars Madison WI', 'used cars Green Bay', 'used cars Kenosha',

    // Wyoming
    'used cars Cheyenne', 'car dealers Wyoming', 'used cars Casper WY',

    // Core Buying Intent Keywords (High Volume Transactional)
    'cars for sale',
    'trucks for sale',
    'suv',
    'truck',
    'car dealerships near me',
    'cheap used cars',
    'affordable cars',
    'pre-owned vehicles',

    // Toyota Models (High Intent + Low Competition)
    'toyota tacoma for sale',
    'toyota tundra for sale',
    'toyota 4runner price',
    'toyota camry price',
    'toyota prius price',
    'toyota rav4 price',
    'toyota tacoma price',
    'toyota tundra price',
    '4runner',
    'tacoma',
    'toyota hybrid',
    'toyota trucks',

    // Popular Models & Brands (High Search Volume)
    'lexus rx 350',
    'lexus suv',
    'ford raptor',
    'bmw m4',
    'honda civic type r',
    'kia telluride',
    'tahoe',
    'suburban',
    'jeep wrangler',
    'ram trucks',
    'mini cooper',
    'ford fusion',
    'kia stinger',
    'infiniti q50',
    'chrysler 300',
    'toyota venza',

    // High-Value SUVs & Crossovers (High CPC)
    'acura mdx',
    'acura rdx',
    'acura tlx',
    'bmw x3',
    'bmw x5',
    'bmw x7',
    'audi q5',
    'jeep grand cherokee',
    'jeep cherokee',
    'jeep gladiator',
    'jeep renegade',
    'jeep wagoneer',
    'nissan pathfinder',
    'honda pilot',
    'honda passport',
    'honda odyssey',
    'honda ridgeline',
    'ford explorer',
    'ford expedition',
    'buick enclave',
    'buick envision',
    'gmc acadia',
    'mazda cx5',
    'mazda cx 5',
    'kia carnival',
    'kia forte',
    'hyundai sonata',
    'hyundai kona',
    'volkswagen tiguan',
    'volkswagen atlas',
    'volvo xc90',
    'porsche macan',
    'mitsubishi outlander',

    // High-Value Trucks & Performance (High CPC)
    'f150',
    'ford f150',
    'ford f-150',
    'chevy colorado',
    'chevy silverado',
    'chevy equinox',
    'chevy malibu',
    'chevy trax',
    'toyota sienna',
    'toyota sequoia',
    'toyota tundra',
    'toyota minivan',
    'toyota gr86',
    'dodge durango',
    'dodge charger',
    'dodge challenger',
    'camaro',
    'rav4',
    'subaru ascent',
    'subaru wrx',

    // Luxury & Sports Cars (Premium Segment)
    'g wagon',
    'mercedes g wagon',
    'bmw i8',
    'porsche taycan',
    'miata',
    'mazda miata',
    'mx5 miata',

    // Vehicle Types & Categories
    'certified pre-owned',
    'low mileage cars',
    'fuel efficient cars',
    'family suv',
    'pickup trucks',
    'sports cars',
    'electric cars',
    'hybrid cars',

    // Competitor Alternative Keywords (Steal Traffic)
    'carmax alternative',
    'better than carvana',
    'carvana vs dealer',
    'enterprise car sales',
    'hertz car sales',
    'drivetime alternative',
    'autonation alternative',
    'buy from dealer not carvana',

    // Major Auto Brands
    'cadillac',
    'nissan',
    'infiniti',
    'lexus',
    'volkswagen',
    'mazda',
    'dodge',
    'chevy',
    'chevrolet',
    'audi',
    'bmw',
    'jeep',
    'ram',
    'hyundai',
    'kia',

    // National/Nationwide Keywords (Coast-to-Coast Coverage)
    'nationwide car dealers',
    'national car dealers',
    'nationwide used cars',
    'nationwide car marketplace',
    'buy cars nationwide',
    'shop cars nationally',
    'national used car dealers',
    'coast to coast car dealers',
    'nationwide auto dealers',
    'national auto marketplace',
    'online car dealers nationwide',
    'nationwide car shopping',
    'nationwide vehicle marketplace',
    'buy used cars anywhere in USA',
    'national car buying service',
    'all 50 states car dealers',

    // Nationwide Brand-Specific
    'nationwide toyota dealers',
    'nationwide honda dealers',
    'nationwide ford dealers',
    'nationwide chevrolet dealers',
    'nationwide nissan dealers',
    'nationwide jeep dealers',

    // Nationwide Services
    'nationwide car delivery',
    'nationwide car shipping',
    'nationwide dealer network',
    'coast to coast used cars',
    'buy cars from any state',
    'nationwide pre-owned cars',
    'national certified pre-owned',
    'USA wide car dealers',
    'America wide car sales',
    'cross country car buying'
  ],
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
    title: 'Buy Used Cars Online - Shop Certified Pre-Owned Vehicles | IQ Auto Deals',
    description: 'Shop thousands of quality used cars for sale online. Compare prices from local dealers, get instant offers, and save up to $5,000. Browse certified pre-owned vehicles with transparent pricing.',
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
    title: 'Buy Used Cars Online - Compare Dealer Prices | IQ Auto Deals',
    description: 'Shop thousands of quality used cars. Get instant offers from local dealers and save up to $5,000 on your next vehicle.',
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
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="msvalidate.01" content="3BCD417E7943B96A06FC27AF503F3523" />
        <OrganizationSchema />
        <LocalBusinessSchema />
        <WebsiteSchema />
        <AutoDealerSchema />
      </head>
      <body className="antialiased">
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </Suspense>
          <Analytics debug={true} />
        </PostHogProvider>
      </body>
    </html>
  );
}
