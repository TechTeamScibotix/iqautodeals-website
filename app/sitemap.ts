import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://iqautodeals.com'

  // All locations
  const locations = [
    'birmingham', 'montgomery', 'mobile', 'huntsville',
    'anchorage', 'fairbanks', 'juneau',
    'phoenix', 'tucson', 'mesa', 'scottsdale', 'chandler',
    'little-rock', 'fort-smith', 'fayetteville',
    'los-angeles', 'san-diego', 'san-jose', 'san-francisco', 'fresno', 'sacramento',
    'denver', 'colorado-springs', 'aurora-co', 'fort-collins',
    'hartford', 'bridgeport', 'new-haven', 'stamford',
    'wilmington', 'dover',
    'jacksonville', 'miami', 'tampa', 'orlando', 'st-petersburg', 'fort-lauderdale',
    'atlanta', 'augusta', 'columbus', 'savannah', 'macon',
    'honolulu',
    'boise', 'meridian', 'nampa',
    'chicago', 'aurora-il', 'naperville', 'rockford', 'joliet',
    'indianapolis', 'fort-wayne', 'evansville', 'south-bend',
    'des-moines', 'cedar-rapids', 'davenport',
    'wichita', 'overland-park', 'kansas-city-ks', 'topeka',
    'louisville', 'lexington', 'bowling-green',
    'new-orleans', 'baton-rouge', 'shreveport', 'lafayette',
    'portland-me', 'bangor',
    'baltimore', 'columbia-md', 'silver-spring', 'germantown',
    'boston', 'worcester', 'springfield', 'cambridge',
    'detroit', 'grand-rapids', 'warren', 'ann-arbor',
    'minneapolis', 'st-paul', 'rochester-mn', 'duluth',
    'jackson', 'gulfport', 'biloxi',
    'kansas-city-mo', 'st-louis', 'springfield-mo', 'columbia-mo',
    'billings', 'missoula', 'bozeman',
    'omaha', 'lincoln',
    'las-vegas', 'henderson', 'reno', 'north-las-vegas',
    'manchester', 'nashua',
    'newark', 'jersey-city', 'paterson', 'edison',
    'albuquerque', 'las-cruces', 'santa-fe',
    'new-york', 'buffalo', 'rochester-ny', 'syracuse', 'yonkers',
    'charlotte', 'raleigh', 'greensboro', 'durham', 'winston-salem',
    'fargo', 'bismarck',
    'columbus-oh', 'cleveland', 'cincinnati', 'toledo', 'akron',
    'oklahoma-city', 'tulsa', 'norman',
    'portland-or', 'eugene', 'salem', 'gresham',
    'philadelphia', 'pittsburgh', 'allentown', 'erie',
    'providence', 'warwick',
    'charleston', 'columbia-sc', 'greenville', 'myrtle-beach',
    'sioux-falls', 'rapid-city',
    'nashville', 'memphis', 'knoxville', 'chattanooga', 'clarksville',
    'houston', 'san-antonio', 'dallas', 'austin', 'fort-worth', 'el-paso', 'arlington',
    'salt-lake-city', 'provo', 'west-valley-city',
    'burlington',
    'virginia-beach', 'norfolk', 'chesapeake', 'richmond', 'newport-news',
    'seattle', 'spokane', 'tacoma', 'bellevue', 'vancouver-wa',
    'charleston-wv', 'huntington',
    'milwaukee', 'madison', 'green-bay', 'kenosha',
    'cheyenne', 'casper',
  ]

  // All car models
  const models = [
    'toyota-tacoma', 'toyota-tundra', 'toyota-4runner', 'toyota-camry', 'toyota-prius', 'toyota-rav4', 'toyota-sienna', 'toyota-sequoia',
    'honda-civic', 'honda-accord', 'honda-cr-v', 'honda-pilot', 'honda-passport', 'honda-odyssey', 'honda-ridgeline',
    'ford-f150', 'ford-explorer', 'ford-expedition', 'ford-fusion', 'ford-raptor',
    'chevy-silverado', 'chevy-equinox', 'chevy-tahoe', 'chevy-suburban', 'chevy-colorado', 'chevy-malibu', 'chevy-camaro',
    'jeep-wrangler', 'jeep-grand-cherokee', 'jeep-cherokee', 'jeep-gladiator', 'jeep-renegade',
    'bmw-x3', 'bmw-x5', 'bmw-3-series', 'bmw-m4',
    'mercedes-g-wagon',
    'lexus-rx350',
    'mazda-cx5', 'mazda-miata',
    'nissan-pathfinder', 'nissan-altima',
    'dodge-durango', 'dodge-charger', 'dodge-challenger',
    'ram-1500',
    'subaru-outback', 'subaru-forester', 'subaru-wrx',
    'kia-telluride', 'kia-stinger', 'kia-carnival',
    'hyundai-sonata', 'hyundai-tucson', 'hyundai-santa-fe',
    'audi-q5', 'audi-a4',
    'volkswagen-tiguan', 'volkswagen-atlas',
    'gmc-acadia', 'gmc-sierra',
    'buick-enclave',
  ]

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // Blog pages
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/how-to-finance-used-car-2025`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/new-vs-used-cars-first-time-buyers`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/best-used-cars-under-20k`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // Guide pages
    {
      url: `${baseUrl}/guides/how-to-buy-used-car`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/car-financing-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/pre-purchase-inspection`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Generate location pages
  const locationPages = locations.map((location) => ({
    url: `${baseUrl}/locations/${location}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Generate model pages
  const modelPages = models.map((model) => ({
    url: `${baseUrl}/models/${model}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...locationPages, ...modelPages]
}
