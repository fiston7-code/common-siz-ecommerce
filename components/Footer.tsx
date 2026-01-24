// components/Footer.tsx
'use client';

import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Colonne 1 : Logo & Description */}
          <div className="space-y-6">
            <Image
              src="/file.svg"
              alt="Comon-siz Business"
              width={180}
              height={45}
              className="brightness-0 invert"
            />
            <p className="text-blue-200 text-sm leading-relaxed">
              Votre marketplace de confiance à Kinshasa. 
              Commandez en ligne, payez à la livraison. 
              Livraison rapide dans toutes les communes.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-800 hover:bg-yellow-400 hover:text-blue-900 rounded-full flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
            
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-800 hover:bg-yellow-400 hover:text-blue-900 rounded-full flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-800 hover:bg-yellow-400 hover:text-blue-900 rounded-full flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-yellow-400">Navigation</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/products', label: 'Nos Produits' },
                { href: '/about', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
                { href: '/how-it-works', label: 'Comment ça marche ?' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-blue-200 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Informations */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-yellow-400">Informations</h3>
            <ul className="space-y-3">
              {[
                { href: '/terms', label: 'Conditions générales' },
                { href: '/privacy', label: 'Politique de confidentialité' },
                { href: '/shipping', label: 'Livraison & Retours' },
                { href: '/faq', label: 'FAQ' },
                { href: '/account', label: 'Mon compte' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-blue-200 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-yellow-400">Contact</h3>
            <div className="space-y-4">
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="text-sm text-blue-200">
                  Luvua 23bis C/Barumbu<br />
                  Croisement Luvua et Confinant<br />
                  Kinshasa, RDC
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <a 
                    href="tel:+243971676949"
                    className="text-sm text-blue-200 hover:text-yellow-400 transition-colors block"
                  >
                    +243 971 676 949
                  </a>
                  <a 
                    href="tel:+243993769146"
                    className="text-sm text-blue-200 hover:text-yellow-400 transition-colors block"
                  >
                    +243 993 769 146
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <a 
                  href="mailto:contact@comon-siz.com"
                  className="text-sm text-blue-200 hover:text-yellow-400 transition-colors"
                >
                  contact@comon-siz.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="text-sm text-blue-200">
                  Lun - Sam : 8h - 18h<br />
                  Dimanche : Fermé
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <p className="text-sm text-blue-300 text-center md:text-left">
              © {new Date().getFullYear()} Comon-siz Business. Tous droits réservés.
            </p>

            {/* Méthodes de paiement */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-blue-300">Paiement accepté :</span>
              <div className="flex gap-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-blue-900">
                  Espèces
                </div>
                <div className="bg-white px-3 py-1 rounded text-xs font-bold text-blue-900">
                  Mobile Money
                </div>
              </div>
            </div>

            {/* Lien Admin (discret) */}
            <Link 
              href="/admin/login"
              className="text-xs text-blue-400 hover:text-yellow-400 transition-colors"
            >
              Adm
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}