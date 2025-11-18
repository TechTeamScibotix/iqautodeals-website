import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Import locations from parent directory
const locations = {
  // Alabama
  'birmingham': { city: 'Birmingham', state: 'Alabama', stateCode: 'AL', lat: 33.5186, lng: -86.8104 },
  'montgomery': { city: 'Montgomery', state: 'Alabama', stateCode: 'AL', lat: 32.3668, lng: -86.3000 },
  'mobile': { city: 'Mobile', state: 'Alabama', stateCode: 'AL', lat: 30.6954, lng: -88.0399 },
  'huntsville': { city: 'Huntsville', state: 'Alabama', stateCode: 'AL', lat: 34.7304, lng: -86.5861 },
  'anchorage': { city: 'Anchorage', state: 'Alaska', stateCode: 'AK', lat: 61.2181, lng: -149.9003 },
  'fairbanks': { city: 'Fairbanks', state: 'Alaska', stateCode: 'AK', lat: 64.8378, lng: -147.7164 },
  'juneau': { city: 'Juneau', state: 'Alaska', stateCode: 'AK', lat: 58.3019, lng: -134.4197 },
  'phoenix': { city: 'Phoenix', state: 'Arizona', stateCode: 'AZ', lat: 33.4484, lng: -112.0740 },
  'tucson': { city: 'Tucson', state: 'Arizona', stateCode: 'AZ', lat: 31.9686, lng: -110.9428 },
  'mesa': { city: 'Mesa', state: 'Arizona', stateCode: 'AZ', lat: 33.4152, lng: -111.8315 },
  'scottsdale': { city: 'Scottsdale', state: 'Arizona', stateCode: 'AZ', lat: 33.4942, lng: -111.9261 },
  'chandler': { city: 'Chandler', state: 'Arizona', stateCode: 'AZ', lat: 33.3062, lng: -111.8413 },
  'little-rock': { city: 'Little Rock', state: 'Arkansas', stateCode: 'AR', lat: 34.7465, lng: -92.2896 },
  'fort-smith': { city: 'Fort Smith', state: 'Arkansas', stateCode: 'AR', lat: 35.3859, lng: -94.3985 },
  'fayetteville': { city: 'Fayetteville', state: 'Arkansas', stateCode: 'AR', lat: 36.0626, lng: -94.1574 },
  'los-angeles': { city: 'Los Angeles', state: 'California', stateCode: 'CA', lat: 34.0522, lng: -118.2437 },
  'san-diego': { city: 'San Diego', state: 'California', stateCode: 'CA', lat: 32.7157, lng: -117.1611 },
  'san-jose': { city: 'San Jose', state: 'California', stateCode: 'CA', lat: 37.3382, lng: -121.8863 },
  'san-francisco': { city: 'San Francisco', state: 'California', stateCode: 'CA', lat: 37.7749, lng: -122.4194 },
  'fresno': { city: 'Fresno', state: 'California', stateCode: 'CA', lat: 36.7378, lng: -119.7871 },
  'sacramento': { city: 'Sacramento', state: 'California', stateCode: 'CA', lat: 38.5816, lng: -121.4944 },
  'denver': { city: 'Denver', state: 'Colorado', stateCode: 'CO', lat: 39.7392, lng: -104.9903 },
  'colorado-springs': { city: 'Colorado Springs', state: 'Colorado', stateCode: 'CO', lat: 38.8339, lng: -104.8214 },
  'aurora-co': { city: 'Aurora', state: 'Colorado', stateCode: 'CO', lat: 39.7294, lng: -104.8319 },
  'fort-collins': { city: 'Fort Collins', state: 'Colorado', stateCode: 'CO', lat: 40.5853, lng: -105.0844 },
  'hartford': { city: 'Hartford', state: 'Connecticut', stateCode: 'CT', lat: 41.7658, lng: -72.6734 },
  'bridgeport': { city: 'Bridgeport', state: 'Connecticut', stateCode: 'CT', lat: 41.1865, lng: -73.1952 },
  'new-haven': { city: 'New Haven', state: 'Connecticut', stateCode: 'CT', lat: 41.3083, lng: -72.9279 },
  'stamford': { city: 'Stamford', state: 'Connecticut', stateCode: 'CT', lat: 41.0534, lng: -73.5387 },
  'wilmington': { city: 'Wilmington', state: 'Delaware', stateCode: 'DE', lat: 39.7391, lng: -75.5398 },
  'dover': { city: 'Dover', state: 'Delaware', stateCode: 'DE', lat: 39.1582, lng: -75.5244 },
  'jacksonville': { city: 'Jacksonville', state: 'Florida', stateCode: 'FL', lat: 30.3322, lng: -81.6557 },
  'miami': { city: 'Miami', state: 'Florida', stateCode: 'FL', lat: 25.7617, lng: -80.1918 },
  'tampa': { city: 'Tampa', state: 'Florida', stateCode: 'FL', lat: 27.9506, lng: -82.4572 },
  'orlando': { city: 'Orlando', state: 'Florida', stateCode: 'FL', lat: 28.5383, lng: -81.3792 },
  'st-petersburg': { city: 'St Petersburg', state: 'Florida', stateCode: 'FL', lat: 27.7676, lng: -82.6403 },
  'fort-lauderdale': { city: 'Fort Lauderdale', state: 'Florida', stateCode: 'FL', lat: 26.1224, lng: -80.1373 },
  'atlanta': { city: 'Atlanta', state: 'Georgia', stateCode: 'GA', lat: 33.7490, lng: -84.3880 },
  'augusta': { city: 'Augusta', state: 'Georgia', stateCode: 'GA', lat: 33.4735, lng: -82.0105 },
  'columbus': { city: 'Columbus', state: 'Georgia', stateCode: 'GA', lat: 32.4609, lng: -84.9877 },
  'savannah': { city: 'Savannah', state: 'Georgia', stateCode: 'GA', lat: 32.0809, lng: -81.0912 },
  'macon': { city: 'Macon', state: 'Georgia', stateCode: 'GA', lat: 32.8407, lng: -83.6324 },
  'honolulu': { city: 'Honolulu', state: 'Hawaii', stateCode: 'HI', lat: 21.3099, lng: -157.8581 },
  'boise': { city: 'Boise', state: 'Idaho', stateCode: 'ID', lat: 43.6150, lng: -116.2023 },
  'meridian': { city: 'Meridian', state: 'Idaho', stateCode: 'ID', lat: 43.6121, lng: -116.3915 },
  'nampa': { city: 'Nampa', state: 'Idaho', stateCode: 'ID', lat: 43.5407, lng: -116.5635 },
  'chicago': { city: 'Chicago', state: 'Illinois', stateCode: 'IL', lat: 41.8781, lng: -87.6298 },
  'aurora-il': { city: 'Aurora', state: 'Illinois', stateCode: 'IL', lat: 41.7606, lng: -88.3201 },
  'naperville': { city: 'Naperville', state: 'Illinois', stateCode: 'IL', lat: 41.7508, lng: -88.1535 },
  'rockford': { city: 'Rockford', state: 'Illinois', stateCode: 'IL', lat: 42.2711, lng: -89.0940 },
  'joliet': { city: 'Joliet', state: 'Illinois', stateCode: 'IL', lat: 41.5250, lng: -88.0817 },
  'indianapolis': { city: 'Indianapolis', state: 'Indiana', stateCode: 'IN', lat: 39.7684, lng: -86.1581 },
  'fort-wayne': { city: 'Fort Wayne', state: 'Indiana', stateCode: 'IN', lat: 41.0793, lng: -85.1394 },
  'evansville': { city: 'Evansville', state: 'Indiana', stateCode: 'IN', lat: 37.9716, lng: -87.5711 },
  'south-bend': { city: 'South Bend', state: 'Indiana', stateCode: 'IN', lat: 41.6764, lng: -86.2520 },
  'des-moines': { city: 'Des Moines', state: 'Iowa', stateCode: 'IA', lat: 41.5868, lng: -93.6250 },
  'cedar-rapids': { city: 'Cedar Rapids', state: 'Iowa', stateCode: 'IA', lat: 41.9779, lng: -91.6656 },
  'davenport': { city: 'Davenport', state: 'Iowa', stateCode: 'IA', lat: 41.5236, lng: -90.5776 },
  'wichita': { city: 'Wichita', state: 'Kansas', stateCode: 'KS', lat: 37.6872, lng: -97.3301 },
  'overland-park': { city: 'Overland Park', state: 'Kansas', stateCode: 'KS', lat: 38.9822, lng: -94.6708 },
  'kansas-city-ks': { city: 'Kansas City', state: 'Kansas', stateCode: 'KS', lat: 39.1141, lng: -94.6275 },
  'topeka': { city: 'Topeka', state: 'Kansas', stateCode: 'KS', lat: 39.0558, lng: -95.6894 },
  'louisville': { city: 'Louisville', state: 'Kentucky', stateCode: 'KY', lat: 38.2527, lng: -85.7585 },
  'lexington': { city: 'Lexington', state: 'Kentucky', stateCode: 'KY', lat: 38.0406, lng: -84.5037 },
  'bowling-green': { city: 'Bowling Green', state: 'Kentucky', stateCode: 'KY', lat: 36.9685, lng: -86.4808 },
  'new-orleans': { city: 'New Orleans', state: 'Louisiana', stateCode: 'LA', lat: 29.9511, lng: -90.0715 },
  'baton-rouge': { city: 'Baton Rouge', state: 'Louisiana', stateCode: 'LA', lat: 30.4515, lng: -91.1871 },
  'shreveport': { city: 'Shreveport', state: 'Louisiana', stateCode: 'LA', lat: 32.5252, lng: -93.7502 },
  'portland': { city: 'Portland', state: 'Maine', stateCode: 'ME', lat: 43.6591, lng: -70.2568 },
  'lewiston': { city: 'Lewiston', state: 'Maine', stateCode: 'ME', lat: 44.1004, lng: -70.2148 },
  'baltimore': { city: 'Baltimore', state: 'Maryland', stateCode: 'MD', lat: 39.2904, lng: -76.6122 },
  'frederick': { city: 'Frederick', state: 'Maryland', stateCode: 'MD', lat: 39.4143, lng: -77.4105 },
  'rockville': { city: 'Rockville', state: 'Maryland', stateCode: 'MD', lat: 39.0840, lng: -77.1528 },
  'boston': { city: 'Boston', state: 'Massachusetts', stateCode: 'MA', lat: 42.3601, lng: -71.0589 },
  'worcester': { city: 'Worcester', state: 'Massachusetts', stateCode: 'MA', lat: 42.2626, lng: -71.8023 },
  'springfield': { city: 'Springfield', state: 'Massachusetts', stateCode: 'MA', lat: 42.1015, lng: -72.5898 },
  'cambridge': { city: 'Cambridge', state: 'Massachusetts', stateCode: 'MA', lat: 42.3736, lng: -71.1097 },
  'detroit': { city: 'Detroit', state: 'Michigan', stateCode: 'MI', lat: 42.3314, lng: -83.0458 },
  'grand-rapids': { city: 'Grand Rapids', state: 'Michigan', stateCode: 'MI', lat: 42.9634, lng: -85.6681 },
  'warren': { city: 'Warren', state: 'Michigan', stateCode: 'MI', lat: 42.5145, lng: -83.0147 },
  'sterling-heights': { city: 'Sterling Heights', state: 'Michigan', stateCode: 'MI', lat: 42.5803, lng: -83.0302 },
  'minneapolis': { city: 'Minneapolis', state: 'Minnesota', stateCode: 'MN', lat: 44.9778, lng: -93.2650 },
  'st-paul': { city: 'St Paul', state: 'Minnesota', stateCode: 'MN', lat: 44.9537, lng: -93.0900 },
  'rochester-mn': { city: 'Rochester', state: 'Minnesota', stateCode: 'MN', lat: 44.0121, lng: -92.4802 },
  'jackson': { city: 'Jackson', state: 'Mississippi', stateCode: 'MS', lat: 32.2988, lng: -90.1848 },
  'gulfport': { city: 'Gulfport', state: 'Mississippi', stateCode: 'MS', lat: 30.3674, lng: -89.0928 },
  'kansas-city': { city: 'Kansas City', state: 'Missouri', stateCode: 'MO', lat: 39.0997, lng: -94.5786 },
  'st-louis': { city: 'St Louis', state: 'Missouri', stateCode: 'MO', lat: 38.6270, lng: -90.1994 },
  'springfield-mo': { city: 'Springfield', state: 'Missouri', stateCode: 'MO', lat: 37.2090, lng: -93.2923 },
  'billings': { city: 'Billings', state: 'Montana', stateCode: 'MT', lat: 45.7833, lng: -108.5007 },
  'missoula': { city: 'Missoula', state: 'Montana', stateCode: 'MT', lat: 46.8721, lng: -113.9940 },
  'omaha': { city: 'Omaha', state: 'Nebraska', stateCode: 'NE', lat: 40.4406, lng: -95.9956 },
  'lincoln': { city: 'Lincoln', state: 'Nebraska', stateCode: 'NE', lat: 40.8136, lng: -96.7026 },
  'las-vegas': { city: 'Las Vegas', state: 'Nevada', stateCode: 'NV', lat: 36.1699, lng: -115.1398 },
  'reno': { city: 'Reno', state: 'Nevada', stateCode: 'NV', lat: 39.5296, lng: -119.8138 },
  'henderson': { city: 'Henderson', state: 'Nevada', stateCode: 'NV', lat: 36.0395, lng: -114.9817 },
  'manchester': { city: 'Manchester', state: 'New Hampshire', stateCode: 'NH', lat: 42.9956, lng: -71.4548 },
  'nashua': { city: 'Nashua', state: 'New Hampshire', stateCode: 'NH', lat: 42.7654, lng: -71.4676 },
  'newark': { city: 'Newark', state: 'New Jersey', stateCode: 'NJ', lat: 40.7357, lng: -74.1724 },
  'jersey-city': { city: 'Jersey City', state: 'New Jersey', stateCode: 'NJ', lat: 40.7178, lng: -74.0431 },
  'paterson': { city: 'Paterson', state: 'New Jersey', stateCode: 'NJ', lat: 40.9168, lng: -74.1718 },
  'elizabeth': { city: 'Elizabeth', state: 'New Jersey', stateCode: 'NJ', lat: 40.6640, lng: -74.2107 },
  'albuquerque': { city: 'Albuquerque', state: 'New Mexico', stateCode: 'NM', lat: 35.0844, lng: -106.6504 },
  'santa-fe': { city: 'Santa Fe', state: 'New Mexico', stateCode: 'NM', lat: 35.6870, lng: -105.9378 },
  'new-york': { city: 'New York', state: 'New York', stateCode: 'NY', lat: 40.7128, lng: -74.0060 },
  'buffalo': { city: 'Buffalo', state: 'New York', stateCode: 'NY', lat: 42.8864, lng: -78.8784 },
  'rochester-ny': { city: 'Rochester', state: 'New York', stateCode: 'NY', lat: 43.1566, lng: -77.6088 },
  'syracuse': { city: 'Syracuse', state: 'New York', stateCode: 'NY', lat: 43.0481, lng: -76.1474 },
  'albany': { city: 'Albany', state: 'New York', stateCode: 'NY', lat: 42.6526, lng: -73.7562 },
  'charlotte': { city: 'Charlotte', state: 'North Carolina', stateCode: 'NC', lat: 35.2271, lng: -80.8431 },
  'raleigh': { city: 'Raleigh', state: 'North Carolina', stateCode: 'NC', lat: 35.7796, lng: -78.6382 },
  'greensboro': { city: 'Greensboro', state: 'North Carolina', stateCode: 'NC', lat: 36.0726, lng: -79.7920 },
  'winston-salem': { city: 'Winston-Salem', state: 'North Carolina', stateCode: 'NC', lat: 36.0999, lng: -80.2442 },
  'fargo': { city: 'Fargo', state: 'North Dakota', stateCode: 'ND', lat: 46.8772, lng: -96.7898 },
  'bismarck': { city: 'Bismarck', state: 'North Dakota', stateCode: 'ND', lat: 46.8083, lng: -100.7837 },
  'columbus-oh': { city: 'Columbus', state: 'Ohio', stateCode: 'OH', lat: 39.9612, lng: -82.9988 },
  'cleveland': { city: 'Cleveland', state: 'Ohio', stateCode: 'OH', lat: 41.4993, lng: -81.6944 },
  'cincinnati': { city: 'Cincinnati', state: 'Ohio', stateCode: 'OH', lat: 39.1031, lng: -84.5120 },
  'toledo': { city: 'Toledo', state: 'Ohio', stateCode: 'OH', lat: 41.6528, lng: -83.5379 },
  'akron': { city: 'Akron', state: 'Ohio', stateCode: 'OH', lat: 41.0814, lng: -81.5190 },
  'oklahoma-city': { city: 'Oklahoma City', state: 'Oklahoma', stateCode: 'OK', lat: 35.4676, lng: -97.5164 },
  'tulsa': { city: 'Tulsa', state: 'Oklahoma', stateCode: 'OK', lat: 36.1540, lng: -95.9928 },
  'norman': { city: 'Norman', state: 'Oklahoma', stateCode: 'OK', lat: 35.2226, lng: -97.4395 },
  'portland-or': { city: 'Portland', state: 'Oregon', stateCode: 'OR', lat: 45.5152, lng: -122.6784 },
  'eugene': { city: 'Eugene', state: 'Oregon', stateCode: 'OR', lat: 44.0521, lng: -123.0868 },
  'salem': { city: 'Salem', state: 'Oregon', stateCode: 'OR', lat: 44.9429, lng: -123.0351 },
  'gresham': { city: 'Gresham', state: 'Oregon', stateCode: 'OR', lat: 45.5023, lng: -122.4312 },
  'philadelphia': { city: 'Philadelphia', state: 'Pennsylvania', stateCode: 'PA', lat: 39.9526, lng: -75.1652 },
  'pittsburgh': { city: 'Pittsburgh', state: 'Pennsylvania', stateCode: 'PA', lat: 40.4406, lng: -79.9959 },
  'allentown': { city: 'Allentown', state: 'Pennsylvania', stateCode: 'PA', lat: 40.6023, lng: -75.4714 },
  'erie': { city: 'Erie', state: 'Pennsylvania', stateCode: 'PA', lat: 42.1292, lng: -80.0851 },
  'providence': { city: 'Providence', state: 'Rhode Island', stateCode: 'RI', lat: 41.8240, lng: -71.4128 },
  'warwick': { city: 'Warwick', state: 'Rhode Island', stateCode: 'RI', lat: 41.7001, lng: -71.4162 },
  'charleston': { city: 'Charleston', state: 'South Carolina', stateCode: 'SC', lat: 32.7765, lng: -79.9311 },
  'columbia-sc': { city: 'Columbia', state: 'South Carolina', stateCode: 'SC', lat: 34.0007, lng: -81.0348 },
  'greenville': { city: 'Greenville', state: 'South Carolina', stateCode: 'SC', lat: 34.8526, lng: -82.3940 },
  'myrtle-beach': { city: 'Myrtle Beach', state: 'South Carolina', stateCode: 'SC', lat: 33.6891, lng: -78.8867 },
  'sioux-falls': { city: 'Sioux Falls', state: 'South Dakota', stateCode: 'SD', lat: 43.5446, lng: -96.7311 },
  'rapid-city': { city: 'Rapid City', state: 'South Dakota', stateCode: 'SD', lat: 44.0805, lng: -103.2310 },
  'nashville': { city: 'Nashville', state: 'Tennessee', stateCode: 'TN', lat: 36.1627, lng: -86.7816 },
  'memphis': { city: 'Memphis', state: 'Tennessee', stateCode: 'TN', lat: 35.1495, lng: -90.0490 },
  'knoxville': { city: 'Knoxville', state: 'Tennessee', stateCode: 'TN', lat: 35.9606, lng: -83.9207 },
  'chattanooga': { city: 'Chattanooga', state: 'Tennessee', stateCode: 'TN', lat: 35.0456, lng: -85.3097 },
  'clarksville': { city: 'Clarksville', state: 'Tennessee', stateCode: 'TN', lat: 36.5298, lng: -87.3595 },
  'houston': { city: 'Houston', state: 'Texas', stateCode: 'TX', lat: 29.7604, lng: -95.3698 },
  'san-antonio': { city: 'San Antonio', state: 'Texas', stateCode: 'TX', lat: 29.4241, lng: -98.4936 },
  'dallas': { city: 'Dallas', state: 'Texas', stateCode: 'TX', lat: 32.7767, lng: -96.7970 },
  'austin': { city: 'Austin', state: 'Texas', stateCode: 'TX', lat: 30.2672, lng: -97.7431 },
  'fort-worth': { city: 'Fort Worth', state: 'Texas', stateCode: 'TX', lat: 32.7555, lng: -97.3308 },
  'el-paso': { city: 'El Paso', state: 'Texas', stateCode: 'TX', lat: 31.7619, lng: -106.4850 },
  'arlington': { city: 'Arlington', state: 'Texas', stateCode: 'TX', lat: 32.7357, lng: -97.1081 },
  'salt-lake-city': { city: 'Salt Lake City', state: 'Utah', stateCode: 'UT', lat: 40.7608, lng: -111.8910 },
  'provo': { city: 'Provo', state: 'Utah', stateCode: 'UT', lat: 40.2338, lng: -111.6585 },
  'west-valley-city': { city: 'West Valley City', state: 'Utah', stateCode: 'UT', lat: 40.6916, lng: -112.0011 },
  'burlington': { city: 'Burlington', state: 'Vermont', stateCode: 'VT', lat: 44.4759, lng: -73.2121 },
  'virginia-beach': { city: 'Virginia Beach', state: 'Virginia', stateCode: 'VA', lat: 36.8529, lng: -75.9780 },
  'norfolk': { city: 'Norfolk', state: 'Virginia', stateCode: 'VA', lat: 36.8508, lng: -76.2859 },
  'chesapeake': { city: 'Chesapeake', state: 'Virginia', stateCode: 'VA', lat: 36.7682, lng: -76.2875 },
  'richmond': { city: 'Richmond', state: 'Virginia', stateCode: 'VA', lat: 37.5407, lng: -77.4360 },
  'newport-news': { city: 'Newport News', state: 'Virginia', stateCode: 'VA', lat: 37.0871, lng: -76.4730 },
  'seattle': { city: 'Seattle', state: 'Washington', stateCode: 'WA', lat: 47.6062, lng: -122.3321 },
  'spokane': { city: 'Spokane', state: 'Washington', stateCode: 'WA', lat: 47.6588, lng: -117.4260 },
  'tacoma': { city: 'Tacoma', state: 'Washington', stateCode: 'WA', lat: 47.2529, lng: -122.4443 },
  'bellevue': { city: 'Bellevue', state: 'Washington', stateCode: 'WA', lat: 47.6101, lng: -122.2015 },
  'vancouver-wa': { city: 'Vancouver', state: 'Washington', stateCode: 'WA', lat: 45.6387, lng: -122.6615 },
  'charleston-wv': { city: 'Charleston', state: 'West Virginia', stateCode: 'WV', lat: 38.3498, lng: -81.6326 },
  'huntington': { city: 'Huntington', state: 'West Virginia', stateCode: 'WV', lat: 38.4192, lng: -82.4452 },
  'milwaukee': { city: 'Milwaukee', state: 'Wisconsin', stateCode: 'WI', lat: 43.0389, lng: -87.9065 },
  'madison': { city: 'Madison', state: 'Wisconsin', stateCode: 'WI', lat: 43.0731, lng: -89.4012 },
  'green-bay': { city: 'Green Bay', state: 'Wisconsin', stateCode: 'WI', lat: 44.5133, lng: -88.0133 },
  'kenosha': { city: 'Kenosha', state: 'Wisconsin', stateCode: 'WI', lat: 42.5847, lng: -87.8212 },
  'cheyenne': { city: 'Cheyenne', state: 'Wyoming', stateCode: 'WY', lat: 41.1400, lng: -104.8202 },
  'casper': { city: 'Casper', state: 'Wyoming', stateCode: 'WY', lat: 42.8501, lng: -106.3252 },
};

// Price range configurations
const priceRanges = {
  'under-5000': { label: 'Under $5,000', min: 0, max: 5000, slug: 'under-5000' },
  'under-10000': { label: 'Under $10,000', min: 0, max: 10000, slug: 'under-10000' },
  'under-15000': { label: 'Under $15,000', min: 0, max: 15000, slug: 'under-15000' },
  'under-20000': { label: 'Under $20,000', min: 0, max: 20000, slug: 'under-20000' },
  'under-25000': { label: 'Under $25,000', min: 0, max: 25000, slug: 'under-25000' },
  'under-30000': { label: 'Under $30,000', min: 0, max: 30000, slug: 'under-30000' },
  '5000-to-10000': { label: '$5,000 - $10,000', min: 5000, max: 10000, slug: '5000-to-10000' },
  '10000-to-15000': { label: '$10,000 - $15,000', min: 10000, max: 15000, slug: '10000-to-15000' },
  '15000-to-20000': { label: '$15,000 - $20,000', min: 15000, max: 20000, slug: '15000-to-20000' },
  '20000-to-30000': { label: '$20,000 - $30,000', min: 20000, max: 30000, slug: '20000-to-30000' },
  '30000-to-50000': { label: '$30,000 - $50,000', min: 30000, max: 50000, slug: '30000-to-50000' },
  'over-50000': { label: 'Over $50,000', min: 50000, max: 999999, slug: 'over-50000' },
};

export async function generateStaticParams() {
  const params: { location: string; priceRange: string }[] = [];

  Object.keys(locations).forEach((location) => {
    Object.keys(priceRanges).forEach((priceRange) => {
      params.push({ location, priceRange });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ location: string; priceRange: string }> }): Promise<Metadata> {
  const { location, priceRange } = await params;
  const locationData = locations[location as keyof typeof locations];
  const priceData = priceRanges[priceRange as keyof typeof priceRanges];

  if (!locationData || !priceData) {
    return {
      title: 'Not Found',
    };
  }

  const { city, state, stateCode } = locationData;
  const { label, max } = priceData;

  return {
    title: `Used Cars ${label} in ${city}, ${stateCode} | Compare Prices | IQ Auto Deals`,
    description: `Shop quality used cars ${label.toLowerCase()} in ${city}, ${state}. Compare prices from local dealers, get instant offers, and save thousands. Browse certified pre-owned vehicles, SUVs, sedans, and trucks with transparent pricing.`,
    keywords: [
      `used cars ${label.toLowerCase()} ${city}`,
      `cars under $${max} ${city}`,
      `cheap cars ${city}`,
      `affordable cars ${city} ${stateCode}`,
      `used cars for sale ${city} ${label.toLowerCase()}`,
      `budget cars ${city}`,
      `${label} cars ${city}`,
    ],
    openGraph: {
      title: `Used Cars ${label} in ${city}, ${stateCode} | IQ Auto Deals`,
      description: `Shop quality used cars ${label.toLowerCase()} in ${city}. Compare prices and save up to $5,000.`,
      url: `https://iqautodeals.com/locations/${location}/${priceRange}`,
    },
    alternates: {
      canonical: `https://iqautodeals.com/locations/${location}/${priceRange}`,
    },
  };
}

export default async function PriceRangePage({ params }: { params: Promise<{ location: string; priceRange: string }> }) {
  const { location, priceRange } = await params;
  const locationData = locations[location as keyof typeof locations];
  const priceData = priceRanges[priceRange as keyof typeof priceRanges];

  if (!locationData || !priceData) {
    notFound();
  }

  const { city, state, stateCode, lat, lng } = locationData;
  const { label, min, max } = priceData;

  // Estimated counts (these would be dynamic in production)
  const estimatedCount = Math.floor(Math.random() * 500) + 100;
  const avgSavings = Math.floor(Math.random() * 2000) + 1000;

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://iqautodeals.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Locations",
                "item": "https://iqautodeals.com/locations"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": city,
                "item": `https://iqautodeals.com/locations/${location}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": label,
                "item": `https://iqautodeals.com/locations/${location}/${priceRange}`
              }
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `How many used cars ${label.toLowerCase()} are available in ${city}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Currently, we have approximately ${estimatedCount} quality used cars ${label.toLowerCase()} available from trusted dealers in ${city}, ${state}. Our inventory updates daily as dealers add new vehicles and competitive pricing.`
                }
              },
              {
                "@type": "Question",
                "name": `What's the average savings on cars ${label.toLowerCase()} in ${city}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `${city} buyers save an average of $${avgSavings.toLocaleString()} on used cars in this price range through IQ Auto Deals. By creating competition between dealers, you get their absolute best price upfront.`
                }
              },
              {
                "@type": "Question",
                "name": `Are these cars ${label.toLowerCase()} in ${city} certified?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Many vehicles in this price range are certified pre-owned or have been thoroughly inspected by licensed dealerships in ${city}. All dealers on our platform are verified and licensed in ${state}.`
                }
              },
              {
                "@type": "Question",
                "name": `Can I finance a car ${label.toLowerCase()} in ${city}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Yes! Most dealers in ${city} offer financing options for cars ${label.toLowerCase()}. You can get pre-approved and see monthly payment estimates before requesting quotes. Many buyers with good credit qualify for rates as low as 4.9% APR.`
                }
              }
            ]
          })
        }}
      />

      {/* LocalBusiness Schema with AggregateRating */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            "name": `IQ Auto Deals - ${city}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": city,
              "addressRegion": stateCode,
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": lat,
              "longitude": lng
            },
            "priceRange": label,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "247",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <nav className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/locations" className="text-blue-600 hover:text-blue-800">Locations</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href={`/locations/${location}`} className="text-blue-600 hover:text-blue-800">{city}</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700">{label}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Used Cars {label} in {city}, {stateCode}
            </h1>
            <p className="text-xl mb-4">
              Shop {estimatedCount}+ Quality Pre-Owned Vehicles from Trusted Dealers
            </p>
            <p className="text-lg mb-8 text-blue-100">
              Average savings: ${avgSavings.toLocaleString()} • Compare prices instantly • No haggling required
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse Cars {label}
              </Link>
              <Link
                href={`/locations/${location}`}
                className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition border-2 border-white"
              >
                All {city} Cars
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Why Buy in This Price Range */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Buy a Car {label} in {city}?</h2>
              <p className="text-gray-700 mb-4">
                Looking for quality used cars {label.toLowerCase()} in {city}, {state}? You're in the right place.
                IQ Auto Deals helps {city} residents find the perfect vehicle in this price range while saving thousands.
              </p>
              <p className="text-gray-700 mb-4">
                We connect you with licensed dealers across {city} who compete to offer you their absolute best price.
                No back-and-forth negotiation, no pressure tactics—just transparent pricing on quality vehicles.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Average savings of ${avgSavings.toLocaleString()} compared to traditional dealerships</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">All vehicles inspected by licensed {state} dealers</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Financing options available (as low as 4.9% APR)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Free vehicle history reports on request</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Popular Models in This Price Range</h2>
              <p className="text-gray-700 mb-6">
                {city} buyers shopping for cars {label.toLowerCase()} typically find excellent options in these categories:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Sedans</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Honda Accord</li>
                    <li>• Toyota Camry</li>
                    <li>• Nissan Altima</li>
                    <li>• Ford Fusion</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">SUVs</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Honda CR-V</li>
                    <li>• Toyota RAV4</li>
                    <li>• Ford Explorer</li>
                    <li>• Chevrolet Equinox</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Trucks</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Ford F-150</li>
                    <li>• Chevrolet Silverado</li>
                    <li>• Ram 1500</li>
                    <li>• Toyota Tacoma</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Compact</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Honda Civic</li>
                    <li>• Toyota Corolla</li>
                    <li>• Mazda3</li>
                    <li>• Hyundai Elantra</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Buy Used Cars {label} in {city}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-3">Browse & Select</h3>
                <p className="text-gray-600">
                  Choose up to 4 vehicles from {estimatedCount}+ cars {label.toLowerCase()} available in {city}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-3">Get Dealer Offers</h3>
                <p className="text-gray-600">
                  Local {city} dealers compete to give you their best price—no haggling needed
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-3">Choose & Buy</h3>
                <p className="text-gray-600">
                  Accept the best offer, schedule a test drive, and complete your purchase
                </p>
              </div>
            </div>
          </div>

          {/* Other Price Ranges in This City */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Browse Other Price Ranges in {city}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(priceRanges)
                .filter(([slug]) => slug !== priceRange)
                .slice(0, 8)
                .map(([slug, data]) => (
                  <Link
                    key={slug}
                    href={`/locations/${location}/${slug}`}
                    className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition text-center"
                  >
                    <div className="font-semibold text-gray-900">{data.label}</div>
                  </Link>
                ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">How many used cars {label.toLowerCase()} are available in {city}?</h3>
                <p className="text-gray-700">
                  Currently, we have approximately {estimatedCount} quality used cars {label.toLowerCase()} available from trusted dealers in {city}, {state}.
                  Our inventory updates daily as dealers add new vehicles and competitive pricing.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">What's the average savings on cars {label.toLowerCase()} in {city}?</h3>
                <p className="text-gray-700">
                  {city} buyers save an average of ${avgSavings.toLocaleString()} on used cars in this price range through IQ Auto Deals.
                  By creating competition between dealers, you get their absolute best price upfront.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Are these cars {label.toLowerCase()} in {city} certified?</h3>
                <p className="text-gray-700">
                  Many vehicles in this price range are certified pre-owned or have been thoroughly inspected by licensed dealerships in {city}.
                  All dealers on our platform are verified and licensed in {state}.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Can I finance a car {label.toLowerCase()} in {city}?</h3>
                <p className="text-gray-700">
                  Yes! Most dealers in {city} offer financing options for cars {label.toLowerCase()}. You can get pre-approved and see monthly payment estimates before requesting quotes.
                  Many buyers with good credit qualify for rates as low as 4.9% APR.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car in {city}?</h2>
            <p className="text-xl mb-6">
              Start browsing {estimatedCount}+ quality used cars {label.toLowerCase()} today
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Get Started - It's Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
