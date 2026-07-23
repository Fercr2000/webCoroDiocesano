// Pauta musical ondulada y en movimiento para el fondo granate del área de
// miembros. Banda COMPACTA (5 líneas juntas, como un pentagrama real) que
// fluye en bucle sin fin. El SVG mide el doble de ancho y se desplaza -50%:
// como las dos mitades son idénticas, el bucle es continuo y sin costura.

export default function PentagramaOla() {

  // Líneas juntas dentro de un viewBox bajo (72) → pentagrama compacto.
  const lineas = [8, 22, 36, 50, 64];
  const amplitud = 6;

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
    <div className="absolute inset-x-0 top-[80%] -translate-y-1/2 h-[72px] overflow-hidden pointer-events-none opacity-[0.16]">
      <svg
        className="pentagrama-ola block h-full w-[200%]"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {lineas.map((y) => (
          <path key={y} d={onda(y)} stroke="#fafaf9" strokeWidth="1.4" />
        ))}
      </svg>
    </div>
  );
}
