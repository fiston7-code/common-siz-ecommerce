'use client'

/**
 * ============================================
 * PRODUCT GRID - Grille de produits responsive
 * ============================================
 */

import { ProductCard } from './product-card'
import { Loader2, Package } from 'lucide-react'
import type { Product } from '@/types/product'
import  type {Currency} from "@/types/currency"

interface ProductGridProps {
  products: Product[]
  currency: Currency
  isLoading?: boolean
  emptyMessage?: string
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  columns?: 2 | 3 | 4 | 5
}

/**
 * Grille responsive pour afficher les produits
 */
export function ProductGrid({
  products,
  currency,
  isLoading = false,
  emptyMessage = 'Aucun produit trouvé',
  onAddToCart,
  onAddToWishlist,
  columns = 4
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">{emptyMessage}</p>
          <p className="text-gray-500 text-sm">Essayez de modifier vos filtres</p>
        </div>
      </div>
    )
  }

  // Grid classes based on columns
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  }

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currency={currency}
        />
      ))}
    </div>
  )
}