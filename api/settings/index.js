import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      let settings = await prisma.siteSettings.findUnique({
        where: { id: 'singleton' }
      });
      
      // If no settings exist, create default ones
      if (!settings) {
        settings = await prisma.siteSettings.create({
          data: {
            id: 'singleton',
            mainHeader: 'Hanna App',
            twitterUrl: '',
            instagramUrl: '',
            snapchatUrl: ''
          }
        });
      }
      
      return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
      const { mainHeader, twitterUrl, instagramUrl, snapchatUrl } = req.body;
      
      const settings = await prisma.siteSettings.upsert({
        where: { id: 'singleton' },
        update: {
          ...(mainHeader !== undefined && { mainHeader }),
          ...(twitterUrl !== undefined && { twitterUrl }),
          ...(instagramUrl !== undefined && { instagramUrl }),
          ...(snapchatUrl !== undefined && { snapchatUrl }),
          updatedAt: new Date()
        },
        create: {
          id: 'singleton',
          mainHeader: mainHeader || 'Hanna App',
          twitterUrl: twitterUrl || '',
          instagramUrl: instagramUrl || '',
          snapchatUrl: snapchatUrl || ''
        }
      });

      return res.status(200).json(settings);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
} 