const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  console.log('Clearing existing database...');
  await prisma.testDrive.deleteMany();
  await prisma.acceptedDeal.deleteMany();
  await prisma.negotiation.deleteMany();
  await prisma.selectedCar.deleteMany();
  await prisma.dealList.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating demo users...');

  // Create 5 Dealers
  const dealer1 = await prisma.user.create({
    data: {
      email: 'dealer1@iqautodeals.com',
      password: await bcrypt.hash('dealer123', 10),
      name: 'Robert Martinez',
      phone: '(404) 555-0101',
      userType: 'dealer',
      businessName: 'Atlanta Premium Motors',
      address: '1245 Peachtree Street NE',
      city: 'Atlanta',
      state: 'GA',
      zip: '30309',
      workHoursStart: '09:00',
      workHoursEnd: '19:00',
      workDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    },
  });

  const dealer2 = await prisma.user.create({
    data: {
      email: 'dealer2@iqautodeals.com',
      password: await bcrypt.hash('dealer123', 10),
      name: 'Jennifer Thompson',
      phone: '(770) 555-0202',
      userType: 'dealer',
      businessName: 'Elite Auto Group',
      address: '892 Roswell Road',
      city: 'Marietta',
      state: 'GA',
      zip: '30062',
      workHoursStart: '08:30',
      workHoursEnd: '20:00',
      workDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    },
  });

  const dealer3 = await prisma.user.create({
    data: {
      email: 'dealer3@iqautodeals.com',
      password: await bcrypt.hash('dealer123', 10),
      name: 'Michael Chen',
      phone: '(678) 555-0303',
      userType: 'dealer',
      businessName: 'Prestige Auto Sales',
      address: '567 Ponce de Leon Avenue',
      city: 'Decatur',
      state: 'GA',
      zip: '30030',
      workHoursStart: '09:00',
      workHoursEnd: '18:00',
      workDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    },
  });

  const dealer4 = await prisma.user.create({
    data: {
      email: 'dealer4@iqautodeals.com',
      password: await bcrypt.hash('dealer123', 10),
      name: 'David Anderson',
      phone: '(470) 555-0404',
      userType: 'dealer',
      businessName: 'AutoMax Dealership',
      address: '2341 Buford Highway',
      city: 'Brookhaven',
      state: 'GA',
      zip: '30319',
      workHoursStart: '08:00',
      workHoursEnd: '19:00',
      workDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    },
  });

  const dealer5 = await prisma.user.create({
    data: {
      email: 'dealer5@iqautodeals.com',
      password: await bcrypt.hash('dealer123', 10),
      name: 'Lisa Williams',
      phone: '(404) 555-0505',
      userType: 'dealer',
      businessName: 'Superior Automotive',
      address: '4523 Memorial Drive',
      city: 'Stone Mountain',
      state: 'GA',
      zip: '30083',
      workHoursStart: '09:00',
      workHoursEnd: '18:00',
      workDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    },
  });

  // Create 2 Customers
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@iqautodeals.com',
      password: await bcrypt.hash('customer123', 10),
      name: 'James Wilson',
      phone: '(404) 555-1001',
      userType: 'customer',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@iqautodeals.com',
      password: await bcrypt.hash('customer123', 10),
      name: 'Maria Garcia',
      phone: '(770) 555-1002',
      userType: 'customer',
    },
  });

  console.log('Creating professional inventory - 50 vehicles...');

  const cars = [];

  // DEALER 1 - Atlanta Premium Motors (10 cars)
  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Toyota',
      model: 'Camry SE',
      year: 2023,
      vin: '4T1G11AK8PU123001',
      mileage: 12500,
      color: 'Midnight Black Metallic',
      transmission: 'Automatic',
      salePrice: 28500,
      description: 'Certified Pre-Owned. One owner, clean Carfax. Features include adaptive cruise control, lane departure warning, and premium sound system.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Honda',
      model: 'Accord Touring',
      year: 2022,
      vin: '1HGCV1F92NA123002',
      mileage: 18200,
      color: 'Platinum White Pearl',
      transmission: 'Automatic',
      salePrice: 32000,
      description: 'Fully loaded with leather interior, navigation, sunroof, and Honda Sensing safety suite. Excellent condition.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'BMW',
      model: '330i xDrive',
      year: 2022,
      vin: 'WBA5R1C05NDT23003',
      mileage: 15800,
      color: 'Alpine White',
      transmission: 'Automatic',
      salePrice: 42500,
      description: 'Premium luxury sedan with all-wheel drive, heated seats, premium sound, and advanced driver assistance features.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Mercedes-Benz',
      model: 'C300 4MATIC',
      year: 2023,
      vin: 'W1KCG5DB1RA123004',
      mileage: 8500,
      color: 'Obsidian Black',
      transmission: 'Automatic',
      salePrice: 48900,
      description: 'Nearly new luxury sedan with premium package, panoramic sunroof, Burmester sound system, and full warranty.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Lexus',
      model: 'ES 350',
      year: 2022,
      vin: '58ABZ1B10NU123005',
      mileage: 22000,
      color: 'Atomic Silver',
      transmission: 'Automatic',
      salePrice: 39500,
      description: 'Luxury and reliability combined. Mark Levinson audio, heated and ventilated seats, and Lexus Safety System+.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1623869675503-9c7a4eb4cd5c?w=800',
        'https://images.unsplash.com/photo-1627454820516-3076d4b0f05e?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Audi',
      model: 'A4 Prestige',
      year: 2023,
      vin: 'WAUC4AF40PA123006',
      mileage: 7200,
      color: 'Mythos Black',
      transmission: 'Automatic',
      salePrice: 45900,
      description: 'Premium all-wheel drive sedan with virtual cockpit, Bang & Olufsen sound, and advanced technology package.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Tesla',
      model: 'Model 3 Long Range',
      year: 2023,
      vin: '5YJ3E1EB2PF123007',
      mileage: 5400,
      color: 'Pearl White Multi-Coat',
      transmission: 'Automatic',
      salePrice: 52000,
      description: 'Enhanced Autopilot, premium interior, dual motor AWD. Remaining factory warranty and free Supercharging.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Acura',
      model: 'TLX A-Spec',
      year: 2022,
      vin: '19UUB6F59NA123008',
      mileage: 16500,
      color: 'Performance Red Pearl',
      transmission: 'Automatic',
      salePrice: 38900,
      description: 'Sport luxury sedan with Super Handling All-Wheel Drive, ELS Studio audio, and advanced safety features.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Mazda',
      model: 'Mazda6 Signature',
      year: 2021,
      vin: 'JM1GL1WM6M1123009',
      mileage: 28000,
      color: 'Deep Crystal Blue',
      transmission: 'Automatic',
      salePrice: 27500,
      description: 'Premium midsize sedan with Nappa leather, Bose audio, and advanced i-ACTIVSENSE safety technology.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer1.id,
      make: 'Genesis',
      model: 'G70 3.3T Sport',
      year: 2022,
      vin: 'KMTG34TA5NU123010',
      mileage: 14200,
      color: 'Uyuni White',
      transmission: 'Automatic',
      salePrice: 44500,
      description: 'Twin-turbo luxury sport sedan with premium audio, Nappa leather, and Genesis Connected Services.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
      ]),
      latitude: 33.7756,
      longitude: -84.3963,
      city: 'Atlanta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  // DEALER 2 - Elite Auto Group (10 cars)
  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Toyota',
      model: 'RAV4 XLE Premium',
      year: 2023,
      vin: 'JTMB1RFV4PD223001',
      mileage: 8900,
      color: 'Magnetic Gray Metallic',
      transmission: 'Automatic',
      salePrice: 34500,
      description: 'All-wheel drive compact SUV with panoramic sunroof, power liftgate, and Toyota Safety Sense 2.5+.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Honda',
      model: 'CR-V EX-L',
      year: 2022,
      vin: '7FARW2H88NE223002',
      mileage: 21000,
      color: 'Modern Steel Metallic',
      transmission: 'Automatic',
      salePrice: 32800,
      description: 'Popular compact SUV with leather seats, Honda Sensing, sunroof, and hands-free power tailgate.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Mazda',
      model: 'CX-5 Turbo',
      year: 2023,
      vin: 'JM3KFBEY7P0223003',
      mileage: 6500,
      color: 'Soul Red Crystal',
      transmission: 'Automatic',
      salePrice: 38900,
      description: 'Turbocharged premium SUV with Nappa leather, Bose audio, and advanced i-ACTIVSENSE safety.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Lexus',
      model: 'RX 350 F Sport',
      year: 2022,
      vin: '2T2BZMCA9NC223004',
      mileage: 19500,
      color: 'Caviar',
      transmission: 'Automatic',
      salePrice: 49900,
      description: 'Luxury midsize SUV with F Sport package, Mark Levinson audio, and Lexus Safety System+ 2.0.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'BMW',
      model: 'X3 M40i',
      year: 2023,
      vin: '5UX53DP08P9223005',
      mileage: 7800,
      color: 'Brooklyn Gray Metallic',
      transmission: 'Automatic',
      salePrice: 59500,
      description: 'Performance luxury SUV with M Sport package, Harman Kardon audio, and advanced technology.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Audi',
      model: 'Q5 Premium Plus',
      year: 2022,
      vin: 'WA1BVAFY9N2223006',
      mileage: 17200,
      color: 'Navarra Blue',
      transmission: 'Automatic',
      salePrice: 46500,
      description: 'Luxury compact SUV with Quattro AWD, virtual cockpit, panoramic sunroof, and premium sound.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Mercedes-Benz',
      model: 'GLC 300 4MATIC',
      year: 2023,
      vin: 'WDC0G8EB9PV223007',
      mileage: 9200,
      color: 'Iridium Silver',
      transmission: 'Automatic',
      salePrice: 52900,
      description: 'Premium luxury SUV with MBUX infotainment, Burmester sound, and advanced driver assistance.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Volvo',
      model: 'XC60 T6 Inscription',
      year: 2022,
      vin: 'YV4A22PL7N2223008',
      mileage: 15600,
      color: 'Thunder Gray',
      transmission: 'Automatic',
      salePrice: 48500,
      description: 'Swedish luxury SUV with Bowers & Wilkins audio, leather interior, and comprehensive safety suite.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Acura',
      model: 'RDX A-Spec',
      year: 2023,
      vin: '5J8TC2H79PL223009',
      mileage: 11400,
      color: 'Apex Blue Pearl',
      transmission: 'Automatic',
      salePrice: 42900,
      description: 'Sport luxury SUV with SH-AWD, ELS Studio 3D audio, and AcuraWatch safety technology.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer2.id,
      make: 'Infiniti',
      model: 'QX50 Sensory',
      year: 2022,
      vin: '3PCAJ5M31NF223010',
      mileage: 18900,
      color: 'Graphite Shadow',
      transmission: 'Automatic',
      salePrice: 41500,
      description: 'Luxury compact SUV with variable compression turbo engine, semi-aniline leather, and Bose audio.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
      ]),
      latitude: 33.9526,
      longitude: -84.5499,
      city: 'Marietta',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  // DEALER 3 - Prestige Auto Sales (10 cars)
  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Ford',
      model: 'F-150 Lariat',
      year: 2022,
      vin: '1FTFW1E85NFA33001',
      mileage: 24500,
      color: 'Rapid Red Metallic',
      transmission: 'Automatic',
      salePrice: 47900,
      description: 'SuperCrew 4x4 with 3.5L EcoBoost, leather seats, panoramic sunroof, and Pro Trailer Backup Assist.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Chevrolet',
      model: 'Silverado 1500 High Country',
      year: 2023,
      vin: '1GCUYGEL3PF333002',
      mileage: 13200,
      color: 'Black',
      transmission: 'Automatic',
      salePrice: 58900,
      description: 'Crew Cab 4WD with 6.2L V8, leather interior, Bose audio, and advanced safety technology.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Ram',
      model: '1500 Laramie',
      year: 2022,
      vin: '1C6SRFFT6NN333003',
      mileage: 19800,
      color: 'Granite Crystal',
      transmission: 'Automatic',
      salePrice: 49500,
      description: 'Quad Cab 4x4 with 5.7L HEMI, leather seats, 12-inch touchscreen, and air suspension.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'GMC',
      model: 'Sierra 1500 Denali',
      year: 2023,
      vin: '1GTU9EED3PZ333004',
      mileage: 10500,
      color: 'Onyx Black',
      transmission: 'Automatic',
      salePrice: 62900,
      description: 'Crew Cab 4WD with MultiPro tailgate, leather interior, Bose audio, and head-up display.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Toyota',
      model: 'Tacoma TRD Pro',
      year: 2023,
      vin: '3TYCZ5AN2PT333005',
      mileage: 8700,
      color: 'Solar Octane',
      transmission: 'Automatic',
      salePrice: 51900,
      description: 'Double Cab 4x4 with Fox shocks, crawl control, premium JBL audio, and TRD Pro skid plate.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Jeep',
      model: 'Wrangler Rubicon 4xe',
      year: 2023,
      vin: '1C4JJXFN0PW333006',
      mileage: 6200,
      color: 'Hydro Blue',
      transmission: 'Automatic',
      salePrice: 58500,
      description: 'Plug-in hybrid 4-door 4x4 with removable top, Dana 44 axles, and advanced off-road capability.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Ford',
      model: 'Bronco Badlands',
      year: 2022,
      vin: '1FMDE5BH9NLA333007',
      mileage: 14500,
      color: 'Cactus Gray',
      transmission: 'Automatic',
      salePrice: 49900,
      description: '4-door 4x4 with Sasquatch package, HOSS suspension, and advanced trail mapping.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Chevrolet',
      model: 'Colorado ZR2',
      year: 2023,
      vin: '1GCGTCEN8P1333008',
      mileage: 9800,
      color: 'Sterling Gray Metallic',
      transmission: 'Automatic',
      salePrice: 47500,
      description: 'Crew Cab 4WD with Multimatic DSSV dampers, front and rear locking differentials.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Toyota',
      model: 'Tundra TRD Pro',
      year: 2023,
      vin: '5TFDY5F18PX333009',
      mileage: 7400,
      color: 'Lunar Rock',
      transmission: 'Automatic',
      salePrice: 64900,
      description: 'CrewMax 4x4 with hybrid powertrain, Fox shocks, and premium JBL audio system.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer3.id,
      make: 'Nissan',
      model: 'Frontier Pro-4X',
      year: 2022,
      vin: '1N6ED1EJ3NN333010',
      mileage: 16200,
      color: 'Boulder Gray Pearl',
      transmission: 'Automatic',
      salePrice: 38900,
      description: 'Crew Cab 4x4 with Bilstein shocks, electronic locking rear differential, and hill descent control.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800'
      ]),
      latitude: 33.7748,
      longitude: -84.2963,
      city: 'Decatur',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  // DEALER 4 - AutoMax Dealership (10 cars)
  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Porsche',
      model: 'Macan S',
      year: 2023,
      vin: 'WP1AB2A59PKA44001',
      mileage: 5200,
      color: 'Volcano Grey Metallic',
      transmission: 'Automatic',
      salePrice: 68900,
      description: 'Luxury performance SUV with Sport Chrono package, premium leather, and Bose Surround Sound.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'BMW',
      model: 'X5 M50i',
      year: 2023,
      vin: '5UXCR6C03P9K44002',
      mileage: 6800,
      color: 'Phytonic Blue',
      transmission: 'Automatic',
      salePrice: 82500,
      description: 'High-performance luxury SUV with M Sport package, Harman Kardon audio, and Executive Drive Pro.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Mercedes-Benz',
      model: 'GLE 450 4MATIC',
      year: 2023,
      vin: '4JGFB4KB9PA44003',
      mileage: 7500,
      color: 'Selenite Grey',
      transmission: 'Automatic',
      salePrice: 75900,
      description: 'Luxury midsize SUV with AMG Line, Burmester 3D sound, and Advanced Driver Assistance.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Audi',
      model: 'Q7 Prestige',
      year: 2022,
      vin: 'WA1LHBF79ND44004',
      mileage: 18200,
      color: 'Daytona Gray Pearl',
      transmission: 'Automatic',
      salePrice: 64900,
      description: '3-row luxury SUV with virtual cockpit, Bang & Olufsen audio, and driver assistance package.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Cadillac',
      model: 'Escalade Premium Luxury',
      year: 2023,
      vin: '1GYS4FKL6PR44005',
      mileage: 9400,
      color: 'Black Raven',
      transmission: 'Automatic',
      salePrice: 89900,
      description: 'Full-size luxury SUV with 38-inch curved OLED display, AKG Studio audio, and Super Cruise.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Lincoln',
      model: 'Navigator Reserve',
      year: 2022,
      vin: '5LMJJ3LT3NEL44006',
      mileage: 21500,
      color: 'Pristine White',
      transmission: 'Automatic',
      salePrice: 74900,
      description: 'Luxury full-size SUV with Revel Ultima audio, Perfect Position seats, and Monochromatic package.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Land Rover',
      model: 'Range Rover Sport HSE',
      year: 2023,
      vin: 'SALWS2SE6PA44007',
      mileage: 8100,
      color: 'Santorini Black',
      transmission: 'Automatic',
      salePrice: 92900,
      description: 'British luxury SUV with Meridian Signature audio, air suspension, and Terrain Response 2.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Maserati',
      model: 'Levante GT',
      year: 2022,
      vin: 'ZN661XUA6NX44008',
      mileage: 12800,
      color: 'Blu Emozione',
      transmission: 'Automatic',
      salePrice: 79900,
      description: 'Italian luxury SUV with premium leather, Harman Kardon audio, and sport-tuned suspension.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Alfa Romeo',
      model: 'Stelvio Ti Sport',
      year: 2023,
      vin: 'ZASPAKBN8P7C44009',
      mileage: 6900,
      color: 'Vesuvio Gray',
      transmission: 'Automatic',
      salePrice: 54900,
      description: 'Italian performance SUV with sport-tuned suspension, Harman Kardon audio, and driver modes.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer4.id,
      make: 'Genesis',
      model: 'GV80 3.5T Prestige',
      year: 2023,
      vin: 'KMUHB8DB5PU44010',
      mileage: 5600,
      color: 'Uyuni White',
      transmission: 'Automatic',
      salePrice: 69900,
      description: 'Korean luxury SUV with Nappa leather, Bang & Olufsen audio, and Genesis Connected Services.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8651,
      longitude: -84.2857,
      city: 'Brookhaven',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  // DEALER 5 - Superior Automotive (10 cars)
  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Hyundai',
      model: 'Sonata SEL Plus',
      year: 2023,
      vin: '5NPE34AF5PH555001',
      mileage: 11200,
      color: 'Hampton Gray',
      transmission: 'Automatic',
      salePrice: 28900,
      description: 'Midsize sedan with panoramic sunroof, wireless charging, and Hyundai SmartSense safety.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Kia',
      model: 'K5 GT-Line',
      year: 2023,
      vin: '5XXG84J20PG555002',
      mileage: 9800,
      color: 'Wolf Gray',
      transmission: 'Automatic',
      salePrice: 31500,
      description: 'Sport sedan with dual-screen display, Bose audio, and Highway Driving Assist.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Nissan',
      model: 'Altima SR',
      year: 2022,
      vin: '1N4BL4FV8NC555003',
      mileage: 22400,
      color: 'Deep Blue Pearl',
      transmission: 'Automatic',
      salePrice: 26500,
      description: 'Stylish midsize sedan with sport suspension, Bose audio, and ProPILOT Assist.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Volkswagen',
      model: 'Passat SEL',
      year: 2021,
      vin: '1VWCA7A32MC555004',
      mileage: 31500,
      color: 'Pure White',
      transmission: 'Automatic',
      salePrice: 24900,
      description: 'Comfortable midsize sedan with leather interior, Fender audio, and adaptive cruise control.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Subaru',
      model: 'Legacy Limited',
      year: 2023,
      vin: '4S3BWAN67P3555005',
      mileage: 8400,
      color: 'Magnetite Gray Metallic',
      transmission: 'Automatic',
      salePrice: 32900,
      description: 'All-wheel drive sedan with Harman Kardon audio, leather seats, and EyeSight safety.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Hyundai',
      model: 'Tucson Limited',
      year: 2023,
      vin: '5NMJE3AE0PH555006',
      mileage: 7900,
      color: 'Amazon Gray',
      transmission: 'Automatic',
      salePrice: 35500,
      description: 'Compact SUV with dual panoramic sunroofs, Bose audio, and Highway Driving Assist II.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Kia',
      model: 'Sportage SX-Prestige',
      year: 2023,
      vin: 'KNDPM3ACXP7555007',
      mileage: 10200,
      color: 'Dawning Red',
      transmission: 'Automatic',
      salePrice: 37900,
      description: 'Premium compact SUV with Nappa leather, Harman Kardon audio, and panoramic sunroof.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f1f3e?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Subaru',
      model: 'Outback Touring XT',
      year: 2023,
      vin: '4S4BTGND7P3555008',
      mileage: 12600,
      color: 'Autumn Green Metallic',
      transmission: 'Automatic',
      salePrice: 39900,
      description: 'Turbocharged adventure wagon with Harman Kardon audio, Nappa leather, and EyeSight X.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Volkswagen',
      model: 'Atlas SEL Premium',
      year: 2022,
      vin: '1V2GR2CA9NC555009',
      mileage: 19800,
      color: 'Tourmaline Blue',
      transmission: 'Automatic',
      salePrice: 41500,
      description: '3-row midsize SUV with Fender audio, panoramic sunroof, and adaptive cruise control.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  cars.push(await prisma.car.create({
    data: {
      dealerId: dealer5.id,
      make: 'Mazda',
      model: 'CX-9 Signature',
      year: 2022,
      vin: 'JM3TCBEY9N0555010',
      mileage: 24200,
      color: 'Machine Gray Metallic',
      transmission: 'Automatic',
      salePrice: 42900,
      description: '3-row luxury SUV with Nappa leather, Bose audio, and i-ACTIVSENSE safety technology.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      ]),
      latitude: 33.8081,
      longitude: -84.1700,
      city: 'Stone Mountain',
      state: 'GA',
      listingFeePaid: true,
    },
  }));

  console.log('');
  console.log('Database seeded successfully with production-ready demo data');
  console.log('');
  console.log('DEALER ACCOUNTS:');
  console.log('  Atlanta Premium Motors - dealer1@iqautodeals.com | Password: dealer123');
  console.log('  Elite Auto Group       - dealer2@iqautodeals.com | Password: dealer123');
  console.log('  Prestige Auto Sales    - dealer3@iqautodeals.com | Password: dealer123');
  console.log('  AutoMax Dealership     - dealer4@iqautodeals.com | Password: dealer123');
  console.log('  Superior Automotive    - dealer5@iqautodeals.com | Password: dealer123');
  console.log('');
  console.log('CUSTOMER ACCOUNTS:');
  console.log('  James Wilson  - customer1@iqautodeals.com | Password: customer123');
  console.log('  Maria Garcia  - customer2@iqautodeals.com | Password: customer123');
  console.log('');
  console.log('INVENTORY:');
  console.log('  Total Dealers: 5');
  console.log('  Total Cars: 50 (10 per dealer)');
  console.log('  Total Customers: 2');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
