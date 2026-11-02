'use client';

// Metrónomo completo: péndulo de Maelzel dibujado a línea sobre el panel
// granate (oscila al compás del reloj de audio), tempo con su término
// italiano, compases simples y compuestos, subdivisiones, acentos por pulso,
// marcar el pulso tocando y atajos de teclado.

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Minus, Plus, Play, Square, Hand } from 'lucide-react';
import { COMPASES, SUBDIVISIONES, TEMPOS, BPM_MIN, BPM_MAX, terminoTempo } from '@/lib/sala/tempo';
import { metronomo, SONIDOS_METRONOMO } from './audio/metronomo';
import PulsosMetronomo from './PulsosMetronomo';

// Valores de referencia al pulsar un término de tempo.
const TEMPOS_RAPIDOS: Record<string, number> = { Largo: 50, Adagio: 70, Andante: 92, Moderato: 112, Allegro: 132, Presto: 184 };

export default function Metronomo() {
  const estado = useSyncExternalStore(metronomo.suscribir, metronomo.leer, metronomo.leer);
  const compas = COMPASES.find((c) => c.etiqueta === estado.compas) ?? COMPASES[3];
  const subdivisiones = compas.compuesto ? SUBDIVISIONES.compuesto : SUBDIVISIONES.simple;

  // ---- Atajos de teclado ----
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.ctrlKey || e.metaKey || e.altKey || el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      const { bpm } = metronomo.leer();
      const salto = e.shiftKey ? 10 : 1;
      if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) metronomo.alternar(); }
      else if (e.code === 'ArrowUp' || e.code === 'ArrowRight') { e.preventDefault(); metronomo.cambiarBpm(bpm + salto); }
      else if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') { e.preventDefault(); metronomo.cambiarBpm(bpm - salto); }
      else if (e.code === 'KeyT' && !e.repeat) metronomo.marcarToque();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  return (
    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-6 lg:gap-8 items-stretch">

      {/* ============= PANEL GRANATE CON EL PÉNDULO ============= */}
      <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 px-6 py-8 sm:p-10 flex flex-col items-center shadow-xl shadow-red-950/20">
        <div className="capa-grano" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_20%,rgba(255,255,255,0.10),transparent_70%)] pointer-events-none" />
        <div className="absolute top-5 left-5 w-6 h-6 border-t border-l border-stone-50/25" />
        <div className="absolute bottom-5 right-5 w-6 h-6 border-b border-r border-stone-50/25" />

        <Pendulo bpm={estado.bpm} sonando={estado.sonando} />

        <div className="relative z-10 mt-6 w-full">
          <PulsosClaros />
        </div>
      </div>

      {/* ============= CONTROLES ============= */}
      <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm px-6 py-8 sm:px-10 shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />

        {/* Tempo */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <BotonRedondo etiqueta="Bajar tempo" onClick={() => metronomo.cambiarBpm(estado.bpm - 1)}><Minus size={20} strokeWidth={1.5} /></BotonRedondo>
          <div className="text-center min-w-[9rem]">
            <p className="font-serif text-8xl leading-none text-stone-900 tabular-nums">{estado.bpm}</p>
            <p className="mt-2 text-[10px] tracking-[0.35em] uppercase text-stone-500">pulsos por minuto</p>
          </div>
          <BotonRedondo etiqueta="Subir tempo" onClick={() => metronomo.cambiarBpm(estado.bpm + 1)}><Plus size={20} strokeWidth={1.5} /></BotonRedondo>
        </div>
        <p className="font-serif italic text-3xl text-red-800 text-center mt-3">{terminoTempo(estado.bpm)}</p>

        <input
          type="range"
          min={BPM_MIN}
          max={BPM_MAX}
          value={estado.bpm}
          onChange={(e) => metronomo.cambiarBpm(Number(e.target.value))}
          aria-label="Tempo"
          className="w-full mt-6 accent-red-800"
        />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
          {TEMPOS.filter((t) => TEMPOS_RAPIDOS[t.nombre]).map((t) => (
            <button key={t.nombre} type="button" onClick={() => metronomo.cambiarBpm(TEMPOS_RAPIDOS[t.nombre])}
              className={`font-serif italic text-sm transition-colors ${terminoTempo(estado.bpm) === t.nombre ? 'text-red-800' : 'text-stone-500 hover:text-red-800'}`}>
              {t.nombre}
            </button>
          ))}
        </div>

        {/* Marcha y toque */}
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => metronomo.alternar()}
            aria-pressed={estado.sonando}
            className="group relative overflow-hidden flex-1 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-6 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm flex items-center justify-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-3">
              {estado.sonando ? <Square size={14} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {estado.sonando ? 'Parar' : 'Empezar'}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          <button
            type="button"
            onClick={() => metronomo.marcarToque()}
            className="flex items-center gap-2 px-5 border border-stone-300 hover:border-red-800 text-stone-700 hover:text-red-800 text-xs tracking-[0.2em] uppercase rounded-sm transition-colors active:bg-red-50"
            title="Pulsa al ritmo que quieras (tecla T)"
          >
            <Hand size={16} strokeWidth={1.5} />
            Marcar
          </button>
        </div>

        {/* Compás, subdivisión, sonido y volumen */}
        <Grupo titulo="Compás">
          {COMPASES.map((c) => (
            <Chip key={c.etiqueta} activo={estado.compas === c.etiqueta} onClick={() => metronomo.cambiarCompas(c.etiqueta)}>
              {c.etiqueta === '1' ? 'Sin compás' : c.etiqueta}
            </Chip>
          ))}
        </Grupo>

        <Grupo titulo="Subdivisión">
          {subdivisiones.map((s) => (
            <Chip key={s.valor} activo={estado.subdivision === s.valor} onClick={() => metronomo.cambiarSubdivision(s.valor)}>{s.nombre}</Chip>
          ))}
        </Grupo>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <Grupo titulo="Sonido" sinMargen>
            {SONIDOS_METRONOMO.map((s) => (
              <Chip key={s.valor} activo={estado.sonido === s.valor} onClick={() => metronomo.cambiarSonido(s.valor)}>{s.nombre}</Chip>
            ))}
          </Grupo>
          <label className="block">
            <span className="block text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-3">Volumen</span>
            <input type="range" min={0} max={1} step={0.01} value={estado.volumen} onChange={(e) => metronomo.cambiarVolumen(Number(e.target.value))} className="w-full accent-red-800" />
          </label>
        </div>

        <p className="mt-8 pt-5 border-t border-stone-200 text-xs text-stone-500 leading-relaxed">
          <kbd className="font-sans text-stone-700">Espacio</kbd> empezar o parar · <kbd className="font-sans text-stone-700">↑ ↓</kbd> tempo (con Mayús, de 10 en 10) · <kbd className="font-sans text-stone-700">T</kbd> marcar el pulso.
          Pulsa los rombos para acentuar o silenciar un pulso. Sigue sonando si cambias de herramienta.
        </p>
      </div>
    </div>
  );
}

// ---- Péndulo de Maelzel ----
// La pesa sube al bajar el tempo (como en el metrónomo de verdad) y el péndulo
// llega a cada extremo justo cuando suena el golpe.
function Pendulo({ bpm, sonando }: { bpm: number; sonando: boolean }) {
  const varilla = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = varilla.current;
    if (!g) return;
    if (!sonando) {
      g.style.transform = 'rotate(0deg)';
      return;
    }
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const pintar = () => {
      const pos = metronomo.posicion();
      const angulo = pos && !reducido ? 26 * Math.cos(Math.PI * (pos.n + pos.fase)) : 0;
      g.style.transform = `rotate(${angulo}deg)`;
      frame = requestAnimationFrame(pintar);
    };
    frame = requestAnimationFrame(pintar);
    return () => cancelAnimationFrame(frame);
  }, [sonando]);

  const proporcion = Math.min(1, Math.max(0, (bpm - 40) / 168)); // 40 → arriba, 208 → abajo
  const pesaY = 70 + proporcion * 90;

  return (
    <svg viewBox="0 0 240 320" className="relative z-10 w-full max-w-[17rem]" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Caja piramidal */}
      <path d="M98 20 h44 l46 268 h-136 z" strokeWidth="1.4" className="text-stone-50/80" />
      <path d="M44 288 h152 v14 h-152 z" strokeWidth="1.4" className="text-stone-50/80" />
      {/* Escala graduada */}
      {Array.from({ length: 13 }, (_, i) => 66 + i * 14).map((y, i) => (
        <line key={y} x1={i % 2 ? 114 : 110} y1={y} x2={i % 2 ? 126 : 130} y2={y} strokeWidth="0.8" className="text-stone-50/35" />
      ))}
      {/* Varilla y pesa: giran sobre el eje inferior */}
      <g ref={varilla} style={{ transformOrigin: '120px 252px', transformBox: 'view-box' }}>
        <line x1="120" y1="252" x2="120" y2="38" strokeWidth="2" className="text-stone-50" />
        <path d={`M108 ${pesaY} h24 l-4 22 h-16 z`} fill="currentColor" strokeWidth="1" className="text-stone-50" />
      </g>
      <circle cx="120" cy="252" r="5" fill="currentColor" className="text-stone-50" stroke="none" />
      {/* Ventana de la base */}
      <path d="M88 262 h64" strokeWidth="0.8" className="text-stone-50/40" />
    </svg>
  );
}

// Pulsos sobre el panel granate: mismos rombos, en claro.
function PulsosClaros() {
  return (
    <div className="[&_[data-pulso]]:border-stone-50/80 [&_[data-pulso][data-activo=si]]:!bg-stone-50 [&_[data-pulso][data-activo=si]]:!border-stone-50 [&_[data-pulso][data-activo=si]]:!shadow-[0_0_16px_rgba(255,255,255,0.7)]">
      <PulsosMetronomo editable />
      <p className="mt-3 text-center text-[10px] tracking-[0.3em] uppercase text-stone-200/60">Pulsa un rombo para cambiar su acento</p>
    </div>
  );
}

function BotonRedondo({ etiqueta, onClick, children }: { etiqueta: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={etiqueta} className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:text-red-800 hover:border-red-800/60 active:bg-red-50 transition-colors">
      {children}
    </button>
  );
}

function Grupo({ titulo, children, sinMargen = false }: { titulo: string; children: React.ReactNode; sinMargen?: boolean }) {
  return (
    <div className={sinMargen ? '' : 'mt-7'}>
      <p className="text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-3">{titulo}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`px-4 py-1.5 text-sm rounded-full border transition-all duration-200 ${
        activo ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 border-transparent shadow-md shadow-red-900/25' : 'border-stone-300 text-stone-600 hover:border-red-800/60 hover:text-red-800'
      }`}
    >
      {children}
    </button>
  );
}
