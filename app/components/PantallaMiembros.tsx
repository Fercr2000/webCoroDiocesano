// Pantalla a dos columnas de las páginas de acceso del área de miembros
// (recuperar y cambiar contraseña): a la izquierda el arte granate con un
// titular en cascada; a la derecha, sobre crema, el formulario.
// El login tiene su propia versión con la cascada de tres líneas.

import Image from 'next/image';
import FondoGranateMiembros from './FondoGranateMiembros';

interface PantallaMiembrosProps {
  eyebrowArte: string;
  linea1: string;
  linea2: string;
  texto: string;
  eyebrow: string;
  children: React.ReactNode;
}

export default function PantallaMiembros({ eyebrowArte, linea1, linea2, texto, eyebrow, children }: PantallaMiembrosProps) {
  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-2">

      {/* COLUMNA IZQUIERDA */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-red-950">

        {/* Fondo decorativo compartido (grano, viñeta, focos, pauta, marco, separador) */}
        <FondoGranateMiembros />

        <div className="relative z-10 w-full h-full p-12 lg:p-16 flex flex-col">

          <div className="flex items-center gap-4 mb-auto">
            <div className="h-px w-16 bg-stone-50/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-stone-50 font-medium">
              {eyebrowArte}
            </span>
          </div>

          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-2xl">

              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rotate-45 bg-stone-50/80" />
                <div className="h-px w-24 bg-stone-50/40" />
              </div>

              <h2 className="font-serif text-5xl lg:text-6xl text-stone-50 leading-[1.1] mb-3">
                {linea1}
              </h2>
              <h2 className="font-serif italic text-5xl lg:text-6xl text-stone-50/90 leading-[1.1] mb-10 pl-12 lg:pl-20">
                {linea2}
              </h2>

              <div className="flex items-center gap-4 mb-8 pl-12 lg:pl-20">
                <div className="h-px w-16 bg-stone-50/30" />
                <div className="w-1 h-1 rounded-full bg-stone-50/50" />
                <div className="h-px w-32 bg-stone-50/30" />
              </div>

              <p className="font-serif italic text-lg lg:text-xl text-stone-200/85 max-w-md leading-relaxed pl-12 lg:pl-20">
                {texto}
              </p>

            </div>
          </div>

          <div className="flex items-end justify-between gap-4 mt-auto">

            <blockquote className="font-serif italic text-sm text-stone-200/50 max-w-xs">
              «Cantadle un cántico nuevo, tocad con maestría.»
              <cite className="block not-italic text-[10px] tracking-[0.3em] uppercase text-stone-200/40 mt-2">
                Salmo 33, 3
              </cite>
            </blockquote>

            <svg width="80" height="14" viewBox="0 0 80 14" fill="none" className="text-stone-50/30 flex-shrink-0">
              <line x1="0" y1="7" x2="32" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="36" y="3" width="8" height="8" transform="rotate(45 40 7)" fill="currentColor" />
              <line x1="48" y1="7" x2="80" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>

          </div>

        </div>

      </div>

      {/* COLUMNA DERECHA */}
      <div className="superficie-crema flex items-center justify-center px-6 py-12 md:py-0 min-h-screen overflow-hidden">

        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

        <div className="relative z-10 w-full max-w-md">

          <div className="md:hidden flex justify-center mb-10">
            <div className="relative h-16 w-64">
              <Image
                src="/LogoCoroDiocesano.png"
                alt="Logo Coro de la Diócesis de Jaén"
                fill
                sizes="256px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
              {eyebrow}
            </span>
            <div className="h-px flex-1 bg-red-800/60" />
          </div>

          {children}

        </div>

      </div>

    </div>
  );
}
