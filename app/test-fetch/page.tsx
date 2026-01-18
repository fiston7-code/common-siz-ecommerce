'use client'

import { useEffect, useState } from 'react'
import { fetchProducts } from '@/lib/supabase/api/products'

export default function TestFetchPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    async function test() {
      console.log('🔍 Test de fetchProducts...')
      
      try {
        const data = await fetchProducts()
        
        console.log('📊 Résultat de fetchProducts:')
        console.log('- products:', data.products)
        console.log('- totalCount:', data.totalCount)
        console.log('- totalPages:', data.totalPages)
        console.log('- currentPage:', data.currentPage)
        
        setResult(data)
      } catch (err: any) {
        console.error('❌ Erreur:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    test()
  }, [])

  if (loading) {
    return <div style={{ padding: '40px' }}>Chargement...</div>
  }

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'red' }}>
        <h1>❌ Erreur</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>🧪 Test de fetchProducts()</h1>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#d4edda',
        border: '2px solid #28a745',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>✅ {result.totalCount} produits trouvés</h2>
        <p>Pages totales: {result.totalPages}</p>
        <p>Page actuelle: {result.currentPage}</p>
      </div>

      <h3>Liste des produits :</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        {result.products.map((product: any) => (
          <div 
            key={product.id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <h4>{product.name}</h4>
            <p>Catégorie: {product.category}</p>
            <p>Prix: {product.price} FCFA</p>
            <p>Stock: {product.stock_quantity}</p>
            <p>Disponible: {product.is_available ? '✅' : '❌'}</p>
          </div>
        ))}
      </div>

      <h3>Données brutes :</h3>
      <pre style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}