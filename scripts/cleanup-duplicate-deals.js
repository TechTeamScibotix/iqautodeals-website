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

  // Get all deal lists for this customer
  const dealLists = await prisma.dealList.findMany({
    where: { customerId: customer.id },
    include: {
      selectedCars: {
        include: {
          negotiations: true,
          car: {
            include: {
              acceptedDeals: {
                where: { customerId: customer.id }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log('Found', dealLists.length, 'deal lists');

  // Keep the oldest deal (which has the won car), delete the newer active one
  // Or merge them into one

  // For now, let's delete the newer "active" deal that has no accepted offers
  for (const deal of dealLists) {
    const hasAcceptedDeal = deal.selectedCars.some(sc =>
      sc.car.acceptedDeals && sc.car.acceptedDeals.length > 0
    );

    console.log('\nDeal:', deal.id);
    console.log('Status:', deal.status);
    console.log('Created:', deal.createdAt);
    console.log('Has accepted deal:', hasAcceptedDeal);
    console.log('Cars:', deal.selectedCars.length);

    // If this is an active deal with no accepted offers, and there's another deal, delete it
    if (deal.status === 'active' && !hasAcceptedDeal && dealLists.length > 1) {
      console.log('>>> Deleting this duplicate active deal...');

      // Delete negotiations first
      for (const sc of deal.selectedCars) {
        await prisma.negotiation.deleteMany({
          where: { selectedCarId: sc.id }
        });
      }

      // Delete selected cars
      await prisma.selectedCar.deleteMany({
        where: { dealListId: deal.id }
      });

      // Delete deal list
      await prisma.dealList.delete({
        where: { id: deal.id }
      });

      console.log('>>> Deleted!');
    }
  }

  console.log('\nDone!');
  await prisma.$disconnect();
}

main().catch(console.error);
