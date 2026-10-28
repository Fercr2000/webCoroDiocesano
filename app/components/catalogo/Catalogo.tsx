'use client';

// Catálogo de obras montadas, a la manera de un índice de programa impreso:
// grupos con cabecera serif y, en cada uno, título y autor unidos por una
// línea de puntos. Se agrupa con el desplegable "Agrupar por", se filtra con
// el buscador y un índice permite saltar a cada grupo.

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import SelectorAgrupacion from './SelectorAgrupacion';
import { agrupar, autorDe, type Criterio, type Obra } from '@/lib/catalogo';

// Al agrupar por un dato, ese dato no se repite en las etiquetas de la obra.
const ETIQUETAS: Record<Criterio, (keyof Obra)[]> = {
  tipo: ['tipo', 'epoca', 'formacion'],
  autor: ['tipo', 'epoca', 'formacion'],
  epoca: ['tipo', 'formacion', 'idioma'],
  formacion: ['tipo', 'epoca', 'idioma'],
  idioma: ['tipo', 'epoca', 'formacion'],
  alfabetico: ['tipo', 'epoca', 'formacion'],
};

export default function Catalogo({ obras }: { obras: Obra[] }) {

  const [criterio, setCriterio] = useState<Criterio>('tipo');
  const [busqueda, setBusqueda] = useState('');

  const grupos = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    const filtradas = texto
      ? obras.filter((o) => o.titulo.toLowerCase().includes(texto) || o.compositor.toLowerCase().includes(texto))
      : obras;
    return agrupar(filtradas, criterio);
  }, [obras, criterio, busqueda]);

  const total = grupos.reduce((n, g) => n + g.obras.length, 0);
  const ancla = (clave: string) => `grupo-${clave.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div>

      {/* ============= CONTROLES ============= */}
      <div className="flex flex-col items-center gap-5 mb-8">
        <SelectorAgrupacion valor={criterio} onCambiar={setCriterio} />

        <div className="relative w-full max-w-md">
          <Search size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar obra o compositor..."
            className="w-full bg-white/70 border border-stone-300 rounded-full py-3 pl-12 pr-12 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-800 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <p className="text-sm italic text-stone-500">
          {total} {total === 1 ? 'obra' : 'obras'}
          {busqueda && ` que coinciden con «${busqueda}»`}
        </p>
      </div>

      {/* ============= ÍNDICE: saltar a cada grupo ============= */}
      {grupos.length > 1 && (
        <nav aria-label="Índice del catálogo" className="flex flex-wrap justify-center gap-x-1 gap-y-2 mb-14 max-w-3xl mx-auto">
          {grupos.map((g, i) => (
            <span key={g.clave} className="flex items-center">
              {i > 0 && <span className="text-red-800/40 mx-1.5">·</span>}
              <a
                href={`#${ancla(g.clave)}`}
                className="relative group text-[11px] tracking-[0.2em] uppercase text-stone-500 hover:text-red-800 transition-colors"
              >
                {g.titulo}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-red-800 group-hover:w-full transition-all duration-300" />
              </a>
            </span>
          ))}
        </nav>
      )}

      {/* ============= GRUPOS ============= */}
      {grupos.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif italic text-xl text-stone-500 mb-2">Ninguna obra coincide con «{busqueda}»</p>
          <p className="text-sm text-stone-400">Prueba con otro título o compositor.</p>
        </div>
      ) : (
        <div key={criterio} className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
          {grupos.map((g) => (
            <section key={g.clave} id={ancla(g.clave)} className="scroll-mt-32">

              {/* Cabecera del grupo */}
              <div className="flex items-baseline gap-4 mb-5">
                <h2 className={`font-serif text-stone-900 tracking-tight ${criterio === 'alfabetico' ? 'text-5xl text-red-800' : 'text-3xl'}`}>
                  {g.titulo}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent self-center" />
                <span className="text-xs italic text-stone-400">
                  {g.obras.length} {g.obras.length === 1 ? 'obra' : 'obras'}
                </span>
              </div>

              {/* Entradas del índice */}
              <ul className="grid md:grid-cols-2 gap-x-12">
                {g.obras.map((o) => (
                  <li key={o.id} className="group py-3 border-b border-stone-200/70">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-lg text-stone-900 group-hover:text-red-900 transition-colors">
                        {o.titulo}
                      </span>
                      <span className="flex-1 border-b border-dotted border-stone-300 translate-y-[-4px] min-w-6" />
                      <span className="font-serif italic text-stone-600 text-right">
                        {/* Agrupando por autor no se repite el nombre: fechas, o el detalle del anónimo */}
                        {criterio !== 'autor' ? o.compositor : o.compositor !== autorDe(o) ? o.compositor.replace(/^Anónimo\s*[·(]?\s*/, '').replace(/\)$/, '') : o.fechas}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] tracking-[0.2em] uppercase text-stone-400">
                      {ETIQUETAS[criterio].map((k) => o[k]).join(' · ')}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
