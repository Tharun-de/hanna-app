import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@/app/generated/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT /api/sections/[id] - Update a section
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  try {
    const body = await request.json();
    // Only include fields that are present in the body for update
    const dataToUpdate: Prisma.SectionUpdateInput = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.iconName !== undefined) dataToUpdate.iconName = body.iconName;
    if (body.accent !== undefined) dataToUpdate.accent = body.accent;
    if (body.order !== undefined && typeof body.order === 'number' && !isNaN(body.order)) {
      dataToUpdate.order = body.order;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    const updatedSection = await prisma.section.update({
      where: { id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error(`Error updating section ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }
    return NextResponse.json({ message: `Error updating section ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/sections/[id] - Delete a section
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;
  try {
    // Prisma transaction to ensure both operations (update poems and delete section) succeed or fail together
    await prisma.$transaction(async (tx) => {
      // 1. Unassign poems from this section
      await tx.poem.updateMany({
        where: { sectionId: id },
        data: { sectionId: null },
      });

      // 2. Delete the section
      await tx.section.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: 'Section deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting section ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }
    return NextResponse.json({ message: `Error deleting section ${id}`, error: (error as Error).message }, { status: 500 });
  }
} 