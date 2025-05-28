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
      const writings = await prisma.writing.findMany({
        include: {
          sections: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(writings);
    }

    if (req.method === 'POST') {
      const { title, content } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const writing = await prisma.writing.create({
        data: {
          title,
          content: content || ''
        },
        include: {
          sections: {
            orderBy: { order: 'asc' }
          }
        }
      });

      return res.status(201).json(writing);
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