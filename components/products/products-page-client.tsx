'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ProductGrid } from './product-grid'
import { ProductFilters } from './product-filters'
import { Pagination } from './pagination'
import { useCurrency } from '@/hooks'

interface Props {
  initialProducts: any[]
  categories: any[]
  currentPage: number
  totalPages: number
  totalProducts: number
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
  currentPage,
  totalPages,
  totalProducts,
  initialFilters
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currency } = useCurrency()

  const updateFilters = (newFilters: Partial<typeof initialFilters>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries({ ...initialFilters, ...newFilters }).forEach(([key, value]) => {
      if (value) {
        params.set(key === 'categoryId' ? 'category' : key, String(value))
      } else {
        params.delete(key === 'categoryId' ? 'category' : key)
      }
    })
    
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    router.push(`/products?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startIndex = (currentPage - 1) * 12
  const endIndex = Math.min(startIndex + 12, totalProducts)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nos Produits
          </h1>
          <p className="text-gray-600">
            Affichage de {startIndex + 1}-{endIndex} sur {totalProducts} produits
          </p>
        </div>

        <ProductFilters
          categories={categories}
          selectedCategoryId={initialFilters.categoryId}
          searchQuery={initialFilters.searchQuery}
          sortBy={initialFilters.sortBy}
          sortOrder={initialFilters.sortOrder}
          onCategoryChange={(id) => updateFilters({ categoryId: id })}
          onSearchChange={(q) => updateFilters({ searchQuery: q })}
          onSortChange={(sort, order) => updateFilters({ sortBy: sort, sortOrder: order })}
          onReset={() => router.push('/products')}
        />

        <ProductGrid
          products={initialProducts}
          currency={currency}
          isLoading={false}
          onAddToCart={(p) => console.log('Cart:', p)}
          onAddToWishlist={(p) => console.log('Wishlist:', p)}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}