/**
 * ============================================
 * CONVERSION DE DEVISES
 * ============================================
 */

import type { PriceDisplay, Currency } from '@/types/currency'
import { formatPriceFC, formatPriceUSD } from '@/types/product'

/**
 * Convertit un prix en FC (centimes) vers USD
 * 
 * @param priceInFcCentimes - Prix en centimes FC (ex: 2800000 = 28 000 FC)
 * @param exchangeRate - Taux de change (ex: 2800 = 1 USD = 2800 FC)
 * @returns Prix en USD (ex: 10)
 * 
 * @example
 * const priceUsd = convertFcToUsd(2800000, 2800)
 * console.log(priceUsd) // 10
 */
export function convertFcToUsd(
  priceInFcCentimes: number,
  exchangeRate: number
): number {
  if (exchangeRate <= 0) {
    console.error('Taux de change invalide:', exchangeRate)
    return 0
  }

  // Convertir centimes FC en FC
  const priceInFc = priceInFcCentimes / 100

  // Convertir FC en USD
  const priceInUsd = priceInFc / exchangeRate

  // Arrondir à 2 décimales
  return Math.round(priceInUsd * 100) / 100
}

/**
 * Convertit un prix en USD vers FC (centimes)
 * 
 * @param priceInUsd - Prix en USD (ex: 10)
 * @param exchangeRate - Taux de change (ex: 2800)
 * @returns Prix en centimes FC (ex: 2800000)
 * 
 * @example
 * const priceFc = convertUsdToFc(10, 2800)
 * console.log(priceFc) // 2800000
 */
export function convertUsdToFc(
  priceInUsd: number,
  exchangeRate: number
): number {
  if (exchangeRate <= 0) {
    console.error('Taux de change invalide:', exchangeRate)
    return 0
  }

  // Convertir USD en FC
  const priceInFc = priceInUsd * exchangeRate

  // Convertir FC en centimes
  const priceInFcCentimes = Math.round(priceInFc * 100)

  return priceInFcCentimes
}

/**
 * Crée un objet PriceDisplay avec les deux devises formatées
 * 
 * @param priceInFcCentimes - Prix en centimes FC
 * @param exchangeRate - Taux de change
 * @returns Objet avec les deux prix formatés
 * 
 * @example
 * const display = createPriceDisplay(2800000, 2800)
 * console.log(display.fc.formatted)  // "28 000 FC"
 * console.log(display.usd.formatted) // "$10.00"
 */
export function createPriceDisplay(
  priceInFcCentimes: number,
  exchangeRate: number
): PriceDisplay {
  const priceUsd = convertFcToUsd(priceInFcCentimes, exchangeRate)

  return {
    fc: {
      amount: priceInFcCentimes,
      formatted: formatPriceFC(priceInFcCentimes)
    },
    usd: {
      amount: priceUsd,
      formatted: formatPriceUSD(priceUsd, { showDecimals: true })
    }
  }
}

/**
 * Formate un prix dans la devise spécifiée
 * 
 * @param amount - Montant (en centimes FC si currency='FC', en USD si currency='USD')
 * @param currency - Devise à utiliser
 * @param options - Options de formatage
 * @returns Prix formaté
 * 
 * @example
 * formatPrice(2800000, 'FC')              // "28 000 FC"
 * formatPrice(10, 'USD')                  // "$10"
 * formatPrice(10, 'USD', { showDecimals: true }) // "$10.00"
 */
export function formatPrice(
  amount: number,
  currency: Currency,
  options: {
    showDecimals?: boolean
    showSymbol?: boolean
  } = {}
): string {
  if (currency === 'FC') {
    return formatPriceFC(amount, options)
  } else {
    return formatPriceUSD(amount, options)
  }
}

/**
 * Convertit un montant d'une devise à une autre
 * 
 * @param amount - Montant à convertir
 * @param from - Devise source
 * @param to - Devise cible
 * @param exchangeRate - Taux de change
 * @returns Montant converti
 * 
 * @example
 * convertCurrency(2800000, 'FC', 'USD', 2800) // 10
 * convertCurrency(10, 'USD', 'FC', 2800)      // 2800000
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRate: number
): number {
  // Même devise = pas de conversion
  if (from === to) return amount

  if (from === 'FC' && to === 'USD') {
    return convertFcToUsd(amount, exchangeRate)
  } else {
    return convertUsdToFc(amount, exchangeRate)
  }
}

/**
 * Calcule la différence de prix entre deux montants
 * Utile pour afficher les économies ou augmentations
 * 
 * @example
 * const diff = calculatePriceDifference(3000000, 2800000, 2800)
 * console.log(diff.fc.formatted)  // "+2 000 FC"
 * console.log(diff.usd.formatted) // "+$0.71"
 */
export function calculatePriceDifference(
  newPriceInFcCentimes: number,
  oldPriceInFcCentimes: number,
  exchangeRate: number
): PriceDisplay {
  const difference = newPriceInFcCentimes - oldPriceInFcCentimes
  
  return createPriceDisplay(Math.abs(difference), exchangeRate)
}