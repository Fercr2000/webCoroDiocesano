'use client';

// Calendario: cartel de la próxima celebración, filtros por tipo
// (celebraciones, formación, convivencias), agenda agrupada por mes y eventos
// pasados. Lo usan la página pública (sin datos internos) y el área de
// miembros (con convocatoria, vestimenta y enlace al repertorio). Los ensayos
// existen en el modelo pero, de momento, no se muestran.

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import CartelProximaCelebracion from './CartelProximaCelebracion';
import EventoAgenda from './EventoAgenda';
import { useHoy } from './useHoy';
import { MESES, partesFecha } from '@/lib/fechas';
import { estaConvocado, ordenarEventos, ETIQUETA_TIPO_PLURAL, TIPOS_VISIBLES, type Evento, type TipoEvento } from '@/lib/calendario';
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
  const [filtro, setFiltro] = useState<'todo' | TipoEvento>('todo');

  const deTiposVisibles = useMemo(
    () => eventos.filter((e) => TIPOS_VISIBLES.includes(e.tipo)).sort(ordenarEventos),
    [eventos]
  );
  const visibles = filtro === 'todo' ? deTiposVisibles : deTiposVisibles.filter((e) => e.tipo === filtro);

  // Mientras no sabemos la fecha (render del servidor) se muestra un aviso breve.
  if (!hoy) {
    return <p className="text-center font-serif italic text-xl text-stone-400 py-16">Preparando la agenda…</p>;
  }

  const proximos = visibles.filter((e) => e.fecha >= hoy);
  const pasados = visibles.filter((e) => e.fecha < hoy).reverse();

  // El cartel: siempre la próxima celebración confirmada (las aplazadas o canceladas no cuentan).
  const proximaCelebracion = deTiposVisibles.find((e) => e.tipo === 'celebracion' && e.estado === 'confirmado' && e.fecha >= hoy);
  const cuenta = (f: 'todo' | TipoEvento) =>
    deTiposVisibles.filter((e) => e.fecha >= hoy && (f === 'todo' || e.tipo === f)).length;

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

      {/* ============= FILTROS POR TIPO ============= */}
      <div className="flex flex-wrap justify-center gap-2 mt-12">
        {(['todo', ...TIPOS_VISIBLES] as const).map((f) => {
          const activo = filtro === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              aria-pressed={activo}
              className={`group relative overflow-hidden px-5 py-2 text-xs tracking-[0.2em] uppercase font-medium rounded-full transition-all duration-300 ${
                activo
                  ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md shadow-red-900/30'
                  : 'bg-stone-100 text-stone-600 border border-stone-300 hover:border-red-800/60 hover:text-red-800'
              }`}
            >
              <span className="relative z-10">
                {f === 'todo' ? 'Todo' : ETIQUETA_TIPO_PLURAL[f]}
                <span className={`ml-2 ${activo ? 'text-stone-50/70' : 'text-stone-400'}`}>{cuenta(f)}</span>
              </span>
              {activo && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>
          );
        })}
      </div>

      {/* ============= AGENDA ============= */}
      <div key={filtro} className="mt-10 animate-[fadeIn_0.4s_ease-out]">
        {proximos.length === 0 ? (
          <p className="text-center font-serif italic text-xl text-stone-500 py-8">No hay nada anunciado por ahora.</p>
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
              {filtro === 'todo' ? 'Eventos pasados' : `${ETIQUETA_TIPO_PLURAL[filtro]} · pasados`} ({pasados.length})
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
