import { createServerClient } from '@/lib/supabase/server';
import { deleteCloudinaryAsset } from '@/actions/cloudinary.actions';
import type {
  Product,
  ProductImage,
  ProductAccordionSection,
  ProductWithRelations,
  ProductFilters,
  PaginatedResult,
} from '@/features/catalog/types';

const DEFAULT_PAGE_SIZE = 24;

export class ProductRepository {
  private supabase: ReturnType<typeof createServerClient>;

  constructor(supabase: ReturnType<typeof createServerClient>) {
    this.supabase = supabase;
  }

  private baseQuery(count?: 'exact') {
    return this.supabase
      .from('products')
      .select(
        `*,
        category:categories(*),
        subcategory:subcategories(*),
        images:product_images(*),
        accordion_sections:product_accordion_sections(*)`,
        count ? { count } : undefined
      );
  }

  private mapProduct(row: Record<string, unknown>): ProductWithRelations {
    const product = row as unknown as ProductWithRelations;
    product.images = (product.images as ProductImage[]).sort((a, b) => a.sort_order - b.sort_order);
    product.accordion_sections = (product.accordion_sections as ProductAccordionSection[]).sort(
      (a, b) => a.sort_order - b.sort_order
    );
    return product;
  }

  private async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const queries = [
      this.supabase.from('categories').select('id').eq('slug', slug),
      this.supabase.from('subcategories').select('id').eq('slug', slug),
      this.supabase.from('products').select('id').eq('slug', slug),
    ];
    const results = await Promise.all(queries);
    for (const result of results) {
      if (result.error) throw result.error;
      const rows = result.data ?? [];
      for (const row of rows) {
        if (!excludeId || row.id !== excludeId) {
          return false;
        }
      }
    }
    return true;
  }

  async getProducts(
    filters: ProductFilters = {}
  ): Promise<PaginatedResult<ProductWithRelations>> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.baseQuery('exact');

    if (filters.status) {
      query = query.eq('status', filters.status);
      if (filters.status === 'active') {
        query = query.eq('category.is_active', true);
      }
    }

    if (filters.featured) {
      query = query.eq('is_featured', true);
    }

    if (filters.bestSeller) {
      query = query.eq('is_best_seller', true);
    }

    if (filters.categorySlug) {
      const { data } = await this.supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single();
      if (data?.id) {
        query = query.eq('category_id', data.id);
      } else {
        return { data: [], total: 0, page, pageSize };
      }
    }

    if (filters.subcategorySlug) {
      const { data } = await this.supabase
        .from('subcategories')
        .select('id')
        .eq('slug', filters.subcategorySlug)
        .single();
      if (data?.id) {
        query = query.eq('subcategory_id', data.id);
      } else {
        return { data: [], total: 0, page, pageSize };
      }
    }

    if (filters.search && filters.search.trim().length > 0) {
      return this.searchProducts(filters.search, { page, pageSize });
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data ?? []).map((row) => this.mapProduct(row)),
      total: count ?? 0,
      page,
      pageSize,
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    const { data, error } = await this.baseQuery().eq('slug', slug).single();
    if (error || !data) return null;
    return this.mapProduct(data);
  }

  async getProductsByCategory(
    categoryId: string,
    options: { page?: number; pageSize?: number } = {}
  ): Promise<PaginatedResult<ProductWithRelations>> {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, options.pageSize ?? DEFAULT_PAGE_SIZE));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.baseQuery('exact')
      .eq('status', 'active')
      .eq('category_id', categoryId)
      .eq('category.is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data ?? []).map((row) => this.mapProduct(row)),
      total: count ?? 0,
      page,
      pageSize,
    };
  }

  async getBestSellers(limit: number): Promise<ProductWithRelations[]> {
    const { data, error } = await this.baseQuery()
      .eq('status', 'active')
      .eq('is_best_seller', true)
      .eq('category.is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => this.mapProduct(row));
  }

  async getFeaturedProducts(limit: number): Promise<ProductWithRelations[]> {
    const { data, error } = await this.baseQuery()
      .eq('status', 'active')
      .eq('is_featured', true)
      .eq('category.is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => this.mapProduct(row));
  }

  async searchProducts(
    query: string,
    options: { page?: number; pageSize?: number } = {}
  ): Promise<PaginatedResult<ProductWithRelations>> {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, options.pageSize ?? DEFAULT_PAGE_SIZE));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const term = `%${query.trim()}%`;

    const { data, error, count } = await this.baseQuery('exact')
      .eq('status', 'active')
      .eq('category.is_active', true)
      .or(
        `name_ar.ilike.${term},name_en.ilike.${term},summary_ar.ilike.${term},summary_en.ilike.${term}`
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data ?? []).map((row) => this.mapProduct(row)),
      total: count ?? 0,
      page,
      pageSize,
    };
  }

  async createProduct(
    data: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
      images?: Omit<ProductImage, 'id' | 'product_id'>[];
      accordion_sections?: Omit<ProductAccordionSection, 'id' | 'product_id' | 'created_at' | 'updated_at'>[];
    }
  ): Promise<ProductWithRelations> {
    const available = await this.isSlugAvailable(data.slug);
    if (!available) {
      throw new Error('Slug already in use');
    }

    const { images = [], accordion_sections = [], ...productData } = data;
    const normalizedImages = this.normalizeImages(images);
    const normalizedSections = this.normalizeAccordionSections(accordion_sections);

    const { data: product, error } = await this.supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    if (error) throw error;

    if (normalizedImages.length > 0) {
      const { error: imgError } = await this.supabase.from('product_images').insert(
        normalizedImages.map((img) => ({ ...img, product_id: product.id }))
      );
      if (imgError) throw imgError;
    }

    if (normalizedSections.length > 0) {
      const { error: secError } = await this.supabase.from('product_accordion_sections').insert(
        normalizedSections.map((sec) => ({ ...sec, product_id: product.id }))
      );
      if (secError) throw secError;
    }

    const result = await this.getProductBySlug(product.slug);
    if (!result) throw new Error('Failed to load created product');
    return result;
  }

  async updateProduct(
    id: string,
    data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>> & {
      images?: (Omit<ProductImage, 'id' | 'product_id'> | ProductImage)[];
      accordion_sections?: (Omit<ProductAccordionSection, 'id' | 'product_id' | 'created_at' | 'updated_at'> | ProductAccordionSection)[];
    }
  ): Promise<ProductWithRelations> {
    if (data.slug) {
      const available = await this.isSlugAvailable(data.slug, id);
      if (!available) {
        throw new Error('Slug already in use');
      }
    }

    const existing = await this.getProductById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    const { images, accordion_sections, ...productData } = data;

    const { error } = await this.supabase.from('products').update(productData).eq('id', id);
    if (error) throw error;

    if (images) {
      await this.updateProductImages(id, images, existing.images);
    }

    if (accordion_sections) {
      await this.updateProductAccordionSections(id, accordion_sections, existing.accordion_sections);
    }

    const result = await this.getProductById(id);
    if (!result) throw new Error('Failed to load updated product');
    return result;
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await this.getProductById(id);
    if (existing) {
      for (const img of existing.images) {
        await deleteCloudinaryAsset(img.image.public_id);
      }
    }
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }

  async getProductById(id: string): Promise<ProductWithRelations | null> {
    const { data, error } = await this.baseQuery().eq('id', id).single();
    if (error || !data) return null;
    return this.mapProduct(data);
  }

  private normalizeImages(
    images: Omit<ProductImage, 'id' | 'product_id'>[]
  ): Omit<ProductImage, 'id' | 'product_id'>[] {
    const sorted = images
      .slice(0, 10)
      .map((img, index) => ({ ...img, sort_order: img.sort_order ?? index }))
      .sort((a, b) => a.sort_order - b.sort_order);

    const hasPrimary = sorted.some((img) => img.is_primary);
    if (!hasPrimary && sorted.length > 0) {
      sorted[0].is_primary = true;
    }

    return sorted;
  }

  private normalizeAccordionSections(
    sections: Omit<ProductAccordionSection, 'id' | 'product_id' | 'created_at' | 'updated_at'>[]
  ): Omit<ProductAccordionSection, 'id' | 'product_id' | 'created_at' | 'updated_at'>[] {
    return sections.map((sec, index) => ({
      ...sec,
      sort_order: sec.sort_order ?? index,
    }));
  }

  private async updateProductImages(
    productId: string,
    images: (Omit<ProductImage, 'id' | 'product_id'> | ProductImage)[],
    existingImages: ProductImage[]
  ): Promise<void> {
    const normalized = this.normalizeImages(
      images.map((img) => ({
        product_id: productId,
        image: img.image,
        sort_order: img.sort_order,
        is_primary: img.is_primary,
      }))
    );

    const keepIds = new Set(
      images.map((img) => ('id' in img && img.id ? img.id : undefined)).filter(Boolean)
    );
    const toDelete = existingImages.filter((img) => !keepIds.has(img.id));

    for (const img of toDelete) {
      await deleteCloudinaryAsset(img.image.public_id);
    }

    if (toDelete.length > 0) {
      const { error } = await this.supabase
        .from('product_images')
        .delete()
        .in(
          'id',
          toDelete.map((img) => img.id)
        );
      if (error) throw error;
    }

    for (const img of normalized) {
      if ('id' in img && img.id) {
        const existing = existingImages.find((i) => i.id === img.id);
        if (existing && existing.image.public_id !== img.image.public_id) {
          await deleteCloudinaryAsset(existing.image.public_id);
        }
        const { error } = await this.supabase
          .from('product_images')
          .update({
            image: img.image,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
          })
          .eq('id', img.id);
        if (error) throw error;
      } else {
        const { error } = await this.supabase.from('product_images').insert({
          product_id: productId,
          image: img.image,
          sort_order: img.sort_order,
          is_primary: img.is_primary,
        });
        if (error) throw error;
      }
    }
  }

  private async updateProductAccordionSections(
    productId: string,
    sections: (Omit<ProductAccordionSection, 'id' | 'product_id' | 'created_at' | 'updated_at'> | ProductAccordionSection)[],
    existingSections: ProductAccordionSection[]
  ): Promise<void> {
    const normalized = this.normalizeAccordionSections(
      sections.map((sec) => ({
        product_id: productId,
        heading_ar: sec.heading_ar,
        heading_en: sec.heading_en,
        description_ar: sec.description_ar,
        description_en: sec.description_en,
        sort_order: sec.sort_order,
      }))
    );

    const keepIds = new Set(
      sections.map((sec) => ('id' in sec && sec.id ? sec.id : undefined)).filter(Boolean)
    );
    const toDelete = existingSections.filter((sec) => !keepIds.has(sec.id));

    if (toDelete.length > 0) {
      const { error } = await this.supabase
        .from('product_accordion_sections')
        .delete()
        .in(
          'id',
          toDelete.map((sec) => sec.id)
        );
      if (error) throw error;
    }

    for (const sec of normalized) {
      if ('id' in sec && sec.id) {
        const { error } = await this.supabase
          .from('product_accordion_sections')
          .update({
            heading_ar: sec.heading_ar,
            heading_en: sec.heading_en,
            description_ar: sec.description_ar,
            description_en: sec.description_en,
            sort_order: sec.sort_order,
          })
          .eq('id', sec.id);
        if (error) throw error;
      } else {
        const { error } = await this.supabase.from('product_accordion_sections').insert({
          product_id: productId,
          heading_ar: sec.heading_ar,
          heading_en: sec.heading_en,
          description_ar: sec.description_ar,
          description_en: sec.description_en,
          sort_order: sec.sort_order,
        });
        if (error) throw error;
      }
    }
  }
}
