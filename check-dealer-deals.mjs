import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const dealerId = '5fbf911c-691d-4ca6-87ae-63632ed60ebe';
  
  console.log('Dealer: Interstate Motors LLC (hemrekocc@gmail.com)');
  console.log('Dealer ID:', dealerId);
  
  // Check their cars
  const cars = await prisma.car.findMany({
    where: { dealerId },
    select: { id: true, make: true, model: true, year: true, status: true }
  });
  console.log('\nCars:', cars.length);
  cars.forEach(c => console.log('  -', c.id, c.year, c.make, c.model, '(' + c.status + ')'));
  
  // Check deal lists that include this dealer's cars
  const carIds = cars.map(c => c.id);
  
  const selectedCars = await prisma.selectedCar.findMany({
    where: { carId: { in: carIds } },
    include: {
      car: { select: { make: true, model: true, year: true } },
      dealList: { 
        include: { 
          customer: { select: { email: true, name: true } } 
        } 
      }
    }
  });
  console.log('\nSelectedCars (customers who selected this dealer\'s cars):', selectedCars.length);
  selectedCars.forEach(sc => {
    console.log('  - Car:', sc.car?.year, sc.car?.make, sc.car?.model);
    console.log('    DealList ID:', sc.dealList?.id);
    console.log('    DealList Status:', sc.dealList?.status);
    console.log('    Customer:', sc.dealList?.customer?.email);
    console.log('    Created:', sc.dealList?.createdAt);
    console.log('');
  });
  
  // Check negotiations for this dealer
  const negotiations = await prisma.negotiation.findMany({
    where: { dealerId },
    include: {
      customer: { select: { email: true, name: true } }
    }
  });
  console.log('\nNegotiations:', negotiations.length);
  negotiations.forEach(n => {
    console.log('  - Status:', n.status, '| Customer:', n.customer?.email, '| Created:', n.createdAt);
  });
  
  // Check accepted deals for this dealer's cars
  const acceptedDeals = await prisma.acceptedDeal.findMany({
    where: { carId: { in: carIds } },
    include: {
      car: { select: { make: true, model: true, year: true } },
      customer: { select: { email: true, name: true } }
    }
  });
  console.log('\nAcceptedDeals:', acceptedDeals.length);
  acceptedDeals.forEach(ad => {
    console.log('  - Car:', ad.car?.year, ad.car?.make, ad.car?.model, '| Status:', ad.status, '| Customer:', ad.customer?.email);
  });
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
