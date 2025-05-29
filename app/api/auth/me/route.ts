import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getUserFromRequest, DEMO_CREDENTIALS } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle demo accounts
    if (userPayload.userId.startsWith('demo-')) {
      const role = userPayload.userId.replace('demo-', '') as keyof typeof DEMO_CREDENTIALS;
      const demoAccount = DEMO_CREDENTIALS[role];

      return NextResponse.json({
        success: true,
        user: {
          id: userPayload.userId,
          name: demoAccount.name,
          email: demoAccount.email,
          role: demoAccount.role,
          department: demoAccount.department,
          studentId: 'studentId' in demoAccount ? demoAccount.studentId : undefined,
          facultyId: 'facultyId' in demoAccount ? demoAccount.facultyId : undefined,
          isDemo: true
        }
      });
    }

    // For regular accounts, fetch from database
    await connectDB();

    const user = await User.findById(userPayload.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        facultyId: user.facultyId,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        isDemo: false
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
