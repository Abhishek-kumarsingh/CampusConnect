import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resource from '@/lib/models/Resource';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/resources/[id]/download - Track download
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

    // Check if resource is accessible
    if (!resource.isApproved || (!resource.isPublic && userPayload.role === 'student')) {
      return NextResponse.json(
        { error: 'Resource not accessible' },
        { status: 403 }
      );
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    // Return the download URL
    const downloadUrl = resource.fileUrl || resource.externalUrl;

    return NextResponse.json({
      success: true,
      downloadUrl,
      downloads: resource.downloads
    });

  } catch (error) {
    console.error('Download resource error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
