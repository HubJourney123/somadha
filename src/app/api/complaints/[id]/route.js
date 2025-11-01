import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get complaint by unique ID
export async function GET(request, { params }) {
  console.log('========================================');
  console.log('API Route Hit: /api/complaints/[id]');
  console.log('========================================');
  
  try {
    // Log the params object
    console.log('Params object:', JSON.stringify(params));
    console.log('Params.id type:', typeof params.id);
    console.log('Params.id value:', params.id);
    
    const { id } = params;
    console.log('Extracted ID:', id);

    if (!id) {
      console.log('❌ ID is undefined or null');
      return NextResponse.json(
        { success: false, error: 'Invalid complaint ID' },
        { status: 400 }
      );
    }

    console.log('Querying database for complaint:', id);

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

    console.log('Query executed. Result count:', complaintResult.length);

    if (complaintResult.length === 0) {
      console.log('❌ Complaint not found in database');
      
      // Double check with a simpler query
      const exists = await sql`
        SELECT unique_id FROM complaints WHERE unique_id = ${id}
      `;
      console.log('Simple query result:', exists.length);
      
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const complaint = complaintResult[0];
    console.log('✅ Found complaint:', complaint.unique_id);
    console.log('Complaint ID in DB:', complaint.id);

    // Get status history
    console.log('Fetching status history for complaint_id:', complaint.id);
    
    const statusHistory = await sql`
      SELECT * FROM complaint_status_history
      WHERE complaint_id = ${complaint.id}
      ORDER BY created_at ASC
    `;

    console.log('✅ Status history count:', statusHistory.length);

    // Attach status history to complaint
    complaint.status_history = statusHistory;

    console.log('✅ Returning complaint data');
    console.log('========================================');

    return NextResponse.json({
      success: true,
      data: complaint
    });

  } catch (error) {
    console.error('========================================');
    console.error('❌ ERROR in GET /api/complaints/[id]');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('========================================');
    
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
    const { statusId, statusName, solutionImageUrl, notes } = body;

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
        solution_image_url,
        notes
      )
      VALUES (
        ${complaint.id},
        ${statusId},
        ${statusName},
        ${solutionImageUrl || null},
        ${notes || null}
      )
    `;

    console.log('✅ Complaint updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}