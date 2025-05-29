import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/courses - Get all courses
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

    let query = {};
    
    // Students can only see active courses they're enrolled in or can enroll in
    if (userPayload.role === 'student') {
      query = { isActive: true };
    }
    // Faculty can see courses they teach
    else if (userPayload.role === 'faculty') {
      query = { 
        $or: [
          { instructor: userPayload.userId },
          { isActive: true }
        ]
      };
    }
    // Admin can see all courses

    const courses = await Course.find(query)
      .populate('instructor', 'name email department')
      .populate('enrolledStudents', 'name email studentId')
      .sort({ year: -1, semester: 1, title: 1 });

    return NextResponse.json({
      success: true,
      courses
    });

  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only faculty and admin can create courses
    if (!['faculty', 'admin'].includes(userPayload.role)) {
      return NextResponse.json(
        { error: 'Only faculty and admin can create courses' },
        { status: 403 }
      );
    }

    const courseData = await request.json();

    // Validation
    const requiredFields = ['title', 'code', 'description', 'department', 'credits', 'semester', 'year', 'schedule'];
    for (const field of requiredFields) {
      if (!courseData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate schedule structure
    if (!courseData.schedule.days || !courseData.schedule.time || !courseData.schedule.location) {
      return NextResponse.json(
        { error: 'Complete schedule information is required (days, time, location)' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: courseData.code.toUpperCase() });
    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course code already exists' },
        { status: 400 }
      );
    }

    // Set instructor to current user if faculty, or use provided instructor if admin
    if (userPayload.role === 'faculty') {
      courseData.instructor = userPayload.userId;
    } else if (!courseData.instructor) {
      courseData.instructor = userPayload.userId;
    }

    const course = new Course(courseData);
    await course.save();

    // Populate instructor for response
    await course.populate('instructor', 'name email department');

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create course error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Course code already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
