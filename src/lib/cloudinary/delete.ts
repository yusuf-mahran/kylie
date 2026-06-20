import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== 'ok') {
    throw new Error(`Failed to delete Cloudinary asset: ${publicId}`);
  }
}
