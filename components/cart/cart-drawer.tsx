'use client'

import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/currency'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPriceFC, 
    getTotalPriceUSD,
    getTotalQuantity 
  } = useCartStore()

  const totalFC = getTotalPriceFC()
  const totalUSD = getTotalPriceUSD()
  const totalItems = getTotalQuantity()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-blue-900" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Mon Panier</h2>
                  <p className="text-sm text-gray-500">
                    {totalItems} {totalItems > 1 ? 'articles' : 'article'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Ajoutez des produits pour commencer vos achats
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                  >
                    Continuer mes achats
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 bg-gray-50 rounded-xl p-4 relative group"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {item.name}
                        </h3>
                        
                        {/* Prix double devise */}
                        <div className="mb-3">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price, 'FC')}
                          </p>
                          <p className="text-xs text-gray-500">
                            ≈ {formatPrice(item.price_usd, 'USD', { showDecimals: true })}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:border-blue-900 hover:text-blue-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:border-blue-900 hover:text-blue-900 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>

                      {/* Sous-total pour cet article */}
                      <div className="absolute bottom-2 right-2 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity, 'FC')}
                        </p>
                        <p className="text-xs text-gray-500">
                          ≈ {formatPrice(item.price_usd * item.quantity, 'USD', { showDecimals: true })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec Total */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Total */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm text-gray-600">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(totalFC, 'FC')}
                      </p>
                      <p className="text-sm text-gray-500">
                        ≈ {formatPrice(totalUSD, 'USD', { showDecimals: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    Frais de livraison calculés à la prochaine étape
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <motion.a
                    href="/checkout"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-lg"
                  >
                    Passer la commande
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-blue-900 hover:text-blue-900 transition-colors"
                  >
                    Continuer mes achats
                  </motion.button>
                </div>

                {/* Info supplémentaire */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-900 text-center">
                    🚚 Livraison GRATUITE dès 100$ d'achat à Gombe, Limete et Bandal
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}