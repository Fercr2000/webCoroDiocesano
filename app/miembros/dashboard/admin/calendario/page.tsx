'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarPlus, ChevronDown } from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import EventoAdminFila from './components/EventoAdminFila';
import EventoModal, { type DatosEvento } from './components/EventoModal';
import BandaProximaCelebracion from '@/app/components/calendario/BandaProximaCelebracion';
import FondoNotas from '@/app/components/FondoNotas';
import { useHoy } from '@/app/components/calendario/useHoy';
import { MESES, partesFecha, sumarDias, fechaLarga } from '@/lib/fechas';
import { ordenarEventos, type Evento } from '@/lib/calendario';
import { eventosPrueba, repertoriosPrueba } from '@/lib/datosPrueba';

// ============= DATOS DE PRUEBA =============
// Los cambios viven solo en memoria: al recargar vuelven los eventos de
// prueba, y el calendario de miembros no los ve hasta conectar Supabase.

const directorPrueba = {
  nombre: 'Fernando',
  rol: 'Director',
};

type Dialogo =
  | { tipo: 'crear' }
  | { tipo: 'editar'; evento: Evento }
  | { tipo: 'duplicar'; evento: Evento }
  | { tipo: 'eliminar'; evento: Evento }
  | null;

export default function CalendarioAdminPage() {

  const hoy = useHoy();

  // ============= ESTADOS =============

  const [eventos, setEventos] = useState<Evento[]>(eventosPrueba);
  const [verPasados, setVerPasados] = useState(false);
  const [dialogo, setDialogo] = useState<Dialogo>(null);

  const cerrarDialogo = () => setDialogo(null);

  // ============= ACCIONES =============

  const crearEvento = (datos: DatosEvento) => {
    setEventos((prev) => [...prev, { id: crypto.randomUUID(), ...datos }]);
    cerrarDialogo();
  };

  const editarEvento = (id: string, datos: DatosEvento) => {
    setEventos((prev) => prev.map((e) => (e.id === id ? { id, ...datos } : e)));
    cerrarDialogo();
  };

  const eliminarEvento = (id: string) => {
    setEventos((prev) => prev.filter((e) => e.id !== id));
    cerrarDialogo();
  };

  // ============= LISTADOS =============

  // De momento solo se programan celebraciones (los ensayos de prueba quedan ocultos).
  const filtrados = eventos
    .filter((e) => e.tipo === 'celebracion')
    .sort(ordenarEventos);
  const proximos = hoy ? filtrados.filter((e) => e.fecha >= hoy) : filtrados;
  const pasados = hoy ? filtrados.filter((e) => e.fecha < hoy).reverse() : [];

  // Agrupa los próximos por mes y año para las cabeceras.
  const grupos: { clave: string; anio: number; mes: number; eventos: Evento[] }[] = [];
  for (const e of proximos) {
    const { anio, mes } = partesFecha(e.fecha);
    const clave = `${anio}-${mes}`;
    if (grupos.at(-1)?.clave === clave) grupos.at(-1)!.eventos.push(e);
    else grupos.push({ clave, anio, mes, eventos: [e] });
  }

  const fila = (e: Evento, pasado: boolean) => (
    <EventoAdminFila
      key={e.id}
      evento={e}
      pasado={pasado}
      onEditar={() => setDialogo({ tipo: 'editar', evento: e })}
      onDuplicar={() => setDialogo({ tipo: 'duplicar', evento: e })}
      onEliminar={() => setDialogo({ tipo: 'eliminar', evento: e })}
    />
  );

  return (
    <div className="min-h-screen w-full superficie-crema flex flex-col">

      <DashboardHeader nombre={directorPrueba.nombre} rol={directorPrueba.rol} />

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
              Administración
            </span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
            Calendario
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-6">
            Las celebraciones del curso
          </p>

          <div className="flex justify-center mb-10">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Banda granate: así queda la próxima celebración para todos */}
          <BandaProximaCelebracion eventos={eventos} href="/miembros/dashboard/calendario" textoEnlace="Ver como miembro" />

          {/* ============= NUEVO EVENTO ============= */}
          <div className="flex justify-end mb-8">
            <button
              type="button"
              onClick={() => setDialogo({ tipo: 'crear' })}
              className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-3 text-xs tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-full"
            >
              <span className="relative z-10 flex items-center gap-2">
                <CalendarPlus size={16} strokeWidth={1.5} />
                Nueva celebración
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {/* ============= PRÓXIMOS ============= */}
          {grupos.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif italic text-xl text-stone-500 mb-2">No hay nada programado</p>
              <p className="text-sm text-stone-400">Usa «Nueva celebración» para añadir la próxima.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {grupos.map((g) => (
                <section key={g.clave}>
                  <div className="flex items-baseline gap-4 mb-4">
                    <h2 className="font-serif text-3xl text-stone-900 tracking-tight capitalize">{MESES[g.mes]}</h2>
                    <span className="text-xs tracking-[0.4em] text-red-800 font-medium tabular-nums">{g.anio}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent self-center" />
                    <span className="text-xs italic text-stone-400">{g.eventos.length} {g.eventos.length === 1 ? 'evento' : 'eventos'}</span>
                  </div>
                  <ul className="space-y-3">{g.eventos.map((e) => fila(e, false))}</ul>
                </section>
              ))}
            </div>
          )}

          {/* ============= PASADOS (plegados) ============= */}
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
                  Eventos pasados ({pasados.length})
                  <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform duration-300 ${verPasados ? 'rotate-180' : ''}`} />
                </span>
                <div className="h-px flex-1 bg-stone-300" />
              </button>
              {verPasados && (
                <ul className="space-y-3 mt-8 animate-[fadeIn_0.4s_ease-out]">{pasados.map((e) => fila(e, true))}</ul>
              )}
            </div>
          )}

          {/* LÍNEA DECORATIVA FINAL */}
          <div className="flex justify-center mt-12">
            <svg width="60" height="14" viewBox="0 0 60 14" fill="none" className="text-red-800/40">
              <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="26" y="3" width="8" height="8" transform="rotate(45 30 7)" fill="currentColor" />
              <line x1="38" y1="7" x2="60" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

        </div>
      </main>

      {/* ============= DIÁLOGOS ============= */}

      {dialogo?.tipo === 'crear' && (
        <EventoModal modo="crear" repertorios={repertoriosPrueba} onGuardar={crearEvento} onCerrar={cerrarDialogo} />
      )}

      {dialogo?.tipo === 'editar' && (
        <EventoModal
          modo="editar"
          inicial={dialogo.evento}
          repertorios={repertoriosPrueba}
          onGuardar={(datos) => editarEvento(dialogo.evento.id, datos)}
          onCerrar={cerrarDialogo}
        />
      )}

      {/* Duplicar: misma cita una semana después, como nueva y confirmada. */}
      {dialogo?.tipo === 'duplicar' && (
        <EventoModal
          modo="duplicar"
          inicial={{ ...dialogo.evento, fecha: sumarDias(dialogo.evento.fecha, 7), estado: 'confirmado' }}
          repertorios={repertoriosPrueba}
          onGuardar={crearEvento}
          onCerrar={cerrarDialogo}
        />
      )}

      {dialogo?.tipo === 'eliminar' && (
        <ConfirmDialog
          eyebrow="Eliminar evento"
          titulo={`¿Eliminar «${dialogo.evento.titulo}»?`}
          mensaje={
            <>
              Desaparecerá del calendario del {fechaLarga(dialogo.evento.fecha)}.{' '}
              Si solo cambia de fecha o se suspende, mejor edítalo y márcalo como <strong className="font-medium text-stone-800">aplazado</strong> o <strong className="font-medium text-stone-800">cancelado</strong>: así nadie se queda con la duda.
            </>
          }
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarEvento(dialogo.evento.id)}
          onCerrar={cerrarDialogo}
        />
      )}

    </div>
  );
}
