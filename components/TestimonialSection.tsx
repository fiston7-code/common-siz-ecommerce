'use client'

import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  client_name: string
  location: string
  product_name: string
  content: string
  rating: number
}

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Ce que disent nos clients 👋
            </h2>
            <p className="text-gray-500 text-lg">
              La satisfaction de nos clients à Kinshasa et partout en RDC est notre plus grande fierté.
            </p>
          </div>
          <div className="hidden md:block">
             <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm border border-blue-100">
               {testimonials.length}+ Avis vérifiés
             </div>
          </div>
        </div>

        {/* Grille des témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-gray-50 p-8 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Icône Quote décorative */}
              <Quote className="absolute top-8 right-8 w-8 h-8 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />

              {/* Header : Initiale + Infos */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                  {item.client_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {item.client_name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">
                    {item.location}
                  </p>
                </div>
              </div>

              {/* Étoiles */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>

              {/* Message */}
            <p className="text-gray-700 leading-relaxed italic mb-8 relative z-10">
  &quot;{item.content}&quot;
</p>
              {/* Badge Produit (Très important pour la crédibilité) */}
              {item.product_name && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-200 group-hover:border-blue-200 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Modèle : {item.product_name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}