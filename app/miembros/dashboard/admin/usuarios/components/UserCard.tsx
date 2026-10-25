'use client';

import { Mail, Pencil, KeyRound, Trash2 } from 'lucide-react';
import { grupoDeRol, type Usuario } from '@/lib/roles';

interface UserCardProps {
  usuario: Usuario;
  esTuCuenta: boolean;
  onEditar: () => void;
  onRestablecer: () => void;
  onEliminar: () => void;
}

export default function UserCard({ usuario, esTuCuenta, onEditar, onRestablecer, onEliminar }: UserCardProps) {

  const { nombre, email, rol } = usuario;

  return (
    <div className="group relative flex flex-col bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm overflow-hidden shadow-sm shadow-stone-900/5 hover:shadow-xl hover:shadow-red-900/10 hover:border-red-800/30 hover:-translate-y-0.5 transition-all duration-300">

      {/* Banda lateral izquierda decorativa (granate vertical) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Esquina decorativa superior derecha (sutil) */}
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20 pointer-events-none" />

      <div className="flex-1 p-6 pl-7">

        {/* Eyebrow: rol + sección */}
        <div className="flex items-center gap-2 mb-4 pr-6">
          <span className="text-[10px] tracking-[0.3em] uppercase text-red-800/80 font-medium">
            {rol}
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
            {grupoDeRol(rol)}
          </span>
        </div>

        {/* Nombre con capitular granate */}
        <h3 className="font-serif text-stone-900 tracking-tight leading-tight mb-3">
          <span className="text-4xl text-red-800 font-medium leading-none">{nombre.charAt(0)}</span>
          <span className="text-2xl">{nombre.slice(1)}</span>
        </h3>

        <p className="flex items-center gap-2 text-sm text-stone-500 min-w-0">
          <Mail size={14} strokeWidth={1.5} className="text-red-800/60 flex-shrink-0" />
          <span className="truncate">{email}</span>
        </p>

        {esTuCuenta && (
          <span className="inline-block mt-4 px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-red-800 border border-red-800/30 rounded-full">
            Tu cuenta
          </span>
        )}
      </div>

      {/* ACCIONES */}
      <div className="flex border-t border-stone-200 pl-1">
        <Accion onClick={onEditar} icono={<Pencil size={14} strokeWidth={1.5} />} texto="Editar" />
        <Accion onClick={onRestablecer} icono={<KeyRound size={14} strokeWidth={1.5} />} texto="Contraseña" />
        {/* Tu propia cuenta no se puede borrar: te quedarías sin acceso al panel. */}
        {!esTuCuenta && (
          <Accion onClick={onEliminar} icono={<Trash2 size={14} strokeWidth={1.5} />} texto="Eliminar" />
        )}
      </div>

    </div>
  );
}

function Accion({ onClick, icono, texto }: { onClick: () => void; icono: React.ReactNode; texto: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 hover:text-red-800 hover:bg-red-50/60 transition-colors border-l border-stone-200 first:border-l-0"
    >
      {icono}
      {texto}
    </button>
  );
}
