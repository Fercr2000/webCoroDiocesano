// Esfera de afinador: arco con marcas, zona de tolerancia y aguja granate.
// `cents` null = sin lectura (aguja en reposo y apagada). Si la desviación se
// sale del arco, la aguja se queda en el tope y el extremo se ilumina.

const ANGULO = 60; // grados a cada lado del centro

export default function Esfera({ cents, rango = 50, tolerancia = 5, className = '' }: { cents: number | null; rango?: number; tolerancia?: number; className?: string }) {
  const cx = 160, cy = 168, r = 136;
  const angulo = (c: number) => (Math.max(-rango, Math.min(rango, c)) / rango) * ANGULO;
  const punto = (grados: number, radio: number) => {
    const rad = ((grados - 90) * Math.PI) / 180;
    // Redondeo: Node y el navegador difieren en el último decimal y React avisaría al hidratar.
    const r2 = (v: number) => Math.round(v * 100) / 100;
    return [r2(cx + radio * Math.cos(rad)), r2(cy + radio * Math.sin(rad))] as const;
  };
  const arco = (desde: number, hasta: number, radio: number) => {
    const [x1, y1] = punto(desde, radio);
    const [x2, y2] = punto(hasta, radio);
    return `M ${x1} ${y1} A ${radio} ${radio} 0 0 1 ${x2} ${y2}`;
  };

  const afinado = cents !== null && Math.abs(cents) <= tolerancia;
  const fuera = cents !== null && Math.abs(cents) > rango;
  const paso = rango / 10;
  const marcas = Array.from({ length: 21 }, (_, i) => -rango + i * paso);
  const etiquetas = [-rango, -rango / 2, 0, rango / 2, rango];

  return (
    <svg viewBox="0 0 320 190" className={`w-full ${className}`} role="img" aria-label={cents === null ? 'Sin lectura' : `${Math.round(cents)} cents`}>
      {/* Zona de tolerancia */}
      <path d={arco(angulo(-tolerancia), angulo(tolerancia), r - 10)} stroke="currentColor" strokeWidth="20" fill="none"
        className={`transition-colors duration-300 ${afinado ? 'text-red-800/30' : 'text-red-800/8'}`} />

      {/* Marcas */}
      {marcas.map((c) => {
        const mayor = Math.abs(c) % (rango / 2) < 0.001;
        const [x1, y1] = punto(angulo(c), r);
        const [x2, y2] = punto(angulo(c), r - (mayor ? 18 : c === 0 ? 22 : 9));
        return <line key={c} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={mayor ? 1.4 : 0.8} className={c === 0 ? 'text-red-800' : 'text-stone-400'} />;
      })}
      {etiquetas.map((c) => {
        const [x, y] = punto(angulo(c), r + 14);
        return (
          <text key={c} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-stone-400 text-[10px] tabular-nums">
            {c > 0 ? `+${c}` : c}
          </text>
        );
      })}

      {/* Bemol / sostenido a los lados */}
      <text x={punto(-ANGULO - 8, r - 30)[0]} y={punto(-ANGULO - 8, r - 30)[1]} textAnchor="middle" className={`font-serif text-[22px] transition-colors ${fuera && cents! < 0 ? 'fill-red-800' : 'fill-stone-300'}`}>♭</text>
      <text x={punto(ANGULO + 8, r - 30)[0]} y={punto(ANGULO + 8, r - 30)[1]} textAnchor="middle" className={`font-serif text-[22px] transition-colors ${fuera && cents! > 0 ? 'fill-red-800' : 'fill-stone-300'}`}>♯</text>

      {/* Rombo de "afinado" sobre el centro */}
      <rect x={cx - 6} y={cy - r - 26} width="12" height="12" transform={`rotate(45 ${cx} ${cy - r - 20})`}
        className={`transition-colors duration-300 ${afinado ? 'fill-red-800' : 'fill-none stroke-stone-300'}`} />

      {/* Aguja */}
      <g style={{ transform: `rotate(${cents === null ? 0 : angulo(cents)}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: 'transform 120ms linear' }}
        className={cents === null ? 'opacity-25' : 'opacity-100'}>
        <line x1={cx} y1={cy + 10} x2={cx} y2={cy - r + 14} stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-800" />
      </g>
      <circle cx={cx} cy={cy} r="7" className="fill-red-900" />
      <circle cx={cx} cy={cy} r="2.5" className="fill-stone-50" />
    </svg>
  );
}
