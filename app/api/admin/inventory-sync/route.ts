import { NextRequest, NextResponse } from 'next/server';
import { syncDealerSocketInventory, listAvailableFeeds } from '@/lib/inventory-sync/dealersocket';
import { prisma } from '@/lib/prisma';

// Verify admin authentication via token
function verifyAdmin(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token');
  if (!token) return false;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    return decoded === adminPassword;
  } catch {
    return false;
  }
}

// GET - List dealers with DealerSocket sync enabled and available feeds
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all dealers configured for DealerSocket sync
    const dealers = await prisma.user.findMany({
      where: {
        userType: 'dealer',
        inventoryFeedType: 'dealersocket',
        dealerSocketFeedId: { not: null },
      },
      select: {
        id: true,
        businessName: true,
        dealerSocketFeedId: true,
        autoSyncEnabled: true,
        lastSyncAt: true,
        lastSyncStatus: true,
        lastSyncMessage: true,
        _count: {
          select: { cars: true },
        },
      },
    });

    // Get available feeds on SFTP
    let availableFeeds: string[] = [];
    try {
      availableFeeds = await listAvailableFeeds();
    } catch (err: any) {
      console.error('Failed to list SFTP feeds:', err.message);
    }

    return NextResponse.json({
      dealers: dealers.map(d => ({
        id: d.id,
        businessName: d.businessName,
        feedId: d.dealerSocketFeedId,
        autoSyncEnabled: d.autoSyncEnabled,
        lastSyncAt: d.lastSyncAt,
        lastSyncStatus: d.lastSyncStatus,
        lastSyncMessage: d.lastSyncMessage,
        carCount: d._count.cars,
      })),
      availableFeeds,
    });
  } catch (error: any) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Trigger sync for a specific dealer
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { dealerId } = await request.json();

    if (!dealerId) {
      return NextResponse.json({ error: 'dealerId is required' }, { status: 400 });
    }

    // Verify dealer exists and is configured for DealerSocket
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: {
        id: true,
        businessName: true,
        dealerSocketFeedId: true,
        inventoryFeedType: true,
      },
    });

    if (!dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    if (!dealer.dealerSocketFeedId) {
      return NextResponse.json({ error: 'Dealer has no DealerSocket Feed ID configured' }, { status: 400 });
    }

    // Mark sync as in progress
    await prisma.user.update({
      where: { id: dealerId },
      data: {
        lastSyncStatus: 'in_progress',
        lastSyncMessage: 'Sync started...',
      },
    });

    // Run sync
    const result = await syncDealerSocketInventory(dealerId);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Sync completed: ${result.created} created, ${result.updated} updated, ${result.markedSold} marked sold`
        : `Sync failed: ${result.errors.join(', ')}`,
      result,
    });

  } catch (error: any) {
    console.error('Error triggering sync:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
