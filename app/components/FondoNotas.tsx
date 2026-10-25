// Fondo de notas para las páginas de Componentes y Calendario: figuras
// musicales que flotan muy despacio por todo el ancho de la página (mismas
// figuras que el pentagrama).
// Rellena su contenedor, que debe ser relative; el contenido va encima con z-10.
// Decorativo: aria-hidden, sin eventos de ratón y quieto con "reducir movimiento".

import { Nota, type Figura } from './PentagramaOla';

// Posición (% de la página), figura, inclinación, escala, duración y retraso.
// Más densas en los laterales, que es donde el plano deja aire. Retrasos
// negativos: al cargar, cada nota ya va por un punto distinto de su ciclo.
const NOTAS: { x: number; y: number; figura: Figura; rot: number; escala: number; dur: number; retraso: number }[] = [
  // Franja izquierda
  { x: 2, y: 6, figura: 'corchea', rot: -10, escala: 1, dur: 22, retraso: -3 },
  { x: 8, y: 20, figura: 'negra', rot: 6, escala: 0.8, dur: 27, retraso: -15 },
  { x: 3, y: 34, figura: 'semicorcheas', rot: -5, escala: 0.9, dur: 31, retraso: -8 },
  { x: 9, y: 47, figura: 'silencio-corchea', rot: 4, escala: 0.9, dur: 24, retraso: -13 },
  { x: 2, y: 60, figura: 'blanca', rot: 12, escala: 1.1, dur: 28, retraso: -21 },
  { x: 7, y: 74, figura: 'corcheas', rot: -8, escala: 0.9, dur: 29, retraso: -5 },
  { x: 3, y: 88, figura: 'negra', rot: 5, escala: 1, dur: 25, retraso: -18 },
  // Franja derecha
  { x: 97, y: 5, figura: 'negra', rot: 9, escala: 1, dur: 26, retraso: -11 },
  { x: 91, y: 18, figura: 'corcheas', rot: 8, escala: 0.9, dur: 29, retraso: -19 },
  { x: 97, y: 31, figura: 'corchea', rot: -11, escala: 0.9, dur: 23, retraso: -6 },
  { x: 92, y: 45, figura: 'blanca', rot: -7, escala: 0.8, dur: 25, retraso: -4 },
  { x: 98, y: 58, figura: 'silencio-negra', rot: 4, escala: 1, dur: 30, retraso: -2 },
  { x: 92, y: 72, figura: 'semicorcheas', rot: 5, escala: 1, dur: 32, retraso: -24 },
  { x: 97, y: 86, figura: 'corchea', rot: -12, escala: 1, dur: 23, retraso: -1 },
  // Repartidas por el centro (asoman entre las secciones)
  { x: 22, y: 4, figura: 'corcheas', rot: 7, escala: 0.8, dur: 28, retraso: -10 },
  { x: 78, y: 3, figura: 'semicorcheas', rot: -6, escala: 0.8, dur: 31, retraso: -16 },
  { x: 50, y: 52, figura: 'corcheas', rot: -9, escala: 0.8, dur: 27, retraso: -9 },
  { x: 36, y: 44, figura: 'negra', rot: 7, escala: 0.7, dur: 24, retraso: -17 },
  { x: 64, y: 43, figura: 'corchea', rot: -6, escala: 0.7, dur: 26, retraso: -12 },
  { x: 18, y: 93, figura: 'blanca', rot: 9, escala: 0.8, dur: 27, retraso: -20 },
  { x: 82, y: 94, figura: 'negra', rot: -4, escala: 0.8, dur: 25, retraso: -7 },
];

export default function FondoNotas() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {NOTAS.map((n, i) => (
        <span
          key={i}
          className="nota-flota absolute text-red-900/20"
          style={{ left: `${n.x}%`, top: `${n.y}%`, animationDuration: `${n.dur}s`, animationDelay: `${n.retraso}s` }}
        >
          <span className="block" style={{ transform: `scale(${n.escala})` }}>
            <Nota figura={n.figura} y={n.figura.startsWith('silencio') ? 36 : n.figura === 'corchea' || n.figura === 'negra' ? 50 : 57} rot={n.rot} />
          </span>
        </span>
      ))}
    </div>
  );
}
