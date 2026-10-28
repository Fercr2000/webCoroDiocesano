'use client';

// Contacto: deslizador cápsula para elegir entre unirse al coro o contar con
// él en una celebración. Cada opción muestra su formulario (los dos con mensaje).

import { useState } from 'react';
import { UserPlus, CalendarHeart } from 'lucide-react';
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

      {/* DESLIZADOR */}
      <div className="relative grid grid-cols-2 mb-12 border border-stone-300 rounded-full overflow-hidden bg-stone-100">
        <div
          className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-red-800 to-red-950 transition-transform duration-500 ease-out ${
            motivo === 'unirme' ? 'translate-x-0' : 'translate-x-full'
          }`}
        />
        {OPCIONES.map(({ valor, titulo, detalle, icono: Icono }) => {
          const activo = motivo === valor;
          return (
            <button
              key={valor}
              type="button"
              onClick={() => setMotivo(valor)}
              aria-pressed={activo}
              className={`relative z-10 flex items-center justify-center gap-3 md:gap-4 py-4 md:py-5 px-3 transition-colors duration-300 ${
                activo ? 'text-stone-50' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icono size={22} strokeWidth={1.5} className="flex-shrink-0 hidden sm:block" />
              <span className="text-left">
                <span className="block text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">{titulo}</span>
                <span className={`block font-serif italic text-xs md:text-sm mt-0.5 ${activo ? 'text-stone-50/75' : 'text-stone-400'}`}>{detalle}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* FORMULARIO (key: al cambiar de motivo entra con un fundido) */}
      <div key={motivo} className="animate-[fadeIn_0.5s_ease-out]">
        {motivo === 'unirme' ? <FormularioInscripcion /> : <FormularioContratacion />}
      </div>
    </div>
  );
}
