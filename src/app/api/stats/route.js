import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get total complaints
    const totalResult = await sql`
      SELECT COUNT(*)::int as count FROM complaints
    `;
    const total = totalResult[0]?.count || 0;

    // Get complaints by status
    const pendingResult = await sql`
      SELECT COUNT(*)::int as count FROM complaints WHERE status_id = 1
    `;
    const pending = pendingResult[0]?.count || 0;

    const inProgressResult = await sql`
      SELECT COUNT(*)::int as count 
      FROM complaints 
      WHERE status_id IN (2, 3, 4)
    `;
    const inProgress = inProgressResult[0]?.count || 0;

    const resolvedResult = await sql`
      SELECT COUNT(*)::int as count FROM complaints WHERE status_id = 5
    `;
    const resolved = resolvedResult[0]?.count || 0;

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
    console.error('Stats API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats',
        data: { total: 0, pending: 0, inProgress: 0, resolved: 0 }
      },
      { status: 500 }
    );
  }
}