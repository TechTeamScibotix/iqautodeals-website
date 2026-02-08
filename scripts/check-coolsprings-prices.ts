import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import SftpClient from 'ssh2-sftp-client';
import { parse } from 'csv-parse/sync';

async function main() {
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
  const vehicles = parse(buf.toString(), { columns: true, skip_empty_lines: true, trim: true });

  console.log('=== Cool Springs (Lexus) Inventory Feed - Price Analysis ===\n');
  console.log('Total vehicles in CSV:', vehicles.length);
  console.log('');

  // Check Price and MSRP columns
  const withPrice = vehicles.filter((v: any) => {
    const price = parseFloat(v.Price) || 0;
    return price > 0;
  });
  const withMsrp = vehicles.filter((v: any) => {
    const msrp = parseFloat(v.MSRP) || 0;
    return msrp > 0;
  });
  const noPrice = vehicles.filter((v: any) => {
    const price = parseFloat(v.Price) || 0;
    const msrp = parseFloat(v.MSRP) || 0;
    return price === 0 && msrp === 0;
  });

  console.log('Vehicles with Price > 0:', withPrice.length);
  console.log('Vehicles with MSRP > 0:', withMsrp.length);
  console.log('Vehicles with NO price at all:', noPrice.length);
  console.log('');

  // Show breakdown by New/Used
  const newVehicles = vehicles.filter((v: any) => {
    const nu = (v['New/Used'] || '').toLowerCase().trim();
    return nu === 'n' || nu === 'new';
  });
  const usedVehicles = vehicles.filter((v: any) => {
    const nu = (v['New/Used'] || '').toLowerCase().trim();
    return nu === 'u' || nu === 'used';
  });

  console.log('--- Breakdown by Condition ---');
  console.log('NEW vehicles:', newVehicles.length);
  console.log('USED vehicles:', usedVehicles.length);
  console.log('');

  // Check NEW vehicles pricing
  const newWithMsrp = newVehicles.filter((v: any) => (parseFloat(v.MSRP) || 0) > 0);
  const newWithPrice = newVehicles.filter((v: any) => (parseFloat(v.Price) || 0) > 0);
  console.log('NEW with MSRP:', newWithMsrp.length);
  console.log('NEW with Price:', newWithPrice.length);

  // Check USED vehicles pricing
  const usedWithPrice = usedVehicles.filter((v: any) => (parseFloat(v.Price) || 0) > 0);
  const usedWithMsrp = usedVehicles.filter((v: any) => (parseFloat(v.MSRP) || 0) > 0);
  console.log('USED with Price:', usedWithPrice.length);
  console.log('USED with MSRP:', usedWithMsrp.length);
  console.log('');

  // Show sample vehicles
  console.log('--- Sample Vehicles (first 5) ---');
  vehicles.slice(0, 5).forEach((v: any) => {
    const price = parseFloat(v.Price) || 0;
    const msrp = parseFloat(v.MSRP) || 0;
    console.log(`  ${v.VIN} | ${v.Year} ${v.Make} ${v.Model} | ${v['New/Used']} | Price: $${price.toLocaleString()} | MSRP: $${msrp.toLocaleString()}`);
  });

  // Show vehicles with no pricing
  if (noPrice.length > 0) {
    console.log('');
    console.log('--- Vehicles with NO PRICING ---');
    noPrice.forEach((v: any) => {
      console.log(`  ${v.VIN} | ${v.Year} ${v.Make} ${v.Model} | ${v['New/Used']}`);
    });
  }

  await sftp.end();
}

main().catch(e => { console.error(e); process.exit(1); });
