const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  const dealerIds = [
    'b81b150f-9957-478a-a0c1-3984cfbec216', // Lexus of Cool Springs (91)
    'e362433a-bfb0-49d4-80d0-d3361fd893a2', // Lexus of Nashville (76)
    '986d40dd-f956-491f-8c07-aa36d6c20f1b', // Ipag autos (5)
  ];

  for (const dealerId of dealerIds) {
    const result = await prisma.car.updateMany({
      where: { dealerId, status: 'active', seoDescriptionGenerated: true },
      data: { seoDescriptionGenerated: false },
    });
    console.log('Reset ' + result.count + ' vehicles for dealer ' + dealerId);
  }

  await prisma.$disconnect();
}

reset().catch(e => { console.error(e); process.exit(1); });
