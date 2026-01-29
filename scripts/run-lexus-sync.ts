import dotenv from 'dotenv';
import path from 'path';

// Load .env and .env.local before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { syncLexusFeedInventory } from '../lib/inventory-sync/lexus-feed';

async function main() {
  console.log('Starting Lexus of Nashville inventory sync...');
  console.log('SFTP Host:', process.env.DEALERSOCKET_SFTP_HOST);
  console.log('SFTP User:', process.env.LEXUS_SFTP_USERNAME);
  const result = await syncLexusFeedInventory('e362433a-bfb0-49d4-80d0-d3361fd893a2');
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

main();
