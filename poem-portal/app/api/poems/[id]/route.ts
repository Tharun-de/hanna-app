import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/app/generated/prisma'; // For Prisma-specific error types

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/poems/[id] - Fetch a single poem
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  try {
    const poem = await prisma.poem.findUnique({
      where: { id },
    });
    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }
    return NextResponse.json(poem);
  } catch (error) {
    console.error(`Error fetching poem ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch poem', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/poems/[id] - Update a poem
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  try {
    const body = await request.json();
    const { title, content, sectionId, date, mood, likes } = body;

    const dataToUpdate: Prisma.PoemUpdateInput = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;
    
    if (sectionId !== undefined) {
      dataToUpdate.section = sectionId ? { connect: { id: sectionId } } : { disconnect: true };
    }
    if (date !== undefined) dataToUpdate.date = date ? new Date(date) : null;
    if (mood !== undefined) dataToUpdate.mood = mood;
    if (likes !== undefined) dataToUpdate.likes = (typeof likes === 'number') ? likes : null;

    // Prevent update if no actual data fields are being changed (e.g. empty body)
    // Note: sectionId: null is a valid change (disconnecting)
    // Date, mood, likes being set to null are also valid changes.
    let hasActualChanges = false;
    if (title !== undefined || content !== undefined || sectionId !== undefined || date !== undefined || mood !== undefined || likes !== undefined) {
        hasActualChanges = true;
    }
    if (!hasActualChanges) {
        return NextResponse.json({ error: "No fields provided for update"}, { status: 400 });
    }

    const updatedPoem = await prisma.poem.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedPoem);
  } catch (error) {
    console.error(`Error updating poem ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { 
        return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
      }
      return NextResponse.json({ error: `Prisma error: ${error.code}`}, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update poem', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/poems/[id] - Delete a poem
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;
  try {
    await prisma.poem.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Poem deleted successfully' }, { status: 200 }); 
  } catch (error) {
    console.error(`Error deleting poem ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { 
        return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
      }
      return NextResponse.json({ error: `Prisma error: ${error.code}`}, { status: 400 });
    }
    return NextResponse.json({ message: 'Error deleting poem', error: (error as Error).message }, { status: 500 });
  }
}

/* Remove OPTIONS handler, now handled by middleware
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
*/ 