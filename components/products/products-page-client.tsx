'use client'

import { useState } from 'react'
import { ProductGrid } from './product-grid'
import { ProductFilters } from './product-filters'
import { Pagination } from './pagination'
import { useCurrency } from '@/hooks'
import type { Product, Category } from '@/types/product' 
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
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Taux de change actuel
            </p>
            <p className="text-xs text-blue-700">
              1 USD = {exchangeRate.toLocaleString('fr-FR')} FC
            </p>
          </div>
        </div>

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

{/* 
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
  onSearchChange={(query) => {
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (initialFilters.categoryId) params.set('category', initialFilters.categoryId)
    params.set('sort', initialFilters.sortBy)
    params.set('order', initialFilters.sortOrder)
    window.location.href = `/products?${params.toString()}`
  }}
  onSortChange={(sortBy, sortOrder) => {
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
/> */}

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




// 'use client'

// import { useRouter, useSearchParams } from 'next/navigation'
// import { ProductGrid } from './product-grid'
// import { ProductFilters } from './product-filters'
// import { Pagination } from './pagination'
// import { useCurrency } from '@/hooks'

// interface Props {
//   initialProducts: any[]
//   categories: any[]
//   currentPage: number
//   totalPages: number
//   totalProducts: number
//   initialFilters: {
//     categoryId?: string
//     searchQuery: string
//     sortBy: string
//     sortOrder: 'asc' | 'desc'
//   }
// }

// export function ProductsPageClient({
//   initialProducts,
//   categories,
//   currentPage,
//   totalPages,
//   totalProducts,
//   initialFilters
// }: Props) {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const { currency } = useCurrency()

//   const updateFilters = (newFilters: Partial<typeof initialFilters>) => {
//     const params = new URLSearchParams(searchParams)
    
//     Object.entries({ ...initialFilters, ...newFilters }).forEach(([key, value]) => {
//       if (value) {
//         params.set(key === 'categoryId' ? 'category' : key, String(value))
//       } else {
//         params.delete(key === 'categoryId' ? 'category' : key)
//       }
//     })
    
//     params.set('page', '1')
//     router.push(`/products?${params.toString()}`)
//   }

//   const handlePageChange = (page: number) => {
//     const params = new URLSearchParams(searchParams)
//     params.set('page', String(page))
//     router.push(`/products?${params.toString()}`)
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   const startIndex = (currentPage - 1) * 12
//   const endIndex = Math.min(startIndex + 12, totalProducts)

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Nos Produits
//           </h1>
//           <p className="text-gray-600">
//             Affichage de {startIndex + 1}-{endIndex} sur {totalProducts} produits
//           </p>
//         </div>

//         <ProductFilters
//           categories={categories}
//           selectedCategoryId={initialFilters.categoryId}
//           searchQuery={initialFilters.searchQuery}
//           sortBy={initialFilters.sortBy}
//           sortOrder={initialFilters.sortOrder}
//           onCategoryChange={(id) => updateFilters({ categoryId: id })}
//           onSearchChange={(q) => updateFilters({ searchQuery: q })}
//           onSortChange={(sort, order) => updateFilters({ sortBy: sort, sortOrder: order })}
//           onReset={() => router.push('/products')}
//         />

//         <ProductGrid
//           products={initialProducts}
//           currency={currency}
//           isLoading={false}
//           onAddToCart={(p) => console.log('Cart:', p)}
//           onAddToWishlist={(p) => console.log('Wishlist:', p)}
//         />

//         {totalPages > 1 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </div>
//     </div>
//   )
// }