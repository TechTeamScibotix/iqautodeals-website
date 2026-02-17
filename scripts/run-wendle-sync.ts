import dotenv from 'dotenv';
import path from 'path';

// Load .env and .env.local before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { syncWendleFeedInventory } from '../lib/inventory-sync/wendle-feed';

async function main() {
  console.log('Starting Wendle Ford inventory sync...');
  console.log('SFTP Host:', process.env.WENDLE_SFTP_HOST);
  console.log('SFTP User:', process.env.WENDLE_SFTP_USERNAME);
  const result = await syncWendleFeedInventory('6333b842-4277-487b-a4a7-e95e747c28a8');
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

main();
