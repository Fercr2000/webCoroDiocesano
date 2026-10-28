// Carta completa de un responsable, con la misma composición que "Palabras
// del director" del inicio: foto enmarcada a un lado, carta con comilla
// decorativa, cita, capital granate y firma al otro. La usan
// /sobre-nosotros/director y /sobre-nosotros/responsables/[slug].

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FondoNotas from '../FondoNotas';
import FotoResponsable from './FotoResponsable';
import type { Responsable } from '@/lib/responsables';

export default function CartaResponsable({ responsable }: { responsable: Responsable }) {
  const { cargo, firma, nombre, cita, carta } = responsable;

  return (
    <main className="superficie-clara w-full py-12 md:py-16 overflow-hidden">
      <FondoNotas soloLaterales />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">

        <Link
          href="/sobre-nosotros/responsables"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-red-800 transition-colors mb-6 rounded-sm"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Responsables
        </Link>

        {/* CABECERA DE SECCIÓN */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            {cargo}
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h1 className="font-serif text-4xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
          {nombre}
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">
          Una carta abierta
        </p>

        <div className="flex justify-center mb-14">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* FOTO + CARTA */}
        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-16 lg:gap-24 items-center">

          <FotoResponsable responsable={responsable} tono="claro" className="w-full max-w-sm mx-auto" />

          <div className="relative flex flex-col justify-center space-y-6">

            {/* Comilla gigante decorativa */}
            <div
              aria-hidden="true"
              className="absolute -top-16 -left-4 text-[12rem] text-red-800/10 font-serif leading-none select-none pointer-events-none"
            >
              «
            </div>

            <blockquote className="relative z-10 font-serif italic text-xl md:text-2xl text-red-900 leading-relaxed border-l-2 border-red-800/60 pl-6">
              «{cita.texto}»
              <cite className="block not-italic text-xs tracking-[0.3em] uppercase text-red-800/70 mt-3 font-sans">
                {cita.fuente}
              </cite>
            </blockquote>

            {carta.map((parrafo, i) => (
              <p
                key={i}
                className={`relative z-10 font-serif text-lg md:text-xl leading-relaxed text-stone-700 ${
                  i === 0 ? 'first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:text-red-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''
                }`}
              >
                {parrafo}
              </p>
            ))}

            {/* FIRMA */}
            <div className="relative z-10 pt-8 mt-4 flex items-center gap-6">
              <div className="h-px w-12 bg-red-800/60 flex-shrink-0" />
              <div>
                <p className="font-serif italic text-2xl text-stone-900">{nombre}</p>
                <p className="text-xs tracking-[0.3em] uppercase text-red-800/80 mt-2">{firma}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
