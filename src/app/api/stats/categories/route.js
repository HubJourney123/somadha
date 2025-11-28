import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('========================================');
    console.log('Fetching category stats...');

    // Get complaints count by category
    const stats = await sql`
      SELECT 
        category_name,
        category_id,
        COUNT(*)::int as count
      FROM complaints
      GROUP BY category_name, category_id
      ORDER BY count DESC
    `;

    console.log('Query executed. Found categories:', stats.length);

    // Get total count
    const totalResult = await sql`
      SELECT COUNT(*)::int as total FROM complaints
    `;

    const total = totalResult[0]?.total || 0;

    console.log('Stats data:', stats);
    console.log('Total complaints:', total);
    console.log('========================================');

    return NextResponse.json({
      success: true,
      data: stats.map(s => ({
        category_name: s.category_name,
        count: parseInt(s.count)
      })),
      total: total
    });

  } catch (error) {
    console.error('========================================');
    console.error('❌ Error fetching category stats:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    console.error('========================================');
    
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