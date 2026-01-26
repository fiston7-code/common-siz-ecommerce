'use server'

import { createServerClient, createAdminClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// Helper - vérifier le JWT
async function verifyAdminAccess() {
  const cookieStore = await cookies()
  
  const token = cookieStore.get('admin_token')?.value
  if (!token) {
    throw new Error('Unauthorized: No token')
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw new Error('Unauthorized: Invalid token')
  }

  return { adminId: payload.id }
}

// Récupérer le taux actuel (lecture publique OK)
export async function getCurrentExchangeRate() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return data
}

// Mettre à jour le taux (ADMIN CLIENT pour bypass RLS)
export async function updateExchangeRate(newRate: number) {
  const { adminId } = await verifyAdminAccess()
  
  const supabase = await createAdminClient() // ✅ ADMIN CLIENT

  await supabase
    .from('exchange_rates')
    .update({ is_active: false })
    .eq('is_active', true)

  const { data, error } = await supabase
    .from('exchange_rates')
    .insert({
      rate: newRate,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/products')
  revalidatePath('/admin/settings')

  return data
}

// Récupérer l'historique (ADMIN CLIENT)
export async function getExchangeRateHistory() {
  await verifyAdminAccess()
  
  const supabase = await createAdminClient() // ✅ ADMIN CLIENT
  
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}