// Sección "Forma parte" del inicio: cabecera de la casa + formulario de inscripción.

import FondoNotas from './FondoNotas';
import FormularioInscripcion from './FormularioInscripcion';

export default function Inscription() {

  return (

    <section
      id="inscripcion"
      className="relative w-full bg-stone-50 py-32 md:py-40 overflow-hidden"
    >

      {/* Notas flotando de fondo, como en el resto de la web */}
      <FondoNotas soloLaterales />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-red-900/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-red-900/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12">

        {/* CABECERA */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Forma parte
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h2 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-6">
          Tu voz, tu instrumento, su gloria
        </h2>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-16">
          Aquí empieza tu camino
        </p>

        <div className="flex justify-center mb-16">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <FormularioInscripcion />

      </div>
    </section>
  );
}
