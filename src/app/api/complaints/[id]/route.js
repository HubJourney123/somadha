import { getComplaintByUniqueId, getComplaintStatusHistory } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Get complaint by unique ID
export async function GET(request, { params }) {
  try {
    console.log('GET /api/complaints/[id] - ID:', params.id);

    const complaint = await getComplaintByUniqueId(params.id);

    if (!complaint) {
      console.log('Complaint not found:', params.id);
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    console.log('Complaint found:', complaint.unique_id);
    console.log('Status history count:', complaint.status_history?.length || 0);

    return NextResponse.json({
      success: true,
      data: complaint
    });

  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch complaint',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// PATCH - Update complaint status
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { statusId, statusName, solutionImageUrl, notes } = body;

    // Get complaint
    const complaint = await getComplaintByUniqueId(params.id);
    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Update complaint status
    await sql`
      UPDATE complaints 
      SET 
        status_id = ${statusId},
        status_name = ${statusName},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${complaint.id}
    `;

    // Add to status history
    await sql`
      INSERT INTO complaint_status_history (
        complaint_id, 
        status_id, 
        status_name, 
        updated_by_type,
        updated_by_id,
        updated_by_name,
        solution_image_url,
        notes
      )
      VALUES (
        ${complaint.id},
        ${statusId},
        ${statusName},
        ${session.user.role},
        ${session.user.id || null},
        ${session.user.name},
        ${solutionImageUrl || null},
        ${notes || null}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}