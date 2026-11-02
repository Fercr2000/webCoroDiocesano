'use client';

// Piano de la Sala de ensayo: se toca con el ratón o con los dedos (varias
// teclas a la vez y glissando al arrastrar). El sonido se genera por código y
// se afina con la La de referencia. Muestra la nota, su frecuencia y el
// nombre del intervalo o acorde que suena.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { esNegra, frecuencia, nombreNota, notaConOctava } from '@/lib/sala/notas';
import { describirNotas } from '@/lib/sala/acordes';
import { obtenerAudio } from './audio/motor';
import { Piano as Sintetizador } from './audio/piano';
import { useLa } from './referencia';
import { formatoHz } from './SelectorLa';
import { usePantalla } from './usePantalla';

const OCTAVA_MIN = 2;
const OCTAVA_MAX = 6;
const doDe = (octava: number) => 12 * (octava + 1); // Do4 = 60

export default function Piano() {
  const la = useLa();
  const pantalla = usePantalla();
  const [octava, setOctava] = useState(4);
  const [pulsadas, setPulsadas] = useState<Set<number>>(new Set());
  const [ultima, setUltima] = useState<number | null>(null);
  const [volumen, setVolumen] = useState(0.8);

  const sinte = useRef<Sintetizador | null>(null);
  const fuentes = useRef(new Map<number, number>()); // puntero (ratón o dedo) → nota
  const laActual = useRef(la);
  useEffect(() => { laActual.current = la; });

  const piano = useCallback(() => {
    if (!sinte.current) {
      const { ctx, salida } = obtenerAudio();
      sinte.current = new Sintetizador(ctx, salida);
    } else {
      obtenerAudio();
    }
    return sinte.current;
  }, []);

  useEffect(() => { if (sinte.current) sinte.current.volumen = volumen; }, [volumen]);
  useEffect(() => () => sinte.current?.desconectar(), []);

  const refrescar = () => setPulsadas(new Set(fuentes.current.values()));

  const pulsar = useCallback((fuente: number, midi: number, fuerza = 0.75) => {
    if (midi < 21 || midi > 108) return;
    const p = piano();
    p.volumen = volumen;
    p.tocar(midi, laActual.current, fuerza);
    fuentes.current.set(fuente, midi);
    setUltima(midi);
    refrescar();
  }, [piano, volumen]);

  const soltar = useCallback((fuente: number) => {
    const midi = fuentes.current.get(fuente);
    if (midi === undefined) return;
    fuentes.current.delete(fuente);
    // Si otro dedo sigue en la misma nota, no se apaga.
    if (![...fuentes.current.values()].includes(midi)) sinte.current?.soltar(midi);
    refrescar();
  }, []);

  const soltarTodo = useCallback(() => {
    for (const fuente of [...fuentes.current.keys()]) soltar(fuente);
  }, [soltar]);

  // Si la ventana pierde el foco, nada se queda colgado sonando.
  useEffect(() => {
    window.addEventListener('blur', soltarTodo);
    return () => window.removeEventListener('blur', soltarTodo);
  }, [soltarTodo]);

  // ---- Ratón y pantalla táctil (varios dedos y glissando) ----
  const notaEn = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-midi]');
    return el ? Number(el.dataset.midi) : null;
  };
  const fuerzaEn = (e: React.PointerEvent, midi: number) => {
    const el = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(`[data-midi="${midi}"]`);
    if (!el) return 0.75;
    const r = el.getBoundingClientRect();
    return 0.4 + 0.55 * Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)); // más abajo, más fuerte
  };
  const alPulsar = (e: React.PointerEvent) => {
    const midi = notaEn(e.clientX, e.clientY);
    if (midi === null) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pulsar(e.pointerId, midi, fuerzaEn(e, midi));
  };
  const alMover = (e: React.PointerEvent) => {
    const fuente = e.pointerId;
    const actual = fuentes.current.get(fuente);
    if (actual === undefined) return;
    const midi = notaEn(e.clientX, e.clientY);
    if (midi !== null && midi !== actual) {
      soltar(fuente);
      pulsar(fuente, midi, 0.6);
    }
  };
  const alSoltar = (e: React.PointerEvent) => soltar(e.pointerId);

  // ---- Rango visible ----
  const octavasVisibles = pantalla === 'movil' ? 1 : pantalla === 'tableta' ? 2 : 3;
  const [desde, hasta] = useMemo(() => {
    if (octavasVisibles === 3) return [doDe(octava - 1), doDe(octava + 2)];
    if (octavasVisibles === 2) return [doDe(octava), doDe(octava + 2)];
    return [doDe(octava), doDe(octava + 1) + 4];
  }, [octava, octavasVisibles]);

  const teclas = useMemo(() => Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i), [desde, hasta]);
  const blancas = teclas.filter((m) => !esNegra(m));
  const anchoBlanca = 100 / blancas.length;
  const sonando = [...pulsadas].sort((a, b) => a - b);
  const descripcion = describirNotas(sonando);
  const notaGrande = ultima !== null ? nombreNota(ultima) : null;

  return (
    <div className="space-y-6">

      {/* ============= ATRIL: nota, frecuencia e intervalo/acorde ============= */}
      <div className="relative grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm px-6 sm:px-10 py-6 shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />

        <div className="flex items-baseline gap-1 min-w-[9rem]" aria-live="polite">
          {notaGrande ? (
            <>
              <span className="font-serif text-6xl text-red-800 leading-none">{notaGrande.nombre.charAt(0)}</span>
              <span className="font-serif text-4xl text-stone-900 leading-none">{notaGrande.nombre.slice(1)}</span>
              <span className="font-serif text-2xl text-stone-500 leading-none ml-0.5">{notaGrande.octava}</span>
            </>
          ) : (
            <span className="font-serif italic text-2xl text-stone-400">Toca una tecla</span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-1">
            {sonando.length >= 2 ? (sonando.length === 2 ? 'Intervalo' : 'Acorde') : 'Frecuencia'}
          </p>
          <p className="font-serif italic text-2xl md:text-3xl text-stone-800 leading-tight min-h-[2.25rem]">
            {sonando.length >= 2
              ? descripcion || 'Sin nombre propio'
              : ultima !== null ? `${formatoHz(frecuencia(ultima, la), 2)} Hz` : '—'}
          </p>
          <p className="text-sm text-stone-500 mt-1 truncate min-h-[1.25rem]">
            {sonando.length >= 2 ? sonando.map((m) => notaConOctava(m)).join(' · ') : ultima !== null ? `Con La4 = ${formatoHz(la, la % 1 ? 1 : 0)} Hz` : ''}
          </p>
        </div>
      </div>

      {/* ============= CONTROLES ============= */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { soltarTodo(); setOctava((o) => Math.max(OCTAVA_MIN, o - 1)); }} disabled={octava <= OCTAVA_MIN}
            aria-label="Octava más grave" className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:text-red-800 hover:border-red-800/60 disabled:opacity-40 disabled:pointer-events-none transition-colors">
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="text-center min-w-[7rem]">
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500">Octava</p>
            <p className="font-serif text-lg text-stone-900 leading-tight tabular-nums">{notaConOctava(desde)} – {notaConOctava(hasta)}</p>
          </div>
          <button type="button" onClick={() => { soltarTodo(); setOctava((o) => Math.min(OCTAVA_MAX, o + 1)); }} disabled={octava >= OCTAVA_MAX}
            aria-label="Octava más aguda" className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:text-red-800 hover:border-red-800/60 disabled:opacity-40 disabled:pointer-events-none transition-colors">
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 ml-1">
            <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500">Volumen</span>
            <input type="range" min={0} max={1} step={0.01} value={volumen} onChange={(e) => setVolumen(Number(e.target.value))} className="w-24 accent-red-800" />
          </label>
        </div>
      </div>

      {/* ============= EL PIANO ============= */}
      <div className="rounded-md bg-gradient-to-b from-stone-900 via-stone-950 to-black p-2.5 sm:p-4 pt-0 sm:pt-0 shadow-2xl shadow-stone-900/30">
        {/* Tapa con el nombre de la casa */}
        <div className="flex items-center justify-center py-2.5 sm:py-3">
          <span className="font-serif text-[10px] sm:text-xs tracking-[0.5em] uppercase text-stone-400/80">Coro de la Diócesis de Jaén</span>
        </div>
        {/* Fieltro granate sobre las teclas, como en un piano de verdad */}
        <div className="h-2 sm:h-2.5 bg-gradient-to-b from-red-800 to-red-950 rounded-t-[2px]" />

        <div
          role="group"
          aria-label="Teclado de piano"
          onPointerDown={alPulsar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
          onContextMenu={(e) => e.preventDefault()}
          className="relative flex h-44 sm:h-56 lg:h-64 select-none touch-none"
        >
          {blancas.map((m) => {
            const activa = sonando.includes(m);
            const n = nombreNota(m);
            return (
              <div
                key={m}
                data-midi={m}
                className={`relative flex-1 border-r border-stone-300/80 last:border-r-0 rounded-b-[5px] flex flex-col items-center justify-end pb-3 gap-1.5 transition-[background,transform,box-shadow] duration-75 ${
                  activa
                    ? 'bg-gradient-to-b from-red-50 to-red-100 translate-y-[1px] shadow-[inset_0_-3px_0_rgba(153,27,27,0.55)]'
                    : 'bg-gradient-to-b from-stone-100 via-white to-stone-50 shadow-[inset_0_-4px_0_rgba(0,0,0,0.08)]'
                }`}
              >
                <span className={`text-[10px] sm:text-[11px] leading-none ${n.nombre === 'Do' ? 'text-red-800 font-medium' : 'text-stone-500'}`}>
                  {n.nombre}{n.nombre === 'Do' ? n.octava : ''}
                </span>
              </div>
            );
          })}

          {teclas.filter(esNegra).map((m) => {
            const indice = blancas.indexOf(m - 1);
            const activa = sonando.includes(m);
            const n = nombreNota(m);
            return (
              <div
                key={m}
                data-midi={m}
                style={{ left: `${(indice + 1) * anchoBlanca - anchoBlanca * 0.31}%`, width: `${anchoBlanca * 0.62}%` }}
                className={`absolute top-0 h-[62%] z-10 rounded-b-[4px] flex flex-col items-center justify-end pb-2 gap-1 transition-[background,transform] duration-75 ${
                  activa
                    ? 'bg-gradient-to-b from-red-800 to-red-950 translate-y-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                    : 'bg-gradient-to-b from-stone-700 via-stone-900 to-black shadow-[0_4px_6px_rgba(0,0,0,0.45),inset_0_-3px_0_rgba(255,255,255,0.08)]'
                }`}
              >
                <span className="text-[8px] sm:text-[9px] text-stone-300 leading-none">{n.nombre}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm text-stone-500">
        Toca varias teclas a la vez o arrastra para hacer glissando; cuanto más abajo pulses la tecla, más fuerte suena.
        {pantalla === 'movil' && ' Gira el móvil para ver más teclas.'}
      </p>
    </div>
  );
}
