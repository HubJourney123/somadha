import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching overall stats...');

    // Get total complaints
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM complaints
    `;
    const total = parseInt(totalResult[0].total);

    // Get resolved complaints (status_id = 5)
    const resolvedResult = await sql`
      SELECT COUNT(*) as resolved FROM complaints WHERE status_id = 5
    `;
    const resolved = parseInt(resolvedResult[0].resolved);

    // Get in-progress complaints (status_id = 3 or 4)
    const inProgressResult = await sql`
      SELECT COUNT(*) as in_progress FROM complaints WHERE status_id IN (3, 4)
    `;
    const inProgress = parseInt(inProgressResult[0].in_progress);

    // Get pending complaints (status_id = 1 or 2)
    const pendingResult = await sql`
      SELECT COUNT(*) as pending FROM complaints WHERE status_id IN (1, 2)
    `;
    const pending = parseInt(pendingResult[0].pending);

    console.log('Stats:', { total, resolved, inProgress, pending });

    return NextResponse.json({
      success: true,
      data: {
        total,
        resolved,
        inProgress,
        pending
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats',
        details: error.message
      },
      { status: 500 }
    );
  }
}