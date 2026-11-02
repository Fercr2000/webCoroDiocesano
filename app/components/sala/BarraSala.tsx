'use client';

// Barra fija al pie de la Sala de ensayo: la La de referencia y un metrónomo
// pequeño que sigue sonando al cambiar de herramienta (por ejemplo, para tocar
// el piano a tempo). En la página del metrónomo solo se muestra la La.

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Minus, Plus, Play, Square } from 'lucide-react';
import { metronomo } from './audio/metronomo';
import SelectorLa from './SelectorLa';
import PulsosMetronomo from './PulsosMetronomo';

export default function BarraSala() {
  const ruta = usePathname();
  const estado = useSyncExternalStore(metronomo.suscribir, metronomo.leer, metronomo.leer);
  const enMetronomo = ruta === '/sala-de-ensayo/metronomo';

  return (
    <div className="sticky bottom-0 z-30 mt-8">
      <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
      <div className="bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_-12px_rgba(28,25,23,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-2.5 flex items-center justify-between gap-3">

          <SelectorLa hacia="arriba" compacto />

          {!enMetronomo && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:block">
                <PulsosMetronomo tamano="pequeno" />
              </div>
              <div className="flex items-center border border-stone-300 rounded-full">
                <button type="button" onClick={() => metronomo.cambiarBpm(estado.bpm - 1)} aria-label="Bajar tempo" className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-red-800">
                  <Minus size={13} strokeWidth={1.5} />
                </button>
                <Link href="/sala-de-ensayo/metronomo" className="min-w-[3.5rem] text-center leading-none hover:text-red-800 transition-colors" title="Abrir el metrónomo">
                  <span className="font-serif text-lg tabular-nums">{estado.bpm}</span>
                  <span className="ml-1 text-[9px] tracking-[0.2em] uppercase text-stone-500">ppm</span>
                </Link>
                <button type="button" onClick={() => metronomo.cambiarBpm(estado.bpm + 1)} aria-label="Subir tempo" className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-red-800">
                  <Plus size={13} strokeWidth={1.5} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => metronomo.alternar()}
                aria-pressed={estado.sonando}
                aria-label={estado.sonando ? 'Parar el metrónomo' : 'Poner en marcha el metrónomo'}
                className="group relative overflow-hidden w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md hover:shadow-lg hover:shadow-red-900/40 transition-shadow"
              >
                {estado.sonando ? <Square size={13} strokeWidth={2} fill="currentColor" /> : <Play size={15} strokeWidth={2} fill="currentColor" className="ml-0.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
