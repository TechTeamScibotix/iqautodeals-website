import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncDealerSocketInventory } from '@/lib/inventory-sync/dealersocket';
import { syncLexusFeedInventory } from '@/lib/inventory-sync/lexus-feed';
import { syncWendleFeedInventory } from '@/lib/inventory-sync/wendle-feed';

// Cron job to sync SFTP-based dealer inventories (DealerSocket + Lexus feeds)
// Runs daily at 4 AM UTC; uses syncFrequencyDays to skip days when sync isn't due

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all dealers with SFTP-based sync enabled
    const dealers = await prisma.user.findMany({
      where: {
        autoSyncEnabled: true,
        inventoryFeedType: { in: ['dealersocket', 'lexus_sftp', 'wendle_sftp'] },
        dealerSocketFeedId: { not: null },
      },
      select: {
        id: true,
        businessName: true,
        inventoryFeedType: true,
        syncFrequencyDays: true,
        lastSyncAt: true,
      },
    });

    console.log(`[SFTP Sync Cron] Found ${dealers.length} SFTP-based dealers with sync enabled`);

    const results: Array<{
      dealerId: string;
      dealerName: string;
      feedType: string;
      skipped: boolean;
      success?: boolean;
      created?: number;
      updated?: number;
      markedSold?: number;
      errors?: string[];
      duration?: number;
    }> = [];

    for (const dealer of dealers) {
      // Check if sync is due based on syncFrequencyDays
      const frequencyDays = dealer.syncFrequencyDays || 2;
      if (dealer.lastSyncAt) {
        const daysSinceSync = (Date.now() - dealer.lastSyncAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceSync < frequencyDays) {
          console.log(`[SFTP Sync Cron] Skipping ${dealer.businessName} - last synced ${daysSinceSync.toFixed(1)} days ago (frequency: ${frequencyDays} days)`);
          results.push({
            dealerId: dealer.id,
            dealerName: dealer.businessName || 'Unknown',
            feedType: dealer.inventoryFeedType || '',
            skipped: true,
          });
          continue;
        }
      }

      console.log(`[SFTP Sync Cron] Syncing ${dealer.businessName} (${dealer.inventoryFeedType})...`);

      try {
        // Route to the correct sync function based on feed type
        let syncResult;

        if (dealer.inventoryFeedType === 'dealersocket') {
          syncResult = await syncDealerSocketInventory(dealer.id);
        } else if (dealer.inventoryFeedType === 'lexus_sftp') {
          syncResult = await syncLexusFeedInventory(dealer.id);
        } else if (dealer.inventoryFeedType === 'wendle_sftp') {
          syncResult = await syncWendleFeedInventory(dealer.id);
        } else {
          throw new Error(`Unknown SFTP feed type: ${dealer.inventoryFeedType}`);
        }

        results.push({
          dealerId: dealer.id,
          dealerName: dealer.businessName || 'Unknown',
          feedType: dealer.inventoryFeedType || '',
          skipped: false,
          success: syncResult.success,
          created: syncResult.created,
          updated: syncResult.updated,
          markedSold: syncResult.markedSold,
          errors: syncResult.errors,
          duration: syncResult.duration,
        });

      } catch (err: any) {
        console.error(`[SFTP Sync Cron] Error syncing ${dealer.businessName}:`, err);
        results.push({
          dealerId: dealer.id,
          dealerName: dealer.businessName || 'Unknown',
          feedType: dealer.inventoryFeedType || '',
          skipped: false,
          success: false,
          errors: [err.message],
        });
      }
    }

    // Aggregate stats
    const synced = results.filter(r => !r.skipped);
    const successful = synced.filter(r => r.success);
    const failed = synced.filter(r => !r.success);
    const totalCreated = synced.reduce((sum, r) => sum + (r.created || 0), 0);
    const totalUpdated = synced.reduce((sum, r) => sum + (r.updated || 0), 0);
    const totalMarkedSold = synced.reduce((sum, r) => sum + (r.markedSold || 0), 0);

    console.log(`[SFTP Sync Cron] Done: ${successful.length} successful, ${failed.length} failed, ${results.length - synced.length} skipped`);

    return NextResponse.json({
      success: true,
      totalDealers: dealers.length,
      synced: synced.length,
      skipped: results.length - synced.length,
      successful: successful.length,
      failed: failed.length,
      totalCreated,
      totalUpdated,
      totalMarkedSold,
      results,
    });

  } catch (error) {
    console.error('[SFTP Sync Cron] Fatal error:', error);
    return NextResponse.json(
      { error: 'Failed to run SFTP sync' },
      { status: 500 }
    );
  }
}
