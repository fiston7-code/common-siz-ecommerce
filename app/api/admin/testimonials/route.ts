import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ GET - Public : Récupérer uniquement ce qui est visible
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, testimonials: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🛡️ POST - Privé : Seul l'admin peut ajouter un témoignage
export async function POST(request: NextRequest) {
  try {
    // 1. Vérification de l'identité (Admin uniquement)
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { client_name, content, rating, location, product_name, is_visible } = body;

    // 2. Insertion dans Supabase
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        client_name,
        content,
        rating: Number(rating), // On s'assure que c'est un nombre
        location,
        product_name,
        is_visible: is_visible ?? true 
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Erreur API Testimonials:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}