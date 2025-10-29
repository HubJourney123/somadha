import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Fetch public statistics for homepage
export async function GET(request) {
  try {
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM complaints
    `;

    const solvedResult = await sql`
      SELECT COUNT(*) as solved FROM complaints WHERE status_id = 5
    `;

    return NextResponse.json({
      success: true,
      data: {
        total: parseInt(totalResult[0].total),
        solved: parseInt(solvedResult[0].solved),
        pending: parseInt(totalResult[0].total) - parseInt(solvedResult[0].solved)
      }
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}