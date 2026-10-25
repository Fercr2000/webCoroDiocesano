// Fachada de la S.I. Catedral de Jaén dibujada a línea, con el mismo trazo
// blanco fino que el pentagrama. Solo contornos (fill="none"), así hereda
// el color del contenedor con currentColor.
// La torre se dibuja una vez y se refleja para la derecha; el reloj solo
// está en la torre izquierda, como en la fachada real.

// `trazo` va en unidades del dibujo (240 de ancho): a tamaño pequeño hay que
// engrosarlo para que la línea se vea igual que la del pentagrama.
export default function CatedralJaen({ className = '', trazo = 1 }: { className?: string; trazo?: number }) {
  return (
    <svg
      viewBox="0 -12 240 232"
      fill="none"
      stroke="currentColor"
      strokeWidth={trazo}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* ============= TORRE (izquierda; la derecha es su reflejo) ============= */}
        <g id="torre">
          {/* Cruz y linterna */}
          <path d="M36 -11 V2 M32 -6 H40" />
          <path d="M33.5 2 H38.5 V10 H33.5 Z" />
          {/* Cúpula */}
          <path d="M21 19 Q36 1 51 19" />
          <path d="M28.5 13 Q36 9 43.5 13" />
          <path d="M19 19 H53" />
          {/* Cuerpo octogonal con su vano */}
          <path d="M22 19 V36 M50 19 V36" />
          <path d="M32 34 V27 A4 4 0 0 1 40 27 V34" />
          <path d="M25 22 V34 M47 22 V34" />
          {/* Cornisa con pináculos en las esquinas */}
          <path d="M11 36 H61 M13 39 H59" />
          <path d="M14 36 L15.5 29 L17 36 M55 36 L56.5 29 L58 36" />
          {/* Campanario: dos arcos entre pilastras */}
          <path d="M14 39 V86 M58 39 V86" />
          <path d="M18 39 V86 M54 39 V86" />
          <path d="M21 80 V55 A6 6 0 0 1 33 55 V80" />
          <path d="M39 80 V55 A6 6 0 0 1 51 55 V80" />
          <path d="M36 42 V82" />
          <path d="M14 80 H58 M14 84 H58" />
          {/* Hornacinas en el cuerpo bajo de la torre */}
          <path d="M30 140 V120 A6 6 0 0 1 42 120 V140" />
          <path d="M30 200 V178 A6 6 0 0 1 42 178 V200" />
          <path d="M28 140 H44 M28 200 H44" />
        </g>
      </defs>

      <use href="#torre" />
      <use href="#torre" transform="translate(240 0) scale(-1 1)" />

      {/* Reloj de la torre izquierda */}
      <circle cx="36" cy="100" r="6" />
      <path d="M36 100 V96.5 M36 100 H38.5" />

      {/* ============= CUERPO DE LA FACHADA ============= */}
      {/* Contorno general y escalinata */}
      <path d="M10 88 V214 H230 V88" />
      <path d="M2 214 H238 M0 218 H240" />

      {/* Balaustrada superior con estatuas */}
      <path d="M10 88 H230 M10 92 H230" />
      {[70, 88, 152, 170].map((x) => (
        <g key={x}>
          <circle cx={x} cy="76" r="1.8" />
          <path d={`M${x - 2} 88 L${x - 1.2} 78.5 H${x + 1.2} L${x + 2} 88`} />
        </g>
      ))}

      {/* Ático central con frontón y estatua mayor */}
      <path d="M100 88 V76 H140 V88" />
      <path d="M98 76 L120 64 L142 76" />
      <circle cx="120" cy="56" r="2.2" />
      <path d="M117.5 64 L118.5 58.5 H121.5 L122.5 64" />
      <circle cx="120" cy="71" r="3" />

      {/* Balcón corrido entre los dos cuerpos */}
      <path d="M8 150 H232 M10 154 H230" />
      {Array.from({ length: 28 }, (_, i) => 16 + i * 7.8).map((x) => (
        <path key={x} d={`M${x} 146 V150`} />
      ))}
      <path d="M8 146 H232" />

      {/* Columnas pareadas (dos cuerpos) */}
      {[62, 98, 142, 178].map((x) => (
        <g key={x}>
          <path d={`M${x - 3} 92 V146 M${x + 3} 92 V146`} />
          <path d={`M${x - 3} 154 V214 M${x + 3} 154 V214`} />
          <path d={`M${x - 5} 95 H${x + 5} M${x - 5} 157 H${x + 5}`} />
        </g>
      ))}

      {/* Ventanas y hornacinas del cuerpo alto */}
      <path d="M111 140 V112 A9 9 0 0 1 129 112 V140" />
      <path d="M109 140 H131" />
      <path d="M76 140 V118 A4 4 0 0 1 84 118 V140" />
      <path d="M156 140 V118 A4 4 0 0 1 164 118 V140" />

      {/* Tres portadas */}
      <path d="M109 214 V186 A11 11 0 0 1 131 186 V214" />
      <path d="M105 214 V184 A15 15 0 0 1 135 184 V214" />
      <path d="M120 175 V214" />
      <path d="M73 214 V192 A7 7 0 0 1 87 192 V214" />
      <path d="M153 214 V192 A7 7 0 0 1 167 192 V214" />
      <path d="M70 182 H90 M150 182 H170" />
    </svg>
  );
}
