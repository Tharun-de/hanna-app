import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma'; // Corrected import

const SETTINGS_ID = 1; // Fixed ID for the single settings row

// GET /api/settings - Fetch site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    if (!settings) {
      // If no settings exist yet, create a default one
      settings = await prisma.siteSettings.create({
        data: {
          id: SETTINGS_ID,
          mainHeader: 'Fictitious Scribbles', // Default header
          twitterUrl: '',
          instagramUrl: '',
          snapchatUrl: '',
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ message: 'Error fetching site settings', error: (error as Error).message }, { status: 500 });
  }
}

// POST /api/settings - Create or Update site settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mainHeader, twitterUrl, instagramUrl, snapchatUrl } = body;

    const updatedSettings = await prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {
        mainHeader,
        twitterUrl,
        instagramUrl,
        snapchatUrl,
      },
      create: {
        id: SETTINGS_ID,
        mainHeader: mainHeader || 'Fictitious Scribbles', // Default if not provided
        twitterUrl: twitterUrl || '',
        instagramUrl: instagramUrl || '',
        snapchatUrl: snapchatUrl || '',
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ message: 'Error updating site settings', error: (error as Error).message }, { status: 500 });
  }
} 