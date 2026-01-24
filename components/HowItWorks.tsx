// components/HowItWorks.tsx
'use client';

import { Search, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Parcourez',
    description: 'Découvrez nos 500+ produits de qualité'
  },
  {
    icon: ShoppingCart,
    title: 'Commandez',
    description: 'Ajoutez au panier et validez votre commande'
  },
  {
    icon: Truck,
    title: 'Recevez',
    description: 'Livraison gratuite en 24h à Kinshasa'
  },
  {
    icon: CheckCircle,
    title: 'Payez',
    description: 'Paiement à la livraison en toute sécurité'
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Comment ça marche ?
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Commander sur Comon-siz est simple et sécurisé. Suivez ces 4 étapes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-blue-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}