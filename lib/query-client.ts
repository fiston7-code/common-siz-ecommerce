/**
 * ============================================
 * CONFIGURATION TANSTACK QUERY
 * ============================================
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query'

/**
 * Options par défaut pour toutes les requêtes
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Temps avant qu'une requête soit considérée comme "stale" (périmée)
    staleTime: 1000 * 60 * 5, // 5 minutes
    
    // Temps avant qu'une requête inactive soit supprimée du cache
    gcTime: 1000 * 60 * 30, // 30 minutes (anciennement cacheTime)
    
    // Retry automatique en cas d'échec
    retry: 1,
    
    // Délai entre les tentatives
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch au focus de la fenêtre
    refetchOnWindowFocus: false,
    
    // Refetch à la reconnexion
    refetchOnReconnect: true,
    
    // Refetch au montage du composant
    refetchOnMount: true,
  },
  mutations: {
    // Retry pour les mutations
    retry: 0,
  },
}

/**
 * Créer une instance du Query Client
 * À utiliser dans le provider
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions,
  })
}

/**
 * Instance globale du Query Client
 * Pour une utilisation en dehors des composants React
 */
export const queryClient = makeQueryClient()