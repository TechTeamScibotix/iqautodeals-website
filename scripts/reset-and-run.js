const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  // Reset Ipag autos only first as test
  const result = await prisma.car.updateMany({
    where: { dealerId: '986d40dd-f956-491f-8c07-aa36d6c20f1b', status: 'active' },
    data: { seoDescriptionGenerated: false },
  });
  console.log('Reset ' + result.count + ' Ipag vehicles');
  await prisma.$disconnect();
}

reset().catch(e => { console.error(e); process.exit(1); });
