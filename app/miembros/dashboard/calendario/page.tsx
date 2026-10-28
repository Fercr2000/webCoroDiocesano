import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import Calendario from '@/app/components/calendario/Calendario';
import FondoNotas from '@/app/components/FondoNotas';
import { eventosPrueba, repertoriosPrueba } from '@/lib/datosPrueba';
import type { Rol } from '@/lib/roles';

// ============= DATOS DE PRUEBA =============

const usuarioPrueba: { nombre: string; rol: Rol } = {
  nombre: 'Fernando',
  rol: 'Director', // Cambia a 'Tenor', 'Violín 1'... para ver el aviso «Tu sección no está convocada»
};

export default function CalendarioMiembrosPage() {
  return (
    <div className="min-h-screen w-full superficie-crema flex flex-col">

      <DashboardHeader nombre={usuarioPrueba.nombre} rol={usuarioPrueba.rol} />

      <main className="flex-1 relative overflow-hidden">

        {/* Notas flotando de lado a lado de la página */}
        <FondoNotas />

        {/* Degradados laterales que visten los márgenes (como en el dashboard). */}
        <div className="absolute inset-y-0 left-0 w-[9%] max-w-[14rem] bg-gradient-to-r from-red-900/[0.10] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[9%] max-w-[14rem] bg-gradient-to-l from-red-900/[0.10] to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-12 py-8 md:py-10">

          <Link
            href="/miembros/dashboard"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-red-800 transition-colors mb-6 rounded-sm"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Volver a tu archivo
          </Link>

          {/* CABECERA DE SECCIÓN */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
              Tu agenda
            </span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
            Celebraciones
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-6">
            Cada cita, con su hora, su sitio y su música
          </p>

          <div className="flex justify-center mb-10">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <Calendario
            eventos={eventosPrueba}
            modo="miembros"
            rol={usuarioPrueba.rol}
            repertorios={repertoriosPrueba}
          />

        </div>
      </main>
    </div>
  );
}
