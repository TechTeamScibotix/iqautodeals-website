import Link from 'next/link';
import Image from 'next/image';

// Popular locations for footer - organized by region
const popularLocations = {
  'West': [
    { slug: 'los-angeles', name: 'Los Angeles' },
    { slug: 'san-diego', name: 'San Diego' },
    { slug: 'san-francisco', name: 'San Francisco' },
    { slug: 'seattle', name: 'Seattle' },
    { slug: 'phoenix', name: 'Phoenix' },
    { slug: 'denver', name: 'Denver' },
    { slug: 'las-vegas', name: 'Las Vegas' },
    { slug: 'portland-or', name: 'Portland' },
  ],
  'South': [
    { slug: 'atlanta', name: 'Atlanta' },
    { slug: 'houston', name: 'Houston' },
    { slug: 'dallas', name: 'Dallas' },
    { slug: 'miami', name: 'Miami' },
    { slug: 'tampa', name: 'Tampa' },
    { slug: 'charlotte', name: 'Charlotte' },
    { slug: 'nashville', name: 'Nashville' },
    { slug: 'austin', name: 'Austin' },
  ],
  'Midwest': [
    { slug: 'chicago', name: 'Chicago' },
    { slug: 'detroit', name: 'Detroit' },
    { slug: 'minneapolis', name: 'Minneapolis' },
    { slug: 'indianapolis', name: 'Indianapolis' },
    { slug: 'columbus-oh', name: 'Columbus' },
    { slug: 'cleveland', name: 'Cleveland' },
    { slug: 'milwaukee', name: 'Milwaukee' },
    { slug: 'kansas-city-mo', name: 'Kansas City' },
  ],
  'Northeast': [
    { slug: 'new-york', name: 'New York' },
    { slug: 'philadelphia', name: 'Philadelphia' },
    { slug: 'boston', name: 'Boston' },
    { slug: 'pittsburgh', name: 'Pittsburgh' },
    { slug: 'baltimore', name: 'Baltimore' },
    { slug: 'newark', name: 'Newark' },
    { slug: 'buffalo', name: 'Buffalo' },
    { slug: 'providence', name: 'Providence' },
  ],
};

// All locations flattened for comprehensive linking
const allLocations = [
  // Alabama
  { slug: 'birmingham', name: 'Birmingham, AL' },
  { slug: 'montgomery', name: 'Montgomery, AL' },
  { slug: 'mobile', name: 'Mobile, AL' },
  { slug: 'huntsville', name: 'Huntsville, AL' },
  // Alaska
  { slug: 'anchorage', name: 'Anchorage, AK' },
  { slug: 'fairbanks', name: 'Fairbanks, AK' },
  { slug: 'juneau', name: 'Juneau, AK' },
  // Arizona
  { slug: 'phoenix', name: 'Phoenix, AZ' },
  { slug: 'tucson', name: 'Tucson, AZ' },
  { slug: 'mesa', name: 'Mesa, AZ' },
  { slug: 'scottsdale', name: 'Scottsdale, AZ' },
  { slug: 'chandler', name: 'Chandler, AZ' },
  // Arkansas
  { slug: 'little-rock', name: 'Little Rock, AR' },
  { slug: 'fort-smith', name: 'Fort Smith, AR' },
  { slug: 'fayetteville', name: 'Fayetteville, AR' },
  // California
  { slug: 'los-angeles', name: 'Los Angeles, CA' },
  { slug: 'san-diego', name: 'San Diego, CA' },
  { slug: 'san-jose', name: 'San Jose, CA' },
  { slug: 'san-francisco', name: 'San Francisco, CA' },
  { slug: 'fresno', name: 'Fresno, CA' },
  { slug: 'sacramento', name: 'Sacramento, CA' },
  // Colorado
  { slug: 'denver', name: 'Denver, CO' },
  { slug: 'colorado-springs', name: 'Colorado Springs, CO' },
  { slug: 'aurora-co', name: 'Aurora, CO' },
  { slug: 'fort-collins', name: 'Fort Collins, CO' },
  // Connecticut
  { slug: 'hartford', name: 'Hartford, CT' },
  { slug: 'bridgeport', name: 'Bridgeport, CT' },
  { slug: 'new-haven', name: 'New Haven, CT' },
  { slug: 'stamford', name: 'Stamford, CT' },
  // Delaware
  { slug: 'wilmington', name: 'Wilmington, DE' },
  { slug: 'dover', name: 'Dover, DE' },
  // Florida
  { slug: 'jacksonville', name: 'Jacksonville, FL' },
  { slug: 'miami', name: 'Miami, FL' },
  { slug: 'tampa', name: 'Tampa, FL' },
  { slug: 'orlando', name: 'Orlando, FL' },
  { slug: 'st-petersburg', name: 'St Petersburg, FL' },
  { slug: 'fort-lauderdale', name: 'Fort Lauderdale, FL' },
  // Georgia
  { slug: 'atlanta', name: 'Atlanta, GA' },
  { slug: 'augusta', name: 'Augusta, GA' },
  { slug: 'columbus', name: 'Columbus, GA' },
  { slug: 'savannah', name: 'Savannah, GA' },
  { slug: 'macon', name: 'Macon, GA' },
  // Hawaii
  { slug: 'honolulu', name: 'Honolulu, HI' },
  // Idaho
  { slug: 'boise', name: 'Boise, ID' },
  { slug: 'meridian', name: 'Meridian, ID' },
  { slug: 'nampa', name: 'Nampa, ID' },
  // Illinois
  { slug: 'chicago', name: 'Chicago, IL' },
  { slug: 'aurora-il', name: 'Aurora, IL' },
  { slug: 'naperville', name: 'Naperville, IL' },
  { slug: 'rockford', name: 'Rockford, IL' },
  { slug: 'joliet', name: 'Joliet, IL' },
  // Indiana
  { slug: 'indianapolis', name: 'Indianapolis, IN' },
  { slug: 'fort-wayne', name: 'Fort Wayne, IN' },
  { slug: 'evansville', name: 'Evansville, IN' },
  { slug: 'south-bend', name: 'South Bend, IN' },
  // Iowa
  { slug: 'des-moines', name: 'Des Moines, IA' },
  { slug: 'cedar-rapids', name: 'Cedar Rapids, IA' },
  { slug: 'davenport', name: 'Davenport, IA' },
  // Kansas
  { slug: 'wichita', name: 'Wichita, KS' },
  { slug: 'overland-park', name: 'Overland Park, KS' },
  { slug: 'kansas-city-ks', name: 'Kansas City, KS' },
  { slug: 'topeka', name: 'Topeka, KS' },
  // Kentucky
  { slug: 'louisville', name: 'Louisville, KY' },
  { slug: 'lexington', name: 'Lexington, KY' },
  { slug: 'bowling-green', name: 'Bowling Green, KY' },
  // Louisiana
  { slug: 'new-orleans', name: 'New Orleans, LA' },
  { slug: 'baton-rouge', name: 'Baton Rouge, LA' },
  { slug: 'shreveport', name: 'Shreveport, LA' },
  { slug: 'lafayette', name: 'Lafayette, LA' },
  // Maine
  { slug: 'portland-me', name: 'Portland, ME' },
  { slug: 'bangor', name: 'Bangor, ME' },
  // Maryland
  { slug: 'baltimore', name: 'Baltimore, MD' },
  { slug: 'columbia-md', name: 'Columbia, MD' },
  { slug: 'silver-spring', name: 'Silver Spring, MD' },
  { slug: 'germantown', name: 'Germantown, MD' },
  // Massachusetts
  { slug: 'boston', name: 'Boston, MA' },
  { slug: 'worcester', name: 'Worcester, MA' },
  { slug: 'springfield', name: 'Springfield, MA' },
  { slug: 'cambridge', name: 'Cambridge, MA' },
  // Michigan
  { slug: 'detroit', name: 'Detroit, MI' },
  { slug: 'grand-rapids', name: 'Grand Rapids, MI' },
  { slug: 'warren', name: 'Warren, MI' },
  { slug: 'ann-arbor', name: 'Ann Arbor, MI' },
  // Minnesota
  { slug: 'minneapolis', name: 'Minneapolis, MN' },
  { slug: 'st-paul', name: 'St Paul, MN' },
  { slug: 'rochester-mn', name: 'Rochester, MN' },
  { slug: 'duluth', name: 'Duluth, MN' },
  // Mississippi
  { slug: 'jackson', name: 'Jackson, MS' },
  { slug: 'gulfport', name: 'Gulfport, MS' },
  { slug: 'biloxi', name: 'Biloxi, MS' },
  // Missouri
  { slug: 'kansas-city-mo', name: 'Kansas City, MO' },
  { slug: 'st-louis', name: 'St Louis, MO' },
  { slug: 'springfield-mo', name: 'Springfield, MO' },
  { slug: 'columbia-mo', name: 'Columbia, MO' },
  // Montana
  { slug: 'billings', name: 'Billings, MT' },
  { slug: 'missoula', name: 'Missoula, MT' },
  { slug: 'bozeman', name: 'Bozeman, MT' },
  // Nebraska
  { slug: 'omaha', name: 'Omaha, NE' },
  { slug: 'lincoln', name: 'Lincoln, NE' },
  // Nevada
  { slug: 'las-vegas', name: 'Las Vegas, NV' },
  { slug: 'henderson', name: 'Henderson, NV' },
  { slug: 'reno', name: 'Reno, NV' },
  { slug: 'north-las-vegas', name: 'North Las Vegas, NV' },
  // New Hampshire
  { slug: 'manchester', name: 'Manchester, NH' },
  { slug: 'nashua', name: 'Nashua, NH' },
  // New Jersey
  { slug: 'newark', name: 'Newark, NJ' },
  { slug: 'jersey-city', name: 'Jersey City, NJ' },
  { slug: 'paterson', name: 'Paterson, NJ' },
  { slug: 'edison', name: 'Edison, NJ' },
  // New Mexico
  { slug: 'albuquerque', name: 'Albuquerque, NM' },
  { slug: 'las-cruces', name: 'Las Cruces, NM' },
  { slug: 'santa-fe', name: 'Santa Fe, NM' },
  // New York
  { slug: 'new-york', name: 'New York, NY' },
  { slug: 'buffalo', name: 'Buffalo, NY' },
  { slug: 'rochester-ny', name: 'Rochester, NY' },
  { slug: 'syracuse', name: 'Syracuse, NY' },
  { slug: 'yonkers', name: 'Yonkers, NY' },
  // North Carolina
  { slug: 'charlotte', name: 'Charlotte, NC' },
  { slug: 'raleigh', name: 'Raleigh, NC' },
  { slug: 'greensboro', name: 'Greensboro, NC' },
  { slug: 'durham', name: 'Durham, NC' },
  { slug: 'winston-salem', name: 'Winston-Salem, NC' },
  // North Dakota
  { slug: 'fargo', name: 'Fargo, ND' },
  { slug: 'bismarck', name: 'Bismarck, ND' },
  // Ohio
  { slug: 'columbus-oh', name: 'Columbus, OH' },
  { slug: 'cleveland', name: 'Cleveland, OH' },
  { slug: 'cincinnati', name: 'Cincinnati, OH' },
  { slug: 'toledo', name: 'Toledo, OH' },
  { slug: 'akron', name: 'Akron, OH' },
  // Oklahoma
  { slug: 'oklahoma-city', name: 'Oklahoma City, OK' },
  { slug: 'tulsa', name: 'Tulsa, OK' },
  { slug: 'norman', name: 'Norman, OK' },
  // Oregon
  { slug: 'portland-or', name: 'Portland, OR' },
  { slug: 'eugene', name: 'Eugene, OR' },
  { slug: 'salem', name: 'Salem, OR' },
  { slug: 'gresham', name: 'Gresham, OR' },
  // Pennsylvania
  { slug: 'philadelphia', name: 'Philadelphia, PA' },
  { slug: 'pittsburgh', name: 'Pittsburgh, PA' },
  { slug: 'allentown', name: 'Allentown, PA' },
  { slug: 'erie', name: 'Erie, PA' },
  // Rhode Island
  { slug: 'providence', name: 'Providence, RI' },
  { slug: 'warwick', name: 'Warwick, RI' },
  // South Carolina
  { slug: 'charleston', name: 'Charleston, SC' },
  { slug: 'columbia-sc', name: 'Columbia, SC' },
  { slug: 'greenville', name: 'Greenville, SC' },
  { slug: 'myrtle-beach', name: 'Myrtle Beach, SC' },
  // South Dakota
  { slug: 'sioux-falls', name: 'Sioux Falls, SD' },
  { slug: 'rapid-city', name: 'Rapid City, SD' },
  // Tennessee
  { slug: 'nashville', name: 'Nashville, TN' },
  { slug: 'memphis', name: 'Memphis, TN' },
  { slug: 'knoxville', name: 'Knoxville, TN' },
  { slug: 'chattanooga', name: 'Chattanooga, TN' },
  { slug: 'clarksville', name: 'Clarksville, TN' },
  // Texas
  { slug: 'houston', name: 'Houston, TX' },
  { slug: 'san-antonio', name: 'San Antonio, TX' },
  { slug: 'dallas', name: 'Dallas, TX' },
  { slug: 'austin', name: 'Austin, TX' },
  { slug: 'fort-worth', name: 'Fort Worth, TX' },
  { slug: 'el-paso', name: 'El Paso, TX' },
  { slug: 'arlington', name: 'Arlington, TX' },
  // Utah
  { slug: 'salt-lake-city', name: 'Salt Lake City, UT' },
  { slug: 'provo', name: 'Provo, UT' },
  { slug: 'west-valley-city', name: 'West Valley City, UT' },
  // Vermont
  { slug: 'burlington', name: 'Burlington, VT' },
  // Virginia
  { slug: 'virginia-beach', name: 'Virginia Beach, VA' },
  { slug: 'norfolk', name: 'Norfolk, VA' },
  { slug: 'chesapeake', name: 'Chesapeake, VA' },
  { slug: 'richmond', name: 'Richmond, VA' },
  { slug: 'newport-news', name: 'Newport News, VA' },
  // Washington
  { slug: 'seattle', name: 'Seattle, WA' },
  { slug: 'spokane', name: 'Spokane, WA' },
  { slug: 'tacoma', name: 'Tacoma, WA' },
  { slug: 'bellevue', name: 'Bellevue, WA' },
  { slug: 'vancouver-wa', name: 'Vancouver, WA' },
  // West Virginia
  { slug: 'charleston-wv', name: 'Charleston, WV' },
  { slug: 'huntington', name: 'Huntington, WV' },
  // Wisconsin
  { slug: 'milwaukee', name: 'Milwaukee, WI' },
  { slug: 'madison', name: 'Madison, WI' },
  { slug: 'green-bay', name: 'Green Bay, WI' },
  { slug: 'kenosha', name: 'Kenosha, WI' },
  // Wyoming
  { slug: 'cheyenne', name: 'Cheyenne, WY' },
  { slug: 'casper', name: 'Casper, WY' },
];

// Popular models organized by brand
const popularModels = {
  'Toyota': [
    { slug: 'toyota-tacoma', name: 'Tacoma' },
    { slug: 'toyota-4runner', name: '4Runner' },
    { slug: 'toyota-rav4', name: 'RAV4' },
    { slug: 'toyota-camry', name: 'Camry' },
    { slug: 'toyota-tundra', name: 'Tundra' },
    { slug: 'toyota-prius', name: 'Prius' },
    { slug: 'toyota-sienna', name: 'Sienna' },
    { slug: 'toyota-sequoia', name: 'Sequoia' },
  ],
  'Honda': [
    { slug: 'honda-civic', name: 'Civic' },
    { slug: 'honda-cr-v', name: 'CR-V' },
    { slug: 'honda-pilot', name: 'Pilot' },
    { slug: 'honda-accord', name: 'Accord' },
    { slug: 'honda-odyssey', name: 'Odyssey' },
    { slug: 'honda-passport', name: 'Passport' },
    { slug: 'honda-ridgeline', name: 'Ridgeline' },
  ],
  'Ford': [
    { slug: 'ford-f150', name: 'F-150' },
    { slug: 'ford-explorer', name: 'Explorer' },
    { slug: 'ford-expedition', name: 'Expedition' },
    { slug: 'ford-fusion', name: 'Fusion' },
    { slug: 'ford-raptor', name: 'Raptor' },
  ],
  'Chevrolet': [
    { slug: 'chevy-silverado', name: 'Silverado' },
    { slug: 'chevy-tahoe', name: 'Tahoe' },
    { slug: 'chevy-suburban', name: 'Suburban' },
    { slug: 'chevy-equinox', name: 'Equinox' },
    { slug: 'chevy-colorado', name: 'Colorado' },
    { slug: 'chevy-malibu', name: 'Malibu' },
    { slug: 'chevy-camaro', name: 'Camaro' },
  ],
  'Jeep': [
    { slug: 'jeep-wrangler', name: 'Wrangler' },
    { slug: 'jeep-grand-cherokee', name: 'Grand Cherokee' },
    { slug: 'jeep-cherokee', name: 'Cherokee' },
    { slug: 'jeep-gladiator', name: 'Gladiator' },
    { slug: 'jeep-renegade', name: 'Renegade' },
  ],
  'Other Popular': [
    { slug: 'bmw-x5', name: 'BMW X5' },
    { slug: 'bmw-x3', name: 'BMW X3' },
    { slug: 'bmw-3-series', name: 'BMW 3 Series' },
    { slug: 'bmw-m4', name: 'BMW M4' },
    { slug: 'audi-q5', name: 'Audi Q5' },
    { slug: 'audi-a4', name: 'Audi A4' },
    { slug: 'lexus-rx350', name: 'Lexus RX 350' },
    { slug: 'mercedes-g-wagon', name: 'Mercedes G-Wagon' },
    { slug: 'mazda-cx5', name: 'Mazda CX-5' },
    { slug: 'mazda-miata', name: 'Mazda Miata' },
    { slug: 'nissan-pathfinder', name: 'Nissan Pathfinder' },
    { slug: 'nissan-altima', name: 'Nissan Altima' },
    { slug: 'dodge-durango', name: 'Dodge Durango' },
    { slug: 'dodge-charger', name: 'Dodge Charger' },
    { slug: 'dodge-challenger', name: 'Dodge Challenger' },
    { slug: 'ram-1500', name: 'Ram 1500' },
    { slug: 'subaru-outback', name: 'Subaru Outback' },
    { slug: 'subaru-forester', name: 'Subaru Forester' },
    { slug: 'subaru-wrx', name: 'Subaru WRX' },
    { slug: 'kia-telluride', name: 'Kia Telluride' },
    { slug: 'kia-stinger', name: 'Kia Stinger' },
    { slug: 'kia-carnival', name: 'Kia Carnival' },
    { slug: 'hyundai-sonata', name: 'Hyundai Sonata' },
    { slug: 'hyundai-tucson', name: 'Hyundai Tucson' },
    { slug: 'hyundai-santa-fe', name: 'Hyundai Santa Fe' },
    { slug: 'volkswagen-tiguan', name: 'VW Tiguan' },
    { slug: 'volkswagen-atlas', name: 'VW Atlas' },
    { slug: 'gmc-acadia', name: 'GMC Acadia' },
    { slug: 'gmc-sierra', name: 'GMC Sierra' },
    { slug: 'buick-enclave', name: 'Buick Enclave' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Browse by Location Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-primary-light">Browse Used Cars by Location</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(popularLocations).map(([region, cities]) => (
              <div key={region}>
                <h4 className="font-semibold text-gray-300 mb-3">{region}</h4>
                <ul className="space-y-1">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/locations/${city.slug}`}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        Used Cars in {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/locations" className="text-primary-light hover:text-white font-semibold text-sm">
              View All 180+ Locations →
            </Link>
          </div>
        </div>

        {/* Browse by Model Section */}
        <div className="mb-12 border-t border-gray-700 pt-12">
          <h3 className="text-xl font-bold mb-6 text-accent-light">Browse Used Cars by Model</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Object.entries(popularModels).slice(0, 5).map(([brand, models]) => (
              <div key={brand}>
                <h4 className="font-semibold text-gray-300 mb-3">{brand}</h4>
                <ul className="space-y-1">
                  {models.slice(0, 6).map((model) => (
                    <li key={model.slug}>
                      <Link
                        href={`/models/${model.slug}`}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        {model.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">More Brands</h4>
              <ul className="space-y-1">
                <li><Link href="/models/bmw-x5" className="text-gray-400 hover:text-white text-sm">BMW X5</Link></li>
                <li><Link href="/models/audi-q5" className="text-gray-400 hover:text-white text-sm">Audi Q5</Link></li>
                <li><Link href="/models/lexus-rx350" className="text-gray-400 hover:text-white text-sm">Lexus RX 350</Link></li>
                <li><Link href="/models/mazda-cx5" className="text-gray-400 hover:text-white text-sm">Mazda CX-5</Link></li>
                <li><Link href="/models/subaru-outback" className="text-gray-400 hover:text-white text-sm">Subaru Outback</Link></li>
                <li><Link href="/models/kia-telluride" className="text-gray-400 hover:text-white text-sm">Kia Telluride</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/models" className="text-accent-light hover:text-white font-semibold text-sm">
              View All 60+ Models →
            </Link>
          </div>
        </div>

        {/* All Locations Expandable Section */}
        <div className="mb-12 border-t border-gray-700 pt-12">
          <h3 className="text-lg font-bold mb-4 text-gray-300">All Locations</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {allLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
              >
                {location.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links & Company Info */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">For Buyers</h4>
              <ul className="space-y-2">
                <li><Link href="/cars" className="text-gray-400 hover:text-white text-sm">Search Cars</Link></li>
                <li><Link href="/register?type=customer" className="text-gray-400 hover:text-white text-sm">Sign Up</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white text-sm">Login</Link></li>
                <li><Link href="/guides/how-to-buy-used-car" className="text-gray-400 hover:text-white text-sm">How to Buy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">For Dealers</h4>
              <ul className="space-y-2">
                <li><Link href="/register?type=dealer" className="text-gray-400 hover:text-white text-sm">Dealer Sign Up</Link></li>
                <li><Link href="/dealer-integration" className="text-gray-400 hover:text-white text-sm">Dealer Integration</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white text-sm">Dealer Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
                <li><Link href="/blog/how-to-finance-used-car-2025" className="text-gray-400 hover:text-white text-sm">Financing Guide</Link></li>
                <li><Link href="/blog/best-used-cars-under-20k" className="text-gray-400 hover:text-white text-sm">Best Cars Under $20k</Link></li>
                <li><Link href="/guides/pre-purchase-inspection" className="text-gray-400 hover:text-white text-sm">Inspection Checklist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/locations" className="text-gray-400 hover:text-white text-sm">All Locations</Link></li>
                <li><Link href="/models" className="text-gray-400 hover:text-white text-sm">All Models</Link></li>
                <li><Link href="/forgot-password" className="text-gray-400 hover:text-white text-sm">Forgot Password</Link></li>
              </ul>
            </div>
          </div>

          {/* Logo & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700">
            <div className="mb-4 md:mb-0">
              <div className="h-14">
                <Image
                  src="/logo-header.png"
                  alt="IQ Auto Deals - Intelligent Quality Deals"
                  width={500}
                  height={80}
                  className="h-full w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm mt-1">Your trusted marketplace for quality used cars online</p>
            </div>
            <p className="text-gray-500 text-sm">&copy; 2025 IQ Auto Deals. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Export data for use in other components
export { popularLocations, popularModels, allLocations };
