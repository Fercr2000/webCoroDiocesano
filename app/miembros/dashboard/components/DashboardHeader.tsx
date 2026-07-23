'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, KeyRound } from 'lucide-react';

interface DashboardHeaderProps {
  nombre: string;
  rol: string;
}

export default function DashboardHeader({ nombre, rol }: DashboardHeaderProps) {

  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  // Condensación al hacer scroll (mismo efecto que el header del sitio público).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Por ahora (mockup), cerrar sesión vuelve a la página de inicio.
  const handleLogout = () => {
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full">

      {/* Franja roja superior */}
      <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

      <div className={`relative w-full bg-white/70 backdrop-blur-xl border-b border-red-900/15 transition-shadow duration-300 ${scrolled ? 'shadow-md shadow-red-950/10' : 'shadow-sm shadow-red-950/5'}`}>

        {/* Halo granate sutil (solo luz de marca, sin amarillo) que da calidez al cristal */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(32rem_12rem_at_18%_-30%,rgba(153,27,27,0.10),transparent_60%)]" />

        <div className={`relative w-full px-6 lg:px-12 transition-all duration-300 ${scrolled ? 'py-2.5' : 'py-5'}`}>

          {/* ============= FILA PRINCIPAL (3 columnas balanceadas) =============
              grid-cols-3 reparte el ancho en tres tercios iguales: logo a la
              izquierda, saludo centrado en el tercio central y acciones a la
              derecha. Así el saludo queda centrado de verdad y equilibrado,
              sin depender del ancho de logo/botones. */}
          <div className="flex items-center justify-between md:grid md:grid-cols-3 min-h-[72px]">

            {/* IZQUIERDA: Logo */}
            <div className="flex justify-start">
              <Link href="/miembros/dashboard" className="flex items-center group flex-shrink-0 rounded-sm">
                <div className={`relative transition-all duration-300 group-hover:scale-[1.02] ${scrolled ? 'h-11 w-44' : 'h-14 w-56'}`}>
                  <Image
                    src="/LogoCoroDiocesano.png"
                    alt="Coro de la Diócesis de Jaén"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* CENTRO: Saludo con capitular granate armonizada + rol */}
            <div className="hidden md:flex flex-col items-center">
              <div className="font-serif text-stone-800 flex items-baseline gap-2 leading-none">
                <span className="italic text-stone-500 text-lg">Hola,</span>
                <span className="flex items-baseline font-medium">
                  <span className="text-4xl text-red-800 leading-none">{nombre.charAt(0)}</span>
                  <span className="text-2xl text-stone-900 leading-none">{nombre.slice(1)}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2.5">
                <div className="h-px w-8 bg-red-800/50" />
                <span className="text-[11px] tracking-[0.5em] uppercase text-red-800 font-semibold">
                  {rol}
                </span>
                <div className="h-px w-8 bg-red-800/50" />
              </div>
            </div>

            {/* DERECHA: Acciones */}
            <div className="flex justify-end items-center gap-3">

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