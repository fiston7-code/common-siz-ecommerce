import { supabase } from '../client'
import type { 
  Product, 
  ProductFilters, 
  ProductsResponse, 
  ProductCategory 
} from '@/types/product'

/**
 * FONCTION PRINCIPALE : Récupérer les produits avec filtres et pagination
 * 
 * Cette fonction :
 * 1. Construit une requête Supabase dynamique selon les filtres
 * 2. Gère la pagination (limit + offset)
 * 3. Compte le nombre total de produits
 * 4. Retourne les produits + métadonnées de pagination
 * 
 * @param filters - Filtres optionnels (catégorie, prix, recherche, etc.)
 * @returns Promise avec les produits et infos de pagination
 */
export async function fetchProducts(
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  try {
    // 📌 ÉTAPE 1 : Extraire les paramètres avec valeurs par défaut
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      inStockOnly = false,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = filters

    // 📌 ÉTAPE 2 : Calculer l'offset pour la pagination
    // Page 1 → offset 0 (produits 0-19)
    // Page 2 → offset 20 (produits 20-39)
    // Page 3 → offset 40 (produits 40-59)
    const offset = (page - 1) * limit

    // 📌 ÉTAPE 3 : Construire la requête de base
    // On commence par sélectionner tous les champs
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })  // count: 'exact' pour avoir le total
      .eq('is_available', true)  // Uniquement les produits disponibles

    // 📌 ÉTAPE 4 : Appliquer les filtres (si fournis)

    // Filtre par catégorie
    if (category) {
      query = query.eq('category', category)
    }

    // Filtre par marque
    if (brand) {
      query = query.eq('brand', brand)
    }

    // Filtre par prix minimum
    if (minPrice !== undefined) {
      query = query.gte('price', minPrice)  // gte = greater than or equal
    }

    // Filtre par prix maximum
    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice)  // lte = less than or equal
    }

    // Recherche textuelle dans le nom (insensible à la casse)
    if (search) {
      query = query.ilike('name', `%${search}%`)  // ilike = case insensitive LIKE
    }

    // Filtre uniquement produits en stock
    if (inStockOnly) {
      query = query.gt('stock_quantity', 0)  // gt = greater than
    }

    // 📌 ÉTAPE 5 : Appliquer le tri
    // Convertir sortBy en boolean pour l'ordre ascendant
    const ascending = sortOrder === 'asc'
    query = query.order(sortBy, { ascending })

    // 📌 ÉTAPE 6 : Appliquer la pagination
    // range(0, 19) = produits 0 à 19 (20 produits)
    // range(20, 39) = produits 20 à 39 (20 produits)
    query = query.range(offset, offset + limit - 1)

    // 📌 ÉTAPE 7 : Exécuter la requête
    const { data, error, count } = await query

    // 📌 ÉTAPE 8 : Gérer les erreurs
    if (error) {
      console.error('Erreur lors du fetch des produits:', error)
      throw new Error(`Impossible de charger les produits: ${error.message}`)
    }

    // 📌 ÉTAPE 9 : Calculer les métadonnées de pagination
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    // 📌 ÉTAPE 10 : Retourner les données formatées
    return {
      products: data || [],
      totalCount,
      totalPages,
      currentPage: page,
    }

  } catch (error) {
    // Log l'erreur pour le debug
    console.error('Erreur dans fetchProducts:', error)
    
    // Re-throw pour que TanStack Query puisse gérer l'erreur
    throw error
  }
}

/**
 * Récupérer UN produit par son ID
 * 
 * Utilisé pour la page détail d'un produit
 * 
 * @param id - L'UUID du produit
 * @returns Promise avec le produit ou null si introuvable
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_available', true)
      .single()  // .single() = on attend UN seul résultat

    if (error) {
      // Si erreur PGRST116 = produit non trouvé (pas grave)
      if (error.code === 'PGRST116') {
        return null
      }
      
      console.error('Erreur lors du fetch du produit:', error)
      throw new Error(`Impossible de charger le produit: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Erreur dans fetchProductById:', error)
    throw error
  }
}

/**
 * Récupérer toutes les catégories disponibles
 * 
 * Utilisé pour afficher les filtres de catégories
 * 
 * @returns Promise avec la liste des catégories distinctes
 */
export async function fetchProductCategories(): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('is_available', true)

    if (error) {
      console.error('Erreur lors du fetch des catégories:', error)
      throw new Error(`Impossible de charger les catégories: ${error.message}`)
    }

    // Extraire les catégories uniques
    // Set() élimine les doublons
    const categories = [...new Set(data.map(p => p.category))] as ProductCategory[]
    
    return categories
  } catch (error) {
    console.error('Erreur dans fetchProductCategories:', error)
    throw error
  }
}

/**
 * Récupérer toutes les marques disponibles
 * 
 * Utilisé pour afficher les filtres de marques
 * 
 * @returns Promise avec la liste des marques distinctes
 */
export async function fetchProductBrands(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('is_available', true)
      .not('brand', 'is', null)  // Exclure les produits sans marque

    if (error) {
      console.error('Erreur lors du fetch des marques:', error)
      throw new Error(`Impossible de charger les marques: ${error.message}`)
    }

    // Extraire les marques uniques et trier alphabétiquement
    const brands = [...new Set(data.map(p => p.brand).filter(Boolean))] as string[]
    brands.sort()  // Tri alphabétique
    
    return brands
  } catch (error) {
    console.error('Erreur dans fetchProductBrands:', error)
    throw error
  }
}

/**
 * Récupérer les produits similaires (même catégorie)
 * 
 * Utilisé sur la page détail pour afficher "Produits similaires"
 * 
 * @param productId - ID du produit actuel (pour l'exclure)
 * @param category - Catégorie du produit
 * @param limit - Nombre de produits à retourner (défaut: 4)
 * @returns Promise avec la liste de produits similaires
 */
export async function fetchSimilarProducts(
  productId: string,
  category: ProductCategory,
  limit: number = 4
): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .neq('id', productId)  // neq = not equal (exclure le produit actuel)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors du fetch des produits similaires:', error)
      throw new Error(`Impossible de charger les produits similaires: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Erreur dans fetchSimilarProducts:', error)
    throw error
  }
}