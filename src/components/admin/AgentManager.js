import { sql } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET - Fetch all agents
export async function GET(request) {
  try {
    console.log('GET /api/admin/agents called');
    
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
        full_name as name,
        email,
        phone,
        is_active,
        created_at
      FROM agents
      ORDER BY created_at DESC
    `;

    console.log(`Found ${agents.length} agents`);

    return NextResponse.json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch agents', 
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Create new agent
export async function POST(request) {
  console.log('\n=== POST /api/admin/agents ===');
  
  try {
    // Check session
    const session = await getServerSession(authOptions);
    console.log('Session check:', session ? '✓' : '✗');
    
    if (!session) {
      console.log('No session found');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('User:', session.user.email, 'Role:', session.user.role);

    // Check if user is admin
    if (!['developer', 'politician'].includes(session.user.role)) {
      console.log('Unauthorized - Role not allowed');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    console.log('Request body:', { ...body, password: '***' });

    const { username, password, name, email, phone } = body;

    // Validate required fields
    if (!username || !password || !name) {
      console.log('Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Username, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Check if username already exists
    console.log('Checking if username exists...');
    const existingAgent = await sql`
      SELECT id FROM agents WHERE username = ${username}
    `;

    if (existingAgent.length > 0) {
      console.log('Username already exists');
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (email) {
      console.log('Checking if email exists...');
      const existingEmail = await sql`
        SELECT id FROM agents WHERE email = ${email}
      `;

      if (existingEmail.length > 0) {
        console.log('Email already exists');
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Get admin info for tracking
    const adminId = session.user.id || null;
    const adminRole = session.user.role || null;

    // Create agent
    console.log('Inserting agent into database...');
    const result = await sql`
      INSERT INTO agents (
        username,
        password_hash,
        full_name,
        email,
        phone,
        created_by_admin_id,
        created_by_role,
        is_active
      )
      VALUES (
        ${username},
        ${passwordHash},
        ${name},
        ${email || null},
        ${phone || null},
        ${adminId},
        ${adminRole},
        true
      )
      RETURNING id, username, full_name as name, email, phone, is_active, created_at
    `;

    console.log('Agent created successfully:', result[0].id);

    return NextResponse.json({
      success: true,
      message: 'Agent created successfully',
      data: result[0]
    }, { status: 201 });

  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // Check for specific database errors
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { success: false, error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    if (error.code === '23502') { // Not null violation
      return NextResponse.json(
        { success: false, error: 'Missing required field', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create agent',
        details: error.message,
        code: error.code
      },
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
      SET is_active = ${is_active}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Agent status updated successfully'
    });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update agent', details: error.message },
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
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete agent', details: error.message },
      { status: 500 }
    );
  }
}