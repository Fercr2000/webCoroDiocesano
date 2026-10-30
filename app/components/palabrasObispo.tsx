import FondoNotas from './FondoNotas';

// Inicio: palabras de nuestro Obispo, Mons. Sebastián Chico Martínez, con la
// misma composición que tenía la carta del director (foto enmarcada, cita,
// párrafo con capital y firma). Textos de prueba (lorem ipsum) y marcador en
// lugar de foto hasta tener los definitivos. Las palabras del Director están
// en Sobre nosotros (/sobre-nosotros/director).

export default function PalabrasObispo() {

  return (

    <section
      id="obispo"
      className="superficie-clara w-full py-16 md:py-24 overflow-hidden"
    >

      {/* Notas flotando de fondo, como en el resto de la web */}
      <FondoNotas soloLaterales />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* EYEBROW */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Carta del Obispo
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        {/* TITULAR */}
        <h2 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
          Palabras de nuestro Obispo
        </h2>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">
          Una carta abierta
        </p>

        {/* ORNAMENTO */}
        <div className="flex justify-center mb-14">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* GRID DE 2 COLUMNAS */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-stretch">

          {/* IZQUIERDA: FOTO */}
          <div className="relative h-full min-h-[440px] max-w-md mx-auto w-full">

            {/* Esquinas decorativas sutiles */}
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t border-l border-red-800/30 z-20 pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t border-r border-red-800/30 z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b border-l border-red-800/30 z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b border-r border-red-800/30 z-20 pointer-events-none" />

            {/* Marco exterior fino */}
            <div className="absolute -inset-4 border border-red-800/15 pointer-events-none" />

            {/* Marcador hasta tener la foto: la inicial en serif, con sombra granate */}
            <div className="relative h-full w-full overflow-hidden shadow-2xl shadow-red-950/30 flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
              <span className="font-serif text-9xl text-red-800/70 leading-none">S</span>
              <svg width="14" height="14" viewBox="0 0 14 14" className="mt-6 text-red-800/50" aria-hidden="true">
                <rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" fill="currentColor" />
              </svg>
              <span className="mt-4 text-[10px] tracking-[0.4em] uppercase text-stone-400">Foto pendiente</span>
            </div>

          </div>

          {/* DERECHA: TEXTO */}
          <div className="relative flex flex-col justify-center space-y-6">

            {/* Comilla gigante decorativa */}
            <div
              aria-hidden="true"
              className="absolute -top-16 -left-4 text-[12rem] text-red-800/10 font-serif leading-none select-none pointer-events-none"
            >
              «
            </div>

            {/* Cita (de prueba) */}
            <blockquote className="relative z-10 font-serif italic text-xl md:text-2xl text-red-900 leading-relaxed border-l-2 border-red-800/60 pl-6">
              «Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.»
              <cite className="block not-italic text-xs tracking-[0.3em] uppercase text-red-800/70 mt-3 font-sans">
                Texto de prueba
              </cite>
            </blockquote>

            {/* Primer párrafo con letra capital */}
            <p className="relative z-10 font-serif text-lg md:text-xl leading-relaxed text-stone-700 first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:text-red-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis consectetur purus sit amet fermentum, vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo.
            </p>

            {/* FIRMA */}
            <div className="relative z-10 pt-8 mt-4 flex items-center gap-6">
              <div className="h-px w-12 bg-red-800/60 flex-shrink-0" />
              <div>
                <p className="font-serif italic text-2xl text-stone-900">
                  Mons. Sebastián Chico Martínez
                </p>
                <p className="text-xs tracking-[0.3em] uppercase text-red-800/80 mt-2">
                  Obispo de Jaén
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

    </section>
  );
}
