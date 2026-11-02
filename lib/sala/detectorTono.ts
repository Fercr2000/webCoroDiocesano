// Detección de la altura (frecuencia fundamental) con el algoritmo YIN
// (de Cheveigné y Kawahara, 2002). La función de diferencia se calcula con
// FFT (O(n log n)) para poder analizar ventanas largas en tiempo real, y el
// valle se afina con interpolación parabólica: error < 1 cent con señal limpia.
// Sin dependencias: se usa igual en el navegador y en las pruebas.

export interface OpcionesDetector {
  minHz?: number;   // nota más grave que se busca (contrabajo: Mi1 ≈ 41 Hz)
  maxHz?: number;
  umbral?: number;  // umbral de YIN: más bajo = más exigente con el ruido
  rmsMin?: number;  // por debajo de este volumen se considera silencio
}

export interface Tono {
  hz: number;
  claridad: number; // 0 … 1: lo "periódica" que es la señal
  volumen: number;  // RMS
}

// FFT compleja iterativa (radix 2, en el sitio). `inversa` sin normalizar.
function fft(re: Float64Array, im: Float64Array, inversa = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let largo = 2; largo <= n; largo <<= 1) {
    const angulo = ((inversa ? 2 : -2) * Math.PI) / largo;
    const wr = Math.cos(angulo), wi = Math.sin(angulo);
    for (let i = 0; i < n; i += largo) {
      let cr = 1, ci = 0;
      for (let k = 0; k < largo / 2; k++) {
        const a = i + k, b = a + largo / 2;
        const tr = re[b] * cr - im[b] * ci;
        const ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti;
        re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = nr;
      }
    }
  }
}

// Reutiliza los búferes entre llamadas (se analiza ~30 veces por segundo).
const cache = new Map<number, { aRe: Float64Array; aIm: Float64Array; bRe: Float64Array; bIm: Float64Array }>();
function buferes(m: number) {
  let b = cache.get(m);
  if (!b) {
    b = { aRe: new Float64Array(m), aIm: new Float64Array(m), bRe: new Float64Array(m), bIm: new Float64Array(m) };
    cache.set(m, b);
  }
  return b;
}

export function detectarTono(datos: Float32Array, frecuenciaMuestreo: number, opciones: OpcionesDetector = {}): Tono | null {
  const { minHz = 40, maxHz = 2000, umbral = 0.12, rmsMin = 0.008 } = opciones;
  const n = datos.length;

  let energia = 0;
  for (let i = 0; i < n; i++) energia += datos[i] * datos[i];
  const volumen = Math.sqrt(energia / n);
  if (volumen < rmsMin) return null;

  const tauMin = Math.max(2, Math.floor(frecuenciaMuestreo / maxHz));
  const tauMax = Math.min(Math.floor(frecuenciaMuestreo / minHz), Math.floor(n / 2) - 2);
  const ventana = n - tauMax - 1;

  // Correlación cruzada c(τ) = Σ x[i]·x[i+τ] (i < ventana) con FFT.
  let m = 1;
  while (m < n + ventana) m <<= 1;
  const { aRe, aIm, bRe, bIm } = buferes(m);
  aRe.fill(0); aIm.fill(0); bRe.fill(0); bIm.fill(0);
  for (let i = 0; i < ventana; i++) aRe[i] = datos[i];
  for (let i = 0; i < n; i++) bRe[i] = datos[i];
  fft(aRe, aIm);
  fft(bRe, bIm);
  for (let k = 0; k < m; k++) {
    // conj(A) · B
    const r = aRe[k] * bRe[k] + aIm[k] * bIm[k];
    const i = aRe[k] * bIm[k] - aIm[k] * bRe[k];
    aRe[k] = r; aIm[k] = i;
  }
  fft(aRe, aIm, true);

  // d(τ) = Σx[i]² + Σx[i+τ]² − 2c(τ), con sumas de energía incrementales.
  const d = new Float64Array(tauMax + 2);
  let energiaVentana = 0;
  for (let i = 0; i < ventana; i++) energiaVentana += datos[i] * datos[i];
  let energiaDesplazada = energiaVentana;
  for (let tau = 1; tau <= tauMax + 1; tau++) {
    energiaDesplazada += datos[tau + ventana - 1] ** 2 - datos[tau - 1] ** 2;
    d[tau] = Math.max(0, energiaVentana + energiaDesplazada - (2 * aRe[tau]) / m);
  }

  // Diferencia normalizada acumulada (CMNDF).
  const cmnd = new Float64Array(tauMax + 2);
  cmnd[0] = 1;
  let acumulado = 0;
  for (let tau = 1; tau <= tauMax + 1; tau++) {
    acumulado += d[tau];
    cmnd[tau] = acumulado > 0 ? (d[tau] * tau) / acumulado : 1;
  }

  // Primer valle por debajo del umbral (evita errores de octava); si no hay, el mínimo global.
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++) {
    if (cmnd[t] < umbral) {
      while (t + 1 <= tauMax && cmnd[t + 1] < cmnd[t]) t++;
      tau = t;
      break;
    }
  }
  if (tau === -1) {
    let minimo = Infinity;
    for (let t = tauMin; t <= tauMax; t++) if (cmnd[t] < minimo) { minimo = cmnd[t]; tau = t; }
    // Señal poco periódica (voz susurrada, ruido, consonantes): no se da lectura.
    if (minimo > 0.35) return null;
  }

  // Interpolación parabólica sobre d(τ), que no tiene el sesgo de la normalización.
  const parabola = (t: number) => {
    const a = d[t - 1], b = d[t], c = d[t + 1];
    const denominador = a - 2 * b + c;
    const desplazamiento = denominador > 0 ? (a - c) / (2 * denominador) : 0;
    return t + Math.max(-1, Math.min(1, desplazamiento));
  };
  let periodo = parabola(tau);

  // Afinado fino: el valle k periodos más allá tiene el mismo error en muestras,
  // pero repartido entre k periodos. Clave en agudos, donde el periodo es corto.
  const k = Math.min(8, Math.floor((tauMax - 1) / periodo));
  if (k >= 2) {
    const centro = Math.round(k * periodo);
    const radio = Math.max(2, Math.ceil(k * 0.02 * periodo));
    let mejor = centro;
    for (let t = Math.max(1, centro - radio); t <= Math.min(tauMax, centro + radio); t++) if (d[t] < d[mejor]) mejor = t;
    // Solo si de verdad es un valle de la misma nota (no una octava ni ruido).
    if (mejor > 1 && mejor < tauMax && cmnd[mejor] < Math.max(umbral * 2, cmnd[tau] * 2 + 0.05)) {
      const fino = parabola(mejor) / k;
      if (Math.abs(fino - periodo) < 0.5) periodo = fino;
    }
  }

  return { hz: frecuenciaMuestreo / periodo, claridad: 1 - cmnd[tau], volumen };
}
