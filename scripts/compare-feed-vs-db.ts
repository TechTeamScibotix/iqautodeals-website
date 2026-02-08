import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import SftpClient from 'ssh2-sftp-client';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cool Springs dealer ID
  const dealerId = 'b81b150f-9957-478a-a0c1-3984cfbec216';

  // Get cars from database
  const dbCars = await prisma.car.findMany({
    where: { dealerId, status: 'active' },
    select: {
      vin: true,
      year: true,
      make: true,
      model: true,
      salePrice: true,
      condition: true,
    },
  });

  console.log('=== Database vs Feed Price Comparison ===\n');
  console.log('Cars in database (active):', dbCars.length);

  // Connect to SFTP and get feed data
  const sftp = new SftpClient();
  await sftp.connect({
    host: '137.184.82.172',
    port: 22,
    username: process.env.LEXUS_SFTP_USERNAME!,
    password: process.env.LEXUS_SFTP_PASSWORD!,
    algorithms: {
      kex: ['ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'ecdh-sha2-nistp521', 'diffie-hellman-group-exchange-sha256', 'diffie-hellman-group14-sha256'] as any,
      serverHostKey: ['ssh-ed25519', 'ecdsa-sha2-nistp256', 'rsa-sha2-512', 'rsa-sha2-256'] as any,
    },
  });

  const buf = await sftp.get('/home/lexus_MP12861/uploads/lexus_MP12861_inventory.csv');
  const feedVehicles = parse(buf.toString(), { columns: true, skip_empty_lines: true, trim: true });
  await sftp.end();

  console.log('Cars in feed:', feedVehicles.length);
  console.log('');

  // Create a map of feed data by VIN
  const feedMap = new Map<string, any>();
  feedVehicles.forEach((v: any) => {
    feedMap.set(v.VIN, v);
  });

  // Compare DB vs Feed
  console.log('--- Price Comparison (first 20 vehicles) ---');
  console.log('VIN | Year Make Model | Condition | DB Price | Feed Price | Feed MSRP | Match?');
  console.log('-'.repeat(120));

  let mismatchCount = 0;
  let zeroInDb = 0;

  dbCars.slice(0, 20).forEach((dbCar) => {
    const feedCar = feedMap.get(dbCar.vin);
    if (feedCar) {
      const feedPrice = parseFloat(feedCar.Price) || 0;
      const feedMsrp = parseFloat(feedCar.MSRP) || 0;
      const isNew = (feedCar['New/Used'] || '').toLowerCase().trim() === 'n';
      const expectedPrice = isNew && feedMsrp > 0 ? feedMsrp : feedPrice;
      const dbPrice = dbCar.salePrice || 0;
      const match = Math.abs(dbPrice - expectedPrice) < 1 ? '✓' : '✗ MISMATCH';

      if (Math.abs(dbPrice - expectedPrice) >= 1) mismatchCount++;
      if (dbPrice === 0) zeroInDb++;

      console.log(`${dbCar.vin} | ${dbCar.year} ${dbCar.make} ${dbCar.model} | ${dbCar.condition || 'N/A'} | $${dbPrice.toLocaleString()} | $${feedPrice.toLocaleString()} | $${feedMsrp.toLocaleString()} | ${match}`);
    }
  });

  console.log('');
  console.log('--- Summary ---');

  // Count all mismatches
  let totalMismatch = 0;
  let totalZeroInDb = 0;

  dbCars.forEach((dbCar) => {
    const feedCar = feedMap.get(dbCar.vin);
    if (feedCar) {
      const feedPrice = parseFloat(feedCar.Price) || 0;
      const feedMsrp = parseFloat(feedCar.MSRP) || 0;
      const isNew = (feedCar['New/Used'] || '').toLowerCase().trim() === 'n';
      const expectedPrice = isNew && feedMsrp > 0 ? feedMsrp : feedPrice;
      const dbPrice = dbCar.salePrice || 0;

      if (Math.abs(dbPrice - expectedPrice) >= 1) totalMismatch++;
      if (dbPrice === 0) totalZeroInDb++;
    }
  });

  console.log('Total vehicles with $0 in database:', totalZeroInDb);
  console.log('Total price mismatches:', totalMismatch);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
