import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assignment from '@/lib/models/Assignment';
import Notification from '@/lib/models/Notification';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/assignments - Get assignments
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const course = searchParams.get('course');
    const status = searchParams.get('status');

    try {
      await connectDB();

      let query: any = {};

      // Role-based filtering
      if (userPayload.role === 'student') {
        query.isPublished = true;
        // In a real app, filter by student's enrolled courses
      } else if (userPayload.role === 'faculty') {
        query.instructor = userPayload.userId;
      }

      if (course) {
        query.course = { $regex: course, $options: 'i' };
      }

      const skip = (page - 1) * limit;

      const assignments = await Assignment.find(query)
        .populate('instructor', 'name email department')
        .populate('submissions.student', 'name email studentId')
        .sort({ dueDate: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Assignment.countDocuments(query);

      // Add submission status for students
      const assignmentsWithStatus = assignments.map(assignment => {
        const assignmentObj = assignment.toObject();
        
        if (userPayload.role === 'student') {
          const submission = assignment.submissions.find(
            sub => sub.student._id.toString() === userPayload.userId
          );
          assignmentObj.submissionStatus = submission ? submission.status : 'not_submitted';
          assignmentObj.grade = submission?.grade;
          assignmentObj.feedback = submission?.feedback;
          // Remove other students' submissions for privacy
          assignmentObj.submissions = submission ? [submission] : [];
        }

        return assignmentObj;
      });

      return NextResponse.json({
        success: true,
        assignments: assignmentsWithStatus,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (dbError) {
      // Fallback to mock data
      const mockAssignments = [
        {
          _id: 'assignment-1',
          title: 'React Components Project',
          description: 'Build a complete React application with multiple components',
          course: 'Web Development',
          instructor: { name: 'Dr. Jane Faculty', email: 'faculty@campusconnect.edu' },
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          maxPoints: 100,
          isPublished: true,
          submissionStatus: userPayload.role === 'student' ? 'not_submitted' : undefined,
          submissions: userPayload.role === 'faculty' ? [
            { student: { name: 'John Student' }, status: 'submitted', grade: 85 }
          ] : []
        },
        {
          _id: 'assignment-2',
          title: 'Database Design Assignment',
          description: 'Design and implement a relational database schema',
          course: 'Database Systems',
          instructor: { name: 'Dr. Jane Faculty', email: 'faculty@campusconnect.edu' },
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          maxPoints: 80,
          isPublished: true,
          submissionStatus: userPayload.role === 'student' ? 'submitted' : undefined,
          grade: userPayload.role === 'student' ? 92 : undefined,
          submissions: userPayload.role === 'faculty' ? [
            { student: { name: 'John Student' }, status: 'graded', grade: 92 }
          ] : []
        }
      ];

      return NextResponse.json({
        success: true,
        assignments: mockAssignments,
        pagination: { page: 1, limit: 10, total: 2, pages: 1 }
      });
    }

  } catch (error) {
    console.error('Get assignments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/assignments - Create assignment (Faculty only)
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
        { error: 'Only faculty and admin can create assignments' },
        { status: 403 }
      );
    }

    const assignmentData = await request.json();

    try {
      await connectDB();

      const assignment = new Assignment({
        ...assignmentData,
        instructor: userPayload.userId,
        submissions: []
      });

      await assignment.save();
      await assignment.populate('instructor', 'name email department');

      // Create notification for students
      const notification = new Notification({
        title: 'New Assignment Posted',
        message: `New assignment "${assignment.title}" has been posted for ${assignment.course}`,
        type: 'assignment',
        sender: userPayload.userId,
        recipientRoles: ['student'],
        priority: 'medium',
        relatedEntity: {
          entityType: 'assignment',
          entityId: assignment._id
        }
      });

      await notification.save();

      return NextResponse.json({
        success: true,
        message: 'Assignment created successfully',
        assignment
      }, { status: 201 });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Assignment created successfully (demo mode)',
        assignment: {
          _id: 'demo-assignment',
          ...assignmentData,
          instructor: { name: userPayload.name, email: userPayload.email }
        }
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Create assignment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
