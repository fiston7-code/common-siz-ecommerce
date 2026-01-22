import { NextResponse } from 'next/server';
import { generateToken, verifyToken } from '@/lib/auth';

export async function GET() {
  const payload = {
    id: '123',
    email: 'test@test.com',
    role: 'super_admin' as const,
    name: 'Test User',
  };

  console.log('1️⃣ Payload original:', payload);

  const token = generateToken(payload);
  console.log('2️⃣ Token généré:', token);

  const verified = verifyToken(token);
  console.log('3️⃣ Token vérifié:', verified);

  return NextResponse.json({
    original: payload,
    token: token,
    verified: verified,
    jwtSecret: process.env.JWT_SECRET ? 'DEFINED' : 'MISSING',
  });
}