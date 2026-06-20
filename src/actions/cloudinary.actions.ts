'use server';

import { deleteFromCloudinary } from '@/lib/cloudinary/delete';

export async function deleteCloudinaryAsset(publicId: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await deleteFromCloudinary(publicId);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error deleting asset';
    return { success: false, error: message };
  }
}
