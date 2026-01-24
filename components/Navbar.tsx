'use client'

import { useState, useEffect } from 'react'
import { Heart, User, Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

import { CartDrawer } from '@/components/cart/cart-drawer'
import CartButton from './CartButton'

interface NavLinkProps {
  href: string
  label: string
}

export default function PremiumNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)
  const [isProductsHover, setIsProductsHover] = useState(false)
  

  
 
  
  const { scrollY } = useScroll()
  const headerHeight = useTransform(scrollY, [0, 100], [80, 60])
  const logoSize = useTransform(scrollY, [0, 100], [48, 36])
  const announcementOpacity = useTransform(scrollY, [0, 50], [1, 0])
  const shadowOpacity = useTransform(scrollY, [0, 100], [0, 0.1])



  // Messages barre d'annonce
  const announcements = [
    "✨ Livraison OFFERTE dès 100$ d'achat à Gombe, Limete et Bandal",
    "🚚 Livraison express en 24h dans toutes les communes de Kinshasa",
    "📱 Suivez votre commande en direct sur WhatsApp (+243 993769146)",
    "🤝 Paiement à la livraison : Payez seulement après avoir vérifié le colis",
    "🔥 Promo Flash : -10% sur les Tablettes jusqu'à la fin de la semaine"
  ]

  // Rotation automatique des annonces
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [announcements.length])

  // Catégories pour mega-menu
  const categories = [
    { name: "Mode & Accessoires", icon: "👔", items: ["Vêtements", "Chaussures", "Sacs"] },
    { name: "Maison & Déco", icon: "🏠", items: ["Meubles", "Luminaires", "Textile"] },
    { name: "Art & Collection", icon: "🎨", items: ["Tableaux", "Sculptures", "Artisanat"] },
    { name: "Bijoux", icon: "💎", items: ["Colliers", "Bracelets", "Bagues"] }
  ]

  return (
    <>
      <div className="sticky top-0 z-50">
        {/* Barre d'annonce rotative */}
        <motion.div
          style={{ opacity: announcementOpacity }}
          className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white text-center py-2 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnnouncement}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-medium"
            >
              {announcements[currentAnnouncement]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Header principal */}
        <motion.nav
          style={{ 
            height: headerHeight,
            boxShadow: useTransform(shadowOpacity, (v) => `0 4px 20px rgba(0,0,0,${v})`)
          }}
          className="bg-white border-b border-gray-100"
        >
          <div className="container mx-auto px-4 h-full">
            <div className="flex items-center justify-between h-full">
              
              {/* Logo - FIX: Link sans legacyBehavior */}
              <Link href="/" className="flex items-center">
                <motion.div 
                  style={{ height: logoSize }} 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image
                    src="/logo.png"
                    alt="Comon-siz Business"
                    width={200}
                    height={48}
                    className="h-full w-auto"
                    preload={true}
                  />
                </motion.div>
              </Link>

              {/* Navigation Desktop */}
              <div className="hidden lg:flex items-center gap-8">
                <NavLink href="/" label="Accueil" />
                
                {/* Produits avec Mega-Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsProductsHover(true)}
                  onMouseLeave={() => setIsProductsHover(false)}
                >
                  <Link href="/products" className="text-gray-700 font-medium flex items-center gap-1 hover:text-blue-900 transition-colors py-2">
                    <motion.span whileHover={{ y: -1 }}>
                      Produits
                    </motion.span>
                    <motion.div
                      animate={{ rotate: isProductsHover ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {isProductsHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-4xl"
                      >
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
                          <div className="grid grid-cols-4 gap-6">
                            {categories.map((cat, idx) => (
                              <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="space-y-3"
                              >
                                <div className="text-3xl mb-2">{cat.icon}</div>
                                <h3 className="font-bold text-blue-900">{cat.name}</h3>
                                <ul className="space-y-2">
                                  {cat.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        href={`/products?category=${cat.name}`}
                                        className="text-sm text-gray-600 hover:text-blue-900 transition-colors block"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink href="/about" label="À propos" />
                <NavLink href="/contact" label="Contact" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                
               
                {/* Compte avec Dropdown */}
                <div className="relative hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    aria-label="Mon compte"
                  >
                    <User className="w-6 h-6 text-gray-700" />
                  </motion.button>

                  <AnimatePresence>
                    {isAccountOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                      >
                        <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Mon compte
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Mes commandes
                        </Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Ma wishlist
                        </Link>
                        <hr className="my-2" />
                        <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          Déconnexion
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <CartButton onOpenCart={() => setIsCartOpen(true)} />

                
                {/* Menu Mobile Toggle */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2"
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
                style={{ zIndex: 999 }}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl lg:hidden"
                style={{ zIndex: 1000 }}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Header Menu Mobile */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-blue-900">Menu</h2>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      aria-label="Fermer le menu"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {/* Links Mobile */}
                  <motion.div
                    className="space-y-1 flex-1"
                    variants={{
                      open: {
                        transition: { staggerChildren: 0.07 }
                      }
                    }}
                    initial="closed"
                    animate="open"
                  >
                    {[
                      { href: "/", label: "Accueil" },
                      { href: "/products", label: "Produits" },
                      { href: "/about", label: "À propos" },
                      { href: "/contact", label: "Contact" },
                      { href: "/account", label: "Mon compte" },
                      { href: "/wishlist", label: "Ma wishlist" }
                    ].map((link) => (
                      <motion.div
                        key={link.href}
                        variants={{
                          closed: { x: 50, opacity: 0 },
                          open: { x: 0, opacity: 1 }
                        }}
                      >
                        <Link
                          href={link.href}
                          className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  )
}

// Composant NavLink pour navigation desktop
function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link href={href} className="relative text-gray-700 font-medium hover:text-blue-900 transition-colors py-2 block">
      <motion.span
        className="block"
        whileHover={{ y: -1 }}
      >
        {label}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.span>
    </Link>
  )
}


