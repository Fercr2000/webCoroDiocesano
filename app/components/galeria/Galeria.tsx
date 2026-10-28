'use client';

// Galería: carpetas (álbumes) agrupadas por mes, de la más reciente a la más
// antigua, con chips para filtrar por tipo de momento (celebraciones,
// conciertos, ensayos, convivencias). Al pulsar una carpeta se abre el álbum.

import { useState, useMemo, useCallback } from 'react';
import CarpetaAlbum from './CarpetaAlbum';
import VisorAlbum from './VisorAlbum';
import { MESES, partesFecha } from '@/lib/fechas';
import { CATEGORIAS, type Album, type Categoria } from '@/lib/galeria';

type Filtro = 'Todas' | Categoria;

export default function Galeria({ albumes }: { albumes: Album[] }) {

  const [filtro, setFiltro] = useState<Filtro>('Todas');
  const [abierto, setAbierto] = useState<string | null>(null);

  const cerrar = useCallback(() => setAbierto(null), []);

  const cuenta = (f: Filtro) => (f === 'Todas' ? albumes.length : albumes.filter((a) => a.categoria === f).length);

  // Más recientes primero, agrupadas por mes y año.
  const grupos = useMemo(() => {
    const visibles = albumes
      .filter((a) => filtro === 'Todas' || a.categoria === filtro)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    const lista: { clave: string; anio: number; mes: number; albumes: Album[] }[] = [];
    for (const a of visibles) {
      const { anio, mes } = partesFecha(a.fecha);
      const clave = `${anio}-${mes}`;
      if (lista.at(-1)?.clave === clave) lista.at(-1)!.albumes.push(a);
      else lista.push({ clave, anio, mes, albumes: [a] });
    }
    return lista;
  }, [albumes, filtro]);

  const albumAbierto = albumes.find((a) => a.slug === abierto);
  const totalFotos = albumes.reduce((n, a) => n + a.fotos.length, 0);

  return (
    <div>

      <p className="text-center text-sm italic text-stone-500 mb-6">
        {albumes.length} álbumes · {totalFotos} fotos · Pulsa una carpeta para abrirla
      </p>

      {/* ============= FILTROS ============= */}
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {(['Todas', ...CATEGORIAS] as Filtro[]).map((f) => {
          const activo = filtro === f;
          const n = cuenta(f);
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              disabled={n === 0}
              className={`group relative overflow-hidden px-5 py-2 text-xs tracking-[0.2em] uppercase font-medium rounded-full transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none ${
                activo
                  ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md shadow-red-900/30'
                  : 'bg-stone-100 text-stone-600 border border-stone-300 hover:border-red-800/60 hover:text-red-800'
              }`}
            >
              <span className="relative z-10">
                {f}
                <span className={`ml-2 ${activo ? 'text-stone-50/70' : 'text-stone-400'}`}>{n}</span>
              </span>
              {activo && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>
          );
        })}
      </div>

      {/* ============= CARPETAS POR MES ============= */}
      <div key={filtro} className="space-y-16">
        {grupos.map((g) => (
          <section key={g.clave}>
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="font-serif text-3xl text-stone-900 tracking-tight capitalize">{MESES[g.mes]}</h2>
              <span className="text-xs tracking-[0.4em] text-red-800 font-medium tabular-nums">{g.anio}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent self-center" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
              {g.albumes.map((a, i) => (
                <div key={a.slug} style={{ animationDelay: `${i * 90}ms` }} className="animate-[fadeIn_0.6s_ease-out_both]">
                  <CarpetaAlbum album={a} onAbrir={() => setAbierto(a.slug)} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {albumAbierto && <VisorAlbum album={albumAbierto} onCerrar={cerrar} />}
    </div>
  );
}
