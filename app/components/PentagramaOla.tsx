// Pauta musical ondulada y en movimiento para los fondos granate (login y
// cartel del calendario). Banda COMPACTA (5 líneas juntas, como un
// pentagrama real) que fluye en bucle sin fin. El SVG mide el doble de ancho
// y se desplaza -50%: como las dos mitades son idénticas, el bucle es
// continuo y sin costura.
//
// Con `conNotas`, una segunda capa lleva figuras musicales que viajan a la
// misma velocidad. Van aparte porque el SVG de las líneas se estira a lo
// ancho (preserveAspectRatio="none") y deformaría cabezas y plicas.

interface PentagramaOlaProps {
  conNotas?: boolean;
  // Segundos que tarda en recorrer media pauta (más = más lento).
  duracion?: number;
  // Posición vertical dentro del contenedor (por defecto, al 80% de su alto).
  className?: string;
}

// Alturas (px) de las 5 líneas dentro de la banda de 72px.
const LINEAS = [8, 22, 36, 50, 64];

export type Figura = 'negra' | 'corchea' | 'blanca' | 'corcheas' | 'semicorcheas' | 'silencio-negra' | 'silencio-corchea';

// x: posición en % de cada mitad del recorrido. y: altura de la cabeza
// (sobre línea: 22, 50, 64; en espacio: 15, 29, 43, 57). rot: inclinación
// en grados, para que parezcan escritas a mano y no alineadas en fila.
// Valores fijos (no Math.random) para que servidor y navegador pinten lo mismo.
const NOTAS: { x: number; y: number; figura: Figura; rot: number }[] = [
  { x: 2, y: 50, figura: 'negra', rot: -9 },
  { x: 13, y: 36, figura: 'silencio-negra', rot: 5 },
  { x: 22, y: 57, figura: 'semicorcheas', rot: -6 },
  { x: 41, y: 22, figura: 'corchea', rot: 11 },
  { x: 52, y: 43, figura: 'blanca', rot: -12 },
  { x: 63, y: 36, figura: 'silencio-corchea', rot: 7 },
  { x: 72, y: 50, figura: 'corcheas', rot: 9 },
  { x: 88, y: 15, figura: 'negra', rot: -4 },
];

export default function PentagramaOla({ conNotas = false, duracion = 16, className = 'top-[80%] -translate-y-1/2' }: PentagramaOlaProps) {

  const amplitud = 6;
  const ritmo = { animationDuration: `${duracion}s` };

  // Onda suave: sube el primer cuarto y sigue con "T" (cuadráticas suaves)
  // que alternan cresta/valle. Longitud de onda 240 → 6 ondas en 1440 (par),
  // así las mitades coinciden y el desplazamiento -50% no tiene costura.
  const onda = (y: number) => {
    let d = `M 0 ${y} Q 60 ${y - amplitud} 120 ${y}`;
    for (let x = 240; x <= 1440; x += 120) {
      d += ` T ${x} ${y}`;
    }
    return d;
  };

  return (
    <div className={`absolute inset-x-0 h-[72px] overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <svg
        className="pentagrama-ola block h-full w-[200%] opacity-[0.16]"
        style={ritmo}
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        fill="none"
      >
        {LINEAS.map((y) => (
          <path key={y} d={onda(y)} stroke="#fafaf9" strokeWidth="1.4" />
        ))}
      </svg>

      {conNotas && (
        <div className="pentagrama-ola absolute inset-y-0 left-0 w-[200%] opacity-40 text-stone-50" style={ritmo}>
          {/* Las mismas notas en las dos mitades, para que el bucle no tenga costura. */}
          {[0, 50].map((mitad) =>
            NOTAS.map((n, i) => (
              <span key={`${mitad}-${i}`} className="absolute top-0 h-full" style={{ left: `${mitad + n.x / 2}%` }}>
                <Nota {...n} />
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============= FIGURAS =============
// Exportadas: el fondo de Componentes reutiliza las mismas figuras flotando.

const LARGO_PLICA = 38;

// Cabeza ovalada inclinada (hueca en la blanca).
function Cabeza({ cx, cy, hueca = false }: { cx: number; cy: number; hueca?: boolean }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx="5.6"
      ry="4"
      transform={`rotate(-20 ${cx} ${cy})`}
      fill={hueca ? 'none' : 'currentColor'}
      stroke="currentColor"
      strokeWidth={hueca ? 1.6 : 0}
    />
  );
}

export function Nota({ figura, y, rot }: { figura: Figura; y: number; rot: number }) {

  const arriba = y >= 36;   // plica hacia arriba en las notas graves
  const s = arriba ? -1 : 1;
  const xPlica = (cx: number) => (arriba ? cx + 5.2 : cx - 5.2);
  const punta = y + s * LARGO_PLICA;

  const anchos: Record<Figura, number> = {
    negra: 24, corchea: 28, blanca: 24, corcheas: 40, semicorcheas: 58, 'silencio-negra': 18, 'silencio-corchea': 18,
  };
  const ancho = anchos[figura];

  // Corchete de corchea (o segundo corchete, desplazado `d` hacia la cabeza).
  const corchete = (cx: number, d = 0) => (
    <path
      d={`M${xPlica(cx)} ${punta - s * d} q1 ${-7 * s} 7 ${-10 * s} q3 ${-3 * s} 0 ${-10 * s}`}
      stroke="currentColor"
      strokeWidth="1.4"
      fill="none"
    />
  );

  // Grupo de notas unidas por barra(s): cabezas en `xs` a alturas `ys`,
  // plicas hasta una barra recta entre la primera y la última punta.
  const grupo = (xs: number[], ys: number[], barras: number) => {
    const x0 = xPlica(xs[0]);
    const x1 = xPlica(xs.at(-1)!);
    const p0 = ys[0] + s * LARGO_PLICA;
    const p1 = ys.at(-1)! + s * LARGO_PLICA;
    const enBarra = (x: number) => p0 + ((x - x0) / (x1 - x0)) * (p1 - p0);
    return (
      <>
        {xs.map((cx, i) => (
          <g key={cx}>
            <Cabeza cx={cx} cy={ys[i]} />
            <line x1={xPlica(cx)} y1={ys[i]} x2={xPlica(cx)} y2={enBarra(xPlica(cx))} stroke="currentColor" strokeWidth="1.3" />
          </g>
        ))}
        {Array.from({ length: barras }, (_, b) => {
          const d = -s * b * 6;   // las barras se apilan hacia las cabezas
          return <path key={b} d={`M${x0} ${p0 + d} L${x1} ${p1 + d} l0 ${-s * 3.5} L${x0} ${p0 + d - s * 3.5} Z`} fill="currentColor" />;
        })}
      </>
    );
  };

  let contenido: React.ReactNode;
  switch (figura) {
    case 'semicorcheas':
      // Cuatro semicorcheas: sube y baja como un pequeño giro melódico.
      contenido = grupo([8, 21, 34, 47], [y, y - 7, y - 14, y - 7], 2);
      break;
    case 'corcheas':
      contenido = grupo([8, 28], [y, y - 7], 1);
      break;
    case 'silencio-negra':
      contenido = (
        <path
          d={`M7 ${y - 16} l6 8 l-5 6 l6 8 q-7 -3 -4 7`}
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
          strokeLinejoin="round"
        />
      );
      break;
    case 'silencio-corchea':
      contenido = (
        <>
          <circle cx="6" cy={y - 6} r="2.6" fill="currentColor" />
          <path d={`M6 ${y - 4} q5 2 8 -3 L8 ${y + 12}`} stroke="currentColor" strokeWidth="1.5" fill="none" />
        </>
      );
      break;
    default:
      contenido = (
        <>
          <Cabeza cx={12} cy={y} hueca={figura === 'blanca'} />
          <line x1={xPlica(12)} y1={y} x2={xPlica(12)} y2={punta} stroke="currentColor" strokeWidth="1.3" />
          {figura === 'corchea' && corchete(12)}
        </>
      );
  }

  return (
    <svg
      width={ancho}
      height="72"
      viewBox={`0 0 ${ancho} 72`}
      className="overflow-visible"
      style={{ transform: `translateX(-50%) rotate(${rot}deg)` }}
    >
      {contenido}
    </svg>
  );
}
