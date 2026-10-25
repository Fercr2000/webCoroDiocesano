'use client';

// Muestra la contraseña recién creada o restablecida para que el director
// la copie y se la entregue en persona. No se guarda en ningún sitio:
// al cerrar este diálogo ya no se puede volver a ver.

import { useState } from 'react';
import { Copy, Check, ShieldAlert } from 'lucide-react';
import Modal, { BotonPrincipal } from '../../../components/Modal';
import type { Usuario } from '@/lib/roles';

interface PasswordDialogProps {
  usuario: Usuario;
  contrasena: string;
  motivo: 'creado' | 'restablecida';
  onCerrar: () => void;
}

export default function PasswordDialog({ usuario, contrasena, motivo, onCerrar }: PasswordDialogProps) {

  const [copiado, setCopiado] = useState(false);

  // Copia usuario y contraseña juntos, listos para pegar en un mensaje.
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`Usuario: ${usuario.email}\nContraseña: ${contrasena}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles: la contraseña sigue visible para copiarla a mano.
    }
  };

  return (
    <Modal
      eyebrow={motivo === 'creado' ? 'Miembro creado' : 'Contraseña restablecida'}
      titulo={`Datos de acceso de ${usuario.nombre.split(' ')[0]}`}
      onCerrar={onCerrar}
    >
      <dl className="space-y-5 mb-8">
        <div>
          <dt className="text-xs tracking-[0.2em] uppercase text-stone-500 font-medium mb-2">Usuario</dt>
          <dd className="text-stone-900 break-all">{usuario.email}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.2em] uppercase text-stone-500 font-medium mb-2">Contraseña</dt>
          <dd className="relative bg-stone-50 border border-stone-200 rounded-sm py-4 px-5 font-mono text-xl tracking-wider text-red-900 select-all break-all">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950" />
            {contrasena}
          </dd>
        </div>
      </dl>

      <p className="flex gap-3 text-sm text-stone-600 leading-relaxed bg-red-50/60 border border-red-800/15 rounded-sm p-4 mb-8">
        <ShieldAlert size={18} strokeWidth={1.5} className="text-red-800 flex-shrink-0 mt-0.5" />
        <span>Cópiala ahora y entrégala en persona: por seguridad, no se volverá a mostrar.</span>
      </p>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={copiar}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 border border-stone-300 hover:border-red-800 transition-colors rounded-sm"
        >
          {copiado ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
          {copiado ? 'Copiado' : 'Copiar datos'}
        </button>
        <BotonPrincipal type="button" onClick={onCerrar}>Hecho</BotonPrincipal>
      </div>
    </Modal>
  );
}
