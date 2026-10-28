'use client';

// Inicio: el cartel granate de la próxima celebración (con la catedral y el
// pentagrama con notas) y el acceso al calendario completo. Versión pública:
// sin hora de convocatoria ni vestimenta.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CartelProximaCelebracion from '../calendario/CartelProximaCelebracion';
import { useHoy } from '../calendario/useHoy';
import { ordenarEventos, type Evento } from '@/lib/calendario';

export default function ProximaCelebracionInicio({ eventos }: { eventos: Evento[] }) {

  const hoy = useHoy();

  // Hasta conocer la fecha del navegador se reserva el hueco (sin saltos al cargar).
  if (!hoy) return <div className="min-h-[440px]" aria-hidden="true" />;

  const proxima = [...eventos]
    .sort(ordenarEventos)
    .find((e) => e.tipo === 'celebracion' && e.estado === 'confirmado' && e.fecha >= hoy);

  return (
    <div>
      <CartelProximaCelebracion evento={proxima} hoy={hoy} detallesInternos={false} />
      <div className="flex justify-center mt-8">
        <Link
          href="/calendario"
          className="group inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-medium text-stone-600 hover:text-red-800 transition-colors"
        >
          Ver todo el calendario
          <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
