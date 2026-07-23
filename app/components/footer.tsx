// Importamos Image para el logo.
import Image from 'next/image';

// Importamos los iconos de Lucide.
import { Mail, MapPin } from 'lucide-react';

// Componente Footer. Es estático, no necesita 'use client'.
export default function Footer() {

  return (

    // <footer> con degradado VERTICAL en negros.
    //   bg-gradient-to-b   → degradado de arriba a abajo
    //   from-black         → negro puro arriba
    //   via-stone-900      → grafito en el centro
    //   to-stone-950       → casi negro abajo
    <footer className="relative w-full bg-gradient-to-b from-[#17120e] via-[#120d0a] to-[#080605] text-stone-100 overflow-hidden">

      {/* LÍNEA DECORATIVA SUPERIOR (igual que el header) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

      {/* Grano sutil que da textura al degradado oscuro */}
      <div className="capa-grano" />

      {/* CUERPO DEL FOOTER (compacto, py-4) */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-4">

        {/* FILA PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          {/* IZQUIERDA: LOGO + NOMBRE
              items-stretch → el logo y el bloque de texto tienen la MISMA altura. */}
          <div className="flex items-stretch gap-2 flex-shrink-0">

            {/* Logo más grande: aspect-square para que sea cuadrado y h-auto
                para que se ajuste al alto del bloque de texto al lado.
                Usamos un contenedor flex para que el SVG llene su contenedor. */}
            <div className="relative aspect-square h-16 flex-shrink-0">
              <Image
                src="/SantoRostroCoro.png"
                alt="Logo Coro de la Diócesis de Jaén"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>

            {/* Bloque de texto: flex flex-col justify-center para centrar
                verticalmente el texto al lado del logo. */}
            <div className="flex flex-col justify-center leading-tight -ml-7">
              <span className="font-serif text-lg tracking-wide text-stone-50">
                Coro de la Diócesis de Jaén
              </span>
              <span className="font-serif italic text-sm text-stone-400 mt-0.5">
                Servir cantando, cantar sirviendo
              </span>
            </div>

          </div>

          {/* DERECHA: CONTACTOS HORIZONTALES */}
          <div className="flex items-center flex-wrap gap-y-4">

            {/* EMAIL: icono alto + texto */}
            <a
              href="mailto:corodiocesano@diocesisdejaen.es"
              className="group flex items-stretch gap-3 px-5 transition-colors"
            >
              {/* Contenedor del icono: ocupa toda la altura del bloque de texto.
                  El degradado rojo se aplica al icono mediante una técnica:
                  un span con bg-clip-text + text-transparent + bg-gradient.
                  Sin embargo, los SVG con stroke necesitan otra técnica: usamos un
                  efecto de fondo detrás del icono. Más sencillo: damos al icono el
                  color rojo central y dejamos que el degradado del fondo del footer
                  haga el efecto general. Pero para igualar EXACTAMENTE la franja roja
                  superior, usaremos un linear-gradient de fondo con mask-image
                  (técnica avanzada). Lo simplificamos: pintamos el icono con
                  text-red-600 (igual al rojo central de la franja). */}
              <div className="flex items-center">
                <Mail
                  size={36}
                  strokeWidth={1.25}
                  className="text-red-600 group-hover:text-red-400 transition-colors flex-shrink-0"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                  Email
                </span>
                <span className="text-sm text-stone-100 group-hover:text-red-300 transition-colors break-all">
                  corodiocesano@diocesisdejaen.es
                </span>
              </div>
            </a>

            {/* DIVISOR VERTICAL (oculto en pantallas pequeñas) */}
            <div className="hidden lg:block w-px h-12 bg-stone-700/40" />

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com/corodeladiocesisdejaen"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-stretch gap-3 px-5 transition-colors"
            >
              <div className="flex items-center">
                {/* SVG de Instagram con el mismo color y trazo más fino para que respire mejor a tamaño grande */}
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-600 group-hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                  Instagram
                </span>
                <span className="text-sm text-stone-100 group-hover:text-red-300 transition-colors">
                  @corodeladiocesisdejaen
                </span>
              </div>
            </a>

            {/* DIVISOR VERTICAL */}
            <div className="hidden lg:block w-px h-12 bg-stone-700/40" />

            {/* SEDE: ahora es un enlace a Google Maps */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Casa+de+la+Iglesia+de+Ja%C3%A9n+Seminario+Diocesano"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-stretch gap-3 px-5 transition-colors"
            >
              <div className="flex items-center">
                <MapPin
                  size={36}
                  strokeWidth={1.25}
                  className="text-red-600 group-hover:text-red-400 transition-colors flex-shrink-0"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                  Sede
                </span>
                <span className="text-sm text-stone-100 group-hover:text-red-300 transition-colors">
                  Casa de la Iglesia · Seminario Diocesano
                </span>
              </div>
            </a>

          </div>

        </div>

        {/* LÍNEA SEPARADORA */}
        <div className="h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent my-4" />

        {/* LÍNEA FINAL */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-xs text-stone-400">

          <p>
            © 2026 Coro de la Diócesis de Jaén. Todos los derechos reservados.
          </p>

          <p className="italic">
            Desarrollador:{' '}
            <span className="text-stone-300 not-italic">
              Fernando J. Camacho Rizquez
            </span>
          </p>

          <p className="italic">
            Una iniciativa de la{' '}
            <a
              href="https://www.diocesisdejaen.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-300 hover:text-red-400 transition-colors not-italic"
            >
              Diócesis de Jaén
            </a>
          </p>

        </div>

      </div>

    </footer>
  );
}