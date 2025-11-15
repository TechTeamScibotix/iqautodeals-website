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

    console.log('\n=== IQAUTODEALS.COM User Statistics ===\n');
    console.log(`Total Registered Users: ${totalUsers}`);
    console.log(`  - Customers: ${customers}`);
    console.log(`  - Dealers: ${dealers}`);
    console.log('\n======================================\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
