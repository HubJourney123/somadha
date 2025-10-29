import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { 
  createComplaint, 
  getAllComplaints, 
  getUserByEmail 
} from '@/lib/db';

// GET - Fetch complaints
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const statusId = searchParams.get('statusId');
    const upazila = searchParams.get('upazila');
    const searchQuery = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const filters = {};
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (statusId) filters.statusId = parseInt(statusId);
    if (upazila) filters.upazila = upazila;
    if (searchQuery) filters.searchQuery = searchQuery;

    const complaints = await getAllComplaints(filters, limit, offset);

    return NextResponse.json({
      success: true,
      data: complaints,
      count: complaints.length
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

// POST - Create new complaint
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      categoryId,
      categoryName,
      upazila,
      unionName,
      details,
      imageUrl,
      isAnonymous
    } = body;

    // Validation
    if (!categoryId || !categoryName || !upazila || !unionName || !details) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let userId = null;

    // Get user ID if not anonymous and user is logged in
    if (!isAnonymous && session?.user?.email) {
      const user = await getUserByEmail(session.user.email);
      userId = user?.id || null;
    }

    const complaint = await createComplaint({
      userId,
      categoryId,
      categoryName,
      upazila,
      unionName,
      details,
      imageUrl: imageUrl || null,
      isAnonymous: isAnonymous || false
    });

    return NextResponse.json({
      success: true,
      data: complaint,
      message: 'Complaint submitted successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}