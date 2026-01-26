'use client'

import { useState } from 'react'
import { ProductGrid } from './product-grid'
import { ProductFilters } from './product-filters'
import { Pagination } from './pagination'
import { useCurrency } from '@/hooks'
import type { Product, Category } from '@/types/product' 
import { ExchangeRateManager } from '@/components/admin/ExchangeRateManager'
// ✅ Interface pour les catégories


interface ProductsPageClientProps {
  initialProducts: Product[]
  categories: Category[]  // ✅ Type précis au lieu de ProductDB[]
  currentPage: number
  totalPages: number
  totalProducts: number
  exchangeRate: number
  initialFilters: {
    categoryId?: string
    searchQuery: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
}

export function ProductsPageClient({
  initialProducts,
  categories,
  currentPage: initialPage,
  totalPages,
  totalProducts,
  exchangeRate,
  initialFilters
}: ProductsPageClientProps) {
  const { currency } = useCurrency()
  const [currentPage, setCurrentPage] = useState(initialPage)

  const startIndex = (currentPage - 1) * 12
  const endIndex = Math.min(startIndex + 12, totalProducts)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nos Produits
          </h1>
          <p className="text-gray-600">
            Affichage de {startIndex + 1}-{endIndex} sur {totalProducts} produits
          </p>
        </div>

    


{/* Exchange Rate Info */}
        <ExchangeRateManager 
  mode="display" 
  currentRate={exchangeRate} 
/>

        {/* Filters */}
        <ProductFilters
          categories={categories}
          selectedCategoryId={initialFilters.categoryId}
          searchQuery={initialFilters.searchQuery}
          sortBy={initialFilters.sortBy as 'price' | 'name' | 'created_at'}
          sortOrder={initialFilters.sortOrder}
          onCategoryChange={(categoryId) => {
            const params = new URLSearchParams()
            if (categoryId) params.set('category', categoryId)
            if (initialFilters.searchQuery) params.set('search', initialFilters.searchQuery)
            params.set('sort', initialFilters.sortBy)
            params.set('order', initialFilters.sortOrder)
            window.location.href = `/products?${params.toString()}`
            }}
            onSearchChange={(query: string) => {
            const params = new URLSearchParams()
            if (query) params.set('search', query)
            if (initialFilters.categoryId) params.set('category', initialFilters.categoryId)
            params.set('sort', initialFilters.sortBy)
            params.set('order', initialFilters.sortOrder)
            window.location.href = `/products?${params.toString()}`
            }}
            onSortChange={(sortBy: string, sortOrder: 'asc' | 'desc') => {
            const params = new URLSearchParams()
            if (initialFilters.categoryId) params.set('category', initialFilters.categoryId)
            if (initialFilters.searchQuery) params.set('search', initialFilters.searchQuery)
            params.set('sort', sortBy)
            params.set('order', sortOrder)
            window.location.href = `/products?${params.toString()}`
          }}
          onReset={() => {
            window.location.href = '/products'
          }}
        />


        {/* Product Grid */}
        <ProductGrid
          products={initialProducts}
          currency={currency}
          isLoading={false}
          onAddToCart={(product) => {
            console.log('Add to cart:', product)
          }}
          onAddToWishlist={(product) => {
            console.log('Add to wishlist:', product)
          }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={initialPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              const params = new URLSearchParams()
              params.set('page', page.toString())
              if (initialFilters.categoryId) params.set('category', initialFilters.categoryId)
              if (initialFilters.searchQuery) params.set('search', initialFilters.searchQuery)
              params.set('sort', initialFilters.sortBy)
              params.set('order', initialFilters.sortOrder)
              window.location.href = `/products?${params.toString()}`
            }}
          />
        )}
      </div>
    </div>
  )
}


