'use client';

// Un evento dentro de la agenda. Las celebraciones son tarjetas con banda
// granate y titular serif; los ensayos, filas sobrias. Así una semana con
// cuatro ensayos y una solemnidad deja ver la solemnidad de un vistazo.

import Link from 'next/link';
import { Clock, MapPin, Shirt, CalendarPlus, Users } from 'lucide-react';
import { descargarIcs } from './descargarIcs';
import { DIAS_SEMANA, diasEntre, partesFecha, diaSemana } from '@/lib/fechas';
import { ETIQUETA_ESTADO, textoConvocatoria, type Evento } from '@/lib/calendario';

interface EventoAgendaProps {
  evento: Evento;
  hoy: string;
  detallesInternos: boolean;
  nombreRepertorio?: string;
  convocado?: boolean;
}

export default function EventoAgenda({ evento, hoy, detallesInternos, nombreRepertorio, convocado = true }: EventoAgendaProps) {

  const esCelebracion = evento.tipo === 'celebracion';
  const cancelado = evento.estado === 'cancelado';
  const dias = diasEntre(hoy, evento.fecha);
  const pasado = dias < 0;

  return (
    <article className={`flex gap-4 sm:gap-6 ${cancelado || pasado || !convocado ? 'opacity-60' : ''}`}>

      {/* FECHA */}
      <div className="w-12 sm:w-16 flex-shrink-0 text-center pt-1">
        <span className={`block font-serif leading-none tabular-nums ${esCelebracion ? 'text-4xl sm:text-5xl text-red-800' : 'text-3xl sm:text-4xl text-stone-700'}`}>
          {partesFecha(evento.fecha).dia}
        </span>
        <span className="block mt-1.5 text-[10px] tracking-[0.25em] uppercase text-stone-500">
          {DIAS_SEMANA[diaSemana(evento.fecha)].slice(0, 3)}
        </span>
        {(dias === 0 || dias === 1) && (
          <span className="inline-block mt-2 px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase text-stone-50 bg-gradient-to-br from-red-800 to-red-950 rounded-full">
            {dias === 0 ? 'Hoy' : 'Mañana'}
          </span>
        )}
      </div>

      {/* TARJETA */}
      <div
        className={`group relative flex-1 min-w-0 rounded-sm transition-all duration-300 ${
          esCelebracion
            ? 'bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 shadow-md shadow-stone-900/5 hover:shadow-xl hover:shadow-red-900/10 hover:border-red-800/30 p-5 pl-7'
            : 'bg-white/60 border border-stone-200 hover:border-stone-300 p-5'
        }`}
      >
        {esCelebracion && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20 pointer-events-none" />
          </>
        )}

        {/* Eyebrow: tipo (+ secciones en ensayos) + estado */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2 pr-6">
          {esCelebracion ? (
            <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium">
              <svg width="8" height="8" viewBox="0 0 8 8" className="text-red-800"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" /></svg>
              Celebración
            </span>
          ) : (
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">Ensayo</span>
          )}
          {detallesInternos && evento.tipo === 'ensayo' && (
            <>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
                <Users size={11} strokeWidth={1.5} />
                {textoConvocatoria(evento)}
              </span>
            </>
          )}
          {evento.estado !== 'confirmado' && (
            <span className="ml-1 px-2 py-0.5 text-[9px] tracking-[0.25em] uppercase text-red-800 border border-red-800/40 rounded-full">
              {ETIQUETA_ESTADO[evento.estado]}
            </span>
          )}
        </div>

        {/* Celebraciones: capital granate en línea (no flotante): comparte la línea base con el resto y sobresale solo por arriba */}
        <h3 className={`${esCelebracion ? 'font-serif text-2xl md:text-3xl tracking-tight leading-tight first-letter:text-[1.6em] first-letter:leading-none first-letter:font-medium first-letter:text-red-900' : 'text-lg font-medium'} text-stone-900 mb-3 ${cancelado ? 'line-through decoration-red-800/60' : ''}`}>
          {evento.titulo}
        </h3>

        {/* Datos prácticos */}
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
          <li className="flex items-center gap-2">
            <Clock size={14} strokeWidth={1.5} className="text-red-800/60 flex-shrink-0" />
            {evento.horaInicio}{evento.horaFin && ` – ${evento.horaFin}`} h
            {detallesInternos && evento.horaConvocatoria && (
              <span className="text-stone-400">· llegar a las {evento.horaConvocatoria}</span>
            )}
          </li>
          <li className="flex items-center gap-2 min-w-0">
            <MapPin size={14} strokeWidth={1.5} className="text-red-800/60 flex-shrink-0" />
            <span>{evento.lugar}</span>
          </li>
          {detallesInternos && evento.vestimenta && (
            <li className="flex items-center gap-2">
              <Shirt size={14} strokeWidth={1.5} className="text-red-800/60 flex-shrink-0" />
              {evento.vestimenta}
            </li>
          )}
        </ul>

        {detallesInternos && evento.notas && (
          <p className="mt-3 text-sm italic text-stone-500">{evento.notas}</p>
        )}

        {!convocado && (
          <p className="mt-3 text-xs italic text-stone-500">Tu sección no está convocada.</p>
        )}

        {/* Acciones: repertorio que estudiar + añadir a la agenda */}
        {!cancelado && !pasado && (
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {nombreRepertorio && (
              <Link
                href={`/miembros/dashboard?repertorio=${encodeURIComponent(nombreRepertorio)}`}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-red-800 border border-red-800/40 hover:border-red-800 hover:bg-red-50/60 rounded-full transition-colors"
              >
                <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" /></svg>
                Repertorio: {nombreRepertorio}
              </Link>
            )}
            <button
              type="button"
              onClick={() => descargarIcs(evento, detallesInternos)}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 hover:text-red-800 border border-stone-300 hover:border-red-800 rounded-full transition-colors"
            >
              <CalendarPlus size={12} strokeWidth={1.5} />
              A mi agenda
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
