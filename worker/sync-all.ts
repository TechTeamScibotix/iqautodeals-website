/**
 * Unified Inventory Sync Worker
 *
 * Runs ALL dealer inventory syncs sequentially with NO time limit.
 * Designed to run on the DigitalOcean droplet via crontab.
 *
 * Usage:
 *   npx tsx worker/sync-all.ts              # Run all syncs
 *   npx tsx worker/sync-all.ts --dealer=turpin  # Run specific dealer
 *   npx tsx worker/sync-all.ts --type=lexus_sftp  # Run specific feed type
 */

import dotenv from 'dotenv';
import path from 'path';

// Load env before any other imports
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

import { prisma } from '../lib/prisma';
import { syncLexusFeedInventory } from '../lib/inventory-sync/lexus-feed';
import { syncDealerSocketInventory } from '../lib/inventory-sync/dealersocket';
import { syncWendleFeedInventory } from '../lib/inventory-sync/wendle-feed';
import { syncLexusAlgoliaInventory } from '../lib/inventory-sync/lexus-algolia';
import { syncDealerComInventory } from '../lib/inventory-sync/dealer-com';
import { syncCarsCommerceInventory } from '../lib/inventory-sync/carscommerce';

// ── Helpers ──────────────────────────────────────────────────────────────────

function timestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

function log(msg: string) {
  console.log(`[${timestamp()}] ${msg}`);
}

function logError(msg: string, err?: any) {
  console.error(`[${timestamp()}] ERROR: ${msg}`, err?.message || '');
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

// ── Sync Dispatcher ──────────────────────────────────────────────────────────

interface SyncResult {
  dealer: string;
  type: string;
  success: boolean;
  created?: number;
  updated?: number;
  markedSold?: number;
  duration?: number;
  error?: string;
}

async function syncDealer(dealer: {
  id: string;
  businessName: string | null;
  inventoryFeedType: string | null;
}): Promise<SyncResult> {
  const name = dealer.businessName || 'Unknown';
  const type = dealer.inventoryFeedType || 'unknown';

  log(`Starting sync: ${name} (${type})`);

  // Mark in_progress
  await prisma.user.update({
    where: { id: dealer.id },
    data: { lastSyncStatus: 'in_progress', lastSyncMessage: null },
  });

  const start = Date.now();

  try {
    let result: any;

    switch (type) {
      case 'lexus_sftp':
        // No time limit — let it run to completion
        result = await syncLexusFeedInventory(dealer.id, { timeLimitMs: Infinity });
        break;

      case 'dealersocket':
        result = await syncDealerSocketInventory(dealer.id, { timeLimitMs: Infinity });
        break;

      case 'wendle_sftp':
        result = await syncWendleFeedInventory(dealer.id, { timeLimitMs: Infinity });
        break;

      case 'dealer-com':
        result = await syncDealerComInventory(dealer.id);
        break;

      case 'carscommerce':
        result = await syncCarsCommerceInventory(dealer.id);
        break;

      case 'carsforsale': {
        // Dynamic import since not all deployments have this
        const { syncCarsforsaleInventory } = await import('../lib/inventory-sync/carsforsale');
        result = await syncCarsforsaleInventory(dealer.id);
        break;
      }

      case 'rmb_sftp': {
        const { syncRmbFeedInventory } = await import('../lib/inventory-sync/rmb-feed');
        result = await syncRmbFeedInventory(dealer.id);
        break;
      }

      default:
        log(`  Skipping ${name}: unknown feed type "${type}"`);
        return { dealer: name, type, success: false, error: `Unknown feed type: ${type}` };
    }

    const duration = Date.now() - start;
    const created = result.created || 0;
    const updated = result.updated || 0;
    const markedSold = result.markedSold || 0;

    log(`  Completed ${name}: ${created} created, ${updated} updated, ${markedSold} sold (${formatDuration(duration)})`);

    return { dealer: name, type, success: true, created, updated, markedSold, duration };

  } catch (err: any) {
    const duration = Date.now() - start;
    logError(`Sync failed for ${name} after ${formatDuration(duration)}`, err);

    // Update dealer status to failed
    try {
      await prisma.user.update({
        where: { id: dealer.id },
        data: {
          lastSyncAt: new Date(),
          lastSyncStatus: 'failed',
          lastSyncMessage: `Worker error: ${err.message}`.substring(0, 500),
        },
      });
    } catch {}

    return { dealer: name, type, success: false, error: err.message, duration };
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dealerFilter = args.find(a => a.startsWith('--dealer='))?.split('=')[1]?.toLowerCase();
  const typeFilter = args.find(a => a.startsWith('--type='))?.split('=')[1];

  log('═══════════════════════════════════════════════');
  log('IQ Auto Deals — Inventory Sync Worker');
  log('═══════════════════════════════════════════════');

  // Fetch all auto-sync dealers
  const where: any = { autoSyncEnabled: true };
  if (typeFilter) where.inventoryFeedType = typeFilter;

  const dealers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      businessName: true,
      inventoryFeedType: true,
    },
    orderBy: { businessName: 'asc' },
  });

  // Apply dealer name filter if provided
  const filtered = dealerFilter
    ? dealers.filter(d => d.businessName?.toLowerCase().includes(dealerFilter))
    : dealers;

  if (filtered.length === 0) {
    log('No dealers found matching filters. Exiting.');
    await prisma.$disconnect();
    process.exit(0);
  }

  log(`Found ${filtered.length} dealer(s) to sync:`);
  for (const d of filtered) {
    log(`  - ${d.businessName} (${d.inventoryFeedType})`);
  }
  log('');

  // Run syncs sequentially
  const results: SyncResult[] = [];
  const totalStart = Date.now();

  for (const dealer of filtered) {
    const result = await syncDealer(dealer);
    results.push(result);
    log(''); // blank line between dealers
  }

  // Also run Algolia supplement sync (not tied to a specific dealer)
  if (!dealerFilter && !typeFilter) {
    log('Starting Algolia supplement sync...');
    const algoliaStart = Date.now();
    try {
      const algoliaResult = await syncLexusAlgoliaInventory();
      const duration = Date.now() - algoliaStart;
      log(`  Algolia: ${algoliaResult.created} created, ${algoliaResult.reactivated} reactivated, ${algoliaResult.photosUpdated} photos (${formatDuration(duration)})`);
      results.push({ dealer: 'Algolia Supplement', type: 'algolia', success: true, created: algoliaResult.created, duration });
    } catch (err: any) {
      logError('Algolia sync failed', err);
      results.push({ dealer: 'Algolia Supplement', type: 'algolia', success: false, error: err.message });
    }
    log('');
  }

  // Summary
  const totalDuration = Date.now() - totalStart;
  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalCreated = results.reduce((sum, r) => sum + (r.created || 0), 0);
  const totalUpdated = results.reduce((sum, r) => sum + (r.updated || 0), 0);
  const totalSold = results.reduce((sum, r) => sum + (r.markedSold || 0), 0);

  log('═══════════════════════════════════════════════');
  log('SYNC SUMMARY');
  log('═══════════════════════════════════════════════');
  log(`Total time:    ${formatDuration(totalDuration)}`);
  log(`Dealers:       ${succeeded} succeeded, ${failed} failed`);
  log(`Vehicles:      ${totalCreated} created, ${totalUpdated} updated, ${totalSold} sold`);
  log('');

  if (failed > 0) {
    log('FAILURES:');
    for (const r of results.filter(r => !r.success)) {
      log(`  ✗ ${r.dealer}: ${r.error}`);
    }
  }

  log('═══════════════════════════════════════════════');

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  logError('Fatal error', err);
  process.exit(1);
});
