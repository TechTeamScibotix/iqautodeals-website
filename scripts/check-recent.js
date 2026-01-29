const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  
  // Registrations
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: twoDaysAgo } },
    select: { email: true, name: true, userType: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log('\n=== REGISTRATIONS (Today + Yesterday) ===');
  users.forEach(u => {
    const date = u.createdAt.toISOString().split('T')[0];
    const time = u.createdAt.toISOString().split('T')[1].substring(0,5);
    console.log(`${date} ${time} | ${u.userType.padEnd(8)} | ${u.name} | ${u.email} | ${u.phone || 'no phone'}`);
  });
  console.log(`Total: ${users.length}\n`);

  // Availability Requests
  const availReqs = await prisma.availabilityRequest.findMany({
    where: { createdAt: { gte: twoDaysAgo } },
    orderBy: { createdAt: 'desc' }
  });
  console.log('=== CHECK AVAILABILITY REQUESTS (Today + Yesterday) ===');
  availReqs.forEach(a => {
    const date = a.createdAt.toISOString().split('T')[0];
    const time = a.createdAt.toISOString().split('T')[1].substring(0,5);
    console.log(`${date} ${time} | ${a.firstName} ${a.lastName} | ${a.email} | ${a.phone} | ZIP: ${a.zipCode}`);
    if (a.comments) console.log(`  Comments: ${a.comments.substring(0, 100)}`);
  });
  console.log(`Total: ${availReqs.length}\n`);

  // Deal Lists
  const dealLists = await prisma.dealList.findMany({
    where: { createdAt: { gte: twoDaysAgo } },
    include: {
      customer: { select: { name: true, email: true } },
      _count: { select: { selectedCars: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log('=== DEAL REQUESTS (Today + Yesterday) ===');
  dealLists.forEach(d => {
    const date = d.createdAt.toISOString().split('T')[0];
    const time = d.createdAt.toISOString().split('T')[1].substring(0,5);
    console.log(`${date} ${time} | ${d.customer?.name} | ${d.customer?.email} | Cars: ${d._count.selectedCars}`);
  });
  console.log(`Total: ${dealLists.length}\n`);

  // Test Drives
  const testDrives = await prisma.testDrive.findMany({
    where: { createdAt: { gte: twoDaysAgo } },
    include: {
      customer: { select: { name: true, email: true } },
      dealer: { select: { businessName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log('=== TEST DRIVE BOOKINGS (Today + Yesterday) ===');
  testDrives.forEach(t => {
    const date = t.createdAt.toISOString().split('T')[0];
    console.log(`${date} | ${t.customer?.name} | ${t.dealer?.businessName} | ${t.scheduledDate} ${t.scheduledTime}`);
  });
  console.log(`Total: ${testDrives.length}\n`);
}

main().finally(() => prisma.$disconnect());
