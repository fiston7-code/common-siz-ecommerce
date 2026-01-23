import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Ajouter "await params" ici
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // ✅ params est une Promise
) {
  // ✅ DÉBALLAGE DU PARAMS
  const params = await context.params;
  const orderId = params.id;

  console.log('🔵 API PATCH appelée');
  console.log('📝 Order ID:', orderId);

  try {
    // Vérifier l'authentification admin
    const token = request.cookies.get('admin_token')?.value;
    console.log('🔐 Token présent:', !!token);
    
    if (!token) {
      console.error('❌ Pas de token');
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    console.log('🔐 Token vérifié:', !!payload);
    
    if (!payload) {
      console.error('❌ Token invalide');
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer le nouveau statut
    const body = await request.json();
    console.log('📦 Body reçu:', body);
    
    const { status } = body;
    console.log('📝 Nouveau statut:', status);

    // Vérifier que le statut est valide
    const validStatuses = [
      'pending',
      'called',
      'confirmed',
      'preparing',
      'shipped',
      'delivered',
      'cancelled'
    ];

    if (!status || !validStatuses.includes(status)) {
      console.error('❌ Statut invalide:', status);
      return NextResponse.json(
        { error: `Statut invalide: ${status}` },
        { status: 400 }
      );
    }

    console.log('🗄️ Mise à jour dans Supabase...');

    // Mettre à jour la commande dans Supabase
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)  // ✅ Utilise orderId au lieu de params.id
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Commande mise à jour:', data);

    return NextResponse.json({
      success: true,
      order: data,
    });

  } catch (error) {
    console.error('❌ Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: String(error) },
      { status: 500 }
    );
  }
}