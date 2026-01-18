'use client'

/**
 * ============================================
 * PRODUCT FILTERS - Filtres et tri des produits
 * ============================================
 */

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import type { Category } from '@/types'

interface ProductFiltersProps {
  categories: Category[]
  selectedCategoryId?: string
  searchQuery?: string
  sortBy?: 'price' | 'name' | 'created_at'
  sortOrder?: 'asc' | 'desc'
  onCategoryChange?: (categoryId: string | undefined) => void
  onSearchChange?: (query: string) => void
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onReset?: () => void
}

/**
 * Barre de filtres pour les produits
 */
export function ProductFilters({
  categories,
  selectedCategoryId,
  searchQuery = '',
  sortBy = 'created_at',
  sortOrder = 'desc',
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onReset
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = selectedCategoryId || searchQuery

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split('-')
            onSortChange?.(newSortBy, newSortOrder as 'asc' | 'desc')
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="created_at-desc">Plus récents</option>
          <option value="created_at-asc">Plus anciens</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name-asc">Nom A-Z</option>
          <option value="name-desc">Nom Z-A</option>
        </select>

        {/* Toggle Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtres</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Catégories</h3>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Réinitialiser
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange?.(undefined)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${!selectedCategoryId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Toutes
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategoryId === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}