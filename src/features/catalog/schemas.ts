import { z } from 'zod';

export const MediaAssetSchema = z.object({
  public_id: z.string().min(1),
  secure_url: z.string().min(1),
});

export const CategoryFormSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers, and hyphens only',
  }),
  name_ar: z.string().min(1).max(200),
  name_en: z.string().min(1).max(200),
  image: MediaAssetSchema.nullable(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;

export const SubcategoryFormSchema = z.object({
  category_id: z.string().uuid(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers, and hyphens only',
  }),
  name_ar: z.string().min(1).max(200),
  name_en: z.string().min(1).max(200),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export type SubcategoryFormSchemaType = z.infer<typeof SubcategoryFormSchema>;

export const ProductAccordionSectionSchema = z.object({
  id: z.string().uuid().optional(),
  heading_ar: z.string().min(1).max(200),
  heading_en: z.string().min(1).max(200),
  description_ar: z.string().min(1).max(2000),
  description_en: z.string().min(1).max(2000),
  sort_order: z.number().int().min(0),
});

export const ProductImageSchema = z.object({
  id: z.string().uuid().optional(),
  image: MediaAssetSchema,
  sort_order: z.number().int().min(0),
  is_primary: z.boolean(),
});

export const ProductFormSchema = z
  .object({
    slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase letters, numbers, and hyphens only',
    }),
    category_id: z.string().uuid(),
    subcategory_id: z.string().uuid().nullable(),
    name_ar: z.string().min(1).max(200),
    name_en: z.string().min(1).max(200),
    summary_ar: z.string().min(1).max(500),
    summary_en: z.string().min(1).max(500),
    price: z.number().positive().multipleOf(0.01),
    compare_price: z.number().positive().multipleOf(0.01).nullable(),
    stock_count: z.number().int().min(0),
    is_featured: z.boolean(),
    is_best_seller: z.boolean(),
    status: z.enum(['active', 'draft', 'archived']),
    images: z.array(ProductImageSchema).max(10),
    accordion_sections: z.array(ProductAccordionSectionSchema),
  })
  .refine(
    (data) => {
      if (data.compare_price == null) return true;
      return data.compare_price > data.price;
    },
    {
      message: 'Compare-at price must be greater than price',
      path: ['compare_price'],
    }
  );

export type ProductFormSchemaType = z.infer<typeof ProductFormSchema>;
