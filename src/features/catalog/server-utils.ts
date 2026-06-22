import { createServerClient } from '@/lib/supabase/server';
import { ProductRepository } from '@/repositories/product.repository';
import type { ProductWithRelations } from './types';

export async function getFeaturedProducts(limit: number): Promise<ProductWithRelations[]> {
  const supabase = createServerClient();
  const repo = new ProductRepository(supabase);
  return repo.getFeaturedProducts(limit);
}

export async function getBestSellers(limit: number): Promise<ProductWithRelations[]> {
  const supabase = createServerClient();
  const repo = new ProductRepository(supabase);
  return repo.getBestSellers(limit);
}
