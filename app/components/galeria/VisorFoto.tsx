'use client';

// Visor a pantalla completa de una foto: fondo oscuro, la foto con una
// transición de acercamiento, flechas, contador, pie y tira de miniaturas.
// El teclado (← → Esc) lo gestiona el visor del álbum; aquí se añade el
// deslizamiento con el dedo en móvil.

import { useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import FotoRecortada from './FotoRecortada';
import { RELACION, type Foto } from '@/lib/galeria';

interface VisorFotoProps {
  fotos: Foto[];
  indice: number;
  titulo: string;
  onIr: (indice: number) => void;
  onCerrar: () => void;
}

export default function VisorFoto({ fotos, indice, titulo, onIr, onCerrar }: VisorFotoProps) {

  const foto = fotos[indice];
  const inicioToque = useRef<number | null>(null);
  const anterior = () => onIr((indice - 1 + fotos.length) % fotos.length);
  const siguiente = () => onIr((indice + 1) % fotos.length);

  // Deslizar: más de 50px en horizontal cambia de foto.
  const alSoltar = (x: number) => {
    if (inicioToque.current === null) return;
    const delta = x - inicioToque.current;
    if (Math.abs(delta) > 50) (delta > 0 ? anterior : siguiente)();
    inicioToque.current = null;
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`${titulo}: foto ${indice + 1} de ${fotos.length}`} className="fixed inset-0 z-[70] flex flex-col bg-stone-950/95 text-stone-50 animate-[fadeIn_0.3s_ease-out]">

      {/* Barra superior: contador y cierre */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="flex items-center min-w-0 text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-stone-50/70">
          <span className="truncate">{titulo}</span>
          <span className="text-stone-50/40 mx-2">·</span>
          <span className="tabular-nums whitespace-nowrap">{indice + 1} / {fotos.length}</span>
        </span>
        <button type="button" onClick={onCerrar} aria-label="Cerrar" className="w-10 h-10 flex items-center justify-center rounded-full text-stone-50/80 hover:text-white hover:bg-white/10 transition-colors">
          <X size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* Foto */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 sm:px-20 min-h-0"
        onTouchStart={(e) => { inicioToque.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => alSoltar(e.changedTouches[0].clientX)}
      >
        <button type="button" onClick={anterior} aria-label="Foto anterior" className="hidden sm:flex absolute left-4 w-12 h-12 items-center justify-center rounded-full text-stone-50/80 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronLeft size={30} strokeWidth={1.5} />
        </button>

        {/* key: cada foto nueva entra con la transición de acercamiento */}
        <div key={foto.id} className="animate-[acercar_0.45s_ease-out] shadow-2xl shadow-black/60" style={{ width: `min(100%, calc(68vh * ${RELACION[foto.proporcion]}))` }}>
          <FotoRecortada foto={foto} sizes="90vw" prioridad />
        </div>

        <button type="button" onClick={siguiente} aria-label="Foto siguiente" className="hidden sm:flex absolute right-4 w-12 h-12 items-center justify-center rounded-full text-stone-50/80 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronRight size={30} strokeWidth={1.5} />
        </button>
      </div>

      {/* Pie y miniaturas */}
      <div className="px-5 pt-4 pb-5">
        <p key={foto.id} className="text-center font-serif italic text-lg text-stone-50/85 mb-4 animate-[fadeIn_0.4s_ease-out]">{foto.pie}</p>
        {/* w-max + mx-auto: centrada si cabe; si no, se desplaza sin recortar el principio */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2 w-max mx-auto p-1.5">
            {fotos.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onIr(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === indice}
                className={`flex-shrink-0 w-14 transition-all duration-300 ${i === indice ? 'opacity-100 ring-2 ring-stone-50 ring-offset-2 ring-offset-stone-950' : 'opacity-40 hover:opacity-80'}`}
              >
                <FotoRecortada foto={f} proporcion="cuadrada" sizes="56px" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
