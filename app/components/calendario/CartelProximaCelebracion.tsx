'use client';

// Cartel granate con la próxima celebración y su cuenta atrás. Solo cuenta
// celebraciones confirmadas: los ensayos nunca ocupan este lugar.
// Como detalle al pie, la fachada de la Catedral de Jaén a línea blanca de
// la que "sale" el pentagrama: las notas nacen tras ella y viajan hacia la
// izquierda, donde la pauta se desvanece.

import { Clock, MapPin, Shirt, CalendarPlus } from 'lucide-react';
import PentagramaOla from '../PentagramaOla';
import CatedralJaen from './CatedralJaen';
import { descargarIcs } from './descargarIcs';
import { diasEntre, fechaLarga } from '@/lib/fechas';
import type { Evento } from '@/lib/calendario';

interface CartelProps {
  evento: Evento | undefined;
  hoy: string;
  detallesInternos: boolean;
}

export default function CartelProximaCelebracion({ evento, hoy, detallesInternos }: CartelProps) {
  return (
    <section className="relative overflow-hidden rounded-sm bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 shadow-2xl shadow-red-950/30">

      {/* Fondo: grano, viñeta y foco de luz */}
      <div className="capa-grano" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_95%_at_30%_20%,transparent_40%,rgba(69,10,10,0.55)_100%)]" />
      <div className="respira absolute -top-16 left-[30%] w-72 h-72 rounded-full bg-red-500/25 blur-3xl pointer-events-none" />

      {/* Marco editorial: esquinas decorativas */}
      <div className="absolute top-5 left-5 w-6 h-6 border-t border-l border-stone-50/30 pointer-events-none" />
      <div className="absolute top-5 right-5 w-6 h-6 border-t border-r border-stone-50/30 pointer-events-none" />

      <div className="relative z-10 px-8 pt-10 pb-8 md:px-12 md:pt-12 md:pb-10">
        {evento ? <Contenido evento={evento} hoy={hoy} detallesInternos={detallesInternos} /> : <SinCelebraciones />}
        <PieMusical />
      </div>
    </section>
  );
}

function Contenido({ evento, hoy, detallesInternos }: { evento: Evento; hoy: string; detallesInternos: boolean }) {

  const dias = diasEntre(hoy, evento.fecha);

  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12">

      <div className="min-w-0">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px w-10 bg-stone-50/50" />
          <span className="text-xs tracking-[0.4em] uppercase text-stone-50/90 font-medium">
            Próxima celebración
          </span>
        </div>

        <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
          {evento.titulo}
        </h2>

        <p className="font-serif italic text-xl text-stone-50/80 mb-6 first-letter:uppercase">
          {fechaLarga(evento.fecha)}
        </p>

        <ul className="space-y-2 text-sm text-stone-50/85 mb-8">
          <li className="flex items-center gap-3">
            <Clock size={16} strokeWidth={1.5} className="flex-shrink-0 text-stone-50/60" />
            <span>
              {evento.horaInicio} h
              {detallesInternos && evento.horaConvocatoria && (
                <span className="text-stone-50/60"> · convocatoria a las {evento.horaConvocatoria}</span>
              )}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <MapPin size={16} strokeWidth={1.5} className="flex-shrink-0 text-stone-50/60" />
            <span>{evento.lugar}</span>
          </li>
          {detallesInternos && evento.vestimenta && (
            <li className="flex items-center gap-3">
              <Shirt size={16} strokeWidth={1.5} className="flex-shrink-0 text-stone-50/60" />
              <span>{evento.vestimenta}</span>
            </li>
          )}
        </ul>

        <button
          type="button"
          onClick={() => descargarIcs(evento, detallesInternos)}
          className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-stone-50 text-red-900 px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-950/50 transition-all duration-300 rounded-sm"
        >
          <span className="relative z-10 flex items-center gap-2">
            <CalendarPlus size={14} strokeWidth={1.5} />
            Añadir a mi agenda
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>

      {/* CUENTA ATRÁS */}
      <div className="flex md:flex-col items-baseline md:items-center justify-start md:justify-center gap-4 md:gap-2 md:pl-12 md:border-l border-stone-50/20 md:self-center">
        {dias === 0 || dias === 1 ? (
          <span className="font-serif text-6xl leading-none">{dias === 0 ? 'Hoy' : 'Mañana'}</span>
        ) : (
          <>
            <span className="text-[10px] tracking-[0.4em] uppercase text-stone-50/70">Faltan</span>
            <span className="font-serif text-7xl md:text-8xl leading-none tabular-nums">{dias}</span>
            <span className="text-[10px] tracking-[0.4em] uppercase text-stone-50/70">días</span>
          </>
        )}
      </div>

    </div>
  );
}

// Detalle del pie: pentagrama con notas que sale de la catedral (abajo a la
// derecha). La catedral mide solo un poco más que la pauta; la base de la
// fachada coincide con la quinta línea (por eso la pauta baja 8px). Mismo
// blanco translúcido que las notas y trazo de ~1px, como las líneas.
function PieMusical() {
  return (
    <div className="relative flex items-end h-[100px] mt-6 -mx-8 md:-mx-12 pr-8 md:pr-12">
      <div className="relative flex-1 h-[72px] -mb-2 [mask-image:linear-gradient(to_right,transparent,black_30%)]">
        <PentagramaOla conNotas duracion={48} className="top-0" />
      </div>
      <CatedralJaen trazo={2.2} className="h-[100px] w-auto flex-shrink-0 text-stone-50/45" />
    </div>
  );
}

function SinCelebraciones() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-5">
        <div className="h-px w-10 bg-stone-50/50" />
        <span className="text-xs tracking-[0.4em] uppercase text-stone-50/90 font-medium">Próxima celebración</span>
        <div className="h-px w-10 bg-stone-50/50" />
      </div>
      <p className="font-serif italic text-2xl text-stone-50/85">
        Muy pronto anunciaremos nuestra próxima cita.
      </p>
    </div>
  );
}
