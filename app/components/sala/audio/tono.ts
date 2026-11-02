// Sonidos sostenidos: la nota modelo de "Afina tu voz" y las cuerdas de referencia del afinador.
// La frecuencia del oscilador es exacta (la que se pide, sin desafinar), que es
// lo que importa para afinar contra ella.

export type Timbre = 'diapason' | 'organo' | 'cuerda';

export const TIMBRES: { valor: Timbre; nombre: string; descripcion: string }[] = [
  { valor: 'diapason', nombre: 'Puro', descripcion: 'Tono puro, como el diapasón de horquilla' },
  { valor: 'organo', nombre: 'Órgano', descripcion: 'Flautado suave, fácil de imitar con la voz' },
  { valor: 'cuerda', nombre: 'Cuerda', descripcion: 'Sonido de arco, rico en armónicos' },
];

const ondasOrgano = new WeakMap<AudioContext, PeriodicWave>();
function ondaOrgano(ctx: AudioContext) {
  let onda = ondasOrgano.get(ctx);
  if (!onda) {
    // Flautado de 8': fundamental fuerte y pocos armónicos.
    const imag = new Float32Array([0, 1, 0.38, 0.16, 0.08, 0.04, 0.02]);
    onda = ctx.createPeriodicWave(new Float32Array(imag.length), imag);
    ondasOrgano.set(ctx, onda);
  }
  return onda;
}

export interface TonoSostenido {
  cambiarFrecuencia: (hz: number) => void;
  cambiarVolumen: (volumen: number) => void;
  detener: (fundido?: number) => void;
}

export function tocarTono(ctx: AudioContext, destino: AudioNode, hz: number, timbre: Timbre, volumen = 0.5): TonoSostenido {
  const ahora = ctx.currentTime;
  const osc = ctx.createOscillator();
  if (timbre === 'organo') osc.setPeriodicWave(ondaOrgano(ctx));
  else osc.type = timbre === 'cuerda' ? 'sawtooth' : 'sine';
  osc.frequency.value = hz;

  const nivel = (v: number) => v * (timbre === 'cuerda' ? 0.5 : 0.8);
  const ganancia = ctx.createGain();
  // Fundido de entrada y salida: sin chasquidos.
  ganancia.gain.setValueAtTime(0, ahora);
  ganancia.gain.linearRampToValueAtTime(nivel(volumen), ahora + 0.08);

  if (timbre === 'cuerda') {
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = Math.min(9000, hz * 6);
    filtro.Q.value = 0.7;
    osc.connect(filtro).connect(ganancia);
  } else {
    osc.connect(ganancia);
  }
  ganancia.connect(destino);
  osc.start(ahora);

  let detenido = false;
  return {
    cambiarFrecuencia: (nueva) => osc.frequency.setTargetAtTime(nueva, ctx.currentTime, 0.01),
    cambiarVolumen: (v) => { if (!detenido) ganancia.gain.setTargetAtTime(nivel(v), ctx.currentTime, 0.03); },
    detener: (fundido = 0.12) => {
      if (detenido) return;
      detenido = true;
      const t = ctx.currentTime;
      ganancia.gain.setTargetAtTime(0, t, fundido / 4);
      osc.stop(t + fundido * 2);
      osc.onended = () => ganancia.disconnect();
    },
  };
}
