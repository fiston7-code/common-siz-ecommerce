
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test de connexion
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    console.log('✅ Connexion OK')
    console.log('Data:', data)
    console.log('Error:', error)
    return { success: !error, data, error }
  } catch (err) {
    console.error('❌ Erreur de connexion:', err)
    return { success: false, error: err }
  }
}