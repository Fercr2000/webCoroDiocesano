'use client';

// Rombos de los pulsos del compás: el que suena se enciende en el instante
// exacto (se lee el reloj de audio en cada fotograma). En el metrónomo grande
// se pulsan para cambiar el acento (fuerte → normal → silencio).

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { metronomo, type Acento } from './audio/metronomo';

const ESTILO_ACENTO: Record<Acento, string> = {
  fuerte: 'bg-red-800 border-red-800',
  normal: 'bg-transparent border-red-800/70',
  silencio: 'bg-transparent border-stone-300 border-dashed',
};

export default function PulsosMetronomo({ tamano = 'grande', editable = false }: { tamano?: 'grande' | 'pequeno'; editable?: boolean }) {
  const estado = useSyncExternalStore(metronomo.suscribir, metronomo.leer, metronomo.leer);
  const contenedor = useRef<HTMLDivElement>(null);

  // Animación sin re-renderizar React: se marca el rombo activo directamente.
  useEffect(() => {
    const caja = contenedor.current;
    if (!estado.sonando || !caja) return;
    let frame = 0;
    const pintar = () => {
      const pos = metronomo.posicion();
      const rombos = caja.querySelectorAll<HTMLElement>('[data-pulso]');
      rombos.forEach((r) => {
        const activo = pos !== null && Number(r.dataset.pulso) === pos.pulso && pos.fase < 0.35;
        r.dataset.activo = activo ? 'si' : 'no';
      });
      frame = requestAnimationFrame(pintar);
    };
    frame = requestAnimationFrame(pintar);
    return () => {
      cancelAnimationFrame(frame);
      caja.querySelectorAll<HTMLElement>('[data-pulso]').forEach((r) => { r.dataset.activo = 'no'; });
    };
  }, [estado.sonando]);

  const lado = tamano === 'grande' ? 'w-5 h-5' : 'w-2.5 h-2.5';

  return (
    <div ref={contenedor} className={`flex items-center justify-center ${tamano === 'grande' ? 'gap-5 flex-wrap' : 'gap-2'}`}>
      {estado.acentos.map((acento, i) => {
        const rombo = (
          <span
            data-pulso={i}
            data-activo="no"
            className={`block ${lado} rotate-45 border-[1.5px] transition-[transform,background-color,box-shadow] duration-75 ${ESTILO_ACENTO[acento]} data-[activo=si]:scale-125 data-[activo=si]:bg-red-600 data-[activo=si]:border-red-600 data-[activo=si]:shadow-[0_0_14px_rgba(220,38,38,0.6)]`}
          />
        );
        return editable ? (
          <button
            key={i}
            type="button"
            onClick={() => metronomo.alternarAcento(i)}
            aria-label={`Pulso ${i + 1}: ${acento}. Pulsa para cambiar el acento`}
            className="p-2 rounded-full hover:bg-red-50/70 transition-colors"
          >
            {rombo}
          </button>
        ) : (
          <span key={i}>{rombo}</span>
        );
      })}
    </div>
  );
}
