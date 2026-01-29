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

  const buf = await sftp.get('uploads/lexus_MP12861_inventory.csv');
  const vehicles = parse(buf.toString(), { columns: true, skip_empty_lines: true, trim: true });

  console.log('Total vehicles in CSV:', vehicles.length);
  console.log('');

  const noPhotos = vehicles.filter((v: any) => {
    const val = v['Photo Url List'] || '';
    return val.trim() === '';
  });
  const hasPhotos = vehicles.filter((v: any) => {
    const val = v['Photo Url List'] || '';
    return val.trim() !== '';
  });

  console.log('With photos:', hasPhotos.length);
  console.log('Without photos:', noPhotos.length);
  console.log('');

  console.log('--- Vehicles missing photos in CSV ---');
  noPhotos.forEach((v: any) => {
    console.log(`  ${v.VIN}  ${v.Year} ${v.Make} ${v.Model}  |  New/Used: ${v['New/Used']}`);
  });

  console.log('');
  console.log('--- Sample vehicle WITH photos ---');
  const sample = hasPhotos[0] as any;
  const urls = sample['Photo Url List'].split('|').slice(0, 3);
  console.log(`  ${sample.VIN}  ${sample.Year} ${sample.Make} ${sample.Model}`);
  urls.forEach((u: string) => console.log('    ', u.trim()));

  await sftp.end();
}

main().catch(e => { console.error(e); process.exit(1); });
