// components/Navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Comon-siz Business"
              width={500}
              height={500}
              className="h-12 w-auto"
            />
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-yellow-400 focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition">
                <Search className="w-5 h-5 text-blue-900" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/account"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-900 transition"
            >
              <User className="w-5 h-5" />
              <span>Compte</span>
            </Link>

            <Link
              href="/cart"
              className="relative bg-yellow-400 p-3 rounded-full hover:bg-yellow-500 transition"
            >
              <ShoppingCart className="w-6 h-6 text-blue-900" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                3
              </span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/products" className="block py-2 text-gray-700 hover:text-blue-900">
              Produits
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-900">
              À propos
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-blue-900">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}