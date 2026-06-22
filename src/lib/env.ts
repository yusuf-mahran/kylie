import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  OPENROUTER_API_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    // Avoid throwing during build; surface warnings for missing environment variables.
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(`Environment validation warnings: ${issues}`);
    }
  }

export const env = parsed.success ? parsed.data : (process.env as unknown as z.infer<typeof envSchema>);
