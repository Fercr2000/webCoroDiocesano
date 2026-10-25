'use client';

// Plano del escenario con la formación del coro y la orquesta. Cada sección
// muestra un punto por componente, así se ve de un vistazo el tamaño real de
// cada cuerda. Al pulsarla se ilumina (el resto se atenúa), sus puntos se
// encienden en cascada y debajo se despliega un "programa de mano" con los
// nombres entrando uno a uno.
// Con `edicion` (panel del director), el programa permite añadir y quitar nombres.
// En móvil la formación se lee por filas, del fondo del escenario hacia delante.

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Plus, Trash2 } from 'lucide-react';
import IconoSeccion from './IconoSeccion';
import { SECCIONES, FILAS_MOVIL, miembrosDe, type Componente, type Seccion } from '@/lib/formacion';

interface Edicion {
  onAnadir: (seccion: Seccion, nombre: string) => void;
  onEliminar: (componente: Componente) => void;
}

// Dos tratamientos con la paleta de la casa: coro y dirección en granate
// pleno; toda la orquesta (cuerda, viento, órgano y percusión) como las
// tarjetas, en blanco con banda granate.
const GRANATE = {
  pieza: 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 border border-red-950 shadow-md shadow-red-900/20',
  punto: 'bg-stone-50',
  brillo: 'shadow-[0_0_8px_rgba(250,250,249,0.95)]',
  linea: 'bg-stone-50',
  hoverTexto: 'group-hover:text-white',
};
const ORQUESTA = {
  pieza: 'bg-white text-stone-900 border border-stone-200 shadow-sm shadow-stone-900/5',
  punto: 'bg-red-800',
  brillo: 'shadow-[0_0_8px_rgba(153,27,27,0.8)]',
  linea: 'bg-red-800',
  hoverTexto: 'group-hover:text-red-800',
};
const esGranate = (s: Seccion) => s.grupo === 'Voces' || s.grupo === 'Dirección';

const ETIQUETA_FILA = ['Coro', 'Órgano y percusión', 'Viento', 'Cuerda', 'Dirección'];

export default function Escenario({ componentes, edicion }: { componentes: Componente[]; edicion?: Edicion }) {

  const [seleccion, setSeleccion] = useState<string | null>(null);
  const seccionActiva = SECCIONES.find((s) => s.id === seleccion);

  // Esc cierra el programa de mano.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSeleccion(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const alternar = (id: string) => setSeleccion((actual) => (actual === id ? null : id));

  const pieza = (s: Seccion, enPlano: boolean) => (
    <PiezaSeccion
      key={s.id}
      seccion={s}
      miembros={miembrosDe(s, componentes)}
      activa={seleccion === s.id}
      atenuada={seleccion !== null && seleccion !== s.id}
      enPlano={enPlano}
      onClick={() => alternar(s.id)}
    />
  );

  const programa = (s: Seccion, pestana?: number) => (
    <ProgramaDeMano
      key={s.id}
      seccion={s}
      miembros={miembrosDe(s, componentes)}
      pestana={pestana}
      edicion={edicion}
      onCerrar={() => setSeleccion(null)}
    />
  );

  return (
    <div>

      <p className="text-center text-sm italic text-stone-500 mb-8">
        {edicion
          ? 'Pulsa en una sección para añadir o quitar componentes.'
          : 'Pulsa en una sección para conocer a quienes la forman.'}
      </p>

      {/* ============= ESCRITORIO: plano del escenario ============= */}
      <div className="hidden md:block">
        <div className="relative w-full aspect-[1314/918] max-w-5xl mx-auto">

          {/* Arcos de la formación (cuerda dentro, viento fuera) y borde de la tarima */}
          <svg viewBox="0 0 1000 699" className="absolute inset-0 w-full h-full text-red-900/25" fill="none" aria-hidden="true">
            <path d="M285 643 A215 215 0 0 1 715 643" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
            <path d="M115 643 A385 385 0 0 1 885 643" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
            <path d="M20 690 H980" stroke="currentColor" strokeWidth="1" />
          </svg>

          {SECCIONES.map((s) => (
            <div
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%` }}
            >
              {pieza(s, true)}
            </div>
          ))}
        </div>

        <Leyenda />

        {seccionActiva && programa(seccionActiva, seccionActiva.x)}
      </div>

      {/* ============= MÓVIL: filas del fondo hacia delante ============= */}
      <div className="md:hidden space-y-8">
        {FILAS_MOVIL.map((fila, i) => {
          const secciones = fila.map((id) => SECCIONES.find((s) => s.id === id)!);
          const activaAqui = secciones.find((s) => s.id === seleccion);
          return (
            <section key={ETIQUETA_FILA[i]}>
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px w-8 bg-red-800/40" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-red-800/80 font-medium">{ETIQUETA_FILA[i]}</span>
                <div className="h-px flex-1 bg-stone-300" />
              </div>
              <div className={`grid gap-2 ${secciones.length === 1 ? 'grid-cols-1 max-w-[60%] mx-auto' : 'grid-cols-2'}`}>
                {secciones.map((s) => pieza(s, false))}
              </div>
              {activaAqui && programa(activaAqui)}
            </section>
          );
        })}
      </div>

    </div>
  );
}

// ============= PIEZA DE SECCIÓN =============

function PiezaSeccion({
  seccion,
  miembros,
  activa,
  atenuada,
  enPlano,
  onClick,
}: {
  seccion: Seccion;
  miembros: Componente[];
  activa: boolean;
  atenuada: boolean;
  enPlano: boolean;
  onClick: () => void;
}) {
  const estilo = esGranate(seccion) ? GRANATE : ORQUESTA;
  const grande = seccion.grupo === 'Voces' && enPlano;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      aria-label={`${seccion.nombre}: ${miembros.length} ${miembros.length === 1 ? 'componente' : 'componentes'}`}
      className={`group relative w-full overflow-hidden rounded-sm text-center transition-all duration-500 ${estilo.pieza} ${
        grande ? 'px-4 py-3' : 'px-2 py-2.5'
      } ${activa ? 'scale-[1.06] z-10 ring-2 ring-red-800 ring-offset-2 ring-offset-stone-50 shadow-xl shadow-red-900/25' : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-900/15'} ${
        atenuada ? 'opacity-30 saturate-50 hover:opacity-70' : ''
      }`}
    >
      {/* Banda granate de las tarjetas de la casa (toda la orquesta) */}
      {!esGranate(seccion) && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
      )}

      {/* Icono del instrumento + nombre con el subrayado que crece del menú principal */}
      <span className={`inline-flex items-center gap-1.5 font-medium uppercase transition-colors duration-300 ${estilo.hoverTexto} ${grande ? 'text-xs tracking-[0.35em]' : 'text-[10px] tracking-[0.2em]'}`}>
        <IconoSeccion seccionId={seccion.id} className={`flex-shrink-0 ${grande ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${esGranate(seccion) ? 'opacity-90' : 'text-red-800'}`} />
        <span className="relative">
          {seccion.grupo === 'Dirección' ? 'Director' : seccion.nombre}
          <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${estilo.linea} ${activa ? 'w-full' : 'w-0 group-hover:w-full group-focus-visible:w-full'}`} />
        </span>
      </span>

      {/* Un punto por componente; se encienden en cascada al activar la sección */}
      <span className="flex flex-wrap justify-center gap-1.5 mt-2.5 min-h-2">
        {miembros.map((m, i) => (
          <span
            key={m.id}
            title={m.nombre}
            style={{ transitionDelay: activa ? `${i * 70}ms` : '0ms' }}
            className={`block w-2 h-2 rounded-full transition-all duration-300 ${estilo.punto} ${
              activa ? `opacity-100 scale-125 ${estilo.brillo}` : 'opacity-60 group-hover:opacity-90'
            }`}
          />
        ))}
        {miembros.length === 0 && <span className="text-[10px] opacity-50">—</span>}
      </span>
    </button>
  );
}

// ============= PROGRAMA DE MANO =============

function ProgramaDeMano({
  seccion,
  miembros,
  pestana,
  edicion,
  onCerrar,
}: {
  seccion: Seccion;
  miembros: Componente[];
  pestana?: number;   // % horizontal de la sección, para apuntar hacia ella
  edicion?: Edicion;
  onCerrar: () => void;
}) {
  const esDireccion = seccion.grupo === 'Dirección';
  const [nuevo, setNuevo] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Al aparecer, se asegura de quedar a la vista sin saltos bruscos.
  const alAparecer = useCallback((el: HTMLDivElement | null) => {
    if (!el || el.offsetParent === null) return;   // la copia oculta (móvil/escritorio) no desplaza
    const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'nearest' });
  }, []);

  const anadir = (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = nuevo.trim();
    if (!nombre) return setError('Escribe el nombre completo.');
    if (miembros.some((m) => m.nombre.toLowerCase() === nombre.toLowerCase())) {
      return setError('Ya está en esta sección.');
    }
    edicion?.onAnadir(seccion, nombre);
    setNuevo('');
    setError(null);
  };

  return (
    <div ref={alAparecer} className="relative mt-6 md:mt-10 animate-[fadeIn_0.4s_ease-out]">

      {/* Pestaña que apunta a la sección en el plano */}
      {pestana !== undefined && (
        <span
          className="absolute -top-2 w-4 h-4 rotate-45 bg-white border-t border-l border-stone-200 -translate-x-1/2"
          style={{ left: `${pestana}%` }}
        />
      )}

      <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm shadow-xl shadow-red-900/10 px-6 py-8 md:px-12 md:py-10">

        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
        <div className="absolute top-3 right-12 w-4 h-4 border-t border-r border-red-800/20 pointer-events-none" />

        <button
          type="button"
          onClick={onCerrar}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-stone-400 hover:text-red-800 transition-colors rounded-sm"
          aria-label="Cerrar"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Cabecera del programa */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-10 bg-red-800/60" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-red-800 font-medium">
              {seccion.grupo === 'Voces' ? 'Coro' : seccion.grupo}
            </span>
            <div className="h-px w-10 bg-red-800/60" />
          </div>
          <h3 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-tight first-letter:text-[1.3em] first-letter:leading-none first-letter:font-medium first-letter:text-red-900">
            {seccion.nombre}
          </h3>
          <p className="font-serif italic text-stone-500 mt-2">
            {miembros.length} {miembros.length === 1 ? 'componente' : 'componentes'}
          </p>
          <div className="flex justify-center mt-5 mb-8">
            <svg width="80" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* Nombres, entrando uno a uno */}
        {miembros.length === 0 ? (
          <p className="text-center font-serif italic text-lg text-stone-500">
            {edicion ? 'Aún no hay nadie en esta sección.' : 'Pronto presentaremos a quienes forman esta sección.'}
          </p>
        ) : (
          <ul className={`grid gap-x-10 gap-y-3 ${miembros.length > 4 ? 'sm:grid-cols-2 lg:grid-cols-3' : miembros.length > 1 ? 'sm:grid-cols-2' : ''} ${miembros.length === 1 ? 'justify-items-center' : ''}`}>
            {miembros.map((m, i) => (
              <li
                key={m.id}
                style={{ animationDelay: `${i * 70}ms` }}
                className="group/nombre flex items-center gap-3 font-serif text-lg md:text-xl text-stone-800 animate-[fadeIn_0.5s_ease-out_both]"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" className="flex-shrink-0 text-red-800/70" aria-hidden="true">
                  <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" />
                </svg>
                <span className="min-w-0">{m.nombre}</span>
                {edicion && (
                  <button
                    type="button"
                    onClick={() => edicion.onEliminar(m)}
                    className="ml-auto flex-shrink-0 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-800 hover:bg-red-50/60 rounded-sm transition-colors"
                    aria-label={`Quitar a ${m.nombre}`}
                    title="Quitar"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* AÑADIR (solo en el panel del director) */}
        {edicion && (
          <form onSubmit={anadir} noValidate className="mt-8 pt-6 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={nuevo}
                onChange={(e) => { setNuevo(e.target.value); setError(null); }}
                placeholder={`Nombre completo en ${seccion.nombre}...`}
                aria-label={`Nombre del nuevo componente de ${seccion.nombre}`}
                className="flex-1 bg-white/70 border border-stone-300 rounded-full py-3 px-6 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
              />
              <button
                type="submit"
                className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-3 text-xs tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-full"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Plus size={16} strokeWidth={1.5} />
                  Añadir
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
            {error && <p className="mt-3 ml-6 text-xs text-red-800">{error}</p>}
          </form>
        )}

        {esDireccion && !edicion && (
          <div className="text-center mt-8">
            <Link
              href="/sobre-nosotros/director"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium text-stone-500 hover:text-red-800 transition-colors"
            >
              Conoce al director
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ============= LEYENDA =============

function Leyenda() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs text-stone-500">
      <span className="flex items-center gap-2">
        <span className={`w-4 h-3 rounded-[2px] ${GRANATE.pieza}`} />
        Coro y dirección
      </span>
      <span className="flex items-center gap-2">
        <span className={`relative w-4 h-3 rounded-[2px] overflow-hidden ${ORQUESTA.pieza}`}>
          <span className="absolute left-0 inset-y-0 w-[2px] bg-red-800" />
        </span>
        Orquesta
      </span>
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-800" />
        Un punto, un componente
      </span>
    </div>
  );
}
