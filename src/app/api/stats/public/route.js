import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get total complaints count
    const totalResult = await sql`
      SELECT COUNT(*)::int as count
      FROM complaints
    `;
    const total = totalResult[0]?.count || 0;

    // Get count by status
    const statusCounts = await sql`
      SELECT 
        status_id,
        COUNT(*)::int as count
      FROM complaints
      GROUP BY status_id
    `;

    // Initialize counts
    let pending = 0;
    let inProgress = 0;
    let resolved = 0;

    // Map status counts
    statusCounts.forEach(row => {
      switch (row.status_id) {
        case 1: // জমা দেওয়া হয়েছে (Submitted/Pending)
          pending += row.count;
          break;
        case 2: // পর্যালোচনা করা হচ্ছে (Under Review)
        case 3: // কাজ চলছে (In Progress)
        case 4: // প্রায় সম্পন্ন (Almost Complete)
          inProgress += row.count;
          break;
        case 5: // সমাধান হয়েছে (Resolved)
          resolved += row.count;
          break;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        resolved
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats',
        data: {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0
        }
      },
      { status: 500 }
    );
  }
}