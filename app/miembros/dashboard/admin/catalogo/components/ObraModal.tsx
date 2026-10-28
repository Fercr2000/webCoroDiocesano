'use client';

// Modal para añadir o editar una obra del catálogo público.

import { useState } from 'react';
import Modal, { BotonPrincipal, BotonSecundario } from '../../../components/Modal';
import { Field, Select, inputClasses } from '@/app/components/formulario';
import {
  FAMILIAS_TIPO, EPOCAS, FORMACIONES, IDIOMAS,
  type Obra, type TipoObra, type Epoca, type Formacion, type Idioma, type FamiliaTipo,
} from '@/lib/catalogo';

export type DatosObra = Omit<Obra, 'id'>;

interface ObraModalProps {
  obra?: Obra;
  onGuardar: (datos: DatosObra) => void;
  onCerrar: () => void;
}

export default function ObraModal({ obra, onGuardar, onCerrar }: ObraModalProps) {

  const editando = obra !== undefined;

  const [titulo, setTitulo] = useState(obra?.titulo ?? '');
  const [compositor, setCompositor] = useState(obra?.compositor ?? '');
  const [fechas, setFechas] = useState(obra?.fechas ?? '');
  const [tipo, setTipo] = useState<TipoObra | ''>(obra?.tipo ?? '');
  const [epoca, setEpoca] = useState<Epoca | ''>(obra?.epoca ?? '');
  const [formacion, setFormacion] = useState<Formacion>(obra?.formacion ?? 'A capella');
  const [idioma, setIdioma] = useState<Idioma>(obra?.idioma ?? 'Latín');
  const [errores, setErrores] = useState<Partial<Record<'titulo' | 'compositor' | 'tipo' | 'epoca', string>>>({});

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: typeof errores = {};
    if (!titulo.trim()) e.titulo = 'Escribe el título de la obra.';
    if (!compositor.trim()) e.compositor = 'Escribe el autor (o «Anónimo»).';
    if (!tipo) e.tipo = 'Elige el tipo de obra.';
    if (!epoca) e.epoca = 'Elige la época.';
    setErrores(e);
    if (Object.keys(e).length > 0 || !tipo || !epoca) return;
    onGuardar({ titulo: titulo.trim(), compositor: compositor.trim(), fechas: fechas.trim() || undefined, tipo, epoca, formacion, idioma });
  };

  return (
    <Modal eyebrow={editando ? 'Editar obra' : 'Nueva obra'} titulo={editando ? obra.titulo : 'Una obra más en el atril'} onCerrar={onCerrar}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        <Field label="Título" required error={errores.titulo}>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ave verum corpus" autoFocus className={inputClasses} />
        </Field>

        <div className="grid sm:grid-cols-[1fr_9rem] gap-6 sm:gap-3">
          <Field label="Autor" required error={errores.compositor}>
            <input type="text" value={compositor} onChange={(e) => setCompositor(e.target.value)} placeholder="Wolfgang Amadeus Mozart" className={inputClasses} />
          </Field>
          <Field label="Fechas" hint="Opc.">
            <input type="text" value={fechas} onChange={(e) => setFechas(e.target.value)} placeholder="1756–1791" className={inputClasses} />
          </Field>
        </div>

        <Field label="Tipo de obra" required error={errores.tipo}>
          <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoObra)}>
            <option value="">— Selecciona —</option>
            {(Object.keys(FAMILIAS_TIPO) as FamiliaTipo[]).map((familia) => (
              <optgroup key={familia} label={familia}>
                {FAMILIAS_TIPO[familia].map((t) => <option key={t} value={t}>{t}</option>)}
              </optgroup>
            ))}
          </Select>
        </Field>

        <Field label="Época" required error={errores.epoca}>
          <Select value={epoca} onChange={(e) => setEpoca(e.target.value as Epoca)}>
            <option value="">— Selecciona —</option>
            {EPOCAS.map((ep) => <option key={ep} value={ep}>{ep}</option>)}
          </Select>
        </Field>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-3">
          <Field label="Formación">
            <Select value={formacion} onChange={(e) => setFormacion(e.target.value as Formacion)}>
              {FORMACIONES.map((f) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Idioma">
            <Select value={idioma} onChange={(e) => setIdioma(e.target.value as Idioma)}>
              {IDIOMAS.map((i) => <option key={i} value={i}>{i}</option>)}
            </Select>
          </Field>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <BotonSecundario type="button" onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrincipal type="submit">{editando ? 'Guardar cambios' : 'Añadir al catálogo'}</BotonPrincipal>
        </div>
      </form>
    </Modal>
  );
}
