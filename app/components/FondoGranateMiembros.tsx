// Fondo decorativo compartido de la columna granate del área de miembros
// (login y recuperar). Reúne grano, profundidad, focos de luz (uno respira),
// la pauta musical ondulada, un marco de esquinas y el separador derecho.
// Va detrás del contenido (que se coloca con z-10 en cada página).

import PentagramaOla from './PentagramaOla';

export default function FondoGranateMiembros() {
  return (
    <>
      {/* Grano que texturiza el granate */}
      <div className="capa-grano" />

      {/* Profundidad: viñeta radial que oscurece los bordes y concentra la luz */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_95%_at_35%_28%,transparent_38%,rgba(69,10,10,0.55)_100%)]" />

      {/* Focos de luz: el primero "respira" (pulso lento), el segundo fija la sombra */}
      <div className="respira absolute top-[15%] left-[38%] w-72 h-72 rounded-full bg-red-500/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[8%] right-[4%] w-80 h-80 rounded-full bg-red-950/60 blur-3xl pointer-events-none" />

      {/* Pauta musical ondulada compacta en movimiento */}
      <PentagramaOla />

      {/* Marco editorial: esquinas decorativas (arriba-izq / abajo-der) */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-stone-50/25 pointer-events-none" />
      <div className="absolute bottom-8 right-10 w-8 h-8 border-b border-r border-stone-50/25 pointer-events-none" />

      {/* Separador vertical derecho */}
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-red-950 via-red-700 to-red-950 z-10" />
    </>
  );
}
