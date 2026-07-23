export default function About() {

  return (

    <section
      id="quienes-somos"
      className="superficie-crema w-full py-32 md:py-40"
    >

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">

        {/* EYEBROW */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Quiénes somos
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        {/* TITULAR */}
        <h2 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-6">
          Servir cantando
        </h2>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-16">
          Cantar sirviendo
        </p>

        {/* ORNAMENTO */}
        <div className="flex justify-center mb-20">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* DOS COLUMNAS */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-24">

          <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">
            El{' '}
            <span className="text-stone-900 font-medium">Coro de la Diócesis de Jaén</span>
            {' '}existe para servir cantando. Para acompañar la Liturgia con repertorio cuidado, abierto a la gran tradición de la música sacra y atento a las necesidades de cada celebración.
          </p>

          <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">
            Reunimos a cantores e instrumentistas que comparten una convicción: que la música, cuando es verdadera, abre el alma a aquello que la liturgia celebra.{' '}
            <span className="text-stone-900 font-medium">No buscamos el aplauso, sino la verdad de cada nota; no la brillantez, sino el servicio.</span>
          </p>

        </div>

        {/* CITA FINAL */}
        <div className="relative pt-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-red-800/60" />
          <blockquote className="font-serif italic text-3xl md:text-4xl text-stone-800 text-center leading-snug max-w-4xl mx-auto">
            «Una voz al servicio de la Iglesia diocesana, donde la belleza se hace oración.»
          </blockquote>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

    </section>
  );
}
