const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.user.findUnique({
    where: { email: 'customer1@iqautodeals.com' }
  });

  if (!customer) {
    console.log('Customer not found');
    return;
  }

  console.log('Customer:', customer.name, '(' + customer.email + ')');
  console.log('Customer ID:', customer.id);
  console.log('---');

  const dealLists = await prisma.dealList.findMany({
    where: { customerId: customer.id },
    include: {
      selectedCars: {
        where: { status: { not: 'cancelled' } },
        include: {
          car: {
            select: { year: true, make: true, model: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log('Total Deal Lists:', dealLists.length);

  for (const deal of dealLists) {
    console.log('\nDeal ID:', deal.id);
    console.log('Status:', deal.status);
    console.log('Created:', deal.createdAt);
    console.log('Active Cars:', deal.selectedCars.length);
    for (const sc of deal.selectedCars) {
      console.log('  -', sc.car.year, sc.car.make, sc.car.model, '| Status:', sc.status);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
