'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { ProductCategory } from '@/types/product'

interface UseCategoriesReturn {
  categories: ProductCategory[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook pour les catégories avec TanStack Query
 */
export function useCategories(): UseCategoriesReturn {
  const {
    data: categories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (fetchError) {
        throw new Error(`Erreur catégories: ${fetchError.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (les catégories changent rarement)
    gcTime: 1000 * 60 * 60, // 1 heure
  })

  return {
    categories,
    isLoading,
    error: error as Error | null,
    refetch
  }
}