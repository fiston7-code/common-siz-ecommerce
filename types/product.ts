/**
 * ============================================
 * TYPES POUR LES PRODUITS
 * ============================================
 */

import type { Currency, PriceDisplay } from './currency'



/**
 * Structure d'une catégorie de produits
 */
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at?: string
  updated_at?: string
}




/**
 * Catégories de produits disponibles
 * DOIT correspondre exactement au CHECK constraint dans Supabase
 */
export type ProductCategory = 
  | 'smartphones' 
  | 'laptops' 
  | 'accessories' 
  | 'tablets'

/**
 * Structure d'un produit dans la base de données
 * Correspond EXACTEMENT à la table `products` de Supabase
 * C'est ce qui vient directement de la DB sans enrichissement
 */
export interface ProductDB {
  id: string                          // UUID du produit
  name: string                        // Nom du produit (ex: "iPhone 15 Pro")
  description: string | null          // Description (peut être null)
  price: number // Prix en FC centimes (ex: 2800000 = 28 000 FC)
  price_usd: number                        
  category: ProductCategory           // Catégorie du produit
  brand: string | null                // Marque (ex: "Apple", "Samsung")
  specifications: Record<string, unknown> | null // JSON avec specs techniques
  image_url: string | null            // URL de l'image
  stock_quantity: number              // Quantité en stock
  stock_threshold: number             // Seuil d'alerte stock faible (par défaut 5)
  is_available: boolean               // Disponible à la vente ?
  created_at: string                  // Date de création (ISO string)
  updated_at: string                  // Date de dernière modification
}

/**
 * Structure d'un produit ENRICHI pour l'application
 * Hérite de ProductDB et ajoute des champs calculés
 */
export interface Product extends ProductDB {
  // Prix calculés (ajoutés par l'application)
  price_usd: number                   // Prix converti en USD
  price_display: PriceDisplay         // Prix formatés dans les deux devises
  
  // Informations de stock calculées
  stock_status: StockStatus           // État du stock calculé
  is_low_stock: boolean               // true si stock <= stock_threshold
  is_out_of_stock: boolean            // true si stock_quantity === 0
}

/**
 * État du stock d'un produit
 * Utilisé pour afficher des badges visuels
 */
export type StockStatus =
  | 'in_stock'      // En stock (quantité > threshold)
  | 'low_stock'     // Stock faible (0 < quantité <= threshold)
  | 'out_of_stock'  // Rupture de stock (quantité = 0)

/**
 * Filtres pour la recherche de produits
 * Tous les champs sont optionnels (undefined = pas de filtre)
 */
export interface ProductFilters {
  // Filtres de base
  category?: ProductCategory          // Filtrer par catégorie
  brand?: string                      // Filtrer par marque
  search?: string                     // Recherche textuelle dans le nom
  
  // Filtres de prix (peuvent être en FC ou USD selon la devise choisie)
  minPrice?: number                   // Prix minimum
  maxPrice?: number                   // Prix maximum
  priceCurrency?: Currency            // Dans quelle devise sont les filtres de prix
  
  // Filtres de stock
  inStockOnly?: boolean               // true = uniquement produits en stock
  
  // Tri
  sortBy?: 'price' | 'name' | 'created_at' | 'stock_quantity'
  sortOrder?: 'asc' | 'desc'          // Ordre croissant ou décroissant
  
  // Pagination
  page?: number                       // Numéro de page (pagination)
  limit?: number                      // Nombre de produits par page
}

/**
 * Réponse de l'API pour la liste de produits
 * Contient les produits + informations de pagination
 */
export interface ProductsResponse {
  products: Product[]                 // Liste des produits enrichis
  totalCount: number                  // Nombre total de produits (toutes pages)
  totalPages: number                  // Nombre total de pages
  currentPage: number                 // Page actuelle
}

/**
 * Paramètres pour créer un produit (admin)
 * Le prix est TOUJOURS en FC (centimes)
 */
export interface CreateProductInput {
  name: string
  description?: string
  price: number                       // Prix en FC centimes
  category: ProductCategory
  brand?: string
  specifications?: Record<string, unknown> 
  image_url?: string
  stock_quantity: number
  stock_threshold?: number
}

/**
 * Paramètres pour modifier un produit (admin)
 */
export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}

/**
 * Options pour le tri des produits
 */
export interface ProductSortOption {
  label: string
  value: ProductFilters['sortBy']
  order: 'asc' | 'desc'
}

/**
 * Statistiques de prix pour une liste de produits
 */
export interface PriceStats {
  min: PriceDisplay
  max: PriceDisplay
  average: PriceDisplay
  currency: Currency                  // Dans quelle devise sont calculées les stats
}

// ============================================
// FONCTIONS HELPER
// ============================================

/**
 * Détermine l'état du stock d'un produit
 * @param product - Le produit (ProductDB ou Product)
 * @returns L'état du stock
 * 
 * @example
 * const status = getStockStatus(product)
 * if (status === 'out_of_stock') {
 *   console.log('Produit en rupture de stock')
 * }
 */
export function getStockStatus(
  product: Pick<ProductDB, 'stock_quantity' | 'stock_threshold'>
): StockStatus {
  if (product.stock_quantity === 0) {
    return 'out_of_stock'
  }
  if (product.stock_quantity <= product.stock_threshold) {
    return 'low_stock'
  }
  return 'in_stock'
}

/**
 * Formate un prix en Francs Congolais
 * @param priceInCentimes - Prix en centimes FC (ex: 2800000 = 28 000 FC)
 * @param options - Options de formatage
 * @returns Prix formaté (ex: "28 000 FC" ou "28 000,00 FC")
 * 
 * @example
 * formatPriceFC(2800000)           // "28 000 FC"
 * formatPriceFC(2800000, { showDecimals: true })  // "28 000,00 FC"
 * formatPriceFC(2800000, { showSymbol: false })   // "28 000"
 */
export function formatPriceFC(
  priceInCentimes: number,
  options: {
    showDecimals?: boolean
    showSymbol?: boolean
  } = {}
): string {
  const { showDecimals = false, showSymbol = true } = options
  
  // Convertir centimes en FC (diviser par 100)
  const priceInFC = priceInCentimes / 100
  
  const formatted = new Intl.NumberFormat('fr-CD', {
    style: 'decimal',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(priceInFC)
  
  return showSymbol ? `${formatted} FC` : formatted
}

/**
 * Formate un prix en USD
 * @param priceInUSD - Prix en USD (ex: 1000)
 * @param options - Options de formatage
 * @returns Prix formaté (ex: "$1,000" ou "$1,000.00")
 * 
 * @example
 * formatPriceUSD(1000)                    // "$1,000"
 * formatPriceUSD(1000, { showDecimals: true })  // "$1,000.00"
 * formatPriceUSD(1000, { showSymbol: false })   // "1,000"
 */
export function formatPriceUSD(
  priceInUSD: number,
  options: {
    showDecimals?: boolean
    showSymbol?: boolean
  } = {}
): string {
  const { showDecimals = false, showSymbol = true } = options
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(priceInUSD)
  
  return formatted
}

/**
 * Vérifie si un produit est disponible
 * Un produit est disponible si is_available = true ET stock > 0
 * 
 * @example
 * if (isProductAvailable(product)) {
 *   console.log('Produit disponible à l\'achat')
 * }
 */
export function isProductAvailable(
  product: Pick<ProductDB, 'is_available' | 'stock_quantity'>
): boolean {
  return product.is_available && product.stock_quantity > 0
}

/**
 * Calcule le pourcentage de stock restant
 * Utile pour afficher une barre de progression
 * 
 * @example
 * const percentage = getStockPercentage(product, 100) // 75%
 */
export function getStockPercentage(
  product: Pick<ProductDB, 'stock_quantity'>,
  maxStock: number
): number {
  if (maxStock === 0) return 0
  return Math.min(100, (product.stock_quantity / maxStock) * 100)
}