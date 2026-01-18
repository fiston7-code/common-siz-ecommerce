/**
 * ============================================
 * TYPES POUR LA GESTION DES DEVISES
 * ============================================
 */

/**
 * Les devises supportées dans l'application
 */
export type Currency = 'FC' | 'USD'

/**
 * Structure d'un taux de change dans la base de données
 * Correspond à la table `exchange_rates`
 */
export interface ExchangeRate {
  id: string
  from_currency: string  // Toujours 'USD'
  to_currency: string    // Toujours 'CDF'
  rate: number          // Ex: 2800.00
  is_active: boolean
  created_by?: string   // UUID de l'admin
  created_at: string
  updated_at: string
}

/**
 * Structure simplifiée du taux pour l'utilisation dans l'app
 */
export interface ExchangeRateData {
  rate: number          // Ex: 2800
  lastUpdated: Date     // Date de dernière mise à jour
}

/**
 * Options pour le formatage des prix
 */
export interface PriceFormatOptions {
  currency: Currency
  showSymbol?: boolean      // Afficher le symbole (FC ou $)
  showDecimals?: boolean    // Afficher les décimales (.00)
  compact?: boolean         // Format compact (2.8M au lieu de 2 800 000)
}

/**
 * Structure pour afficher un prix dans les deux devises
 */
export interface PriceDisplay {
  fc: {
    amount: number          // Montant en centimes (2800000)
    formatted: string       // Formaté (2 800 000 FC)
  }
  usd: {
    amount: number          // Montant en dollars (1000)
    formatted: string       // Formaté ($1,000)
  }
}

/**
 * Préférences utilisateur pour l'affichage des prix
 */
export interface CurrencyPreference {
  preferred: Currency       // Devise préférée de l'utilisateur
  showBoth: boolean        // Afficher les deux devises (toujours true pour option 3)
}