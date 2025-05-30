import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/app/generated/prisma';

// GET /api/poems - Fetch all poems
export async function GET() {
  try {
    const poems = await prisma.poem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poems', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/poems - Create a new poem
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, sectionId, date, mood, likes } = body;

    if (!content && !title) {
      return NextResponse.json(
        { error: 'Title or Content is required' },
        { status: 400 }
      );
    }

    const dataToCreate: Prisma.PoemCreateInput = {
      title: title || 'Untitled',
      content: content || '',
    };

    if (sectionId !== undefined) {
      dataToCreate.section = sectionId ? { connect: { id: sectionId } } : undefined;
    }
    if (date !== undefined) dataToCreate.date = date ? new Date(date) : null;
    if (mood !== undefined) dataToCreate.mood = mood;
    if (likes !== undefined && typeof likes === 'number') dataToCreate.likes = likes;

    const newPoem = await prisma.poem.create({ data: dataToCreate });
    return NextResponse.json(newPoem, { status: 201 });
  } catch (error) {
    console.error('Error creating poem:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' }, 
        { status: 400 }
      );
    }
    return NextResponse.json({ message: 'Error creating poem', error: (error as Error).message }, { status: 500 });
  }
}

/* Remove OPTIONS handler, now handled by middleware
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
*/ 