import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Used Cars by Location - Shop Local Dealers Nationwide | IQ Auto Deals',
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
          <p className="text-xl mb-8">
            Browse quality used cars from trusted dealers across all 50 states
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
      </section>

      <Footer />
    </div>
  );
}
