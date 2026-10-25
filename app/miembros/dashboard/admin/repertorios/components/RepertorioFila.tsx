'use client';

// Fila de la lista de repertorios. El orden importa (es el orden de los
// filtros en el archivo de cada miembro), así que se presenta como lista
// numerada con flechas para subir/bajar. Renombrar se hace en la propia fila.

import { useState } from 'react';
import { ChevronUp, ChevronDown, Pencil, Trash2, Check, X } from 'lucide-react';
import type { Repertorio } from '@/lib/archivo';

interface RepertorioFilaProps {
  repertorio: Repertorio;
  posicion: number;
  partituras: number;
  audios: number;
  esPrimero: boolean;
  esUltimo: boolean;
  validar: (nombre: string) => string | null;
  onRenombrar: (nombre: string) => void;
  onSubir: () => void;
  onBajar: () => void;
  onEliminar: () => void;
}

export default function RepertorioFila({
  repertorio,
  posicion,
  partituras,
  audios,
  esPrimero,
  esUltimo,
  validar,
  onRenombrar,
  onSubir,
  onBajar,
  onEliminar,
}: RepertorioFilaProps) {

  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(repertorio.nombre);
  const [error, setError] = useState<string | null>(null);

  const empezarEdicion = () => {
    setValor(repertorio.nombre);
    setError(null);
    setEditando(true);
  };

  const guardar = () => {
    const nombre = valor.trim();
    // Sin cambios: se cierra sin validar (si no, chocaría consigo mismo).
    if (nombre === repertorio.nombre) {
      setEditando(false);
      return;
    }
    const e = validar(nombre);
    if (e) {
      setError(e);
      return;
    }
    onRenombrar(nombre);
    setEditando(false);
  };

  const total = partituras + audios;

  return (
    <li className="group relative flex items-center gap-3 sm:gap-6 bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm shadow-sm shadow-stone-900/5 hover:shadow-lg hover:shadow-red-900/10 hover:border-red-800/30 transition-all duration-300 py-5 pl-5 sm:pl-6 pr-2 sm:pr-5">

      {/* Banda lateral izquierda decorativa (granate vertical) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Número de orden */}
      <span className="font-serif text-2xl sm:text-3xl text-red-800/80 leading-none w-7 sm:w-10 flex-shrink-0 tabular-nums">
        {String(posicion).padStart(2, '0')}
      </span>

      {/* NOMBRE + CONTEO (o campo de edición) */}
      <div className="flex-1 min-w-0">
        {editando ? (
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={valor}
                onChange={(e) => { setValor(e.target.value); setError(null); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') guardar();
                  // Esc solo cancela la edición, sin cerrar nada más.
                  if (e.key === 'Escape') setEditando(false);
                }}
                autoFocus
                maxLength={40}
                aria-label="Nuevo nombre del repertorio"
                className="w-full min-w-0 font-serif text-xl text-stone-900 bg-white border border-red-800/50 rounded-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-red-800/20"
              />
              <BotonIcono onClick={guardar} etiqueta="Guardar nombre"><Check size={16} strokeWidth={1.5} /></BotonIcono>
              <BotonIcono onClick={() => setEditando(false)} etiqueta="Cancelar"><X size={16} strokeWidth={1.5} /></BotonIcono>
            </div>
            {error && <p className="mt-2 text-xs text-red-800">{error}</p>}
          </div>
        ) : (
          <>
            <h3 className="font-serif text-xl sm:text-2xl text-stone-900 tracking-tight leading-tight truncate">
              {repertorio.nombre}
            </h3>
            <p className="mt-1 text-[11px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase text-stone-500">
              {total === 0 ? (
                <span className="italic normal-case tracking-normal text-sm text-stone-400">Sin obras todavía</span>
              ) : (
                <>
                  <span className="whitespace-nowrap">{partituras} {partituras === 1 ? 'partitura' : 'partituras'}</span>
                  <span className="text-stone-300 mx-2">·</span>
                  <span className="whitespace-nowrap">{audios} {audios === 1 ? 'audio' : 'audios'}</span>
                </>
              )}
            </p>
          </>
        )}
      </div>

      {/* ACCIONES */}
      {!editando && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex flex-col sm:flex-row">
            <BotonIcono onClick={onSubir} etiqueta={`Subir ${repertorio.nombre}`} desactivado={esPrimero}>
              <ChevronUp size={16} strokeWidth={1.5} />
            </BotonIcono>
            <BotonIcono onClick={onBajar} etiqueta={`Bajar ${repertorio.nombre}`} desactivado={esUltimo}>
              <ChevronDown size={16} strokeWidth={1.5} />
            </BotonIcono>
          </div>
          <div className="hidden sm:block w-px h-8 bg-stone-200 mx-2" />
          <BotonIcono onClick={empezarEdicion} etiqueta={`Renombrar ${repertorio.nombre}`}>
            <Pencil size={16} strokeWidth={1.5} />
          </BotonIcono>
          <BotonIcono onClick={onEliminar} etiqueta={`Eliminar ${repertorio.nombre}`}>
            <Trash2 size={16} strokeWidth={1.5} />
          </BotonIcono>
        </div>
      )}

    </li>
  );
}

function BotonIcono({
  onClick,
  etiqueta,
  desactivado = false,
  children,
}: {
  onClick: () => void;
  etiqueta: string;
  desactivado?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactivado}
      aria-label={etiqueta}
      title={etiqueta}
      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-stone-500 hover:text-red-800 hover:bg-red-50/60 transition-colors rounded-sm disabled:opacity-25 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}
