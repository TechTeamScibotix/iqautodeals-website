import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, source } = data;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Create a user record to store the lead (as customer type)
    const customer = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        password: 'ai-chat-lead', // Placeholder password for leads
        userType: 'customer',
      }
    });

    // Log for tracking
    console.log(`[AI Chat Lead] Captured: ${name} (${email}) - Source: ${source || 'ai_chat'}`);

    return NextResponse.json({
      success: true,
      leadId: customer.id,
      message: 'Lead captured successfully'
    });

  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get recent customers (leads) - users with userType "customer"
    const leads = await prisma.user.findMany({
      where: { userType: 'customer' },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ leads });

  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
