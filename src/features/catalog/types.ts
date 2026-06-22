export type MediaAsset = {
  public_id: string;
  secure_url: string;
};

export type Category = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  image: MediaAsset | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductStatus = 'active' | 'draft' | 'archived';

export type ProductAccordionSection = {
  id: string;
  product_id: string;
  heading_ar: string;
  heading_en: string;
  description_ar: string;
  description_en: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  slug: string;
  category_id: string;
  subcategory_id: string | null;
  name_ar: string;
  name_en: string;
  summary_ar: string;
  summary_en: string;
  price: number;
  compare_price: number | null;
  stock_count: number;
  is_featured: boolean;
  is_best_seller: boolean;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image: MediaAsset;
  sort_order: number;
  is_primary: boolean;
};

export type ProductWithRelations = Product & {
  category: Category;
  subcategory: Subcategory | null;
  images: ProductImage[];
  accordion_sections: ProductAccordionSection[];
};

export type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

export type ProductFilters = {
  categorySlug?: string;
  subcategorySlug?: string;
  featured?: boolean;
  bestSeller?: boolean;
  search?: string;
  status?: ProductStatus;
  page?: number;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type CategoryFormData = {
  slug: string;
  name_ar: string;
  name_en: string;
  image: MediaAsset | null;
  sort_order: number;
  is_active: boolean;
};

export type SubcategoryFormData = {
  category_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  sort_order: number;
  is_active: boolean;
};

export type ProductImageFormData = {
  id?: string;
  image: MediaAsset;
  sort_order: number;
  is_primary: boolean;
};

export type ProductAccordionSectionFormData = {
  id?: string;
  heading_ar: string;
  heading_en: string;
  description_ar: string;
  description_en: string;
  sort_order: number;
};

export type ProductFormData = {
  slug: string;
  category_id: string;
  subcategory_id: string | null;
  name_ar: string;
  name_en: string;
  summary_ar: string;
  summary_en: string;
  price: number;
  compare_price: number | null;
  stock_count: number;
  is_featured: boolean;
  is_best_seller: boolean;
  status: ProductStatus;
  images: ProductImageFormData[];
  accordion_sections: ProductAccordionSectionFormData[];
};
