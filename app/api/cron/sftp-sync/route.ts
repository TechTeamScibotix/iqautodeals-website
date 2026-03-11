import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncDealerSocketInventory } from '@/lib/inventory-sync/dealersocket';
import { syncLexusFeedInventory } from '@/lib/inventory-sync/lexus-feed';
import { syncWendleFeedInventory } from '@/lib/inventory-sync/wendle-feed';
import { syncCarsforsaleInventory } from '@/lib/inventory-sync/carsforsale';
import { syncRmbFeedInventory } from '@/lib/inventory-sync/rmb-feed';

// 5-minute max for Vercel Pro — each invocation syncs ONE dealer
export const maxDuration = 300;

// Cron job to sync dealer inventories one at a time.
// Runs every hour; each invocation picks the single most-overdue dealer
// whose syncFrequencyDays has elapsed, syncs it, and returns.
// This spreads dealer syncs ~1 hour apart and avoids timeout issues.

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all dealers with sync enabled
    const dealers = await prisma.user.findMany({
      where: {
        autoSyncEnabled: true,
        inventoryFeedType: { in: ['dealersocket', 'lexus_sftp', 'wendle_sftp', 'carsforsale', 'rmb_sftp'] },
      },
      select: {
        id: true,
        businessName: true,
        inventoryFeedType: true,
        syncFrequencyDays: true,
        lastSyncAt: true,
        lastSyncStatus: true,
      },
    });

    console.log(`[SFTP Sync Cron] Found ${dealers.length} dealers with sync enabled`);

    // Filter to dealers that are due for sync, then pick the best candidate.
    // Dealers whose last sync failed are deprioritized so they don't block
    // the queue — other dealers get a turn first, then failed ones retry.
    const now = Date.now();
    const dueDealers = dealers
      .filter((dealer) => {
        const frequencyDays = dealer.syncFrequencyDays || 2;
        if (!dealer.lastSyncAt) return true; // never synced
        const daysSinceSync = (now - dealer.lastSyncAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceSync >= frequencyDays;
      })
      .sort((a, b) => {
        // Deprioritize dealers whose last sync failed or timed out (stuck in_progress).
        // This prevents one broken dealer from blocking the entire queue.
        // "in_progress" means the previous run was killed by Vercel timeout (504).
        const aFailed = (a.lastSyncStatus === 'failed' || a.lastSyncStatus === 'in_progress') ? 1 : 0;
        const bFailed = (b.lastSyncStatus === 'failed' || b.lastSyncStatus === 'in_progress') ? 1 : 0;
        if (aFailed !== bFailed) return aFailed - bFailed;

        // Among same-status dealers, most overdue first (null lastSyncAt = highest priority).
        const aTime = a.lastSyncAt?.getTime() ?? 0;
        const bTime = b.lastSyncAt?.getTime() ?? 0;
        return aTime - bTime;
      });

    if (dueDealers.length === 0) {
      console.log('[SFTP Sync Cron] No dealers due for sync this hour');
      return NextResponse.json({
        success: true,
        message: 'No dealers due for sync',
        totalDealers: dealers.length,
        dueDealers: 0,
      });
    }

    // Pick the single most overdue dealer
    const dealer = dueDealers[0];
    const daysSince = dealer.lastSyncAt
      ? ((now - dealer.lastSyncAt.getTime()) / (1000 * 60 * 60 * 24)).toFixed(1)
      : 'never';

    console.log(`[SFTP Sync Cron] Syncing ${dealer.businessName} (${dealer.inventoryFeedType}, lastStatus: ${dealer.lastSyncStatus || 'none'}) — last synced ${daysSince} days ago, ${dueDealers.length - 1} other dealers queued`);

    // Mark as in_progress BEFORE starting sync. If Vercel kills us with a 504
    // timeout, this status stays as "in_progress" which tells the next cron run
    // to deprioritize this dealer and sync others first.
    await prisma.user.update({
      where: { id: dealer.id },
      data: { lastSyncStatus: 'in_progress' },
    });

    try {
      // Route to the correct sync function based on feed type
      let syncResult;

      if (dealer.inventoryFeedType === 'dealersocket') {
        syncResult = await syncDealerSocketInventory(dealer.id);
      } else if (dealer.inventoryFeedType === 'lexus_sftp') {
        syncResult = await syncLexusFeedInventory(dealer.id);
      } else if (dealer.inventoryFeedType === 'wendle_sftp') {
        syncResult = await syncWendleFeedInventory(dealer.id);
      } else if (dealer.inventoryFeedType === 'carsforsale') {
        syncResult = await syncCarsforsaleInventory(dealer.id);
      } else if (dealer.inventoryFeedType === 'rmb_sftp') {
        syncResult = await syncRmbFeedInventory(dealer.id);
      } else {
        throw new Error(`Unknown feed type: ${dealer.inventoryFeedType}`);
      }

      console.log(`[SFTP Sync Cron] Completed ${dealer.businessName}: ${syncResult.created} created, ${syncResult.updated} updated, ${syncResult.markedSold} marked sold (${syncResult.duration}ms)`);

      return NextResponse.json({
        success: true,
        dealer: dealer.businessName,
        feedType: dealer.inventoryFeedType,
        created: syncResult.created,
        updated: syncResult.updated,
        markedSold: syncResult.markedSold,
        errors: syncResult.errors,
        duration: syncResult.duration,
        remainingDueDealers: dueDealers.length - 1,
      });

    } catch (err: any) {
      console.error(`[SFTP Sync Cron] Error syncing ${dealer.businessName}:`, err);

      // Mark as failed so the next cron run deprioritizes this dealer
      try {
        await prisma.user.update({
          where: { id: dealer.id },
          data: {
            lastSyncAt: new Date(),
            lastSyncStatus: 'failed',
            lastSyncMessage: `Cron error: ${err.message}`,
          },
        });
      } catch (updateErr) {
        console.error('[SFTP Sync Cron] Failed to update sync status:', updateErr);
      }

      return NextResponse.json({
        success: false,
        dealer: dealer.businessName,
        feedType: dealer.inventoryFeedType,
        error: err.message,
        remainingDueDealers: dueDealers.length - 1,
      });
    }

  } catch (error) {
    console.error('[SFTP Sync Cron] Fatal error:', error);
    return NextResponse.json(
      { error: 'Failed to run SFTP sync' },
      { status: 500 }
    );
  }
}
