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

    // Build query with proper tagged template syntax
    let complaints;

    if (!categoryId && !statusId && !upazila && !searchQuery) {
      // No filters - simple query
      complaints = await sql`
        SELECT 
          c.*,
          u.name as user_name,
          u.email as user_email,
          (SELECT COUNT(*) FROM complaint_status_history WHERE complaint_id = c.id) as status_update_count
        FROM complaints c
        LEFT JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 100
      `;
    } else {
      // With filters - use dynamic query
      let conditions = [];
      
      if (categoryId) {
        conditions.push(sql`c.category_id = ${parseInt(categoryId)}`);
      }
      if (statusId) {
        conditions.push(sql`c.status_id = ${parseInt(statusId)}`);
      }
      if (upazila) {
        conditions.push(sql`c.upazila = ${upazila}`);
      }
      if (searchQuery) {
        conditions.push(sql`(c.unique_id ILIKE ${`%${searchQuery}%`} OR c.details ILIKE ${`%${searchQuery}%`})`);
      }

      // This is a workaround - for complex queries, we'll fetch all and filter
      const allComplaints = await sql`
        SELECT 
          c.*,
          u.name as user_name,
          u.email as user_email,
          (SELECT COUNT(*) FROM complaint_status_history WHERE complaint_id = c.id) as status_update_count
        FROM complaints c
        LEFT JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
      `;

      // Apply filters in JavaScript
      complaints = allComplaints.filter(c => {
        if (categoryId && c.category_id !== parseInt(categoryId)) return false;
        if (statusId && c.status_id !== parseInt(statusId)) return false;
        if (upazila && c.upazila !== upazila) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!c.unique_id.toLowerCase().includes(query) && 
              !c.details.toLowerCase().includes(query)) {
            return false;
          }
        }
        return true;
      });
    }

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