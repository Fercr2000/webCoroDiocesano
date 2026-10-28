import { Phone, Mail, MapPin } from "lucide-react";
import FondoNotas from "@/app/components/FondoNotas";
import PentagramaOla from "@/app/components/PentagramaOla";
import SelectorFormulario from "@/app/components/contacto/SelectorFormulario";
import { PERSONAS_CONTACTO, EMAIL_CONTACTO, INSTAGRAM, SEDE, enlaceTelefono } from "@/lib/contacto";

// Contacto: formularios para unirse al coro o para contar con él en una
// celebración (los dos con mensaje), y un panel con los teléfonos del
// Director y del Coordinador, el email, Instagram y la sede.
export default function ContactoPage() {
  return (
    <main className="superficie-crema w-full py-12 md:py-16">
      <FondoNotas soloLaterales />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">

        {/* CABECERA DE SECCIÓN */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">Hablemos</span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
          Contacto
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">
          Estamos a un mensaje de distancia
        </p>

        <div className="flex justify-center mb-14">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="grid lg:grid-cols-[1fr_21rem] gap-10 lg:gap-12 items-start">

          {/* ============= ELECCIÓN + FORMULARIO ============= */}
          <SelectorFormulario />

          {/* ============= TELÉFONOS Y DATOS (primero en móvil) ============= */}
          <aside className="order-first lg:order-none lg:sticky lg:top-32 space-y-6">

            {/* Panel granate: llámanos */}
            <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 shadow-2xl shadow-red-950/30 px-7 pt-8 pb-24">
              <div className="capa-grano" />
              <div className="respira absolute -top-16 left-1/4 w-64 h-64 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
              <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-stone-50/30" />
              <PentagramaOla conNotas duracion={48} className="bottom-2" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-8 bg-stone-50/50" />
                  <span className="text-[10px] tracking-[0.4em] uppercase text-stone-50/90 font-medium">Llámanos</span>
                </div>
                <p className="font-serif italic text-stone-50/75 mb-6">Preferimos hablar contigo de tú a tú</p>

                <ul className="space-y-6">
                  {PERSONAS_CONTACTO.map((p) => (
                    <li key={p.nombre}>
                      <span className="block text-[10px] tracking-[0.3em] uppercase text-stone-50/60 mb-1">{p.cargo}</span>
                      <span className="block font-serif text-xl leading-tight mb-2">{p.nombre}</span>
                      <a
                        href={enlaceTelefono(p.telefono)}
                        className="group inline-flex items-center gap-3 bg-stone-50/10 hover:bg-stone-50 hover:text-red-900 border border-stone-50/25 rounded-full pl-2 pr-5 py-1.5 transition-all duration-300"
                      >
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-red-900 group-hover:bg-gradient-to-br group-hover:from-red-800 group-hover:to-red-950 group-hover:text-stone-50 transition-colors">
                          <Phone size={14} strokeWidth={1.5} />
                        </span>
                        <span className="font-medium tracking-[0.08em] tabular-nums">{p.telefono}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tarjeta clara: escríbenos */}
            <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm shadow-lg shadow-stone-900/5 px-7 py-7">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60" />
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-red-800/50" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-red-800 font-medium">Escríbenos</span>
              </div>
              <ul className="space-y-4 text-sm">
                <DatoContacto href={`mailto:${EMAIL_CONTACTO}`} etiqueta="Email" texto={EMAIL_CONTACTO} icono={<Mail size={16} strokeWidth={1.5} />} />
                <DatoContacto href={INSTAGRAM.url} etiqueta="Instagram" texto={INSTAGRAM.usuario} externo icono={<IconoInstagram />} />
                <DatoContacto href={SEDE.mapa} etiqueta="Sede" texto={SEDE.nombre} externo icono={<MapPin size={16} strokeWidth={1.5} />} />
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

// ============= SUBCOMPONENTES =============

function DatoContacto({ href, etiqueta, texto, icono, externo = false }: { href: string; etiqueta: string; texto: string; icono: React.ReactNode; externo?: boolean }) {
  return (
    <li>
      <a
        href={href}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-start gap-3"
      >
        <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 text-red-800 group-hover:bg-gradient-to-br group-hover:from-red-800 group-hover:to-red-950 group-hover:text-stone-50 transition-colors">
          {icono}
        </span>
        <span className="min-w-0 pt-0.5">
          <span className="block text-[10px] tracking-[0.3em] uppercase text-stone-400">{etiqueta}</span>
          <span className="block text-stone-800 group-hover:text-red-800 transition-colors break-words">{texto}</span>
        </span>
      </a>
    </li>
  );
}

// Lucide ya no incluye iconos de marcas: mismo trazo que el del footer.
function IconoInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
