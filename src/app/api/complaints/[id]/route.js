import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get complaint by unique ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log('Fetching complaint with ID:', id);

    // Get complaint details
    const complaintResult = await sql`
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.unique_id = ${id}
    `;

    if (complaintResult.length === 0) {
      console.log('Complaint not found:', id);
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const complaint = complaintResult[0];
    console.log('Found complaint:', complaint.unique_id);

    // Get status history
    const statusHistory = await sql`
      SELECT * FROM complaint_status_history
      WHERE complaint_id = ${complaint.id}
      ORDER BY created_at ASC
    `;

    console.log('Status history count:', statusHistory.length);

    // Attach status history to complaint
    complaint.status_history = statusHistory;

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
    const { id } = params;
    const body = await request.json();
    const { statusId, statusName, solutionImageUrl, notes, updatedBy } = body;

    console.log('Updating complaint:', id, 'to status:', statusId);

    // Get complaint
    const complaintResult = await sql`
      SELECT * FROM complaints WHERE unique_id = ${id}
    `;

    if (complaintResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const complaint = complaintResult[0];

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
        updated_by_name,
        solution_image_url,
        notes
      )
      VALUES (
        ${complaint.id},
        ${statusId},
        ${statusName},
        ${updatedBy?.type || 'system'},
        ${updatedBy?.name || 'System'},
        ${solutionImageUrl || null},
        ${notes || null}
      )
    `;

    console.log('Complaint updated successfully');

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