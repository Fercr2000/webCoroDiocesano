'use client';

// "Afina tu voz": entrenamiento de afinación para cantores. Eliges cuerda y
// nivel; suena una nota modelo, se calla y la cantas. Una aguja te dice si
// subir o bajar y una gráfica muestra el camino de tu voz. La nota cuenta como
// afinada cuando la mantienes dentro de la tolerancia el tiempo que pide el
// nivel. Al final, un resumen con aciertos, desviación media y tendencia.
// El micrófono no escucha mientras suena la nota modelo.

import { useEffect, useRef, useState } from 'react';
import { Mic, RotateCcw, SkipForward, Volume2, X } from 'lucide-react';
import { centsEntre, frecuencia, nombreNota, notaConOctava } from '@/lib/sala/notas';
import { VOCES, NIVELES, NOTAS_POR_RONDA, generarRonda, rangoDe, type Voz, type Nivel } from '@/lib/sala/tesituras';
import type { Tono } from '@/lib/sala/detectorTono';
import { obtenerAudio } from './audio/motor';
import { tocarTono, TIMBRES, type Timbre, type TonoSostenido } from './audio/tono';
import { useDetectorTono } from './useDetectorTono';
import { useLa } from './referencia';
import Esfera from './Esfera';
import Pentagrama, { type Clave } from './Pentagrama';
import AvisoMicro, { NOTA_PRIVACIDAD } from './AvisoMicro';
import { Chip } from './Metronomo';

type Fase = 'configurar' | 'escucha' | 'canta' | 'resultado' | 'resumen';

interface Resultado {
  midi: number;
  acertada: boolean;
  media: number | null;   // desviación media en cents (null = no se oyó voz)
  octava: number;         // 0, o ±1 si se cantó en otra octava
}

interface Punto { t: number; cents: number }

const GRAFICA_SEGUNDOS = 4;
// La afinación se juzga con la media de la última media segunda: abarca más
// de dos ciclos de vibrato (≈ 5,5 por segundo), así el vibrato natural no saca
// la nota de la zona afinada y un error suelto del detector no la estropea.
const VENTANA = 450;
const CLAVES: Record<Voz, Clave> = { soprano: 'sol', contralto: 'sol', tenor: 'sol8', bajo: 'fa' };

const mediana = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];

export default function AfinaTuVoz() {
  const la = useLa();
  const [voz, setVoz] = useState<Voz | null>(null);
  const [nivel, setNivel] = useState<Nivel>('facil');
  const [mostrarNombre, setMostrarNombre] = useState(NIVELES.facil.mostrarNombre);
  const [timbre, setTimbre] = useState<Timbre>('organo');

  const [fase, setFase] = useState<Fase>('configurar');
  const [ronda, setRonda] = useState<{ notas: number[]; bemoles: boolean }>({ notas: [], bemoles: false });
  const [indice, setIndice] = useState(0);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [aguja, setAguja] = useState<{ cents: number | null; octava: number }>({ cents: null, octava: 0 });
  const [progreso, setProgreso] = useState(0); // 0 … 1 del tiempo que hay que sostener
  const [traza, setTraza] = useState<Punto[]>([]);
  const [restante, setRestante] = useState(1);

  const config = NIVELES[nivel];

  // Estado mutable de la máquina (lo leen el micrófono y los temporizadores).
  const m = useRef({
    fase: 'configurar' as Fase, nota: 0, inicioCanto: 0, inicioVoz: null as number | null,
    ultima: 0, ultimaVoz: 0, racha: 0, lecturas: [] as (Punto & { octava: number })[],
  });
  const vivos = useRef({ la, config, timbre, ronda, indice });
  useEffect(() => { vivos.current = { la, config, timbre, ronda, indice }; });
  const temporizadores = useRef<number[]>([]);
  const tono = useRef<TonoSostenido | null>(null);

  const limpiarTemporizadores = () => {
    temporizadores.current.forEach((t) => window.clearTimeout(t));
    temporizadores.current = [];
  };
  const despues = (ms: number, fn: () => void) => { temporizadores.current.push(window.setTimeout(fn, ms)); };
  const cambiarFase = (f: Fase) => { m.current.fase = f; setFase(f); };
  const callarModelo = () => { tono.current?.detener(0.15); tono.current = null; };

  // ---- Final de una nota ----
  function terminarNota(acertada: boolean) {
    const e = m.current;
    if (e.fase !== 'canta') return;
    limpiarTemporizadores();
    const { config: c, ronda: r, indice: i } = vivos.current;

    // Media de la parte estable: lo sostenido si se acertó; si no, todo menos el ataque.
    const desde = acertada ? performance.now() - c.sostener * 1000 : (e.inicioVoz ?? Infinity) + 300;
    const utiles = e.lecturas.filter((p) => p.t >= desde);
    const octavas = utiles.map((p) => p.octava);
    const octava = octavas.length ? octavas.sort((a, b) => a - b)[Math.floor(octavas.length / 2)] : 0;
    const enSuOctava = utiles.filter((p) => p.octava === octava);
    const media = enSuOctava.length ? enSuOctava.reduce((s, p) => s + p.cents, 0) / enSuOctava.length : null;

    setResultados((prev) => [...prev, { midi: r.notas[i], acertada, media, octava }]);
    cambiarFase('resultado');
    despues(1500, () => {
      if (i + 1 >= r.notas.length) cambiarFase('resumen');
      else {
        setIndice(i + 1);
        vivos.current.indice = i + 1;
        escuchar(r.notas[i + 1]);
      }
    });
  }

  // ---- Suena la nota modelo y, al callarse, empieza el turno del cantor ----
  function escuchar(nota: number) {
    limpiarTemporizadores();
    callarModelo();
    const { la: laActual, config: c, timbre: t } = vivos.current;
    m.current.nota = nota;
    cambiarFase('escucha');
    setAguja({ cents: null, octava: 0 });
    setProgreso(0);
    setTraza([]);
    setRestante(1);

    const { ctx, salida } = obtenerAudio();
    tono.current = tocarTono(ctx, salida, frecuencia(nota, laActual), t, 0.55);
    despues(c.duracion * 1000, callarModelo);
    despues(c.duracion * 1000 + 450, () => {
      const e = m.current;
      Object.assign(e, { inicioCanto: performance.now(), inicioVoz: null, ultima: 0, ultimaVoz: 0, racha: 0, lecturas: [] });
      cambiarFase('canta');
      despues(c.tiempoMax * 1000, () => terminarNota(false));
    });
  }

  // ---- Lecturas del micrófono ----
  // Sin useCallback: el detector guarda siempre la última versión.
  function alLeer(t: Tono | null) {
    const e = m.current;
    if (e.fase !== 'canta') return;
    const { la: laActual, config: c } = vivos.current;
    const ahora = performance.now();
    const dt = e.ultima ? Math.min(100, ahora - e.ultima) : 30;
    e.ultima = ahora;
    setRestante(Math.max(0, 1 - (ahora - e.inicioCanto) / (c.tiempoMax * 1000)));

    if (t && t.claridad >= 0.6) {
      const bruto = centsEntre(t.hz, frecuencia(e.nota, laActual));
      const octava = Math.round(bruto / 1200);
      e.inicioVoz ??= ahora;
      e.ultimaVoz = ahora;
      e.lecturas.push({ t: ahora, cents: bruto - octava * 1200, octava });

      // Media de la ventana reciente, en la octava más repetida y sin lecturas sueltas.
      const recientes = e.lecturas.filter((p) => ahora - p.t <= VENTANA);
      const octavaReciente = mediana(recientes.map((p) => p.octava));
      const enOctava = recientes.filter((p) => p.octava === octavaReciente).map((p) => p.cents);
      const centro = mediana(enOctava);
      const buenas = enOctava.filter((v) => Math.abs(v - centro) <= 60);
      const cents = buenas.reduce((suma, v) => suma + v, 0) / buenas.length;

      // Dentro: suma tiempo. Fuera: resta (el doble), sin borrar de golpe lo conseguido.
      const dentro = octavaReciente === 0 && Math.abs(cents) <= c.tolerancia;
      e.racha = dentro ? e.racha + dt : Math.max(0, e.racha - 2 * dt);

      setAguja({ cents, octava: octavaReciente });
      setTraza((prev) => [...prev.filter((p) => ahora - p.t < GRAFICA_SEGUNDOS * 1000), { t: ahora, cents: octavaReciente === 0 ? cents : Math.sign(cents || 1) * 999 }]);
      setProgreso(Math.min(1, e.racha / (c.sostener * 1000)));
      if (e.racha >= c.sostener * 1000) terminarNota(true);
    } else if (ahora - e.ultimaVoz > 300) {
      // Un respiro corto no rompe la racha; un silencio, sí.
      e.racha = 0;
      setProgreso(0);
      if (ahora - e.ultimaVoz > 600) setAguja((a) => (a.cents === null ? a : { cents: null, octava: 0 }));
    }
  }

  // Se busca la voz alrededor de la nota modelo (de octava y media abajo a octava
  // y media arriba): así el detector no se confunde de octava.
  const objetivo = ronda.notas.length ? frecuencia(ronda.notas[indice], la) : 440;
  const { estado: micro, iniciar, detener } = useDetectorTono(
    { minHz: Math.max(50, objetivo / 2.6), maxHz: Math.min(2400, objetivo * 2.6), muestras: 4096, umbral: 0.15 },
    alLeer,
  );

  // Al salir de la página: silencio y temporizadores fuera.
  useEffect(() => () => { limpiarTemporizadores(); callarModelo(); }, []);

  // ---- Acciones ----
  const empezar = async () => {
    if (!voz) return;
    if (!(await iniciar())) return;
    const nueva = generarRonda(voz, nivel);
    setRonda(nueva);
    vivos.current.ronda = nueva;
    setResultados([]);
    setIndice(0);
    vivos.current.indice = 0;
    escuchar(nueva.notas[0]);
  };

  // Si se deniega el micrófono, se vuelve a la configuración.
  useEffect(() => {
    if (micro === 'denegado' || micro === 'sin-micro' || micro === 'error') {
      limpiarTemporizadores();
      callarModelo();
      m.current.fase = 'configurar';
    }
  }, [micro]);
  const faseVisible: Fase = micro === 'denegado' || micro === 'sin-micro' || micro === 'error' ? 'configurar' : fase;

  const terminar = () => {
    limpiarTemporizadores();
    callarModelo();
    cambiarFase(resultados.length ? 'resumen' : 'configurar');
    if (!resultados.length) detener();
  };

  const volverAConfigurar = () => {
    limpiarTemporizadores();
    callarModelo();
    detener();
    cambiarFase('configurar');
  };

  const elegirNivel = (n: Nivel) => {
    setNivel(n);
    setMostrarNombre(NIVELES[n].mostrarNombre);
  };

  // ============= VISTAS =============

  if (faseVisible === 'configurar') {
    return (
      <Configurar
        voz={voz} setVoz={setVoz} nivel={nivel} elegirNivel={elegirNivel}
        mostrarNombre={mostrarNombre} setMostrarNombre={setMostrarNombre}
        timbre={timbre} setTimbre={setTimbre}
        empezar={empezar} micro={micro}
      />
    );
  }

  if (faseVisible === 'resumen') {
    return <Resumen resultados={resultados} bemoles={ronda.bemoles} otraRonda={empezar} cambiar={volverAConfigurar} nivel={nivel} voz={voz!} />;
  }

  const nota = ronda.notas[indice];
  const ultimo = resultados[resultados.length - 1];
  const nombre = nombreNota(nota, ronda.bemoles);

  return (
    <div className="space-y-6">
      {/* Progreso de la ronda */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-label={`Nota ${indice + 1} de ${ronda.notas.length}`}>
          {ronda.notas.map((_, i) => {
            const r = resultados[i];
            return (
              <span
                key={i}
                className={`block w-3 h-3 rotate-45 border-[1.5px] transition-colors ${
                  r ? (r.acertada ? 'bg-red-800 border-red-800' : 'border-stone-400 bg-stone-200') :
                  i === indice ? 'border-red-800 animate-pulse motion-reduce:animate-none' : 'border-stone-300'
                }`}
              />
            );
          })}
        </div>
        <p className="text-xs tracking-[0.25em] uppercase text-stone-500">
          {VOCES[voz!].nombre} · {config.nombre}
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-6 lg:gap-8">
        {/* ============= ESCENA PRINCIPAL ============= */}
        <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm px-5 py-8 sm:px-10 shadow-sm overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />

          {/* Estado */}
          <div className="text-center min-h-[2rem]" aria-live="polite">
            {fase === 'escucha' && (
              <p className="flex items-center justify-center gap-3 text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
                <Volume2 size={16} strokeWidth={1.5} className="animate-pulse motion-reduce:animate-none" /> Escucha
              </p>
            )}
            {fase === 'canta' && (
              <p className="flex items-center justify-center gap-3 text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
                <Mic size={16} strokeWidth={1.5} /> Tu turno: cántala
              </p>
            )}
            {fase === 'resultado' && ultimo && (
              <p className={`font-serif italic text-2xl animate-[fadeIn_0.3s_ease-out] ${ultimo.acertada ? 'text-red-800' : 'text-stone-600'}`}>
                {mensajeNota(ultimo)}
              </p>
            )}
          </div>

          {/* Nota objetivo: nombre y pentagrama */}
          {mostrarNombre || fase === 'resultado' ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 mt-2">
              <p className="leading-none">
                <span className="font-serif text-6xl sm:text-7xl text-red-800">{nombre.nombre.charAt(0)}</span>
                <span className="font-serif text-4xl sm:text-5xl text-stone-900">{nombre.nombre.slice(1)}</span>
                <span className="font-serif text-2xl text-stone-500 ml-1">{nombre.octava}</span>
              </p>
              <Pentagrama
                midi={nota}
                bemoles={ronda.bemoles}
                clave={CLAVES[voz!]}
                cantada={fase === 'canta' && aguja.cents !== null ? nota + aguja.octava * 12 + aguja.cents / 100 : null}
                className="w-56 sm:w-64"
              />
            </div>
          ) : (
            <p className="font-serif text-7xl sm:text-8xl text-stone-300 leading-none text-center mt-2" title="Nombre oculto">?</p>
          )}

          <div className="max-w-md mx-auto mt-2">
            <Esfera cents={fase === 'canta' ? aguja.cents : null} rango={100} tolerancia={config.tolerancia} className="text-stone-900" />
          </div>

          {/* Indicación */}
          <div className="text-center -mt-1 min-h-[3.5rem]">
            {fase === 'canta' && aguja.cents !== null && (
              aguja.octava !== 0 ? (
                <p className="text-sm text-red-800">Estás una octava por {aguja.octava < 0 ? 'debajo' : 'encima'}: busca la nota {aguja.octava < 0 ? 'más aguda' : 'más grave'}.</p>
              ) : Math.abs(aguja.cents) <= config.tolerancia ? (
                <p className="font-serif italic text-2xl text-red-800">¡Así! Mantenla…</p>
              ) : (
                <p className="font-serif italic text-2xl text-stone-700">
                  {aguja.cents < 0 ? 'Sube' : 'Baja'} <span className="not-italic text-base text-stone-500 tabular-nums">({Math.abs(Math.round(aguja.cents))} cents)</span>
                </p>
              )
            )}
            {fase === 'canta' && aguja.cents === null && <p className="text-sm text-stone-500 italic">Esperando tu voz…</p>}
          </div>

          {/* Mantener y tiempo */}
          {fase === 'canta' && (
            <div className="grid grid-cols-2 gap-6 mt-2">
              <Barra etiqueta="Mantén la nota" valor={progreso} fuerte />
              <Barra etiqueta="Tiempo" valor={restante} />
            </div>
          )}
        </div>

        {/* ============= GRÁFICA Y ACCIONES ============= */}
        <div className="space-y-5">
          <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm p-5 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-3">El camino de tu voz</p>
            <Grafica traza={traza} tolerancia={config.tolerancia} />
            <p className="text-xs text-stone-500 mt-3 leading-relaxed">
              La franja es la zona afinada (±{config.tolerancia} cents). Fíjate en si entras desde abajo o si la nota se te cae al final.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Accion onClick={() => escuchar(nota)} disabled={fase !== 'canta'} icono={<RotateCcw size={15} strokeWidth={1.5} />}>Oír otra vez</Accion>
            <Accion onClick={() => terminarNota(false)} disabled={fase !== 'canta'} icono={<SkipForward size={15} strokeWidth={1.5} />}>Saltar</Accion>
          </div>
          <Accion onClick={terminar} icono={<X size={15} strokeWidth={1.5} />}>Terminar la ronda</Accion>
          <p className="text-xs text-stone-500 leading-relaxed">{NOTA_PRIVACIDAD}</p>
        </div>
      </div>
    </div>
  );
}

// ============= CONFIGURACIÓN =============

function Configurar(props: {
  voz: Voz | null; setVoz: (v: Voz) => void; nivel: Nivel; elegirNivel: (n: Nivel) => void;
  mostrarNombre: boolean; setMostrarNombre: (b: boolean) => void; timbre: Timbre; setTimbre: (t: Timbre) => void;
  empezar: () => void; micro: ReturnType<typeof useDetectorTono>['estado'];
}) {
  const { voz, setVoz, nivel, elegirNivel, mostrarNombre, setMostrarNombre, timbre, setTimbre, empezar, micro } = props;
  const config = NIVELES[nivel];
  const niveles = Object.keys(NIVELES) as Nivel[];

  return (
    <div className="space-y-10">
      {/* Cuerda */}
      <section>
        <Titulo numero="1" texto="Elige tu cuerda" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {(Object.keys(VOCES) as Voz[]).map((v) => {
            const activa = voz === v;
            const [a, b] = rangoDe(v, nivel);
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVoz(v)}
                aria-pressed={activa}
                className={`group relative text-left rounded-sm border p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${
                  activa ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 border-transparent shadow-xl shadow-red-900/25' : 'bg-gradient-to-b from-white to-stone-100 border-stone-200/80 hover:border-red-800/30 hover:shadow-xl hover:shadow-red-900/10'
                }`}
              >
                {!activa && <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity" />}
                <span className={`font-serif text-5xl leading-none ${activa ? 'text-stone-50' : 'text-red-800'}`}>{VOCES[v].inicial}</span>
                <span className={`block font-serif text-2xl mt-2 ${activa ? 'text-stone-50' : 'text-stone-900'}`}>{VOCES[v].nombre}</span>
                <span className={`block text-xs tracking-[0.15em] mt-2 tabular-nums ${activa ? 'text-stone-200/80' : 'text-stone-500'}`}>
                  {notaConOctava(a)} – {notaConOctava(b)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-stone-500 mt-3">Rangos orientativos de coro para el nivel elegido. Los tenores cantan una octava por debajo de lo que se escribe en clave de sol.</p>
      </section>

      {/* Nivel: deslizador cápsula de tres posiciones */}
      <section>
        <Titulo numero="2" texto="Elige el nivel" />
        <div className="relative grid grid-cols-3 border border-stone-300 rounded-full overflow-hidden bg-stone-100 max-w-xl">
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-br from-red-800 to-red-950 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${niveles.indexOf(nivel) * 100}%)` }}
          />
          {niveles.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => elegirNivel(n)}
              aria-pressed={nivel === n}
              className={`relative z-10 py-3.5 text-xs sm:text-sm tracking-[0.25em] uppercase font-medium transition-colors duration-300 ${nivel === n ? 'text-stone-50' : 'text-stone-500 hover:text-stone-800'}`}
            >
              {NIVELES[n].nombre}
            </button>
          ))}
        </div>
        <div key={nivel} className="mt-5 grid sm:grid-cols-4 gap-4 animate-[fadeIn_0.3s_ease-out]">
          <p className="sm:col-span-4 font-serif italic text-lg text-stone-600">{config.descripcion}</p>
          <Ficha titulo="Tolerancia" valor={`±${config.tolerancia} cents`} />
          <Ficha titulo="Nota modelo" valor={`${config.duracion.toLocaleString('es-ES')} s`} />
          <Ficha titulo="Mantenerla" valor={`${config.sostener.toLocaleString('es-ES')} s`} />
          <Ficha titulo="Notas" valor={config.diatonico ? `Escala mayor · saltos ≤ ${config.saltoMax === 4 ? '3ª' : '5ª'}` : 'Cromáticas · hasta 8ª'} />
        </div>
      </section>

      {/* Opciones */}
      <section>
        <Titulo numero="3" texto="Ajustes" />
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mr-1">Sonido</span>
            {TIMBRES.map((t) => <Chip key={t.valor} activo={timbre === t.valor} onClick={() => setTimbre(t.valor)}>{t.nombre}</Chip>)}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={mostrarNombre} onChange={(e) => setMostrarNombre(e.target.checked)} className="w-4 h-4 accent-red-800" />
            <span className="text-sm text-stone-700">Mostrar el nombre de la nota</span>
          </label>
        </div>
      </section>

      <div className="space-y-4">
        <AvisoMicro estado={micro} />
        <button
          type="button"
          onClick={empezar}
          disabled={!voz || micro === 'pidiendo'}
          className="group relative overflow-hidden w-full sm:w-auto bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-12 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <Mic size={17} strokeWidth={1.5} /> {voz ? 'Empezar la ronda' : 'Elige tu cuerda'}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
        <p className="text-sm text-stone-500 leading-relaxed max-w-2xl">
          Busca un sitio tranquilo. Escucha la nota, espera a que se calle y cántala sobre una vocal abierta («a» u «o»), sin vibrato.
          Son {NOTAS_POR_RONDA} notas por ronda. {NOTA_PRIVACIDAD}
        </p>
      </div>
    </div>
  );
}

// ============= RESUMEN =============

function Resumen({ resultados, bemoles, otraRonda, cambiar, nivel, voz }: { resultados: Resultado[]; bemoles: boolean; otraRonda: () => void; cambiar: () => void; nivel: Nivel; voz: Voz }) {
  const aciertos = resultados.filter((r) => r.acertada).length;
  const oidas = resultados.filter((r) => r.media !== null && r.octava === 0);
  const desviacion = oidas.length ? oidas.reduce((s, r) => s + Math.abs(r.media!), 0) / oidas.length : null;
  const tendencia = oidas.length ? oidas.reduce((s, r) => s + r.media!, 0) / oidas.length : null;
  const sinVoz = resultados.filter((r) => r.media === null).length;
  const deOctava = resultados.filter((r) => r.octava !== 0).length;

  const consejos: string[] = [];
  if (sinVoz >= 2) consejos.push('En varias notas no te hemos oído: acércate al micrófono o canta un poco más fuerte.');
  if (deOctava >= 2) consejos.push('Has cantado algunas notas en otra octava. Antes de entrar, piensa si la nota está en tu zona grave, media o aguda.');
  if (tendencia !== null && tendencia < -8) consejos.push('Tiendes a quedarte por debajo. Suele pasar al final de la nota y en los agudos: mantén el apoyo del aire hasta el final y piensa la nota «por arriba» antes de cantarla.');
  else if (tendencia !== null && tendencia > 8) consejos.push('Tiendes a pasarte por arriba. Escucha la nota entera antes de entrar y atácala sin empujar el aire.');
  if (!consejos.length) consejos.push(aciertos >= 8 && nivel !== 'alto' ? 'Afinación muy centrada. Prueba el siguiente nivel.' : 'Buen trabajo. Repite la ronda: la afinación mejora con práctica corta y frecuente.');

  return (
    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Panel granate con la puntuación */}
      <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 px-6 py-10 sm:p-10 shadow-xl shadow-red-950/20 text-center">
        <div className="capa-grano" />
        <div className="absolute top-5 left-5 w-6 h-6 border-t border-l border-stone-50/25" />
        <div className="absolute bottom-5 right-5 w-6 h-6 border-b border-r border-stone-50/25" />
        <p className="relative z-10 text-xs tracking-[0.4em] uppercase text-stone-100/80">{VOCES[voz].nombre} · {NIVELES[nivel].nombre}</p>
        <p className="relative z-10 font-serif text-8xl sm:text-9xl leading-none mt-6">
          {aciertos}<span className="text-4xl text-stone-50/60">/{resultados.length}</span>
        </p>
        <p className="relative z-10 font-serif italic text-xl text-stone-100/90 mt-3">notas afinadas</p>
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-stone-50/20">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-200/70">Desviación media</p>
            <p className="font-serif text-3xl mt-1 tabular-nums">{desviacion !== null ? `${Math.round(desviacion)} c` : '—'}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-200/70">Tendencia</p>
            <p className="font-serif text-3xl mt-1">{tendencia === null ? '—' : tendencia < -8 ? 'Baja' : tendencia > 8 ? 'Alta' : 'Centrada'}</p>
          </div>
        </div>
      </div>

      {/* Detalle y consejos */}
      <div className="relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm px-6 py-8 sm:px-10 shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-4">Nota a nota</p>
        <ol className="grid sm:grid-cols-2 gap-x-8">
          {resultados.map((r, i) => (
            <li key={i} className="flex items-center gap-3 py-2 border-b border-stone-200/80">
              <span className={`w-2.5 h-2.5 rotate-45 border-[1.5px] flex-shrink-0 ${r.acertada ? 'bg-red-800 border-red-800' : 'border-stone-400'}`} />
              <span className="font-serif text-lg text-stone-900 w-16">{notaConOctava(r.midi, bemoles)}</span>
              <span className={`text-sm tabular-nums ${r.acertada ? 'text-red-800' : 'text-stone-500'}`}>{mensajeCorto(r)}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          {consejos.map((c) => (
            <p key={c} className="flex gap-3 text-sm text-stone-700 leading-relaxed">
              <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0 mt-1.5 text-red-800" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)" fill="currentColor" />
              </svg>
              {c}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <button type="button" onClick={otraRonda} className="group relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-3.5 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm">
            <span className="relative z-10">Otra ronda</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          <button type="button" onClick={cambiar} className="px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 border border-stone-300 hover:border-red-800 rounded-sm transition-colors">
            Cambiar cuerda o nivel
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= PIEZAS =============

const signo = (c: number) => `${c > 0 ? '+' : c < 0 ? '−' : ''}${Math.abs(Math.round(c))}`;

function mensajeNota(r: Resultado) {
  if (r.media === null) return 'No te hemos oído';
  if (r.octava !== 0) return `Nota buena, pero una octava por ${r.octava < 0 ? 'debajo' : 'encima'}`;
  if (r.acertada) return `¡Afinada! (${signo(r.media)} cents)`;
  return `${Math.abs(Math.round(r.media))} cents por ${r.media < 0 ? 'debajo' : 'encima'}`;
}

function mensajeCorto(r: Resultado) {
  if (r.media === null) return 'sin voz';
  if (r.octava !== 0) return `otra octava`;
  return `${signo(r.media)} cents`;
}

function Grafica({ traza, tolerancia }: { traza: Punto[]; tolerancia: number }) {
  const ancho = 300, alto = 140, rango = 100;
  const y = (c: number) => alto / 2 - (Math.max(-rango, Math.min(rango, c)) / rango) * (alto / 2 - 6);
  const ultimo = traza[traza.length - 1]?.t ?? 0;
  const x = (t: number) => ancho - ((ultimo - t) / (GRAFICA_SEGUNDOS * 1000)) * ancho;
  const puntos = traza.map((p) => `${x(p.t).toFixed(1)},${y(p.cents).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} className="w-full h-36 bg-white/60 border border-stone-200 rounded-sm" role="img" aria-label="Gráfica de la afinación de los últimos segundos">
      <rect x="0" y={y(tolerancia)} width={ancho} height={y(-tolerancia) - y(tolerancia)} className="fill-red-800/10" />
      <line x1="0" y1={alto / 2} x2={ancho} y2={alto / 2} className="stroke-red-800/60" strokeWidth="1" strokeDasharray="4 4" />
      {[-50, 50].map((c) => <line key={c} x1="0" y1={y(c)} x2={ancho} y2={y(c)} className="stroke-stone-200" strokeWidth="1" />)}
      <text x="4" y="12" className="fill-stone-400 text-[9px]">más alta</text>
      <text x="4" y={alto - 4} className="fill-stone-400 text-[9px]">más baja</text>
      {traza.length > 1 && <polyline points={puntos} fill="none" className="stroke-red-800" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
      {traza.length > 0 && <circle cx={x(ultimo)} cy={y(traza[traza.length - 1].cents)} r="3.5" className="fill-red-800" />}
    </svg>
  );
}

function Barra({ etiqueta, valor, fuerte = false }: { etiqueta: string; valor: number; fuerte?: boolean }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-2">{etiqueta}</p>
      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-[width] duration-100 ${fuerte ? 'bg-gradient-to-r from-red-800 to-red-600' : 'bg-stone-400'}`} style={{ width: `${Math.round(valor * 100)}%` }} />
      </div>
    </div>
  );
}

function Accion({ onClick, disabled = false, icono, children }: { onClick: () => void; disabled?: boolean; icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 border border-stone-300 hover:border-red-800 rounded-sm transition-colors disabled:opacity-40 disabled:pointer-events-none"
    >
      {icono}
      {children}
    </button>
  );
}

function Titulo({ numero, texto }: { numero: string; texto: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="font-serif text-3xl text-red-800 leading-none">{numero}</span>
      <h2 className="text-xs tracking-[0.35em] uppercase text-stone-800 font-medium">{texto}</h2>
      <div className="h-px flex-1 bg-stone-300" />
    </div>
  );
}

function Ficha({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="border-l-2 border-red-800/40 pl-3">
      <p className="text-[10px] tracking-[0.25em] uppercase text-stone-500">{titulo}</p>
      <p className="font-serif text-lg text-stone-900">{valor}</p>
    </div>
  );
}
