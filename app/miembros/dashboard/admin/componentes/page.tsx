'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import Escenario from '@/app/components/componentes/Escenario';
import FondoNotas from '@/app/components/FondoNotas';
import { componentesPrueba } from '@/lib/datosPrueba';
import type { Componente } from '@/lib/formacion';

// ============= DATOS DE PRUEBA =============
// Los cambios viven solo en memoria: al recargar vuelve la lista de prueba,
// y la página pública no los ve hasta conectar Supabase.

const directorPrueba = {
  nombre: 'Fernando',
  rol: 'Director',
};

export default function ComponentesAdminPage() {

  const [componentes, setComponentes] = useState<Componente[]>(componentesPrueba);
  const [aQuitar, setAQuitar] = useState<Componente | null>(null);

  return (
    <div className="min-h-screen w-full superficie-crema flex flex-col">

      <DashboardHeader nombre={directorPrueba.nombre} rol={directorPrueba.rol} />

      <main className="flex-1 relative overflow-hidden">

        {/* Notas flotando, como en la página pública */}
        <FondoNotas />

        {/* Degradados laterales que visten los márgenes (como en el dashboard). */}
        <div className="absolute inset-y-0 left-0 w-[9%] max-w-[14rem] bg-gradient-to-r from-red-900/[0.10] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[9%] max-w-[14rem] bg-gradient-to-l from-red-900/[0.10] to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-8 md:py-10">

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
              Administración
            </span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
            Componentes
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-6">
            Quién aparece en la formación de la web
          </p>

          <div className="flex justify-center mb-6">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="flex justify-center mb-8">
            <Link
              href="/sobre-nosotros/componentes"
              target="_blank"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium text-stone-500 hover:text-red-800 transition-colors"
            >
              Ver la página pública
              <ExternalLink size={12} strokeWidth={1.5} />
            </Link>
          </div>

          <Escenario
            componentes={componentes}
            edicion={{
              onAnadir: (seccion, nombre) =>
                setComponentes((prev) => [...prev, { id: crypto.randomUUID(), nombre, rol: seccion.roles[0] }]),
              onEliminar: setAQuitar,
            }}
          />

        </div>
      </main>

      {aQuitar && (
        <ConfirmDialog
          eyebrow="Quitar componente"
          titulo={`¿Quitar a ${aQuitar.nombre}?`}
          mensaje="Dejará de aparecer en la formación de la página pública. Su cuenta de acceso, si la tiene, no se toca."
          textoConfirmar="Quitar"
          onConfirmar={() => {
            setComponentes((prev) => prev.filter((c) => c.id !== aQuitar.id));
            setAQuitar(null);
          }}
          onCerrar={() => setAQuitar(null)}
        />
      )}

    </div>
  );
}
