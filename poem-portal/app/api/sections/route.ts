import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/sections - Fetch all sections
export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      orderBy: {
        order: 'asc', // Order by the 'order' field
      },
      // Optionally, include poems in each section if needed directly
      // include: { poems: true }
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ message: 'Error fetching sections', error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/sections - Create a new section
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, iconName, accent, order } = body;

    if (!title || !iconName || !accent) {
      return NextResponse.json(
        { error: 'Title, iconName, and accent are required' },
        { status: 400 }
      );
    }

    // Ensure order is a number, default to 0 if not provided or invalid
    const sectionOrder = (typeof order === 'number' && !isNaN(order)) ? order : 0;

    const newSection = await prisma.section.create({
      data: {
        title,
        iconName,
        accent,
        order: sectionOrder,
      },
    });
    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    // Add more specific error handling if needed (e.g., Prisma unique constraint errors)
    return NextResponse.json({ message: 'Error creating section', error: (error as Error).message }, { status: 500 });
  }
} 