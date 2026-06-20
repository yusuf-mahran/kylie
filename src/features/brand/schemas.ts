import { z } from 'zod';

export const MediaAssetSchema = z.object({
  public_id: z.string().min(1),
  secure_url: z.string().min(1),
});

export const LocaleContentSchema = z.object({
  headline: z.string().max(120).optional(),
  subheading: z.string().optional(),
  body: z.string().optional(),
  cta: z.string().max(240).optional(),
});

export const SectionFormSchema = z.object({
  content_ar: LocaleContentSchema.refine(
    (data) => data.headline || data.cta,
    { message: 'Arabic headline or CTA is required' }
  ),
  content_en: LocaleContentSchema.refine(
    (data) => data.headline || data.cta,
    { message: 'English headline or CTA is required' }
  ),
  is_active: z.boolean(),
  sort_order: z.number().int(),
});

export type SectionFormData = z.infer<typeof SectionFormSchema>;
