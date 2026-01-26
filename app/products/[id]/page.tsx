import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProductById, fetchSimilarProducts } from '@/lib/supabase/api/products'
import AddToCartButton from '@/components/AddToCartButton'
import SimilarProducts from '@/components/SimilarProducts'

// 🎯 Composant principal - Page détail produit
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // 1️⃣ Récupérer l'ID depuis les paramètres
  const { id } = await params

  // 2️⃣ Récupérer le produit (utilise ta fonction fetchProductById)
  const product = await fetchProductById(id)

  // 3️⃣ Si pas de produit → page 404
  if (!product) {
    notFound()
  }

  // 4️⃣ Vérifier le stock
  const isOutOfStock = product.stock_quantity === 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= (product.stock_threshold || 5)

  // 5️⃣ Récupérer les produits similaires
  const similarProducts = await fetchSimilarProducts(product.id, product.category, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 📍 Breadcrumb (fil d'Ariane) */}
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

      {/* 📦 Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            
            {/* 🖼️ IMAGE DU PRODUIT */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                fill
                className={`object-cover transition-all ${
                  isOutOfStock ? 'opacity-40 grayscale' : ''
                }`}
                priority
              />

              {/* Badge "SOLD OUT" centré si rupture */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-8 py-4 rounded-lg text-2xl font-bold shadow-xl transform -rotate-12">
                    SOLD OUT
                  </div>
                </div>
              )}

              {/* Badge stock coin supérieur droit */}
              {!isOutOfStock && (
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    isLowStock
                      ? 'bg-orange-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {isLowStock
                    ? `Plus que ${product.stock_quantity} en stock`
                    : 'En stock'}
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Rupture de stock
                </div>
              )}
            </div>

            {/* ℹ️ INFORMATIONS PRODUIT */}
            <div className="flex flex-col">
              {/* Catégorie et marque */}
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

              {/* Nom du produit */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

             

              {/* 📊 Disponibilité */}
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

              {/* 📄 Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* ⚙️ Spécifications techniques */}
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
                            className="flex justify-between border-b border-gray-200 pb-2 last:border-0"
                          >
                            <span className="text-gray-600 capitalize">
                              {key.replace(/_/g, ' ')}
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

              {/* 🛒 Boutons d'action */}
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

        {/* 🔄 Produits similaires */}
        {similarProducts.length > 0 && (
          <SimilarProducts products={similarProducts} />
        )}
      </div>
    </div>
  )
}

// 🏷️ Métadonnées dynamiques pour le SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await fetchProductById(id)

  if (!product) {
    return {
      title: 'Produit non trouvé',
    }
  }

  return {
    title: `${product.name} - ${product.brand || 'Boutique'}`,
    description: product.description || `Achetez ${product.name} au meilleur prix`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image_url || '/placeholder.jpg',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  }
}