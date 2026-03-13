import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncLexusFeedInventory } from '@/lib/inventory-sync/lexus-feed';

export const maxDuration = 300;

// Cron job to sync Lexus dealer inventories.
// Runs every other day at 1 AM EST (6 AM UTC).
// Syncs Lexus of Nashville first, then Lexus of Cool Springs.

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only run Lexus SFTP dealers
    const dealers = await prisma.user.findMany({
      where: {
        autoSyncEnabled: true,
        inventoryFeedType: 'lexus_sftp',
      },
      select: {
        id: true,
        businessName: true,
        inventoryFeedType: true,
      },
    });

    if (dealers.length === 0) {
      return NextResponse.json({ success: true, message: 'No Lexus dealers found' });
    }

    console.log(`[Lexus Sync Cron] Running sync for ${dealers.length} Lexus dealers`);

    const results: any[] = [];

    for (const dealer of dealers) {
      console.log(`[Lexus Sync Cron] Syncing ${dealer.businessName}...`);

      await prisma.user.update({
        where: { id: dealer.id },
        data: { lastSyncStatus: 'in_progress' },
      });

      try {
        const syncResult = await syncLexusFeedInventory(dealer.id);

        console.log(`[Lexus Sync Cron] Completed ${dealer.businessName}: ${syncResult.created} new, ${syncResult.updated} existing, ${syncResult.markedSold} sold (${syncResult.duration}ms)`);

        results.push({
          dealer: dealer.businessName,
          success: true,
          created: syncResult.created,
          updated: syncResult.updated,
          markedSold: syncResult.markedSold,
          duration: syncResult.duration,
        });

      } catch (err: any) {
        console.error(`[Lexus Sync Cron] Error syncing ${dealer.businessName}:`, err);

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
          console.error('[Lexus Sync Cron] Failed to update sync status:', updateErr);
        }

        results.push({
          dealer: dealer.businessName,
          success: false,
          error: err.message,
        });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('[Lexus Sync Cron] Fatal error:', error);
    return NextResponse.json(
      { error: 'Failed to run Lexus sync' },
      { status: 500 }
    );
  }
}
