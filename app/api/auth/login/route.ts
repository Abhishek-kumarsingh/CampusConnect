import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyPassword, generateToken, DEMO_CREDENTIALS, isDemoAccount, getDemoAccount } from '@/lib/auth';
import { mockDatabase } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if it's a demo account
    if (isDemoAccount(email)) {
      const demoAccount = getDemoAccount(email);

      if (demoAccount && demoAccount.password === password) {
        const token = generateToken({
          userId: 'demo-' + demoAccount.role,
          email: demoAccount.email,
          role: demoAccount.role,
          name: demoAccount.name
        });

        const response = NextResponse.json({
          success: true,
          message: 'Login successful',
          user: {
            id: 'demo-' + demoAccount.role,
            name: demoAccount.name,
            email: demoAccount.email,
            role: demoAccount.role,
            department: demoAccount.department,
            studentId: 'studentId' in demoAccount ? demoAccount.studentId : undefined,
            facultyId: 'facultyId' in demoAccount ? demoAccount.facultyId : undefined
          },
          token
        });

        // Set token as HTTP-only cookie
        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;
      } else {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // For non-demo accounts, try database first, fallback to mock
    try {
      await connectDB();

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 401 }
        );
      }

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
      });

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          studentId: user.studentId,
          facultyId: user.facultyId,
          avatar: user.avatar,
          bio: user.bio
        },
        token
      });

      // Set token as HTTP-only cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    } catch (dbError) {
      // Fallback to mock data if database is not available
      console.log('Database not available, using mock data');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
