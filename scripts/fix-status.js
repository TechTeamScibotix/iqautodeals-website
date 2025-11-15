const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Update all deal lists with "pending" status to "active"
  const result = await prisma.dealList.updateMany({
    where: {
      status: 'pending',
    },
    data: {
      status: 'active',
    },
  });

  console.log(`Updated ${result.count} deal lists from "pending" to "active"`);

  // Show all deal lists
  const allDealLists = await prisma.dealList.findMany({
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      selectedCars: {
        include: {
          car: {
            select: {
              dealerId: true,
              make: true,
              model: true,
              year: true,
            },
          },
        },
      },
    },
  });

  console.log('\nAll Deal Lists:');
  allDealLists.forEach((dl) => {
    console.log(`\nDeal List ID: ${dl.id}`);
    console.log(`Customer: ${dl.customer.name} (${dl.customer.email})`);
    console.log(`Status: ${dl.status}`);
    console.log(`Cars: ${dl.selectedCars.length}`);
    dl.selectedCars.forEach((sc) => {
      console.log(`  - ${sc.car.year} ${sc.car.make} ${sc.car.model} (Dealer: ${sc.car.dealerId})`);
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
