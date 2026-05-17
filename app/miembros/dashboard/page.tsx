'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import DashboardHeader from './components/DashboardHeader';
import FileCard from './components/FileCard';
import AudioCard from './components/AudioPlayer';

// ============= DATOS DE PRUEBA =============

const usuarioPrueba = {
  nombre: 'Fernando',
  rol: 'Tenor',
};

// Repertorios disponibles. Siempre habrá "Todos" como primera opción.
// El admin podrá crear más en el futuro.
const repertorios = [
  'Todos',
  'Adviento',
  'Navidad',
  'Cuaresma',
  'Triduo Pascual',
  'Pascua',
  'Mariana',
  'Tiempo Ordinario',
];

// Partituras de prueba. Cada una puede pertenecer a VARIOS repertorios
// (esto se notará al filtrar: una misma obra puede aparecer al pulsar
// "Adviento" o "Mariana" si está en ambos).
const partiturasPrueba = [
  {
    id: '1',
    titulo: 'Ave María',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Mariana', 'Tiempo Ordinario'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '2',
    titulo: 'O Magnum Mysterium',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Navidad'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '3',
    titulo: 'Adoramus Te, Christe',
    compositor: 'Giovanni Pierluigi da Palestrina',
    repertorios: ['Cuaresma', 'Triduo Pascual'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '4',
    titulo: 'Christus Factus Est',
    compositor: 'Anton Bruckner',
    repertorios: ['Triduo Pascual'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '5',
    titulo: 'Cantate Domino',
    compositor: 'Giuseppe Pitoni',
    repertorios: ['Tiempo Ordinario'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '6',
    titulo: 'Regina Caeli',
    compositor: 'Wolfgang Amadeus Mozart',
    repertorios: ['Pascua', 'Mariana'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '7',
    titulo: 'Veni Emmanuel',
    compositor: 'Anónimo · arr. Z. Randall Stroope',
    repertorios: ['Adviento'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '8',
    titulo: 'Stabat Mater',
    compositor: 'Giovanni Battista Pergolesi',
    repertorios: ['Cuaresma', 'Mariana'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
];

const audiosPrueba = [
  {
    id: '1',
    titulo: 'Ave María',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Mariana', 'Tiempo Ordinario'],
    enlaceAudio: '/audio-prueba.mp3',
  },
  {
    id: '2',
    titulo: 'O Magnum Mysterium',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Navidad'],
    enlaceAudio: '/audio-prueba.mp3',
  },
  {
    id: '3',
    titulo: 'Adoramus Te, Christe',
    compositor: 'Giovanni Pierluigi da Palestrina',
    repertorios: ['Cuaresma', 'Triduo Pascual'],
    enlaceAudio: '/audio-prueba.mp3',
  },
  {
    id: '4',
    titulo: 'Regina Caeli',
    compositor: 'Wolfgang Amadeus Mozart',
    repertorios: ['Pascua', 'Mariana'],
    enlaceAudio: '/audio-prueba.mp3',
  },
];

type TipoArchivo = 'partituras' | 'audios';

export default function DashboardPage() {

  // ============= ESTADOS =============

  // Pestaña activa: Partituras o Audios
  const [tipoActivo, setTipoActivo] = useState<TipoArchivo>('partituras');

  // Repertorio activo (filtro por carpeta)
  const [repertorioActivo, setRepertorioActivo] = useState<string>('Todos');

  // Texto del buscador
  const [busqueda, setBusqueda] = useState('');

  // ============= FILTRADO COMBINADO =============
  // useMemo recalcula esto SOLO cuando cambian los estados de los que depende.
  // Más eficiente que recalcular en cada render.

  const partiturasFiltradas = useMemo(() => {
    return partiturasPrueba.filter((p) => {
      // 1. Filtro por repertorio (si está en "Todos", no filtra nada)
      const cumpleRepertorio =
        repertorioActivo === 'Todos' || p.repertorios.includes(repertorioActivo);

      // 2. Filtro por búsqueda (busca en título y compositor, sin distinguir mayúsculas)
      const textoBusqueda = busqueda.toLowerCase().trim();
      const cumpleBusqueda =
        textoBusqueda === '' ||
        p.titulo.toLowerCase().includes(textoBusqueda) ||
        p.compositor.toLowerCase().includes(textoBusqueda);

      // Solo si cumple AMBOS filtros, se muestra
      return cumpleRepertorio && cumpleBusqueda;
    });
  }, [repertorioActivo, busqueda]);

  const audiosFiltrados = useMemo(() => {
    return audiosPrueba.filter((a) => {
      const cumpleRepertorio =
        repertorioActivo === 'Todos' || a.repertorios.includes(repertorioActivo);
      const textoBusqueda = busqueda.toLowerCase().trim();
      const cumpleBusqueda =
        textoBusqueda === '' ||
        a.titulo.toLowerCase().includes(textoBusqueda) ||
        a.compositor.toLowerCase().includes(textoBusqueda);
      return cumpleRepertorio && cumpleBusqueda;
    });
  }, [repertorioActivo, busqueda]);

  return (

    <div className="min-h-screen w-full bg-stone-50 flex flex-col">

      <DashboardHeader nombre={usuarioPrueba.nombre} rol={usuarioPrueba.rol} />

      <main className="flex-1 relative overflow-hidden">

        {/* Círculos decorativos de fondo */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-red-900/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-[32rem] h-[32rem] rounded-full bg-amber-900/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-16 md:py-20">

          {/* CABECERA DE SECCIÓN */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
              Tu archivo
            </span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-4">
            Tu música, en un lugar
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-12">
            Partituras y audios al servicio de tu cuerda
          </p>

          <div className="flex justify-center mb-16">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* ============= DESLIZADOR PARTITURAS / AUDIOS ============= */}
          <div className="relative grid grid-cols-2 mb-10 border border-stone-300 rounded-full overflow-hidden bg-stone-100 max-w-xl mx-auto">

            <div
              className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-red-800 to-red-950 transition-transform duration-500 ease-out ${
                tipoActivo === 'partituras' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />

            <button
              type="button"
              onClick={() => setTipoActivo('partituras')}
              className={`relative z-10 flex items-center justify-center gap-3 py-5 transition-colors duration-300 ${
                tipoActivo === 'partituras' ? 'text-stone-50' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="flex-shrink-0">
                <line x1="2" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                <line x1="2" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                <line x1="2" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                <line x1="2" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
                <ellipse cx="7" cy="14" rx="2.5" ry="2" fill="currentColor" />
                <line x1="9.5" y1="14" x2="9.5" y2="4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="text-sm tracking-[0.3em] uppercase font-medium">
                Partituras
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTipoActivo('audios')}
              className={`relative z-10 flex items-center justify-center gap-3 py-5 transition-colors duration-300 ${
                tipoActivo === 'audios' ? 'text-stone-50' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="flex-shrink-0">
                <line x1="11" y1="6" x2="11" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="7" y1="8" x2="7" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="8" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="10" x2="3" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="19" y1="10" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-sm tracking-[0.3em] uppercase font-medium">
                Audios
              </span>
            </button>

          </div>

          {/* ============= BUSCADOR =============
              Input grande con icono de lupa y botón para limpiar.
              Mismo estilo que los inputs del formulario de inscripción. */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              {/* Icono lupa */}
              <Search
                size={18}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none"
              />

              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por título o compositor..."
                className="w-full bg-white/70 border border-stone-300 rounded-full py-3 pl-12 pr-12 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
              />

              {/* Botón X para limpiar búsqueda (solo aparece si hay texto) */}
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
          </div>

          {/* ============= CHIPS DE REPERTORIOS =============
              Lista horizontal con scroll en móvil.
              Mismo degradado granate y fuente que el deslizador. */}
          <div className="mb-2">

            {/* Eyebrow de la sección de repertorios */}
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-red-800/40" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-red-800/80 font-medium">
                Repertorios
              </span>
              <div className="h-px flex-1 bg-stone-300" />
            </div>

            {/* Chips: scroll horizontal en móvil, wrap en escritorio */}
            <div className="flex flex-wrap gap-2 pb-2">
              {repertorios.map((rep) => {
                const activo = repertorioActivo === rep;
                return (
                  <button
                    key={rep}
                    onClick={() => setRepertorioActivo(rep)}
                    className={`group relative overflow-hidden px-5 py-2 text-xs tracking-[0.2em] uppercase font-medium rounded-full transition-all duration-300 ${
                      activo
                        ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md shadow-red-900/30'
                        : 'bg-stone-100 text-stone-600 border border-stone-300 hover:border-red-800/60 hover:text-red-800'
                    }`}
                  >
                    <span className="relative z-10">{rep}</span>
                    {/* Efecto brillo cuando está activo */}
                    {activo && (
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* ============= CONTADOR DE RESULTADOS =============
              Pequeño texto bajo los filtros indicando cuántos resultados hay. */}
          <div className="text-center mb-8 mt-6">
            <p className="text-sm text-stone-500 italic">
              {tipoActivo === 'partituras' ? (
                <>
                  {partiturasFiltradas.length}{' '}
                  {partiturasFiltradas.length === 1 ? 'partitura' : 'partituras'}
                  {repertorioActivo !== 'Todos' && ` en ${repertorioActivo}`}
                  {busqueda && ` que coinciden con "${busqueda}"`}
                </>
              ) : (
                <>
                  {audiosFiltrados.length}{' '}
                  {audiosFiltrados.length === 1 ? 'audio' : 'audios'}
                  {repertorioActivo !== 'Todos' && ` en ${repertorioActivo}`}
                  {busqueda && ` que coinciden con "${busqueda}"`}
                </>
              )}
            </p>
          </div>

          {/* ============= LISTADO DE ARCHIVOS ============= */}

          {tipoActivo === 'partituras' && (
            <>
              {partiturasFiltradas.length === 0 ? (
                <EmptyState tipo="partituras" busqueda={busqueda} repertorio={repertorioActivo} />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partiturasFiltradas.map((p) => (
                    <FileCard
                      key={p.id}
                      titulo={p.titulo}
                      compositor={p.compositor}
                      categoria={p.repertorios[0]}
                      enlaceDescarga={p.enlaceDescarga}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {tipoActivo === 'audios' && (
            <>
              {audiosFiltrados.length === 0 ? (
                <EmptyState tipo="audios" busqueda={busqueda} repertorio={repertorioActivo} />
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {audiosFiltrados.map((a) => (
                    <AudioCard
                      key={a.id}
                      titulo={a.titulo}
                      compositor={a.compositor}
                      categoria={a.repertorios[0]}
                      enlaceAudio={a.enlaceAudio}
                    />
                  ))}
                </div>
              )}
            </>
          )}

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

    </div>
  );
}

// ============= ESTADO VACÍO MEJORADO =============
// Cambia el mensaje según si está vacío por búsqueda, por filtro, o por falta de contenido.
function EmptyState({
  tipo,
  busqueda,
  repertorio,
}: {
  tipo: string;
  busqueda: string;
  repertorio: string;
}) {

  // Caso 1: hay búsqueda activa
  if (busqueda) {
    return (
      <div className="text-center py-16">
        <p className="font-serif italic text-xl text-stone-500 mb-2">
          Sin resultados para «{busqueda}»
        </p>
        <p className="text-sm text-stone-400">
          Prueba con otra búsqueda o cambia el repertorio.
        </p>
      </div>
    );
  }

  // Caso 2: hay un repertorio filtrado
  if (repertorio !== 'Todos') {
    return (
      <div className="text-center py-16">
        <p className="font-serif italic text-xl text-stone-500 mb-2">
          No hay {tipo} en el repertorio «{repertorio}»
        </p>
        <p className="text-sm text-stone-400">
          Prueba con otro repertorio o consulta «Todos».
        </p>
      </div>
    );
  }

  // Caso 3: no hay nada en absoluto
  return (
    <div className="text-center py-16">
      <p className="font-serif italic text-xl text-stone-500 mb-2">
        Aún no hay {tipo} disponibles para tu cuerda.
      </p>
      <p className="text-sm text-stone-400">
        Cuando se suban nuevos archivos, aparecerán aquí.
      </p>
    </div>
  );
}