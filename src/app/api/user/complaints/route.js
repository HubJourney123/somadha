import { sql } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// GET - Fetch user's complaints
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Fetching complaints for user:', session.user.email);

    // Get user ID from email
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `;

    if (userResult.length === 0) {
      console.log('User not found in database');
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const userId = userResult[0].id;
    console.log('User ID:', userId);

    // Fetch user's complaints
    const complaints = await sql`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM complaint_status_history WHERE complaint_id = c.id) as status_update_count
      FROM complaints c
      WHERE c.user_id = ${userId}
      ORDER BY c.created_at DESC
    `;

    console.log(`Found ${complaints.length} complaints for user`);

    return NextResponse.json({
      success: true,
      data: complaints
    });

  } catch (error) {
    console.error('Error fetching user complaints:', error);
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
