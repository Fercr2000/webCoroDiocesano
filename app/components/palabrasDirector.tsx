import Image from 'next/image';

export default function Director() {

  return (

    <section
      id="director"
      className="superficie-clara w-full py-32 md:py-40 overflow-hidden"
    >

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* EYEBROW */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Carta del director
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        {/* TITULAR */}
        <h2 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-6">
          Palabras del director
        </h2>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-16">
          Una carta abierta
        </p>

        {/* ORNAMENTO */}
        <div className="flex justify-center mb-20">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* GRID DE 2 COLUMNAS */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-stretch">

          {/* IZQUIERDA: FOTO */}
          <div className="relative h-full min-h-[500px] max-w-lg mx-auto w-full">

            {/* Esquinas decorativas sutiles */}
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t border-l border-red-800/30 z-20 pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t border-r border-red-800/30 z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b border-l border-red-800/30 z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b border-r border-red-800/30 z-20 pointer-events-none" />

            {/* Marco exterior fino */}
            <div className="absolute -inset-4 border border-red-800/15 pointer-events-none" />

            {/* Foto con sombra granate */}
            <div className="relative h-full w-full overflow-hidden shadow-2xl shadow-red-950/30">

              <Image
                src="/FotoDirectrorPalabras.png"
                alt="Fernando J. Camacho Rizquez, Director del Coro de la Diócesis de Jaén"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Sombreado suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent pointer-events-none" />

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

            {/* Cita del Salmo */}
            <blockquote className="relative z-10 font-serif italic text-xl md:text-2xl text-red-900 leading-relaxed border-l-2 border-red-800/60 pl-6">
              «Cantadle un cántico nuevo, tocad con maestría, aclamad.»
              <cite className="block not-italic text-xs tracking-[0.3em] uppercase text-red-800/70 mt-3 font-sans">
                Salmo 33, 3
              </cite>
            </blockquote>

            {/* Primer párrafo con letra capital */}
            <p className="relative z-10 font-serif text-lg md:text-xl leading-relaxed text-stone-700 first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:text-red-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
              En medio de tanto ruido, la música sacra sigue siendo uno de los pocos lugares donde el silencio tiene sentido. Donde una voz humana, sin amplificar, todavía puede conmover. Donde la belleza no se vende: se ofrece. Por eso seguimos cantándola — porque cada época la necesita a su manera, y la nuestra quizá más que ninguna.
            </p>

            {/* Segundo párrafo */}
            <p className="relative z-10 font-serif text-lg md:text-xl leading-relaxed text-stone-700">
              Y esa música pide tiempo. Detrás de cada nota que escuchas en una celebración hay semanas de ensayo, oído atento, oración compartida y la misma frase repetida hasta que respira.{' '}
              <span className="text-stone-900 font-medium">No es esfuerzo: es cuidado.</span>
              {' '}<em className="text-stone-800">«Cantar es propio del que ama»</em> —decía San Agustín— y el amor siempre se toma su tiempo. El cántico nuevo del salmo no se improvisa; se prepara con paciencia, con escucha, con muchas manos.
            </p>

            {/* Tercer párrafo: invitación */}
            <p className="relative z-10 font-serif text-lg md:text-xl leading-relaxed text-stone-700">
              Si has llegado hasta aquí, quizá este sea tu sitio. Trae tu voz, tu instrumento, tu presencia:{' '}
              <span className="text-stone-900 font-medium">aquí encontrarás tu sitio.</span>
            </p>

            {/* FIRMA */}
            <div className="relative z-10 pt-8 mt-4 flex items-center gap-6">
              <div className="h-px w-12 bg-red-800/60 flex-shrink-0" />
              <div>
                <p className="font-serif italic text-2xl text-stone-900">
                  Fernando J. Camacho Rizquez
                </p>
                <p className="text-xs tracking-[0.3em] uppercase text-red-800/80 mt-2">
                  Director del Coro de la Diócesis de Jaén
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
