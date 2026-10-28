'use client';

// "Más allá de la música": cuatro temas (valores, cómo acceder, ministerio y
// familia) en un riel clicable. Al pulsar uno, el riel se rellena hasta él y
// su contenido aparece en una tarjeta; también se avanza con las flechas.
// Textos de muestra (mockup).

import { useState } from 'react';
import Link from 'next/link';
import { Gem, DoorOpen, Cross, Users, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

type Tema = {
  id: string;
  etiqueta: string;
  icono: typeof Gem;
  titulo: string;
  intro: string;
} & (
  | { tipo: 'lista'; elementos: { nombre: string; texto: string }[] }
  | { tipo: 'pasos'; elementos: { nombre: string; texto: string }[] }
  | { tipo: 'cita'; cita: { texto: string; fuente: string }; cierre: string }
);

const TEMAS: Tema[] = [
  {
    id: 'valores',
    etiqueta: 'Valores',
    icono: Gem,
    titulo: 'Lo que cuidamos',
    intro: 'Más que normas, son la forma en que queremos estar juntos y servir. Los aprendemos ensayo a ensayo y los pedimos a quien se suma.',
    tipo: 'lista',
    elementos: [
      { nombre: 'Servicio', texto: 'Cantamos para que otros recen, no para lucirnos.' },
      { nombre: 'Humildad', texto: 'Cada voz suma; ninguna se impone a las demás.' },
      { nombre: 'Compromiso', texto: 'Puntualidad, constancia y estudio en casa.' },
      { nombre: 'Excelencia', texto: 'Ofrecemos lo mejor que sabemos hacer.' },
      { nombre: 'Fraternidad', texto: 'Nos cuidamos y nos acompañamos como hermanos.' },
    ],
  },
  {
    id: 'acceder',
    etiqueta: 'Cómo acceder',
    icono: DoorOpen,
    titulo: 'Así puedes unirte',
    intro: 'No hace falta ser profesional: buscamos personas con buena voz o buen oído, ganas de aprender y deseo de servir a la Iglesia.',
    tipo: 'pasos',
    elementos: [
      { nombre: 'Escríbenos', texto: 'Rellena el formulario de inscripción contándonos tu experiencia.' },
      { nombre: 'Nos conocemos', texto: 'Un encuentro sencillo con el director para encontrar tu cuerda o tu atril.' },
      { nombre: 'Ensayo de acogida', texto: 'Vienes a un ensayo para conocer al grupo y nuestra forma de trabajar.' },
      { nombre: 'Bienvenido', texto: 'Te damos acceso al área de miembros con tus partituras y audios.' },
    ],
  },
  {
    id: 'ministerio',
    etiqueta: 'Ministerio',
    icono: Cross,
    titulo: 'Un ministerio, no un escenario',
    intro: 'Quien canta en la liturgia ejerce un verdadero ministerio: forma parte de la asamblea que celebra y la ayuda a orar. Por eso no actuamos, servimos; y elegimos cada obra pensando en el misterio que se celebra.',
    tipo: 'cita',
    cita: { texto: 'La música sacra será tanto más santa cuanto más íntimamente esté unida a la acción litúrgica.', fuente: 'Sacrosanctum Concilium, 112' },
    cierre: 'Vivimos este servicio en comunión con la Delegación de Liturgia de la Diócesis, cuidando los tiempos litúrgicos y la participación de todo el pueblo de Dios.',
  },
  {
    id: 'familia',
    etiqueta: 'Familia',
    icono: Users,
    titulo: 'Personas antes que voces',
    intro: 'Detrás de cada atril hay una historia. Queremos que el coro sea un lugar donde cada uno se sienta querido, acompañado y en casa.',
    tipo: 'lista',
    elementos: [
      { nombre: 'Acompañamiento', texto: 'Los veteranos acogen y ayudan a quienes llegan.' },
      { nombre: 'Convivencias', texto: 'Compartimos comidas, celebraciones y algún que otro viaje.' },
      { nombre: 'Oración', texto: 'Rezamos juntos antes de cada ensayo y celebración.' },
      { nombre: 'Cuidado', texto: 'Estamos cerca en las alegrías y en las dificultades.' },
    ],
  },
];

export default function Temas() {

  const [activo, setActivo] = useState(0);
  const tema = TEMAS[activo];
  const progreso = (activo / (TEMAS.length - 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto">

      {/* ============= RIEL CON LOS TEMAS ============= */}
      <div className="relative px-6 sm:px-12 mb-12">
        {/* Raíl y relleno hasta el tema elegido (mismo margen que los iconos) */}
        <div className="absolute left-6 right-6 sm:left-12 sm:right-12 top-[22px] h-[3px]">
          <div className="absolute inset-x-0 top-[1px] h-px bg-stone-300" />
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-800 to-red-950 rounded-full transition-all duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <ol className="relative flex justify-between">
          {TEMAS.map((t, i) => {
            const elegido = i === activo;
            const Icono = t.icono;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActivo(i)}
                  aria-current={elegido ? 'step' : undefined}
                  className="group flex flex-col items-center gap-3 -mx-6"
                >
                  <span className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    elegido
                      ? 'border-red-800 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 scale-110 shadow-lg shadow-red-900/40'
                      : i < activo ? 'border-red-800 bg-white text-red-800' : 'border-stone-300 bg-white text-stone-400 group-hover:border-red-800/60 group-hover:text-red-800'
                  }`}>
                    <Icono size={20} strokeWidth={1.5} />
                  </span>
                  <span className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-colors whitespace-nowrap ${elegido ? 'text-red-800' : 'text-stone-500 group-hover:text-red-800'}`}>
                    {t.etiqueta}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ============= TARJETA DEL TEMA ============= */}
      <div className="relative flex items-center gap-2 sm:gap-4">
        <Flecha direccion="anterior" desactivada={activo === 0} onClick={() => setActivo((i) => Math.max(0, i - 1))} />

        <article key={tema.id} className="relative flex-1 overflow-hidden bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm shadow-xl shadow-red-900/10 px-6 py-8 sm:px-12 sm:py-10 animate-[fadeIn_0.5s_ease-out]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />
          {/* Icono gigante de fondo */}
          <tema.icono aria-hidden="true" className="absolute -right-6 -bottom-8 w-48 h-48 text-red-800/[0.05] pointer-events-none" strokeWidth={1} />

          <span className="relative block text-[10px] tracking-[0.4em] uppercase text-red-800 font-medium mb-2">{tema.etiqueta}</span>
          <h3 className="relative font-serif text-3xl text-stone-900 tracking-tight leading-tight mb-4">{tema.titulo}</h3>
          <p className="relative font-serif text-lg leading-relaxed text-stone-700 mb-6 first-letter:text-5xl first-letter:font-medium first-letter:text-red-900 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none">
            {tema.intro}
          </p>

          {/* Lista con rombos (valores, familia) */}
          {tema.tipo === 'lista' && (
            <ul className="relative grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {tema.elementos.map((e, i) => (
                <li key={e.nombre} style={{ animationDelay: `${i * 80}ms` }} className="flex gap-3 animate-[fadeIn_0.5s_ease-out_both]">
                  <svg width="8" height="8" viewBox="0 0 8 8" className="flex-shrink-0 mt-2 text-red-800/70" aria-hidden="true">
                    <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" />
                  </svg>
                  <span>
                    <span className="block text-xs tracking-[0.2em] uppercase font-medium text-stone-900">{e.nombre}</span>
                    <span className="block font-serif italic text-stone-600">{e.texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Pasos numerados (cómo acceder) */}
          {tema.tipo === 'pasos' && (
            <>
              <ol className="relative space-y-5">
                {tema.elementos.map((e, i) => (
                  <li key={e.nombre} style={{ animationDelay: `${i * 100}ms` }} className="flex gap-4 items-start animate-[fadeIn_0.5s_ease-out_both]">
                    <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 font-serif text-lg shadow-md shadow-red-900/30">
                      {i + 1}
                    </span>
                    <span className="pt-1">
                      <span className="block text-xs tracking-[0.2em] uppercase font-medium text-stone-900">{e.nombre}</span>
                      <span className="block font-serif italic text-stone-600">{e.texto}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <Link
                href="/contacto?motivo=unirme"
                className="relative group/btn overflow-hidden inline-flex items-center gap-2 mt-8 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium shadow-md hover:shadow-lg hover:shadow-red-900/40 transition-all duration-300 rounded-sm"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Ir al formulario
                  <ArrowRight size={14} strokeWidth={1.5} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </Link>
            </>
          )}

          {/* Cita y cierre (ministerio) */}
          {tema.tipo === 'cita' && (
            <>
              <blockquote className="relative font-serif italic text-xl text-red-900 leading-relaxed border-l-2 border-red-800/60 pl-6 mb-6">
                «{tema.cita.texto}»
                <cite className="block not-italic text-xs tracking-[0.3em] uppercase text-red-800/70 mt-3 font-sans">{tema.cita.fuente}</cite>
              </blockquote>
              <p className="relative font-serif text-lg leading-relaxed text-stone-700">{tema.cierre}</p>
            </>
          )}
        </article>

        <Flecha direccion="siguiente" desactivada={activo === TEMAS.length - 1} onClick={() => setActivo((i) => Math.min(TEMAS.length - 1, i + 1))} />
      </div>
    </div>
  );
}

function Flecha({ direccion, desactivada, onClick }: { direccion: 'anterior' | 'siguiente'; desactivada: boolean; onClick: () => void }) {
  const Icono = direccion === 'anterior' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactivada}
      // En móvil se cambia de tema con los iconos: las flechas no restan ancho a la tarjeta
      className="hidden sm:flex flex-shrink-0 w-10 h-10 items-center justify-center rounded-full text-stone-500 hover:text-red-800 hover:bg-red-50/60 transition-colors disabled:opacity-25 disabled:pointer-events-none"
      aria-label={direccion === 'anterior' ? 'Tema anterior' : 'Tema siguiente'}
    >
      <Icono size={22} strokeWidth={1.5} />
    </button>
  );
}
