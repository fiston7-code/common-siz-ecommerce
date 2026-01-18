'use client'

/**
 * ============================================
 * PROVIDER TANSTACK QUERY
 * ============================================
 */

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { makeQueryClient } from '@/lib/query-client'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * Provider TanStack Query pour l'application
 * Wrap tous les composants qui utilisent useQuery/useMutation
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Créer une instance unique du QueryClient par app
  // Important: ne pas créer en dehors du composant pour éviter
  // le partage d'état entre les requêtes côté serveur
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools uniquement en développement */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}