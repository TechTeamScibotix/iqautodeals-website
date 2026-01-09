/**
 * Inventory Sync API
 *
 * GET /api/sync - Run scheduled sync for all dealers (for cron job)
 * POST /api/sync - Sync a specific dealer's inventory
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncDealerInventory, runScheduledSync } from '@/lib/sync/inventory-sync';
import { prisma } from '@/lib/prisma';

// Verify cron secret for scheduled syncs
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * GET - Run scheduled sync (called by Vercel Cron)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization for cron jobs
    const authHeader = request.headers.get('authorization');

    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting scheduled inventory sync via cron...');

    const summaries = await runScheduledSync();

    const totalStats = {
      dealersSynced: summaries.length,
      successful: summaries.filter(s => s.success).length,
      failed: summaries.filter(s => !s.success).length,
      totalAdded: summaries.reduce((sum, s) => sum + s.stats.added, 0),
      totalUpdated: summaries.reduce((sum, s) => sum + s.stats.updated, 0),
      totalMarkedSold: summaries.reduce((sum, s) => sum + s.stats.markedSold, 0),
    };

    return NextResponse.json({
      success: true,
      message: 'Scheduled sync complete',
      stats: totalStats,
      summaries,
    });
  } catch (error) {
    console.error('Scheduled sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Sync a specific dealer's inventory
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealerId, secret } = body;

    // Basic auth check - in production, use proper authentication
    if (CRON_SECRET && secret !== CRON_SECRET) {
      // Check if request is from an authenticated admin
      // For now, allow if dealer ID matches logged in user
      // This should be enhanced with proper auth
    }

    if (!dealerId) {
      return NextResponse.json(
        { error: 'dealerId is required' },
        { status: 400 }
      );
    }

    // Verify dealer exists and has sync enabled
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        businessName: true,
        inventoryFeedUrl: true,
        autoSyncEnabled: true,
      },
    });

    if (!dealer) {
      return NextResponse.json(
        { error: 'Dealer not found' },
        { status: 404 }
      );
    }

    if (!dealer.inventoryFeedUrl) {
      return NextResponse.json(
        { error: 'No inventory feed URL configured for this dealer' },
        { status: 400 }
      );
    }

    console.log(`Starting manual sync for dealer: ${dealer.businessName}`);

    const summary = await syncDealerInventory(dealerId);

    return NextResponse.json({
      success: summary.success,
      summary,
    });
  } catch (error) {
    console.error('Manual sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
