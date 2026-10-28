'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Plus, Search, X, Pencil, Trash2 } from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import ObraModal, { type DatosObra } from './components/ObraModal';
import FondoNotas from '@/app/components/FondoNotas';
import { agrupar, type Obra } from '@/lib/catalogo';
import { obrasPrueba } from '@/lib/datosPrueba';

// ============= DATOS DE PRUEBA =============
// Los cambios viven solo en memoria: al recargar vuelve el catálogo de
// prueba, y la página pública no los ve hasta conectar Supabase.

const directorPrueba = {
  nombre: 'Fernando',
  rol: 'Director',
};

type Dialogo = { tipo: 'crear' } | { tipo: 'editar'; obra: Obra } | { tipo: 'eliminar'; obra: Obra } | null;

export default function CatalogoAdminPage() {

  const [obras, setObras] = useState<Obra[]>(obrasPrueba);
  const [busqueda, setBusqueda] = useState('');
  const [dialogo, setDialogo] = useState<Dialogo>(null);

  const cerrarDialogo = () => setDialogo(null);

  // Mismo orden que el público por defecto: agrupado por tipo de obra.
  const grupos = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    const filtradas = texto
      ? obras.filter((o) => o.titulo.toLowerCase().includes(texto) || o.compositor.toLowerCase().includes(texto))
      : obras;
    return agrupar(filtradas, 'tipo');
  }, [obras, busqueda]);

  const crear = (datos: DatosObra) => {
    setObras((prev) => [...prev, { id: crypto.randomUUID(), ...datos }]);
    cerrarDialogo();
  };

  const editar = (id: string, datos: DatosObra) => {
    setObras((prev) => prev.map((o) => (o.id === id ? { id, ...datos } : o)));
    cerrarDialogo();
  };

  const eliminar = (id: string) => {
    setObras((prev) => prev.filter((o) => o.id !== id));
    cerrarDialogo();
  };

  return (
    <div className="min-h-screen w-full superficie-crema flex flex-col">

      <DashboardHeader nombre={directorPrueba.nombre} rol={directorPrueba.rol} />

      <main className="flex-1 relative overflow-hidden">

        {/* Notas flotando de lado a lado de la página */}
        <FondoNotas soloLaterales />

        {/* Degradados laterales que visten los márgenes (como en el dashboard). */}
        <div className="absolute inset-y-0 left-0 w-[9%] max-w-[14rem] bg-gradient-to-r from-red-900/[0.10] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[9%] max-w-[14rem] bg-gradient-to-l from-red-900/[0.10] to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-8 md:py-10">

          <Link
            href="/miembros/dashboard"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-red-800 transition-colors mb-6 rounded-sm"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Volver a tu archivo
          </Link>

          {/* CABECERA DE SECCIÓN */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">Administración</span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
            Catálogo de obras
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-6">
            Lo que el público ve en «Repertorio»
          </p>

          <div className="flex justify-center mb-6">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="flex justify-center mb-8">
            <Link
              href="/sobre-nosotros/repertorio"
              target="_blank"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium text-stone-500 hover:text-red-800 transition-colors"
            >
              Ver la página pública
              <ExternalLink size={12} strokeWidth={1.5} />
            </Link>
          </div>

          {/* ============= BUSCADOR + NUEVA OBRA ============= */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar obra o compositor..."
                className="w-full bg-white/70 border border-stone-300 rounded-full py-3 pl-12 pr-12 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
              />
              {busqueda && (
                <button type="button" onClick={() => setBusqueda('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-800 transition-colors" aria-label="Limpiar búsqueda">
                  <X size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setDialogo({ tipo: 'crear' })}
              className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-3 text-xs tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-full"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} strokeWidth={1.5} />
                Nueva obra
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {/* ============= LISTADO POR TIPO ============= */}
          {grupos.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif italic text-xl text-stone-500 mb-2">
                {busqueda ? `Ninguna obra coincide con «${busqueda}»` : 'El catálogo está vacío'}
              </p>
              <p className="text-sm text-stone-400">Usa «Nueva obra» para añadir la primera.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {grupos.map((g) => (
                <section key={g.clave}>
                  <div className="flex items-baseline gap-4 mb-4">
                    <h2 className="font-serif text-3xl text-stone-900 tracking-tight">{g.titulo}</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-stone-300 to-transparent self-center" />
                    <span className="text-xs italic text-stone-400">{g.obras.length} {g.obras.length === 1 ? 'obra' : 'obras'}</span>
                  </div>
                  <ul className="space-y-3">
                    {g.obras.map((o) => (
                      <li key={o.id} className="group relative flex items-center gap-4 bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm shadow-sm shadow-stone-900/5 hover:shadow-lg hover:shadow-red-900/10 hover:border-red-800/30 transition-all duration-300 py-4 pl-6 pr-3">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-xl text-stone-900 leading-tight">{o.titulo}</p>
                          <p className="font-serif italic text-stone-600">
                            {o.compositor}{o.fechas && <span className="text-stone-400 not-italic text-sm"> · {o.fechas}</span>}
                          </p>
                          <p className="mt-1 text-[10px] tracking-[0.2em] uppercase text-stone-400">
                            {o.tipo} · {o.epoca} · {o.formacion} · {o.idioma}
                          </p>
                        </div>
                        <button type="button" onClick={() => setDialogo({ tipo: 'editar', obra: o })} aria-label={`Editar ${o.titulo}`} title="Editar" className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-red-800 hover:bg-red-50/60 rounded-sm transition-colors">
                          <Pencil size={16} strokeWidth={1.5} />
                        </button>
                        <button type="button" onClick={() => setDialogo({ tipo: 'eliminar', obra: o })} aria-label={`Quitar ${o.titulo}`} title="Quitar del catálogo" className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-red-800 hover:bg-red-50/60 rounded-sm transition-colors">
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* ============= DIÁLOGOS ============= */}
      {dialogo?.tipo === 'crear' && <ObraModal onGuardar={crear} onCerrar={cerrarDialogo} />}
      {dialogo?.tipo === 'editar' && (
        <ObraModal obra={dialogo.obra} onGuardar={(datos) => editar(dialogo.obra.id, datos)} onCerrar={cerrarDialogo} />
      )}
      {dialogo?.tipo === 'eliminar' && (
        <ConfirmDialog
          eyebrow="Quitar obra"
          titulo={`¿Quitar «${dialogo.obra.titulo}» del catálogo?`}
          mensaje="Dejará de aparecer en el repertorio público."
          textoConfirmar="Quitar"
          onConfirmar={() => eliminar(dialogo.obra.id)}
          onCerrar={cerrarDialogo}
        />
      )}
    </div>
  );
}
