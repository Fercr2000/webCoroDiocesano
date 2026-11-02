// Pentagrama con la nota que hay que cantar (redonda), en la clave de cada
// cuerda: sol (soprano y contralto), sol octavada (tenor) y fa (bajo).
// `cantada` (en semitonos, admite decimales) dibuja un punto granate donde
// está la voz en ese momento, para ver de un vistazo si sube o baja.

import { nombreNota } from '@/lib/sala/notas';

export type Clave = 'sol' | 'sol8' | 'fa';

const LETRAS = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
// Escalón diatónico de la línea inferior de cada clave: Mi4 (sol), Mi3 (sol octavada, se escribe una 8ª arriba) y Sol2 (fa).
const LINEA_INFERIOR: Record<Clave, number> = { sol: 4 * 7 + 2, sol8: 3 * 7 + 2, fa: 2 * 7 + 4 };

const ABAJO = 100;   // y de la línea inferior
const PASO = 6;      // media distancia entre líneas
const NOTA_X = 150;

const y = (posicion: number) => ABAJO - posicion * PASO;

export default function Pentagrama({ midi, bemoles, clave, cantada = null, className = '' }: { midi: number; bemoles: boolean; clave: Clave; cantada?: number | null; className?: string }) {
  const nota = nombreNota(midi, bemoles);
  // Ningún nombre de nota es el principio de otro: basta con startsWith.
  const letra = LETRAS.findIndex((l) => nota.nombre.startsWith(l));
  const alteracion = nota.nombre.endsWith('♯') ? '♯' : nota.nombre.endsWith('♭') ? '♭' : '';
  const posicion = nota.octava * 7 + letra - LINEA_INFERIOR[clave];
  const adicionales: number[] = [];
  for (let k = -2; k >= posicion; k -= 2) adicionales.push(k);
  for (let k = 10; k <= posicion; k += 2) adicionales.push(k);

  // La voz: misma posición que la nota si está afinada; 7 escalones por octava.
  const posicionVoz = cantada === null ? null : Math.max(-9, Math.min(15, posicion + ((cantada - midi) * 7) / 12));

  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label={`${nota.nombre}${nota.octava} en clave de ${clave === 'fa' ? 'fa' : 'sol'}`}>
      {/* Cinco líneas */}
      {[0, 2, 4, 6, 8].map((p) => <line key={p} x1="8" y1={y(p)} x2="232" y2={y(p)} className="stroke-stone-400" strokeWidth="1" />)}

      {/* Clave */}
      {clave === 'fa' ? (
        <g className="text-stone-800" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
          <circle cx="22" cy={y(6)} r="4" fill="currentColor" stroke="none" />
          <path d={`M 22 ${y(6)} C 21 ${y(8) - 2}, 37 ${y(8.6)}, 41 ${y(6.6)} C 45 ${y(4.4)}, 36 ${y(1.2)}, 18 ${y(-0.6)}`} />
          <circle cx="50" cy={y(7)} r="2.3" fill="currentColor" stroke="none" />
          <circle cx="50" cy={y(5)} r="2.3" fill="currentColor" stroke="none" />
        </g>
      ) : (
        <g className="text-stone-800" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M 33 ${y(1.6)} C 24 ${y(1.2)}, 22 ${y(3.4)}, 28 ${y(4.2)} C 35 ${y(5.2)}, 43 ${y(3.8)}, 42 ${y(2)} C 41 ${y(-0.4)}, 26 ${y(-0.8)}, 21 ${y(1.4)} C 16 ${y(3.8)}, 26 ${y(6.8)}, 33 ${y(8.6)} C 38 ${y(10)}, 39 ${y(12.2)}, 35 ${y(12.4)} C 30 ${y(12.6)}, 28 ${y(10.6)}, 30 ${y(8.2)} L 36 ${y(-2.6)} C 37 ${y(-3.8)}, 30 ${y(-4.4)}, 27 ${y(-3.4)}`} />
          <circle cx="27.5" cy={y(-3.2)} r="2.6" fill="currentColor" stroke="none" />
          {clave === 'sol8' && <text x="33" y={y(-5.6)} textAnchor="middle" className="fill-stone-800 font-serif text-[11px]" stroke="none">8</text>}
        </g>
      )}

      {/* Líneas adicionales */}
      {adicionales.map((k) => <line key={k} x1={NOTA_X - 15} y1={y(k)} x2={NOTA_X + 15} y2={y(k)} className="stroke-stone-500" strokeWidth="1.2" />)}

      {/* Alteración */}
      {alteracion && (
        <text x={NOTA_X - 22} y={y(posicion) + 6} textAnchor="middle" className="fill-stone-900 font-serif text-[20px]">{alteracion}</text>
      )}

      {/* Redonda */}
      <ellipse cx={NOTA_X} cy={y(posicion)} rx="8.5" ry="6" className="fill-stone-900" />
      <ellipse cx={NOTA_X} cy={y(posicion)} rx="3.4" ry="5" transform={`rotate(-40 ${NOTA_X} ${y(posicion)})`} className="fill-white" />

      {/* Tu voz */}
      {posicionVoz !== null && (
        <g style={{ transform: `translateY(${y(posicionVoz) - y(posicion)}px)`, transition: 'transform 120ms linear' }}>
          <line x1={NOTA_X + 12} y1={y(posicion)} x2={NOTA_X + 44} y2={y(posicion)} className="stroke-red-800/40" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx={NOTA_X + 50} cy={y(posicion)} r="5.5" className="fill-red-800" />
          <text x={NOTA_X + 62} y={y(posicion) + 4} className="fill-red-800 text-[10px]">tu voz</text>
        </g>
      )}
    </svg>
  );
}
