// Iconos a línea de las herramientas de la Sala de ensayo (mismo trazo fino
// que los de Componentes). Se animan al pasar el ratón por su tarjeta (.group).

const base = { width: 72, height: 72, viewBox: '0 0 72 72', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export function IconoPiano() {
  return (
    <svg {...base}>
      <rect x="8" y="20" width="56" height="34" rx="1.5" />
      {[16, 24, 32, 40, 48, 56].map((x) => <line key={x} x1={x} y1="20" x2={x} y2="54" />)}
      {[13, 21, 37, 45, 53].map((x) => (
        <rect key={x} x={x} y="20" width="6" height="19" fill="currentColor" className={x === 37 ? 'transition-transform duration-300 group-hover:translate-y-0.5' : ''} />
      ))}
      <line x1="8" y1="16" x2="64" y2="16" strokeWidth="2.4" className="text-red-800" stroke="currentColor" />
    </svg>
  );
}

export function IconoMetronomo() {
  return (
    <svg {...base}>
      <path d="M28 8 h16 l12 52 h-40 z" />
      <line x1="16" y1="60" x2="56" y2="60" />
      <line x1="22" y1="66" x2="50" y2="66" />
      <line x1="25" y1="44" x2="47" y2="44" opacity="0.5" />
      <g className="sala-pendulo" style={{ transformOrigin: '36px 52px', transformBox: 'view-box' }}>
        <line x1="36" y1="52" x2="36" y2="12" />
        <rect x="32" y="22" width="8" height="6" rx="1" fill="currentColor" className="text-red-800" stroke="none" />
      </g>
    </svg>
  );
}

export function IconoAfinador() {
  return (
    <svg {...base}>
      <path d="M10 50 a26 26 0 0 1 52 0" />
      {[-60, -30, 0, 30, 60].map((g) => {
        const rad = ((g - 90) * Math.PI) / 180;
        return <line key={g} x1={36 + 26 * Math.cos(rad)} y1={50 + 26 * Math.sin(rad)} x2={36 + 20 * Math.cos(rad)} y2={50 + 20 * Math.sin(rad)} className={g === 0 ? 'text-red-800' : ''} />;
      })}
      <g className="sala-aguja" style={{ transformOrigin: '36px 50px', transformBox: 'view-box', transform: 'rotate(-22deg)' }}>
        <line x1="36" y1="50" x2="36" y2="28" strokeWidth="1.8" className="text-red-800" />
      </g>
      <circle cx="36" cy="50" r="2.6" fill="currentColor" />
      <line x1="14" y1="60" x2="58" y2="60" opacity="0.4" />
    </svg>
  );
}

export function IconoVoz() {
  return (
    <svg {...base}>
      {/* Pentagrama corto con una nota y la flecha de afinación */}
      {[30, 36, 42, 48, 54].map((y) => <line key={y} x1="8" y1={y} x2="64" y2={y} opacity="0.35" />)}
      <ellipse cx="30" cy="45" rx="5.5" ry="4" transform="rotate(-20 30 45)" fill="currentColor" />
      <line x1="35" y1="44" x2="35" y2="16" />
      <path d="M50 26 v-12 m-4 4 l4 -4 l4 4" className="text-red-800 transition-transform duration-500 group-hover:-translate-y-1" />
      <path d="M50 56 v-12" className="text-red-800" opacity="0.5" />
      <rect x="46" y="31" width="8" height="8" transform="rotate(45 50 35)" fill="currentColor" className="text-red-800" stroke="none" />
    </svg>
  );
}
