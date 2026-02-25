'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  productName: string
  isOutOfStock: boolean
}

export default function ProductImageGallery({ 
  images, 
  productName, 
  isOutOfStock 
}: ImageGalleryProps) {
  // ✅ Filtrer les images vides/invalides et fallback sur placeholder
 const validImages = images
  ?.map(img => (typeof img === 'object' ? (img as any).url : img)) // Sécurité objet vs string
  ?.filter((img) => img && img.trim() !== '' && img !== 'null')

  const allImages = validImages && validImages.length > 0 
    ? validImages 
    : ['/placeholder.jpg']

  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={allImages[currentIndex] || '/placeholder.jpg'}
          alt={`${productName} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-all ${
            isOutOfStock ? 'opacity-40 grayscale' : ''
          }`}
          priority
        />

        {/* Badge "SOLD OUT" */}
        {isOutOfStock && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 text-white px-8 py-4 rounded-lg text-2xl font-bold shadow-xl transform -rotate-12">
                SOLD OUT
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Rupture de stock
            </div>
          </>
        )}

        {/* Flèches de navigation (seulement si plusieurs images) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>

            {/* Indicateur de position */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Miniatures (seulement si plusieurs images) */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image || '/placeholder.jpg'}
                alt={`${productName} miniature ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}