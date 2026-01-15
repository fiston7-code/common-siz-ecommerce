// components/Hero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Truck, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden">
      {/* Motif Z décoratif (comme votre image) */}
      <div className="absolute right-0 top-0 opacity-10 text-[200px] font-bold leading-none">
        <div className="space-y-4">
          <div>ZZZ</div>
          <div className="ml-8">ZZ</div>
          <div className="ml-16">Z</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Vos achats livrés
              <span className="block text-yellow-400">
                directement chez vous
              </span>
            </h1>
            
            <p className="text-xl text-blue-100">
              Commandez en ligne, payez à la livraison. 
              Disponible partout à Kinshasa.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Voir les produits
              </Link>
              
              <Link
                href="/how-it-works"
                className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition"
              >
                Comment ça marche ?
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm text-blue-200">Produits</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">24h</div>
                <div className="text-sm text-blue-200">Livraison</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">100%</div>
                <div className="text-sm text-blue-200">Sécurisé</div>
              </div>
            </div>
          </div>

          {/* Image / Illustration */}
          <div className="relative">
            <div className="bg-yellow-400 rounded-[40px] p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image
                src="/hero-products.png"
                alt="Produits Comon-siz"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl"
                priority
              />
            </div>
            
            {/* Badge flottant */}
            <div className="absolute -bottom-6 -left-6 bg-white text-blue-900 px-6 py-4 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="font-bold">Livraison Gratuite</div>
                  <div className="text-sm text-gray-600">Commande +50$</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vague décorative */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}