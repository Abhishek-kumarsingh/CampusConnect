import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Group from '@/lib/models/Group';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/groups/[id]/join - Join group
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const group = await Group.findById(params.id);
    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    if (group.members.includes(userPayload.userId)) {
      return NextResponse.json(
        { error: 'You are already a member of this group' },
        { status: 400 }
      );
    }

    // Check if group is full
    if (group.maxMembers && group.members.length >= group.maxMembers) {
      return NextResponse.json(
        { error: 'Group is full' },
        { status: 400 }
      );
    }

    // For private groups, add to join requests
    if (group.isPrivate) {
      if (group.joinRequests.includes(userPayload.userId)) {
        return NextResponse.json(
          { error: 'Join request already sent' },
          { status: 400 }
        );
      }
      
      group.joinRequests.push(userPayload.userId);
      await group.save();

      return NextResponse.json({
        success: true,
        message: 'Join request sent successfully'
      });
    }

    // For public groups, add directly to members
    group.members.push(userPayload.userId);
    await group.save();

    // Populate for response
    await group.populate('members', 'name email role');

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the group',
      group
    });

  } catch (error) {
    console.error('Join group error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id]/join - Leave group
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const group = await Group.findById(params.id);
    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Check if user is a member
    if (!group.members.includes(userPayload.userId)) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 400 }
      );
    }

    // Prevent creator from leaving (they must transfer ownership first)
    if (group.creator.toString() === userPayload.userId) {
      return NextResponse.json(
        { error: 'Group creator cannot leave. Transfer ownership first.' },
        { status: 400 }
      );
    }

    // Remove from members and admins
    group.members = group.members.filter(
      (memberId: any) => memberId.toString() !== userPayload.userId
    );
    group.admins = group.admins.filter(
      (adminId: any) => adminId.toString() !== userPayload.userId
    );

    await group.save();

    // Populate for response
    await group.populate('members', 'name email role');

    return NextResponse.json({
      success: true,
      message: 'Successfully left the group',
      group
    });

  } catch (error) {
    console.error('Leave group error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
