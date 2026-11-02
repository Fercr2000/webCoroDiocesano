// Piano sintetizado por código (Web Audio, sin muestras).
// Cada nota: tres "cuerdas" (osciladores con una forma de onda propia de su
// registro, desafinadas ±1 cent entre sí como los unísonos reales), un filtro
// que se oscurece al apagarse el sonido, caída en dos tramos (ataque brillante
// y resonancia larga), golpe de macillo con ruido filtrado, apagador al soltar
// y una resonancia de sala discreta.
// La afinación sale de la La de referencia: la nota media de las cuerdas es exacta.

import { frecuencia } from '@/lib/sala/notas';
import { impulsoSala } from './motor';

interface Voz {
  osciladores: OscillatorNode[];
  apagador: GainNode;
}

export class Piano {
  private ctx: AudioContext;
  private bus: GainNode;
  private envio: GainNode;
  private sonando = new Map<number, Voz>();
  private ondas = new Map<number, PeriodicWave>();
  private ruido: AudioBuffer;

  constructor(ctx: AudioContext, destino: AudioNode) {
    this.ctx = ctx;
    this.bus = ctx.createGain();
    this.bus.gain.value = 0.8;
    this.bus.connect(destino);

    // Resonancia de sala, mezclada discretamente.
    const reverb = ctx.createConvolver();
    reverb.buffer = impulsoSala(ctx);
    this.envio = ctx.createGain();
    this.envio.gain.value = 0.18;
    this.bus.connect(this.envio).connect(reverb).connect(destino);

    this.ruido = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const datos = this.ruido.getChannelData(0);
    for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;
  }

  set volumen(valor: number) { this.bus.gain.setTargetAtTime(valor, this.ctx.currentTime, 0.02); }

  // Armónicos según el registro: los graves, ricos; los agudos, casi puros.
  // El macillo golpea hacia 1/8 de la cuerda y apaga los armónicos múltiplos de 8.
  private onda(midi: number) {
    let onda = this.ondas.get(midi);
    if (!onda) {
      const f = 440 * 2 ** ((midi - 69) / 12);
      const n = Math.max(2, Math.min(40, Math.floor(9000 / f)));
      const real = new Float32Array(n + 1);
      const imag = new Float32Array(n + 1);
      const caida = 1.1 + Math.max(0, (midi - 40) / 40);
      for (let h = 1; h <= n; h++) {
        imag[h] = (Math.abs(Math.sin((Math.PI * h) / 8)) + 0.08) / h ** caida;
      }
      onda = this.ctx.createPeriodicWave(real, imag);
      this.ondas.set(midi, onda);
    }
    return onda;
  }

  tocar(midi: number, la: number, fuerza = 0.75) {
    const ahora = this.ctx.currentTime;
    this.soltarYa(midi, ahora);

    const f = frecuencia(midi, la);
    const grave = Math.max(0, Math.min(1, (72 - midi) / 48)); // 1 en graves, 0 en agudos
    const pico = 0.22 * (0.35 + 0.65 * fuerza) * (0.75 + 0.35 * grave);

    // Filtro: más brillante cuanto más fuerte, y se cierra con el tiempo.
    const filtro = this.ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.Q.value = 0.6;
    const brillo = Math.min(16000, f * (5 + 14 * fuerza));
    filtro.frequency.setValueAtTime(brillo, ahora);
    filtro.frequency.setTargetAtTime(Math.max(f * 2.2, 400), ahora + 0.02, 0.35 + 1.2 * grave);

    // Envolvente: ataque inmediato, caída rápida a un 35 % y resonancia larga.
    const envolvente = this.ctx.createGain();
    const largo = 0.7 + 5.5 * grave ** 1.4;
    envolvente.gain.setValueAtTime(0, ahora);
    envolvente.gain.linearRampToValueAtTime(pico, ahora + 0.003);
    envolvente.gain.setTargetAtTime(pico * 0.35, ahora + 0.003, 0.06 + 0.12 * grave);
    envolvente.gain.setTargetAtTime(0, ahora + 0.25, largo);

    const apagador = this.ctx.createGain();
    filtro.connect(envolvente).connect(apagador).connect(this.bus);

    const onda = this.onda(midi);
    const desafinaciones = midi < 34 ? [0] : midi < 46 ? [-0.8, 0.8] : [-1, 0, 1.1];
    const osciladores = desafinaciones.map((cents) => {
      const osc = this.ctx.createOscillator();
      osc.setPeriodicWave(onda);
      osc.frequency.value = f;
      osc.detune.value = cents;
      const g = this.ctx.createGain();
      g.gain.value = 1 / desafinaciones.length;
      osc.connect(g).connect(filtro);
      osc.start(ahora);
      return osc;
    });

    // Golpe del macillo: ruido muy corto filtrado alrededor del registro.
    const golpe = this.ctx.createBufferSource();
    golpe.buffer = this.ruido;
    const banda = this.ctx.createBiquadFilter();
    banda.type = 'bandpass';
    banda.frequency.value = Math.min(6000, f * 3 + 800);
    banda.Q.value = 0.9;
    const gGolpe = this.ctx.createGain();
    gGolpe.gain.setValueAtTime(pico * 0.25 * fuerza, ahora);
    gGolpe.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.03);
    golpe.connect(banda).connect(gGolpe).connect(apagador);
    golpe.start(ahora);

    // Si no se suelta, la nota se apaga sola al cabo de su resonancia.
    const fin = ahora + 0.25 + largo * 6;
    osciladores.forEach((o) => o.stop(fin));
    this.sonando.set(midi, { osciladores, apagador });
    osciladores[0].onended = () => {
      if (this.sonando.get(midi)?.osciladores === osciladores) this.sonando.delete(midi);
    };
  }

  soltar(midi: number) {
    this.soltarYa(midi, this.ctx.currentTime);
  }

  // El apagador cae sobre la cuerda: más lento en los graves, como en un piano real.
  private soltarYa(midi: number, ahora: number) {
    const voz = this.sonando.get(midi);
    if (!voz) return;
    const caida = midi < 48 ? 0.12 : 0.07;
    voz.apagador.gain.setTargetAtTime(0, ahora, caida);
    voz.osciladores.forEach((o) => { try { o.stop(ahora + caida * 8); } catch {} });
    this.sonando.delete(midi);
  }

  silenciar() {
    for (const midi of [...this.sonando.keys()]) this.soltarYa(midi, this.ctx.currentTime);
  }

  desconectar() {
    this.silenciar();
    this.bus.disconnect();
    this.envio.disconnect();
  }
}
