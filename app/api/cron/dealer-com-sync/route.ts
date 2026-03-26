import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncDealerComInventory } from '@/lib/inventory-sync/dealer-com';
import { syncCarsCommerceInventory } from '@/lib/inventory-sync/carscommerce';

export const maxDuration = 300;

// Syncs Dealer.com and CarsCommerce dealer inventories.
// Runs every other day at 9 AM UTC.

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
        inventoryFeedType: { in: ['dealer-com', 'carscommerce'] },
      },
      select: {
        id: true,
        businessName: true,
        inventoryFeedType: true,
      },
    });

    if (dealers.length === 0) {
      return NextResponse.json({ success: true, message: 'No scraper-based dealers found' });
    }

    console.log(`[Scraper Sync Cron] Running sync for ${dealers.length} dealers`);

    const results: any[] = [];

    for (const dealer of dealers) {
      console.log(`[Scraper Sync Cron] Syncing ${dealer.businessName} (${dealer.inventoryFeedType})...`);

      try {
        const syncResult = dealer.inventoryFeedType === 'carscommerce'
          ? await syncCarsCommerceInventory(dealer.id)
          : await syncDealerComInventory(dealer.id);

        results.push({
          dealer: dealer.businessName,
          type: dealer.inventoryFeedType,
          success: syncResult.success,
          created: syncResult.created,
          updated: syncResult.updated,
          markedSold: syncResult.markedSold,
          errors: syncResult.errors.length,
          duration: syncResult.duration,
        });
      } catch (err: any) {
        console.error(`[Scraper Sync Cron] Error syncing ${dealer.businessName}:`, err);
        results.push({
          dealer: dealer.businessName,
          type: dealer.inventoryFeedType,
          success: false,
          error: err.message,
        });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('[Scraper Sync Cron] Fatal error:', error);
    return NextResponse.json({ error: 'Failed to run scraper sync' }, { status: 500 });
  }
}
