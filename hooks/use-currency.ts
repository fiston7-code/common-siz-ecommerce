'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getActiveExchangeRate, getExchangeRateWithFallback } from '@/lib/currency'
import type { Currency, ExchangeRateData } from '@/types/currency'

const CURRENCY_STORAGE_KEY = 'preferred_currency'

interface UseCurrencyReturn {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  exchangeRate: number
  exchangeRateData: ExchangeRateData | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook pour gérer la devise avec TanStack Query
 */
export function useCurrency(): UseCurrencyReturn {
  const [currency, setCurrencyState] = useState<Currency>('FC')

  // Charger la devise depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null
    if (stored === 'FC' || stored === 'USD') {
      setCurrencyState(stored)
    }
  }, [])

  // Utiliser TanStack Query pour le taux de change
  const {
    data: exchangeRateData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['exchange-rate'],
    queryFn: async () => {
      const rateData = await getActiveExchangeRate()
      if (!rateData) {
        const fallbackRate = await getExchangeRateWithFallback()
        return {
          id: 'fallback',
          rate: fallbackRate,
          source: 'FALLBACK' as const,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      return rateData
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  })

  const exchangeRate = exchangeRateData?.rate || 2800

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
  }, [])

  const toggleCurrency = useCallback(() => {
    setCurrency(currency === 'FC' ? 'USD' : 'FC')
  }, [currency, setCurrency])

  return {
    currency,
    setCurrency,
    toggleCurrency,
    exchangeRate,
    exchangeRateData: exchangeRateData || null,
    isLoading,
    error: error as Error | null,
    refetch
  }
}