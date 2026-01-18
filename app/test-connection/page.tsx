'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<{
    connected: boolean
    message: string
    details?: any
  }>({
    connected: false,
    message: 'Test en cours...'
  })

  useEffect(() => {
    async function testConnection() {
      console.log('🔍 Début du test de connexion...')
      
      try {
        // Test 1 : Vérifier que supabase est initialisé
        if (!supabase) {
          setStatus({
            connected: false,
            message: '❌ Client Supabase non initialisé'
          })
          return
        }
        
        console.log('✅ Client Supabase initialisé')

        // Test 2 : Tester une requête simple
        const { data, error } = await supabase
          .from('products')
          .select('count')
          .limit(1)
        
        console.log('📊 Résultat de la requête:')
        console.log('- data:', data)
        console.log('- error:', error)

        if (error) {
          setStatus({
            connected: false,
            message: `❌ Erreur de connexion: ${error.message}`,
            details: error
          })
          return
        }

        // Test 3 : Compter les produits
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
        
        console.log('📊 Comptage:')
        console.log('- count:', count)
        console.log('- countError:', countError)

        if (countError) {
          setStatus({
            connected: false,
            message: `❌ Erreur de comptage: ${countError.message}`,
            details: countError
          })
          return
        }

        setStatus({
          connected: true,
          message: `✅ Connexion réussie ! ${count} produits trouvés`,
          details: { count }
        })

      } catch (err: any) {
        console.error('❌ Erreur inattendue:', err)
        setStatus({
          connected: false,
          message: `❌ Erreur inattendue: ${err.message}`,
          details: err
        })
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        🧪 Test de connexion Supabase
      </h1>

      <div style={{
        padding: '20px',
        backgroundColor: status.connected ? '#d4edda' : '#f8d7da',
        border: `2px solid ${status.connected ? '#28a745' : '#dc3545'}`,
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>
          {status.message}
        </h2>
      </div>

      {status.details && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          <h3>Détails :</h3>
          <pre style={{ fontSize: '14px' }}>
            {JSON.stringify(status.details, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Ouvrez la console (F12) pour plus de détails</h3>
      </div>
    </div>
  )
}