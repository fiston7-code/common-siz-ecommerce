'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types/product'

interface SimilarProductsProps {
  products: Product[]
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  if (products.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Produits similaires
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {product.name}
              </h3>

             

              {product.stock_quantity === 0 && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  Rupture de stock
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}