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
    getTotalPriceUSD,
    getTotalQuantity 
  } = useCartStore()

  const totalUSD = getTotalPriceUSD()
  const totalItems = getTotalQuantity()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-blue-900" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Mon Panier</h2>
                  <p className="text-sm text-gray-500">{totalItems} articles</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center mt-20">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 relative group">
                      <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                        {/* ✅ CHANGÉ : item.price → item.price_usd */}
                        <p className="font-bold text-blue-900 mt-1">{formatPrice(item.price_usd, 'USD')}</p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded hover:bg-gray-50"><Minus className="w-3 h-3"/></button>
                          <span className="text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded hover:bg-gray-50"><Plus className="w-3 h-3"/></button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">Sous-total</span>
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(totalUSD, 'USD')}</span>
                </div>
                <motion.a
                  href="/checkout"
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                  Valider la commande
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                  Paiement sécurisé en USD uniquement
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}