'use client';

// Álbum abierto: una hoja que sube sobre la página con el título, un texto
// del álbum y sus fotos en mosaico (alturas variadas) entrando en cascada.
// Al pulsar una foto se abre el visor a pantalla completa.
// Teclado: Esc cierra el visor o, si no hay visor, el álbum; ← → cambian de foto.
// Se monta en <body> (portal) para quedar por encima de la cabecera de la web,
// que si no lo taparía al estar la página en su propia capa (z-10).

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Expand } from 'lucide-react';
import FotoRecortada from './FotoRecortada';
import VisorFoto from './VisorFoto';
import type { Album } from '@/lib/galeria';

export default function VisorAlbum({ album, onCerrar }: { album: Album; onCerrar: () => void }) {

  const [fotoAbierta, setFotoAbierta] = useState<number | null>(null);
  const total = album.fotos.length;

  // Bloquea el scroll de la página mientras el álbum está abierto.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fotoAbierta !== null) setFotoAbierta(null);
        else onCerrar();
      }
      if (fotoAbierta === null) return;
      if (e.key === 'ArrowRight') setFotoAbierta((fotoAbierta + 1) % total);
      if (e.key === 'ArrowLeft') setFotoAbierta((fotoAbierta - 1 + total) % total);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fotoAbierta, total, onCerrar]);

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`Álbum: ${album.titulo}`}>

      {/* Fondo oscurecido (cierra al pulsar) */}
      <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]" onClick={onCerrar} />

      {/* Hoja del álbum */}
      <div className="absolute inset-x-0 bottom-0 top-[3vh] md:inset-x-[4vw] overflow-y-auto bg-stone-50 rounded-t-sm shadow-2xl animate-[subir_0.5s_ease-out]">
        <div className="h-1 w-full bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

        {/* Cabecera fija dentro de la hoja */}
        <div className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 py-5 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-1">
                <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" /></svg>
                {album.categoria} · {total} fotos
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight leading-tight">{album.titulo}</h2>
            </div>
            <button type="button" onClick={onCerrar} aria-label="Cerrar el álbum" className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-stone-500 hover:text-red-800 hover:bg-red-50/60 transition-colors">
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8">

          {/* Texto del álbum */}
          <p className="font-serif italic text-lg text-stone-500 max-w-3xl mb-10">{album.descripcion}</p>

          {/* MOSAICO: columnas con alturas variadas */}
          <div className="columns-2 md:columns-3 gap-4">
            {album.fotos.map((foto, i) => (
              <button
                key={foto.id}
                type="button"
                onClick={() => setFotoAbierta(i)}
                aria-label={`Ampliar: ${foto.pie}`}
                style={{ animationDelay: `${i * 70}ms` }}
                className="group relative block w-full mb-4 break-inside-avoid overflow-hidden rounded-sm shadow-md shadow-stone-900/10 hover:shadow-xl hover:shadow-red-950/20 transition-shadow animate-[fadeIn_0.6s_ease-out_both]"
              >
                <FotoRecortada
                  foto={foto}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  claseImagen="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Pie que aparece al pasar el ratón */}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 pt-12 bg-gradient-to-t from-stone-950/75 to-transparent text-left opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300">
                  <span className="font-serif italic text-stone-50 leading-snug">{foto.pie}</span>
                  <Expand size={16} strokeWidth={1.5} className="flex-shrink-0 text-stone-50/80" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {fotoAbierta !== null && (
        <VisorFoto
          fotos={album.fotos}
          indice={fotoAbierta}
          titulo={album.titulo}
          onIr={setFotoAbierta}
          onCerrar={() => setFotoAbierta(null)}
        />
      )}
    </div>,
    document.body
  );
}
