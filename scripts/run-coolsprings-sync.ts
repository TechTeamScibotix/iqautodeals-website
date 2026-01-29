import dotenv from 'dotenv';
import path from 'path';

// Load .env and .env.local before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { syncLexusFeedInventory } from '../lib/inventory-sync/lexus-feed';

async function main() {
  console.log('Starting Lexus of Cool Springs inventory sync...');
  console.log('SFTP Host:', process.env.DEALERSOCKET_SFTP_HOST);
  console.log('SFTP User:', process.env.LEXUS_SFTP_USERNAME);
  const result = await syncLexusFeedInventory('b81b150f-9957-478a-a0c1-3984cfbec216');
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

main();
