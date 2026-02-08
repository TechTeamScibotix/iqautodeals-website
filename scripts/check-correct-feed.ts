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

  // List what feed files exist
  console.log('=== Checking Available Feed Files ===\n');

  try {
    const homeList = await sftp.list('/home');
    console.log('Feed directories in /home:');
    homeList.forEach((item: any) => {
      if (item.type === 'd') {
        console.log(`  ${item.name}/`);
      }
    });
  } catch (e: any) {
    console.log('Could not list /home:', e.message);
  }

  // Try MP12861
  console.log('\n--- Checking lexus_MP12861 ---');
  try {
    const buf1 = await sftp.get('/home/lexus_MP12861/uploads/lexus_MP12861_inventory.csv');
    const vehicles1 = parse(buf1.toString(), { columns: true, skip_empty_lines: true, trim: true });
    console.log('MP12861 vehicles:', vehicles1.length);
  } catch (e: any) {
    console.log('MP12861 error:', e.message);
  }

  // Try MP12862
  console.log('\n--- Checking lexus_MP12862 ---');
  try {
    const buf2 = await sftp.get('/home/lexus_MP12862/uploads/lexus_MP12862_inventory.csv');
    const vehicles2 = parse(buf2.toString(), { columns: true, skip_empty_lines: true, trim: true });
    console.log('MP12862 vehicles:', vehicles2.length);

    // Check prices in MP12862
    const withPrice = vehicles2.filter((v: any) => (parseFloat(v.Price) || 0) > 0);
    const withMsrp = vehicles2.filter((v: any) => (parseFloat(v.MSRP) || 0) > 0);
    console.log('With Price > 0:', withPrice.length);
    console.log('With MSRP > 0:', withMsrp.length);

    console.log('\nSample vehicles:');
    vehicles2.slice(0, 5).forEach((v: any) => {
      const price = parseFloat(v.Price) || 0;
      const msrp = parseFloat(v.MSRP) || 0;
      console.log(`  ${v.VIN} | ${v.Year} ${v.Make} ${v.Model} | ${v['New/Used']} | Price: $${price.toLocaleString()} | MSRP: $${msrp.toLocaleString()}`);
    });
  } catch (e: any) {
    console.log('MP12862 error:', e.message);
  }

  await sftp.end();
}

main().catch(e => { console.error(e); process.exit(1); });
