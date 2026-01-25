// //Hero.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';




const slides = [
  {
    title: "Vos achats livrés",
    highlight: "directement chez vous",
    description: "Commandez en ligne, payez à la livraison. Disponible partout à Kinshasa.",
    image: "/photo1.jpg",
    badge: { icon: Truck, title: "Livraison Gratuite", subtitle: "Commande +100$" }
  },
  {
    title: "Des produits de qualité",
    highlight: "à prix imbattables",
    description: "Large sélection de produits vérifiés. Paiement à la livraison en toute sécurité.",
    image: "/photo2.jpg", // Remplace par tes images
    badge: { icon: ShoppingBag, title: "100+ Produits", subtitle: "En stock" }
  },
  {
    title: "Service client",
    highlight: "toujours à votre écoute",
    description: "Une équipe dédiée pour répondre à toutes vos questions. Suivi en temps réel.",
    image: "/photo3.jpg", // Remplace par tes images
    badge: { icon: Truck, title: "Livraison 24h", subtitle: "Partout à Kinshasa" }
  }
];




const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  element?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};


export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play quand l'utilisateur interagit
    setTimeout(() => setIsAutoPlaying(true), 10000); // Reprend après 10s
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];
  const BadgeIcon = slide.badge.icon;

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden">
      {/* Motif Z décoratif */}
      <div className="absolute right-0 top-0 opacity-10 text-[200px] font-bold leading-none pointer-events-none">
        <div className="space-y-4">
          <div>ZZZ</div>
          <div className="ml-8">ZZ</div>
          <div className="ml-16">Z</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Texte avec animation */}
          <div className="space-y-6">
            <h1 
              key={`title-${currentSlide}`}
              className="text-4xl lg:text-6xl font-bold leading-tight animate-fade-in"
            >
              {slide.title}
              <span className="block text-yellow-400">
                {slide.highlight}
              </span>
            </h1>
            
            <p 
              key={`desc-${currentSlide}`}
              className="text-xl text-blue-100 animate-fade-in-delay"
            >
              {slide.description}
            </p>

            {/* <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition flex items-center gap-2 hover:scale-105 transform"
              >
                <ShoppingBag className="w-5 h-5" />
                Voir les produits
              </Link>

          

  
              
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <a
    href="#comment-ca-marche"  // ✅ Lien vers l'ancre
    className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition hover:scale-105 transform"
  >
    Comment ça marche ?
  </a>
</motion.div> 
             
            </div> */}

            <div className="flex flex-wrap gap-4">
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      href="/products"
      className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition flex items-center gap-2"
    >
      <ShoppingBag className="w-5 h-5" />
      Voir les produits
    </Link>
  </motion.div>

  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <a
      href="#comment-ca-marche"
      className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition inline-flex items-center"
    >
      Comment ça marche ?
    </a>
  </motion.div>
</div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm text-blue-200">Produits</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-yellow-400">24h</div>
                <div className="text-sm text-blue-200">Livraison</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-yellow-400">100%</div>
                <div className="text-sm text-blue-200">Sécurisé</div>
              </div>
            </div>

            {/* Indicateurs de slides */}
            <div className="flex gap-2 pt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-8 bg-yellow-400' 
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Aller à la diapositive ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Image avec carousel */}
          <div className="relative">
            <div className="bg-yellow-400 rounded-[40px] p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  key={`img-${currentSlide}`}
                  src={slide.image}
                  alt={`${slide.title} - Comon-siz`}
                  width={600}
                  height={600}
                  className="w-full h-auto animate-zoom-in"
                  priority
                />
              </div>
            </div>
            
            {/* Badge flottant animé */}
            <div 
              key={`badge-${currentSlide}`}
              className="absolute -bottom-6 -left-6 bg-white text-blue-900 px-6 py-4 rounded-2xl shadow-xl animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <BadgeIcon className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="font-bold">{slide.badge.title}</div>
                  <div className="text-sm text-gray-600">{slide.badge.subtitle}</div>
                </div>
              </div>
            </div>

            {/* Boutons navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition z-20"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition z-20"
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Vague décorative */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}


