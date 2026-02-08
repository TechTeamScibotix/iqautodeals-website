import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const dealerId = 'b81b150f-9957-478a-a0c1-3984cfbec216';

  const cars = await prisma.car.findMany({
    where: { dealerId, status: 'active' },
    select: {
      vin: true,
      year: true,
      make: true,
      model: true,
      salePrice: true,
      condition: true,
    },
    orderBy: { salePrice: 'desc' },
  });

  console.log('=== Cool Springs Vehicles After Sync ===\n');
  console.log('Total active vehicles:', cars.length);

  const withPrice = cars.filter(c => (c.salePrice || 0) > 0);
  const zeroPrice = cars.filter(c => (c.salePrice || 0) === 0);

  console.log('With price > $0:', withPrice.length);
  console.log('With $0 price:', zeroPrice.length);

  console.log('\n--- NEW Vehicles with MSRP ---');
  const newCars = cars.filter(c => c.condition === 'New');
  newCars.slice(0, 10).forEach(c => {
    console.log(`  ${c.vin} | ${c.year} ${c.make} ${c.model} | $${(c.salePrice || 0).toLocaleString()}`);
  });

  console.log('\n--- USED Vehicles with Price ---');
  const usedCars = cars.filter(c => c.condition === 'Used');
  usedCars.slice(0, 10).forEach(c => {
    console.log(`  ${c.vin} | ${c.year} ${c.make} ${c.model} | $${(c.salePrice || 0).toLocaleString()}`);
  });

  if (zeroPrice.length > 0) {
    console.log('\n--- Vehicles still at $0 ---');
    zeroPrice.forEach(c => {
      console.log(`  ${c.vin} | ${c.year} ${c.make} ${c.model} | ${c.condition}`);
    });
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
