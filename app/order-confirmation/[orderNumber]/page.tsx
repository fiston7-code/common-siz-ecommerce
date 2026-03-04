import { supabase } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/currency'
import { getExchangeRateValue } from '@/lib/currency/exchange-rate' // Import du taux
import { convertFcToUsd } from '@/lib/currency/converter'     // Import du convertisseur

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

  // 1. Récupérer la commande
  const { data: order, error } = await supabase
    .from('orders')
    .select(`*, order_items (*)`)
    .eq('order_number', orderNumber)
    .single()

  if (error || !order) notFound()

  // 2. Récupérer le taux de change actuel pour la conversion inverse
  const rate = await getExchangeRateValue()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-muted-foreground">Merci pour votre commande. Nous vous contacterons bientôt.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Numéro de commande</p>
              <p className="font-mono font-bold text-lg">{order.order_number}</p>
            </div>

            {/* Liste des Produits avec CONVERSION */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Produits commandés</p>
              <div className="space-y-2">
                {order.order_items.map((item: any) => {
                  // Conversion du total ligne : Centimes FC -> USD
                  const priceInUsd = convertFcToUsd(item.total_price, rate)
                  
                  return (
                    <div key={item.id} className="flex justify-between items-start">
                      <span className="text-gray-900">{item.product_name} × {item.quantity}</span>
                      <span className="font-medium">{formatPrice(priceInUsd, 'USD')}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Totaux avec CONVERSION */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">
                  {formatPrice(convertFcToUsd(order.subtotal, rate), 'USD')}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-medium">
                  {formatPrice(convertFcToUsd(order.shipping_cost, rate), 'USD')}
                </span>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 bg-blue-50 p-2 rounded">
                <div className="flex flex-col">
                  <span>Total</span>
                  <span className="text-[10px] text-blue-600 font-normal">Taux indicatif: 1$ = {rate} FC</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-blue-900">
                    {formatPrice(convertFcToUsd(order.total, rate), 'USD')}
                  </p>
                  {/* Optionnel: Afficher aussi le montant exact en FC pour le livreur */}
                  <p className="text-sm text-gray-500">{formatPrice(order.total, 'FC')}</p>
                </div>
              </div>
            </div>

            {/* Adresse et Boutons ... (le reste du code est identique) */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Adresse de livraison</p>
              <p className="text-sm">
                {order.customer_name}<br />
                {order.delivery_avenue}<br />
                {order.delivery_quartier}, {order.delivery_commune}<br />
                {order.customer_phone}
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full bg-blue-900">
                <Link href="/products">Continuer mes achats</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}