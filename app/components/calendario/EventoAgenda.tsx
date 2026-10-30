'use client';

// Un evento dentro de la agenda, con un aspecto por tipo para distinguirlos
// de un vistazo: la celebración es la más destacada (banda granate, titular
// grande con capital); formación y convivencia, tarjetas más sobrias con su
// icono; el ensayo (oculto de momento), una fila sencilla.

import Link from 'next/link';
import { Clock, MapPin, Shirt, CalendarPlus, Users, GraduationCap, HeartHandshake } from 'lucide-react';
import { descargarIcs } from './descargarIcs';
import { DIAS_SEMANA, diasEntre, partesFecha, diaSemana } from '@/lib/fechas';
import { ETIQUETA_ESTADO, ETIQUETA_TIPO, textoConvocatoria, type Evento, type TipoEvento } from '@/lib/calendario';

const ESTILO: Record<TipoEvento, { tarjeta: string; banda?: string; fecha: string; titulo: string; eyebrow: string; icono?: typeof Users }> = {
  celebracion: {
    tarjeta: 'bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 shadow-md shadow-stone-900/5 hover:shadow-xl hover:shadow-red-900/10 hover:border-red-800/30 p-5 pl-7',
    banda: 'bg-gradient-to-b from-red-800 to-red-950',
    fecha: 'text-4xl sm:text-5xl text-red-800',
    // Capital granate en línea: comparte la línea base y sobresale solo por arriba
    titulo: 'font-serif text-2xl md:text-3xl tracking-tight leading-tight first-letter:text-[1.6em] first-letter:leading-none first-letter:font-medium first-letter:text-red-900',
    eyebrow: 'text-red-800',
  },
  formacion: {
    tarjeta: 'bg-white/80 border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-400 p-5 pl-7',
    banda: 'bg-stone-700',
    fecha: 'text-3xl sm:text-4xl text-stone-800',
    titulo: 'font-serif text-xl md:text-2xl tracking-tight leading-tight',
    eyebrow: 'text-stone-700',
    icono: GraduationCap,
  },
  convivencia: {
    tarjeta: 'bg-red-50/50 border border-red-800/15 shadow-sm hover:shadow-md hover:border-red-800/30 p-5 pl-7',
    banda: 'bg-red-800/40',
    fecha: 'text-3xl sm:text-4xl text-red-900/80',
    titulo: 'font-serif text-xl md:text-2xl tracking-tight leading-tight',
    eyebrow: 'text-red-900/80',
    icono: HeartHandshake,
  },
  ensayo: {
    tarjeta: 'bg-white/60 border border-stone-200 hover:border-stone-300 p-5',
    fecha: 'text-3xl sm:text-4xl text-stone-700',
    titulo: 'text-lg font-medium',
    eyebrow: 'text-stone-500',
  },
};

interface EventoAgendaProps {
  evento: Evento;
  hoy: string;
  detallesInternos: boolean;
  nombreRepertorio?: string;
  convocado?: boolean;
}

export default function EventoAgenda({ evento, hoy, detallesInternos, nombreRepertorio, convocado = true }: EventoAgendaProps) {

  const estilo = ESTILO[evento.tipo];
  const esCelebracion = evento.tipo === 'celebracion';
  const Icono = estilo.icono;
  const cancelado = evento.estado === 'cancelado';
  const dias = diasEntre(hoy, evento.fecha);
  const pasado = dias < 0;

  return (
    <article className={`flex gap-4 sm:gap-6 ${cancelado || pasado || !convocado ? 'opacity-60' : ''}`}>

      {/* FECHA */}
      <div className="w-12 sm:w-16 flex-shrink-0 text-center pt-1">
        <span className={`block font-serif leading-none tabular-nums ${estilo.fecha}`}>
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
        className={`group relative flex-1 min-w-0 rounded-sm overflow-hidden transition-all duration-300 ${estilo.tarjeta}`}
      >
        {estilo.banda && <div className={`absolute left-0 top-0 bottom-0 w-1 ${estilo.banda}`} />}
        {esCelebracion && (
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20 pointer-events-none" />
        )}

        {/* Eyebrow: tipo (+ secciones en ensayos) + estado */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2 pr-6">
          <span className={`flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium ${estilo.eyebrow}`}>
            {esCelebracion && (
              <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" /></svg>
            )}
            {Icono && <Icono size={12} strokeWidth={1.5} />}
            {ETIQUETA_TIPO[evento.tipo]}
          </span>
          {/* Secciones convocadas (si no es tutti) para los miembros */}
          {detallesInternos && evento.secciones.length > 0 && (
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

        <h3 className={`${estilo.titulo} text-stone-900 mb-3 ${cancelado ? 'line-through decoration-red-800/60' : ''}`}>
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
