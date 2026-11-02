// Metrónomo preciso: los golpes se programan por adelantado en el reloj del
// AudioContext (técnica de "lookahead"), no con setTimeout. El temporizador
// que despierta al programador vive en un Worker para que no se ralentice
// cuando la pestaña pasa a segundo plano. Un solo metrónomo para toda la Sala:
// sigue sonando al cambiar de herramienta (el piano y la barra lo comparten).

import { COMPASES, BPM_MIN, BPM_MAX } from '@/lib/sala/tempo';
import { obtenerAudio, mantenerPantalla } from './motor';

export type Acento = 'fuerte' | 'normal' | 'silencio';
export type SonidoMetronomo = 'clasico' | 'claves' | 'electronico';

export const SONIDOS_METRONOMO: { valor: SonidoMetronomo; nombre: string }[] = [
  { valor: 'clasico', nombre: 'Clásico' },
  { valor: 'claves', nombre: 'Claves' },
  { valor: 'electronico', nombre: 'Electrónico' },
];

export interface EstadoMetronomo {
  bpm: number;
  compas: string;
  subdivision: number;
  acentos: Acento[];
  sonido: SonidoMetronomo;
  volumen: number;
  sonando: boolean;
}

const ANTICIPACION = 0.12; // segundos que se programan por delante
const INTERVALO = 25;      // ms entre despertares del programador

const acentosPorDefecto = (pulsos: number): Acento[] => Array.from({ length: pulsos }, (_, i) => (i === 0 && pulsos > 1 ? 'fuerte' : 'normal'));

class Metronomo {
  private estado: EstadoMetronomo = {
    bpm: 80, compas: '4/4', subdivision: 1, acentos: acentosPorDefecto(4), sonido: 'clasico', volumen: 0.8, sonando: false,
  };
  private oyentes = new Set<() => void>();
  private worker: Worker | null = null;
  private siguiente = 0;
  private paso = 0;
  private pulsos: { tiempo: number; pulso: number; duracion: number; n: number }[] = [];
  private contador = 0;
  private toques: number[] = [];
  private liberarPantalla: (() => void) | null = null;
  private muestras = new Map<string, AudioBuffer>();

  // ---- useSyncExternalStore ----
  suscribir = (oyente: () => void) => {
    this.oyentes.add(oyente);
    return () => this.oyentes.delete(oyente);
  };
  leer = () => this.estado;
  private actualizar(parcial: Partial<EstadoMetronomo>) {
    this.estado = { ...this.estado, ...parcial };
    this.oyentes.forEach((o) => o());
  }

  private get compas() {
    return COMPASES.find((c) => c.etiqueta === this.estado.compas) ?? COMPASES[3];
  }

  // ---- Controles ----
  cambiarBpm(bpm: number) {
    this.actualizar({ bpm: Math.round(Math.min(BPM_MAX, Math.max(BPM_MIN, bpm))) });
  }

  cambiarCompas(etiqueta: string) {
    const compas = COMPASES.find((c) => c.etiqueta === etiqueta);
    if (!compas) return;
    this.actualizar({ compas: etiqueta, acentos: acentosPorDefecto(compas.pulsos), subdivision: compas.compuesto ? 3 : 1 });
    this.paso = 0;
  }

  cambiarSubdivision(subdivision: number) {
    this.actualizar({ subdivision });
    this.paso = 0;
  }

  // Fuerte → normal → silencio → fuerte.
  alternarAcento(i: number) {
    const ciclo: Acento[] = ['fuerte', 'normal', 'silencio'];
    const acentos = [...this.estado.acentos];
    acentos[i] = ciclo[(ciclo.indexOf(acentos[i]) + 1) % 3];
    this.actualizar({ acentos });
  }

  cambiarSonido(sonido: SonidoMetronomo) { this.actualizar({ sonido }); }
  cambiarVolumen(volumen: number) { this.actualizar({ volumen }); }

  // Marcar el pulso con toques: media de los últimos intervalos (se reinicia tras 2 s).
  marcarToque() {
    const ahora = performance.now();
    if (this.toques.length && ahora - this.toques[this.toques.length - 1] > 2000) this.toques = [];
    this.toques.push(ahora);
    this.toques = this.toques.slice(-5);
    if (this.toques.length >= 2) {
      const intervalos = this.toques.slice(1).map((t, i) => t - this.toques[i]);
      this.cambiarBpm(60000 / (intervalos.reduce((a, b) => a + b, 0) / intervalos.length));
    }
  }

  alternar() {
    if (this.estado.sonando) this.detener();
    else this.iniciar();
  }

  iniciar() {
    if (this.estado.sonando) return;
    const { ctx } = obtenerAudio();
    if (!this.worker) {
      const codigo = `let id=null;onmessage=(e)=>{if(e.data==='inicio'){clearInterval(id);id=setInterval(()=>postMessage(0),${INTERVALO});}else{clearInterval(id);id=null;}};`;
      this.worker = new Worker(URL.createObjectURL(new Blob([codigo], { type: 'text/javascript' })));
      this.worker.onmessage = () => this.programar();
    }
    this.paso = 0;
    this.contador = 0;
    this.pulsos = [];
    this.siguiente = ctx.currentTime + 0.06;
    this.actualizar({ sonando: true });
    this.programar();
    this.worker.postMessage('inicio');
    void mantenerPantalla().then((liberar) => {
      if (this.estado.sonando) this.liberarPantalla = liberar;
      else liberar();
    });
  }

  detener() {
    this.worker?.postMessage('fin');
    this.pulsos = [];
    this.liberarPantalla?.();
    this.liberarPantalla = null;
    this.actualizar({ sonando: false });
  }

  // Pulso actual y fase (0 → 1) en un instante del reloj de audio, para dibujar
  // el péndulo y los pulsos exactamente a la vez que suenan.
  // `n` cuenta los pulsos desde que empezó (para que el péndulo alterne de lado).
  posicion(): { pulso: number; fase: number; n: number } | null {
    if (!this.estado.sonando) return null;
    const { ctx } = obtenerAudio();
    const t = ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0);
    let actual = null;
    for (const p of this.pulsos) if (p.tiempo <= t) actual = p;
    if (!actual) return null;
    return { pulso: actual.pulso, fase: Math.min(1, (t - actual.tiempo) / actual.duracion), n: actual.n };
  }

  private programar() {
    if (!this.estado.sonando) return;
    const { ctx } = obtenerAudio();
    const { bpm, subdivision, acentos } = this.estado;
    const pulsosCompas = this.compas.pulsos;
    const pasosCompas = pulsosCompas * subdivision;

    while (this.siguiente < ctx.currentTime + ANTICIPACION) {
      const duracionPulso = 60 / bpm;
      const pulso = Math.floor(this.paso / subdivision) % pulsosCompas;
      const enPulso = this.paso % subdivision === 0;
      const acento = acentos[pulso] ?? 'normal';

      if (enPulso) {
        this.pulsos.push({ tiempo: this.siguiente, pulso, duracion: duracionPulso, n: this.contador++ });
        if (acento !== 'silencio') this.clic(this.siguiente, acento === 'fuerte' ? 'fuerte' : 'normal');
      } else if (acento !== 'silencio') {
        this.clic(this.siguiente, 'sub');
      }

      this.siguiente += duracionPulso / subdivision;
      this.paso = (this.paso + 1) % pasosCompas;
    }
    // Solo hacen falta los últimos pulsos para dibujar.
    if (this.pulsos.length > 8) this.pulsos = this.pulsos.slice(-8);
  }

  private clic(tiempo: number, tipo: TipoGolpe) {
    const { ctx, salida } = obtenerAudio();
    const clave = `${this.estado.sonido}:${tipo}`;
    let muestra = this.muestras.get(clave);
    if (!muestra) {
      muestra = crearGolpe(ctx, this.estado.sonido, tipo);
      this.muestras.set(clave, muestra);
    }
    const fuente = ctx.createBufferSource();
    fuente.buffer = muestra;
    const ganancia = ctx.createGain();
    ganancia.gain.value = this.estado.volumen;
    fuente.connect(ganancia).connect(salida);
    fuente.start(tiempo);
    fuente.onended = () => ganancia.disconnect();
  }
}

export const metronomo = new Metronomo();

// ---- Sonidos de los golpes ----
// Se sintetizan una vez como muestras, sumando los modos de vibración de un
// objeto real (síntesis modal): cada modo es un seno que se apaga a su ritmo,
// y un chasquido de ruido muy corto hace de ataque.
//   · clásico: tic del metrónomo de cuerda, con campanilla en el primer tiempo
//   · claves: las dos varillas de madera de la percusión
//   · electrónico: pitido limpio

type TipoGolpe = 'fuerte' | 'normal' | 'sub';
type Modo = [frecuencia: number, amplitud: number, caida: number]; // caída en segundos (constante de tiempo)

const MODOS: Record<SonidoMetronomo, Record<TipoGolpe, { modos: Modo[]; ruido: number; nivel: number }>> = {
  clasico: {
    // Tic seco + campanilla (parciales de campana pequeña: 1 · 2,76 · 5,40 · 8,93).
    fuerte: { modos: [[2150, 1, 0.011], [3480, 0.55, 0.007], [5300, 0.3, 0.004], [1180, 0.3, 0.016], [2093, 0.55, 0.32], [5777, 0.22, 0.14], [11302, 0.06, 0.05]], ruido: 0.5, nivel: 1 },
    normal: { modos: [[2150, 1, 0.011], [3480, 0.55, 0.007], [5300, 0.3, 0.004], [1180, 0.3, 0.016]], ruido: 0.5, nivel: 0.75 },
    sub: { modos: [[2400, 1, 0.008], [3900, 0.45, 0.005], [1300, 0.2, 0.01]], ruido: 0.35, nivel: 0.4 },
  },
  claves: {
    fuerte: { modos: [[2780, 1, 0.05], [7150, 0.12, 0.012], [1390, 0.05, 0.02]], ruido: 0.25, nivel: 1 },
    normal: { modos: [[2450, 1, 0.045], [6300, 0.12, 0.011], [1225, 0.05, 0.02]], ruido: 0.25, nivel: 0.72 },
    sub: { modos: [[2200, 1, 0.03], [5650, 0.1, 0.008]], ruido: 0.2, nivel: 0.4 },
  },
  electronico: {
    fuerte: { modos: [[1760, 1, 0.03], [3520, 0.08, 0.02]], ruido: 0, nivel: 0.8 },
    normal: { modos: [[1320, 1, 0.03], [2640, 0.08, 0.02]], ruido: 0, nivel: 0.6 },
    sub: { modos: [[880, 1, 0.02]], ruido: 0, nivel: 0.35 },
  },
};

function crearGolpe(ctx: AudioContext, sonido: SonidoMetronomo, tipo: TipoGolpe) {
  const { modos, ruido, nivel } = MODOS[sonido][tipo];
  const fm = ctx.sampleRate;
  const duracion = Math.min(1.2, Math.max(...modos.map((m) => m[2])) * 7 + 0.01);
  const buffer = ctx.createBuffer(1, Math.ceil(fm * duracion), fm);
  const datos = buffer.getChannelData(0);
  const fases = modos.map((_, i) => i * 1.7);
  for (let i = 0; i < datos.length; i++) {
    const t = i / fm;
    // Ataque de 0,5 ms para que no chasquee digitalmente.
    const ataque = Math.min(1, t / 0.0005);
    let v = 0;
    for (let k = 0; k < modos.length; k++) {
      const [f, a, caida] = modos[k];
      if (f < fm / 2) v += a * Math.exp(-t / caida) * Math.sin(2 * Math.PI * f * t + fases[k]);
    }
    if (ruido) v += ruido * (Math.random() * 2 - 1) * Math.exp(-t / 0.0006);
    datos[i] = v * ataque;
  }
  // Normaliza el pico y aplica el nivel del tipo de golpe.
  let pico = 0;
  for (let i = 0; i < datos.length; i++) pico = Math.max(pico, Math.abs(datos[i]));
  for (let i = 0; i < datos.length; i++) datos[i] = (datos[i] / (pico || 1)) * 0.9 * nivel;
  return buffer;
}
