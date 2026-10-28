'use client';

// Contacto: dos tarjetas de elección (unirse al coro / contar con él en una
// celebración) FUERA de la tarjeta del formulario, para que no se confundan
// con el deslizador coralista/instrumentista que hay dentro. La elegida se
// llena de granate y apunta con un pico al formulario que aparece debajo.

import { useState } from 'react';
import { UserPlus, CalendarHeart, Check } from 'lucide-react';
import FormularioInscripcion from '../FormularioInscripcion';
import FormularioContratacion from './FormularioContratacion';

type Motivo = 'unirme' | 'contar';

const OPCIONES: { valor: Motivo; titulo: string; detalle: string; icono: typeof UserPlus }[] = [
  { valor: 'unirme', titulo: 'Quiero unirme', detalle: 'Cantar o tocar con nosotros', icono: UserPlus },
  { valor: 'contar', titulo: 'Contar con vosotros', detalle: 'Para una celebración', icono: CalendarHeart },
];

export default function SelectorFormulario() {

  const [motivo, setMotivo] = useState<Motivo>('unirme');

  return (
    <div>

      {/* ============= ¿QUÉ TE TRAE POR AQUÍ? ============= */}
      <div className="flex items-center gap-4 mb-5">
        <div className="h-px w-10 bg-red-800/50" />
        <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">¿Qué te trae por aquí?</span>
        <div className="h-px flex-1 bg-stone-300" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 mb-8" role="radiogroup" aria-label="Motivo del contacto">
        {OPCIONES.map(({ valor, titulo, detalle, icono: Icono }) => {
          const activo = motivo === valor;
          return (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => setMotivo(valor)}
              className={`group relative text-left rounded-sm px-4 py-5 sm:px-6 sm:py-6 transition-all duration-300 ${
                activo
                  ? 'bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 shadow-xl shadow-red-950/30'
                  : 'bg-white/80 text-stone-900 border border-stone-200 shadow-sm hover:border-red-800/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-900/10'
              }`}
            >
              {activo && (
                <>
                  <span className="capa-grano rounded-sm" />
                  {/* Pico que apunta al formulario */}
                  <span className="absolute left-1/2 -bottom-2 w-4 h-4 -translate-x-1/2 rotate-45 bg-red-950" />
                </>
              )}

              {/* Marca de elegida */}
              <span className={`absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
                activo ? 'bg-stone-50 text-red-900 scale-100' : 'border border-stone-300 scale-90'
              }`}>
                {activo && <Check size={14} strokeWidth={2} />}
              </span>

              <span className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pr-6">
                <span className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors ${
                  activo ? 'bg-stone-50/15 text-stone-50 ring-1 ring-stone-50/30' : 'bg-stone-100 text-red-800 group-hover:bg-red-50'
                }`}>
                  <Icono size={22} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-serif text-lg sm:text-2xl leading-tight">{titulo}</span>
                  <span className={`block font-serif italic text-sm mt-0.5 ${activo ? 'text-stone-50/75' : 'text-stone-500'}`}>{detalle}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ============= TARJETA DEL FORMULARIO ============= */}
      <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm shadow-xl shadow-red-900/10 px-6 py-8 md:px-10 md:py-10">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />

        {/* key: al cambiar de motivo el formulario entra con un fundido */}
        <div key={motivo} className="animate-[fadeIn_0.5s_ease-out]">
          {motivo === 'unirme' ? <FormularioInscripcion /> : <FormularioContratacion />}
        </div>
      </div>
    </div>
  );
}
