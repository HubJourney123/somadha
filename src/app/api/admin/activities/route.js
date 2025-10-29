import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { 
  createActivity, 
  getAllActivities, 
  updateActivity, 
  deleteActivity 
} from '@/lib/db';

// GET - Fetch all activities (for admin)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Only agents and admins can access
    if (!session || !['agent', 'developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const activities = await getAllActivities();

    return NextResponse.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST - Create new activity
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Only agents can create activities
    if (!session || session.user.role !== 'agent') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, summary, imageUrl } = body;

    if (!title || !summary) {
      return NextResponse.json(
        { success: false, error: 'Title and summary are required' },
        { status: 400 }
      );
    }

    const activity = await createActivity({
      title,
      summary,
      imageUrl: imageUrl || null,
      createdByAgentId: parseInt(session.user.id),
      createdByName: session.user.name
    });

    return NextResponse.json({
      success: true,
      data: activity,
      message: 'Activity created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}

// PATCH - Update activity
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['agent', 'developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { activityId, title, summary, imageUrl, isPublished } = body;

    if (!activityId) {
      return NextResponse.json(
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    const activity = await updateActivity(activityId, {
      title,
      summary,
      imageUrl,
      isPublished
    });

    return NextResponse.json({
      success: true,
      data: activity,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

// DELETE - Delete activity
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['agent', 'developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('id');

    if (!activityId) {
      return NextResponse.json(
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    await deleteActivity(parseInt(activityId));

    return NextResponse.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}