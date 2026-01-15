// components/DeliveryInfo.tsx
'use client';

import { MapPin, Phone, Clock, Shield } from 'lucide-react';

export default function DeliveryInfo() {
  return (
    <section className="py-16 bg-gradient-to-br from-yellow-400 to-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Info de contact */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-900">
              Livraison partout à Kinshasa
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/90 p-4 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-900 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-blue-900">Notre adresse</div>
                  <div className="text-gray-700">
                    Luvua 23bis C/Barumbu<br />
                    Croisement Luvua et Confinant
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/90 p-4 rounded-xl">
                <Phone className="w-6 h-6 text-blue-900 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-blue-900">Contactez-nous</div>
                  <a 
                    href="tel:+243971676949" 
                    className="text-gray-700 hover:text-blue-900 transition"
                  >
                    +243 971 676 949
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/90 p-4 rounded-xl">
                <Clock className="w-6 h-6 text-blue-900 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-blue-900">Horaires</div>
                  <div className="text-gray-700">Lun - Sam : 8h - 18h</div>
                </div>
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="bg-blue-900 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Pourquoi nous choisir ?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <div className="font-bold">Paiement sécurisé</div>
                  <div className="text-blue-200">Payez uniquement à la livraison</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <div className="font-bold">Livraison rapide</div>
                  <div className="text-blue-200">24-48h dans tout Kinshasa</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <div className="font-bold">Support client</div>
                  <div className="text-blue-200">Disponible 6j/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}