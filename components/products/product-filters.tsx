'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import type { ProductDB } from '@/types/product'
import type { Category } from '@/types/product'

interface ProductFiltersProps {
  categories: Category[]
  selectedCategoryId?: string
  searchQuery: string
  sortBy: 'price' | 'name' | 'created_at'
  sortOrder: 'asc' | 'desc'
  onCategoryChange: (categoryId: string | undefined) => void
  onSearchChange: (query: string) => void
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onReset: () => void
}

export function ProductFilters({
   categories,
  selectedCategoryId,
  sortBy,
  sortOrder,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onReset
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // 🔥 DEBOUNCE : Attend 500ms avant de rechercher
  const debouncedSearch = useDebouncedCallback((query: string) => {
    setIsSearching(true)
    const params = new URLSearchParams(searchParams.toString())
    
    if (query) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset à la page 1
    
    router.push(`/products?${params.toString()}`)
    
    // Simulate search completion
    setTimeout(() => setIsSearching(false), 300)
  }, 500) // ✅ 500ms de délai

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setIsSearching(true)
    debouncedSearch(value)
  }

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    params.delete('page')
    
    router.push(`/products?${params.toString()}`)
  }

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSortBy)
    params.set('order', newSortOrder)
    
    router.push(`/products?${params.toString()}`)
  }

  const handleReset = () => {
    setSearchQuery('')
    router.push('/products')
  }

  return (
    <div className="mb-8 space-y-4">
      {/* 🔥 Barre de recherche avec indicateur de chargement */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        
        {/* Loading spinner ou bouton clear */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : searchQuery ? (
            <button
              onClick={() => handleSearchChange('')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="flex flex-wrap gap-4">
        {/* Catégories */}
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {typeof category === 'string' ? category : category.name}
            </option>
          ))}
        </select>

        {/* Tri */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split('-')
            handleSortChange(newSortBy, newSortOrder)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="created_at-desc">➕ Plus récents</option>
          <option value="created_at-asc">⏰ Plus anciens</option>
          <option value="price-asc">💰 Prix croissant</option>
          <option value="price-desc">💎 Prix décroissant</option>
          <option value="name-asc">🔤 Nom A-Z</option>
          <option value="name-desc">🔤 Nom Z-A</option>
        </select>

        {/* Nombre de résultats */}
        <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {searchQuery && `Résultats pour "${searchQuery}"`}
        </div>

        {/* Reset */}
        {(searchQuery || selectedCategoryId) && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}

// 'use client'

// import { useState } from 'react'
// import { Search, SlidersHorizontal, X } from 'lucide-react'
// import type { Category } from '@/types/product'

// interface ProductFiltersProps {
//   categories: Category[]
//   selectedCategoryId?: string
//   searchQuery: string
//   sortBy: 'price' | 'name' | 'created_at'
//   sortOrder: 'asc' | 'desc'
//   onCategoryChange: (categoryId: string | undefined) => void
//   onSearchChange: (query: string) => void
//   onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
//   onReset: () => void
// }

// export function ProductFilters({
//   categories,
//   selectedCategoryId,
//   searchQuery,
//   sortBy,
//   sortOrder,
//   onCategoryChange,
//   onSearchChange,
//   onSortChange,
//   onReset
// }: ProductFiltersProps) {
//   const [showFilters, setShowFilters] = useState(false)
//   const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSearchChange(localSearchQuery)
//   }

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const [newSortBy, newSortOrder] = e.target.value.split('-')
//     onSortChange(newSortBy, newSortOrder as 'asc' | 'desc')
//   }

//   const hasActiveFilters = selectedCategoryId || searchQuery

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//       {/* Mobile: Toggle Filters Button */}
//       <div className="lg:hidden mb-4">
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//         >
//           <span className="flex items-center gap-2">
//             <SlidersHorizontal className="w-5 h-5" />
//             Filtres
//           </span>
//           {hasActiveFilters && (
//             <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
//               Actifs
//             </span>
//           )}
//         </button>
//       </div>

//       {/* Filters Container */}
//       <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
//         {/* Search Bar */}
//         <form onSubmit={handleSearchSubmit} className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             value={localSearchQuery}
//             onChange={(e) => setLocalSearchQuery(e.target.value)}
//             placeholder="Rechercher un produit..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </form>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Category Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Catégorie
//             </label>
//             <select
//               value={selectedCategoryId || ''}
//               onChange={(e) => onCategoryChange(e.target.value || undefined)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Toutes les catégories</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Sort By */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Trier par
//             </label>
//             <select
//               value={`${sortBy}-${sortOrder}`}
//               onChange={handleSortChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="created_at-desc">Plus récents</option>
//               <option value="created_at-asc">Plus anciens</option>
//               <option value="name-asc">Nom (A-Z)</option>
//               <option value="name-desc">Nom (Z-A)</option>
//               <option value="price-asc">Prix croissant</option>
//               <option value="price-desc">Prix décroissant</option>
//             </select>
//           </div>

//           {/* Reset Button */}
//           <div className="flex items-end">
//             {hasActiveFilters && (
//               <button
//                 onClick={onReset}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//                 Réinitialiser
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Active Filters Summary */}
//         {hasActiveFilters && (
//           <div className="flex flex-wrap gap-2 pt-2 border-t">
//             <span className="text-sm text-gray-600">Filtres actifs:</span>
//             {selectedCategoryId && (
//               <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//                 {categories.find(c => c.id === selectedCategoryId)?.name}
//                 <button
//                   onClick={() => onCategoryChange(undefined)}
//                   className="hover:bg-blue-200 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//             {searchQuery && (
//               <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                 Recherche: "{searchQuery}"
//                 <button
//                   onClick={() => {
//                     setLocalSearchQuery('')
//                     onSearchChange('')
//                   }}
//                   className="hover:bg-green-200 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }




