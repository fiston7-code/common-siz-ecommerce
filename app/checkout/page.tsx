'use client'

import { useState, useEffect } from 'react'
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
import { Loader2, ShieldCheck, MapPin, Phone, User, ShoppingBag, Info } from 'lucide-react'
import { formatPrice } from '@/lib/currency'
import { getExchangeRateValue } from '@/lib/currency/exchange-rate'
import { convertUsdToFc } from '@/lib/currency/converter'

const DELIVERY_FEE_USD = 3.00 

export default function CheckoutPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number>(2850) // Fallback initial
  const { items, getTotalPriceUSD, clearCart } = useCartStore()

  // Récupérer le taux de change réel pour l'affichage indicatif
  useEffect(() => {
    async function fetchRate() {
      const rate = await getExchangeRateValue()
      setExchangeRate(rate)
    }
    fetchRate()
  }, [])

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

  const subtotalUSD = getTotalPriceUSD()
  const totalUSD = subtotalUSD + DELIVERY_FEE_USD
  
  // Calcul indicatif en FC pour le client
  const totalFC = convertUsdToFc(totalUSD, exchangeRate)

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
      // 1. On récupère le taux le plus frais possible au moment du clic
      const rate = await getExchangeRateValue()

      // 2. Conversion en centimes de Francs pour la base de données
      const subtotalToDB = convertUsdToFc(subtotalUSD, rate)
      const shippingToDB = convertUsdToFc(DELIVERY_FEE_USD, rate)
      const totalToDB = subtotalToDB + shippingToDB

      // 3. Insertion de la commande
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
          subtotal: subtotalToDB,
          shipping_cost: shippingToDB,
          total: totalToDB,
          final_total: totalToDB,
          status: 'pending',
          payment_method: 'cash_on_delivery',
         
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 4. Insertion des articles
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image_url: item.image || null,
        quantity: item.quantity,
        unit_price: convertUsdToFc(item.price_usd, rate),
        total_price: convertUsdToFc(item.price_usd * item.quantity, rate),
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      router.push(`/order-confirmation/${order.order_number}`)
    } catch (error: any) {
  // Ceci va forcer l'affichage des détails de Supabase (code, message, hint)
  console.error('❌ Erreur détaillée:', JSON.stringify(error, null, 2))
  console.error('Message:', error?.message || error?.details)
  alert(`Erreur: ${error?.message || 'Problème de base de données'}`)
}finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-900" />
                    Vos Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl><Input placeholder="Ex: Jean Kabongo" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl><Input placeholder="+243..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="whatsapp" render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp (Recommandé)</FormLabel>
                      <FormControl><Input placeholder="+243..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-900" />
                    Adresse de livraison à Kinshasa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="commune" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commune *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger></FormControl>
                          <SelectContent>
                            {KINSHASA_COMMUNES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="quartier" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quartier *</FormLabel>
                        <FormControl><Input placeholder="Ex: Ma Campagne" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="avenue" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avenue et Numéro *</FormLabel>
                      <FormControl><Input placeholder="Ex: Av. de la Paix N°12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="reference_point" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Point de référence</FormLabel>
                      <FormControl><Input placeholder="Ex: Arrêt de bus, Station..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <div className="lg:hidden mt-6">
                <Button type="submit" className="w-full h-14 bg-blue-900 text-lg shadow-lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : `Confirmer • ${formatPrice(totalUSD, 'USD')}`}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-none shadow-lg ring-1 ring-blue-100 overflow-hidden">
            <CardHeader className="bg-blue-900 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm items-start gap-4">
                    <span className="text-gray-600 flex-1">{item.quantity}x {item.name}</span>
                    <span className="font-semibold text-gray-900">{formatPrice(item.price_usd * item.quantity, 'USD')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotalUSD, 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Frais de livraison</span>
                  <span>{formatPrice(DELIVERY_FEE_USD, 'USD')}</span>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                   <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-bold uppercase text-gray-400">Total à payer</span>
                      <span className="text-2xl font-black text-blue-900">{formatPrice(totalUSD, 'USD')}</span>
                   </div>
                   {/* Affichage du prix en FC pour info (Taux du jour) */}
                   <div className="flex justify-between items-center text-blue-700/70">
                      <span className="text-[10px] flex items-center gap-1">
                        <Info className="w-3 h-3" /> Taux: 1$ = {exchangeRate} FC
                      </span>
                      <span className="text-sm font-bold italic">{formatPrice(totalFC, 'FC')}</span>
                   </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                  <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold text-sm">
                    <Phone className="w-4 h-4" />
                    Paiement à la livraison
                  </div>
                  <p className="text-blue-800 text-xs leading-relaxed">
                    Préparez le montant exact en USD ou l&apos;équivalent en Francs Congolais. Le livreur vous contactera avant son passage.
                  </p>
                </div>

                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  className="hidden lg:flex w-full h-12 bg-blue-900 hover:bg-blue-800 transition-all shadow-md" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Valider ma commande'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



