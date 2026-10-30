'use client';

// Modal para crear un miembro nuevo o editar uno existente (si recibe `usuario`).
// Al crear pide también la contraseña inicial; al editar no, porque eso
// se hace con "Restablecer contraseña" desde la tarjeta.
// Los roles de gestión solo aparecen si quien edita puede asignarlos (el Director).

import { useState } from 'react';
import { Wand2, Check, ShieldCheck } from 'lucide-react';
import Modal, { BotonPrincipal, BotonSecundario } from '../../../components/Modal';
import { Field, Select, inputClasses } from '@/app/components/formulario';
import { gruposRoles, nombresGrupos, generarContrasena, type Rol, type Usuario } from '@/lib/roles';
import { ROLES_GESTION, TODOS_LOS_ROLES, type RolGestion } from '@/lib/gestion';

export interface DatosUsuario {
  nombre: string;
  email: string;
  rol: Rol;
  gestion: RolGestion[];
  contrasena: string;
}

interface CreateUserModalProps {
  usuario?: Usuario;
  emailsOcupados: string[];
  puedeAsignarRoles: boolean;
  onGuardar: (datos: DatosUsuario) => void;
  onCerrar: () => void;
}

type Errores = Partial<Record<keyof DatosUsuario, string>>;

export default function CreateUserModal({ usuario, emailsOcupados, puedeAsignarRoles, onGuardar, onCerrar }: CreateUserModalProps) {

  const editando = usuario !== undefined;

  const [nombre, setNombre] = useState(usuario?.nombre ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [rol, setRol] = useState<Rol | ''>(usuario?.rol ?? '');
  const [gestion, setGestion] = useState<RolGestion[]>(usuario?.gestion ?? []);
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
    // El Director no guarda roles: los tiene todos siempre.
    onGuardar({ nombre: nombre.trim(), email: email.trim().toLowerCase(), rol, gestion: rol === 'Director' ? [] : gestion, contrasena });
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

        {/* ROLES DE GESTIÓN (solo los ve y cambia el Director) */}
        {puedeAsignarRoles && (
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">Roles de gestión</span>
              <span className="text-xs text-stone-400 italic">Qué partes de la web puede editar</span>
            </div>
            {rol === 'Director' ? (
              <p className="flex gap-3 text-sm text-stone-600 bg-red-50/60 border border-red-800/15 rounded-sm p-4">
                <ShieldCheck size={18} strokeWidth={1.5} className="flex-shrink-0 text-red-800" />
                El Director tiene siempre todos los roles y es quien los reparte.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {TODOS_LOS_ROLES.map((r) => {
                  const activo = gestion.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      role="checkbox"
                      aria-checked={activo}
                      onClick={() => setGestion((g) => (activo ? g.filter((x) => x !== r) : [...g, r]))}
                      className={`flex items-start gap-3 text-left rounded-sm border p-3 transition-colors ${
                        activo ? 'border-red-800 bg-red-50/70' : 'border-stone-200 bg-white hover:border-red-800/40'
                      }`}
                    >
                      <span className={`flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-sm border transition-colors ${
                        activo ? 'bg-gradient-to-br from-red-800 to-red-950 border-red-900 text-stone-50' : 'border-stone-300'
                      }`}>
                        {activo && <Check size={13} strokeWidth={2.5} />}
                      </span>
                      <span>
                        <span className={`block text-xs tracking-[0.15em] uppercase font-medium ${activo ? 'text-red-800' : 'text-stone-800'}`}>{ROLES_GESTION[r].nombre}</span>
                        <span className="block text-xs text-stone-500 mt-0.5 leading-snug">{ROLES_GESTION[r].descripcion}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
