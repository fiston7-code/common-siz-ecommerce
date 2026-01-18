/**
 * ============================================
 * GESTION DU TAUX DE CHANGE
 * ============================================
 */

import { supabase } from '@/lib/supabase/client'
import type { ExchangeRate, ExchangeRateData } from '@/types/currency'

/**
 * Récupère le taux de change actif depuis Supabase
 * @returns Le taux de change actuel ou null si aucun taux actif
 * 
 * @example
 * const rate = await getActiveExchangeRate()
 * if (rate) {
 *   console.log(`1 USD = ${rate.rate} FC`)
 * }
 */
export async function getActiveExchangeRate(): Promise<ExchangeRateData | null> {
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('is_active', true)
      .eq('from_currency', 'USD')
      .eq('to_currency', 'CDF')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération du taux de change:', error)
      return null
    }

    if (!data) {
      console.warn('Aucun taux de change actif trouvé')
      return null
    }

    return {
      rate: data.rate,
      lastUpdated: new Date(data.updated_at)
    }
  } catch (error) {
    console.error('Erreur inattendue:', error)
    return null
  }
}

/**
 * Récupère l'historique des taux de change
 * @param limit - Nombre de taux à récupérer (par défaut 10)
 * @returns Liste des taux de change
 * 
 * @example
 * const history = await getExchangeRateHistory(5)
 * history.forEach(rate => {
 *   console.log(`${rate.created_at}: 1 USD = ${rate.rate} FC`)
 * })
 */
export async function getExchangeRateHistory(
  limit: number = 10
): Promise<ExchangeRate[]> {
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('from_currency', 'USD')
      .eq('to_currency', 'CDF')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erreur inattendue:', error)
    return []
  }
}

/**
 * Crée un nouveau taux de change (ADMIN uniquement)
 * Désactive automatiquement tous les anciens taux
 * 
 * @param rate - Le nouveau taux (ex: 2800 pour 1 USD = 2800 FC)
 * @param userId - UUID de l'admin qui crée le taux
 * @returns Le taux créé ou null en cas d'erreur
 * 
 * @example
 * const newRate = await createExchangeRate(2850, adminId)
 * if (newRate) {
 *   console.log('Nouveau taux créé:', newRate.rate)
 * }
 */
export async function createExchangeRate(
  rate: number,
  userId: string
): Promise<ExchangeRate | null> {
  try {
    // 1. Désactiver tous les anciens taux
    const { error: deactivateError } = await supabase
      .from('exchange_rates')
      .update({ is_active: false })
      .eq('is_active', true)

    if (deactivateError) {
      console.error('Erreur lors de la désactivation des anciens taux:', deactivateError)
      return null
    }

    // 2. Créer le nouveau taux
    const { data, error } = await supabase
      .from('exchange_rates')
      .insert({
        from_currency: 'USD',
        to_currency: 'CDF',
        rate,
        is_active: true,
        created_by: userId
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création du taux:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erreur inattendue:', error)
    return null
  }
}

/**
 * Taux de change par défaut si aucun taux n'est configuré
 * Utilisé comme fallback pour ne pas bloquer l'application
 */
export const DEFAULT_EXCHANGE_RATE = 2800

/**
 * Récupère le taux de change avec fallback
 * Garantit toujours un taux (utilise DEFAULT_EXCHANGE_RATE si besoin)
 * 
 * @returns Le taux de change (toujours un nombre)
 * 
 * @example
 * const rate = await getExchangeRateWithFallback()
 * // Retourne toujours un nombre, même si la DB est inaccessible
 */
export async function getExchangeRateWithFallback(): Promise<number> {
  const rateData = await getActiveExchangeRate()
  
  if (!rateData) {
    console.warn(
      `Aucun taux actif trouvé. Utilisation du taux par défaut: ${DEFAULT_EXCHANGE_RATE}`
    )
    return DEFAULT_EXCHANGE_RATE
  }

  return rateData.rate
}