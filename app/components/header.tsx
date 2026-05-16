'use client';

import Link from 'next/link';
import Image from 'next/image';


export default function Header() {

  return (

    <header className="sticky top-0 z-50 w-full">

      {/* FRANJA ROJA SUPERIOR */}
      <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-700 to-red-950" />


      <div className="relative w-full bg-gradient-to-b from-stone-50 via-amber-50 to-stone-100 backdrop-blur-md border-b border-red-900/20 shadow-sm">

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/40 to-transparent pointer-events-none" />

        <div className="relative mx-auto px-6 lg:px-12 py-2 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center group">

            <div className="relative h-20 w-80 transition-transform duration-500 group-hover:scale-[1.02]">
              <Image
                src="/LogoCoroDiocesano.png"
                alt="Coro Diocesano"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* MENÚ */}
          <nav className="hidden md:flex items-center gap-10">

            {/* Inicio */}
            <Link href="/" className="relative group text-sm tracking-[0.2em] uppercase font-medium text-stone-800">
              <span className="relative">
                Inicio
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-red-800 group-hover:w-full transition-all duration-300" />
              </span>
            </Link>

            {/* Calendario */}
            <Link href="/calendario" className="relative group text-sm tracking-[0.2em] uppercase font-medium text-stone-800">
              <span className="relative">
                Calendario
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-red-800 group-hover:w-full transition-all duration-300" />
              </span>
            </Link>


            {/* SOBRE NOSOTROS (con desplegable) */}
            <div className="relative group">

              <Link
                href="/sobre-nosotros"
                className="flex items-center gap-1 text-sm tracking-[0.2em] uppercase font-medium text-stone-800"
              >
                <span className="relative">
                  Sobre nosotros
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-red-800 group-hover:w-full transition-all duration-300" />
                </span>

                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="text-stone-700 transition-transform duration-300 group-hover:rotate-180"
                >
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">

                <div className="relative bg-stone-50 border border-stone-200 shadow-2xl shadow-stone-900/15 min-w-[220px] py-3 rounded-sm">

                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-stone-50 border-t border-l border-stone-200 rotate-45" />

                  <Link
                    href="/sobre-nosotros/esencia"
                    className="block px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                  >
                    Esencia
                  </Link>
                  <Link
                    href="/sobre-nosotros/director"
                    className="block px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                  >
                    Director
                  </Link>
                  <Link
                    href="/sobre-nosotros/componentes"
                    className="block px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                  >
                    Componentes
                  </Link>
                  <Link
                    href="/sobre-nosotros/directiva"
                    className="block px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                  >
                    Directiva
                  </Link>
                  <Link
                    href="/sobre-nosotros/repertorio"
                    className="block px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-stone-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                  >
                    Repertorio
                  </Link>

                </div>

              </div>

            </div>


            {/* Contacto */}
            <Link href="/contacto" className="relative group text-sm tracking-[0.2em] uppercase font-medium text-stone-800">
              <span className="relative">
                Contacto
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-red-800 group-hover:w-full transition-all duration-300" />
              </span>
            </Link>

            {/* Botón Área de miembros */}
            <Link
              href="/miembros"
              className="rounded-lg relative overflow-hidden group text-sm tracking-[0.2em] uppercase font-medium text-stone-50 px-6 py-3 bg-gradient-to-br from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 shadow-md hover:shadow-xl hover:shadow-red-900/40 transition-all duration-300"
            >
              <span className="relative z-10">Área de miembros</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>

          </nav>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />

      </div>
    </header>
  );
}
