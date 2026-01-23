import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface AdminPayload {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  name: string;
}

// Récupérer le secret avec fallback
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('❌ JWT_SECRET is not defined!');
    throw new Error('JWT_SECRET is required');
  }
  
  console.log('✅ JWT_SECRET is defined (length:', secret.length, ')');
  return secret;
}

// Générer un token JWT
export function generateToken(payload: AdminPayload): string {
  const secret = getJwtSecret();
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  console.log('🎫 Token generated (length:', token.length, ')');
  return token;
}

// Vérifier un token JWT
export function verifyToken(token: string): AdminPayload | null {
  try {
    const secret = getJwtSecret();
    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, secret) as AdminPayload;
    console.log('✅ Token valid:', decoded.email, decoded.role);
    return decoded;
  } catch (error: unknown) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}

// Hasher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Vérifier un mot de passe
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}