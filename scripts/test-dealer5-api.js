const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dealerId = 'a5d2c00d-f9be-47c6-8051-c1546c0c56d5'; // dealer5@iqautodeals.com

  console.log('Testing API for dealer5@iqautodeals.com...\n');

  // This is the exact query from /api/dealer/deal-requests
  const dealLists = await prisma.dealList.findMany({
    where: {
      selectedCars: {
        some: {
          car: {
            dealerId,
          },
        },
      },
    },
    include: {
      customer: true,
      selectedCars: {
        include: {
          car: {
            include: {
              dealer: {
                select: {
                  id: true,
                  businessName: true,
                  name: true,
                },
              },
              acceptedDeals: true,
            },
          },
          negotiations: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('Deal lists found:', dealLists.length);

  if (dealLists.length === 0) {
    console.log('\nNo deal lists found! Checking why...\n');

    // Check if dealer has any cars
    const cars = await prisma.car.findMany({
      where: { dealerId },
      select: { id: true, make: true, model: true }
    });
    console.log('Cars owned by dealer5:', cars.length);

    // Check if any of those cars are in selected cars
    const carIds = cars.map(c => c.id);
    const selectedCars = await prisma.selectedCar.findMany({
      where: { carId: { in: carIds } },
      include: { dealList: true }
    });
    console.log('Selected cars from dealer5:', selectedCars.length);

    if (selectedCars.length > 0) {
      console.log('\nSelected cars details:');
      selectedCars.forEach(sc => {
        console.log('  - Car:', sc.carId, '| DealList:', sc.dealListId, '| Status:', sc.status);
      });
    }
  } else {
    dealLists.forEach(dl => {
      console.log('\n---');
      console.log('Deal List ID:', dl.id);
      console.log('Status:', dl.status);
      console.log('Customer:', dl.customer?.name, '-', dl.customer?.email);
      console.log('Selected Cars:', dl.selectedCars.length);
      dl.selectedCars.forEach(sc => {
        console.log('  -', sc.car?.year, sc.car?.make, sc.car?.model);
        console.log('    Status:', sc.status);
        console.log('    Dealer:', sc.car?.dealer?.businessName);
        console.log('    Negotiations:', sc.negotiations?.length || 0);
      });
    });
  }

  await prisma.$disconnect();
}
main().catch(console.error);
