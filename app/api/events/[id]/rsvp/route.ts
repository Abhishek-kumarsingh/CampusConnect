import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { getUserFromRequest } from '@/lib/auth';
import { mockDatabase } from '@/lib/mock-data';

// POST /api/events/[id]/rsvp - RSVP to event
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

    // Allow all authenticated users to RSVP

    await connectDB();

    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is approved and public
    if (!event.isApproved || !event.isPublic) {
      return NextResponse.json(
        { error: 'Event is not available for RSVP' },
        { status: 400 }
      );
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return NextResponse.json(
        { error: 'Cannot RSVP to past events' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    if (event.attendees.includes(userPayload.userId)) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    // Add user to attendees
    event.attendees.push(userPayload.userId);
    await event.save();

    // Populate attendees for response
    await event.populate('attendees', 'name email role department');

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for event',
      event
    });

  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/rsvp - Cancel RSVP
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

    // Allow all authenticated users to cancel RSVP

    await connectDB();

    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is registered
    if (!event.attendees.includes(userPayload.userId)) {
      return NextResponse.json(
        { error: 'You are not registered for this event' },
        { status: 400 }
      );
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      (attendeeId: any) => attendeeId.toString() !== userPayload.userId
    );
    await event.save();

    // Populate attendees for response
    await event.populate('attendees', 'name email role department');

    return NextResponse.json({
      success: true,
      message: 'Successfully cancelled registration',
      event
    });

  } catch (error) {
    console.error('Cancel RSVP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
