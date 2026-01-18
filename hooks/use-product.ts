'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { enrichProduct } from '@/lib/currency'
import type { Product, ProductDB } from '@/types/product'

interface UseProductOptions {
  productId: string
  exchangeRate: number
}

interface UseProductReturn {
  product: Product | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook pour un seul produit avec TanStack Query
 */
export function useProduct(options: UseProductOptions): UseProductReturn {
  const { productId, exchangeRate } = options

  const {
    data: product = null,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', productId)
        .single()

      if (fetchError) {
        throw new Error(`Erreur produit: ${fetchError.message}`)
      }

      if (!data) {
        throw new Error('Produit introuvable')
      }

      return enrichProduct(data as ProductDB, exchangeRate)
    },
    enabled: !!productId, // Ne lance la requête que si productId existe
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    product,
    isLoading,
    error: error as Error | null,
    refetch
  }
}