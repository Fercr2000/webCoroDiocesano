'use client';

import { Download, FileMusic } from 'lucide-react';

interface FileCardProps {
  titulo: string;
  compositor: string;
  categoria: string;
  enlaceDescarga: string;
}

export default function FileCard({ titulo, compositor, categoria, enlaceDescarga }: FileCardProps) {

  return (

    // Contenedor de la tarjeta.
    //   group → permite efectos hover en hijos
    //   relative → permite posicionar decoraciones absolutas
    //   bg-gradient → degradado vertical sutil para profundidad
    //   border + sombra → presencia visual
    //   transition + hover → animaciones suaves al pasar el ratón
    <div className="group relative bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm overflow-hidden shadow-sm shadow-stone-900/5 hover:shadow-xl hover:shadow-red-900/10 hover:border-red-800/30 hover:-translate-y-0.5 transition-all duration-300">

      {/* Banda lateral izquierda decorativa (granate vertical) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Esquina decorativa superior derecha (sutil) */}
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20 pointer-events-none" />

      {/* CONTENIDO */}
      <div className="p-6 pl-7">

        {/* Eyebrow: tipo + categoría */}
        <div className="flex items-center gap-2 mb-4">
          <FileMusic size={12} strokeWidth={1.5} className="text-red-800/70 flex-shrink-0" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-red-800/80 font-medium">
            Partitura
          </span>
          {categoria && (
            <>
              <span className="text-stone-300">·</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
                {categoria}
              </span>
            </>
          )}
        </div>

        {/* Título de la obra (font-serif para elegancia) */}
        <h3 className="font-serif text-2xl text-stone-900 tracking-tight leading-tight mb-2">
          {titulo}
        </h3>

        {/* Compositor en cursiva */}
        <p className="font-serif italic text-stone-600 mb-6">
          {compositor}
        </p>

        {/* Botón descargar */}
        <a
          href={enlaceDescarga}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium shadow-md hover:shadow-lg hover:shadow-red-900/40 transition-all duration-300 rounded-sm"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Download size={14} strokeWidth={1.5} />
            <span>Descargar</span>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
        </a>

      </div>

    </div>
  );
}