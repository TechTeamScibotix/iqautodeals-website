import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import zipcodes from 'zipcodes';
import Footer from '../../components/Footer';

// Force static generation for SEO
export const dynamic = 'force-static';

// Location data for all 50 states + major cities
const locations = {
  // Alabama
  'birmingham': { city: 'Birmingham', state: 'Alabama', stateCode: 'AL', lat: 33.5186, lng: -86.8104 },
  'montgomery': { city: 'Montgomery', state: 'Alabama', stateCode: 'AL', lat: 32.3668, lng: -86.3000 },
  'mobile': { city: 'Mobile', state: 'Alabama', stateCode: 'AL', lat: 30.6954, lng: -88.0399 },
  'huntsville': { city: 'Huntsville', state: 'Alabama', stateCode: 'AL', lat: 34.7304, lng: -86.5861 },

  // Alaska
  'anchorage': { city: 'Anchorage', state: 'Alaska', stateCode: 'AK', lat: 61.2181, lng: -149.9003 },
  'fairbanks': { city: 'Fairbanks', state: 'Alaska', stateCode: 'AK', lat: 64.8378, lng: -147.7164 },
  'juneau': { city: 'Juneau', state: 'Alaska', stateCode: 'AK', lat: 58.3019, lng: -134.4197 },

  // Arizona
  'phoenix': { city: 'Phoenix', state: 'Arizona', stateCode: 'AZ', lat: 33.4484, lng: -112.0740 },
  'tucson': { city: 'Tucson', state: 'Arizona', stateCode: 'AZ', lat: 31.9686, lng: -110.9428 },
  'mesa': { city: 'Mesa', state: 'Arizona', stateCode: 'AZ', lat: 33.4152, lng: -111.8315 },
  'scottsdale': { city: 'Scottsdale', state: 'Arizona', stateCode: 'AZ', lat: 33.4942, lng: -111.9261 },
  'chandler': { city: 'Chandler', state: 'Arizona', stateCode: 'AZ', lat: 33.3062, lng: -111.8413 },

  // Arkansas
  'little-rock': { city: 'Little Rock', state: 'Arkansas', stateCode: 'AR', lat: 34.7465, lng: -92.2896 },
  'fort-smith': { city: 'Fort Smith', state: 'Arkansas', stateCode: 'AR', lat: 35.3859, lng: -94.3985 },
  'fayetteville': { city: 'Fayetteville', state: 'Arkansas', stateCode: 'AR', lat: 36.0626, lng: -94.1574 },

  // California
  'los-angeles': { city: 'Los Angeles', state: 'California', stateCode: 'CA', lat: 34.0522, lng: -118.2437 },
  'san-diego': { city: 'San Diego', state: 'California', stateCode: 'CA', lat: 32.7157, lng: -117.1611 },
  'san-jose': { city: 'San Jose', state: 'California', stateCode: 'CA', lat: 37.3382, lng: -121.8863 },
  'san-francisco': { city: 'San Francisco', state: 'California', stateCode: 'CA', lat: 37.7749, lng: -122.4194 },
  'fresno': { city: 'Fresno', state: 'California', stateCode: 'CA', lat: 36.7378, lng: -119.7871 },
  'sacramento': { city: 'Sacramento', state: 'California', stateCode: 'CA', lat: 38.5816, lng: -121.4944 },

  // Colorado
  'denver': { city: 'Denver', state: 'Colorado', stateCode: 'CO', lat: 39.7392, lng: -104.9903 },
  'colorado-springs': { city: 'Colorado Springs', state: 'Colorado', stateCode: 'CO', lat: 38.8339, lng: -104.8214 },
  'aurora-co': { city: 'Aurora', state: 'Colorado', stateCode: 'CO', lat: 39.7294, lng: -104.8319 },
  'fort-collins': { city: 'Fort Collins', state: 'Colorado', stateCode: 'CO', lat: 40.5853, lng: -105.0844 },

  // Connecticut
  'hartford': { city: 'Hartford', state: 'Connecticut', stateCode: 'CT', lat: 41.7658, lng: -72.6734 },
  'bridgeport': { city: 'Bridgeport', state: 'Connecticut', stateCode: 'CT', lat: 41.1865, lng: -73.1952 },
  'new-haven': { city: 'New Haven', state: 'Connecticut', stateCode: 'CT', lat: 41.3083, lng: -72.9279 },
  'stamford': { city: 'Stamford', state: 'Connecticut', stateCode: 'CT', lat: 41.0534, lng: -73.5387 },

  // Delaware
  'wilmington': { city: 'Wilmington', state: 'Delaware', stateCode: 'DE', lat: 39.7391, lng: -75.5398 },
  'dover': { city: 'Dover', state: 'Delaware', stateCode: 'DE', lat: 39.1582, lng: -75.5244 },

  // Florida
  'jacksonville': { city: 'Jacksonville', state: 'Florida', stateCode: 'FL', lat: 30.3322, lng: -81.6557 },
  'miami': { city: 'Miami', state: 'Florida', stateCode: 'FL', lat: 25.7617, lng: -80.1918 },
  'tampa': { city: 'Tampa', state: 'Florida', stateCode: 'FL', lat: 27.9506, lng: -82.4572 },
  'orlando': { city: 'Orlando', state: 'Florida', stateCode: 'FL', lat: 28.5383, lng: -81.3792 },
  'st-petersburg': { city: 'St Petersburg', state: 'Florida', stateCode: 'FL', lat: 27.7676, lng: -82.6403 },
  'fort-lauderdale': { city: 'Fort Lauderdale', state: 'Florida', stateCode: 'FL', lat: 26.1224, lng: -80.1373 },

  // Georgia
  'atlanta': { city: 'Atlanta', state: 'Georgia', stateCode: 'GA', lat: 33.7490, lng: -84.3880 },
  'augusta': { city: 'Augusta', state: 'Georgia', stateCode: 'GA', lat: 33.4735, lng: -82.0105 },
  'columbus': { city: 'Columbus', state: 'Georgia', stateCode: 'GA', lat: 32.4609, lng: -84.9877 },
  'savannah': { city: 'Savannah', state: 'Georgia', stateCode: 'GA', lat: 32.0809, lng: -81.0912 },
  'macon': { city: 'Macon', state: 'Georgia', stateCode: 'GA', lat: 32.8407, lng: -83.6324 },

  // Hawaii
  'honolulu': { city: 'Honolulu', state: 'Hawaii', stateCode: 'HI', lat: 21.3099, lng: -157.8581 },

  // Idaho
  'boise': { city: 'Boise', state: 'Idaho', stateCode: 'ID', lat: 43.6150, lng: -116.2023 },
  'meridian': { city: 'Meridian', state: 'Idaho', stateCode: 'ID', lat: 43.6121, lng: -116.3915 },
  'nampa': { city: 'Nampa', state: 'Idaho', stateCode: 'ID', lat: 43.5407, lng: -116.5635 },

  // Illinois
  'chicago': { city: 'Chicago', state: 'Illinois', stateCode: 'IL', lat: 41.8781, lng: -87.6298 },
  'aurora-il': { city: 'Aurora', state: 'Illinois', stateCode: 'IL', lat: 41.7606, lng: -88.3201 },
  'naperville': { city: 'Naperville', state: 'Illinois', stateCode: 'IL', lat: 41.7508, lng: -88.1535 },
  'rockford': { city: 'Rockford', state: 'Illinois', stateCode: 'IL', lat: 42.2711, lng: -89.0940 },
  'joliet': { city: 'Joliet', state: 'Illinois', stateCode: 'IL', lat: 41.5250, lng: -88.0817 },

  // Indiana
  'indianapolis': { city: 'Indianapolis', state: 'Indiana', stateCode: 'IN', lat: 39.7684, lng: -86.1581 },
  'fort-wayne': { city: 'Fort Wayne', state: 'Indiana', stateCode: 'IN', lat: 41.0793, lng: -85.1394 },
  'evansville': { city: 'Evansville', state: 'Indiana', stateCode: 'IN', lat: 37.9716, lng: -87.5711 },
  'south-bend': { city: 'South Bend', state: 'Indiana', stateCode: 'IN', lat: 41.6764, lng: -86.2520 },

  // Iowa
  'des-moines': { city: 'Des Moines', state: 'Iowa', stateCode: 'IA', lat: 41.5868, lng: -93.6250 },
  'cedar-rapids': { city: 'Cedar Rapids', state: 'Iowa', stateCode: 'IA', lat: 41.9779, lng: -91.6656 },
  'davenport': { city: 'Davenport', state: 'Iowa', stateCode: 'IA', lat: 41.5236, lng: -90.5776 },

  // Kansas
  'wichita': { city: 'Wichita', state: 'Kansas', stateCode: 'KS', lat: 37.6872, lng: -97.3301 },
  'overland-park': { city: 'Overland Park', state: 'Kansas', stateCode: 'KS', lat: 38.9822, lng: -94.6708 },
  'kansas-city-ks': { city: 'Kansas City', state: 'Kansas', stateCode: 'KS', lat: 39.1141, lng: -94.6275 },
  'topeka': { city: 'Topeka', state: 'Kansas', stateCode: 'KS', lat: 39.0558, lng: -95.6894 },

  // Kentucky
  'louisville': { city: 'Louisville', state: 'Kentucky', stateCode: 'KY', lat: 38.2527, lng: -85.7585 },
  'lexington': { city: 'Lexington', state: 'Kentucky', stateCode: 'KY', lat: 38.0406, lng: -84.5037 },
  'bowling-green': { city: 'Bowling Green', state: 'Kentucky', stateCode: 'KY', lat: 36.9685, lng: -86.4808 },

  // Louisiana
  'new-orleans': { city: 'New Orleans', state: 'Louisiana', stateCode: 'LA', lat: 29.9511, lng: -90.0715 },
  'baton-rouge': { city: 'Baton Rouge', state: 'Louisiana', stateCode: 'LA', lat: 30.4583, lng: -91.1403 },
  'shreveport': { city: 'Shreveport', state: 'Louisiana', stateCode: 'LA', lat: 32.5252, lng: -93.7502 },
  'lafayette': { city: 'Lafayette', state: 'Louisiana', stateCode: 'LA', lat: 30.2241, lng: -92.0198 },

  // Maine
  'portland-me': { city: 'Portland', state: 'Maine', stateCode: 'ME', lat: 43.6591, lng: -70.2568 },
  'bangor': { city: 'Bangor', state: 'Maine', stateCode: 'ME', lat: 44.8012, lng: -68.7778 },

  // Maryland
  'baltimore': { city: 'Baltimore', state: 'Maryland', stateCode: 'MD', lat: 39.2904, lng: -76.6122 },
  'columbia-md': { city: 'Columbia', state: 'Maryland', stateCode: 'MD', lat: 39.2037, lng: -76.8610 },
  'silver-spring': { city: 'Silver Spring', state: 'Maryland', stateCode: 'MD', lat: 38.9907, lng: -77.0261 },
  'germantown': { city: 'Germantown', state: 'Maryland', stateCode: 'MD', lat: 39.1732, lng: -77.2714 },

  // Massachusetts
  'boston': { city: 'Boston', state: 'Massachusetts', stateCode: 'MA', lat: 42.3601, lng: -71.0589 },
  'worcester': { city: 'Worcester', state: 'Massachusetts', stateCode: 'MA', lat: 42.2626, lng: -71.8023 },
  'springfield': { city: 'Springfield', state: 'Massachusetts', stateCode: 'MA', lat: 42.1015, lng: -72.5898 },
  'cambridge': { city: 'Cambridge', state: 'Massachusetts', stateCode: 'MA', lat: 42.3736, lng: -71.1097 },

  // Michigan
  'detroit': { city: 'Detroit', state: 'Michigan', stateCode: 'MI', lat: 42.3314, lng: -83.0458 },
  'grand-rapids': { city: 'Grand Rapids', state: 'Michigan', stateCode: 'MI', lat: 42.9634, lng: -85.6681 },
  'warren': { city: 'Warren', state: 'Michigan', stateCode: 'MI', lat: 42.5145, lng: -83.0147 },
  'ann-arbor': { city: 'Ann Arbor', state: 'Michigan', stateCode: 'MI', lat: 42.2808, lng: -83.7430 },

  // Minnesota
  'minneapolis': { city: 'Minneapolis', state: 'Minnesota', stateCode: 'MN', lat: 44.9778, lng: -93.2650 },
  'st-paul': { city: 'St Paul', state: 'Minnesota', stateCode: 'MN', lat: 44.9537, lng: -93.0900 },
  'rochester-mn': { city: 'Rochester', state: 'Minnesota', stateCode: 'MN', lat: 44.0121, lng: -92.4802 },
  'duluth': { city: 'Duluth', state: 'Minnesota', stateCode: 'MN', lat: 46.7867, lng: -92.1005 },

  // Mississippi
  'jackson': { city: 'Jackson', state: 'Mississippi', stateCode: 'MS', lat: 32.2988, lng: -90.1848 },
  'gulfport': { city: 'Gulfport', state: 'Mississippi', stateCode: 'MS', lat: 30.3674, lng: -89.0928 },
  'biloxi': { city: 'Biloxi', state: 'Mississippi', stateCode: 'MS', lat: 30.3960, lng: -88.8853 },

  // Missouri
  'kansas-city-mo': { city: 'Kansas City', state: 'Missouri', stateCode: 'MO', lat: 39.0997, lng: -94.5786 },
  'st-louis': { city: 'St Louis', state: 'Missouri', stateCode: 'MO', lat: 38.6270, lng: -90.1994 },
  'springfield-mo': { city: 'Springfield', state: 'Missouri', stateCode: 'MO', lat: 37.2090, lng: -93.2923 },
  'columbia-mo': { city: 'Columbia', state: 'Missouri', stateCode: 'MO', lat: 38.9517, lng: -92.3341 },

  // Montana
  'billings': { city: 'Billings', state: 'Montana', stateCode: 'MT', lat: 45.7833, lng: -108.5007 },
  'missoula': { city: 'Missoula', state: 'Montana', stateCode: 'MT', lat: 46.8721, lng: -113.9940 },
  'bozeman': { city: 'Bozeman', state: 'Montana', stateCode: 'MT', lat: 45.6770, lng: -111.0429 },

  // Nebraska
  'omaha': { city: 'Omaha', state: 'Nebraska', stateCode: 'NE', lat: 41.2565, lng: -95.9345 },
  'lincoln': { city: 'Lincoln', state: 'Nebraska', stateCode: 'NE', lat: 41.2565, lng: -96.6666 },

  // Nevada
  'las-vegas': { city: 'Las Vegas', state: 'Nevada', stateCode: 'NV', lat: 36.1699, lng: -115.1398 },
  'henderson': { city: 'Henderson', state: 'Nevada', stateCode: 'NV', lat: 36.0395, lng: -114.9817 },
  'reno': { city: 'Reno', state: 'Nevada', stateCode: 'NV', lat: 39.5296, lng: -119.8138 },
  'north-las-vegas': { city: 'North Las Vegas', state: 'Nevada', stateCode: 'NV', lat: 36.1989, lng: -115.1175 },

  // New Hampshire
  'manchester': { city: 'Manchester', state: 'New Hampshire', stateCode: 'NH', lat: 42.9956, lng: -71.4548 },
  'nashua': { city: 'Nashua', state: 'New Hampshire', stateCode: 'NH', lat: 42.7654, lng: -71.4676 },

  // New Jersey
  'newark': { city: 'Newark', state: 'New Jersey', stateCode: 'NJ', lat: 40.7357, lng: -74.1724 },
  'jersey-city': { city: 'Jersey City', state: 'New Jersey', stateCode: 'NJ', lat: 40.7178, lng: -74.0431 },
  'paterson': { city: 'Paterson', state: 'New Jersey', stateCode: 'NJ', lat: 40.9168, lng: -74.1718 },
  'edison': { city: 'Edison', state: 'New Jersey', stateCode: 'NJ', lat: 40.5187, lng: -74.4121 },

  // New Mexico
  'albuquerque': { city: 'Albuquerque', state: 'New Mexico', stateCode: 'NM', lat: 35.0844, lng: -106.6504 },
  'las-cruces': { city: 'Las Cruces', state: 'New Mexico', stateCode: 'NM', lat: 32.3199, lng: -106.7637 },
  'santa-fe': { city: 'Santa Fe', state: 'New Mexico', stateCode: 'NM', lat: 35.6870, lng: -105.9378 },

  // New York
  'new-york': { city: 'New York', state: 'New York', stateCode: 'NY', lat: 40.7128, lng: -74.0060 },
  'buffalo': { city: 'Buffalo', state: 'New York', stateCode: 'NY', lat: 42.8864, lng: -78.8784 },
  'rochester-ny': { city: 'Rochester', state: 'New York', stateCode: 'NY', lat: 43.1566, lng: -77.6088 },
  'syracuse': { city: 'Syracuse', state: 'New York', stateCode: 'NY', lat: 43.0481, lng: -76.1474 },
  'yonkers': { city: 'Yonkers', state: 'New York', stateCode: 'NY', lat: 40.9312, lng: -73.8987 },

  // North Carolina
  'charlotte': { city: 'Charlotte', state: 'North Carolina', stateCode: 'NC', lat: 35.2271, lng: -80.8431 },
  'raleigh': { city: 'Raleigh', state: 'North Carolina', stateCode: 'NC', lat: 35.7796, lng: -78.6382 },
  'greensboro': { city: 'Greensboro', state: 'North Carolina', stateCode: 'NC', lat: 36.0726, lng: -79.7920 },
  'durham': { city: 'Durham', state: 'North Carolina', stateCode: 'NC', lat: 35.9940, lng: -78.8986 },
  'winston-salem': { city: 'Winston-Salem', state: 'North Carolina', stateCode: 'NC', lat: 36.0999, lng: -80.2442 },

  // North Dakota
  'fargo': { city: 'Fargo', state: 'North Dakota', stateCode: 'ND', lat: 46.8772, lng: -96.7898 },
  'bismarck': { city: 'Bismarck', state: 'North Dakota', stateCode: 'ND', lat: 46.8083, lng: -100.7837 },

  // Ohio
  'columbus-oh': { city: 'Columbus', state: 'Ohio', stateCode: 'OH', lat: 39.9612, lng: -82.9988 },
  'cleveland': { city: 'Cleveland', state: 'Ohio', stateCode: 'OH', lat: 41.4993, lng: -81.6944 },
  'cincinnati': { city: 'Cincinnati', state: 'Ohio', stateCode: 'OH', lat: 39.1031, lng: -84.5120 },
  'toledo': { city: 'Toledo', state: 'Ohio', stateCode: 'OH', lat: 41.6528, lng: -83.5379 },
  'akron': { city: 'Akron', state: 'Ohio', stateCode: 'OH', lat: 41.0814, lng: -81.5190 },

  // Oklahoma
  'oklahoma-city': { city: 'Oklahoma City', state: 'Oklahoma', stateCode: 'OK', lat: 35.4676, lng: -97.5164 },
  'tulsa': { city: 'Tulsa', state: 'Oklahoma', stateCode: 'OK', lat: 36.1540, lng: -95.9928 },
  'norman': { city: 'Norman', state: 'Oklahoma', stateCode: 'OK', lat: 35.2226, lng: -97.4395 },

  // Oregon
  'portland-or': { city: 'Portland', state: 'Oregon', stateCode: 'OR', lat: 45.5152, lng: -122.6784 },
  'eugene': { city: 'Eugene', state: 'Oregon', stateCode: 'OR', lat: 44.0521, lng: -123.0868 },
  'salem': { city: 'Salem', state: 'Oregon', stateCode: 'OR', lat: 44.9429, lng: -123.0351 },
  'gresham': { city: 'Gresham', state: 'Oregon', stateCode: 'OR', lat: 45.5023, lng: -122.4312 },

  // Pennsylvania
  'philadelphia': { city: 'Philadelphia', state: 'Pennsylvania', stateCode: 'PA', lat: 39.9526, lng: -75.1652 },
  'pittsburgh': { city: 'Pittsburgh', state: 'Pennsylvania', stateCode: 'PA', lat: 40.4406, lng: -79.9959 },
  'allentown': { city: 'Allentown', state: 'Pennsylvania', stateCode: 'PA', lat: 40.6023, lng: -75.4714 },
  'erie': { city: 'Erie', state: 'Pennsylvania', stateCode: 'PA', lat: 42.1292, lng: -80.0851 },

  // Rhode Island
  'providence': { city: 'Providence', state: 'Rhode Island', stateCode: 'RI', lat: 41.8240, lng: -71.4128 },
  'warwick': { city: 'Warwick', state: 'Rhode Island', stateCode: 'RI', lat: 41.7001, lng: -71.4162 },

  // South Carolina
  'charleston': { city: 'Charleston', state: 'South Carolina', stateCode: 'SC', lat: 32.7765, lng: -79.9311 },
  'columbia-sc': { city: 'Columbia', state: 'South Carolina', stateCode: 'SC', lat: 34.0007, lng: -81.0348 },
  'greenville': { city: 'Greenville', state: 'South Carolina', stateCode: 'SC', lat: 34.8526, lng: -82.3940 },
  'myrtle-beach': { city: 'Myrtle Beach', state: 'South Carolina', stateCode: 'SC', lat: 33.6891, lng: -78.8867 },

  // South Dakota
  'sioux-falls': { city: 'Sioux Falls', state: 'South Dakota', stateCode: 'SD', lat: 43.5446, lng: -96.7311 },
  'rapid-city': { city: 'Rapid City', state: 'South Dakota', stateCode: 'SD', lat: 44.0805, lng: -103.2310 },

  // Tennessee
  'nashville': { city: 'Nashville', state: 'Tennessee', stateCode: 'TN', lat: 36.1627, lng: -86.7816 },
  'memphis': { city: 'Memphis', state: 'Tennessee', stateCode: 'TN', lat: 35.1495, lng: -90.0490 },
  'knoxville': { city: 'Knoxville', state: 'Tennessee', stateCode: 'TN', lat: 35.9606, lng: -83.9207 },
  'chattanooga': { city: 'Chattanooga', state: 'Tennessee', stateCode: 'TN', lat: 35.0456, lng: -85.3097 },
  'clarksville': { city: 'Clarksville', state: 'Tennessee', stateCode: 'TN', lat: 36.5298, lng: -87.3595 },

  // Texas
  'houston': { city: 'Houston', state: 'Texas', stateCode: 'TX', lat: 29.7604, lng: -95.3698 },
  'san-antonio': { city: 'San Antonio', state: 'Texas', stateCode: 'TX', lat: 29.4241, lng: -98.4936 },
  'dallas': { city: 'Dallas', state: 'Texas', stateCode: 'TX', lat: 32.7767, lng: -96.7970 },
  'austin': { city: 'Austin', state: 'Texas', stateCode: 'TX', lat: 30.2672, lng: -97.7431 },
  'fort-worth': { city: 'Fort Worth', state: 'Texas', stateCode: 'TX', lat: 32.7555, lng: -97.3308 },
  'el-paso': { city: 'El Paso', state: 'Texas', stateCode: 'TX', lat: 31.7619, lng: -106.4850 },
  'arlington': { city: 'Arlington', state: 'Texas', stateCode: 'TX', lat: 32.7357, lng: -97.1081 },

  // Utah
  'salt-lake-city': { city: 'Salt Lake City', state: 'Utah', stateCode: 'UT', lat: 40.7608, lng: -111.8910 },
  'provo': { city: 'Provo', state: 'Utah', stateCode: 'UT', lat: 40.2338, lng: -111.6585 },
  'west-valley-city': { city: 'West Valley City', state: 'Utah', stateCode: 'UT', lat: 40.6916, lng: -112.0011 },

  // Vermont
  'burlington': { city: 'Burlington', state: 'Vermont', stateCode: 'VT', lat: 44.4759, lng: -73.2121 },

  // Virginia
  'virginia-beach': { city: 'Virginia Beach', state: 'Virginia', stateCode: 'VA', lat: 36.8529, lng: -75.9780 },
  'norfolk': { city: 'Norfolk', state: 'Virginia', stateCode: 'VA', lat: 36.8508, lng: -76.2859 },
  'chesapeake': { city: 'Chesapeake', state: 'Virginia', stateCode: 'VA', lat: 36.7682, lng: -76.2875 },
  'richmond': { city: 'Richmond', state: 'Virginia', stateCode: 'VA', lat: 37.5407, lng: -77.4360 },
  'newport-news': { city: 'Newport News', state: 'Virginia', stateCode: 'VA', lat: 37.0871, lng: -76.4730 },

  // Washington
  'seattle': { city: 'Seattle', state: 'Washington', stateCode: 'WA', lat: 47.6062, lng: -122.3321 },
  'spokane': { city: 'Spokane', state: 'Washington', stateCode: 'WA', lat: 47.6588, lng: -117.4260 },
  'tacoma': { city: 'Tacoma', state: 'Washington', stateCode: 'WA', lat: 47.2529, lng: -122.4443 },
  'bellevue': { city: 'Bellevue', state: 'Washington', stateCode: 'WA', lat: 47.6101, lng: -122.2015 },
  'vancouver-wa': { city: 'Vancouver', state: 'Washington', stateCode: 'WA', lat: 45.6387, lng: -122.6615 },

  // West Virginia
  'charleston-wv': { city: 'Charleston', state: 'West Virginia', stateCode: 'WV', lat: 38.3498, lng: -81.6326 },
  'huntington': { city: 'Huntington', state: 'West Virginia', stateCode: 'WV', lat: 38.4192, lng: -82.4452 },

  // Wisconsin
  'milwaukee': { city: 'Milwaukee', state: 'Wisconsin', stateCode: 'WI', lat: 43.0389, lng: -87.9065 },
  'madison': { city: 'Madison', state: 'Wisconsin', stateCode: 'WI', lat: 43.0731, lng: -89.4012 },
  'green-bay': { city: 'Green Bay', state: 'Wisconsin', stateCode: 'WI', lat: 44.5133, lng: -88.0133 },
  'kenosha': { city: 'Kenosha', state: 'Wisconsin', stateCode: 'WI', lat: 42.5847, lng: -87.8212 },

  // Wyoming
  'cheyenne': { city: 'Cheyenne', state: 'Wyoming', stateCode: 'WY', lat: 41.1400, lng: -104.8202 },
  'casper': { city: 'Casper', state: 'Wyoming', stateCode: 'WY', lat: 42.8501, lng: -106.3252 },
};

export async function generateStaticParams() {
  return Object.keys(locations).map((location) => ({
    location,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params;
  const locationData = locations[location as keyof typeof locations];

  if (!locationData) {
    return {
      title: 'Location Not Found',
    };
  }

  const { city, state, stateCode } = locationData;

  return {
    title: `Used Cars in ${city}, ${stateCode} - Save Thousands`,
    description: `Browse quality used cars for sale in ${city}, ${state}. Compare dealer prices instantly. Save hundreds. No haggling required. Browse SUVs, trucks, sedans & certified pre-owned vehicles now.`,
    keywords: [
      `used cars ${city}`,
      `used cars for sale ${city}`,
      `car dealers ${city}`,
      `used cars ${city} ${stateCode}`,
      `buy used cars ${city}`,
      `certified pre-owned ${city}`,
      `used SUVs ${city}`,
      `used trucks ${city}`,
      `used sedans ${city}`,
      `car dealerships ${city}`,
      `best used car deals ${city}`,
      `affordable cars ${city}`,
    ],
    openGraph: {
      title: `Used Cars in ${city}, ${stateCode}`,
      description: `Shop quality used cars in ${city}. Compare prices from local dealers and save hundreds.`,
      url: `https://iqautodeals.com/locations/${location}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/locations/${location}`,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const locationData = locations[location as keyof typeof locations];

  if (!locationData) {
    notFound();
  }

  const { city, state, stateCode } = locationData;
  const zip = zipcodes.lookupByName(city, state)?.[0]?.zip;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Used Cars for Sale in {city}, {stateCode}
          </h1>
          <p className="text-xl mb-8">
            Shop Quality Pre-Owned Vehicles from Trusted Dealers in {city}, {state}
          </p>
          <Link
            href={zip ? `/cars?zipCode=${zip}` : '/cars'}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Cars in {city}
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Buy a Used Car in {city}?</h2>
            <p className="text-gray-700 mb-4">
              IQ Auto Deals makes it easy to find quality used cars for sale in {city}, {state}.
              Our platform connects you with trusted local dealers who compete to offer you the best price.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you're looking for a reliable sedan, a spacious SUV, or a powerful truck,
              you'll find exactly what you need from dealers right here in {city}.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Compare prices from multiple dealers in {city}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Get instant offers on certified pre-owned vehicles</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Save hundreds on your next vehicle</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Transparent pricing from trusted local dealers</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Select Your Cars</h3>
                  <p className="text-gray-700">Browse quality used cars from dealers in {city} and add to your deal list.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Dealers Compete</h3>
                  <p className="text-gray-700">Local {city} dealers bid on your selected vehicles to win your business.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">You Save Money</h3>
                  <p className="text-gray-700">Choose the best offer and save thousands on your next vehicle purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Vehicle Types */}
        <div className="mb-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
          <h2 className="text-3xl font-bold mb-8">Popular Used Vehicles in {city}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Used SUVs in {city}</h3>
              <p className="text-gray-700 mb-4">
                Find spacious and reliable SUVs perfect for {city} roads and {state} adventures.
              </p>
              <Link href={zip ? `/cars?zipCode=${zip}&bodyType=SUV` : '/cars?bodyType=SUV'} className="text-blue-600 font-semibold hover:underline">
                Browse SUVs →
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Used Sedans in {city}</h3>
              <p className="text-gray-700 mb-4">
                Discover fuel-efficient and comfortable sedans from top brands available in {city}.
              </p>
              <Link href={zip ? `/cars?zipCode=${zip}&bodyType=Sedan` : '/cars?bodyType=Sedan'} className="text-blue-600 font-semibold hover:underline">
                Browse Sedans →
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Used Trucks in {city}</h3>
              <p className="text-gray-700 mb-4">
                Powerful trucks for work or play, available from trusted dealers in {city}, {stateCode}.
              </p>
              <Link href={zip ? `/cars?zipCode=${zip}&bodyType=Truck` : '/cars?bodyType=Truck'} className="text-blue-600 font-semibold hover:underline">
                Browse Trucks →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-lg p-8 text-center" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car in {city}?</h2>
          <p className="text-xl text-gray-700 mb-6">
            Browse quality used cars from trusted dealers in {city}, {state}.
          </p>
          <Link
            href={zip ? `/cars?zipCode=${zip}` : '/cars'}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Inventory
          </Link>
        </div>
      </section>

      {/* Browse Popular Models Section */}
      <section className="bg-gray-50 py-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Used Cars in {city}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/models/toyota-tacoma" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota Tacoma</span>
            </Link>
            <Link href="/models/toyota-4runner" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota 4Runner</span>
            </Link>
            <Link href="/models/honda-civic" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda Civic</span>
            </Link>
            <Link href="/models/honda-cr-v" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda CR-V</span>
            </Link>
            <Link href="/models/ford-f150" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Ford F-150</span>
            </Link>
            <Link href="/models/chevy-silverado" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Chevy Silverado</span>
            </Link>
            <Link href="/models/jeep-wrangler" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jeep Wrangler</span>
            </Link>
            <Link href="/models/jeep-grand-cherokee" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jeep Grand Cherokee</span>
            </Link>
            <Link href="/models/toyota-rav4" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Toyota RAV4</span>
            </Link>
            <Link href="/models/honda-pilot" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Honda Pilot</span>
            </Link>
            <Link href="/models/bmw-x5" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">BMW X5</span>
            </Link>
            <Link href="/models/lexus-rx350" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Lexus RX 350</span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/models" className="text-blue-600 font-semibold hover:underline">
              View All Models →
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Cities Section */}
      <section className="py-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Used Cars in Other {state} Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(locations)
              .filter(([slug, data]) => data.state === state && slug !== location)
              .slice(0, 12)
              .map(([slug, data]) => (
                <Link
                  key={slug}
                  href={`/locations/${slug}`}
                  className="bg-gray-50 p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center"
                >
                  <span className="font-semibold text-gray-900">{data.city}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Browse Other Major Cities */}
      <section className="bg-gray-50 py-16" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse Used Cars in Major Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/locations/atlanta" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Atlanta</span>
            </Link>
            <Link href="/locations/los-angeles" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Los Angeles</span>
            </Link>
            <Link href="/locations/chicago" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Chicago</span>
            </Link>
            <Link href="/locations/houston" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Houston</span>
            </Link>
            <Link href="/locations/phoenix" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Phoenix</span>
            </Link>
            <Link href="/locations/philadelphia" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Philadelphia</span>
            </Link>
            <Link href="/locations/san-antonio" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Antonio</span>
            </Link>
            <Link href="/locations/san-diego" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Diego</span>
            </Link>
            <Link href="/locations/dallas" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Dallas</span>
            </Link>
            <Link href="/locations/san-jose" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">San Jose</span>
            </Link>
            <Link href="/locations/austin" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Austin</span>
            </Link>
            <Link href="/locations/jacksonville" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center">
              <span className="font-semibold text-gray-900">Jacksonville</span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Link href="/locations" className="text-blue-600 font-semibold hover:underline">
              View All Locations →
            </Link>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `https://iqautodeals.com/locations/${location}`,
            name: `IQ Auto Deals - ${city}, ${stateCode}`,
            description: `Used car marketplace connecting buyers with dealers in ${city}, ${state}`,
            serviceType: 'Online Automotive Marketplace',
            address: {
              '@type': 'PostalAddress',
              addressLocality: city,
              addressRegion: stateCode,
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: locationData.lat,
              longitude: locationData.lng,
            },
            url: `https://iqautodeals.com/locations/${location}`,
            areaServed: {
              '@type': 'City',
              name: city,
              containedIn: {
                '@type': 'State',
                name: state,
              },
            },
          }),
        }}
      />

      <Footer />
    </div>
  );
}
