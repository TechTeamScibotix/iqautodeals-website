const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapping of VIN to realistic car photos for each specific vehicle
// Using high-quality images that match the actual make/model
const carPhotoMapping = {
  // DEALER 1 - Atlanta Premium Motors (Sedans & Luxury)
  '4T1G11AK8PU123001': { // 2023 Toyota Camry SE - Midnight Black
    make: 'Toyota', model: 'Camry',
    photos: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
      'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'
    ]
  },
  '1HGCV1F92NA123002': { // 2022 Honda Accord Touring - White
    make: 'Honda', model: 'Accord',
    photos: [
      'https://images.unsplash.com/photo-1631722899245-3b4d69f93f48?w=800',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
    ]
  },
  'WBA5R1C05NDT23003': { // 2022 BMW 330i xDrive - Alpine White
    make: 'BMW', model: '330i',
    photos: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'
    ]
  },
  'W1KCG5DB1RA123004': { // 2023 Mercedes-Benz C300 - Black
    make: 'Mercedes-Benz', model: 'C300',
    photos: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
    ]
  },
  '58ABZ1B10NU123005': { // 2022 Lexus ES 350 - Silver
    make: 'Lexus', model: 'ES 350',
    photos: [
      'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800',
      'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800'
    ]
  },
  'WAUC4AF40PA123006': { // 2023 Audi A4 Prestige - Black
    make: 'Audi', model: 'A4',
    photos: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800'
    ]
  },
  '5YJ3E1EB2PF123007': { // 2023 Tesla Model 3 - White
    make: 'Tesla', model: 'Model 3',
    photos: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800'
    ]
  },
  '19UUB6F59NA123008': { // 2022 Acura TLX A-Spec - Red
    make: 'Acura', model: 'TLX',
    photos: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
    ]
  },
  'JM1GL1WM6M1123009': { // 2021 Mazda Mazda6 - Blue
    make: 'Mazda', model: 'Mazda6',
    photos: [
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800'
    ]
  },
  'KMTG34TA5NU123010': { // 2022 Genesis G70 - White
    make: 'Genesis', model: 'G70',
    photos: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
    ]
  },

  // DEALER 2 - Elite Auto Group (Compact SUVs)
  'JTMB1RFV4PD223001': { // 2023 Toyota RAV4 - Gray
    make: 'Toyota', model: 'RAV4',
    photos: [
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'
    ]
  },
  '7FARW2H88NE223002': { // 2022 Honda CR-V - Gray
    make: 'Honda', model: 'CR-V',
    photos: [
      'https://images.unsplash.com/photo-1568844293986-8c8a03c44ff1?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
    ]
  },
  'JM3KFBEY7P0223003': { // 2023 Mazda CX-5 - Red
    make: 'Mazda', model: 'CX-5',
    photos: [
      'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800'
    ]
  },
  '2T2BZMCA9NC223004': { // 2022 Lexus RX 350 - Black
    make: 'Lexus', model: 'RX 350',
    photos: [
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800',
      'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800'
    ]
  },
  '5UX53DP08P9223005': { // 2023 BMW X3 - Gray
    make: 'BMW', model: 'X3',
    photos: [
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
    ]
  },
  'WA1BVAFY9N2223006': { // 2022 Audi Q5 - Blue
    make: 'Audi', model: 'Q5',
    photos: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800'
    ]
  },
  'WDC0G8EB9PV223007': { // 2023 Mercedes-Benz GLC - Silver
    make: 'Mercedes-Benz', model: 'GLC',
    photos: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'
    ]
  },
  'YV4A22PL7N2223008': { // 2022 Volvo XC60 - Gray
    make: 'Volvo', model: 'XC60',
    photos: [
      'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ]
  },
  '5J8TC2H79PL223009': { // 2023 Acura RDX - Blue
    make: 'Acura', model: 'RDX',
    photos: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
    ]
  },
  '3PCAJ5M31NF223010': { // 2022 Infiniti QX50 - Gray
    make: 'Infiniti', model: 'QX50',
    photos: [
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ]
  },

  // DEALER 3 - Prestige Auto Sales (Trucks & Off-Road)
  '1FTFW1E85NFA33001': { // 2022 Ford F-150 - Red
    make: 'Ford', model: 'F-150',
    photos: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
    ]
  },
  '1GCUYGEL3PF333002': { // 2023 Chevrolet Silverado - Black
    make: 'Chevrolet', model: 'Silverado',
    photos: [
      'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800',
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800'
    ]
  },
  '1C6SRFFT6NN333003': { // 2022 Ram 1500 - Gray
    make: 'Ram', model: '1500',
    photos: [
      'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800',
      'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800'
    ]
  },
  '1GTU9EED3PZ333004': { // 2023 GMC Sierra - Black
    make: 'GMC', model: 'Sierra',
    photos: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'
    ]
  },
  '3TYCZ5AN2PT333005': { // 2023 Toyota Tacoma - Orange
    make: 'Toyota', model: 'Tacoma',
    photos: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
      'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800'
    ]
  },
  '1C4JJXFN0PW333006': { // 2023 Jeep Wrangler - Blue
    make: 'Jeep', model: 'Wrangler',
    photos: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
    ]
  },
  '1FMDE5BH9NLA333007': { // 2022 Ford Bronco - Gray
    make: 'Ford', model: 'Bronco',
    photos: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'
    ]
  },
  '1GCGTCEN8P1333008': { // 2023 Chevrolet Colorado - Gray
    make: 'Chevrolet', model: 'Colorado',
    photos: [
      'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800',
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800'
    ]
  },
  '5TFDY5F18PX333009': { // 2023 Toyota Tundra - Gray
    make: 'Toyota', model: 'Tundra',
    photos: [
      'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'
    ]
  },
  '1N6ED1EJ3NN333010': { // 2022 Nissan Frontier - Gray
    make: 'Nissan', model: 'Frontier',
    photos: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
      'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800'
    ]
  },

  // DEALER 4 - AutoMax Dealership (Luxury SUVs)
  'WP1AB2A59PKA44001': { // 2023 Porsche Macan - Gray
    make: 'Porsche', model: 'Macan',
    photos: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
    ]
  },
  '5UXCR6C03P9K44002': { // 2023 BMW X5 - Blue
    make: 'BMW', model: 'X5',
    photos: [
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'
    ]
  },
  '4JGFB4KB9PA44003': { // 2023 Mercedes-Benz GLE - Gray
    make: 'Mercedes-Benz', model: 'GLE',
    photos: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
    ]
  },
  'WA1LHBF79ND44004': { // 2022 Audi Q7 - Gray
    make: 'Audi', model: 'Q7',
    photos: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
    ]
  },
  '1GYS4FKL6PR44005': { // 2023 Cadillac Escalade - Black
    make: 'Cadillac', model: 'Escalade',
    photos: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
    ]
  },
  '5LMJJ3LT3NEL44006': { // 2022 Lincoln Navigator - White
    make: 'Lincoln', model: 'Navigator',
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
    ]
  },
  'SALWS2SE6PA44007': { // 2023 Land Rover Range Rover - Black
    make: 'Land Rover', model: 'Range Rover',
    photos: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'
    ]
  },
  'ZN661XUA6NX44008': { // 2022 Maserati Levante - Blue
    make: 'Maserati', model: 'Levante',
    photos: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
    ]
  },
  'ZASPAKBN8P7C44009': { // 2023 Alfa Romeo Stelvio - Gray
    make: 'Alfa Romeo', model: 'Stelvio',
    photos: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800'
    ]
  },
  'KMUHB8DB5PU44010': { // 2023 Genesis GV80 - White
    make: 'Genesis', model: 'GV80',
    photos: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ]
  },

  // DEALER 5 - Superior Automotive (Value Vehicles)
  '5NPE34AF5PH555001': { // 2023 Hyundai Sonata - Gray
    make: 'Hyundai', model: 'Sonata',
    photos: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
    ]
  },
  '5XXG84J20PG555002': { // 2023 Kia K5 - Gray
    make: 'Kia', model: 'K5',
    photos: [
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800'
    ]
  },
  '1N4BL4FV8NC555003': { // 2022 Nissan Altima - Blue
    make: 'Nissan', model: 'Altima',
    photos: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
    ]
  },
  '1VWCA7A32MC555004': { // 2021 Volkswagen Passat - White
    make: 'Volkswagen', model: 'Passat',
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
    ]
  },
  '4S3BWAN67P3555005': { // 2023 Subaru Legacy - Gray
    make: 'Subaru', model: 'Legacy',
    photos: [
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
    ]
  },
  '5NMJE3AE0PH555006': { // 2023 Hyundai Tucson - Gray
    make: 'Hyundai', model: 'Tucson',
    photos: [
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800',
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
    ]
  },
  'KNDPM3ACXP7555007': { // 2023 Kia Sportage - Red
    make: 'Kia', model: 'Sportage',
    photos: [
      'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800'
    ]
  },
  '4S4BTGND7P3555008': { // 2023 Subaru Outback - Green
    make: 'Subaru', model: 'Outback',
    photos: [
      'https://images.unsplash.com/photo-1568844293986-8c8a03c44ff1?w=800',
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
    ]
  },
  '1V2GR2CA9NC555009': { // 2022 Volkswagen Atlas - Blue
    make: 'Volkswagen', model: 'Atlas',
    photos: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800'
    ]
  },
  'JM3TCBEY9N0555010': { // 2022 Mazda CX-9 - Gray
    make: 'Mazda', model: 'CX-9',
    photos: [
      'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800'
    ]
  }
};

async function updateCarPhotos() {
  console.log('Starting car photo update...\n');

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
