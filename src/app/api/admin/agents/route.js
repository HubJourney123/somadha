import { sql } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET - Fetch all agents
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || !['developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const agents = await sql`
      SELECT 
        id,
        username,
        name,
        email,
        phone,
        upazila,
        is_active,
        created_at
      FROM agents
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST - Create new agent
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || !['developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, password, name, email, phone, upazila } = body;

    // Validate required fields
    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Username, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingAgent = await sql`
      SELECT id FROM agents WHERE username = ${username}
    `;

    if (existingAgent.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await sql`
        SELECT id FROM agents WHERE email = ${email}
      `;

      if (existingEmail.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create agent
    const result = await sql`
      INSERT INTO agents (
        username,
        password_hash,
        name,
        email,
        phone,
        upazila,
        is_active
      )
      VALUES (
        ${username},
        ${passwordHash},
        ${name},
        ${email || null},
        ${phone || null},
        ${upazila || null},
        true
      )
      RETURNING id, username, name, email, phone, upazila, is_active, created_at
    `;

    return NextResponse.json({
      success: true,
      message: 'Agent created successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

// PATCH - Update agent (activate/deactivate)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, is_active } = body;

    if (!id || is_active === undefined) {
      return NextResponse.json(
        { success: false, error: 'Agent ID and status are required' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE agents
      SET is_active = ${is_active}
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Agent status updated successfully'
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

// DELETE - Delete agent
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'developer') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Only developers can delete agents' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM agents WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}