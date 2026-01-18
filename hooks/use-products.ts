'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { enrichProducts, sortProducts, filterByPriceRange } from '@/lib/currency'
import type { Product, ProductDB } from '@/types/product'

interface UseProductsOptions {
  exchangeRate: number
  categoryId?: string  // ← On garde le nom mais c'est en fait le nom de catégorie (texte)
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'name' | 'created_at' | 'stock_quantity'
  sortOrder?: 'asc' | 'desc'
  includeOutOfStock?: boolean
  limit?: number
}

interface UseProductsReturn {
  products: Product[]
  filteredProducts: Product[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
  totalCount: number
  filteredCount: number
}

/**
 * Hook pour récupérer les produits avec TanStack Query
 */
export function useProducts(options: UseProductsOptions): UseProductsReturn {
  const {
    exchangeRate,
    categoryId,  // En réalité c'est le nom de catégorie (texte)
    searchQuery,
    minPrice,
    maxPrice,
    sortBy = 'created_at',
    sortOrder = 'desc',
    includeOutOfStock = true,
    limit
  } = options

  // Utiliser TanStack Query
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', categoryId, includeOutOfStock, limit],
    queryFn: async () => {
      console.log('🔍 useProducts query - categoryId:', categoryId)
      
      let query = supabase
        .from('products')
        .select('*')  // ✅ Pas de jointure avec categories
        .eq('is_available', true)  // ✅ Filtre is_available

      // ✅ Utiliser 'category' au lieu de 'category_id'
      if (categoryId) {
        query = query.eq('category', categoryId)
      }

      if (!includeOutOfStock) {
        query = query.gt('stock_quantity', 0)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error: fetchError } = await query

      console.log('📊 useProducts result:', {
        count: data?.length,
        error: fetchError
      })

      if (fetchError) {
        console.error('❌ useProducts error:', fetchError)
        throw new Error(`Erreur produits: ${fetchError.message}`)
      }

      // ✅ Convertir ProductDB[] en Product[] avec enrichProducts
      return enrichProducts((data || []) as ProductDB[], exchangeRate)
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  // Filtrage et tri (memoïsé)
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filtered = filterByPriceRange(filtered, minPrice, maxPrice, 'FC')
    }

    filtered = sortProducts(filtered, sortBy, sortOrder)

    return filtered
  }, [products, searchQuery, minPrice, maxPrice, sortBy, sortOrder])

  return {
    products,
    filteredProducts,
    isLoading,
    error: error as Error | null,
    refetch,
    totalCount: products.length,
    filteredCount: filteredProducts.length
  }
}