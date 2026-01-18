/**
 * ============================================
 * ENRICHISSEMENT DES PRODUITS
 * ============================================
 */

import type { Product, ProductDB } from '@/types/product'
import { getStockStatus } from '@/types/product'
import { createPriceDisplay, convertFcToUsd } from './converter'

/**
 * Enrichit un produit de la DB avec les prix calculés et infos de stock
 * 
 * @param productDb - Produit brut venant de Supabase
 * @param exchangeRate - Taux de change actuel
 * @returns Produit enrichi avec prix USD et infos calculées
 * 
 * @example
 * const productDb = await supabase.from('products').select('*').single()
 * const enrichedProduct = enrichProduct(productDb.data, 2800)
 * 
 * console.log(enrichedProduct.price_usd)              // 10
 * console.log(enrichedProduct.price_display.fc.formatted)  // "28 000 FC"
 * console.log(enrichedProduct.stock_status)           // "in_stock"
 */
export function enrichProduct(
  productDb: ProductDB,
  exchangeRate: number
): Product {
  // Calculer le prix USD
  const priceUsd = convertFcToUsd(productDb.price, exchangeRate)

  // Créer l'objet d'affichage des prix
  const priceDisplay = createPriceDisplay(productDb.price, exchangeRate)

  // Calculer l'état du stock
  const stockStatus = getStockStatus(productDb)

  // Retourner le produit enrichi
  return {
    ...productDb,
    price_usd: priceUsd,
    price_display: priceDisplay,
    stock_status: stockStatus,
    is_low_stock: stockStatus === 'low_stock',
    is_out_of_stock: stockStatus === 'out_of_stock'
  }
}

/**
 * Enrichit une liste de produits
 * 
 * @param productsDb - Liste de produits bruts
 * @param exchangeRate - Taux de change actuel
 * @returns Liste de produits enrichis
 * 
 * @example
 * const { data } = await supabase.from('products').select('*')
 * const enrichedProducts = enrichProducts(data, 2800)
 * 
 * enrichedProducts.forEach(product => {
 *   console.log(`${product.name}: ${product.price_display.fc.formatted}`)
 * })
 */
export function enrichProducts(
  productsDb: ProductDB[],
  exchangeRate: number
): Product[] {
  return productsDb.map(product => enrichProduct(product, exchangeRate))
}

/**
 * Trie les produits selon les critères spécifiés
 * 
 * @param products - Liste de produits à trier
 * @param sortBy - Critère de tri
 * @param sortOrder - Ordre (croissant ou décroissant)
 * @returns Liste triée
 * 
 * @example
 * const sorted = sortProducts(products, 'price', 'asc')
 * // Produits triés du moins cher au plus cher
 */
export function sortProducts(
  products: Product[],
  sortBy: 'price' | 'name' | 'created_at' | 'stock_quantity' = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Product[] {
  const sorted = [...products].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price
        break
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'stock_quantity':
        comparison = a.stock_quantity - b.stock_quantity
        break
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sorted
}

/**
 * Filtre les produits selon un prix minimum et maximum
 * Gère automatiquement la conversion de devise
 * 
 * @param products - Liste de produits
 * @param minPrice - Prix minimum (dans la devise spécifiée)
 * @param maxPrice - Prix maximum (dans la devise spécifiée)
 * @param currency - Devise des prix min/max
 * @returns Liste filtrée
 * 
 * @example
 * // Filtrer entre 500$ et 2000$
 * const filtered = filterByPriceRange(products, 500, 2000, 'USD')
 */
export function filterByPriceRange(
  products: Product[],
  minPrice?: number,
  maxPrice?: number,
  currency: 'FC' | 'USD' = 'FC'
): Product[] {
  return products.filter(product => {
    // Sélectionner le bon prix selon la devise
    const price = currency === 'FC' ? product.price : product.price_usd

    // Appliquer les filtres
    if (minPrice !== undefined && price < minPrice) return false
    if (maxPrice !== undefined && price > maxPrice) return false

    return true
  })
}