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
    if (req.method === 'PUT') {
      const { title, iconName, accent, order } = req.body;

      const section = await prisma.section.update({
        where: { id: String(id) },
        data: {
          ...(title !== undefined && { title }),
          ...(iconName !== undefined && { iconName }),
          ...(accent !== undefined && { accent }),
          ...(order !== undefined && { order }),
          updatedAt: new Date()
        },
        include: {
          writings: true
        }
      });

      return res.status(200).json(section);
    }

    if (req.method === 'DELETE') {
      await prisma.section.delete({
        where: { id: String(id) }
      });

      return res.status(200).json({ message: 'Section deleted successfully' });
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