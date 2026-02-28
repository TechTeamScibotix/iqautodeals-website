import { NextRequest, NextResponse } from 'next/server';
import { syncLexusAlgoliaInventory } from '@/lib/inventory-sync/lexus-algolia';

// 5-minute max for Vercel Pro
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Algolia Sync Cron] Starting Lexus Algolia supplement sync...');

    const result = await syncLexusAlgoliaInventory();

    console.log(`[Algolia Sync Cron] Completed in ${result.duration}ms: ${result.created} created, ${result.reactivated} reactivated, ${result.photosUpdated} photos updated, ${result.skipped} skipped`);

    return NextResponse.json({
      success: result.success,
      totalFetched: result.totalFetched,
      created: result.created,
      reactivated: result.reactivated,
      photosUpdated: result.photosUpdated,
      skipped: result.skipped,
      deferred: result.deferred,
      errors: result.errors,
      duration: result.duration,
    });

  } catch (error: any) {
    console.error('[Algolia Sync Cron] Fatal error:', error);
    return NextResponse.json(
      { error: 'Failed to run Algolia sync', message: error.message },
      { status: 500 }
    );
  }
}
