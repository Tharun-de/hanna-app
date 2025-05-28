import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hanna Backend API is running!' });
});

// GET /writings - Get all writings
app.get('/writings', async (req, res) => {
  try {
    const writings = await prisma.writing.findMany({
      orderBy: { createdAt: 'desc' },
      include: { section: true },
    });
    res.json(writings);
  } catch (error) {
    console.error('Error fetching writings:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// GET /writings/:id - Get specific writing
app.get('/writings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const writing = await prisma.writing.findUnique({
      where: { id },
      include: { section: true },
    });
    
    if (!writing) {
      return res.status(404).json({ message: 'Writing not found' });
    }
    
    res.json(writing);
  } catch (error) {
    console.error('Error fetching writing:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST /writings - Create new writing
app.post('/writings', async (req, res) => {
  try {
    const { title, content, sectionId, mood, date, likes } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const newWriting = await prisma.writing.create({
      data: {
        title: title?.trim() || null,
        content: content.trim(),
        sectionId: sectionId || null,
        mood: mood?.trim() || null,
        date: date?.trim() || null,
        likes: likes ? Math.max(0, parseInt(likes, 10)) : 0,
      },
      include: { section: true },
    });
    
    res.status(201).json(newWriting);
  } catch (error) {
    console.error('Error creating writing:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// PUT /writings/:id - Update writing
app.put('/writings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, sectionId, mood, date, likes } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const updatedWriting = await prisma.writing.update({
      where: { id },
      data: {
        title: title?.trim() || null,
        content: content.trim(),
        sectionId: sectionId || null,
        mood: mood?.trim() || null,
        date: date?.trim() || null,
        likes: likes ? Math.max(0, parseInt(likes, 10)) : 0,
      },
      include: { section: true },
    });
    
    res.json(updatedWriting);
  } catch (error) {
    console.error('Error updating writing:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Writing not found' });
    } else {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// DELETE /writings/:id - Delete writing
app.delete('/writings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.writing.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting writing:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Writing not found' });
    } else {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// GET /sections - Get all sections
app.get('/sections', async (req, res) => {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST /sections - Create new section
app.post('/sections', async (req, res) => {
  try {
    const { title, iconName, accent, order } = req.body;
    
    if (!title || !iconName || !accent) {
      return res.status(400).json({ message: 'Title, icon name, and accent are required' });
    }
    
    let newOrder = order;
    if (newOrder === undefined) {
      const lastSection = await prisma.section.findFirst({
        orderBy: { order: 'desc' },
      });
      newOrder = lastSection ? lastSection.order + 1 : 0;
    }
    
    const newSection = await prisma.section.create({
      data: { title, iconName, accent, order: newOrder },
    });
    
    res.status(201).json(newSection);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// PUT /sections/:id - Update section
app.put('/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, iconName, accent, order } = req.body;
    
    if (!title || !iconName || !accent) {
      return res.status(400).json({ message: 'Title, icon name, and accent are required' });
    }
    
    const updatedSection = await prisma.section.update({
      where: { id },
      data: { title, iconName, accent, order },
    });
    
    res.json(updatedSection);
  } catch (error) {
    console.error('Error updating section:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Section not found' });
    } else {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// DELETE /sections/:id - Delete section
app.delete('/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.section.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting section:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Section not found' });
    } else {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// GET /settings - Get site settings
app.get('/settings', async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    });
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 'singleton' },
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST /settings - Update site settings
app.post('/settings', async (req, res) => {
  try {
    const { mainHeader, twitterUrl, instagramUrl, snapchatUrl } = req.body;
    
    const updatedSettings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: { mainHeader, twitterUrl, instagramUrl, snapchatUrl },
      create: { id: 'singleton', mainHeader, twitterUrl, instagramUrl, snapchatUrl },
    });
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🔄 Shutting down gracefully...');
  prisma.$disconnect()
    .then(() => {
      console.log('✅ Database connection closed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Export for Vercel
export default app; 