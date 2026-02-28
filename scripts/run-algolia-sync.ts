import dotenv from 'dotenv';
import path from 'path';

// Load .env and .env.local before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { syncLexusAlgoliaInventory } from '../lib/inventory-sync/lexus-algolia';

async function main() {
  console.log('Starting Lexus Algolia supplement sync...');
  const result = await syncLexusAlgoliaInventory();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

main();
