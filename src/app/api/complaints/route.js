import { sql } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// GET - Fetch all complaints
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const statusId = searchParams.get('statusId');
    const upazila = searchParams.get('upazila');
    const searchQuery = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let queryText = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM complaint_status_history WHERE complaint_id = c.id) as status_update_count
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (categoryId) {
      queryText += ` AND c.category_id = $${paramIndex}`;
      params.push(parseInt(categoryId));
      paramIndex++;
    }

    if (statusId) {
      queryText += ` AND c.status_id = $${paramIndex}`;
      params.push(parseInt(statusId));
      paramIndex++;
    }

    if (upazila) {
      queryText += ` AND c.upazila = $${paramIndex}`;
      params.push(upazila);
      paramIndex++;
    }

    if (searchQuery) {
      queryText += ` AND (c.unique_id ILIKE $${paramIndex} OR c.details ILIKE $${paramIndex})`;
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    queryText += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    console.log('Executing query:', queryText);
    console.log('With params:', params);

    const complaints = await sql(queryText, params);

    console.log(`Found ${complaints.length} complaints`);

    return NextResponse.json({
      success: true,
      data: complaints,
      total: complaints.length
    });

  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch complaints',
        details: error.message
      },
      { status: 500 }
    );
  }
}