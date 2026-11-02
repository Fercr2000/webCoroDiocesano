'use client';

// Selector de la La de referencia (442 Hz por defecto): diapasones habituales
// y ajuste fino de décima en décima. Se comparte entre todas las herramientas.

import { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { REFERENCIAS_LA, LA_POR_DEFECTO, LA_MIN, LA_MAX } from '@/lib/sala/notas';
import { useLa, cambiarLa } from './referencia';

export const formatoHz = (hz: number, decimales = 1) => hz.toLocaleString('es-ES', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });

export default function SelectorLa({ hacia = 'abajo', compacto = false }: { hacia?: 'arriba' | 'abajo'; compacto?: boolean }) {
  const la = useLa();
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  // Se cierra al pulsar fuera o con Esc.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) setAbierto(false); };
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  return (
    <div ref={caja} className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        className={`group flex items-center gap-2 border border-stone-300 hover:border-red-800/60 rounded-full transition-colors ${compacto ? 'px-3 py-1.5' : 'px-4 py-2'}`}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500">La4</span>
        <span className="font-serif text-lg leading-none text-stone-900 tabular-nums group-hover:text-red-800 transition-colors">{formatoHz(la, la % 1 ? 1 : 0)}</span>
        <span className="text-xs text-stone-500">Hz</span>
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label="La de referencia"
          className={`absolute z-50 ${hacia === 'arriba' ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 w-72 bg-white border border-stone-200 rounded-sm shadow-2xl shadow-stone-900/15 p-5 animate-[fadeIn_0.2s_ease-out]`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-1">La de referencia</p>
          <p className="text-xs text-stone-500 leading-relaxed mb-4">Afina todas las herramientas de la sala. La orquesta usa {LA_POR_DEFECTO} Hz.</p>

          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {REFERENCIAS_LA.map((r) => (
              <button
                key={r.hz}
                type="button"
                onClick={() => cambiarLa(r.hz)}
                title={r.nombre || undefined}
                className={`py-1.5 text-sm tabular-nums rounded-full border transition-colors ${la === r.hz ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 border-transparent' : 'border-stone-300 text-stone-700 hover:border-red-800/60 hover:text-red-800'}`}
              >
                {r.hz}
              </button>
            ))}
          </div>

          {/* Ajuste fino */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => cambiarLa(la - 0.1)} aria-label="Bajar 0,1 Hz" className="w-9 h-9 flex items-center justify-center border border-stone-300 rounded-full text-stone-600 hover:text-red-800 hover:border-red-800/60">
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <label className="flex-1 relative">
              <span className="sr-only">Frecuencia exacta en hercios</span>
              <input
                type="number"
                min={LA_MIN}
                max={LA_MAX}
                step={0.1}
                value={la}
                onChange={(e) => cambiarLa(Number(e.target.value))}
                className="w-full text-center font-serif text-xl tabular-nums bg-stone-50 border border-stone-300 rounded-sm py-1.5 pr-8 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">Hz</span>
            </label>
            <button type="button" onClick={() => cambiarLa(la + 0.1)} aria-label="Subir 0,1 Hz" className="w-9 h-9 flex items-center justify-center border border-stone-300 rounded-full text-stone-600 hover:text-red-800 hover:border-red-800/60">
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>
          {REFERENCIAS_LA.find((r) => r.hz === la)?.nombre && (
            <p className="mt-3 text-xs italic text-stone-500 text-center">{REFERENCIAS_LA.find((r) => r.hz === la)?.nombre}</p>
          )}
        </div>
      )}
    </div>
  );
}
