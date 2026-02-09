const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const cars = await prisma.car.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      description: true,
      seoDescriptionGenerated: true,
      dealer: { select: { businessName: true, id: true } }
    }
  });

  const dealers = {};
  for (const car of cars) {
    const name = car.dealer.businessName || 'Unknown';
    const did = car.dealer.id;
    if (!dealers[name]) {
      dealers[name] = { id: did, total: 0, seoTrue: 0, seoFalse: 0, hasNewFormat: 0 };
    }
    dealers[name].total++;
    if (car.seoDescriptionGenerated) {
      dealers[name].seoTrue++;
    } else {
      dealers[name].seoFalse++;
    }
    if (car.description && car.description.includes('## ')) {
      dealers[name].hasNewFormat++;
    }
  }

  console.log('=== SEO Status by Dealer ===\n');
  for (const [name, stats] of Object.entries(dealers).sort((a, b) => b[1].total - a[1].total)) {
    console.log(name + ' (ID: ' + stats.id + ')');
    console.log('  Total: ' + stats.total);
    console.log('  seoGenerated=true: ' + stats.seoTrue);
    console.log('  seoGenerated=false: ' + stats.seoFalse + ' (eligible for bulk SEO)');
    console.log('  New ## format: ' + stats.hasNewFormat + '\n');
  }

  await prisma.$disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
