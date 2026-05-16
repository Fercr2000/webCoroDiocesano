'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    image: '/sliderUnete.png',
    title: 'Tu voz, tu instrumento, su gloria',
    subtitle: 'Únete al Coro y Orquesta de la Diócesis de Jaén',
    primaryButton: { label: 'Quiero unirme', href: '/#inscripcion' },
    secondaryButton: { label: 'Conócenos', href: '/sobre-nosotros' },
  },
  {
    image: '/sliderRepertorio.png',
    title: 'Servir cantando, cantar sirviendo',
    subtitle: 'Música sacra al servicio de la Liturgia y la Iglesia diocesana',
    primaryButton: { label: 'Repertorio', href: '/repertorio' },
    secondaryButton: { label: 'Próximas celebraciones', href: '/calendario' },
  },
];

export default function Hero() {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (

    <section className="relative h-[80vh] w-full overflow-hidden">

      {/* Capas de imágenes con fade entre slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
        </div>
      ))}

      {/* Texto y botones */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        <h1
          key={`title-${current}`}
          className="font-serif text-5xl md:text-7xl text-stone-50 tracking-wide drop-shadow-2xl mb-6 max-w-4xl animate-[fadeIn_1s_ease-out]"
        >
          {slides[current].title}
        </h1>

        <div className="w-24 h-[2px] bg-red-500 mb-6" />

        <p
          key={`subtitle-${current}`}
          className="text-base md:text-lg text-stone-100/90 tracking-[0.3em] uppercase font-light mb-12 max-w-2xl"
        >
          {slides[current].subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">

          <Link
            key={`primary-${current}`}
            href={slides[current].primaryButton.href}
            className="group relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm"
          >
            <span className="relative z-10">{slides[current].primaryButton.label}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>

          <Link
            key={`secondary-${current}`}
            href={slides[current].secondaryButton.href}
            className="border border-stone-100/60 text-stone-50 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-stone-50 hover:text-stone-900 transition-all duration-300 rounded-sm"
          >
            {slides[current].secondaryButton.label}
          </Link>

        </div>
      </div>

      {/* Indicadores (puntitos) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Ir al slide ${index + 1}`}
            className={`h-[3px] transition-all duration-500 ${
              index === current
                ? 'w-12 bg-red-500'
                : 'w-6 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Línea inferior decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-700/60 to-transparent z-20" />

    </section>
  );
}
