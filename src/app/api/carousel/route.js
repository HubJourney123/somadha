import { NextResponse } from 'next/server';
import { getActiveCarouselImages, addCarouselImage } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET - Fetch carousel images (public)
export async function GET(request) {
  try {
    const images = await getActiveCarouselImages();

    return NextResponse.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch carousel images' },
      { status: 500 }
    );
  }
}

// POST - Add carousel image (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['developer', 'politician'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { imageUrl, title, displayOrder } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const image = await addCarouselImage({
      imageUrl,
      title: title || '',
      displayOrder: displayOrder || 0
    });

    return NextResponse.json({
      success: true,
      data: image,
      message: 'Carousel image added successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding carousel image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add carousel image' },
      { status: 500 }
    );
  }
}