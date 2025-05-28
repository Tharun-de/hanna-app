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
      const sections = await prisma.section.findMany({
        include: {
          writings: true
        },
        orderBy: { order: 'asc' }
      });
      return res.status(200).json(sections);
    }

    if (req.method === 'POST') {
      const { title, iconName, accent, order } = req.body;

      if (!title || !iconName || !accent) {
        return res.status(400).json({ error: 'Title, iconName, and accent are required' });
      }

      const section = await prisma.section.create({
        data: {
          title,
          iconName,
          accent,
          order: order || 0
        },
        include: {
          writings: true
        }
      });

      return res.status(201).json(section);
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