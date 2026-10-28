import Galeria from "@/app/components/galeria/Galeria";
import FondoNotas from "@/app/components/FondoNotas";
import { albumesPrueba } from "@/lib/datosPrueba";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galería",
  description: "Fotos de nuestras celebraciones, conciertos, ensayos y convivencias.",
};

// Galería de fotos del coro: carpetas por celebración, concierto, ensayo o
// convivencia. Con Supabase, los álbumes y sus fotos vendrán de la base de datos.
export default function GaleriaPage() {
  return (
    <main className="superficie-crema w-full py-12 md:py-16">
      <FondoNotas soloLaterales />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* CABECERA DE SECCIÓN */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Sobre nosotros
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
          Galería
        </h1>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">
          Momentos que hemos servido cantando
        </p>

        <div className="flex justify-center mb-8">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <Galeria albumes={albumesPrueba} />

      </div>
    </main>
  );
}
