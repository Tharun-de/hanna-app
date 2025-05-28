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

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const writing = await prisma.writing.findUnique({
        where: { id: parseInt(id) },
        include: {
          sections: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!writing) {
        return res.status(404).json({ error: 'Writing not found' });
      }

      return res.status(200).json(writing);
    }

    if (req.method === 'PUT') {
      const { title, content } = req.body;

      const writing = await prisma.writing.update({
        where: { id: parseInt(id) },
        data: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          updatedAt: new Date()
        },
        include: {
          sections: {
            orderBy: { order: 'asc' }
          }
        }
      });

      return res.status(200).json(writing);
    }

    if (req.method === 'DELETE') {
      // Delete all sections first
      await prisma.section.deleteMany({
        where: { writingId: parseInt(id) }
      });

      // Delete the writing
      await prisma.writing.delete({
        where: { id: parseInt(id) }
      });

      return res.status(200).json({ message: 'Writing deleted successfully' });
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