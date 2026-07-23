// Header con interactividad: menú móvil, dropdown accesible, estado activo
// por ruta y condensación al hacer scroll.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

// Enlaces simples del menú principal.
const enlaces = [
  { href: '/', label: 'Inicio' },
  { href: '/calendario', label: 'Calendario' },
];

// Subenlaces del desplegable "Sobre nosotros".
const sobreNosotros = [
  { href: '/sobre-nosotros/esencia', label: 'Esencia' },
  { href: '/sobre-nosotros/director', label: 'Director' },
  { href: '/sobre-nosotros/componentes', label: 'Componentes' },
  { href: '/sobre-nosotros/directiva', label: 'Directiva' },
  { href: '/sobre-nosotros/repertorio', label: 'Repertorio' },
];

export default function Header() {

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // El header se "condensa" (logo y padding menores + más sombra) al bajar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar el menú móvil al navegar a otra ruta.
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  // Bloquear el scroll del fondo mientras el panel móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuAbierto]);

  // Detecta la ruta activa ("/" solo coincide exacto; el resto por prefijo).
  const activo = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const sobreActivo = pathname.startsWith('/sobre-nosotros');

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* Franja roja superior */}
      <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

      {/* Barra de cristal cálido */}
      <div className={`relative w-full bg-white/70 backdrop-blur-xl border-b border-red-900/15 transition-shadow duration-300 ${scrolled ? 'shadow-md shadow-red-950/10' : 'shadow-sm shadow-red-950/5'}`}>

        {/* Halo granate sutil (solo luz de marca, sin amarillo) */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(32rem_12rem_at_18%_-30%,rgba(153,27,27,0.10),transparent_60%)]" />

        <div className={`relative mx-auto px-6 lg:px-12 flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'}`}>

          {/* LOGO (se encoge al hacer scroll) */}
          <Link href="/" className="flex items-center group rounded-sm">
            <div className={`relative transition-all duration-300 group-hover:scale-[1.02] ${scrolled ? 'h-16 w-64' : 'h-20 w-72'}`}>
              <Image
                src="/LogoCoroDiocesano.png"
                alt="Coro Diocesano"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* ============= NAV ESCRITORIO ============= */}
          <nav className="hidden md:flex items-center gap-10">

            {enlaces.map((e) => (
              <NavLink key={e.href} href={e.href} label={e.label} activo={activo(e.href)} />
            ))}

            {/* Desplegable "Sobre nosotros": se abre con hover Y con foco de
                teclado (group-focus-within), así funciona sin ratón. */}
            <div className="relative group">
              <Link
                href="/sobre-nosotros"
                className={`flex items-center gap-1 text-sm tracking-[0.2em] uppercase font-medium transition-colors rounded-sm ${sobreActivo ? 'text-red-800' : 'text-stone-800 hover:text-red-900'}`}
                aria-haspopup="true"
              >
                <span className="relative">
                  Sobre nosotros
                  <span className={`absolute -bottom-2 left-0 h-0.5 bg-red-800 transition-all duration-300 ${sobreActivo ? 'w-full' : 'w-0 group-hover:w-full group-focus-within:w-full'}`} />
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-stone-700 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-50">
                <div className="relative bg-white border border-stone-200 shadow-2xl shadow-stone-900/15 min-w-[220px] py-3 rounded-sm">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-stone-200 rotate-45" />
                  {sobreNosotros.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className={`block px-6 py-2.5 text-xs tracking-[0.2em] uppercase transition-colors ${activo(s.href) ? 'text-red-800 bg-red-50/60' : 'text-stone-700 hover:bg-red-50 hover:text-red-800'}`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <NavLink href="/contacto" label="Contacto" activo={activo('/contacto')} />

            {/* Botón destacado "Área de miembros" */}
            <Link
              href="/miembros"
              className="rounded-lg relative overflow-hidden group text-sm tracking-[0.2em] uppercase font-medium text-stone-50 px-6 py-3 bg-gradient-to-br from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 shadow-md hover:shadow-xl hover:shadow-red-900/40 transition-all duration-300"
            >
              <span className="relative z-10">Área de miembros</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </nav>

          {/* ============= HAMBURGUESA (móvil) ============= */}
          <button
            onClick={() => setMenuAbierto(true)}
            className="md:hidden flex items-center justify-center w-11 h-11 text-stone-800 hover:text-red-800 transition-colors rounded-sm"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
          >
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>

        {/* Línea decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
      </div>

      {/* ============= PANEL MÓVIL ============= */}
      <div className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${menuAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

        {/* Fondo oscurecido (cierra al pulsar) */}
        <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={() => setMenuAbierto(false)} />

        {/* Panel deslizante desde la derecha */}
        <div className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">Menú</span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-red-800 transition-colors rounded-sm"
              aria-label="Cerrar menú"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">

            {enlaces.map((e) => (
              <MobileLink key={e.href} href={e.href} label={e.label} activo={activo(e.href)} />
            ))}

            {/* Sobre nosotros: rótulo + subenlaces */}
            <div className="mt-5 mb-2 flex items-center gap-3">
              <span className="text-[10px] tracking-[0.4em] uppercase text-red-800/80 font-medium">Sobre nosotros</span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>
            {sobreNosotros.map((s) => (
              <MobileLink key={s.href} href={s.href} label={s.label} activo={activo(s.href)} sub />
            ))}

            <div className="mt-5">
              <MobileLink href="/contacto" label="Contacto" activo={activo('/contacto')} />
            </div>

            <Link
              href="/miembros"
              className="mt-8 group relative overflow-hidden text-center text-sm tracking-[0.2em] uppercase font-medium text-stone-50 px-6 py-4 bg-gradient-to-br from-red-800 to-red-950 shadow-md rounded-sm"
            >
              <span className="relative z-10">Área de miembros</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ============= SUBCOMPONENTES =============

// Enlace de escritorio: subrayado animado + estado activo persistente.
function NavLink({ href, label, activo }: { href: string; label: string; activo: boolean }) {
  return (
    <Link
      href={href}
      aria-current={activo ? 'page' : undefined}
      className={`relative group text-sm tracking-[0.2em] uppercase font-medium transition-colors rounded-sm ${activo ? 'text-red-800' : 'text-stone-800 hover:text-red-900'}`}
    >
      <span className="relative">
        {label}
        <span className={`absolute -bottom-2 left-0 h-0.5 bg-red-800 transition-all duration-300 ${activo ? 'w-full' : 'w-0 group-hover:w-full'}`} />
      </span>
    </Link>
  );
}

// Enlace del panel móvil: banda lateral granate al activo/hover.
function MobileLink({ href, label, activo, sub = false }: { href: string; label: string; activo: boolean; sub?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={activo ? 'page' : undefined}
      className={`block py-3 ${sub ? 'text-xs' : 'text-sm'} tracking-[0.2em] uppercase font-medium border-l-2 transition-all duration-200 ${
        activo
          ? 'border-red-800 text-red-800 pl-4'
          : 'border-transparent text-stone-700 hover:text-red-800 hover:border-red-800/40 pl-0 hover:pl-4'
      }`}
    >
      {label}
    </Link>
  );
}
