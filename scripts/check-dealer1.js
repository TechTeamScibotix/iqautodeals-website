const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const dealerId = '4dc84d2c-efd9-4ed6-90ed-3bf803d7ab9a'; // dealer1

async function main() {
  // This is the same query as the API endpoint
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
        where: {
          status: {
            not: 'cancelled',
          },
        },
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

  console.log(`Found ${dealLists.length} deal lists for dealer1`);
  console.log('\nDetails:');

  dealLists.forEach((dl) => {
    console.log(`\n--- Deal List ${dl.id} ---`);
    console.log(`Customer: ${dl.customer.name}`);
    console.log(`Status: ${dl.status}`);
    console.log(`Total SelectedCars returned: ${dl.selectedCars.length}`);

    const dealer1Cars = dl.selectedCars.filter(sc => sc.car.dealerId === dealerId);
    const competitorCars = dl.selectedCars.filter(sc => sc.car.dealerId !== dealerId);

    console.log(`Dealer1's cars: ${dealer1Cars.length}`);
    dealer1Cars.forEach(sc => {
      console.log(`  - ${sc.car.year} ${sc.car.make} ${sc.car.model} (Status: ${sc.status})`);
    });

    console.log(`Competitor cars: ${competitorCars.length}`);
    competitorCars.forEach(sc => {
      console.log(`  - ${sc.car.year} ${sc.car.make} ${sc.car.model} (Status: ${sc.status}, Dealer: ${sc.car.dealer?.name})`);
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
