import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createAdminClient } from '@/lib/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/me called');
    
    // Essayer de récupérer le token depuis le cookie OU le header
    let token = request.cookies.get('admin_token')?.value;
    
    // Si pas de cookie, essayer le header Authorization
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    console.log('🍪 Token found:', token ? 'YES ✅' : 'NO ❌');

    if (!token) {
      console.log('🔒 No token, returning 401');
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    console.log('🔓 Verifying token...');
    const payload = verifyToken(token);

    if (!payload) {
      console.log('❌ Token verification failed');
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    console.log('✅ Token verified:', payload.email);

    const supabase = await createAdminClient();
    
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, email, name, role, is_active')
      .eq('id', payload.id)
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      console.log('❌ Admin not found in DB');
      return NextResponse.json(
        { error: 'Admin introuvable' },
        { status: 404 }
      );
    }

    console.log('✅ Admin found:', admin.email);

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('💥 Get me error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}




// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/lib/auth';
// import { createAdminClient } from '@/lib/server';

// export async function GET(request: NextRequest) {
//   try {
//     // Récupérer le token depuis le cookie
//     const token = request.cookies.get('admin_token')?.value;

//     if (!token) {
//       return NextResponse.json(
//         { error: 'Non authentifié' },
//         { status: 401 }
//       );
//     }

//     const payload = verifyToken(token);

//     if (!payload) {
//       return NextResponse.json(
//         { error: 'Token invalide' },
//         { status: 401 }
//       );
//     }

//     // Récupérer les infos à jour de l'admin
//     const supabase = await createAdminClient();
    
//     const { data: admin } = await supabase
//       .from('admins')
//       .select('id, email, name, role, is_active')
//       .eq('id', payload.id)
//       .eq('is_active', true)
//       .single();

//     if (!admin) {
//       return NextResponse.json(
//         { error: 'Admin introuvable' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ admin });
//   } catch (error) {
//     console.error('Get me error:', error);
//     return NextResponse.json(
//       { error: 'Erreur serveur' },
//       { status: 500 }
//     );
//   }
// }