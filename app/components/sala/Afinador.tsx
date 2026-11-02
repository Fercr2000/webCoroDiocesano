'use client';

// Afinador cromático con micrófono. Modo automático (la nota más cercana) o
// por cuerdas al aire de la cuerda de la orquesta, y transposición para
// instrumentos en Si♭, Fa y Mi♭. Precisión por debajo del cent con buena
// señal (detector YIN; ver lib/sala/detectorTono.ts).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { analizarFrecuencia, centsEntre, frecuencia, nombreNota, notaConOctava } from '@/lib/sala/notas';
import type { Tono } from '@/lib/sala/detectorTono';
import { obtenerAudio } from './audio/motor';
import { tocarTono, type TonoSostenido } from './audio/tono';
import { useDetectorTono, Suavizador } from './useDetectorTono';
import { useLa } from './referencia';
import { formatoHz } from './SelectorLa';
import Esfera from './Esfera';
import AvisoMicro, { NOTA_PRIVACIDAD } from './AvisoMicro';
import { Chip } from './Metronomo';

const MODOS = [
  { valor: 'auto', nombre: 'Cromático', cuerdas: [] as number[] },
  { valor: 'violin', nombre: 'Violín', cuerdas: [55, 62, 69, 76] },
  { valor: 'viola', nombre: 'Viola', cuerdas: [48, 55, 62, 69] },
  { valor: 'violonchelo', nombre: 'Violonchelo', cuerdas: [36, 43, 50, 57] },
  { valor: 'contrabajo', nombre: 'Contrabajo', cuerdas: [28, 33, 38, 43] },
];

// Semitonos que se suman al sonido real para leer la nota escrita.
const TRANSPOSICIONES = [
  { valor: 0, nombre: 'Do', pista: 'Afinación de concierto' },
  { valor: 2, nombre: 'Si♭', pista: 'Clarinete, trompeta' },
  { valor: 7, nombre: 'Fa', pista: 'Trompa, corno inglés' },
  { valor: 9, nombre: 'Mi♭', pista: 'Saxofón alto' },
];

const TOLERANCIA = 5; // ± cents para encender "afinado"

interface Lectura { hz: number; midi: number; cents: number }

export default function Afinador() {
  const la = useLa();
  const [modo, setModo] = useState('auto');
  const [transposicion, setTransposicion] = useState(0);
  const [lectura, setLectura] = useState<Lectura | null>(null);
  const [nivel, setNivel] = useState(0);
  const [cuerdaSonando, setCuerdaSonando] = useState<number | null>(null);

  const suavizador = useRef(new Suavizador(5, 0.35));
  const silencio = useRef(0);
  const referencia = useRef<TonoSostenido | null>(null);
  const cuerdas = useMemo(() => MODOS.find((m) => m.valor === modo)?.cuerdas ?? [], [modo]);

  // La cuerda de referencia sigue a la La y se calla al salir de la página.
  useEffect(() => {
    if (cuerdaSonando !== null) referencia.current?.cambiarFrecuencia(frecuencia(cuerdaSonando, la));
  }, [la, cuerdaSonando]);
  useEffect(() => () => referencia.current?.detener(), []);

  const alLeer = useCallback((tono: Tono | null) => {
    setNivel((n) => n * 0.6 + Math.min(1, (tono?.volumen ?? 0) * 6) * 0.4);
    if (!tono || tono.claridad < 0.75) {
      // Se mantiene la última lectura un momento para poder leerla con calma.
      if (++silencio.current > 20) {
        setLectura(null);
        suavizador.current.reiniciar();
      }
      return;
    }
    silencio.current = 0;
    const previa = suavizador.current;
    let hz = previa.agregar(tono.hz);
    // Si cambia de nota, se responde al momento en lugar de arrastrar la anterior.
    if (Math.abs(centsEntre(tono.hz, hz)) > 60) {
      previa.reiniciar();
      hz = previa.agregar(tono.hz);
    }

    if (cuerdas.length) {
      // Cuerda al aire más cercana y desviación respecto a ella.
      const cuerda = cuerdas.reduce((mejor, c) => (Math.abs(centsEntre(hz, frecuencia(c, la))) < Math.abs(centsEntre(hz, frecuencia(mejor, la))) ? c : mejor), cuerdas[0]);
      setLectura({ hz, midi: cuerda, cents: centsEntre(hz, frecuencia(cuerda, la)) });
    } else {
      const { midi, cents } = analizarFrecuencia(hz, la);
      setLectura({ hz, midi, cents });
    }
  }, [cuerdas, la]);

  const minHz = modo === 'contrabajo' || modo === 'auto' ? 38 : 60;
  const { estado, iniciar, detener } = useDetectorTono({ minHz, maxHz: 2400, muestras: minHz < 50 ? 8192 : 4096 }, alLeer);
  const escuchando = estado === 'escuchando';

  // Nota de referencia de una cuerda (se para al pulsarla de nuevo).
  const tocarCuerda = (midi: number) => {
    referencia.current?.detener();
    referencia.current = null;
    if (cuerdaSonando === midi) {
      setCuerdaSonando(null);
      return;
    }
    const { ctx, salida } = obtenerAudio();
    referencia.current = tocarTono(ctx, salida, frecuencia(midi, la), 'cuerda', 0.5);
    setCuerdaSonando(midi);
  };

  const escrita = lectura ? nombreNota(lectura.midi + transposicion) : null;
  const afinado = lectura !== null && Math.abs(lectura.cents) <= TOLERANCIA;
  const centsMostrados = lectura ? Math.round(lectura.cents) : null;

  return (
    <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-6 lg:gap-8">

      {/* ============= ESFERA ============= */}
      <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm px-5 py-8 sm:px-10 shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />

        <div className="max-w-md mx-auto">
          <Esfera cents={lectura?.cents ?? null} rango={50} tolerancia={TOLERANCIA} className="text-stone-900" />
        </div>

        {/* Nota */}
        <div className="text-center -mt-2" aria-live="polite">
          {escrita ? (
            <>
              <p className="leading-none">
                <span className="font-serif text-8xl text-red-800">{escrita.nombre.charAt(0)}</span>
                <span className="font-serif text-6xl text-stone-900">{escrita.nombre.slice(1)}</span>
                <span className="font-serif text-3xl text-stone-500 ml-1">{escrita.octava}</span>
              </p>
              <p className="text-sm text-stone-500 mt-2 min-h-[1.25rem]">
                {escrita.alternativo && <span className="mr-3">o {escrita.alternativo}</span>}
                {transposicion !== 0 && lectura && <span>suena {notaConOctava(lectura.midi, true)}</span>}
                {cuerdas.length > 0 && lectura && <span>cuerda de {notaConOctava(lectura.midi)}</span>}
              </p>
            </>
          ) : (
            <p className="font-serif italic text-3xl text-stone-400 py-6">{escuchando ? 'Toca o canta una nota' : 'Afinador en reposo'}</p>
          )}
        </div>

        {/* Lecturas */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-stone-200 text-center">
          <Dato titulo="Frecuencia" valor={lectura ? `${formatoHz(lectura.hz, 1)} Hz` : '—'} />
          <Dato titulo="Desviación" valor={centsMostrados !== null ? `${centsMostrados > 0 ? '+' : centsMostrados < 0 ? '−' : ''}${Math.abs(centsMostrados)} cents` : '—'} />
          <Dato
            titulo="Indicación"
            valor={!lectura ? '—' : afinado ? 'Afinado' : lectura.cents < 0 ? 'Sube' : 'Baja'}
            destacado={afinado}
          />
        </div>

        {/* Nivel de entrada */}
        <div className="mt-6 h-1 bg-stone-200 rounded-full overflow-hidden" aria-hidden="true">
          <div className="h-full bg-gradient-to-r from-red-800 to-red-600 transition-[width] duration-100" style={{ width: `${escuchando ? Math.round(nivel * 100) : 0}%` }} />
        </div>
      </div>

      {/* ============= CONTROLES ============= */}
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => (escuchando ? detener() : iniciar())}
          className="group relative overflow-hidden w-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-6 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {escuchando ? <Square size={14} fill="currentColor" /> : <Mic size={17} strokeWidth={1.5} />}
            {escuchando ? 'Dejar de escuchar' : 'Empezar a escuchar'}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
        <AvisoMicro estado={estado} />

        <Panel titulo="Instrumento">
          <div className="flex flex-wrap gap-2">
            {MODOS.map((m) => <Chip key={m.valor} activo={modo === m.valor} onClick={() => { setModo(m.valor); suavizador.current.reiniciar(); referencia.current?.detener(); setCuerdaSonando(null); }}>{m.nombre}</Chip>)}
          </div>
          {cuerdas.length > 0 && (
            <div className="mt-5">
              <p className="text-xs text-stone-500 mb-3">Cuerdas al aire · pulsa una para oírla</p>
              <div className="grid grid-cols-4 gap-2">
                {cuerdas.map((c) => {
                  const detectada = lectura?.midi === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => tocarCuerda(c)}
                      aria-pressed={cuerdaSonando === c}
                      className={`relative py-3 rounded-sm border text-center transition-all ${
                        cuerdaSonando === c ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 border-transparent' :
                        detectada ? 'border-red-800 text-red-800 bg-red-50/70' : 'border-stone-300 text-stone-700 hover:border-red-800/60'
                      }`}
                    >
                      <span className="font-serif text-lg">{notaConOctava(c)}</span>
                      {cuerdaSonando === c && <Volume2 size={12} className="absolute top-1.5 right-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Panel>

        <Panel titulo="Transposición">
          <div className="flex flex-wrap gap-2">
            {TRANSPOSICIONES.map((t) => <Chip key={t.valor} activo={transposicion === t.valor} onClick={() => setTransposicion(t.valor)}>{t.nombre}</Chip>)}
          </div>
          <p className="text-xs text-stone-500 mt-3">{TRANSPOSICIONES.find((t) => t.valor === transposicion)?.pista}</p>
        </Panel>

        <p className="text-xs text-stone-500 leading-relaxed">
          Afinado = ±{TOLERANCIA} cents (un cent es la centésima parte de un semitono). La referencia se cambia en la barra inferior. {NOTA_PRIVACIDAD}
        </p>
      </div>
    </div>
  );
}

function Dato({ titulo, valor, destacado = false }: { titulo: string; valor: string; destacado?: boolean }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-stone-500 mb-1">{titulo}</p>
      <p className={`font-serif text-lg sm:text-xl tabular-nums transition-colors ${destacado ? 'text-red-800' : 'text-stone-900'}`}>{valor}</p>
    </div>
  );
}

function Panel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm p-5 shadow-sm">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60" />
      <p className="text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-3">{titulo}</p>
      {children}
    </div>
  );
}
