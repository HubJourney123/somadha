import { NextResponse } from 'next/server';
import { 
  getComplaintByUniqueId, 
  getComplaintStatusHistory,
  updateComplaintStatus 
} from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

import { sql } from '@/lib/db';


export async function GET(request, { params }) {
  try {
    const { id } = params;

    const complaint = await getComplaintByUniqueId(id);

    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}

// ... rest of the file

// PATCH - Update complaint status (Admin/Agent only)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin or agent
    if (!session || !['agent', 'developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const uniqueId = params.id;
    const body = await request.json();
    const { statusId, statusName, solutionImageUrl, notes } = body;

    if (!statusId || !statusName) {
      return NextResponse.json(
        { success: false, error: 'Status ID and name are required' },
        { status: 400 }
      );
    }

    // Get complaint
    const complaint = await getComplaintByUniqueId(uniqueId);
    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Update status
    await updateComplaintStatus(complaint.id, {
      statusId,
      statusName,
      updatedByType: session.user.role,
      updatedById: parseInt(session.user.id),
      updatedByName: session.user.name,
      solutionImageUrl: solutionImageUrl || null,
      notes: notes || null
    });

    return NextResponse.json({
      success: true,
      message: 'Complaint status updated successfully'
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}