const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  const dealers = [
    { id: 'b81b150f-9957-478a-a0c1-3984cfbec216', name: 'Lexus of Cool Springs' },
    { id: 'e362433a-bfb0-49d4-80d0-d3361fd893a2', name: 'Lexus of Nashville' },
  ];
  for (const d of dealers) {
    const result = await prisma.car.updateMany({
      where: { dealerId: d.id, status: 'active' },
      data: { seoDescriptionGenerated: false },
    });
    console.log('Reset ' + result.count + ' vehicles for ' + d.name);
  }
  await prisma.$disconnect();
}
reset().catch(e => { console.error(e); process.exit(1); });
