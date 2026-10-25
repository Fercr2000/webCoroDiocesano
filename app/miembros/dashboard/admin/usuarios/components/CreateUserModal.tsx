'use client';

// Modal para crear un miembro nuevo o editar uno existente (si recibe `usuario`).
// Al crear pide también la contraseña inicial; al editar no, porque eso
// se hace con "Restablecer contraseña" desde la tarjeta.

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import Modal, { BotonPrincipal, BotonSecundario } from '../../../components/Modal';
import { Field, Select, inputClasses } from '@/app/components/formulario';
import { gruposRoles, nombresGrupos, generarContrasena, type Rol, type Usuario } from '@/lib/roles';

export interface DatosUsuario {
  nombre: string;
  email: string;
  rol: Rol;
  contrasena: string;
}

interface CreateUserModalProps {
  usuario?: Usuario;
  emailsOcupados: string[];
  onGuardar: (datos: DatosUsuario) => void;
  onCerrar: () => void;
}

type Errores = Partial<Record<keyof DatosUsuario, string>>;

export default function CreateUserModal({ usuario, emailsOcupados, onGuardar, onCerrar }: CreateUserModalProps) {

  const editando = usuario !== undefined;

  const [nombre, setNombre] = useState(usuario?.nombre ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [rol, setRol] = useState<Rol | ''>(usuario?.rol ?? '');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<Errores>({});

  const validar = (): Errores => {
    const e: Errores = {};
    const emailLimpio = email.trim().toLowerCase();
    if (!nombre.trim()) e.nombre = 'Escribe el nombre del miembro.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) e.email = 'Escribe un email válido.';
    else if (emailsOcupados.includes(emailLimpio)) e.email = 'Ya hay un miembro con este email.';
    if (!rol) e.rol = 'Elige su cuerda o instrumento.';
    if (!editando && contrasena.length < 8) e.contrasena = 'Mínimo 8 caracteres.';
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0 || !rol) return;
    onGuardar({ nombre: nombre.trim(), email: email.trim().toLowerCase(), rol, contrasena });
  };

  return (
    <Modal
      eyebrow={editando ? 'Editar miembro' : 'Nuevo miembro'}
      titulo={editando ? usuario.nombre : 'Da la bienvenida a alguien'}
      onCerrar={onCerrar}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        <Field label="Nombre y apellidos" required error={errores.nombre}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
            className={inputClasses}
          />
        </Field>

        <Field label="Email" required hint="Será su usuario" error={errores.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
          />
        </Field>

        <Field label="Cuerda o instrumento" required error={errores.rol}>
          <Select value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
            <option value="">— Selecciona —</option>
            {nombresGrupos.map((grupo) => (
              <optgroup key={grupo} label={grupo}>
                {gruposRoles[grupo].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>

        {!editando && (
          <Field label="Contraseña inicial" required hint="Se la entregarás tú" error={errores.contrasena}>
            <div className="flex gap-2">
              <input
                type="text"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className={`${inputClasses} font-mono tracking-wider`}
              />
              <button
                type="button"
                onClick={() => setContrasena(generarContrasena())}
                className="flex-shrink-0 flex items-center gap-2 px-4 text-[10px] tracking-[0.2em] uppercase font-medium text-red-800 border border-red-800/40 hover:border-red-800 hover:bg-red-50/60 transition-colors rounded-sm"
                title="Generar automáticamente"
              >
                <Wand2 size={14} strokeWidth={1.5} />
                <span className="hidden sm:inline">Generar</span>
              </button>
            </div>
          </Field>
        )}

        {editando && (
          <p className="text-sm text-stone-500 italic">
            Para darle una contraseña nueva, usa «Contraseña» en su tarjeta.
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <BotonSecundario type="button" onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrincipal type="submit">{editando ? 'Guardar cambios' : 'Crear miembro'}</BotonPrincipal>
        </div>

      </form>
    </Modal>
  );
}
