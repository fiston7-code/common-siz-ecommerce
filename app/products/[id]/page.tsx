import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchProductById, fetchSimilarProducts } from '@/lib/supabase/api/products'
import AddToCartButton from '@/components/AddToCartButton'
import SimilarProducts from '@/components/SimilarProducts'
import ProductImageGallery from '@/components/ProductImageGallery'

// 🎯 Composant principal - Page détail produit (SERVER COMPONENT)
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await fetchProductById(id)

  if (!product) {
    notFound()
  }

  const isOutOfStock = product.stock_quantity === 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= (product.stock_threshold || 5)

  const similarProducts = await fetchSimilarProducts(product.id, product.category, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900 transition">
              Produits
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            
            {/* 🖼️ GALERIE D'IMAGES (Client Component) */}
 <ProductImageGallery
  images={
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img: any) => typeof img === 'string' ? img : img.url) // On extrait l'URL si c'est un objet
      : product.image_url 
        ? [product.image_url] 
        : []
  }
  productName={product.name}
  isOutOfStock={isOutOfStock}
/>

            {/* ℹ️ INFORMATIONS PRODUIT */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.category}
                </span>
                {product.brand && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-700 font-medium">
                      {product.brand}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Badge stock */}
              {!isOutOfStock && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit mb-4 ${
                    isLowStock
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {isLowStock
                    ? `⚠️ Plus que ${product.stock_quantity} en stock`
                    : '✓ En stock'}
                </div>
              )}

              {/* Disponibilité */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Disponibilité :
                  </span>
                  {product.stock_quantity > 0 ? (
                    <span
                      className={`text-sm font-semibold ${
                        isLowStock ? 'text-orange-600' : 'text-green-600'
                      }`}
                    >
                      {product.stock_quantity} unité
                      {product.stock_quantity > 1 ? 's' : ''} disponible
                      {product.stock_quantity > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 font-semibold">
                      Rupture de stock
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Spécifications */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">
                      Caractéristiques techniques
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between border-b border-gray-200 pb-2 gap-8 last:border-0"
                          >
                            <span className="text-gray-600 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="font-medium text-gray-900">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Boutons d'action */}
              <div className="mt-auto space-y-3">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Produit indisponible
                  </button>
                ) : (
                  <AddToCartButton product={product} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <SimilarProducts products={similarProducts} />
        )}
      </div>
    </div>
  )
}

// Métadonnées
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) return { title: 'Produit non trouvé' };

  // 🛡️ Extraction sécurisée de l'URL pour les réseaux sociaux
  const ogImage = Array.isArray(product.images) && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
    : product.image_url || '/placeholder.jpg';

  return {
    title: `${product.name} - ${product.brand || 'Boutique'}`,
    description: product.description,
    openGraph: {
      images: [{ url: ogImage }],
    },
  };
}
