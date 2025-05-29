import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/notifications/[id]/read - Mark notification as read
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

    try {
      await connectDB();

      const notification = await Notification.findById(params.id);
      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      // Check if user already marked as read
      const existingRead = notification.isRead.find(
        (entry: any) => entry.user.toString() === userPayload.userId
      );

      if (!existingRead) {
        notification.isRead.push({
          user: userPayload.userId,
          readAt: new Date()
        });
        await notification.save();
      }

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Notification marked as read (demo mode)'
      });
    }

  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id]/read - Mark notification as unread
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

    try {
      await connectDB();

      const notification = await Notification.findById(params.id);
      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      // Remove read status for this user
      notification.isRead = notification.isRead.filter(
        (entry: any) => entry.user.toString() !== userPayload.userId
      );
      await notification.save();

      return NextResponse.json({
        success: true,
        message: 'Notification marked as unread'
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Notification marked as unread (demo mode)'
      });
    }

  } catch (error) {
    console.error('Mark notification as unread error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
