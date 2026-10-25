'use client';

// Diálogo genérico de confirmación para acciones que no se pueden deshacer
// (eliminar un miembro, invalidar su contraseña actual...).

import Modal, { BotonPrincipal, BotonSecundario } from './Modal';

interface ConfirmDialogProps {
  eyebrow: string;
  titulo: string;
  mensaje: React.ReactNode;
  textoConfirmar: string;
  onConfirmar: () => void;
  onCerrar: () => void;
}

export default function ConfirmDialog({ eyebrow, titulo, mensaje, textoConfirmar, onConfirmar, onCerrar }: ConfirmDialogProps) {
  return (
    <Modal eyebrow={eyebrow} titulo={titulo} onCerrar={onCerrar}>
      <div className="text-stone-600 leading-relaxed mb-10">
        {mensaje}
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <BotonSecundario type="button" onClick={onCerrar} autoFocus>Cancelar</BotonSecundario>
        <BotonPrincipal type="button" onClick={onConfirmar}>{textoConfirmar}</BotonPrincipal>
      </div>
    </Modal>
  );
}
