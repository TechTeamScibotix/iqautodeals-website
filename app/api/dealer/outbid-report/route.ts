import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    // Find all deal lists where the dealer made negotiations
    const dealLists = await prisma.dealList.findMany({
      where: {
        selectedCars: {
          some: {
            negotiations: {
              some: {
                dealerId,
              },
            },
          },
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        selectedCars: {
          include: {
            car: {
              include: {
                dealer: {
                  select: {
                    id: true,
                    businessName: true,
                    name: true,
                  },
                },
                acceptedDeals: {
                  where: startDate || endDate ? {
                    createdAt: {
                      ...(startDate && { gte: new Date(startDate) }),
                      ...(endDate && { lte: new Date(endDate) }),
                    },
                  } : undefined,
                },
              },
            },
            negotiations: {
              where: {
                dealerId,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Process the data to find outbid situations
    const outbidVehicles: any[] = [];

    for (const dealList of dealLists) {
      // Find if any competitor car in this deal list has an accepted deal
      const competitorWon = dealList.selectedCars.find(sc =>
        sc.car.dealerId !== dealerId &&
        sc.car.acceptedDeals &&
        sc.car.acceptedDeals.length > 0
      );

      if (competitorWon) {
        // Find all of the dealer's cars in this deal list where they made offers
        const dealerCars = dealList.selectedCars.filter(sc =>
          sc.car.dealerId === dealerId &&
          sc.negotiations.length > 0 &&
          sc.status !== 'won' // They didn't win
        );

        for (const dealerCar of dealerCars) {
          const highestOffer = dealerCar.negotiations.length > 0
            ? Math.max(...dealerCar.negotiations.map(n => n.offeredPrice))
            : 0;

          outbidVehicles.push({
            // Dealer's vehicle information
            dealerVehicle: {
              id: dealerCar.car.id,
              year: dealerCar.car.year,
              make: dealerCar.car.make,
              model: dealerCar.car.model,
              vin: dealerCar.car.vin,
              color: dealerCar.car.color,
              mileage: dealerCar.car.mileage,
              askingPrice: dealerCar.car.salePrice,
              highestOffer: highestOffer,
              offerCount: dealerCar.negotiations.length,
            },
            // Customer information
            customer: {
              id: dealList.customer.id,
              name: dealList.customer.name,
              email: dealList.customer.email,
              phone: dealList.customer.phone,
            },
            // Winning competitor information
            winningCompetitor: {
              dealerId: competitorWon.car.dealerId,
              dealerName: competitorWon.car.dealer?.businessName || competitorWon.car.dealer?.name,
              vehicle: {
                year: competitorWon.car.year,
                make: competitorWon.car.make,
                model: competitorWon.car.model,
              },
              finalPrice: competitorWon.car.acceptedDeals![0].finalPrice,
              acceptedDate: competitorWon.car.acceptedDeals![0].createdAt,
            },
            // Deal list information
            dealListId: dealList.id,
            dealListCreatedAt: dealList.createdAt,
          });
        }
      }
    }

    // Calculate statistics
    const totalOutbid = outbidVehicles.length;
    const competitorBreakdown = outbidVehicles.reduce((acc: any, vehicle) => {
      const competitorName = vehicle.winningCompetitor.dealerName;
      if (!acc[competitorName]) {
        acc[competitorName] = {
          dealerId: vehicle.winningCompetitor.dealerId,
          count: 0,
          totalValue: 0,
        };
      }
      acc[competitorName].count += 1;
      acc[competitorName].totalValue += vehicle.winningCompetitor.finalPrice;
      return acc;
    }, {});

    return NextResponse.json({
      totalOutbid,
      outbidVehicles,
      competitorBreakdown: Object.entries(competitorBreakdown).map(([name, data]: [string, any]) => ({
        dealerName: name,
        dealerId: data.dealerId,
        timesWon: data.count,
        totalValue: data.totalValue,
      })).sort((a, b) => b.timesWon - a.timesWon),
    });
  } catch (error) {
    console.error('Error fetching outbid report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outbid report' },
      { status: 500 }
    );
  }
}
