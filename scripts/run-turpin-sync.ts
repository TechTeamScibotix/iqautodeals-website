import dotenv from 'dotenv';
import path from 'path';

// Load .env and .env.local before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { syncDealerSocketInventory } from '../lib/inventory-sync/dealersocket';

async function main() {
  console.log('Starting Turpin Dodge inventory sync...');
  console.log('SFTP Host:', process.env.DEALERSOCKET_SFTP_HOST);
  console.log('SFTP User:', process.env.DEALERSOCKET_SFTP_USERNAME);
  const result = await syncDealerSocketInventory('a5fb5448-1e20-403d-b798-1886750991e6');
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

main();
