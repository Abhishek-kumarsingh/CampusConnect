import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const upcoming = searchParams.get('upcoming') === 'true';

    // Build query
    const query: any = { isApproved: true, isPublic: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (upcoming) {
      query.date = { $gte: new Date() };
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get events with pagination
    const events = await Event.find(query)
      .populate('organizer', 'name email role department')
      .populate('attendees', 'name email role')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only faculty and admin can create events
    if (!['faculty', 'admin'].includes(userPayload.role)) {
      return NextResponse.json(
        { error: 'Only faculty and admin can create events' },
        { status: 403 }
      );
    }

    const eventData = await request.json();

    // Validation
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Create event
    const event = new Event({
      ...eventData,
      organizer: userPayload.userId.startsWith('demo-') ? null : userPayload.userId,
      isApproved: userPayload.role === 'admin', // Auto-approve for admin
      attendees: []
    });

    await event.save();

    // Populate organizer info
    await event.populate('organizer', 'name email role department');

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create event error:', error);
    
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
