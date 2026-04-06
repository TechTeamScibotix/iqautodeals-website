import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// GET - List team members for a dealer
export async function GET(request: NextRequest) {
  try {
    const dealerId = request.nextUrl.searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json({ error: 'dealerId is required' }, { status: 400 });
    }

    // Verify the user exists and is a dealer (not a team member themselves)
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: { id: true, userType: true, parentDealerId: true },
    });

    if (!dealer || dealer.userType !== 'dealer') {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    // If this is a team member, they can't manage the team
    if (dealer.parentDealerId) {
      return NextResponse.json({ error: 'Only the account owner can manage team members' }, { status: 403 });
    }

    const teamMembers = await prisma.user.findMany({
      where: { parentDealerId: dealerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Failed to load team members:', error);
    return NextResponse.json({ error: 'Failed to load team members' }, { status: 500 });
  }
}

// POST - Add a new team member
export async function POST(request: NextRequest) {
  try {
    const { dealerId, name, email, phone, password } = await request.json();

    if (!dealerId || !name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Verify the requester is a dealer owner (not a team member)
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: { id: true, userType: true, parentDealerId: true, businessName: true },
    });

    if (!dealer || dealer.userType !== 'dealer') {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    if (dealer.parentDealerId) {
      return NextResponse.json({ error: 'Only the account owner can add team members' }, { status: 403 });
    }

    // Check if email is already in use
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const teamMember = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        phone: phone || null,
        userType: 'dealer',
        parentDealerId: dealerId,
        businessName: dealer.businessName,
        verificationStatus: 'approved', // Team members inherit parent's status
      },
    });

    return NextResponse.json({
      teamMember: {
        id: teamMember.id,
        name: teamMember.name,
        email: teamMember.email,
        phone: teamMember.phone,
        createdAt: teamMember.createdAt,
      },
    });
  } catch (error) {
    console.error('Failed to add team member:', error);
    return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
  }
}

// DELETE - Remove a team member
export async function DELETE(request: NextRequest) {
  try {
    const { dealerId, teamMemberId } = await request.json();

    if (!dealerId || !teamMemberId) {
      return NextResponse.json({ error: 'dealerId and teamMemberId are required' }, { status: 400 });
    }

    // Verify the requester is the dealer owner
    const dealer = await prisma.user.findUnique({
      where: { id: dealerId },
      select: { id: true, parentDealerId: true },
    });

    if (!dealer || dealer.parentDealerId) {
      return NextResponse.json({ error: 'Only the account owner can remove team members' }, { status: 403 });
    }

    // Verify the team member belongs to this dealer
    const teamMember = await prisma.user.findUnique({
      where: { id: teamMemberId },
      select: { id: true, parentDealerId: true },
    });

    if (!teamMember || teamMember.parentDealerId !== dealerId) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: teamMemberId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove team member:', error);
    return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}
