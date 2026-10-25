// Icono de línea de cada sección del escenario (voces, cada instrumento,
// batuta del director). Trazo fino como los iconos de lucide del resto de
// la web; hereda el color del texto con currentColor.

const DIBUJOS: Record<string, React.ReactNode> = {
  // Dos corcheas unidas: el coro
  voces: (
    <>
      <path d="M9 17.5V6l10-2v11.5" />
      <path d="M9 9l10-2" />
      <ellipse cx="7" cy="17.5" rx="2.2" ry="1.7" fill="currentColor" stroke="none" />
      <ellipse cx="17" cy="15.5" rx="2.2" ry="1.7" fill="currentColor" stroke="none" />
    </>
  ),
  // Violín: caja en ocho, mástil, voluta y puente
  violin: (
    <>
      <path d="M12 8.5c-2.4 0-3.4 1.5-2.9 3 .3 1-.9 1.5-.9 3.2 0 2.3 1.7 3.8 3.8 3.8s3.8-1.5 3.8-3.8c0-1.7-1.2-2.2-.9-3.2.5-1.5-.5-3-2.9-3z" />
      <path d="M12 8.5V3" />
      <circle cx="12" cy="2.4" r="0.7" />
      <path d="M10.6 15h2.8" />
    </>
  ),
  // Violonchelo / contrabajo: como el violín pero con pica
  chelo: (
    <>
      <path d="M12 7c-2.6 0-3.6 1.6-3.1 3.2.3 1.1-1 1.6-1 3.4 0 2.5 1.8 4.1 4.1 4.1s4.1-1.6 4.1-4.1c0-1.8-1.3-2.3-1-3.4C15.6 8.6 14.6 7 12 7z" />
      <path d="M12 7V2" />
      <path d="M10.5 14h3" />
      <path d="M12 17.7V22" />
    </>
  ),
  // Flauta travesera con sus orificios
  flauta: (
    <>
      <path d="M2.5 15.5l19-7" />
      <circle cx="9" cy="13.1" r="0.6" fill="currentColor" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      <circle cx="15" cy="10.9" r="0.6" fill="currentColor" />
    </>
  ),
  // Oboe: tubo fino con lengüeta y campana pequeña
  oboe: (
    <>
      <path d="M12 3.5V18" />
      <path d="M11.4 2h1.2" />
      <path d="M11 18h2l.8 3.5h-3.6z" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" />
      <circle cx="12" cy="11" r="0.6" fill="currentColor" />
      <circle cx="12" cy="14" r="0.6" fill="currentColor" />
    </>
  ),
  // Clarinete: boquilla, tubo y campana ancha
  clarinete: (
    <>
      <path d="M11.3 2.5h1.4v2h-1.4z" />
      <path d="M12 4.5V17" />
      <path d="M10.5 17h3l1.5 4.5H9z" />
      <circle cx="12" cy="9" r="0.6" fill="currentColor" />
      <circle cx="12" cy="12.5" r="0.6" fill="currentColor" />
    </>
  ),
  // Fagot: tubo alto doblado con su tudel curvo
  fagot: (
    <>
      <rect x="9.5" y="5" width="4" height="16.5" rx="1" />
      <path d="M11.5 5c0-2.2 2.8-3 4.5-1.6" />
      <path d="M9.5 15h4" />
    </>
  ),
  // Trompa: tubo enrollado y pabellón
  trompa: (
    <>
      <circle cx="10" cy="13" r="6" />
      <circle cx="10" cy="13" r="2.8" />
      <path d="M15 9.5l5.5-4v8z" />
    </>
  ),
  // Trompeta: tubo, pistones y campana
  trompeta: (
    <>
      <path d="M2.5 12.5h12" />
      <path d="M2.5 11v3" />
      <path d="M14.5 10l7-3.5v12l-7-3.5z" />
      <path d="M7 9v3.5M9.5 9v3.5M12 9v3.5" />
    </>
  ),
  // Trombón: vara y campana
  trombon: (
    <>
      <path d="M2.5 9.5h12M2.5 14h12M2.5 9.5v4.5" />
      <path d="M14.5 9.5l7-3.5v11.5l-7-3.5" />
      <path d="M8 9.5v4.5" />
    </>
  ),
  // Órgano: teclado con teclas negras
  teclado: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="1" />
      <path d="M7.25 6.5v11M12 6.5v11M16.75 6.5v11" />
      <rect x="6.1" y="6.5" width="2.3" height="6" fill="currentColor" stroke="none" />
      <rect x="10.85" y="6.5" width="2.3" height="6" fill="currentColor" stroke="none" />
      <rect x="15.6" y="6.5" width="2.3" height="6" fill="currentColor" stroke="none" />
    </>
  ),
  // Percusión: dos timbales con baqueta
  timbales: (
    <>
      <path d="M2.5 11.5h8a4 4 0 0 1-8 0z" />
      <path d="M13.5 11.5h8a4 4 0 0 1-8 0z" />
      <path d="M4.5 15l-1 6M8.5 15l1 6M15.5 15l-1 6M19.5 15l1 6" />
      <path d="M5 3.5l3.5 6.5" />
      <circle cx="4.6" cy="3" r="1.1" fill="currentColor" />
    </>
  ),
  // Director: batuta
  batuta: (
    <>
      <path d="M6 18L19.5 4.5" />
      <path d="M3.5 20.5l3-3" strokeWidth="3" />
    </>
  ),
};

// Qué dibujo lleva cada sección del escenario.
const DIBUJO_DE: Record<string, keyof typeof DIBUJOS> = {
  tenores: 'voces', bajos: 'voces', sopranos: 'voces', contraltos: 'voces',
  'violines-1': 'violin', 'violines-2': 'violin', violas: 'violin',
  violonchelos: 'chelo', contrabajos: 'chelo',
  flautas: 'flauta', oboes: 'oboe', clarinetes: 'clarinete', fagotes: 'fagot',
  trompas: 'trompa', trompetas: 'trompeta', trombones: 'trombon',
  organo: 'teclado', percusion: 'timbales', director: 'batuta',
};

export default function IconoSeccion({ seccionId, className = '' }: { seccionId: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {DIBUJOS[DIBUJO_DE[seccionId]]}
    </svg>
  );
}
