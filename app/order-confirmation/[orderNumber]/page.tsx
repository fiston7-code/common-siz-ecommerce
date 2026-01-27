import { supabase } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, Currency } from 'lucide-react'
import { formatPrice } from '@/lib/currency/converter'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  total_price: number
  price: number
  price_usd?: number
  unit_price: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  delivery_commune: string
  delivery_quartier: string
  delivery_avenue: string
  subtotal: number
  shipping_cost: number
  total: number
  order_items: OrderItem[]
}

// Fonction pour convertir FC en USD (même taux que dans ton checkout)
const convertFCtoUSD = (amountFC: number): number => {
  const EXCHANGE_RATE = 2850 // 1 USD = 2850 FC (ajuste selon ton taux)
  return amountFC / EXCHANGE_RATE
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
            <div>
              <p className="text-sm text-muted-foreground">Numéro de commande</p>
              <p className="font-mono font-bold text-lg">{typedOrder.order_number}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Produits commandés</p>
              <div className="space-y-2">
                {typedOrder.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(item.total_price, 'FC')}
                      </div>
                      <div className="text-xs text-gray-500">
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Sous-total</span>
                <div className="text-right">
                  <div>{formatPrice(typedOrder.subtotal, 'FC')}</div>
                  <div className="text-xs text-gray-500">
                    
                  </div>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Livraison</span>
                <div className="text-right">
                  <div>{formatPrice(typedOrder.shipping_cost, 'FC')}</div>
                  <div className="text-xs text-gray-500">
                    
                  </div>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <div className="text-right">
                  <div>{formatPrice(typedOrder.total, 'FC')}</div>
                  <div className="text-sm font-normal text-gray-500">
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Adresse de livraison</p>
              <p className="text-sm">
                {typedOrder.customer_name}<br />
                {typedOrder.delivery_avenue}<br />
                {typedOrder.delivery_quartier}, {typedOrder.delivery_commune}<br />
                {typedOrder.customer_phone}
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/products">Continuer mes achats</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



// // app/order-confirmation/[orderNumber]/page.tsx
// import { supabase } from '@/lib/supabase/client'
// import { notFound } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import { CheckCircle2, Currency } from 'lucide-react'
// import { formatPrice } from '@/lib/currency/converter'

// interface OrderItem {
//   id: string
//   product_name: string
//   quantity: number
//   total_price: number
//   price: number
//   price_usd?: number
// }

// interface Order {
//   id: string
//   order_number: string
//   customer_name: string
//   customer_phone: string
//   delivery_commune: string
//   delivery_quartier: string
//   delivery_avenue: string
//   subtotal: number
//   shipping_cost: number
//   total: number
//   order_items: OrderItem[]
// }

// export default async function OrderConfirmationPage({
//   params,
// }: {
//   params: Promise<{ orderNumber: string }>
// }) {
//   // Attendre la résolution de params
//   const { orderNumber } = await params

//   const { data: order, error } = await supabase
//     .from('orders')
//     .select(`
//       *,
//       order_items (
//         *
//       )
//     `)
//     .eq('order_number', orderNumber)
//     .single()

//   if (error || !order) {
//     notFound()
//   }

//   const typedOrder = order as Order

//   return (
//     <div className="container mx-auto px-4 py-16">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
//           <p className="text-muted-foreground">
//             Merci pour votre commande. Nous vous contacterons bientôt.
//           </p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Détails de la commande</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <p className="text-sm text-muted-foreground">Numéro de commande</p>
//               <p className="font-mono font-bold text-lg">{typedOrder.order_number}</p>
//             </div>

//             <div>
//               <p className="text-sm text-muted-foreground mb-2">Produits commandés</p>
//               <div className="space-y-2">
//                 {typedOrder.order_items.map((item) => (
//                   <div key={item.id} className="flex justify-between">
//                     <span>
//                       {item.product_name} × {item.quantity}
//                     </span>
//                     <span className="font-medium">
//                       {formatPrice(item.total_price, 'FC')}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="border-t pt-4">
//               <div className="flex justify-between mb-2">
//                 <span className="text-muted-foreground">Sous-total</span>
//                 <span>{typedOrder.subtotal.toLocaleString()} FC</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-muted-foreground">Livraison</span>
//                 <span>{typedOrder.shipping_cost.toLocaleString()} FC</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total</span>
//                 <span>{typedOrder.total.toLocaleString()} FC</span>
//               </div>
//             </div>

//             <div className="bg-muted p-4 rounded-lg">
//               <p className="font-medium mb-2">Adresse de livraison</p>
//               <p className="text-sm">
//                 {typedOrder.customer_name}<br />
//                 {typedOrder.delivery_avenue}<br />
//                 {typedOrder.delivery_quartier}, {typedOrder.delivery_commune}<br />
//                 {typedOrder.customer_phone}
//               </p>
//             </div>

//             <div className="space-y-2">
//               <Button asChild className="w-full">
//                 <Link href="/products">Continuer mes achats</Link>
//               </Button>
//               <Button asChild variant="outline" className="w-full">
//                 <Link href="/">Retour à l&apos;accueil</Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }