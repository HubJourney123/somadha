import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createAgent, getAllAgents, updateAgent, deleteAgent } from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET - Fetch all agents
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Only developer and politician can access
    if (!session || !['developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const agents = await getAllAgents();

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

    // Only developer and politician can create agents
    if (!session || !['developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, password, fullName, phone, email } = body;

    // Validation
    if (!username || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Username, password, and full name are required' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const agent = await createAgent({
      username,
      passwordHash,
      fullName,
      phone: phone || null,
      email: email || null,
      createdByAdminId: parseInt(session.user.id),
      createdByRole: session.user.role
    });

    return NextResponse.json({
      success: true,
      data: agent,
      message: 'Agent created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    
    if (error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

// PATCH - Update agent
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
    const { agentId, fullName, phone, email, isActive, password } = body;

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const agent = await updateAgent(agentId, updateData);

    return NextResponse.json({
      success: true,
      data: agent,
      message: 'Agent updated successfully'
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

    if (!session || !['developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('id');

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    await deleteAgent(parseInt(agentId));

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