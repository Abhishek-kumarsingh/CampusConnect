import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const event = await Event.findById(params.id)
      .populate('organizer', 'name email role department')
      .populate('attendees', 'name email role department');

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event
    });

  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
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

    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isOrganizer = event.organizer?.toString() === userPayload.userId;
    const isAdmin = userPayload.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only edit your own events' },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email role department')
     .populate('attendees', 'name email role department');

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });

  } catch (error: any) {
    console.error('Update event error:', error);
    
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

// DELETE /api/events/[id] - Delete event
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

    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isOrganizer = event.organizer?.toString() === userPayload.userId;
    const isAdmin = userPayload.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own events' },
        { status: 403 }
      );
    }

    await Event.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
