import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price_usd: number    // Prix en USD uniquement (ex: 9.99)
  quantity: number
  image?: string
  slug?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalQuantity: () => number
  getTotalPriceUSD: () => number
  getItemQuantity: (id: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalQuantity: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPriceUSD: () => {
        return get().items.reduce(
          (total, item) => total + (item.price_usd * item.quantity),
          0
        )
      },

      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id)
        return item ? item.quantity : 0
      },
    }),
    { name: 'cart-storage' }
  )
)


// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// export interface CartItem {
//   id: string
//   name: string
//   price: number        // Prix en USD (ex: 999.99)
//   quantity: number
//   image?: string
//   slug?: string
// }

// interface CartStore {
//   items: CartItem[]
//   addItem: (item: Omit<CartItem, 'quantity'>) => void
//   removeItem: (id: string) => void
//   updateQuantity: (id: string, quantity: number) => void
//   clearCart: () => void
//   getTotalQuantity: () => number
//   getTotalPriceUSD: () => number
//   getItemQuantity: (id: string) => number
// }

// export const useCartStore = create<CartStore>()(
//   persist(
//     (set, get) => ({
//       items: [],

//       addItem: (item) => {
//         set((state) => {
//           const existingItem = state.items.find((i) => i.id === item.id)
//           if (existingItem) {
//             return {
//               items: state.items.map((i) =>
//                 i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//               ),
//             }
//           }
//           return { items: [...state.items, { ...item, quantity: 1 }] }
//         })
//       },

//       removeItem: (id) => set((state) => ({
//         items: state.items.filter((item) => item.id !== id),
//       })),

//       updateQuantity: (id, quantity) => {
//         if (quantity <= 0) {
//           get().removeItem(id)
//           return
//         }
//         set((state) => ({
//           items: state.items.map((item) =>
//             item.id === id ? { ...item, quantity } : item
//           ),
//         }))
//       },

//       clearCart: () => set({ items: [] }),

//       getTotalQuantity: () => get().items.reduce((total, item) => total + item.quantity, 0),

//       getTotalPriceUSD: () => {
//         return get().items.reduce(
//           (total, item) => total + (item.price * item.quantity),
//           0
//         )
//       },

//       getItemQuantity: (id) => {
//         const item = get().items.find((i) => i.id === id)
//         return item ? item.quantity : 0
//       },
//     }),
//     { name: 'cart-storage' }
//   )
// )
// // import { create } from 'zustand'
// // import { persist } from 'zustand/middleware'

// // export interface CartItem {
// //   id: string
// //   name: string
// //   price: number        // Prix en centimes FC
// //   price_usd: number    // Prix en USD
// //   quantity: number
// //   image?: string
// //   slug?: string
// // }

// // interface CartStore {
// //   items: CartItem[]
  
// //   // Actions de base
// //   addItem: (item: Omit<CartItem, 'quantity'>) => void
// //   removeItem: (id: string) => void
// //   updateQuantity: (id: string, quantity: number) => void
// //   clearCart: () => void
  
// //   // Getters
// //   getTotalQuantity: () => number
// //   getTotalPriceFC: () => number      // Total en centimes FC
// //   getTotalPriceUSD: () => number     // Total en USD
// //   getItemQuantity: (id: string) => number
// // }

// // export const useCartStore = create<CartStore>()(
// //   persist(
// //     (set, get) => ({
// //       items: [],

// //       // Ajouter un produit au panier
// //       addItem: (item) => {
// //         set((state) => {
// //           const existingItem = state.items.find((i) => i.id === item.id)

// //           if (existingItem) {
// //             // Produit déjà dans le panier → augmenter la quantité
// //             return {
// //               items: state.items.map((i) =>
// //                 i.id === item.id
// //                   ? { ...i, quantity: i.quantity + 1 }
// //                   : i
// //               ),
// //             }
// //           } else {
// //             // Nouveau produit → ajouter avec quantité 1
// //             return {
// //               items: [...state.items, { ...item, quantity: 1 }],
// //             }
// //           }
// //         })
// //       },

// //       // Supprimer un produit du panier
// //       removeItem: (id) => {
// //         set((state) => ({
// //           items: state.items.filter((item) => item.id !== id),
// //         }))
// //       },

// //       // Mettre à jour la quantité d'un produit
// //       updateQuantity: (id, quantity) => {
// //         if (quantity <= 0) {
// //           // Si quantité = 0 → supprimer le produit
// //           get().removeItem(id)
// //           return
// //         }

// //         set((state) => ({
// //           items: state.items.map((item) =>
// //             item.id === id ? { ...item, quantity } : item
// //           ),
// //         }))
// //       },

// //       // Vider le panier
// //       clearCart: () => {
// //         set({ items: [] })
// //       },

// //       // Calculer le nombre total d'articles (toutes quantités confondues)
// //       getTotalQuantity: () => {
// //         return get().items.reduce((total, item) => total + item.quantity, 0)
// //       },

// //       // Calculer le total en FC (centimes)
// //       getTotalPriceFC: () => {
// //         return get().items.reduce(
// //           (total, item) => total + item.price * item.quantity,
// //           0
// //         )
// //       },

// //       // Calculer le total en USD
// //       getTotalPriceUSD: () => {
// //         return get().items.reduce(
// //           (total, item) => total + item.price_usd * item.quantity,
// //           0
// //         )
// //       },

// //       // Obtenir la quantité d'un produit spécifique
// //       getItemQuantity: (id) => {
// //         const item = get().items.find((i) => i.id === id)
// //         return item ? item.quantity : 0
// //       },
// //     }),
// //     {
// //       name: 'cart-storage', // Clé dans localStorage
// //     }
// //   )
// // )