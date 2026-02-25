'use client'

import { useState } from 'react'
import { X, ShoppingCart, Heart, Plus, Minus, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/currency'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/types/product'
import type { Currency } from '@/types/currency'

interface ProductQuickViewProps {
  product: Product
  currency: Currency
  onClose: () => void
}

export default function ProductQuickView({ 
  product, 
  currency,
  onClose 
}: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  
  const isOutOfStock = product.stock_quantity <= 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10

  const handleAddToCart = () => {
    setIsAdding(true)

    addItem({
    
  id: product.id,
  name: product.name,
  price_usd: product.price_usd,
  image: product.image_url ?? undefined, // 👈 Convertit null en undefined
  
})


    setIsAdding(false)
    setShowSuccess(true)

    // Fermer après 1.5s
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop avec blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header fixe */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">Aperçu Rapide</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content scrollable */}
          <div className="overflow-y-auto flex-1">
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* ===== COLONNE GAUCHE : IMAGE ===== */}
                <div className="space-y-4">
                  {/* Image principale */}
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                            📦
                          </div>
                          <p className="text-sm">Pas d&apos;image disponible</p>
                        </div>
                      </div>
                    )}

                    {/* Badges sur l'image */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {isOutOfStock && (
                        <span className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow-lg">
                          Rupture de stock
                        </span>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <span className="px-3 py-1 text-xs font-bold bg-orange-500 text-white rounded-full shadow-lg">
                          Stock limité
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Catégorie */}
                  {product.category && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Catégorie:</span>
                      <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* ===== COLONNE DROITE : INFOS ===== */}
                <div className="flex flex-col">
                  {/* Nom du produit */}
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {product.name}
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Prix */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(
                          currency === 'FC' ? product.price : product.price_usd,
                          currency
                        )}
                      </span>
                      <span className="text-lg text-gray-500">
                        {currency === 'FC' 
                          ? `≈ ${formatPrice(product.price_usd, 'USD')}`
                          : `≈ ${formatPrice(product.price, 'FC')}`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Statut du stock */}
                  <div className="mb-6">
                    {isOutOfStock ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <span className="font-semibold">Rupture de stock</span>
                      </div>
                    ) : isLowStock ? (
                      <div className="flex items-center gap-2 text-orange-600">
                        <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></div>
                        <span className="font-semibold">
                          Stock limité - Plus que {product.stock_quantity} disponible{product.stock_quantity > 1 ? 's' : ''}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="font-semibold">
                          En stock ({product.stock_quantity} disponibles)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sélecteur de quantité */}
                  {!isOutOfStock && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Quantité
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="w-20 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg font-bold text-lg">
                          {quantity}
                        </div>
                        
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= product.stock_quantity}
                          className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <span className="text-sm text-gray-500 ml-2">
                          / {product.stock_quantity} disponibles
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isAdding || showSuccess}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
                        showSuccess
                          ? 'bg-green-600 text-white'
                          : isOutOfStock
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Ajout...
                        </>
                      ) : showSuccess ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            ✅
                          </motion.div>
                          Ajouté au panier !
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Ajouter au panier
                        </>
                      )}
                    </button>
                    
                    <button
                      className="p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-red-300 transition-colors group"
                      title="Ajouter aux favoris"
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Lien vers la page détaillée */}
                  <Link
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors py-3 px-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir tous les détails du produit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}