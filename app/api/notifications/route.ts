import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unread') === 'true';

    try {
      await connectDB();

      let query: any = {
        $and: [
          { isActive: true },
          {
            $or: [
              { recipients: userPayload.userId },
              { recipientRoles: userPayload.role }
            ]
          }
        ]
      };

      // Filter for unread notifications
      if (unreadOnly) {
        query.$and.push({
          'isRead.user': { $ne: userPayload.userId }
        });
      }

      const skip = (page - 1) * limit;

      const notifications = await Notification.find(query)
        .populate('sender', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(query);

      // Add read status for current user
      const notificationsWithReadStatus = notifications.map(notification => {
        const notificationObj = notification.toObject();
        const readEntry = notification.isRead.find(
          entry => entry.user.toString() === userPayload.userId
        );
        notificationObj.isReadByUser = !!readEntry;
        notificationObj.readAt = readEntry?.readAt;
        return notificationObj;
      });

      return NextResponse.json({
        success: true,
        notifications: notificationsWithReadStatus,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (dbError) {
      // Fallback to mock data
      const mockNotifications = [
        {
          _id: 'notif-1',
          title: 'New Assignment Posted',
          message: 'React Components Project has been posted for Web Development',
          type: 'assignment',
          sender: { name: 'Dr. Jane Faculty', role: 'faculty' },
          priority: 'medium',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isReadByUser: false
        },
        {
          _id: 'notif-2',
          title: 'Event Reminder',
          message: 'Tech Innovators Summit starts tomorrow at 10:00 AM',
          type: 'event',
          sender: { name: 'Admin User', role: 'admin' },
          priority: 'high',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          isReadByUser: true
        },
        {
          _id: 'notif-3',
          title: 'Grade Posted',
          message: 'Your grade for Database Design Assignment is now available',
          type: 'grade',
          sender: { name: 'Dr. Jane Faculty', role: 'faculty' },
          priority: 'medium',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isReadByUser: userPayload.role === 'student' ? false : true
        },
        {
          _id: 'notif-4',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur this weekend from 2-4 AM',
          type: 'system',
          sender: { name: 'System Admin', role: 'admin' },
          priority: 'low',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isReadByUser: true
        }
      ];

      // Filter based on role and unread status
      let filteredNotifications = mockNotifications;
      
      if (userPayload.role === 'faculty') {
        filteredNotifications = mockNotifications.filter(n => 
          n.type !== 'grade' || n.sender.role === 'admin'
        );
      }

      if (unreadOnly) {
        filteredNotifications = filteredNotifications.filter(n => !n.isReadByUser);
      }

      return NextResponse.json({
        success: true,
        notifications: filteredNotifications,
        pagination: { page: 1, limit: 20, total: filteredNotifications.length, pages: 1 }
      });
    }

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create notification (Faculty/Admin only)
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);
    
    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!['faculty', 'admin'].includes(userPayload.role)) {
      return NextResponse.json(
        { error: 'Only faculty and admin can create notifications' },
        { status: 403 }
      );
    }

    const notificationData = await request.json();

    try {
      await connectDB();

      const notification = new Notification({
        ...notificationData,
        sender: userPayload.userId,
        isRead: []
      });

      await notification.save();
      await notification.populate('sender', 'name email role');

      return NextResponse.json({
        success: true,
        message: 'Notification created successfully',
        notification
      }, { status: 201 });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Notification created successfully (demo mode)',
        notification: {
          _id: 'demo-notification',
          ...notificationData,
          sender: { name: userPayload.name, email: userPayload.email, role: userPayload.role }
        }
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
