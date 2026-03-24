import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncDealerComInventory } from '@/lib/inventory-sync/dealer-com';

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dealers = await prisma.user.findMany({
      where: {
        autoSyncEnabled: true,
        inventoryFeedType: 'dealer-com',
      },
      select: {
        id: true,
        businessName: true,
      },
    });

    if (dealers.length === 0) {
      return NextResponse.json({ success: true, message: 'No Dealer.com dealers found' });
    }

    console.log(`[DealerCom Sync Cron] Running sync for ${dealers.length} dealers`);

    const results: any[] = [];

    for (const dealer of dealers) {
      console.log(`[DealerCom Sync Cron] Syncing ${dealer.businessName}...`);

      try {
        const syncResult = await syncDealerComInventory(dealer.id);

        results.push({
          dealer: dealer.businessName,
          success: syncResult.success,
          created: syncResult.created,
          updated: syncResult.updated,
          markedSold: syncResult.markedSold,
          errors: syncResult.errors.length,
          duration: syncResult.duration,
        });
      } catch (err: any) {
        console.error(`[DealerCom Sync Cron] Error syncing ${dealer.businessName}:`, err);
        results.push({
          dealer: dealer.businessName,
          success: false,
          error: err.message,
        });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('[DealerCom Sync Cron] Fatal error:', error);
    return NextResponse.json({ error: 'Failed to run Dealer.com sync' }, { status: 500 });
  }
}
