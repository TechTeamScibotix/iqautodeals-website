import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cool Springs dealer ID
  const dealerId = 'b81b150f-9957-478a-a0c1-3984cfbec216';

  const dealer = await prisma.user.findUnique({
    where: { id: dealerId },
    select: {
      businessName: true,
      lastSyncAt: true,
      lastSyncStatus: true,
      lastSyncMessage: true,
      inventoryFeedType: true,
      dealerSocketFeedId: true,
    },
  });

  console.log('=== Cool Springs Sync Status ===\n');
  console.log('Business Name:', dealer?.businessName);
  console.log('Feed Type:', dealer?.inventoryFeedType);
  console.log('Feed ID:', dealer?.dealerSocketFeedId);
  console.log('Last Sync At:', dealer?.lastSyncAt);
  console.log('Last Sync Status:', dealer?.lastSyncStatus);
  console.log('Last Sync Message:', dealer?.lastSyncMessage);

  // Get all cars with $0 price
  const zeroPriceCars = await prisma.car.findMany({
    where: { dealerId, status: 'active', salePrice: 0 },
    select: {
      vin: true,
      year: true,
      make: true,
      model: true,
      condition: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  console.log('\n--- Cars with $0 Price ---');
  console.log('Total:', zeroPriceCars.length);
  zeroPriceCars.forEach((c) => {
    console.log(`  ${c.vin} | ${c.year} ${c.make} ${c.model} | ${c.condition} | Updated: ${c.updatedAt?.toISOString()}`);
  });

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
