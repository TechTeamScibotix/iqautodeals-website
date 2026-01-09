const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting cleanup for @iqautodeals.com accounts...\n');

  // Get all iqautodeals.com users
  const iqUsers = await prisma.user.findMany({
    where: {
      email: { endsWith: '@iqautodeals.com' }
    },
    select: {
      id: true,
      email: true,
      userType: true,
    }
  });

  console.log('Found', iqUsers.length, '@iqautodeals.com users:');
  iqUsers.forEach(u => console.log('  -', u.email, '(' + u.userType + ')'));

  const customerIds = iqUsers.filter(u => u.userType === 'customer').map(u => u.id);
  const dealerIds = iqUsers.filter(u => u.userType === 'dealer').map(u => u.id);

  console.log('\nCustomers:', customerIds.length);
  console.log('Dealers:', dealerIds.length);

  // Get all deal lists for these customers
  const dealLists = await prisma.dealList.findMany({
    where: { customerId: { in: customerIds } },
    include: {
      selectedCars: {
        include: {
          negotiations: true,
        }
      }
    }
  });

  console.log('\nDeal Lists to delete:', dealLists.length);

  // Get selected car IDs
  const selectedCarIds = dealLists.flatMap(dl => dl.selectedCars.map(sc => sc.id));
  console.log('Selected Cars to delete:', selectedCarIds.length);

  // Get car IDs that have accepted deals from these customers
  const acceptedDeals = await prisma.acceptedDeal.findMany({
    where: { customerId: { in: customerIds } },
    select: { id: true, carId: true }
  });
  console.log('Accepted Deals to delete:', acceptedDeals.length);

  // Get test drives
  const testDrives = await prisma.testDrive.findMany({
    where: { customerId: { in: customerIds } },
    select: { id: true }
  });
  console.log('Test Drives to delete:', testDrives.length);

  // Get availability requests
  const availabilityRequests = await prisma.availabilityRequest.findMany({
    where: {
      OR: [
        { email: { endsWith: '@iqautodeals.com' } },
        { carId: { in: (await prisma.car.findMany({ where: { dealerId: { in: dealerIds } }, select: { id: true } })).map(c => c.id) } }
      ]
    },
    select: { id: true }
  });
  console.log('Availability Requests to delete:', availabilityRequests.length);

  // Count cars (NOT deleting these)
  const dealerCars = await prisma.car.count({
    where: { dealerId: { in: dealerIds } }
  });
  console.log('\nDealer Cars (KEEPING):', dealerCars);

  console.log('\n--- DELETING DATA ---\n');

  // Delete in correct order due to foreign key constraints

  // 1. Delete Test Drives
  const deletedTestDrives = await prisma.testDrive.deleteMany({
    where: { customerId: { in: customerIds } }
  });
  console.log('Deleted Test Drives:', deletedTestDrives.count);

  // 2. Delete Accepted Deals
  const deletedAcceptedDeals = await prisma.acceptedDeal.deleteMany({
    where: { customerId: { in: customerIds } }
  });
  console.log('Deleted Accepted Deals:', deletedAcceptedDeals.count);

  // 3. Delete Negotiations
  const deletedNegotiations = await prisma.negotiation.deleteMany({
    where: { selectedCarId: { in: selectedCarIds } }
  });
  console.log('Deleted Negotiations:', deletedNegotiations.count);

  // 4. Delete Selected Cars
  const deletedSelectedCars = await prisma.selectedCar.deleteMany({
    where: { id: { in: selectedCarIds } }
  });
  console.log('Deleted Selected Cars:', deletedSelectedCars.count);

  // 5. Delete Deal Lists
  const deletedDealLists = await prisma.dealList.deleteMany({
    where: { customerId: { in: customerIds } }
  });
  console.log('Deleted Deal Lists:', deletedDealLists.count);

  // 6. Delete Availability Requests from iqautodeals emails or to iqautodeals dealer cars
  const deletedAvailabilityRequests = await prisma.availabilityRequest.deleteMany({
    where: { id: { in: availabilityRequests.map(a => a.id) } }
  });
  console.log('Deleted Availability Requests:', deletedAvailabilityRequests.count);

  // Verify cars are still there
  const remainingCars = await prisma.car.count({
    where: { dealerId: { in: dealerIds } }
  });
  console.log('\nDealer Cars remaining:', remainingCars);

  console.log('\n--- CLEANUP COMPLETE ---');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
