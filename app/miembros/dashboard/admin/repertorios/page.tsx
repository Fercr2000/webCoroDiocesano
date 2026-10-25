'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Lock } from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import RepertorioFila from './components/RepertorioFila';
import { REPERTORIO_TODOS, type Repertorio } from '@/lib/archivo';
import { repertoriosPrueba, partiturasPrueba, audiosPrueba } from '@/lib/datosPrueba';

// ============= DATOS DE PRUEBA =============
// Los cambios viven solo en memoria: al recargar vuelven los repertorios
// de prueba, y el dashboard no ve los cambios hasta conectar Supabase.

const directorPrueba = {
  nombre: 'Fernando',
  rol: 'Director',
};

// Obras de cada repertorio, calculadas una vez por id: así un repertorio
// renombrado conserva su conteo y uno nuevo empieza en cero.
const conteoInicial: Record<string, { partituras: number; audios: number }> = Object.fromEntries(
  repertoriosPrueba.map((r) => [
    r.id,
    {
      partituras: partiturasPrueba.filter((p) => p.repertorios.includes(r.nombre)).length,
      audios: audiosPrueba.filter((a) => a.repertorios.includes(r.nombre)).length,
    },
  ])
);

export default function RepertoriosPage() {

  // ============= ESTADOS =============

  const [repertorios, setRepertorios] = useState<Repertorio[]>(repertoriosPrueba);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [errorNuevo, setErrorNuevo] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<Repertorio | null>(null);

  // ============= VALIDACIÓN =============
  // Devuelve el mensaje de error, o null si el nombre es válido.
  const validarNombre = (nombre: string, exceptoId?: string) => {
    const limpio = nombre.trim().toLowerCase();
    if (!limpio) return 'Escribe un nombre.';
    if (limpio === REPERTORIO_TODOS.toLowerCase()) return '«Todos» está reservado: es el filtro que lo muestra todo.';
    if (repertorios.some((r) => r.id !== exceptoId && r.nombre.toLowerCase() === limpio)) {
      return 'Ya existe un repertorio con ese nombre.';
    }
    return null;
  };

  // ============= ACCIONES =============

  const crearRepertorio = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validarNombre(nuevoNombre);
    if (error) {
      setErrorNuevo(error);
      return;
    }
    setRepertorios((prev) => [...prev, { id: crypto.randomUUID(), nombre: nuevoNombre.trim() }]);
    setNuevoNombre('');
  };

  const renombrar = (id: string, nombre: string) => {
    setRepertorios((prev) => prev.map((r) => (r.id === id ? { ...r, nombre } : r)));
  };

  // Intercambia un repertorio con su vecino (dir = -1 sube, +1 baja).
  const mover = (indice: number, dir: -1 | 1) => {
    setRepertorios((prev) => {
      const copia = [...prev];
      [copia[indice], copia[indice + dir]] = [copia[indice + dir], copia[indice]];
      return copia;
    });
  };

  const eliminar = (id: string) => {
    setRepertorios((prev) => prev.filter((r) => r.id !== id));
    setAEliminar(null);
  };

  const conteo = (id: string) => conteoInicial[id] ?? { partituras: 0, audios: 0 };

  return (
    <div className="min-h-screen w-full superficie-crema flex flex-col">

      <DashboardHeader nombre={directorPrueba.nombre} rol={directorPrueba.rol} />

      <main className="flex-1 relative overflow-hidden">

        {/* Degradados laterales que visten los márgenes (como en el dashboard). */}
        <div className="absolute inset-y-0 left-0 w-[9%] max-w-[14rem] bg-gradient-to-r from-red-900/[0.10] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[9%] max-w-[14rem] bg-gradient-to-l from-red-900/[0.10] to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-12 py-12 md:py-16">

          <Link
            href="/miembros/dashboard"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-red-800 transition-colors mb-12 rounded-sm"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Volver a tu archivo
          </Link>

          {/* CABECERA DE SECCIÓN */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
              Administración
            </span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-4">
            Repertorios
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-12">
            Cada obra en su tiempo
          </p>

          <div className="flex justify-center mb-16">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* ============= AÑADIR REPERTORIO ============= */}
          <form onSubmit={crearRepertorio} noValidate className="mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => { setNuevoNombre(e.target.value); setErrorNuevo(null); }}
                placeholder="Nuevo repertorio: Corpus Christi, Concierto de Navidad..."
                maxLength={40}
                aria-label="Nombre del nuevo repertorio"
                className="flex-1 bg-white/70 border border-stone-300 rounded-full py-3 px-6 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
              />
              <button
                type="submit"
                className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-3 text-xs tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-full"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Plus size={16} strokeWidth={1.5} />
                  Añadir
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
            {errorNuevo && <p className="mt-3 ml-6 text-xs text-red-800">{errorNuevo}</p>}
          </form>

          {/* ============= LISTA ============= */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-red-800/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-red-800/80 font-medium">
              Orden de los filtros
            </span>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          <p className="text-sm text-stone-500 italic mb-6">
            Así aparecerán, de izquierda a derecha, en el archivo de cada miembro.
          </p>

          {/* "Todos" es virtual: se muestra fijo para que se entienda el orden completo. */}
          <div className="flex items-center gap-4 sm:gap-6 border border-dashed border-stone-300 rounded-sm py-4 pl-6 pr-5 mb-3 text-stone-500">
            <Lock size={16} strokeWidth={1.5} className="w-10 flex-shrink-0 text-stone-400" />
            <div className="min-w-0">
              <p className="font-serif text-xl text-stone-600 leading-tight">{REPERTORIO_TODOS}</p>
              <p className="text-xs text-stone-400 mt-0.5">Siempre el primero. Muestra todas las obras y no se puede modificar.</p>
            </div>
          </div>

          {repertorios.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif italic text-xl text-stone-500 mb-2">
                Aún no hay repertorios
              </p>
              <p className="text-sm text-stone-400">
                Añade el primero arriba: Adviento, Navidad, Cuaresma...
              </p>
            </div>
          ) : (
            <ol className="space-y-3">
              {repertorios.map((r, i) => (
                <RepertorioFila
                  key={r.id}
                  repertorio={r}
                  posicion={i + 1}
                  partituras={conteo(r.id).partituras}
                  audios={conteo(r.id).audios}
                  esPrimero={i === 0}
                  esUltimo={i === repertorios.length - 1}
                  validar={(nombre) => validarNombre(nombre, r.id)}
                  onRenombrar={(nombre) => renombrar(r.id, nombre)}
                  onSubir={() => mover(i, -1)}
                  onBajar={() => mover(i, 1)}
                  onEliminar={() => setAEliminar(r)}
                />
              ))}
            </ol>
          )}

          <p className="text-center text-sm text-stone-500 italic mt-8">
            {repertorios.length} {repertorios.length === 1 ? 'repertorio' : 'repertorios'}
          </p>

          {/* LÍNEA DECORATIVA FINAL */}
          <div className="flex justify-center mt-20">
            <svg width="60" height="14" viewBox="0 0 60 14" fill="none" className="text-red-800/40">
              <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="26" y="3" width="8" height="8" transform="rotate(45 30 7)" fill="currentColor" />
              <line x1="38" y1="7" x2="60" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

        </div>
      </main>

      {/* ============= CONFIRMAR ELIMINACIÓN ============= */}
      {aEliminar && (() => {
        const { partituras, audios } = conteo(aEliminar.id);
        const total = partituras + audios;
        return (
          <ConfirmDialog
            eyebrow="Eliminar repertorio"
            titulo={`¿Eliminar «${aEliminar.nombre}»?`}
            mensaje={
              total === 0
                ? 'Está vacío, así que no afecta a ninguna obra.'
                : <>Sus <strong className="font-medium text-stone-800">{total} {total === 1 ? 'obra' : 'obras'}</strong> no se borran: seguirán en el archivo y en sus otros repertorios, pero dejarán de aparecer bajo «{aEliminar.nombre}».</>
            }
            textoConfirmar="Eliminar"
            onConfirmar={() => eliminar(aEliminar.id)}
            onCerrar={() => setAEliminar(null)}
          />
        );
      })()}

    </div>
  );
}
