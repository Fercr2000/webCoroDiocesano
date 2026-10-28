'use client';

// Carpeta de un álbum: un montón de tres fotos impresas (marco blanco,
// ligeramente giradas) que se abren en abanico al pasar el ratón.
// Debajo, categoría, título, fecha, lugar y número de fotos.

import { Images } from 'lucide-react';
import FotoRecortada from './FotoRecortada';
import { fechaLarga } from '@/lib/fechas';
import type { Album } from '@/lib/galeria';

// Posición de cada copia del montón: reposo → abanico (al pasar el ratón).
const CAPAS = [
  'rotate-[-7deg] -translate-x-[3%] group-hover:rotate-[-14deg] group-hover:-translate-x-[17%] group-hover:-translate-y-[2%]',
  'rotate-[6deg] translate-x-[3%] group-hover:rotate-[12deg] group-hover:translate-x-[17%] group-hover:-translate-y-[2%]',
  'rotate-[-1.5deg] group-hover:rotate-0 group-hover:-translate-y-[4%] group-hover:scale-[1.04]',
];

export default function CarpetaAlbum({ album, onAbrir }: { album: Album; onAbrir: () => void }) {

  // La portada va encima; detrás, las dos siguientes.
  const pila = [album.fotos[2] ?? album.fotos[0], album.fotos[1] ?? album.fotos[0], album.fotos[0]];

  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label={`Abrir el álbum ${album.titulo} (${album.fotos.length} fotos)`}
      className="group w-full text-left rounded-sm"
    >
      {/* MONTÓN DE FOTOS */}
      <div className="relative aspect-[4/3] mb-6">
        {pila.map((foto, i) => (
          <div
            key={i}
            className={`absolute inset-[7%] bg-white p-2 pb-6 shadow-lg shadow-stone-900/15 transition-all duration-500 ease-out motion-reduce:transition-none ${CAPAS[i]} ${
              i === 2 ? 'group-hover:shadow-2xl group-hover:shadow-red-950/25' : ''
            }`}
          >
            <FotoRecortada foto={foto} proporcion="horizontal" sizes="(max-width: 768px) 90vw, 30vw" className="w-full h-full" />
          </div>
        ))}

        {/* Número de fotos sobre la portada */}
        <span className="absolute top-[4%] right-[4%] z-10 flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium text-stone-50 bg-gradient-to-br from-red-800 to-red-950 rounded-full shadow-md shadow-red-900/30 transition-transform duration-500 group-hover:scale-110">
          <Images size={12} strokeWidth={1.5} />
          {album.fotos.length}
        </span>
      </div>

      {/* PIE DE LA CARPETA */}
      <div className="px-2">
        <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-1.5">
          <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" /></svg>
          {album.categoria}
        </span>
        <h3 className="relative inline font-serif text-2xl text-stone-900 tracking-tight leading-tight group-hover:text-red-900 transition-colors">
          {album.titulo}
        </h3>
        <p className="font-serif italic text-stone-500 mt-1 first-letter:uppercase">
          {fechaLarga(album.fecha)} · {album.lugar}
        </p>
      </div>
    </button>
  );
}
