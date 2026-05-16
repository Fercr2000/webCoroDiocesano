import Image from 'next/image';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {

  return (

    <footer className="relative w-full bg-gradient-to-b from-black via-stone-900 to-stone-950 text-stone-100 overflow-hidden">

      {/* LÍNEA DECORATIVA SUPERIOR (igual que el header) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

      {/* CUERPO DEL FOOTER */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-4">

        {/* FILA PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          {/* IZQUIERDA: LOGO + NOMBRE */}
          <div className="flex items-stretch gap-4 flex-shrink-0">

            <div className="relative aspect-square h-16 flex-shrink-0">
              <Image
                src="/LogotipoContornoBlanco.png"
                alt="Logo Coro de la Diócesis de Jaén"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>

            <div className="flex flex-col justify-center leading-tight">
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

            {/* EMAIL */}
            <a
              href="mailto:corodiocesano@diocesisdejaen.es"
              className="group flex items-stretch gap-3 px-5 transition-colors"
            >
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

            {/* DIVISOR VERTICAL */}
            <div className="hidden lg:block w-px h-12 bg-stone-700/40" />

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com/corodeladiocesisdejaen"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-stretch gap-3 px-5 transition-colors"
            >
              <div className="flex items-center">
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

            {/* SEDE (con enlace a Google Maps) */}
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
