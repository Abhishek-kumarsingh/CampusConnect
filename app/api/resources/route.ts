import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resource from '@/lib/models/Resource';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/resources - Get all resources
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
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const course = searchParams.get('course');
    const myResources = searchParams.get('myResources') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    let query: any = { isApproved: true };

    // Students can only see public approved resources
    if (userPayload.role === 'student') {
      query.isPublic = true;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (course) {
      query.course = course;
    }

    if (myResources) {
      query.uploadedBy = userPayload.userId;
      // Remove approval filter for own resources
      delete query.isApproved;
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name email role department')
      .populate('course', 'title code')
      .populate('approvedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(query);

    return NextResponse.json({
      success: true,
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get resources error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create new resource
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resourceData = await request.json();

    // Validation
    const requiredFields = ['title', 'description', 'type', 'category'];
    for (const field of requiredFields) {
      if (!resourceData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate that either fileUrl or externalUrl is provided
    if (!resourceData.fileUrl && !resourceData.externalUrl) {
      return NextResponse.json(
        { error: 'Either file upload or external URL is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Set uploader and approval status
    resourceData.uploadedBy = userPayload.userId;
    
    // Auto-approve for faculty and admin
    if (['faculty', 'admin'].includes(userPayload.role)) {
      resourceData.isApproved = true;
      resourceData.approvedBy = userPayload.userId;
      resourceData.approvedAt = new Date();
    } else {
      resourceData.isApproved = false;
    }

    // Process tags
    if (resourceData.tags && typeof resourceData.tags === 'string') {
      resourceData.tags = resourceData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    }

    const resource = new Resource(resourceData);
    await resource.save();

    // Populate for response
    await resource.populate('uploadedBy', 'name email role department');
    if (resource.course) {
      await resource.populate('course', 'title code');
    }

    return NextResponse.json({
      success: true,
      message: 'Resource created successfully',
      resource
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create resource error:', error);
    
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
