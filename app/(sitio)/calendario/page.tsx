import Calendario from "@/app/components/calendario/Calendario";
import FondoNotas from "@/app/components/FondoNotas";
import { eventosPrueba } from "@/lib/datosPrueba";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendario",
  description: "Próximas celebraciones del Coro y Orquesta de la Diócesis de Jaén.",
};

// Calendario público: solo celebraciones. Los ensayos, convocatorias y
// vestimenta son información interna y solo se ven en el área de miembros.
export default function CalendarioPage() {
  return (
    <main className="superficie-crema w-full py-12 md:py-16">
      {/* Notas flotando de lado a lado de la página */}
      <FondoNotas />
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">

        {/* CABECERA DE SECCIÓN */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Agenda
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
          Calendario
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">
          Dónde y cuándo servimos cantando
        </p>

        <div className="flex justify-center mb-10">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <Calendario eventos={eventosPrueba} modo="publico" />

      </div>
    </main>
  );
}
