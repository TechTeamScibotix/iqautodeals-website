/**
 * Admin API for configuring dealer inventory sync
 *
 * GET /api/admin/dealer-sync?dealerId=xxx - Get dealer sync config
 * POST /api/admin/dealer-sync - Update dealer sync config
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple admin auth - in production, use proper authentication
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.CRON_SECRET;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const secret = request.headers.get('x-admin-secret');

  if (ADMIN_SECRET) {
    return authHeader === `Bearer ${ADMIN_SECRET}` || secret === ADMIN_SECRET;
  }

  // If no secret configured, allow (dev mode)
  return true;
}

/**
 * GET - Get dealer sync configuration
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dealerId = searchParams.get('dealerId');

  try {
    if (dealerId) {
      // Get specific dealer
      const dealer = await prisma.user.findUnique({
        where: { id: dealerId },
        select: {
          id: true,
          businessName: true,
          websiteUrl: true,
          inventoryFeedUrl: true,
          inventoryFeedType: true,
          autoSyncEnabled: true,
          syncFrequencyDays: true,
          lastSyncAt: true,
          lastSyncStatus: true,
          lastSyncMessage: true,
          _count: { select: { cars: true } },
        },
      });

      if (!dealer) {
        return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
      }

      return NextResponse.json({ dealer });
    } else {
      // Get all dealers with sync configured
      const dealers = await prisma.user.findMany({
        where: {
          userType: 'dealer',
          verificationStatus: 'approved',
        },
        select: {
          id: true,
          businessName: true,
          websiteUrl: true,
          inventoryFeedUrl: true,
          inventoryFeedType: true,
          autoSyncEnabled: true,
          syncFrequencyDays: true,
          lastSyncAt: true,
          lastSyncStatus: true,
          lastSyncMessage: true,
          _count: { select: { cars: true } },
        },
        orderBy: { businessName: 'asc' },
      });

      return NextResponse.json({ dealers });
    }
  } catch (error) {
    console.error('Error fetching dealer sync config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dealer configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST - Update dealer sync configuration
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      dealerId,
      inventoryFeedUrl,
      inventoryFeedType,
      autoSyncEnabled,
      syncFrequencyDays,
    } = body;

    if (!dealerId) {
      return NextResponse.json({ error: 'dealerId is required' }, { status: 400 });
    }

    // Validate dealer exists
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: { id: true, userType: true },
    });

    if (!dealer || dealer.userType !== 'dealer') {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    // Update sync configuration
    const updated = await prisma.user.update({
      where: { id: dealerId },
      data: {
        inventoryFeedUrl: inventoryFeedUrl ?? undefined,
        inventoryFeedType: inventoryFeedType ?? undefined,
        autoSyncEnabled: autoSyncEnabled ?? undefined,
        syncFrequencyDays: syncFrequencyDays ?? undefined,
      },
      select: {
        id: true,
        businessName: true,
        inventoryFeedUrl: true,
        inventoryFeedType: true,
        autoSyncEnabled: true,
        syncFrequencyDays: true,
        lastSyncAt: true,
        lastSyncStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      dealer: updated,
    });
  } catch (error) {
    console.error('Error updating dealer sync config:', error);
    return NextResponse.json(
      { error: 'Failed to update dealer configuration' },
      { status: 500 }
    );
  }
}
