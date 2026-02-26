'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Star, Loader2, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TestimonialInputs {
  client_name: string
  location: string
  product_name: string
  content: string
  rating: number
  is_visible: boolean
}

export default function AddTestimonialForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TestimonialInputs>({
    defaultValues: {
      rating: 5,
      is_visible: true
    }
  })

  const currentRating = watch('rating')

  const onSubmit = async (data: TestimonialInputs) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        reset()
        router.refresh()
        alert('Témoignage ajouté !')
      }
    } catch (error) {
      alert("Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Nouveau Témoignage</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom du client */}
        <div>
          <label className="block text-sm font-semibold mb-2">Nom du client *</label>
          <input 
            {...register('client_name', { required: "Le nom est requis" })}
            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ${errors.client_name ? 'border-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
            placeholder="Ex: Patient M."
          />
          {errors.client_name && <span className="text-red-500 text-xs mt-1">{errors.client_name.message}</span>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2">Ville / Commune *</label>
          <input 
            {...register('location', { required: "La localisation est requise" })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Kinshasa, Limete"
          />
        </div>
      </div>

      {/* Produit */}
      <div>
        <label className="block text-sm font-semibold mb-2">Produit acheté</label>
        <input 
          {...register('product_name')}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: HP Pro x2 612 G2"
        />
      </div>

      {/* Rating (Etoiles) */}
      <div>
        <label className="block text-sm font-semibold mb-2">Note globale</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('rating', star)}
              className="focus:outline-none transition-transform active:scale-90"
            >
              <Star className={`w-8 h-8 ${star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold mb-2">Message *</label>
        <textarea 
          {...register('content', { required: "Le message est vide" })}
          rows={4}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Écrivez le témoignage ici..."
        />
      </div>

      {/* Visibilité (Switch/Checkbox) */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
        <input 
          type="checkbox" 
          id="is_visible" 
          {...register('is_visible')}
          className="w-5 h-5 accent-blue-600 cursor-pointer"
        />
        <label htmlFor="is_visible" className="text-sm font-medium text-blue-900 cursor-pointer">
          Afficher immédiatement sur le site
        </label>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enregistrer le témoignage'}
      </button>
    </form>
  )
}