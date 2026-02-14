const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const cars = await prisma.car.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      make: true,
      model: true,
      year: true,
      description: true,
      seoDescriptionGenerated: true,
      dealer: { select: { businessName: true, id: true } }
    }
  });

  const dealers = {};
  for (const car of cars) {
    const dealerName = car.dealer.businessName || 'Unknown';
    if (!dealers[dealerName]) {
      dealers[dealerName] = { total: 0, newFormat: 0, oldBold: 0, plain: 0, noSeo: 0 };
    }
    dealers[dealerName].total++;

    if (!car.description || car.description.trim() === '') {
      dealers[dealerName].noSeo++;
    } else if (car.description.includes('## ')) {
      dealers[dealerName].newFormat++;
    } else if (/\*\*[^*]+\?\*\*/.test(car.description)) {
      dealers[dealerName].oldBold++;
    } else {
      dealers[dealerName].plain++;
    }
  }

  console.log('=== Description Format by Dealer ===\n');
  for (const [name, stats] of Object.entries(dealers).sort((a, b) => b[1].total - a[1].total)) {
    console.log(`${name} (${stats.total} vehicles):`);
    console.log(`  New ## format: ${stats.newFormat}`);
    console.log(`  Old **bold** format: ${stats.oldBold}`);
    console.log(`  Plain (no Q&A): ${stats.plain}`);
    console.log(`  No description: ${stats.noSeo}\n`);
  }

  const totals = Object.values(dealers).reduce((acc, s) => ({
    total: acc.total + s.total,
    newFormat: acc.newFormat + s.newFormat,
    oldBold: acc.oldBold + s.oldBold,
    plain: acc.plain + s.plain,
    noSeo: acc.noSeo + s.noSeo,
  }), { total: 0, newFormat: 0, oldBold: 0, plain: 0, noSeo: 0 });

  console.log('=== TOTALS ===');
  console.log(`Total vehicles: ${totals.total}`);
  console.log(`New ## format: ${totals.newFormat}`);
  console.log(`Old **bold** format: ${totals.oldBold}`);
  console.log(`Plain (no Q&A): ${totals.plain}`);
  console.log(`No description: ${totals.noSeo}`);

  await prisma.$disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
