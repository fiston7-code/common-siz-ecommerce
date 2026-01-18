/**
 * ============================================
 * EXPORTS CENTRALISÉS - CURRENCY
 * ============================================
 */

// Exchange rate functions
export {
  getActiveExchangeRate,
  getExchangeRateHistory,
  createExchangeRate,
  getExchangeRateWithFallback,
  DEFAULT_EXCHANGE_RATE
} from './exchange-rate'

// Conversion functions
export {
  convertFcToUsd,
  convertUsdToFc,
  createPriceDisplay,
  formatPrice,
  convertCurrency,
  calculatePriceDifference
} from './converter'

// Product enrichment functions
export {
  enrichProduct,
  enrichProducts,
  sortProducts,
  filterByPriceRange
} from './product-enricher'