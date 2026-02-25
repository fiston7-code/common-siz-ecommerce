import { supabase } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/currency'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number      // ✅ Prix unitaire en USD
  total_price: number     // ✅ Prix total ligne en USD
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  delivery_commune: string
  delivery_quartier: string
  delivery_avenue: string
  subtotal: number         // ✅ Sous-total en USD
  shipping_cost: number    // ✅ Frais de livraison en USD
  total: number           // ✅ Total en USD
  order_items: OrderItem[]
}

export default async function OrderConfirmationPage({
  params, 
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *
      )
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error || !order) {
    notFound()
  }

  const typedOrder = order as Order

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-muted-foreground">
            Merci pour votre commande. Nous vous contacterons bientôt.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Number */}
            <div>
              <p className="text-sm text-muted-foreground">Numéro de commande</p>
              <p className="font-mono font-bold text-lg">{typedOrder.order_number}</p>
            </div>

            {/* Products List */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Produits commandés</p>
              <div className="space-y-2">
                {typedOrder.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <span className="text-gray-900">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.total_price, 'USD')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">
                  {formatPrice(typedOrder.subtotal, 'USD')}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-medium">
                  {formatPrice(typedOrder.shipping_cost, 'USD')}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-2xl text-blue-900">
                  {formatPrice(typedOrder.total, 'USD')}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Adresse de livraison</p>
              <p className="text-sm">
                {typedOrder.customer_name}<br />
                {typedOrder.delivery_avenue}<br />
                {typedOrder.delivery_quartier}, {typedOrder.delivery_commune}<br />
                {typedOrder.customer_phone}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/products">Continuer mes achats</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            </div>

            {/* Payment Info */}
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-1">Paiement à la livraison</p>
              <p className="text-muted-foreground text-xs">
                Payez en espèces lors de la réception de votre commande
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}