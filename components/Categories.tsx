// components/Categories.tsx
'use client';

import Link from 'next/link';
import { Smartphone, Laptop, Shirt, Home, Wrench, Gift } from 'lucide-react';

const categories = [
  { name: 'Électronique', icon: Smartphone, color: 'bg-blue-100 text-blue-600', slug: 'electronique' },
  { name: 'Informatique', icon: Laptop, color: 'bg-purple-100 text-purple-600', slug: 'informatique' },
  { name: 'Mode', icon: Shirt, color: 'bg-pink-100 text-pink-600', slug: 'mode' },
  { name: 'Maison', icon: Home, color: 'bg-green-100 text-green-600', slug: 'maison' },
  { name: 'Bricolage', icon: Wrench, color: 'bg-orange-100 text-orange-600', slug: 'bricolage' },
  { name: 'Cadeaux', icon: Gift, color: 'bg-red-100 text-red-600', slug: 'cadeaux' },
];

export default function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Parcourir par catégorie
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-16 h-16 mx-auto rounded-full ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}