import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import '../styles/globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/next"
import WhatsAppButton from '@/components/WhatsAppButton';
import MetaPixel from '@/components/MetaPixel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Comon-siz | E-commerce à Kinshasa - Paiement à la livraison',
  description: 'Votre marketplace de confiance à Kinshasa. Commandez en ligne, payez à la livraison. Livraison rapide dans toutes les communes de Kinshasa, RDC.',
  metadataBase: new URL('https://comon-siz.com'),
  keywords: ['e-commerce Kinshasa', 'achat en ligne RDC', 'livraison Kinshasa', 'paiement à la livraison', 'marketplace Congo'],
  openGraph: {
    title: 'Comon-siz | E-commerce à Kinshasa',
    description: 'Commandez en ligne, payez à la livraison. Livraison rapide partout à Kinshasa.',
    url: 'https://comon-siz.com',
    siteName: 'Comon-siz',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Comon-siz - Marketplace Kinshasa',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comon-siz | E-commerce à Kinshasa',
    description: 'Commandez en ligne, payez à la livraison. Livraison rapide partout à Kinshasa.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Meta Pixel pour le tracking Facebook */}
        <MetaPixel />

        <QueryProvider>
          {/* Navbar conditionnelle (masquée sur /admin/*) */}
          <ConditionalNavbar />
          
          {/* Contenu principal */}
          <main>{children}</main>
          
          {/* Bouton WhatsApp flottant */}
          <WhatsAppButton />
          
          {/* Analytics Vercel */}
          <Analytics />
          
          {/* Footer */}
          <footer>
            <Footer />
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}