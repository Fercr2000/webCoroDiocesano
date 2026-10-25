'use client';

// Calendario de celebraciones: cartel de la próxima, agenda agrupada por
// mes y celebraciones pasadas. Lo usan la página pública (sin datos
// internos) y el área de miembros (con convocatoria, vestimenta y enlace al
// repertorio). Los ensayos se gestionan en el panel pero, de momento, no se
// muestran aquí.

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import CartelProximaCelebracion from './CartelProximaCelebracion';
import EventoAgenda from './EventoAgenda';
import { useHoy } from './useHoy';
import { MESES, partesFecha } from '@/lib/fechas';
import { estaConvocado, ordenarEventos, type Evento } from '@/lib/calendario';
import type { Repertorio } from '@/lib/archivo';
import type { Rol } from '@/lib/roles';

interface CalendarioProps {
  eventos: Evento[];
  modo: 'publico' | 'miembros';
  rol?: Rol;
  repertorios?: Repertorio[];
}

export default function Calendario({ eventos, modo, rol, repertorios = [] }: CalendarioProps) {

  const hoy = useHoy();
  const internos = modo === 'miembros';
  const [verPasados, setVerPasados] = useState(false);

  const visibles = useMemo(
    () => eventos.filter((e) => e.tipo === 'celebracion').sort(ordenarEventos),
    [eventos]
  );

  // Mientras no sabemos la fecha (render del servidor) se muestra un aviso breve.
  if (!hoy) {
    return <p className="text-center font-serif italic text-xl text-stone-400 py-16">Preparando la agenda…</p>;
  }

  const proximos = visibles.filter((e) => e.fecha >= hoy);
  const pasados = visibles.filter((e) => e.fecha < hoy).reverse();

  // El cartel: siempre la próxima celebración confirmada (las aplazadas o canceladas no cuentan).
  const proximaCelebracion = visibles.find((e) => e.estado === 'confirmado' && e.fecha >= hoy);

  const nombreRepertorio = (id?: string) => repertorios.find((r) => r.id === id)?.nombre;

  const renderEvento = (e: Evento) => (
    <EventoAgenda
      key={e.id}
      evento={e}
      hoy={hoy}
      detallesInternos={internos}
      nombreRepertorio={internos ? nombreRepertorio(e.repertorioId) : undefined}
      convocado={rol ? estaConvocado(e, rol) : true}
    />
  );

  return (
    <div>

      {/* ============= CARTEL GRANATE ============= */}
      <CartelProximaCelebracion evento={proximaCelebracion} hoy={hoy} detallesInternos={internos} />

      {/* ============= AGENDA ============= */}
      <div className="mt-12">
        {proximos.length === 0 ? (
          <p className="text-center font-serif italic text-xl text-stone-500 py-8">No hay celebraciones anunciadas por ahora.</p>
        ) : (
          <div className="space-y-10">
            {agruparPorMes(proximos).map(({ anio, mes, eventos }) => (
              <section key={`${anio}-${mes}`}>
                <CabeceraMes anio={anio} mes={mes} />
                <div className="space-y-4">{eventos.map(renderEvento)}</div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* ============= PASADAS (plegadas) ============= */}
      {pasados.length > 0 && (
        <div className="mt-12">
          <button
            type="button"
            onClick={() => setVerPasados(!verPasados)}
            aria-expanded={verPasados}
            className="w-full flex items-center gap-4 text-stone-500 hover:text-red-800 transition-colors"
          >
            <div className="h-px flex-1 bg-stone-300" />
            <span className="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase font-medium">
              Celebraciones pasadas ({pasados.length})
              <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform duration-300 ${verPasados ? 'rotate-180' : ''}`} />
            </span>
            <div className="h-px flex-1 bg-stone-300" />
          </button>
          {verPasados && (
            <div className="space-y-4 mt-6 animate-[fadeIn_0.4s_ease-out]">{pasados.map(renderEvento)}</div>
          )}
        </div>
      )}

    </div>
  );
}

// ============= SUBCOMPONENTES =============

function agruparPorMes(eventos: Evento[]) {
  const grupos: { anio: number; mes: number; eventos: Evento[] }[] = [];
  for (const e of eventos) {
    const { anio, mes } = partesFecha(e.fecha);
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.anio === anio && ultimo.mes === mes) ultimo.eventos.push(e);
    else grupos.push({ anio, mes, eventos: [e] });
  }
  return grupos;
}

function CabeceraMes({ anio, mes }: { anio: number; mes: number }) {
  return (
    <div className="flex items-baseline gap-4 mb-4">
      <h3 className="font-serif text-3xl text-stone-900 tracking-tight capitalize">{MESES[mes]}</h3>
      <span className="text-xs tracking-[0.4em] text-red-800 font-medium tabular-nums">{anio}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent self-center" />
    </div>
  );
}
