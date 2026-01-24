import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import '../styles/globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce App',
  description: 'Application e-commerce avec gestion FC/USD',
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
          {/* ✅ Navbar conditionnelle (masquée sur /admin/*) */}
          <ConditionalNavbar />
          
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}