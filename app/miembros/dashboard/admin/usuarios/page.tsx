'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, ArrowLeft, UserPlus } from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import UserCard from './components/UserCard';
import CreateUserModal, { type DatosUsuario } from './components/CreateUserModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import PasswordDialog from './components/PasswordDialog';
import { grupoDeRol, nombresGrupos, generarContrasena, type GrupoRol, type Usuario } from '@/lib/roles';
import { puedeAsignarRoles } from '@/lib/gestion';
import { usuariosPrueba } from '@/lib/datosPrueba';

// ============= DATOS DE PRUEBA =============
// Los miembros de prueba están en lib/datosPrueba (también los usa la página
// pública de Componentes). Los cambios viven solo en memoria: al recargar
// la página vuelven a este estado.
// Con Supabase, esta lista vendrá de la tabla `usuarios` y las funciones
// crear/editar/eliminar/restablecer llamarán a la base de datos.

const directorPrueba = {
  nombre: 'Fernando',
  email: 'fernando@corodiocesano.es',
  rol: 'Director',
};

type FiltroGrupo = 'Todos' | GrupoRol;

// Qué diálogo está abierto en cada momento (solo uno a la vez).
type Dialogo =
  | { tipo: 'crear' }
  | { tipo: 'editar'; usuario: Usuario }
  | { tipo: 'eliminar'; usuario: Usuario }
  | { tipo: 'restablecer'; usuario: Usuario }
  | { tipo: 'contrasena'; usuario: Usuario; contrasena: string; motivo: 'creado' | 'restablecida' }
  | null;

export default function UsuariosPage() {

  // ============= ESTADOS =============

  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosPrueba);
  const [busqueda, setBusqueda] = useState('');
  const [grupoActivo, setGrupoActivo] = useState<FiltroGrupo>('Todos');
  const [dialogo, setDialogo] = useState<Dialogo>(null);

  const cerrarDialogo = () => setDialogo(null);

  // ============= FILTRADO COMBINADO (grupo + búsqueda) =============

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return usuarios
      .filter((u) => {
        const cumpleGrupo = grupoActivo === 'Todos' || grupoDeRol(u.rol) === grupoActivo;
        const cumpleBusqueda =
          texto === '' ||
          u.nombre.toLowerCase().includes(texto) ||
          u.email.toLowerCase().includes(texto);
        return cumpleGrupo && cumpleBusqueda;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [usuarios, grupoActivo, busqueda]);

  // Cuántos miembros hay en cada grupo, para mostrarlo en los chips.
  const totalPorGrupo = (grupo: FiltroGrupo) =>
    grupo === 'Todos' ? usuarios.length : usuarios.filter((u) => grupoDeRol(u.rol) === grupo).length;

  // ============= ACCIONES =============

  const crearUsuario = ({ contrasena, ...datos }: DatosUsuario) => {
    const nuevo: Usuario = { id: crypto.randomUUID(), ...datos };
    setUsuarios((prev) => [...prev, nuevo]);
    setDialogo({ tipo: 'contrasena', usuario: nuevo, contrasena, motivo: 'creado' });
  };

  const editarUsuario = (id: string, { nombre, email, rol, gestion }: DatosUsuario) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, nombre, email, rol, gestion } : u)));
    cerrarDialogo();
  };

  const eliminarUsuario = (id: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    cerrarDialogo();
  };

  const restablecerContrasena = (usuario: Usuario) => {
    setDialogo({ tipo: 'contrasena', usuario, contrasena: generarContrasena(), motivo: 'restablecida' });
  };

  // Emails ya en uso, excluyendo el del miembro que se está editando.
  const emailsOcupados = (excepto?: Usuario) =>
    usuarios.filter((u) => u.id !== excepto?.id).map((u) => u.email.toLowerCase());

  return (
    <div className="min-h-screen w-full superficie-crema flex flex-col">

      <DashboardHeader nombre={directorPrueba.nombre} rol={directorPrueba.rol} />

      <main className="flex-1 relative overflow-hidden">

        {/* Degradados laterales que visten los márgenes (como en el dashboard). */}
        <div className="absolute inset-y-0 left-0 w-[9%] max-w-[14rem] bg-gradient-to-r from-red-900/[0.10] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[9%] max-w-[14rem] bg-gradient-to-l from-red-900/[0.10] to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-12 md:py-16">

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
            Componentes del coro
          </h1>

          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-12">
            Quién canta, quién toca y quién tiene llave
          </p>

          <div className="flex justify-center mb-16">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* ============= BUSCADOR + NUEVO MIEMBRO ============= */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                size={18}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none"
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o email..."
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

            <button
              type="button"
              onClick={() => setDialogo({ tipo: 'crear' })}
              className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-3 text-xs tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-full"
            >
              <span className="relative z-10 flex items-center gap-2">
                <UserPlus size={16} strokeWidth={1.5} />
                Nuevo miembro
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {/* ============= CHIPS DE SECCIONES ============= */}
          <div className="mb-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-red-800/40" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-red-800/80 font-medium">
                Secciones
              </span>
              <div className="h-px flex-1 bg-stone-300" />
            </div>

            <div className="flex flex-wrap gap-2 pb-2">
              {(['Todos', ...nombresGrupos] as FiltroGrupo[]).map((grupo) => {
                const activo = grupoActivo === grupo;
                return (
                  <button
                    key={grupo}
                    onClick={() => setGrupoActivo(grupo)}
                    className={`group relative overflow-hidden px-5 py-2 text-xs tracking-[0.2em] uppercase font-medium rounded-full transition-all duration-300 ${
                      activo
                        ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md shadow-red-900/30'
                        : 'bg-stone-100 text-stone-600 border border-stone-300 hover:border-red-800/60 hover:text-red-800'
                    }`}
                  >
                    <span className="relative z-10">
                      {grupo}
                      <span className={`ml-2 ${activo ? 'text-stone-50/70' : 'text-stone-400'}`}>
                        {totalPorGrupo(grupo)}
                      </span>
                    </span>
                    {activo && (
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============= CONTADOR DE RESULTADOS ============= */}
          <div className="text-center mb-8 mt-6">
            <p className="text-sm text-stone-500 italic">
              {usuariosFiltrados.length}{' '}
              {usuariosFiltrados.length === 1 ? 'miembro' : 'miembros'}
              {grupoActivo !== 'Todos' && ` en ${grupoActivo}`}
              {busqueda && ` que coinciden con "${busqueda}"`}
            </p>
          </div>

          {/* ============= LISTADO ============= */}
          {usuariosFiltrados.length === 0 ? (
            <EmptyState busqueda={busqueda} grupo={grupoActivo} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {usuariosFiltrados.map((u) => (
                <UserCard
                  key={u.id}
                  usuario={u}
                  esTuCuenta={u.email === directorPrueba.email}
                  onEditar={() => setDialogo({ tipo: 'editar', usuario: u })}
                  onRestablecer={() => setDialogo({ tipo: 'restablecer', usuario: u })}
                  onEliminar={() => setDialogo({ tipo: 'eliminar', usuario: u })}
                />
              ))}
            </div>
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

      {/* ============= DIÁLOGOS ============= */}

      {dialogo?.tipo === 'crear' && (
        <CreateUserModal
          emailsOcupados={emailsOcupados()}
          puedeAsignarRoles={puedeAsignarRoles(directorPrueba)}
          onGuardar={crearUsuario}
          onCerrar={cerrarDialogo}
        />
      )}

      {dialogo?.tipo === 'editar' && (
        <CreateUserModal
          usuario={dialogo.usuario}
          emailsOcupados={emailsOcupados(dialogo.usuario)}
          puedeAsignarRoles={puedeAsignarRoles(directorPrueba)}
          onGuardar={(datos) => editarUsuario(dialogo.usuario.id, datos)}
          onCerrar={cerrarDialogo}
        />
      )}

      {dialogo?.tipo === 'eliminar' && (
        <ConfirmDialog
          eyebrow="Eliminar miembro"
          titulo={`¿Eliminar a ${dialogo.usuario.nombre}?`}
          mensaje={<>Perderá el acceso al área de miembros. <strong className="font-medium text-stone-800">Esta acción no se puede deshacer.</strong></>}
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarUsuario(dialogo.usuario.id)}
          onCerrar={cerrarDialogo}
        />
      )}

      {dialogo?.tipo === 'restablecer' && (
        <ConfirmDialog
          eyebrow="Restablecer contraseña"
          titulo={`¿Nueva contraseña para ${dialogo.usuario.nombre}?`}
          mensaje="Se generará una contraseña nueva y la actual dejará de funcionar. Tendrás que entregársela en persona."
          textoConfirmar="Generar nueva"
          onConfirmar={() => restablecerContrasena(dialogo.usuario)}
          onCerrar={cerrarDialogo}
        />
      )}

      {dialogo?.tipo === 'contrasena' && (
        <PasswordDialog
          usuario={dialogo.usuario}
          contrasena={dialogo.contrasena}
          motivo={dialogo.motivo}
          onCerrar={cerrarDialogo}
        />
      )}

    </div>
  );
}

// ============= ESTADO VACÍO =============
// Cambia el mensaje según si está vacío por búsqueda, por filtro o por falta de miembros.
function EmptyState({ busqueda, grupo }: { busqueda: string; grupo: FiltroGrupo }) {

  if (busqueda) {
    return (
      <div className="text-center py-16">
        <p className="font-serif italic text-xl text-stone-500 mb-2">
          Nadie coincide con «{busqueda}»
        </p>
        <p className="text-sm text-stone-400">
          Prueba con otro nombre o cambia de sección.
        </p>
      </div>
    );
  }

  if (grupo !== 'Todos') {
    return (
      <div className="text-center py-16">
        <p className="font-serif italic text-xl text-stone-500 mb-2">
          Aún no hay miembros en {grupo}
        </p>
        <p className="text-sm text-stone-400">
          Usa «Nuevo miembro» para dar de alta al primero.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <p className="font-serif italic text-xl text-stone-500 mb-2">
        Todavía no hay nadie en el coro
      </p>
      <p className="text-sm text-stone-400">
        Empieza dando de alta a los primeros miembros.
      </p>
    </div>
  );
}
