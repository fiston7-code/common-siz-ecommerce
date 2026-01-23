import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Autoriser /admin/login (pas /auth/login)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protéger /admin/*
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      console.log('🔒 No token, redirect to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = verifyToken(token);

    if (!payload) {
      console.log('🔒 Invalid token, redirect to login');
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    // Rediriger les admins vers /admin/orders
    if (pathname === '/admin' && payload.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/admin/orders', request.url));
    }

    console.log('✅ Access granted:', payload.email);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};