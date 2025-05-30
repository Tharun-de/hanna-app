'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { Poem } from '@/app/generated/prisma';
import { Prisma } from '@/app/generated/prisma';

interface AddPoemResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function addPoem(
  data: { title: string | null; content: string }
): Promise<AddPoemResult> {
  if (!data.content && !data.title) {
    return { success: false, error: 'Title or Content is required.' };
  }

  try {
    await prisma.poem.create({
      data: {
        title: data.title || 'Untitled', // Default title if none provided
        content: data.content,
      },
    });

    revalidatePath('/'); // Revalidate the home page (where poems might be listed)
    revalidatePath('/admin'); // Revalidate the admin page (if poems are listed there)

    return { success: true, message: 'Poem added successfully!' };
  } catch (e) {
    console.error('Error adding poem:', e);
    // In a real app, you might want to log this error more robustly
    // and provide a more user-friendly error message.
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return { success: false, error: `Failed to add poem: ${errorMessage}` };
  }
}

// New Server Action to get poems for the admin page
export async function getPoemsForAdmin() {
  try {
    const poems = await prisma.poem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, poems };
  } catch (e) {
    console.error('Error fetching poems for admin:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return { success: false, error: `Failed to fetch poems: ${errorMessage}`, poems: [] };
  }
}

// Updated Server Action to update a poem
interface UpdatePoemData {
  id: string;
  title: string | null;
  content: string;
}

interface UpdatePoemResult {
  success: boolean;
  message?: string;
  error?: string;
  poem?: Poem;
}

export async function updatePoem(
  data: UpdatePoemData
): Promise<UpdatePoemResult> {
  if (!data.id) {
    return { success: false, error: 'Poem ID is required for an update.' };
  }
  if (!data.content && !data.title) {
    return { success: false, error: 'Title or Content is required.' };
  }

  try {
    const updatedPoemDetails = await prisma.poem.update({
      where: { id: data.id },
      data: {
        title: data.title || 'Untitled',
        content: data.content,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/poems/${data.id}`); // If you have a specific page for a single poem

    return { success: true, message: 'Poem updated successfully!', poem: updatedPoemDetails };
  } catch (e) {
    console.error('Error updating poem:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Check for specific Prisma error for record not found
      if (e.code === 'P2025') {
        return { success: false, error: 'Failed to update poem: Record not found.' };
      }
      // You can add more specific Prisma error checks here if needed
      return { success: false, error: `Failed to update poem: Prisma error ${e.code}` };
    } else if (e instanceof Error) {
      return { success: false, error: `Failed to update poem: ${e.message}` };
    }
    return { success: false, error: 'Failed to update poem: An unknown error occurred' };
  }
}

// New Server Action to delete a poem
interface DeletePoemResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function deletePoem(id: string): Promise<DeletePoemResult> {
  if (!id) {
    return { success: false, error: 'Poem ID is required for deletion.' };
  }

  try {
    await prisma.poem.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    // No need to revalidate /poems/${id} as it won't exist

    return { success: true, message: 'Poem deleted successfully!' };
  } catch (e) {
    console.error('Error deleting poem:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') { // Record to delete not found
        return { success: false, error: 'Failed to delete poem: Record not found.' };
      }
      return { success: false, error: `Failed to delete poem: Prisma error ${e.code}` };
    } else if (e instanceof Error) {
      return { success: false, error: `Failed to delete poem: ${e.message}` };
    }
    return { success: false, error: 'Failed to delete poem: An unknown error occurred' };
  }
} 