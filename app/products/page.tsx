// app/products/page.tsx

import { ProductsPageClient } from '@/components/products/products-page-client'
import { createServerClient } from '@/lib/server'
import { enrichProducts } from '@/lib/currency/product-enricher'
import { getExchangeRateWithFallback } from '@/lib/currency/exchange-rate'
import type { ProductDB } from '@/types/product'
import { Suspense } from 'react'

interface SearchParams {
  page?: string
  category?: string
  search?: string
  sort?: string
  order?: string
}

export const metadata = {
  title: 'Produits - Comon-siz Business',
  description: 'Découvrez nos produits avec livraison à Kinshasa.'
}

// 🔥 Revalidation automatique toutes les 60 secondes
export const revalidate = 60

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createServerClient()
  
  const page = Number(params.page) || 1
  const categoryId = params.category
  const searchQuery = params.search || ''
  const sortBy = params.sort || 'created_at'
  const sortOrder = (params.order || 'desc') as 'asc' | 'desc'
  
  const PRODUCTS_PER_PAGE = 12
  const from = (page - 1) * PRODUCTS_PER_PAGE
  const to = from + PRODUCTS_PER_PAGE - 1

  // 🔥 Requête optimisée avec index DB
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_available', true)
    .range(from, to)
    .order(sortBy, { ascending: sortOrder === 'asc' })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  // 🔥 Recherche full-text (plus rapide que ILIKE)
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  const { data: productsDB, count, error } = await query

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('❌ Error loading products:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-red-600">Impossible de charger les produits</p>
        </div>
      </div>
    )
  }

  const exchangeRate = await getExchangeRateWithFallback()
  const products = enrichProducts((productsDB as ProductDB[]) || [], exchangeRate)
  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE)

  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <ProductsPageClient
        initialProducts={products}
        categories={categories || []}
        currentPage={page}
        totalPages={totalPages}
        totalProducts={count || 0}
        exchangeRate={exchangeRate}
        initialFilters={{
          categoryId,
          searchQuery,
          sortBy,
          sortOrder
        }}
      />
    </Suspense>
  )
}

// 🔥 Skeleton de chargement
function ProductsLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    </div>
  )
}







// import { ProductsPageClient } from '@/components/products/products-page-client'
// import { createServerClient } from '@/lib/server'
// import { enrichProducts } from '@/lib/currency/product-enricher'
// import { getExchangeRateWithFallback } from '@/lib/currency/exchange-rate'
// import type { ProductDB } from '@/types/product'

// interface SearchParams {
//   page?: string
//   category?: string
//   search?: string
//   sort?: string
//   order?: string
// }

// export const metadata = {
//   title: 'Produits - Comon-siz Business',
//   description: 'Découvrez nos produits avec livraison à Kinshasa. Paiement à la livraison.'
// }

// export default async function ProductsPage({
//   searchParams
// }: {
//   searchParams: Promise<SearchParams>
// }) {
//   const params = await searchParams
//   const supabase = await createServerClient()
  
//   // Paramètres URL
//   const page = Number(params.page) || 1
//   const categoryId = params.category
//   const searchQuery = params.search || ''
//   const sortBy = params.sort || 'created_at'
//   const sortOrder = (params.order || 'desc') as 'asc' | 'desc'
  
//   const PRODUCTS_PER_PAGE = 12
//   const from = (page - 1) * PRODUCTS_PER_PAGE
//   const to = from + PRODUCTS_PER_PAGE - 1

//   // Query server-side
//   let query = supabase
//     .from('products')
//     .select('*', { count: 'exact' })
//     .eq('is_available', true)
//     .range(from, to)
//     .order(sortBy, { ascending: sortOrder === 'asc' })

//   if (categoryId) {
//     query = query.eq('category_id', categoryId)
//   }
  
//   if (searchQuery) {
//     query = query.ilike('name', `%${searchQuery}%`)
//   }

//   const { data: productsDB, count, error } = await query

//   // Catégories
//   const { data: categories } = await supabase
//     .from('categories')
//     .select('*')
//     .eq('is_active', true)
//     .order('name')

//   if (error) {
//     console.error('❌ Error loading products:', error)
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <h2 className="text-xl font-bold text-red-800 mb-2">
//             Erreur de chargement
//           </h2>
//           <p className="text-red-600">Impossible de charger les produits</p>
//         </div>
//       </div>
//     )
//   }

//   // 🔥 Récupère le taux de change actif depuis la DB
//   const exchangeRate = await getExchangeRateWithFallback()
  
//   console.log('💱 Exchange rate loaded:', exchangeRate)

//   // 🔥 Enrichissement avec le taux de change dynamique
//   const products = enrichProducts(
//     (productsDB as ProductDB[]) || [],
//     exchangeRate
//   )

//   const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE)

//   return (
//   <ProductsPageClient
//     initialProducts={products}
//     categories={categories || []}
//     currentPage={page}
//     totalPages={totalPages}
//     totalProducts={count || 0}
//     exchangeRate={exchangeRate} // ✅ Passe le taux
//     initialFilters={{
//       categoryId,
//       searchQuery,
//       sortBy,
//       sortOrder
//     }}
//   />

//   )
// }




// import { ProductsPageClient } from '@/components/products/products-page-client'
// import { createServerClient } from '@/lib/server'
// interface SearchParams {
//   page?: string
//   category?: string
//   search?: string
//   sort?: string
//   order?: string
// }

// export default async function ProductsPage({
//   searchParams
// }: {
//   searchParams:  Promise<SearchParams> 
// }) {
// const params = await searchParams

//   const supabase =  await  createServerClient()
  
//   // Paramètres URL
//   const page = Number(params.page) || 1
//   const categoryId = params.category
//   const searchQuery = params.search || ''
//   const sortBy = params.sort || 'created_at'
//   const sortOrder = (params.order || 'desc') as 'asc' | 'desc'
  
//   const PRODUCTS_PER_PAGE = 12
//   const from = (page - 1) * PRODUCTS_PER_PAGE
//   const to = from + PRODUCTS_PER_PAGE - 1

//   // Query server-side
//   let query = supabase
//     .from('products')
//     .select('*', { count: 'exact' })
//     .range(from, to)
//     .order(sortBy, { ascending: sortOrder === 'asc' })

//   if (categoryId) {
//     query = query.eq('category_id', categoryId)
//   }
  
//   if (searchQuery) {
//     query = query.ilike('name', `%${searchQuery}%`)
//   }

//   const { data: products, count, error } = await query

//   // Catégories
//   // const { data: categories } = await supabase
//   //   .from('categories')
//   //   .select('*')
//   //   .eq('is_active', true)
//   //   .order('name')

//   // if (error) {
//   //   console.error('Error loading products:', error)
//   //   return <div>Erreur de chargement</div>
//   // }

//   const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE)

//   return (
//     <ProductsPageClient
//       initialProducts={products || []}
//       categories={[]}
//       currentPage={page}
//       totalPages={totalPages}
//       totalProducts={count || 0}
//       initialFilters={{
//         categoryId: undefined,
//         searchQuery,
//         sortBy,
//         sortOrder
//       }}
//     />
//   )
// }

// export const metadata = {
//   title: 'Produits - Comon-siz Business',
//   description: 'Découvrez nos produits avec livraison à Kinshasa. Paiement à la livraison.'
// }