'use client'

import { useState } from 'react'
import type { Product } from '@/types/product'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)

    // TODO: Implémenter la logique d'ajout au panier
    // Pour l'instant, simulation
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Produit ajouté au panier:', product)
    setIsAdding(false)

    // TODO: Afficher une notification de succès
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? '⏳ Ajout en cours...' : '🛒 Ajouter au panier'}
    </button>
  )
}