const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Total users
    const totalUsers = await prisma.user.count();

    // Breakdown by user type
    const customers = await prisma.user.count({
      where: { userType: 'customer' }
    });

    const dealers = await prisma.user.count({
      where: { userType: 'dealer' }
    });

    // Recent users (last 5)
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        name: true,
        email: true,
        userType: true,
        createdAt: true,
        businessName: true,
        city: true,
        state: true
      }
    });

    // Count cars
    const totalCars = await prisma.car.count();
    const activeCars = await prisma.car.count({
      where: { status: 'active' }
    });

    console.log('\n=== IQAUTODEALS.COM Statistics ===\n');
    console.log(`Total Registered Users: ${totalUsers}`);
    console.log(`  - Customers: ${customers}`);
    console.log(`  - Dealers: ${dealers}`);
    console.log(`\nTotal Cars Listed: ${totalCars}`);
    console.log(`  - Active Listings: ${activeCars}`);

    console.log('\n=== Recent Registrations ===\n');
    recentUsers.forEach((user, index) => {
      const date = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      if (user.userType === 'dealer') {
        console.log(`${index + 1}. ${user.name} (${user.businessName || 'N/A'})`);
        console.log(`   Type: Dealer | Location: ${user.city || 'N/A'}, ${user.state || 'N/A'}`);
        console.log(`   Registered: ${date}`);
      } else {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Type: Customer`);
        console.log(`   Registered: ${date}`);
      }
      console.log('');
    });

    console.log('======================================\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
