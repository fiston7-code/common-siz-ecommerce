import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import '../styles/globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/next"
import WhatsAppButton from '@/components/WhatsAppButton';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce App',
  description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
  metadataBase: new URL('https://comon-siz.com'),
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
        {/* ✅ Script Meta Pixel AVANT le noscript */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1285524866814190');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* ✅ Fallback noscript */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }} 
            src="https://www.facebook.com/tr?id=1285524866814190&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

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
// import WhatsAppButton from '@/components/WhatsAppButton';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'E-commerce App',
//   description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
//   metadataBase: new URL('https://comon-siz.com'), // ⬅️ Remplace par ton URL Vercel
//   openGraph: {
//     title: 'E-commerce App',
//     description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
//     url: 'https://comon-siz.com',
//     siteName: 'E-commerce App',
//     images: [
//       {
//         url: '/opengraph-image.png',
//         width: 1200,
//         height: 630,
//         alt: 'E-commerce App',
//       },
//     ],
//     locale: 'fr_FR',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'E-commerce App',
//     description: 'Application e-commerce avec paiement à la livraison partout dans la ville de kinshasa.',
//     images: ['/opengraph-image.png'],
//   },
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
//           <ConditionalNavbar />
//           <main>{children}</main>
//           <WhatsAppButton />
//           <Analytics />
//           <footer>
//             <Footer />
//           </footer>
//         </QueryProvider>
//       </body>
//     </html>
//   );
// }




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