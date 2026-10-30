// Plantilla de las páginas legales (aviso legal, privacidad y cookies):
// cabecera de la casa, aviso de borrador, índice y secciones numeradas.
// Los datos pendientes van entre [corchetes] y se resaltan.

import FondoNotas from '../FondoNotas';

export interface SeccionLegal {
  titulo: string;
  parrafos: string[];
}

// Resalta lo que está entre [corchetes]: datos que faltan por confirmar.
function conPendientes(texto: string) {
  return texto.split(/(\[[^\]]+\])/g).map((trozo, i) =>
    trozo.startsWith('[') ? (
      <mark key={i} className="bg-red-50 text-red-900 px-1 rounded-sm">{trozo}</mark>
    ) : (
      trozo
    )
  );
}

export default function PaginaLegal({ titulo, subtitulo, actualizado, secciones }: { titulo: string; subtitulo: string; actualizado: string; secciones: SeccionLegal[] }) {
  return (
    <main className="superficie-crema w-full py-12 md:py-16">
      <FondoNotas soloLaterales />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">

        {/* CABECERA DE SECCIÓN */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">Información legal</span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h1 className="font-serif text-4xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">{titulo}</h1>
        <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-6">{subtitulo}</p>

        <div className="flex justify-center mb-10">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Aviso de borrador */}
        <p className="text-sm text-stone-600 leading-relaxed bg-red-50/60 border border-red-800/15 rounded-sm p-4 mb-10">
          <strong className="font-medium text-red-900">Borrador pendiente de revisión.</strong>{' '}
          Este texto es una base de trabajo y debe revisarlo la Diócesis antes de publicar la web.
          Los datos <mark className="bg-red-50 text-red-900 px-1 rounded-sm">[entre corchetes]</mark> están por confirmar.
        </p>

        {/* Índice */}
        <nav aria-label="Índice" className="mb-12">
          <ol className="space-y-1.5">
            {secciones.map((s, i) => (
              <li key={s.titulo}>
                <a href={`#seccion-${i + 1}`} className="group inline-flex gap-3 text-stone-600 hover:text-red-800 transition-colors">
                  <span className="font-serif text-red-800/70 tabular-nums">{i + 1}.</span>
                  <span className="underline decoration-stone-300 underline-offset-4 group-hover:decoration-red-800">{s.titulo}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Secciones */}
        <div className="space-y-10">
          {secciones.map((s, i) => (
            <section key={s.titulo} id={`seccion-${i + 1}`} className="scroll-mt-32">
              <h2 className="font-serif text-2xl md:text-3xl text-stone-900 tracking-tight mb-4">
                <span className="text-red-800/70 mr-3">{i + 1}.</span>{s.titulo}
              </h2>
              <div className="space-y-4">
                {s.parrafos.map((p, j) => (
                  <p key={j} className="text-stone-700 leading-relaxed">{conPendientes(p)}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-sm italic text-stone-400 mt-14">Última actualización: {actualizado}</p>
      </div>
    </main>
  );
}
