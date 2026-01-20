'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/types/product'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const isOutOfStock = product.stock_quantity === 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isOutOfStock) return

    setIsAdding(true)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
    })

    setIsAdding(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isOutOfStock}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
        showSuccess
          ? 'bg-green-600 text-white'
          : isOutOfStock
          ? 'bg-gray-400 text-white'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Ajout...
        </>
      ) : showSuccess ? (
        <>
          <Check className="w-4 h-4" />
          Ajouté !
        </>
      ) : isOutOfStock ? (
        '❌ Rupture de stock'
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Ajouter au panier
        </>
      )}
    </button>
  )
}





// 'use client'

// import { useState } from 'react'
// import type { Product } from '@/types/product'

// interface AddToCartButtonProps {
//   product: Product
// }

// export default function AddToCartButton({ product }: AddToCartButtonProps) {
//   const [isAdding, setIsAdding] = useState(false)

//   const handleAddToCart = async () => {
//     setIsAdding(true)

//     // TODO: Implémenter la logique d'ajout au panier
//     // Pour l'instant, simulation
//     await new Promise((resolve) => setTimeout(resolve, 500))

//     console.log('Produit ajouté au panier:', product)
//     setIsAdding(false)

//     // TODO: Afficher une notification de succès
//   }

//   return (
//     <button
//       onClick={handleAddToCart}
//       disabled={isAdding}
//       className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//     >
//       {isAdding ? '⏳ Ajout en cours...' : '🛒 Ajouter au panier'}
//     </button>
//   )
// }