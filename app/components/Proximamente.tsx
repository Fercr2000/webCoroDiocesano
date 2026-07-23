import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ProximamenteProps {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
}

// Página placeholder "en construcción" que respeta el sistema de diseño
// (eyebrow → titular serif → ornamento). Evita los 404 en enlaces cuya
// página definitiva aún no existe, con un aspecto intencionado y de marca.
export default function Proximamente({ eyebrow, titulo, subtitulo }: ProximamenteProps) {
  return (
    <main className="superficie-crema w-full min-h-[70vh] flex items-center py-32 md:py-40">
      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">

        {/* EYEBROW */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            {eyebrow}
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        {/* TITULAR */}
        <h1 className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight leading-[1.1] mb-6">
          {titulo}
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 mb-12">
          {subtitulo}
        </p>

        {/* ORNAMENTO */}
        <div className="flex justify-center mb-12">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <p className="text-base md:text-lg text-stone-600 leading-relaxed mb-12">
          Estamos preparando esta sección con el mismo cuidado que ponemos en cada nota.
          <br className="hidden md:block" />
          Vuelve pronto.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 transition-colors border border-stone-300 hover:border-red-800 px-6 py-3 rounded-sm focus-visible:outline-2 focus-visible:outline-red-800"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver al inicio
        </Link>

      </div>
    </main>
  );
}
