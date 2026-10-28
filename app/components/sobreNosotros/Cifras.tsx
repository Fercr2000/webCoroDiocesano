'use client';

// "En cifras": contadores que suben desde cero cuando entran en pantalla.
// Con "reducir movimiento" aparecen directamente con su valor final.

import { useEffect, useRef, useState } from 'react';

interface Cifra {
  valor: number;
  etiqueta: string;
}

const DURACION_MS = 1600;

export default function Cifras({ cifras }: { cifras: Cifra[] }) {

  const ref = useRef<HTMLDivElement>(null);
  const [progreso, setProgreso] = useState(0);   // 0 → 1

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observer.disconnect();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setProgreso(1);
          return;
        }
        const inicio = performance.now();
        const paso = (ahora: number) => {
          const t = Math.min(1, (ahora - inicio) / DURACION_MS);
          setProgreso(1 - (1 - t) ** 3);   // frena al final
          if (t < 1) frame = requestAnimationFrame(paso);
        };
        frame = requestAnimationFrame(paso);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-3 gap-y-10">
      {cifras.map(({ valor, etiqueta }, i) => (
        <div key={etiqueta} className={`text-center px-2 sm:px-4 border-stone-50/20 ${i > 0 ? 'border-l' : ''}`}>
          <span className="block font-serif text-5xl sm:text-6xl md:text-7xl leading-none tabular-nums text-stone-50">
            {Math.round(valor * progreso)}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" className="mx-auto my-4 text-stone-50/50" aria-hidden="true">
            <rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)" fill="currentColor" />
          </svg>
          <span className="block text-[10px] tracking-[0.2em] sm:tracking-[0.35em] uppercase text-stone-50/75">{etiqueta}</span>
        </div>
      ))}
    </div>
  );
}
