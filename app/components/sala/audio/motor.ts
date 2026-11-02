// Un único AudioContext para toda la Sala de ensayo (piano, metrónomo,
// diapasón y micrófono). Se crea con el primer gesto del usuario, porque los
// navegadores no dejan sonar audio antes. Todo lo que suena pasa por un
// compresor suave para que varias notas a la vez no saturen.

let contexto: AudioContext | null = null;
let salida: GainNode | null = null;

export function obtenerAudio() {
  if (!contexto || !salida) {
    contexto = new AudioContext({ latencyHint: 'interactive' });
    const compresor = contexto.createDynamicsCompressor();
    compresor.threshold.value = -8;
    compresor.knee.value = 8;
    compresor.ratio.value = 4;
    compresor.attack.value = 0.002;
    compresor.release.value = 0.2;
    salida = contexto.createGain();
    salida.gain.value = 0.9;
    salida.connect(compresor).connect(contexto.destination);
  }
  if (contexto.state === 'suspended') void contexto.resume();
  return { ctx: contexto, salida };
}

// Reverberación sintética (ruido con caída exponencial): da "sala" al piano
// sin cargar archivos de respuesta de impulso.
const reverbs = new WeakMap<AudioContext, AudioBuffer>();
export function impulsoSala(ctx: AudioContext, segundos = 2.2) {
  let buffer = reverbs.get(ctx);
  if (!buffer) {
    const largo = Math.floor(ctx.sampleRate * segundos);
    buffer = ctx.createBuffer(2, largo, ctx.sampleRate);
    for (let canal = 0; canal < 2; canal++) {
      const datos = buffer.getChannelData(canal);
      for (let i = 0; i < largo; i++) {
        const t = i / ctx.sampleRate;
        datos[i] = (Math.random() * 2 - 1) * Math.exp(-t * 3.2) * (t < 0.012 ? t / 0.012 : 1);
      }
    }
    reverbs.set(ctx, buffer);
  }
  return buffer;
}

// Mantiene la pantalla encendida mientras suena el metrónomo o se escucha el micrófono.
export async function mantenerPantalla(): Promise<() => void> {
  try {
    const bloqueo = await navigator.wakeLock?.request('screen');
    return () => { void bloqueo?.release(); };
  } catch {
    return () => {};
  }
}
