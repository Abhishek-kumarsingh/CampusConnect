import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Group from '@/lib/models/Group';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/groups - Get all groups
export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const course = searchParams.get('course');
    const myGroups = searchParams.get('myGroups') === 'true';

    let query: any = { isActive: true };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (course) {
      query.course = course;
    }

    if (myGroups) {
      query.$or = [
        { creator: userPayload.userId },
        { members: userPayload.userId },
        { admins: userPayload.userId }
      ];
    } else {
      // For public groups, show non-private groups or groups user is part of
      query.$or = [
        { isPrivate: false },
        { members: userPayload.userId },
        { creator: userPayload.userId },
        { admins: userPayload.userId }
      ];
    }

    const groups = await Group.find(query)
      .populate('creator', 'name email role department')
      .populate('members', 'name email role')
      .populate('admins', 'name email role')
      .populate('course', 'title code')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      groups
    });

  } catch (error) {
    console.error('Get groups error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create new group
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const groupData = await request.json();

    // Validation
    const requiredFields = ['name', 'description', 'type'];
    for (const field of requiredFields) {
      if (!groupData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Set creator and initial admin
    groupData.creator = userPayload.userId;
    groupData.members = [userPayload.userId];
    groupData.admins = [userPayload.userId];

    // Process tags
    if (groupData.tags && typeof groupData.tags === 'string') {
      groupData.tags = groupData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    }

    const group = new Group(groupData);
    await group.save();

    // Populate for response
    await group.populate('creator', 'name email role department');
    await group.populate('members', 'name email role');
    await group.populate('admins', 'name email role');
    if (group.course) {
      await group.populate('course', 'title code');
    }

    return NextResponse.json({
      success: true,
      message: 'Group created successfully',
      group
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create group error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
