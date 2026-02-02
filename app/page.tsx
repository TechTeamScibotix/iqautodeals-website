import Link from 'next/link';
import HomeClient from './HomeClient';

// Server component wrapper - renders SEO content visible to crawlers
export default function HomePage() {
  return (
    <>
      {/* SEO content visible to crawlers (server-rendered) */}
      <div className="sr-only">
        <h1>Shop Used Cars Online - Compare Prices from Local Dealers | IQ Auto Deals</h1>
        <p>
          IQ Auto Deals is a nationwide online car marketplace connecting buyers with certified dealers.
          Browse thousands of quality used cars, compare prices from multiple dealers, and save hundreds
          on your next vehicle purchase. Our unique dealer competition model helps you get the best deal
          without haggling.
        </p>
        <nav aria-label="Main sections">
          <ul>
            <li><Link href="/cars">Browse All Cars</Link></li>
            <li><Link href="/new-cars">New Cars for Sale</Link></li>
            <li><Link href="/cars?condition=used">Used Cars for Sale</Link></li>
            <li><Link href="/locations/atlanta">Cars in Atlanta</Link></li>
            <li><Link href="/locations/miami">Cars in Miami</Link></li>
            <li><Link href="/locations/houston">Cars in Houston</Link></li>
            <li><Link href="/locations/dallas">Cars in Dallas</Link></li>
            <li><Link href="/locations/chicago">Cars in Chicago</Link></li>
            <li><Link href="/locations/los-angeles">Cars in Los Angeles</Link></li>
            <li><Link href="/models/toyota-camry">Toyota Camry</Link></li>
            <li><Link href="/models/honda-civic">Honda Civic</Link></li>
            <li><Link href="/models/ford-f150">Ford F-150</Link></li>
            <li><Link href="/about">About IQ Auto Deals</Link></li>
            <li><Link href="/blog">Car Buying Guides</Link></li>
            <li><Link href="/for-dealers">For Dealers</Link></li>
          </ul>
        </nav>
      </div>

      {/* Interactive client component */}
      <HomeClient />
    </>
  );
}
