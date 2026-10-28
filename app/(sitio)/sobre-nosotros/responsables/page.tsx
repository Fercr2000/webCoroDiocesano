import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/app/components/Reveal";
import FondoNotas from "@/app/components/FondoNotas";
import FotoResponsable from "@/app/components/responsables/FotoResponsable";
import { RESPONSABLES, enlaceCarta, type Responsable } from "@/lib/responsables";

// Responsables del coro presentados como un tríptico, a la manera de un
// retablo de tres calles: las tres iguales, en granate y sin jerarquía (el
// Director en el centro solo por composición). Cada una enlaza a su carta
// completa. Datos y textos (de muestra) en lib/responsables.

const [LITURGIA, DIRECTOR, COROS] = ["delegado-liturgia", "director", "delegado-coros"].map(
  (slug) => RESPONSABLES.find((r) => r.slug === slug)!
);

export default function ResponsablesPage() {
  return (
    <main className="superficie-crema w-full py-12 md:py-16">
      <FondoNotas soloLaterales />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">

        {/* CABECERA DE SECCIÓN */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Sobre nosotros
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
          Responsables
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">
          Quienes acompañan y guían nuestro servicio
        </p>

        <div className="flex justify-center mb-14">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* ============= TRÍPTICO: tres calles iguales (items-stretch = misma altura) ============= */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 items-stretch">
          <Reveal desde="izquierda" delay={150} className="flex">
            <Calle responsable={LITURGIA} />
          </Reveal>
          <Reveal className="flex">
            <Calle responsable={DIRECTOR} />
          </Reveal>
          <Reveal desde="derecha" delay={150} className="flex">
            <Calle responsable={COROS} />
          </Reveal>
        </div>

      </div>
    </main>
  );
}

// ============= CALLE DEL TRÍPTICO =============

function Calle({ responsable }: { responsable: Responsable }) {
  const { cargo, nombre, cita, resumen } = responsable;

  return (
    <article className="relative w-full flex flex-col overflow-hidden rounded-sm text-center bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 shadow-2xl shadow-red-950/30 px-8 py-12 lg:py-14">

      {/* Fondo granate de la casa: grano, viñeta, foco que respira y marco */}
      <div className="capa-grano" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_50%_15%,transparent_40%,rgba(69,10,10,0.55)_100%)]" />
      <div className="respira absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-red-500/25 blur-3xl pointer-events-none" />
      <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-stone-50/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-stone-50/30 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col">

        {/* Foto cuadrada con el marco de "Palabras del director" */}
        <FotoResponsable responsable={responsable} tono="granate" className="mx-auto mb-10 w-40 lg:w-44" />

        {/* Cargo */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-stone-50/50" />
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-stone-50/90">
            {cargo}
          </span>
          <div className="h-px w-8 bg-stone-50/50" />
        </div>

        <h2 className="font-serif text-2xl lg:text-[1.75rem] tracking-tight leading-tight mb-6">
          {nombre}
        </h2>

        {/* Cita */}
        <blockquote className="font-serif italic leading-relaxed mb-1 text-base lg:text-lg text-stone-50/90">
          «{cita.texto}»
        </blockquote>
        <p className="text-[10px] tracking-[0.3em] uppercase mb-6 text-stone-50/60">
          {cita.fuente}
        </p>

        <svg width="60" height="14" viewBox="0 0 60 14" fill="none" className="mx-auto mb-6 text-stone-50/50">
          <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="0.5" />
          <rect x="26" y="3" width="8" height="8" transform="rotate(45 30 7)" fill="currentColor" />
          <line x1="38" y1="7" x2="60" y2="7" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        {/* Resumen con la capital de "Palabras del director" */}
        <p className="text-left font-serif leading-relaxed text-base lg:text-lg text-stone-50/85 first-letter:font-serif first-letter:text-5xl first-letter:font-medium first-letter:text-stone-50 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none">
          {resumen}
        </p>

        {/* mt-auto: el enlace queda alineado abajo en las tres calles */}
        <div className="mt-auto pt-8">
          <Link
            href={enlaceCarta(responsable)}
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium text-stone-50/90 hover:text-white border-b border-stone-50/30 hover:border-stone-50 pb-1 transition-colors"
          >
            Leer la carta completa
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}
