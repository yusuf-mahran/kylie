/**
 * Product Catalog Contracts
 *
 * TypeScript interfaces and repository contracts for the Product Catalog feature.
 * These contracts define the public surface of the catalog domain and are consumed
 * by admin dashboard pages and storefront shop/product-detail pages.
 */

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

export type CategoryRepositoryContract = {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  getSubcategories(categoryId: string): Promise<Subcategory[]>;
  createCategory(
    data: Omit<Category, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Category>;
  updateCategory(
    id: string,
    data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  createSubcategory(
    data: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Subcategory>;
  updateSubcategory(
    id: string,
    data: Partial<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Subcategory>;
  deleteSubcategory(id: string): Promise<void>;
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

export type ProductRepositoryContract = {
  getProducts(
    filters: ProductFilters
  ): Promise<PaginatedResult<ProductWithRelations>>;
  getProductBySlug(slug: string): Promise<ProductWithRelations | null>;
  getProductsByCategory(
    categoryId: string,
    options?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<ProductWithRelations>>;
  getBestSellers(limit: number): Promise<ProductWithRelations[]>;
  getFeaturedProducts(limit: number): Promise<ProductWithRelations[]>;
  searchProducts(
    query: string,
    options?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<ProductWithRelations>>;
  createProduct(
    data: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
      images?: Omit<ProductImage, 'id'>[];
      accordion_sections?: Omit<ProductAccordionSection, 'id' | 'product_id'>[];
    }
  ): Promise<ProductWithRelations>;
  updateProduct(
    id: string,
    data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>> & {
      images?: Omit<ProductImage, 'id'>[];
      accordion_sections?: Omit<ProductAccordionSection, 'id' | 'product_id'>[];
    }
  ): Promise<ProductWithRelations>;
  deleteProduct(id: string): Promise<void>;
};

export type CloudinaryActionsContract = {
  deleteCloudinaryAsset(publicId: string): Promise<void>;
};

export type AiEnhancementContract = {
  enhanceCatalogContent(context: {
    type: 'title' | 'slug' | 'summary' | 'description' | 'accordion';
    currentValue?: string;
    productContext?: {
      name_ar?: string;
      name_en?: string;
      categoryName?: string;
    };
  }): Promise<{
    ar: string;
    en: string;
    slug?: string;
  }>;
};
