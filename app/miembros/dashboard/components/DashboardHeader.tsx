'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut, KeyRound } from 'lucide-react';

interface DashboardHeaderProps {
  nombre: string;
  rol: string;
}

export default function DashboardHeader({ nombre, rol }: DashboardHeaderProps) {

  const handleLogout = () => {
    alert('Cerrar sesión - se activará al conectar Supabase');
  };

  return (
    <header className="sticky top-0 z-40 w-full">

      {/* Franja roja superior */}
      <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

      <div className="relative w-full bg-gradient-to-b from-stone-50 via-amber-50 to-stone-100 backdrop-blur-md border-b border-red-900/20 shadow-sm">

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/40 to-transparent pointer-events-none" />

        <div className="relative w-full px-6 lg:px-12 py-5">

          {/* ============= FILA PRINCIPAL =============
              Posicionamiento absoluto del saludo para que esté CENTRADO RESPECTO
              A LA PANTALLA, no respecto al espacio que dejan los botones.
              Logo (izq) y botones (der) van con posición absoluta también, así
              el saludo no se desplaza nunca según el ancho de los demás bloques. */}
          <div className="relative flex items-center min-h-[80px]">

            {/* IZQUIERDA: Logo (absoluto, anclado al borde) */}
            <Link href="/miembros/dashboard" className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center group flex-shrink-0">
              <div className="relative h-14 w-56 transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/LogoCoroDiocesano.png"
                  alt="Coro de la Diócesis de Jaén"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* CENTRO: Saludo con nombre + rol (centrado REAL respecto al viewport).
                mx-auto + ancho fijo + posicionamiento garantiza centro perfecto. */}
            <div className="hidden md:flex flex-col items-center mx-auto text-center">

              {/* Saludo con la capitular del nombre en granate.
                  text-2xl → mucho más grande que antes (era text-lg)
                  La capital es text-5xl, doblada respecto al resto del texto. */}
              <div className="font-serif text-2xl text-stone-700 leading-none flex items-baseline">
                <span className="mr-2">Hola,</span>
                <span className="text-stone-900 flex items-baseline">
                  {/* Capitular gigante granate */}
                  <span className="font-serif text-5xl text-red-800 font-medium leading-none">
                    {nombre.charAt(0)}
                  </span>
                  {/* Resto del nombre, también más grande */}
                  <span className="text-3xl font-medium">
                    {nombre.slice(1)}
                  </span>
                </span>
              </div>

              {/* Rol en eyebrow con líneas decorativas - más grande también */}
              <div className="flex items-center gap-4 mt-3">
                <div className="h-px w-10 bg-red-800/50" />
                <span className="text-xs tracking-[0.5em] uppercase text-red-800 font-semibold">
                  {rol}
                </span>
                <div className="h-px w-10 bg-red-800/50" />
              </div>

            </div>

            {/* DERECHA: Botones (absolutos, anclados al borde derecho) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">

              <Link
                href="/miembros/cambiar-contrasena"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs tracking-[0.2em] uppercase text-stone-700 hover:text-red-800 transition-colors border border-stone-300 hover:border-red-800 rounded-sm group"
              >
                <KeyRound size={14} strokeWidth={1.5} className="group-hover:text-red-800 transition-colors" />
                <span>Contraseña</span>
              </Link>

              <button
                onClick={handleLogout}
                className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-4 py-2 text-xs tracking-[0.2em] uppercase font-medium shadow-md hover:shadow-lg hover:shadow-red-900/40 transition-all duration-300 rounded-sm"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogOut size={14} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

            </div>

          </div>

        </div>

        {/* SALUDO EN MÓVIL (debajo del header en pantallas pequeñas) */}
        <div className="md:hidden border-t border-stone-200 px-6 py-4 flex flex-col items-center bg-stone-50/50">
          <div className="font-serif text-xl text-stone-700 leading-none flex items-baseline">
            <span className="mr-2">Hola,</span>
            <span className="font-serif text-4xl text-red-800 font-medium leading-none">
              {nombre.charAt(0)}
            </span>
            <span className="text-2xl text-stone-900 font-medium">{nombre.slice(1)}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-px w-8 bg-red-800/50" />
            <span className="text-[11px] tracking-[0.5em] uppercase text-red-800 font-semibold">
              {rol}
            </span>
            <div className="h-px w-8 bg-red-800/50" />
          </div>
        </div>

        {/* Línea decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />

      </div>
    </header>
  );
}