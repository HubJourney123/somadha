import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Fetch all complaints
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const statusId = searchParams.get('statusId');
    const upazila = searchParams.get('upazila');
    const searchQuery = searchParams.get('search');

    console.log('Fetching complaints with filters:', { categoryId, statusId, upazila, searchQuery });

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

    queryText += ` ORDER BY c.created_at DESC LIMIT 100`;

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

// POST - Create new complaint
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      categoryId,
      categoryName,
      upazila,
      unionName,
      details,
      imageUrl,
      isAnonymous
    } = body;

    // Generate unique ID
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueId = `SMD-${timestamp}-${random}`;

    // Insert complaint
    const result = await sql`
      INSERT INTO complaints (
        unique_id, user_id, category_id, category_name, 
        upazila, union_name, details, image_url, is_anonymous,
        status_id, status_name
      )
      VALUES (
        ${uniqueId}, 
        ${userId}, 
        ${categoryId}, 
        ${categoryName},
        ${upazila}, 
        ${unionName}, 
        ${details}, 
        ${imageUrl || null}, 
        ${isAnonymous},
        1,
        'সমস্যা/অভিযোগ জমা হয়েছে'
      )
      RETURNING *
    `;

    const complaint = result[0];

    // Create initial status history
    await sql`
      INSERT INTO complaint_status_history (
        complaint_id, status_id, status_name
      )
      VALUES (
        ${complaint.id}, 
        1, 
        'সমস্যা/অভিযোগ জমা হয়েছে'
      )
    `;

    return NextResponse.json({
      success: true,
      data: complaint
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}
