import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { generateToken, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const supabase = await createAdminClient();

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, admin.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    console.log('✅ Login successful for:', admin.email);

    return response;
  } catch (error) {
    console.error('💥 Login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}