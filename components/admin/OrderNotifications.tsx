// components/OrderNotifications.tsx
'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client' // ✅ Import direct
import { toast, Toaster } from 'sonner'

type Order = {
  id: string
  order_number: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

export function OrderNotifications() {
  useEffect(() => {
    // Demander permission notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // S'abonner aux nouvelles commandes
    const channel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const order = payload.new as Order
          
          // Toast notification
          toast.success('Nouvelle commande ! 🛒', {
            description: `${order.customer_name} - Commande #${order.order_number}`,
            action: {
              label: 'Voir',
              onClick: () => {
                window.location.href = `/admin/orders/${order.id}`
              }
            },
            duration: 10000,
          })

          // Notification navigateur
          if (Notification.permission === 'granted') {
            const notification = new Notification('Nouvelle commande ! 🛒', {
              body: `${order.customer_name} - ${order.total_amount}€`,
              icon: '/logo.png',
              tag: order.id,
              requireInteraction: true
            })

            notification.onclick = () => {
              window.focus()
              window.location.href = `/admin/orders/${order.id}`
              notification.close()
            }
          }

          // Son (optionnel)
          const audio = new Audio('/notification.mp3')
          audio.volume = 0.5
          audio.play().catch(() => {})
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <Toaster position="top-right" richColors closeButton />
}