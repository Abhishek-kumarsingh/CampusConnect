import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resource from '@/lib/models/Resource';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/resources/[id]/like - Like resource
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

    await connectDB();

    const resource = await Resource.findById(params.id);
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Check if user already liked
    const hasLiked = resource.likes.includes(userPayload.userId);

    if (hasLiked) {
      // Unlike
      resource.likes = resource.likes.filter(
        (userId: any) => userId.toString() !== userPayload.userId
      );
    } else {
      // Like
      resource.likes.push(userPayload.userId);
    }

    await resource.save();

    return NextResponse.json({
      success: true,
      message: hasLiked ? 'Resource unliked' : 'Resource liked',
      liked: !hasLiked,
      likesCount: resource.likes.length
    });

  } catch (error) {
    console.error('Like resource error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
