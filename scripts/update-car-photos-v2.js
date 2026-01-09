const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Using specific car model images from various free sources
// These URLs point to actual photos of the specific makes/models
const carPhotoMapping = {
  // DEALER 1 - Atlanta Premium Motors (Sedans & Luxury)
  '4T1G11AK8PU123001': { // 2023 Toyota Camry SE - Black
    make: 'Toyota', model: 'Camry',
    photos: [
      'https://www.motortrend.com/uploads/2022/11/2023-Toyota-Camry-SE-Nightshade-front-three-quarter-view-6.jpg',
      'https://www.motortrend.com/uploads/2022/11/2023-Toyota-Camry-SE-Nightshade-rear-three-quarter-view-3.jpg'
    ]
  },
  '1HGCV1F92NA123002': { // 2022 Honda Accord Touring - White
    make: 'Honda', model: 'Accord',
    photos: [
      'https://www.motortrend.com/uploads/2021/10/2022-Honda-Accord-Touring-front-three-quarter-1.jpg',
      'https://www.motortrend.com/uploads/2021/10/2022-Honda-Accord-Touring-rear-three-quarter-1.jpg'
    ]
  },
  'WBA5R1C05NDT23003': { // 2022 BMW 330i xDrive - White
    make: 'BMW', model: '330i',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/06/2020-BMW-330i-xDrive-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/06/2020-BMW-330i-xDrive-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'W1KCG5DB1RA123004': { // 2023 Mercedes-Benz C300 - Black
    make: 'Mercedes-Benz', model: 'C300',
    photos: [
      'https://www.motortrend.com/uploads/2022/03/2022-Mercedes-Benz-C300-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/03/2022-Mercedes-Benz-C300-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '58ABZ1B10NU123005': { // 2022 Lexus ES 350 - Silver
    make: 'Lexus', model: 'ES 350',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2021/06/2022-Lexus-ES-350-front-three-quarter-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2021/06/2022-Lexus-ES-350-rear-three-quarter-1.jpg'
    ]
  },
  'WAUC4AF40PA123006': { // 2023 Audi A4 Prestige - Black
    make: 'Audi', model: 'A4',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/11/2020-Audi-A4-front-three-quarter-in-motion-7.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/11/2020-Audi-A4-rear-three-quarter-in-motion-5.jpg'
    ]
  },
  '5YJ3E1EB2PF123007': { // 2023 Tesla Model 3 - White
    make: 'Tesla', model: 'Model 3',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/08/2020-Tesla-Model-3-front-three-quarter-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/08/2020-Tesla-Model-3-rear-three-quarter-1.jpg'
    ]
  },
  '19UUB6F59NA123008': { // 2022 Acura TLX A-Spec - Red
    make: 'Acura', model: 'TLX',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/10/2021-Acura-TLX-A-Spec-front-three-quarter-in-motion-3.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/10/2021-Acura-TLX-A-Spec-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'JM1GL1WM6M1123009': { // 2021 Mazda Mazda6 - Blue
    make: 'Mazda', model: 'Mazda6',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/06/2020-Mazda-6-Signature-front-three-quarter-in-motion-3.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/06/2020-Mazda-6-Signature-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'KMTG34TA5NU123010': { // 2022 Genesis G70 - White
    make: 'Genesis', model: 'G70',
    photos: [
      'https://www.motortrend.com/uploads/2021/10/2022-Genesis-G70-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2021/10/2022-Genesis-G70-rear-three-quarter-in-motion-1.jpg'
    ]
  },

  // DEALER 2 - Elite Auto Group (Compact SUVs)
  'JTMB1RFV4PD223001': { // 2023 Toyota RAV4 - Gray
    make: 'Toyota', model: 'RAV4',
    photos: [
      'https://www.motortrend.com/uploads/2022/11/2023-Toyota-RAV4-XLE-Premium-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/11/2023-Toyota-RAV4-XLE-Premium-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '7FARW2H88NE223002': { // 2022 Honda CR-V - Gray
    make: 'Honda', model: 'CR-V',
    photos: [
      'https://www.motortrend.com/uploads/2022/07/2023-Honda-CR-V-EX-L-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/07/2023-Honda-CR-V-EX-L-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'JM3KFBEY7P0223003': { // 2023 Mazda CX-5 - Red
    make: 'Mazda', model: 'CX-5',
    photos: [
      'https://www.motortrend.com/uploads/2022/11/2023-Mazda-CX-5-2-5-Turbo-Signature-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/11/2023-Mazda-CX-5-2-5-Turbo-Signature-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '2T2BZMCA9NC223004': { // 2022 Lexus RX 350 - Black
    make: 'Lexus', model: 'RX 350',
    photos: [
      'https://www.motortrend.com/uploads/2022/06/2023-Lexus-RX-350h-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/06/2023-Lexus-RX-350h-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '5UX53DP08P9223005': { // 2023 BMW X3 - Gray
    make: 'BMW', model: 'X3',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2021/06/2022-BMW-X3-M40i-front-three-quarter-in-motion-3.jpg',
      'https://www.motortrend.com/uploads/sites/5/2021/06/2022-BMW-X3-M40i-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'WA1BVAFY9N2223006': { // 2022 Audi Q5 - Blue
    make: 'Audi', model: 'Q5',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/06/2021-Audi-Q5-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/06/2021-Audi-Q5-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'WDC0G8EB9PV223007': { // 2023 Mercedes-Benz GLC - Silver
    make: 'Mercedes-Benz', model: 'GLC',
    photos: [
      'https://www.motortrend.com/uploads/2022/06/2023-Mercedes-Benz-GLC-300-4Matic-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/06/2023-Mercedes-Benz-GLC-300-4Matic-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'YV4A22PL7N2223008': { // 2022 Volvo XC60 - Gray
    make: 'Volvo', model: 'XC60',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2021/04/2021-Volvo-XC60-T8-Polestar-Engineered-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2021/04/2021-Volvo-XC60-T8-Polestar-Engineered-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '5J8TC2H79PL223009': { // 2023 Acura RDX - Blue
    make: 'Acura', model: 'RDX',
    photos: [
      'https://www.motortrend.com/uploads/2022/05/2023-Acura-RDX-front-three-quarter-view-1.jpg',
      'https://www.motortrend.com/uploads/2022/05/2023-Acura-RDX-rear-three-quarter-view-1.jpg'
    ]
  },
  '3PCAJ5M31NF223010': { // 2022 Infiniti QX50 - Gray
    make: 'Infiniti', model: 'QX50',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/09/2020-Infiniti-QX50-Autograph-AWD-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/09/2020-Infiniti-QX50-Autograph-AWD-rear-three-quarter-in-motion-1.jpg'
    ]
  },

  // DEALER 3 - Prestige Auto Sales (Trucks & Off-Road)
  '1FTFW1E85NFA33001': { // 2022 Ford F-150 - Red
    make: 'Ford', model: 'F-150',
    photos: [
      'https://www.motortrend.com/uploads/2022/05/2022-Ford-F-150-Lariat-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/05/2022-Ford-F-150-Lariat-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1GCUYGEL3PF333002': { // 2023 Chevrolet Silverado - Black
    make: 'Chevrolet', model: 'Silverado',
    photos: [
      'https://www.motortrend.com/uploads/2022/01/2022-Chevrolet-Silverado-1500-High-Country-front-three-quarter-in-motion-2.jpg',
      'https://www.motortrend.com/uploads/2022/01/2022-Chevrolet-Silverado-1500-High-Country-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1C6SRFFT6NN333003': { // 2022 Ram 1500 - Gray
    make: 'Ram', model: '1500',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/08/2019-Ram-1500-Laramie-front-three-quarter-in-motion.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/08/2019-Ram-1500-Laramie-rear-three-quarter-in-motion.jpg'
    ]
  },
  '1GTU9EED3PZ333004': { // 2023 GMC Sierra - Black
    make: 'GMC', model: 'Sierra',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2021/07/2022-GMC-Sierra-1500-Denali-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2021/07/2022-GMC-Sierra-1500-Denali-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '3TYCZ5AN2PT333005': { // 2023 Toyota Tacoma - Orange
    make: 'Toyota', model: 'Tacoma',
    photos: [
      'https://www.motortrend.com/uploads/2023/05/2024-Toyota-Tacoma-TRD-Pro-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2023/05/2024-Toyota-Tacoma-TRD-Pro-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1C4JJXFN0PW333006': { // 2023 Jeep Wrangler - Blue
    make: 'Jeep', model: 'Wrangler',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/07/2021-Jeep-Wrangler-Rubicon-392-front-three-quarter-in-motion-2.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/07/2021-Jeep-Wrangler-Rubicon-392-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1FMDE5BH9NLA333007': { // 2022 Ford Bronco - Gray
    make: 'Ford', model: 'Bronco',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2021/01/2021-Ford-Bronco-Badlands-front-three-quarter-in-motion-3.jpg',
      'https://www.motortrend.com/uploads/sites/5/2021/01/2021-Ford-Bronco-Badlands-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1GCGTCEN8P1333008': { // 2023 Chevrolet Colorado - Gray
    make: 'Chevrolet', model: 'Colorado',
    photos: [
      'https://www.motortrend.com/uploads/2022/07/2023-Chevrolet-Colorado-Trail-Boss-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/07/2023-Chevrolet-Colorado-Trail-Boss-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '5TFDY5F18PX333009': { // 2023 Toyota Tundra - Gray
    make: 'Toyota', model: 'Tundra',
    photos: [
      'https://www.motortrend.com/uploads/2022/02/2022-Toyota-Tundra-TRD-Pro-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/02/2022-Toyota-Tundra-TRD-Pro-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1N6ED1EJ3NN333010': { // 2022 Nissan Frontier - Gray
    make: 'Nissan', model: 'Frontier',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2021/08/2022-Nissan-Frontier-PRO-4X-front-three-quarter-in-motion-3.jpg',
      'https://www.motortrend.com/uploads/sites/5/2021/08/2022-Nissan-Frontier-PRO-4X-rear-three-quarter-in-motion-1.jpg'
    ]
  },

  // DEALER 4 - AutoMax Dealership (Luxury SUVs)
  'WP1AB2A59PKA44001': { // 2023 Porsche Macan - Gray
    make: 'Porsche', model: 'Macan',
    photos: [
      'https://www.motortrend.com/uploads/2022/06/2023-Porsche-Macan-GTS-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/06/2023-Porsche-Macan-GTS-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '5UXCR6C03P9K44002': { // 2023 BMW X5 - Blue
    make: 'BMW', model: 'X5',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/07/2020-BMW-X5-M50i-front-three-quarter-in-motion-5.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/07/2020-BMW-X5-M50i-rear-three-quarter-in-motion-3.jpg'
    ]
  },
  '4JGFB4KB9PA44003': { // 2023 Mercedes-Benz GLE - Gray
    make: 'Mercedes-Benz', model: 'GLE',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Mercedes-Benz-GLE-450-4Matic-front-three-quarter-in-motion-2.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Mercedes-Benz-GLE-450-4Matic-rear-three-quarter-in-motion-2.jpg'
    ]
  },
  'WA1LHBF79ND44004': { // 2022 Audi Q7 - Gray
    make: 'Audi', model: 'Q7',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Audi-Q7-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Audi-Q7-rear-three-quarter-in-motion-2.jpg'
    ]
  },
  '1GYS4FKL6PR44005': { // 2023 Cadillac Escalade - Black
    make: 'Cadillac', model: 'Escalade',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/07/2021-Cadillac-Escalade-front-three-quarter-in-motion-8.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/07/2021-Cadillac-Escalade-rear-three-quarter-in-motion-2.jpg'
    ]
  },
  '5LMJJ3LT3NEL44006': { // 2022 Lincoln Navigator - White
    make: 'Lincoln', model: 'Navigator',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/10/2021-Lincoln-Navigator-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/10/2021-Lincoln-Navigator-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'SALWS2SE6PA44007': { // 2023 Land Rover Range Rover Sport - Black
    make: 'Land Rover', model: 'Range Rover Sport',
    photos: [
      'https://www.motortrend.com/uploads/2022/05/2023-Land-Rover-Range-Rover-Sport-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2022/05/2023-Land-Rover-Range-Rover-Sport-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'ZN661XUA6NX44008': { // 2022 Maserati Levante - Blue
    make: 'Maserati', model: 'Levante',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/06/2020-Maserati-Levante-GTS-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/06/2020-Maserati-Levante-GTS-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'ZASPAKBN8P7C44009': { // 2023 Alfa Romeo Stelvio - Gray
    make: 'Alfa Romeo', model: 'Stelvio',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/11/2020-Alfa-Romeo-Stelvio-Quadrifoglio-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/11/2020-Alfa-Romeo-Stelvio-Quadrifoglio-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'KMUHB8DB5PU44010': { // 2023 Genesis GV80 - White
    make: 'Genesis', model: 'GV80',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/06/2021-Genesis-GV80-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/06/2021-Genesis-GV80-rear-three-quarter-in-motion-1.jpg'
    ]
  },

  // DEALER 5 - Superior Automotive (Value Vehicles)
  '5NPE34AF5PH555001': { // 2023 Hyundai Sonata - Gray
    make: 'Hyundai', model: 'Sonata',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/03/2020-Hyundai-Sonata-Limited-front-three-quarter-in-motion-2.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/03/2020-Hyundai-Sonata-Limited-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '5XXG84J20PG555002': { // 2023 Kia K5 - Gray
    make: 'Kia', model: 'K5',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/06/2021-Kia-K5-GT-Line-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/06/2021-Kia-K5-GT-Line-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1N4BL4FV8NC555003': { // 2022 Nissan Altima - Blue
    make: 'Nissan', model: 'Altima',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/09/2019-Nissan-Altima-front-three-quarter-in-motion-6.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/09/2019-Nissan-Altima-rear-three-quarter-in-motion-3.jpg'
    ]
  },
  '1VWCA7A32MC555004': { // 2021 Volkswagen Passat - White
    make: 'Volkswagen', model: 'Passat',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/06/2020-Volkswagen-Passat-front-three-quarter-in-motion-2.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/06/2020-Volkswagen-Passat-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '4S3BWAN67P3555005': { // 2023 Subaru Legacy - Gray
    make: 'Subaru', model: 'Legacy',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Subaru-Legacy-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Subaru-Legacy-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '5NMJE3AE0PH555006': { // 2023 Hyundai Tucson - Gray
    make: 'Hyundai', model: 'Tucson',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2021/04/2022-Hyundai-Tucson-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2021/04/2022-Hyundai-Tucson-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'KNDPM3ACXP7555007': { // 2023 Kia Sportage - Red
    make: 'Kia', model: 'Sportage',
    photos: [
      'https://www.motortrend.com/uploads/2021/11/2023-Kia-Sportage-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/2021/11/2023-Kia-Sportage-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '4S4BTGND7P3555008': { // 2023 Subaru Outback - Green
    make: 'Subaru', model: 'Outback',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Subaru-Outback-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Subaru-Outback-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  '1V2GR2CA9NC555009': { // 2022 Volkswagen Atlas - Blue
    make: 'Volkswagen', model: 'Atlas',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2020/10/2021-Volkswagen-Atlas-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2020/10/2021-Volkswagen-Atlas-rear-three-quarter-in-motion-1.jpg'
    ]
  },
  'JM3TCBEY9N0555010': { // 2022 Mazda CX-9 - Gray
    make: 'Mazda', model: 'CX-9',
    photos: [
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Mazda-CX-9-front-three-quarter-in-motion-1.jpg',
      'https://www.motortrend.com/uploads/sites/5/2019/10/2020-Mazda-CX-9-rear-three-quarter-in-motion-1.jpg'
    ]
  }
};

async function updateCarPhotos() {
  console.log('Starting car photo update with model-specific images...\n');

  let updatedCount = 0;
  let errorCount = 0;

  for (const [vin, data] of Object.entries(carPhotoMapping)) {
    try {
      const result = await prisma.car.update({
        where: { vin },
        data: {
          photos: JSON.stringify(data.photos)
        }
      });

      console.log(`✓ Updated ${data.make} ${data.model} (VIN: ${vin.slice(-6)})`);
      updatedCount++;
    } catch (error) {
      console.log(`✗ Failed to update VIN ${vin}: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Photo Update Complete!`);
  console.log(`  Updated: ${updatedCount} cars`);
  console.log(`  Errors: ${errorCount}`);
  console.log('='.repeat(50));
}

updateCarPhotos()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
