'use client';

import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';

interface CartButtonProps {
  onOpenCart: () => void;
}

export default function CartButton({ onOpenCart }: CartButtonProps) {
  const cartItems = useCartStore((state) => state.items || []);
  
  return (
    <motion.button
      onClick={onOpenCart}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="relative bg-yellow-400 p-3 rounded-full hover:bg-yellow-500 transition-colors shadow-lg"
      aria-label="Panier"
    >
      <ShoppingCart className="w-6 h-6 text-blue-900" />
      
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
          >
            {cartItems.length}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}