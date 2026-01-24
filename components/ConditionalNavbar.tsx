'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // ✅ Masquer la Navbar sur toutes les pages admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <Navbar />;
}