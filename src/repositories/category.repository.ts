import { createServerClient } from '@/lib/supabase/server';
import type { Category, Subcategory, CategoryWithSubcategories } from '@/features/catalog/types';

export class CategoryRepository {
  private supabase: ReturnType<typeof createServerClient>;

  constructor(supabase: ReturnType<typeof createServerClient>) {
    this.supabase = supabase;
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Category[];
  }

  async getActiveCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Category[];
  }

  async getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
    const categories = await this.getCategories();
    const subcategories = await this.getAllSubcategories();
    return categories.map((category) => ({
      ...category,
      subcategories: subcategories.filter((s) => s.category_id === category.id),
    }));
  }

  async getActiveCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
    const categories = await this.getActiveCategories();
    const subcategories = await this.getAllSubcategories();
    return categories.map((category) => ({
      ...category,
      subcategories: subcategories.filter(
        (s) => s.category_id === category.id && s.is_active
      ),
    }));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data as Category;
  }

  async getSubcategories(categoryId: string): Promise<Subcategory[]> {
    const { data, error } = await this.supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Subcategory[];
  }

  async getActiveSubcategories(categoryId: string): Promise<Subcategory[]> {
    const { data, error } = await this.supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Subcategory[];
  }

  async getAllSubcategories(): Promise<Subcategory[]> {
    const { data, error } = await this.supabase
      .from('subcategories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Subcategory[];
  }

  async getSubcategoryById(id: string): Promise<Subcategory | null> {
    const { data, error } = await this.supabase
      .from('subcategories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Subcategory;
  }

  async getSubcategoryBySlug(slug: string): Promise<Subcategory | null> {
    const { data, error } = await this.supabase
      .from('subcategories')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data as Subcategory;
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

  async createCategory(
    data: Omit<Category, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Category> {
    const available = await this.isSlugAvailable(data.slug);
    if (!available) {
      throw new Error('Slug already in use');
    }
    const { data: category, error } = await this.supabase
      .from('categories')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return category as Category;
  }

  async updateCategory(
    id: string,
    data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Category> {
    if (data.slug) {
      const available = await this.isSlugAvailable(data.slug, id);
      if (!available) {
        throw new Error('Slug already in use');
      }
    }
    const { data: category, error } = await this.supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return category as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const subcategories = await this.getSubcategories(id);
    if (subcategories.length > 0) {
      throw new Error('Category has subcategories');
    }
    const { count, error: countError } = await this.supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);
    if (countError) throw countError;
    if ((count ?? 0) > 0) {
      throw new Error('Category has products');
    }
    const { error } = await this.supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }

  async createSubcategory(
    data: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Subcategory> {
    const available = await this.isSlugAvailable(data.slug);
    if (!available) {
      throw new Error('Slug already in use');
    }
    const { data: subcategory, error } = await this.supabase
      .from('subcategories')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return subcategory as Subcategory;
  }

  async updateSubcategory(
    id: string,
    data: Partial<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Subcategory> {
    if (data.slug) {
      const available = await this.isSlugAvailable(data.slug, id);
      if (!available) {
        throw new Error('Slug already in use');
      }
    }
    const { data: subcategory, error } = await this.supabase
      .from('subcategories')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return subcategory as Subcategory;
  }

  async deleteSubcategory(id: string): Promise<void> {
    const { count, error: countError } = await this.supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('subcategory_id', id);
    if (countError) throw countError;
    if ((count ?? 0) > 0) {
      throw new Error('Subcategory has products');
    }
    const { error } = await this.supabase.from('subcategories').delete().eq('id', id);
    if (error) throw error;
  }
}
