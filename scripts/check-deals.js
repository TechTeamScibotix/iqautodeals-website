const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const selectedCars = await prisma.selectedCar.findMany({
    where: { status: { not: 'cancelled' } },
    include: {
      car: {
        include: {
          dealer: { select: { id: true, email: true, businessName: true } }
        }
      },
      dealList: {
        include: {
          customer: { select: { name: true, email: true } }
        }
      }
    }
  });

  console.log('Active selected cars:', selectedCars.length);

  const byDealer = {};
  selectedCars.forEach(sc => {
    const dealerId = sc.car.dealer?.id;
    if (!byDealer[dealerId]) {
      byDealer[dealerId] = {
        email: sc.car.dealer?.email,
        name: sc.car.dealer?.businessName,
        requests: []
      };
    }
    byDealer[dealerId].requests.push({
      customer: sc.dealList.customer?.name,
      car: sc.car.year + ' ' + sc.car.make + ' ' + sc.car.model
    });
  });

  console.log('\nDealers with deal requests:');
  Object.entries(byDealer).forEach(([id, data]) => {
    console.log('---');
    console.log('Dealer:', data.name, '(' + data.email + ')');
    console.log('Requests:', data.requests.length);
    data.requests.forEach(r => console.log('  -', r.customer, '|', r.car));
  });

  await prisma.$disconnect();
}
main().catch(console.error);
