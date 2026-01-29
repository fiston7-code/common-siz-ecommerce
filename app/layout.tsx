import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import '../styles/globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/next"
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce App',
  description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
  metadataBase: new URL('https://comon-siz.com'), // ⬅️ Remplace par ton URL Vercel
  openGraph: {
    title: 'E-commerce App',
    description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
    url: 'https://comon-siz.com',
    siteName: 'E-commerce App',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'E-commerce App',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-commerce App',
    description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
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
        <QueryProvider>
          <ConditionalNavbar />
          <main>{children}</main>
          <WhatsAppButton />
          <Analytics />
          <footer>
            <Footer />
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}




// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import { QueryProvider } from '@/providers/query-provider';
// import '../styles/globals.css';
// import ConditionalNavbar from '@/components/ConditionalNavbar';
// import Footer from '@/components/Footer';
// import { Analytics } from "@vercel/analytics/next"

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'E-commerce App',
//   description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="fr">
//       <body className={inter.className}>
//         <QueryProvider>
//           {/* Navbar conditionnelle (masquée sur /admin/*) */}
//           <ConditionalNavbar />
          
//           <main>{children}</main>
//           <Analytics />
//           <footer>
//             <Footer />
//           </footer>
//         </QueryProvider>
//       </body>
//     </html>
//   );
// }