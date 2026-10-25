'use client';

// Ventana modal base del área de miembros: fondo oscurecido, panel con la
// franja granate de la casa, cabecera eyebrow + titular serif y cierre con
// Esc o pulsando fuera. Los diálogos concretos solo aportan el contenido.

import { useEffect, useId } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  eyebrow: string;
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
}

export default function Modal({ eyebrow, titulo, onCerrar, children }: ModalProps) {

  const idTitulo = useId();

  // Esc cierra y el fondo no se desplaza mientras el modal está abierto.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">

      {/* Fondo oscurecido (cierra al pulsar) */}
      <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={onCerrar} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl shadow-stone-950/30 rounded-sm animate-[fadeIn_0.3s_ease-out]"
      >
        <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

        {/* Esquina decorativa */}
        <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-red-800/20 pointer-events-none" />

        <button
          type="button"
          onClick={onCerrar}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-stone-500 hover:text-red-800 transition-colors rounded-sm"
          aria-label="Cerrar"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <div className="px-6 sm:px-10 pt-10 pb-8">

          {/* CABECERA */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-red-800/60" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-red-800 font-medium">
              {eyebrow}
            </span>
          </div>
          <h2 id={idTitulo} className="font-serif text-3xl text-stone-900 tracking-tight leading-tight mb-8 pr-8">
            {titulo}
          </h2>

          {children}

        </div>
      </div>
    </div>
  );
}

// Botones del pie de los diálogos, para que todos compartan aspecto.
export function BotonPrincipal({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium shadow-md hover:shadow-lg hover:shadow-red-900/40 transition-all duration-300 rounded-sm"
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}

export function BotonSecundario({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 border border-stone-300 hover:border-red-800 transition-colors rounded-sm"
    >
      {children}
    </button>
  );
}
