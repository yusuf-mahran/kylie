'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { CategoryRepository } from '@/repositories/category.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { deleteCloudinaryAsset } from './cloudinary.actions';
import type {
  CategoryFormSchemaType,
  SubcategoryFormSchemaType,
  ProductFormSchemaType,
} from '@/features/catalog/schemas';
import type { Category, Subcategory } from '@/features/catalog/types';

const CATEGORIES_ADMIN_PATH = '/admin/categories';
const PRODUCTS_ADMIN_PATH = '/admin/products';
const SHOP_PATH = '/shop';

function getCategoryRepo() {
  const supabase = createServerClient();
  return new CategoryRepository(supabase);
}

function getProductRepo() {
  const supabase = createServerClient();
  return new ProductRepository(supabase);
}

// Categories

export async function getCategories() {
  return getCategoryRepo().getCategories();
}

export async function getCategoriesWithSubcategories() {
  return getCategoryRepo().getCategoriesWithSubcategories();
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return getCategoryRepo().getCategoryById(id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return getCategoryRepo().getCategoryBySlug(slug);
}

export async function getSubcategories(categoryId: string): Promise<Subcategory[]> {
  return getCategoryRepo().getSubcategories(categoryId);
}

export async function createCategory(data: CategoryFormSchemaType) {
  const repo = getCategoryRepo();
  const category = await repo.createCategory(data);
  revalidatePath(CATEGORIES_ADMIN_PATH);
  return category;
}

export async function updateCategory(id: string, data: CategoryFormSchemaType) {
  const repo = getCategoryRepo();
  const existing = await repo.getCategoryById(id);
  if (existing?.image?.public_id && existing.image.public_id !== (data.image?.public_id ?? '')) {
    await deleteCloudinaryAsset(existing.image.public_id);
  }
  const category = await repo.updateCategory(id, data);
  revalidatePath(CATEGORIES_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
  return category;
}

export async function deleteCategory(id: string) {
  const repo = getCategoryRepo();
  const existing = await repo.getCategoryById(id);
  if (existing?.image?.public_id) {
    await deleteCloudinaryAsset(existing.image.public_id);
  }
  await repo.deleteCategory(id);
  revalidatePath(CATEGORIES_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
}

export async function createSubcategory(categoryId: string, data: SubcategoryFormSchemaType) {
  const repo = getCategoryRepo();
  const subcategory = await repo.createSubcategory({ ...data, category_id: categoryId });
  revalidatePath(CATEGORIES_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
  return subcategory;
}

export async function updateSubcategory(id: string, data: Partial<SubcategoryFormSchemaType>) {
  const repo = getCategoryRepo();
  const subcategory = await repo.updateSubcategory(id, data);
  revalidatePath(CATEGORIES_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
  return subcategory;
}

export async function deleteSubcategory(id: string) {
  const repo = getCategoryRepo();
  await repo.deleteSubcategory(id);
  revalidatePath(CATEGORIES_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
}

// Products

export async function getProducts(filters?: Parameters<ProductRepository['getProducts']>[0]) {
  return getProductRepo().getProducts(filters);
}

export async function getProductBySlug(slug: string) {
  return getProductRepo().getProductBySlug(slug);
}

export async function getProductById(id: string) {
  return getProductRepo().getProductById(id);
}

export async function getBestSellers(limit: number) {
  return getProductRepo().getBestSellers(limit);
}

export async function getFeaturedProducts(limit: number) {
  return getProductRepo().getFeaturedProducts(limit);
}

export async function createProduct(data: ProductFormSchemaType) {
  const repo = getProductRepo();
    const product = await repo.createProduct({
    ...data,
    subcategory_id: data.subcategory_id,
    images: data.images.map((img) => ({
      image: img.image,
      sort_order: img.sort_order,
      is_primary: img.is_primary,
    })),
    accordion_sections: data.accordion_sections.map((sec) => ({
      heading_ar: sec.heading_ar,
      heading_en: sec.heading_en,
      description_ar: sec.description_ar,
      description_en: sec.description_en,
      sort_order: sec.sort_order,
    })),
  });
  revalidatePath(PRODUCTS_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
  return product;
}

export async function updateProduct(id: string, data: ProductFormSchemaType) {
  const repo = getProductRepo();
    const product = await repo.updateProduct(id, {
    ...data,
    subcategory_id: data.subcategory_id,
    images: data.images.map((img) => ({
      id: img.id,
      image: img.image,
      sort_order: img.sort_order,
      is_primary: img.is_primary,
    })),
    accordion_sections: data.accordion_sections.map((sec) => ({
      id: sec.id,
      heading_ar: sec.heading_ar,
      heading_en: sec.heading_en,
      description_ar: sec.description_ar,
      description_en: sec.description_en,
      sort_order: sec.sort_order,
    })),
  });
  revalidatePath(PRODUCTS_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
  return product;
}

export async function deleteProduct(id: string) {
  const repo = getProductRepo();
  await repo.deleteProduct(id);
  revalidatePath(PRODUCTS_ADMIN_PATH);
  revalidatePath(SHOP_PATH);
}
