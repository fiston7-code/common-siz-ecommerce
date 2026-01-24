import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client avec clé SERVICE_ROLE pour les opérations admin/backend
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Fonction query compatible avec l'ancien code PostgreSQL
export async function query(text: string, params?: unknown[]) {
  // Pour compatibilité, on utilise directement Supabase
  // Cette fonction est maintenant un wrapper
  throw new Error('Utilisez directement supabaseAdmin au lieu de query()');
}