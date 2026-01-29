const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Recent registrations
  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    },
    select: {
      id: true,
      email: true,
      name: true,
      userType: true,
      phone: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  console.log('\n=== REGISTRATIONS (Last 7 Days) ===');
  users.forEach(u => {
    console.log(`${u.createdAt.toISOString().split('T')[0]} | ${u.userType.padEnd(8)} | ${u.name.padEnd(25)} | ${u.email} | ${u.phone || 'no phone'}`);
  });
  console.log(`Total: ${users.length}\n`);

  // Availability Requests (Check Availability / Test Drive requests)
  try {
    const availReqs = await prisma.availabilityRequest.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
    console.log('=== CHECK AVAILABILITY REQUESTS (Last 30 Days) ===');
    availReqs.forEach(a => {
      console.log(`${a.createdAt.toISOString().split('T')[0]} | ${(a.firstName + ' ' + a.lastName).padEnd(25)} | ${a.email} | ${a.phone} | ${a.zipCode}`);
      console.log(`  Car ID: ${a.carId} | Status: ${a.status}`);
      if (a.comments) console.log(`  Comments: ${a.comments.substring(0, 80)}...`);
    });
    console.log(`Total: ${availReqs.length}\n`);
  } catch (e) {
    console.log('Availability requests error:', e.message);
  }

  // Test Drive bookings
  try {
    const testDrives = await prisma.testDrive.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        dealer: { select: { businessName: true } },
        acceptedDeal: {
          include: {
            car: { select: { make: true, model: true, year: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    console.log('=== TEST DRIVE BOOKINGS (Last 30 Days) ===');
    testDrives.forEach(t => {
      console.log(`${t.createdAt.toISOString().split('T')[0]} | ${t.customer?.name || 'N/A'} | ${t.customer?.email || 'N/A'}`);
      console.log(`  Vehicle: ${t.acceptedDeal?.car?.year} ${t.acceptedDeal?.car?.make} ${t.acceptedDeal?.car?.model}`);
      console.log(`  Dealer: ${t.dealer?.businessName} | Date: ${t.scheduledDate} ${t.scheduledTime} | Status: ${t.status}`);
    });
    console.log(`Total: ${testDrives.length}\n`);
  } catch (e) {
    console.log('Test drives error:', e.message);
  }

  // Deal Lists (customers creating deal requests)
  try {
    const dealLists = await prisma.dealList.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      include: {
        customer: { select: { name: true, email: true } },
        _count: { select: { selectedCars: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    console.log('=== DEAL REQUESTS (Last 30 Days) ===');
    dealLists.forEach(d => {
      console.log(`${d.createdAt.toISOString().split('T')[0]} | ${d.customer?.name || 'N/A'} | ${d.customer?.email || 'N/A'} | Cars: ${d._count.selectedCars} | Status: ${d.status}`);
    });
    console.log(`Total: ${dealLists.length}\n`);
  } catch (e) {
    console.log('Deal lists error:', e.message);
  }

  // Accepted deals
  try {
    const deals = await prisma.acceptedDeal.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
      },
      include: {
        customer: { select: { name: true, email: true } },
        car: { select: { make: true, model: true, year: true, salePrice: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    console.log('=== ACCEPTED DEALS (Last 60 Days) ===');
    deals.forEach(d => {
      console.log(`${d.createdAt.toISOString().split('T')[0]} | ${d.customer?.name || 'N/A'} | ${d.car?.year} ${d.car?.make} ${d.car?.model} | Final: $${d.finalPrice}`);
      console.log(`  Status: ${d.sold ? 'SOLD' : d.deadDeal ? 'DEAD' : 'ACTIVE'} | Showed up: ${d.customerShowedUp ? 'Yes' : 'No'}`);
    });
    console.log(`Total: ${deals.length}\n`);
  } catch (e) {
    console.log('Accepted deals error:', e.message);
  }
}

main().finally(() => prisma.$disconnect());
