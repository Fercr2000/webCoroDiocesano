'use client';

// Desplegable "Agrupar por" del catálogo: botón cápsula granate y panel con
// icono, nombre y descripción de cada criterio. Se maneja con ratón o con
// teclado (flechas, Enter, Esc) y se cierra al pulsar fuera.

import { useState, useEffect, useRef } from 'react';
import { Layers, PenLine, Hourglass, Users, Languages, ArrowDownAZ, ChevronDown, Check } from 'lucide-react';
import type { Criterio } from '@/lib/catalogo';

export const CRITERIOS: { id: Criterio; nombre: string; descripcion: string; icono: typeof Layers }[] = [
  { id: 'tipo', nombre: 'Tipo de obra', descripcion: 'Ordinario, propio, motetes, himnos…', icono: Layers },
  { id: 'autor', nombre: 'Autor', descripcion: 'Compositores por orden alfabético', icono: PenLine },
  { id: 'epoca', nombre: 'Época', descripcion: 'Del gregoriano a nuestros días', icono: Hourglass },
  { id: 'formacion', nombre: 'Formación', descripcion: 'A capella, con órgano o con orquesta', icono: Users },
  { id: 'idioma', nombre: 'Idioma', descripcion: 'Latín, castellano…', icono: Languages },
  { id: 'alfabetico', nombre: 'Título (A–Z)', descripcion: 'Índice alfabético de obras', icono: ArrowDownAZ },
];

export default function SelectorAgrupacion({ valor, onCambiar }: { valor: Criterio; onCambiar: (c: Criterio) => void }) {

  const [abierto, setAbierto] = useState(false);
  const [resaltado, setResaltado] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const opciones = useRef<(HTMLButtonElement | null)[]>([]);
  const actual = CRITERIOS.find((c) => c.id === valor)!;

  // Cerrar al pulsar fuera.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('mousedown', fuera);
    return () => document.removeEventListener('mousedown', fuera);
  }, [abierto]);

  // El foco sigue a la opción resaltada mientras el panel está abierto.
  useEffect(() => {
    if (abierto) opciones.current[resaltado]?.focus();
  }, [abierto, resaltado]);

  const abrir = () => {
    setResaltado(CRITERIOS.findIndex((c) => c.id === valor));
    setAbierto(true);
  };

  const elegir = (c: Criterio) => {
    onCambiar(c);
    setAbierto(false);
  };

  const teclado = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setAbierto(false);
    if (e.key === 'ArrowDown') { e.preventDefault(); setResaltado((i) => (i + 1) % CRITERIOS.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setResaltado((i) => (i - 1 + CRITERIOS.length) % CRITERIOS.length); }
  };

  const Icono = actual.icono;

  return (
    <div ref={raiz} className="relative inline-block text-left" onKeyDown={teclado}>

      <button
        type="button"
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 pl-5 pr-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-red-900/40 transition-all duration-300"
      >
        <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-stone-50/70">Agrupar por</span>
        <span className="relative z-10 h-4 w-px bg-stone-50/30" />
        <span className="relative z-10 flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium">
          <Icono size={15} strokeWidth={1.5} />
          {actual.nombre}
        </span>
        <ChevronDown size={16} strokeWidth={1.5} className={`relative z-10 transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} />
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>

      {abierto && (
        <div
          role="listbox"
          aria-label="Agrupar el catálogo por"
          className="absolute left-1/2 -translate-x-1/2 mt-3 w-[min(22rem,calc(100vw-3rem))] z-30 bg-white border border-stone-200 rounded-sm shadow-2xl shadow-stone-900/15 py-2 animate-[fadeIn_0.2s_ease-out]"
        >
          {/* Pico que apunta al botón */}
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-stone-200 rotate-45" />
          <div className="h-0.5 mx-2 mb-1 bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

          {CRITERIOS.map((c, i) => {
            const activo = c.id === valor;
            const IconoOpcion = c.icono;
            return (
              <button
                key={c.id}
                ref={(el) => { opciones.current[i] = el; }}
                type="button"
                role="option"
                aria-selected={activo}
                onClick={() => elegir(c.id)}
                onMouseEnter={() => setResaltado(i)}
                className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors focus:outline-none ${
                  resaltado === i ? 'bg-red-50/70' : ''
                }`}
              >
                <span className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  activo ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md shadow-red-900/30' : 'bg-stone-100 text-red-800'
                }`}>
                  <IconoOpcion size={16} strokeWidth={1.5} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-xs tracking-[0.2em] uppercase font-medium ${activo ? 'text-red-800' : 'text-stone-800'}`}>
                    {c.nombre}
                  </span>
                  <span className="block font-serif italic text-sm text-stone-500 mt-0.5">{c.descripcion}</span>
                </span>
                {activo && <Check size={16} strokeWidth={1.5} className="flex-shrink-0 text-red-800" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
