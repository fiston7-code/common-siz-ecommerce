




import { ProductsPageClient } from '@/components/products/products-page-client'
import { createServerClient } from '@/lib/server'
interface SearchParams {
  page?: string
  category?: string
  search?: string
  sort?: string
  order?: string
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams:  Promise<SearchParams> 
}) {
const params = await searchParams

  const supabase =  await  createServerClient()
  
  // Paramètres URL
  const page = Number(params.page) || 1
  const categoryId = params.category
  const searchQuery = params.search || ''
  const sortBy = params.sort || 'created_at'
  const sortOrder = (params.order || 'desc') as 'asc' | 'desc'
  
  const PRODUCTS_PER_PAGE = 12
  const from = (page - 1) * PRODUCTS_PER_PAGE
  const to = from + PRODUCTS_PER_PAGE - 1

  // Query server-side
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order(sortBy, { ascending: sortOrder === 'asc' })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  const { data: products, count, error } = await query

  // Catégories
  // const { data: categories } = await supabase
  //   .from('categories')
  //   .select('*')
  //   .eq('is_active', true)
  //   .order('name')

  // if (error) {
  //   console.error('Error loading products:', error)
  //   return <div>Erreur de chargement</div>
  // }

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE)

  return (
    <ProductsPageClient
      initialProducts={products || []}
      categories={[]}
      currentPage={page}
      totalPages={totalPages}
      totalProducts={count || 0}
      initialFilters={{
        categoryId: undefined,
        searchQuery,
        sortBy,
        sortOrder
      }}
    />
  )
}

export const metadata = {
  title: 'Produits - Comon-siz Business',
  description: 'Découvrez nos produits avec livraison à Kinshasa. Paiement à la livraison.'
}