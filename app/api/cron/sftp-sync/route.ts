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
      },
    });

    console.log(`[SFTP Sync Cron] Found ${dealers.length} dealers with sync enabled`);

    // Filter to dealers that are due for sync, then pick the most overdue one
    const now = Date.now();
    const dueDealers = dealers
      .filter((dealer) => {
        const frequencyDays = dealer.syncFrequencyDays || 2;
        if (!dealer.lastSyncAt) return true; // never synced
        const daysSinceSync = (now - dealer.lastSyncAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceSync >= frequencyDays;
      })
      .sort((a, b) => {
        // Most overdue first (null lastSyncAt = highest priority)
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

    console.log(`[SFTP Sync Cron] Syncing ${dealer.businessName} (${dealer.inventoryFeedType}) — last synced ${daysSince} days ago, ${dueDealers.length - 1} other dealers queued`);

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
