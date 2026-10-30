'use client';

// Evento en el panel del director: bloque de fecha + datos + acciones.
// "Duplicar" abre el formulario con la misma cita una semana después.

import { Pencil, Copy, Trash2, Clock, MapPin, Users } from 'lucide-react';
import { DIAS_SEMANA, MESES, diaSemana, partesFecha } from '@/lib/fechas';
import { ETIQUETA_ESTADO, ETIQUETA_TIPO, textoConvocatoria, type Evento } from '@/lib/calendario';

interface EventoAdminFilaProps {
  evento: Evento;
  pasado: boolean;
  onEditar: () => void;
  onDuplicar: () => void;
  onEliminar: () => void;
}

export default function EventoAdminFila({ evento, pasado, onEditar, onDuplicar, onEliminar }: EventoAdminFilaProps) {

  const { anio, mes, dia } = partesFecha(evento.fecha);
  const esCelebracion = evento.tipo === 'celebracion';
  // Bloque de fecha: granate (celebración), piedra oscura (formación), granate suave (convivencia)
  const bloqueFecha = {
    celebracion: 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50',
    formacion: 'bg-stone-800 text-stone-50',
    convivencia: 'bg-red-50 text-red-900 border-b sm:border-b-0 sm:border-r border-red-800/15',
    ensayo: 'bg-stone-100 text-stone-700 border-b sm:border-b-0 sm:border-r border-stone-200',
  }[evento.tipo];
  const cancelado = evento.estado === 'cancelado';

  return (
    <li className={`group relative flex flex-col sm:flex-row bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm overflow-hidden shadow-sm shadow-stone-900/5 hover:shadow-lg hover:shadow-red-900/10 hover:border-red-800/30 transition-all duration-300 ${pasado ? 'opacity-60' : ''}`}>

      {/* BLOQUE DE FECHA: color según el tipo de evento */}
      <div className={`flex sm:flex-col items-center justify-center gap-3 sm:gap-0 sm:w-24 flex-shrink-0 px-5 py-3 sm:py-5 ${
        bloqueFecha
      }`}>
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-80">{DIAS_SEMANA[diaSemana(evento.fecha)].slice(0, 3)}</span>
        <span className="font-serif text-4xl leading-none tabular-nums sm:my-1">{dia}</span>
        <span className="text-[10px] tracking-[0.2em] uppercase opacity-80">{MESES[mes].slice(0, 3)} {anio}</span>
      </div>

      {/* DATOS */}
      <div className="flex-1 min-w-0 p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
          <span className={`text-[10px] tracking-[0.3em] uppercase font-medium ${esCelebracion ? 'text-red-800' : 'text-stone-500'}`}>
            {ETIQUETA_TIPO[evento.tipo]}
          </span>
          <span className="text-stone-300">·</span>
          <span className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
            <Users size={11} strokeWidth={1.5} />
            {textoConvocatoria(evento)}
          </span>
          {evento.estado !== 'confirmado' && (
            <span className="ml-1 px-2 py-0.5 text-[9px] tracking-[0.25em] uppercase text-red-800 border border-red-800/40 rounded-full">
              {ETIQUETA_ESTADO[evento.estado]}
            </span>
          )}
        </div>
        <h3 className={`font-serif text-xl sm:text-2xl text-stone-900 tracking-tight leading-tight mb-2 truncate ${cancelado ? 'line-through decoration-red-800/60' : ''}`}>
          {evento.titulo}
        </h3>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
          <span className="flex items-center gap-1.5">
            <Clock size={13} strokeWidth={1.5} className="text-red-800/60" />
            {evento.horaInicio}{evento.horaFin && `–${evento.horaFin}`}
          </span>
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin size={13} strokeWidth={1.5} className="text-red-800/60 flex-shrink-0" />
            <span className="truncate">{evento.lugar}</span>
          </span>
        </p>
      </div>

      {/* ACCIONES */}
      <div className="flex sm:flex-col border-t sm:border-t-0 sm:border-l border-stone-200">
        <Accion onClick={onEditar} icono={<Pencil size={14} strokeWidth={1.5} />} texto="Editar" />
        <Accion onClick={onDuplicar} icono={<Copy size={14} strokeWidth={1.5} />} texto="Duplicar" />
        <Accion onClick={onEliminar} icono={<Trash2 size={14} strokeWidth={1.5} />} texto="Eliminar" />
      </div>
    </li>
  );
}

function Accion({ onClick, icono, texto }: { onClick: () => void; icono: React.ReactNode; texto: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center sm:justify-start gap-2 px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 hover:text-red-800 hover:bg-red-50/60 transition-colors border-l sm:border-l-0 sm:border-t border-stone-200 first:border-0"
    >
      {icono}
      {texto}
    </button>
  );
}
