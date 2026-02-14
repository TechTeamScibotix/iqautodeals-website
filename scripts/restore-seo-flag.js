const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function restore() {
  const dealerIds = [
    'b81b150f-9957-478a-a0c1-3984cfbec216', // Lexus of Cool Springs
    'e362433a-bfb0-49d4-80d0-d3361fd893a2', // Lexus of Nashville
    '986d40dd-f956-491f-8c07-aa36d6c20f1b', // Ipag autos
  ];

  for (const dealerId of dealerIds) {
    const result = await prisma.car.updateMany({
      where: { dealerId, status: 'active', seoDescriptionGenerated: false },
      data: { seoDescriptionGenerated: true },
    });
    console.log('Restored ' + result.count + ' vehicles for dealer ' + dealerId);
  }

  await prisma.$disconnect();
}

restore().catch(e => { console.error(e); process.exit(1); });
