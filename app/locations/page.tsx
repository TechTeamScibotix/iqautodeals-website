import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import Footer from '../components/Footer';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Used Cars by Location - Find Local Dealers | IQ Auto Deals',
  description: 'Find quality used cars for sale in your area. Browse our network of trusted dealers across all 50 states. Compare prices and save thousands on your next vehicle.',
  keywords: ['used cars by location', 'local car dealers', 'used cars near me', 'car dealers by state', 'nationwide used cars'],
};

const locationsByState = {
  'Alabama': ['birmingham', 'montgomery', 'mobile', 'huntsville'],
  'Alaska': ['anchorage', 'fairbanks', 'juneau'],
  'Arizona': ['phoenix', 'tucson', 'mesa', 'scottsdale', 'chandler'],
  'Arkansas': ['little-rock', 'fort-smith', 'fayetteville'],
  'California': ['los-angeles', 'san-diego', 'san-jose', 'san-francisco', 'fresno', 'sacramento'],
  'Colorado': ['denver', 'colorado-springs', 'aurora-co', 'fort-collins'],
  'Connecticut': ['hartford', 'bridgeport', 'new-haven', 'stamford'],
  'Delaware': ['wilmington', 'dover'],
  'Florida': ['jacksonville', 'miami', 'tampa', 'orlando', 'st-petersburg', 'fort-lauderdale'],
  'Georgia': ['atlanta', 'augusta', 'columbus', 'savannah', 'macon'],
  'Hawaii': ['honolulu'],
  'Idaho': ['boise', 'meridian', 'nampa'],
  'Illinois': ['chicago', 'aurora-il', 'naperville', 'rockford', 'joliet'],
  'Indiana': ['indianapolis', 'fort-wayne', 'evansville', 'south-bend'],
  'Iowa': ['des-moines', 'cedar-rapids', 'davenport'],
  'Kansas': ['wichita', 'overland-park', 'kansas-city-ks', 'topeka'],
  'Kentucky': ['louisville', 'lexington', 'bowling-green'],
  'Louisiana': ['new-orleans', 'baton-rouge', 'shreveport', 'lafayette'],
  'Maine': ['portland-me', 'bangor'],
  'Maryland': ['baltimore', 'columbia-md', 'silver-spring', 'germantown'],
  'Massachusetts': ['boston', 'worcester', 'springfield', 'cambridge'],
  'Michigan': ['detroit', 'grand-rapids', 'warren', 'ann-arbor'],
  'Minnesota': ['minneapolis', 'st-paul', 'rochester-mn', 'duluth'],
  'Mississippi': ['jackson', 'gulfport', 'biloxi'],
  'Missouri': ['kansas-city-mo', 'st-louis', 'springfield-mo', 'columbia-mo'],
  'Montana': ['billings', 'missoula', 'bozeman'],
  'Nebraska': ['omaha', 'lincoln'],
  'Nevada': ['las-vegas', 'henderson', 'reno', 'north-las-vegas'],
  'New Hampshire': ['manchester', 'nashua'],
  'New Jersey': ['newark', 'jersey-city', 'paterson', 'edison'],
  'New Mexico': ['albuquerque', 'las-cruces', 'santa-fe'],
  'New York': ['new-york', 'buffalo', 'rochester-ny', 'syracuse', 'yonkers'],
  'North Carolina': ['charlotte', 'raleigh', 'greensboro', 'durham', 'winston-salem'],
  'North Dakota': ['fargo', 'bismarck'],
  'Ohio': ['columbus-oh', 'cleveland', 'cincinnati', 'toledo', 'akron'],
  'Oklahoma': ['oklahoma-city', 'tulsa', 'norman'],
  'Oregon': ['portland-or', 'eugene', 'salem', 'gresham'],
  'Pennsylvania': ['philadelphia', 'pittsburgh', 'allentown', 'erie'],
  'Rhode Island': ['providence', 'warwick'],
  'South Carolina': ['charleston', 'columbia-sc', 'greenville', 'myrtle-beach'],
  'South Dakota': ['sioux-falls', 'rapid-city'],
  'Tennessee': ['nashville', 'memphis', 'knoxville', 'chattanooga', 'clarksville'],
  'Texas': ['houston', 'san-antonio', 'dallas', 'austin', 'fort-worth', 'el-paso', 'arlington'],
  'Utah': ['salt-lake-city', 'provo', 'west-valley-city'],
  'Vermont': ['burlington'],
  'Virginia': ['virginia-beach', 'norfolk', 'chesapeake', 'richmond', 'newport-news'],
  'Washington': ['seattle', 'spokane', 'tacoma', 'bellevue', 'vancouver-wa'],
  'West Virginia': ['charleston-wv', 'huntington'],
  'Wisconsin': ['milwaukee', 'madison', 'green-bay', 'kenosha'],
  'Wyoming': ['cheyenne', 'casper'],
};

// Helper to format city names
const formatCityName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/ Co$/, ', CO')
    .replace(/ Il$/, ', IL')
    .replace(/ Md$/, ', MD')
    .replace(/ Me$/, ', ME')
    .replace(/ Mn$/, ', MN')
    .replace(/ Mo$/, ', MO')
    .replace(/ Ny$/, ', NY')
    .replace(/ Or$/, ', OR')
    .replace(/ Sc$/, ', SC')
    .replace(/ Wa$/, ', WA')
    .replace(/ Wv$/, ', WV')
    .replace(/ Ks$/, ', KS');
};

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Used Cars in Your Area
          </h1>
          <p className="text-xl mb-4">
            Browse quality used cars from trusted dealers across all 50 states.
            IQ Auto Deals connects you with certified dealerships in every major city,
            making it easy to compare prices and find the perfect vehicle near you.
          </p>
          <p className="text-lg mb-8 text-blue-100">
            Our nationwide network includes thousands of verified dealers offering
            sedans, SUVs, trucks, and more. Save up to $5,000 when dealers compete
            for your business.
          </p>
          <Link
            href="/cars"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Inventory
          </Link>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Shop by Location</h2>
          <p className="text-xl text-gray-700">
            Select your state and city to find local dealers and compare prices
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(locationsByState).map(([state, cities]) => (
            <div key={state} className="border-b border-gray-200 pb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">{state}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/locations/${city}`}
                    className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition group"
                  >
                    <span className="text-gray-900 group-hover:text-blue-600 font-medium">
                      {formatCityName(city)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Popular Models Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Popular Models</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/models/toyota-tacoma" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota Tacoma</span>
            </Link>
            <Link href="/models/toyota-4runner" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota 4Runner</span>
            </Link>
            <Link href="/models/honda-civic" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda Civic</span>
            </Link>
            <Link href="/models/honda-cr-v" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda CR-V</span>
            </Link>
            <Link href="/models/ford-f150" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Ford F-150</span>
            </Link>
            <Link href="/models/chevy-silverado" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Chevy Silverado</span>
            </Link>
            <Link href="/models/jeep-wrangler" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jeep Wrangler</span>
            </Link>
            <Link href="/models/jeep-grand-cherokee" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jeep Grand Cherokee</span>
            </Link>
            <Link href="/models/bmw-x5" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">BMW X5</span>
            </Link>
            <Link href="/models/lexus-rx350" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Lexus RX 350</span>
            </Link>
            <Link href="/models/subaru-outback" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Subaru Outback</span>
            </Link>
            <Link href="/models/kia-telluride" className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Kia Telluride</span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/models" className="text-blue-600 font-semibold hover:underline">
              View All Models →
            </Link>
          </div>
        </div>

        {/* Why Shop Local Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Shop with Local Dealers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Convenient Test Drives</h3>
              <p className="text-gray-600">
                Visit nearby dealerships to see vehicles in person. Test drive your top choices
                before making a decision. No shipping delays or sight-unseen purchases.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Local Dealers</h3>
              <p className="text-gray-600">
                All dealers in our network are licensed and verified. We partner only with
                reputable dealerships that meet our quality standards and customer service requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Competitive Local Pricing</h3>
              <p className="text-gray-600">
                Get multiple offers from dealers in your area. Local competition means better
                prices for you. Save thousands without traveling across the country.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">How IQ Auto Deals Works</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              Finding the right car at the right price has never been easier. IQ Auto Deals
              is a nationwide online marketplace that connects car buyers with certified
              dealers across the United States. Unlike traditional car shopping, our platform
              lets dealers compete for your business, ensuring you get the best possible deal.
            </p>
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <p><strong>Browse vehicles</strong> from thousands of listings across all 50 states. Filter by location, make, model, price, and more.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <p><strong>Select up to 4 vehicles</strong> you are interested in. Add them to your deal list to compare options.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <p><strong>Submit your deal request</strong> and let dealers compete. Receive offers directly from local certified dealers.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <p><strong>Choose the best offer</strong> and complete your purchase at the dealership. No haggling required.</p>
              </li>
            </ol>
            <p className="text-lg text-gray-700 mt-6">
              Our service is completely free for car buyers. There are no fees, no obligations,
              and no pressure. Start browsing today and discover why thousands of buyers trust
              IQ Auto Deals to find their next vehicle.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
