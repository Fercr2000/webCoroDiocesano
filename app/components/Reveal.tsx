'use client';

// Revela su contenido con un fade-up cuando entra en el viewport.
// Respeta prefers-reduced-motion (si el usuario lo pide, aparece sin animación).
// El movimiento es solo transform/opacity (compositor), no provoca reflow.

import { useRef, useEffect, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // retardo en ms para escalonar entradas
  desde?: 'abajo' | 'izquierda' | 'derecha'; // de dónde llega al aparecer
}

const OCULTO = {
  abajo: 'translate-y-8',
  izquierda: '-translate-x-10',
  derecha: 'translate-x-10',
};

export default function Reveal({ children, className = '', delay = 0, desde = 'abajo' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Con menos movimiento lo resuelve el CSS (motion-reduce:), no hace falta observar.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 ${
        visible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${OCULTO[desde]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
