'use client';

// Versión compacta del cartel granate: una banda con la próxima celebración
// y un enlace. Va en el dashboard y en el panel de calendario del director.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useHoy } from './useHoy';
import { diasEntre, fechaLarga } from '@/lib/fechas';
import { ordenarEventos, type Evento } from '@/lib/calendario';

interface BandaProps {
  eventos: Evento[];
  href: string;
  textoEnlace: string;
}

export default function BandaProximaCelebracion({ eventos, href, textoEnlace }: BandaProps) {

  const hoy = useHoy();
  if (!hoy) return null;

  const proxima = [...eventos]
    .sort(ordenarEventos)
    .find((e) => e.tipo === 'celebracion' && e.estado === 'confirmado' && e.fecha >= hoy);

  const dias = proxima ? diasEntre(hoy, proxima.fecha) : 0;
  const cuando = dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : `En ${dias} días`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-sm bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 shadow-lg shadow-red-950/20 hover:shadow-2xl hover:shadow-red-950/30 transition-all duration-300 mb-12 md:mb-14 animate-[fadeIn_0.6s_ease-out]"
    >
      <div className="capa-grano" />
      <div className="absolute -top-20 left-1/4 w-64 h-64 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
      <span className="absolute inset-0 z-[2] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 px-6 sm:px-8 py-6">

        {/* Cuenta atrás */}
        {proxima && (
          <div className="flex-shrink-0 sm:pr-8 sm:border-r border-stone-50/20">
            <span className="block text-[10px] tracking-[0.4em] uppercase text-stone-50/70 mb-1">Próxima celebración</span>
            <span className="font-serif text-3xl leading-none">{cuando}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {proxima ? (
            <>
              <p className="font-serif text-2xl leading-tight truncate">{proxima.titulo}</p>
              <p className="text-sm text-stone-50/75 mt-1 first-letter:uppercase">
                {fechaLarga(proxima.fecha)} · {proxima.horaInicio} h · {proxima.lugar}
              </p>
            </>
          ) : (
            <p className="font-serif italic text-xl text-stone-50/85">Aún no hay próximas celebraciones anunciadas.</p>
          )}
        </div>

        <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium text-stone-50/90 flex-shrink-0">
          {textoEnlace}
          <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}
