import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get('dealerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');
    const bidStatus = searchParams.get('bidStatus') || 'won';

    if (!dealerId) {
      return NextResponse.json({ error: 'Dealer ID required' }, { status: 400 });
    }

    // Build where clause for AcceptedDeals based on bidStatus
    const acceptedDealWhere: any = {
      car: {
        dealerId: dealerId,
      },
    };

    // Filter by bidStatus
    if (bidStatus === 'won') {
      acceptedDealWhere.sold = true;
      acceptedDealWhere.deadDeal = false;
    } else if (bidStatus === 'deadDeal') {
      acceptedDealWhere.deadDeal = true;
    } else if (bidStatus === 'all') {
      // Show all accepted deals (both sold and dead)
      // No additional filter needed
    } else {
      // For other statuses (lost, pending, expired, salesArea), only show sold deals
      acceptedDealWhere.sold = true;
      acceptedDealWhere.deadDeal = false;
    }

    // Add date filters
    if (startDate || endDate) {
      acceptedDealWhere.createdAt = {};
      if (startDate) {
        acceptedDealWhere.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add 1 day to endDate to include the entire end day
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        acceptedDealWhere.createdAt.lt = endDateTime;
      }
    }

    // Add car attribute filters
    if (make) {
      acceptedDealWhere.car.make = make;
    }
    if (model) {
      acceptedDealWhere.car.model = model;
    }
    if (year) {
      acceptedDealWhere.car.year = parseInt(year);
    }

    // Fetch accepted deals with car details (single source of truth)
    const acceptedDeals = await prisma.acceptedDeal.findMany({
      where: acceptedDealWhere,
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            color: true,
            mileage: true,
            vin: true,
            photos: true,
            state: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format sales data
    const filteredSales: any[] = acceptedDeals.map((deal) => ({
      id: deal.id,
      date: deal.createdAt,
      customerName: deal.customer.name,
      customerEmail: deal.customer.email,
      customerPhone: deal.customer.phone,
      car: deal.car,
      finalPrice: deal.finalPrice,
      verificationCode: deal.verificationCode,
      source: 'acceptedDeal',
      deadDeal: deal.deadDeal,
    }));

    // Calculate summary statistics
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.finalPrice, 0);
    const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Get unique makes and models for filter dropdowns
    const allCars = await prisma.car.findMany({
      where: {
        dealerId: dealerId,
      },
      select: {
        make: true,
        model: true,
        year: true,
      },
    });

    const makes = [...new Set(allCars.map((c) => c.make))].sort();
    const models = [...new Set(allCars.map((c) => c.model))].sort();
    const years = [...new Set(allCars.map((c) => c.year))].sort((a, b) => b - a);

    return NextResponse.json({
      sales: filteredSales,
      summary: {
        totalSales,
        totalRevenue,
        averagePrice,
      },
      filterOptions: {
        makes,
        models,
        years,
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
