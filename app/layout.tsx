import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Commerce App',
  description: 'Application e-commerce avec gestion FC/USD',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Wrap toute l'app avec le QueryProvider */}
        <QueryProvider>
          <Navbar/>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}