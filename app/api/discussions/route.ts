import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Discussion from '@/lib/models/Discussion';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/discussions - Get all discussions
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
    const category = searchParams.get('category');
    const course = searchParams.get('course');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = { isApproved: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (course) {
      query.course = course;
    }

    const discussions = await Discussion.find(query)
      .populate('author', 'name email role department')
      .populate('course', 'title code')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name email role'
        }
      })
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Discussion.countDocuments(query);

    return NextResponse.json({
      success: true,
      discussions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get discussions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/discussions - Create new discussion
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const discussionData = await request.json();

    // Validation
    const requiredFields = ['title', 'content', 'category'];
    for (const field of requiredFields) {
      if (!discussionData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Set author to current user
    discussionData.author = userPayload.userId;

    // Auto-approve for faculty and admin, require approval for students
    discussionData.isApproved = ['faculty', 'admin'].includes(userPayload.role);

    const discussion = new Discussion(discussionData);
    await discussion.save();

    // Populate author and course for response
    await discussion.populate('author', 'name email role department');
    if (discussion.course) {
      await discussion.populate('course', 'title code');
    }

    return NextResponse.json({
      success: true,
      message: 'Discussion created successfully',
      discussion
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create discussion error:', error);
    
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
