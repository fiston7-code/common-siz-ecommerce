// app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, verifyPassword, hashPassword, generateToken } from '@/lib/auth';
import { createAdminClient } from '@/lib/server';

// PATCH - Mettre à jour le profil (nom OU mot de passe)
export async function PATCH(request: Request) {
  try {
    // Vérifier l'authentification
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createAdminClient();

    // ========== Modifier le NOM ==========
    if (body.name !== undefined) {
      const { name } = body;

      if (!name || name.trim().length === 0) {
        return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
      }

      // Mettre à jour dans la DB
      const { error } = await supabase
        .from('admins')
        .update({ name: name.trim(), updated_at: new Date().toISOString() })
        .eq('id', payload.id);

      if (error) throw error;

      // Générer un nouveau token avec le nom mis à jour
      const newPayload = { ...payload, name: name.trim() };
      const newToken = generateToken(newPayload);

      // Retourner avec le nouveau cookie
      const response = NextResponse.json({ success: true, name: name.trim() });
      response.cookies.set('admin_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      });

      return response;
    }

    // ========== Modifier le MOT DE PASSE ==========
    if (body.oldPassword !== undefined && body.newPassword !== undefined) {
      const { oldPassword, newPassword } = body;

      if (!oldPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Tous les champs sont requis' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' },
          { status: 400 }
        );
      }

      // Récupérer l'admin actuel
      const { data: admin, error: fetchError } = await supabase
        .from('admins')
        .select('password_hash')
        .eq('id', payload.id)
        .single();

      if (fetchError || !admin) {
        return NextResponse.json({ error: 'Administrateur non trouvé' }, { status: 404 });
      }

      // Vérifier l'ancien mot de passe
      const isValidOldPassword = await verifyPassword(oldPassword, admin.password_hash);

      if (!isValidOldPassword) {
        return NextResponse.json(
          { error: 'Mot de passe actuel incorrect' },
          { status: 400 }
        );
      }

      // Hasher le nouveau mot de passe
      const newPasswordHash = await hashPassword(newPassword);

      // Mettre à jour dans la DB
      const { error: updateError } = await supabase
        .from('admins')
        .update({
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.id);

      if (updateError) throw updateError;

      return NextResponse.json({ success: true });
    }

    // Si aucune donnée valide
    return NextResponse.json(
      { error: 'Aucune donnée à mettre à jour' },
      { status: 400 }
    );

  } catch (error: unknown) {
    console.error('❌ Error updating settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}