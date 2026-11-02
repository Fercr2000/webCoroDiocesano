// Cabecera de cada herramienta de la Sala de ensayo: enlace de vuelta y el
// patrón de sección de la casa (eyebrow, titular, subtítulo y rombo).

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CabeceraSala({ titulo, subtitulo, volver = true }: { titulo: string; subtitulo: string; volver?: boolean }) {
  return (
    <div className="mb-10 md:mb-12">
      {volver && (
        <Link href="/sala-de-ensayo" className="group inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-stone-500 hover:text-red-800 transition-colors mb-8">
          <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
          Sala de ensayo
        </Link>
      )}

      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-red-800/60" />
        <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">Sala de ensayo</span>
        <div className="h-px w-16 bg-red-800/60" />
      </div>

      <h1 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">{titulo}</h1>
      <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">{subtitulo}</p>

      <div className="flex justify-center">
        <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
          <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
          <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
          <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}
