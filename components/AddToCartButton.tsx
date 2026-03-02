'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, Check, X } from 'lucide-react'
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

    console.log("Données du produit reçu :", product);

    try {
      addItem({
        id: product.id,
        name: product.name,
        price_usd: Number(product.price_usd || product.price) || 0, //  Uniquement price_usd
        image: product.image_url ?? undefined,
      })

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isOutOfStock}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        showSuccess
          ? 'bg-green-600 text-white'
          : isOutOfStock
          ? 'bg-gray-400 text-white'
          : 'bg-blue-900 text-white hover:bg-blue-800 active:scale-95'
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
          Ajouté au panier !
        </>
      ) : isOutOfStock ? (
        <>
          <X className="w-4 h-4" />
          Rupture de stock
        </>
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
// import { ShoppingCart, Loader2, Check } from 'lucide-react'
// import { useCartStore } from '@/store/cart-store'
// import type { Product } from '@/types/product'

// interface AddToCartButtonProps {
//   product: Product
// }

// export default function AddToCartButton({ product }: AddToCartButtonProps) {
//   const [isAdding, setIsAdding] = useState(false)
//   const [showSuccess, setShowSuccess] = useState(false)
//   const addItem = useCartStore((state) => state.addItem)

//   const isOutOfStock = product.stock_quantity === 0

//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
    
//     if (isOutOfStock) return

//     setIsAdding(true)

//     // addItem({
//     //   id: product.id,
//     //   name: product.name,
//     //   price: product.price,
//     //   image: product.image_url,
//     //   quantity: 1,
//     // })

// addItem({
//   id: product.id,
//   name: product.name,
//   price_usd: product.price_usd,
//   image: product.image_url ?? undefined,
// })

//     setIsAdding(false)
//     setShowSuccess(true)
//     setTimeout(() => setShowSuccess(false), 2000)
//   }

//   return (
//     <button
//       onClick={handleAddToCart}
//       disabled={isAdding || isOutOfStock}
//       className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
//         showSuccess
//           ? 'bg-green-600 text-white'
//           : isOutOfStock
//           ? 'bg-gray-400 text-white'
//           : 'bg-blue-600 text-white hover:bg-blue-700'
//       }`}
//     >
//       {isAdding ? (
//         <>
//           <Loader2 className="w-4 h-4 animate-spin" />
//           Ajout...
//         </>
//       ) : showSuccess ? (
//         <>
//           <Check className="w-4 h-4" />
//           Ajouté !
//         </>
//       ) : isOutOfStock ? (
//         '❌ Rupture de stock'
//       ) : (
//         <>
//           <ShoppingCart className="w-4 h-4" />
//           Ajouter au panier
//         </>
//       )}
//     </button>
//   )
// }





