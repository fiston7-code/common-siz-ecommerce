'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '@/store/cart-store'
import { supabase } from '@/lib/supabase/client'
import { checkoutSchema, CheckoutFormData, KINSHASA_COMMUNES } from '@/lib/validations/checkout'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShieldCheck, MapPin, Phone, User, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/currency'

const DELIVERY_FEE_USD = 3.00 

export default function CheckoutPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { items, getTotalPriceUSD, clearCart } = useCartStore()

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '+243',
      whatsapp: '',
      email: '',
      commune: undefined,
      quartier: '',
      avenue: '',
      reference_point: '',
      delivery_instructions: '',
    },
  })

  const subtotal = getTotalPriceUSD()
  const total = subtotal + DELIVERY_FEE_USD

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Button onClick={() => router.push('/products')} variant="default">
          Retourner à la boutique
        </Button>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      console.log('📝 Données du formulaire:', data)
      console.log('🛒 Articles du panier:', items)

      // 1. Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: data.name,
          customer_phone: data.phone,
          customer_whatsapp: data.whatsapp || null,
          customer_email: data.email || null,
          delivery_commune: data.commune,
          delivery_quartier: data.quartier,
          delivery_avenue: data.avenue,
          delivery_reference: data.reference_point || null,
          delivery_instructions: data.delivery_instructions || null,
          subtotal: subtotal,
          shipping_cost: DELIVERY_FEE_USD,
          total: total,
          final_total: total,
          status: 'pending',
          payment_method: 'cash_on_delivery',
        })
        .select()
        .single()

      console.log('📦 Résultat insertion order:', { order, orderError })

      if (orderError) {
        console.error('❌ Erreur order:', orderError)
        throw orderError
      }

      // 2. Créer les order_items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image_url: item.image || null,
        quantity: item.quantity,
        unit_price: item.price_usd,
        total_price: item.price_usd * item.quantity,
      }))

      console.log('📋 Order items à insérer:', orderItems)

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('❌ Erreur items:', itemsError)
        throw itemsError
      }

      // 3. Vider le panier
      clearCart()

      // 4. Rediriger vers la page de confirmation
      router.push(`/order-confirmation/${order.order_number}`)
    } catch (error) {
      console.error('❌ Erreur complète:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORMULAIRE (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Section Identité */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-900" />
                    Vos Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet *</FormLabel>
                        <FormControl><Input placeholder="Ex: Jean Kabongo" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone *</FormLabel>
                        <FormControl><Input placeholder="+243..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl><Input placeholder="+243..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (optionnel)</FormLabel>
                        <FormControl><Input type="email" placeholder="jean@exemple.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </CardContent>
              </Card>

              {/* Section Adresse */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-900" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="commune"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commune *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {KINSHASA_COMMUNES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quartier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quartier *</FormLabel>
                          <FormControl><Input placeholder="Ex: Ma Campagne" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="avenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avenue et Numéro *</FormLabel>
                        <FormControl><Input placeholder="Ex: Av. de la Paix N°12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reference_point"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Point de référence</FormLabel>
                        <FormControl><Input placeholder="Ex: En face de la station..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="delivery_instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions (optionnel)</FormLabel>
                        <FormControl><Textarea className="resize-none" placeholder="Infos pour le livreur..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Bouton mobile */}
              <div className="lg:hidden mt-6">
                <Button type="submit" className="w-full h-14 bg-blue-900 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : `Confirmer • ${formatPrice(total, 'USD')}`}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* RECAPITULATIF (Sticky sur Desktop) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-none shadow-lg ring-1 ring-blue-100">
            <CardHeader className="bg-blue-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-900" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm items-start gap-4">
                    <span className="text-gray-600 flex-1">{item.quantity}x {item.name}</span>
                    <span className="font-semibold">{formatPrice(item.price_usd * item.quantity, 'USD')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal, 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Livraison (Kinshasa)</span>
                  <span>{formatPrice(DELIVERY_FEE_USD, 'USD')}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-blue-900 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(total, 'USD')}</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                  <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold text-sm">
                    <Phone className="w-4 h-4" />
                    Paiement Cash
                  </div>
                  <p className="text-blue-800 text-xs leading-relaxed">
                    Le règlement s&apos;effectue en mains propres lors de la livraison (USD ou équivalent FC au taux du jour).
                  </p>
                </div>

                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  className="hidden lg:flex w-full h-12 bg-blue-900 hover:bg-blue-800" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Confirmer la commande'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}


// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useCartStore } from '@/store/cart-store'
// import { supabase } from '@/lib/supabase/client'
// import { checkoutSchema, CheckoutFormData, KINSHASA_COMMUNES } from '@/lib/validations/checkout'
// import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Loader2 } from 'lucide-react'
// import { formatPrice } from '@/lib/currency'

// const DELIVERY_FEE_USD = 3 // 3 USD

// export default function CheckoutPage() {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const { items, getTotalPriceUSD, clearCart } = useCartStore()

//   const form = useForm<CheckoutFormData>({
//     resolver: zodResolver(checkoutSchema),
//     defaultValues: {
//       name: '',
//       phone: '+243',
//       whatsapp: '',
//       email: '',
//       commune: undefined,
//       quartier: '',
//       avenue: '',
//       reference_point: '',
//       delivery_instructions: '',
//     },
//   })

//   // Vérifier si le panier est vide
//   if (items.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
//         <p className="text-muted-foreground mb-8">
//           Ajoutez des produits avant de passer commande
//         </p>
//         <Button onClick={() => router.push('/products')}>
//           Voir les produits
//         </Button>
//       </div>
//     )
//   }

//   const subtotal = getTotalPriceUSD()
//   const total = subtotal + DELIVERY_FEE_USD

//   const onSubmit = async (data: CheckoutFormData) => {
//     setIsSubmitting(true)

//     try {
//       console.log('📝 Données du formulaire:', data)
//       console.log('🛒 Articles du panier:', items)

//       // 1. Créer la commande
//       const { data: order, error: orderError } = await supabase
//         .from('orders')
//         .insert({
//           customer_name: data.name,
//           customer_phone: data.phone,
//           customer_whatsapp: data.whatsapp || null,
//           customer_email: data.email || null,
//           delivery_commune: data.commune,
//           delivery_quartier: data.quartier,
//           delivery_avenue: data.avenue,
//           delivery_reference: data.reference_point || null,
//           delivery_instructions: data.delivery_instructions || null,
//           subtotal: subtotal,
//           shipping_cost: DELIVERY_FEE_USD,
//           total: total,
//           final_total: total,
//           status: 'pending',
//           payment_method: 'cash_on_delivery',
//         })
//         .select()
//         .single()

//       console.log('📦 Résultat insertion order:', { order, orderError })

//       if (orderError) {
//         console.error('❌ Erreur order:', orderError)
//         throw orderError
//       }

//       // 2. Créer les order_items
//       const orderItems = items.map((item) => ({
//         order_id: order.id,
//         product_id: item.id,
//         product_name: item.name,
//         product_image_url: item.image || null,
//         quantity: item.quantity,
//         unit_price: item.price_usd,
//         total_price: item.price_usd * item.quantity,
//       }))

//       console.log('📋 Order items à insérer:', orderItems)

//       const { error: itemsError } = await supabase
//         .from('order_items')
//         .insert(orderItems)

//       if (itemsError) {
//         console.error('❌ Erreur items:', itemsError)
//         throw itemsError
//       }

//       // 3. Vider le panier
//       clearCart()

//       // 4. Rediriger vers la page de confirmation
//       router.push(`/order-confirmation/${order.order_number}`)
//     } catch (error) {
//       console.error('❌ Erreur complète:', error)
//       alert('Une erreur est survenue. Veuillez réessayer.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Formulaire */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle>Informations de livraison</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                   {/* Informations client */}
//                   <div className="space-y-4">
//                     <h3 className="font-semibold text-lg">Vos informations</h3>
                    
//                     <FormField
//                       control={form.control}
//                       name="name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Nom complet *</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Jean Kabongo" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="phone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Téléphone *</FormLabel>
//                           <FormControl>
//                             <Input placeholder="+243123456789" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="whatsapp"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>WhatsApp (optionnel)</FormLabel>
//                           <FormControl>
//                             <Input placeholder="+243123456789" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email (optionnel)</FormLabel>
//                           <FormControl>
//                             <Input type="email" placeholder="exemple@email.com" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* Adresse de livraison */}
//                   <div className="space-y-4">
//                     <h3 className="font-semibold text-lg">Adresse de livraison</h3>

//                     <FormField
//                       control={form.control}
//                       name="commune"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Commune *</FormLabel>
//                           <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Sélectionnez une commune" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {KINSHASA_COMMUNES.map((commune) => (
//                                 <SelectItem key={commune} value={commune}>
//                                   {commune}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="quartier"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Quartier *</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Ex: Matonge" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="avenue"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Avenue / Rue *</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Ex: Avenue Tabora N°123" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="reference_point"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Point de référence (optionnel)</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Ex: Près de l'église Saint-Joseph" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="delivery_instructions"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Instructions de livraison (optionnel)</FormLabel>
//                           <FormControl>
//                             <Textarea 
//                               placeholder="Ex: Appeler 30 minutes avant la livraison"
//                               className="resize-none"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <Button 
//                     type="submit" 
//                     className="w-full" 
//                     size="lg"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Traitement en cours...
//                       </>
//                     ) : (
//                       'Confirmer la commande'
//                     )}
//                   </Button>
//                 </form>
//               </Form>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Récapitulatif */}
//         <div className="lg:col-span-1">
//           <Card className="sticky top-4">
//             <CardHeader>
//               <CardTitle>Récapitulatif</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Liste des produits */}
//               <div className="space-y-3">
//                 {items.map((item) => (
//                   <div key={item.id} className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">
//                       {item.name} × {item.quantity}
//                     </span>
//                     <span className="font-medium">
//                       {formatPrice(item.price_usd * item.quantity, 'USD')}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t pt-4 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Sous-total</span>
//                   <span>{formatPrice(subtotal, 'USD')}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Livraison</span>
//                   <span>{formatPrice(DELIVERY_FEE_USD, 'USD')}</span>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>{formatPrice(total, 'USD')}</span>
//                 </div>
//               </div>

//               <div className="bg-muted p-4 rounded-lg text-sm">
//                 <p className="font-medium mb-1">Paiement à la livraison</p>
//                 <p className="text-muted-foreground text-xs">
//                   Payez en espèces lors de la réception de votre commande
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

