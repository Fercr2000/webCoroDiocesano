'use client';

// Escucha el micrófono y detecta la altura ~30 veces por segundo.
// El audio se analiza en el propio dispositivo: no se graba ni se envía.
// Se desactivan la cancelación de eco, la supresión de ruido y el control
// automático de ganancia, que deforman la señal y estropean la medida.

import { useCallback, useEffect, useRef, useState } from 'react';
import { detectarTono, type OpcionesDetector, type Tono } from '@/lib/sala/detectorTono';
import { obtenerAudio, mantenerPantalla } from './audio/motor';

export type EstadoMicro = 'inactivo' | 'pidiendo' | 'escuchando' | 'denegado' | 'sin-micro' | 'error';

interface Opciones extends OpcionesDetector {
  muestras?: number; // tamaño de la ventana de análisis (más largo = más estable, más lento)
}

export function useDetectorTono(opciones: Opciones, alLeer: (tono: Tono | null) => void) {
  const [estado, setEstado] = useState<EstadoMicro>('inactivo');
  const recursos = useRef<{ stream: MediaStream; fuente: MediaStreamAudioSourceNode; analizador: AnalyserNode; frame: number; liberar?: () => void } | null>(null);
  const callback = useRef(alLeer);
  const config = useRef(opciones);
  useEffect(() => {
    callback.current = alLeer;
    config.current = opciones;
  });

  const detener = useCallback(() => {
    const r = recursos.current;
    if (r) {
      cancelAnimationFrame(r.frame);
      r.stream.getTracks().forEach((t) => t.stop());
      r.fuente.disconnect();
      r.liberar?.();
      recursos.current = null;
    }
    setEstado('inactivo');
  }, []);

  // Devuelve si el micrófono quedó escuchando.
  const iniciar = useCallback(async (): Promise<boolean> => {
    if (recursos.current) return true;
    if (!navigator.mediaDevices?.getUserMedia) {
      setEstado('sin-micro');
      return false;
    }
    setEstado('pidiendo');
    const { ctx } = obtenerAudio();
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (e) {
      const nombre = (e as DOMException)?.name;
      setEstado(nombre === 'NotAllowedError' || nombre === 'SecurityError' ? 'denegado' : nombre === 'NotFoundError' ? 'sin-micro' : 'error');
      return false;
    }

    const fuente = ctx.createMediaStreamSource(stream);
    const analizador = ctx.createAnalyser();
    analizador.fftSize = 8192;
    fuente.connect(analizador); // sin conectar a los altavoces: nada de acoples

    const datos = new Float32Array(analizador.fftSize);
    let ultimo = 0;
    const bucle = (ahora: number) => {
      if (!recursos.current) return;
      recursos.current.frame = requestAnimationFrame(bucle);
      if (ahora - ultimo < 30) return;
      ultimo = ahora;
      analizador.getFloatTimeDomainData(datos);
      const { muestras = 8192, ...detector } = config.current;
      callback.current(detectarTono(datos.subarray(datos.length - muestras), ctx.sampleRate, detector));
    };
    recursos.current = { stream, fuente, analizador, frame: requestAnimationFrame(bucle) };
    setEstado('escuchando');
    const liberar = await mantenerPantalla();
    if (recursos.current) recursos.current.liberar = liberar;
    else liberar();
    return true;
  }, []);

  // Al salir de la página se suelta el micrófono.
  useEffect(() => detener, [detener]);

  return { estado, iniciar, detener };
}

// Suaviza las lecturas: mediana de las últimas (descarta saltos sueltos) y
// media exponencial para que la aguja no tiemble.
export class Suavizador {
  private ventana: number[] = [];
  private valor: number | null = null;
  constructor(private tamano = 5, private alfa = 0.35) {}

  agregar(x: number) {
    this.ventana.push(x);
    if (this.ventana.length > this.tamano) this.ventana.shift();
    const mediana = [...this.ventana].sort((a, b) => a - b)[Math.floor(this.ventana.length / 2)];
    this.valor = this.valor === null ? mediana : this.valor + this.alfa * (mediana - this.valor);
    return this.valor;
  }

  reiniciar() {
    this.ventana = [];
    this.valor = null;
  }
}
