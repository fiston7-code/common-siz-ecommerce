'use client'

import { useState, useEffect } from 'react'
import { getCurrentExchangeRate, updateExchangeRate, getExchangeRateHistory } from '@/app/admin/settingsRate/actions'

interface ExchangeRateManagerProps {
  mode: 'display' | 'edit'
  currentRate?: number
  showHistory?: boolean
}

interface ExchangeRateRecord {
  id: string | number
  rate: number
  is_active: boolean
  created_at: string
}

export function ExchangeRateManager({ 
  mode = 'display',
  currentRate: initialRate,
  showHistory = false
}: ExchangeRateManagerProps) {
  const [rate, setRate] = useState(initialRate || 0)
  const [newRate, setNewRate] = useState('')
  const [history, setHistory] = useState<ExchangeRateRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Charger le taux actuel si non fourni
  useEffect(() => {
    if (!initialRate) {
      getCurrentExchangeRate().then(data => setRate(data.rate))
    }
  }, [initialRate])

  // Charger l'historique si demandé
  useEffect(() => {
    if (showHistory) {
      getExchangeRateHistory().then(setHistory)
    }
  }, [showHistory])

  // Mettre à jour le taux
  const handleUpdate = async () => {
    setLoading(true)
    setError('')

    try {
      const rateValue = parseFloat(newRate)
      if (isNaN(rateValue) || rateValue <= 0) {
        throw new Error('Taux invalide')
      }

      await updateExchangeRate(rateValue)
      setRate(rateValue)
      setNewRate('')
      
      if (showHistory) {
        const updatedHistory = await getExchangeRateHistory()
        setHistory(updatedHistory)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    } finally {
      setLoading(false)
    }
  }

  // Mode affichage simple
  if (mode === 'display') {
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-900">Taux de change actuel</p>
          <p className="text-xs text-blue-700">1 USD = {rate.toLocaleString('fr-FR')} FC</p>
        </div>
      </div>
    )
  }

  // Mode édition (admin)
  return (
    <div className="space-y-6">
      {/* Taux actuel */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Taux de change actuel</h3>
        <div className="text-3xl font-bold text-blue-600">
          1 USD = {rate.toLocaleString('fr-FR')} FC
        </div>
      </div>

      {/* Formulaire de mise à jour */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Modifier le taux</h3>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau taux (FC pour 1 USD)
            </label>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="Ex: 2850"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleUpdate}
            disabled={loading || !newRate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Historique */}
      {showHistory && history.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Historique des taux</h3>
          
          <div className="space-y-2">
            {history.map((item) => (
              <div 
                key={item.id}
                className={`p-3 rounded ${item.is_active ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    1 USD = {item.rate.toLocaleString('fr-FR')} FC
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {item.is_active && (
                  <span className="text-xs text-green-600 font-medium">Actif</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}