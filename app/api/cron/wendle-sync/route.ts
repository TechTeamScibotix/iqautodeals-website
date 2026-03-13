import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncWendleFeedInventory } from '@/lib/inventory-sync/wendle-feed';

export const maxDuration = 300;

// Cron job to sync Wendle dealer inventories.
// Runs every other day at 3 AM EST (8 AM UTC).
// Smart time management: stops at 4 minutes, re-invokes itself to continue.
// Loops until all dealers are fully synced.

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only run Wendle SFTP dealers
    const dealers = await prisma.user.findMany({
      where: {
        autoSyncEnabled: true,
        inventoryFeedType: 'wendle_sftp',
      },
      select: {
        id: true,
        businessName: true,
        inventoryFeedType: true,
        lastSyncStatus: true,
        lastSyncMessage: true,
      },
    });

    if (dealers.length === 0) {
      return NextResponse.json({ success: true, message: 'No Wendle dealers found' });
    }

    console.log(`[Wendle Sync Cron] Running sync for ${dealers.length} Wendle dealers`);

    const results: any[] = [];
    let needsContinuation = false;

    for (const dealer of dealers) {
      // Check if this dealer has a partial sync to resume
      let startIndex = 0;
      if (dealer.lastSyncStatus === 'in_progress' && dealer.lastSyncMessage) {
        try {
          const progress = JSON.parse(dealer.lastSyncMessage);
          if (progress.nextIndex) {
            startIndex = progress.nextIndex;
            console.log(`[Wendle Sync Cron] Resuming ${dealer.businessName} from index ${startIndex}`);
          }
        } catch {
          // Not JSON, fresh start
        }
      }

      console.log(`[Wendle Sync Cron] Syncing ${dealer.businessName} (startIndex: ${startIndex})...`);

      await prisma.user.update({
        where: { id: dealer.id },
        data: { lastSyncStatus: 'in_progress' },
      });

      try {
        const syncResult = await syncWendleFeedInventory(dealer.id, {
          startIndex,
          timeLimitMs: 240000, // 4 minutes
        });

        if (syncResult.completed) {
          console.log(`[Wendle Sync Cron] Completed ${dealer.businessName}: ${syncResult.created} new, ${syncResult.updated} existing, ${syncResult.markedSold} sold (${syncResult.duration}ms)`);
        } else {
          console.log(`[Wendle Sync Cron] Paused ${dealer.businessName} at index ${syncResult.nextIndex} (${syncResult.duration}ms). Will continue next invocation.`);
          needsContinuation = true;
        }

        results.push({
          dealer: dealer.businessName,
          success: true,
          completed: syncResult.completed,
          nextIndex: syncResult.nextIndex,
          created: syncResult.created,
          updated: syncResult.updated,
          markedSold: syncResult.markedSold,
          duration: syncResult.duration,
        });

        // If this dealer didn't finish, don't start the next dealer — re-invoke instead
        if (!syncResult.completed) {
          break;
        }

      } catch (err: any) {
        console.error(`[Wendle Sync Cron] Error syncing ${dealer.businessName}:`, err);

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
          console.error('[Wendle Sync Cron] Failed to update sync status:', updateErr);
        }

        results.push({
          dealer: dealer.businessName,
          success: false,
          error: err.message,
        });
      }
    }

    // If any dealer didn't finish, re-invoke this cron to continue
    if (needsContinuation) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://iqautodeals.com';

      console.log(`[Wendle Sync Cron] Re-invoking self to continue sync...`);

      try {
        const headers: Record<string, string> = {};
        if (cronSecret) {
          headers['Authorization'] = `Bearer ${cronSecret}`;
        }

        fetch(`${baseUrl}/api/cron/wendle-sync`, { headers }).catch(err => {
          console.error('[Wendle Sync Cron] Failed to re-invoke:', err);
        });
      } catch (err) {
        console.error('[Wendle Sync Cron] Failed to re-invoke:', err);
      }
    }

    return NextResponse.json({ success: true, needsContinuation, results });

  } catch (error) {
    console.error('[Wendle Sync Cron] Fatal error:', error);
    return NextResponse.json(
      { error: 'Failed to run Wendle sync' },
      { status: 500 }
    );
  }
}
