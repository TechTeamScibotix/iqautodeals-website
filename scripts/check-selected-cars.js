const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const dealListId = 'f492d762-b167-4a6c-8463-dab257b1ed34';

  const selectedCars = await prisma.selectedCar.findMany({
    where: {
      dealListId,
    },
    include: {
      car: {
        select: {
          dealerId: true,
          year: true,
          make: true,
          model: true,
        },
      },
    },
  });

  console.log(`Found ${selectedCars.length} selected cars in deal list ${dealListId}\n`);

  selectedCars.forEach((sc) => {
    console.log(`${sc.car.year} ${sc.car.make} ${sc.car.model}`);
    console.log(`  Status: ${sc.status}`);
    console.log(`  Dealer: ${sc.car.dealerId}`);
    console.log('');
  });

  // Fix any that are cancelled but shouldn't be
  const result = await prisma.selectedCar.updateMany({
    where: {
      dealListId,
      status: 'cancelled',
    },
    data: {
      status: 'pending',
    },
  });

  console.log(`\nUpdated ${result.count} selected cars from 'cancelled' to 'pending'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
