'use client'

import { useState } from 'react'
import { Eye, Heart, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/currency'
import AddToCartButton from '@/components/AddToCartButton'
import ProductQuickView from '@/components/ProductQuickView'
import type { Product } from '@/types/product'
import type { Currency } from '@/types/currency'

interface ProductCardProps {
  product: Product
  currency: Currency
  onAddToWishlist?: (product: Product) => void
  showQuickView?: boolean
}

export function ProductCard({
  product,
  currency,
  onAddToWishlist,
  showQuickView = true
}: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  
  const isOutOfStock = product.stock_quantity <= 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(product)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  return (
    <>
      <Link
        href={`/products/${product.id}`}
        className="group relative flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8" />
                </div>
                <p className="text-sm">Pas d&apos;image</p>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOutOfStock && (
              <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">
                Rupture
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded">
                Stock limité
              </span>
            )}
            {product.category && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded">
                {product.category}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title="Aperçu rapide"
                aria-label="Aperçu rapide"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            )}
            
            <button
              onClick={handleAddToWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              title="Ajouter aux favoris"
              aria-label="Ajouter aux favoris"
            >
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Stock Info */}
          {!isOutOfStock && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <AlertCircle className="w-3 h-3" />
              <span>{product.stock_quantity} en stock</span>
            </div>
          )}

          {/* Price and Action */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            {/* Price - ✅ CORRIGÉ */}
            <div className="mb-3">
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(product.price_usd, 'USD')}
              </div>
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton product={product} />
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <ProductQuickView
          product={product}
          currency={currency}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  )
}