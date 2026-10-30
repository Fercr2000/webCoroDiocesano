'use client';

// Modal para crear, editar o duplicar un evento del calendario: celebración,
// formación o convivencia. (El modelo admite ensayos, pero de momento no se
// programan desde aquí.)
// La fecha usa el selector nativo del navegador (input type="date"), que
// devuelve siempre 'AAAA-MM-DD' y evita errores de día, mes o año al teclear.

import { useState } from 'react';
import Modal, { BotonPrincipal, BotonSecundario } from '../../../components/Modal';
import { Field, Select, inputClasses } from '@/app/components/formulario';
import { nombresGrupos, type GrupoRol } from '@/lib/roles';
import { ETIQUETA_ESTADO, ETIQUETA_TIPO, TIPOS_VISIBLES, type Evento, type EstadoEvento, type TipoEvento } from '@/lib/calendario';
import type { Repertorio } from '@/lib/archivo';

export type DatosEvento = Omit<Evento, 'id'>;

interface EventoModalProps {
  modo: 'crear' | 'editar' | 'duplicar';
  inicial?: DatosEvento;
  repertorios: Repertorio[];
  onGuardar: (datos: DatosEvento) => void;
  onCerrar: () => void;
}

type Errores = Partial<Record<'titulo' | 'fecha' | 'horaInicio' | 'horaFin' | 'horaConvocatoria' | 'lugar', string>>;

const PLACEHOLDER_TITULO: Record<TipoEvento, string> = {
  celebracion: 'Solemnidad de...',
  formacion: 'Taller de técnica vocal...',
  convivencia: 'Convivencia de Adviento...',
  ensayo: 'Ensayo general...',
};

const TITULOS = {
  crear: { eyebrow: 'Nuevo evento', titulo: 'Una nueva cita' },
  editar: { eyebrow: 'Editar evento', titulo: '' },
  duplicar: { eyebrow: 'Duplicar evento', titulo: 'La misma cita, otro día' },
};

export default function EventoModal({ modo, inicial, repertorios, onGuardar, onCerrar }: EventoModalProps) {

  const [titulo, setTitulo] = useState(inicial?.titulo ?? '');
  const [fecha, setFecha] = useState(inicial?.fecha ?? '');
  const [horaConvocatoria, setHoraConvocatoria] = useState(inicial?.horaConvocatoria ?? '');
  const [horaInicio, setHoraInicio] = useState(inicial?.horaInicio ?? '');
  const [horaFin, setHoraFin] = useState(inicial?.horaFin ?? '');
  const [lugar, setLugar] = useState(inicial?.lugar ?? '');
  const [repertorioId, setRepertorioId] = useState(inicial?.repertorioId ?? '');
  const [secciones, setSecciones] = useState<GrupoRol[]>(inicial?.secciones ?? []);
  const [vestimenta, setVestimenta] = useState(inicial?.vestimenta ?? '');
  const [notas, setNotas] = useState(inicial?.notas ?? '');
  const [estado, setEstado] = useState<EstadoEvento>(inicial?.estado ?? 'confirmado');
  const [tipo, setTipo] = useState<TipoEvento>(inicial && TIPOS_VISIBLES.includes(inicial.tipo) ? inicial.tipo : 'celebracion');
  const [errores, setErrores] = useState<Errores>({});

  const alternarSeccion = (grupo: GrupoRol) =>
    setSecciones((prev) => (prev.includes(grupo) ? prev.filter((g) => g !== grupo) : [...prev, grupo]));

  // Las horas 'HH:MM' se comparan bien como texto.
  const validar = (): Errores => {
    const e: Errores = {};
    if (!titulo.trim()) e.titulo = 'Ponle un título.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) e.fecha = 'Elige la fecha.';
    if (!horaInicio) e.horaInicio = 'Indica la hora de inicio.';
    if (horaConvocatoria && horaInicio && horaConvocatoria > horaInicio) e.horaConvocatoria = 'Debe ser antes del inicio.';
    if (horaFin && horaInicio && horaFin <= horaInicio) e.horaFin = 'Debe ser después del inicio.';
    if (!lugar.trim()) e.lugar = 'Indica el lugar.';
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    // Los campos opcionales vacíos se guardan como "sin valor", no como texto vacío.
    onGuardar({
      tipo,
      titulo: titulo.trim(),
      fecha,
      horaInicio,
      horaFin: horaFin || undefined,
      horaConvocatoria: horaConvocatoria || undefined,
      lugar: lugar.trim(),
      repertorioId: repertorioId || undefined,
      secciones,
      vestimenta: tipo === 'celebracion' ? vestimenta.trim() || undefined : undefined,
      notas: notas.trim() || undefined,
      estado,
    });
  };

  return (
    <Modal
      eyebrow={TITULOS[modo].eyebrow}
      titulo={modo === 'editar' ? inicial?.titulo ?? '' : TITULOS[modo].titulo}
      onCerrar={onCerrar}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* TIPO: deslizador cápsula de tres posiciones */}
        <div className="relative grid grid-cols-3 border border-stone-300 rounded-full overflow-hidden bg-stone-100">
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-br from-red-800 to-red-950 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${TIPOS_VISIBLES.indexOf(tipo) * 100}%)` }}
          />
          {TIPOS_VISIBLES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              aria-pressed={tipo === t}
              className={`relative z-10 py-3 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] uppercase font-medium transition-colors duration-300 ${
                tipo === t ? 'text-stone-50' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {ETIQUETA_TIPO[t]}
            </button>
          ))}
        </div>

        <Field label="Título" required error={errores.titulo}>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder={PLACEHOLDER_TITULO[tipo]}
            autoFocus
            className={inputClasses}
          />
        </Field>

        <Field label="Fecha" required error={errores.fecha}>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClasses} />
        </Field>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-3">
          <Field label="Llegada" hint="Opc." error={errores.horaConvocatoria}>
            <input type="time" value={horaConvocatoria} onChange={(e) => setHoraConvocatoria(e.target.value)} className={inputClasses} />
          </Field>
          <Field label="Inicio" required error={errores.horaInicio}>
            <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className={inputClasses} />
          </Field>
          <Field label="Fin" hint="Opc." error={errores.horaFin}>
            <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className={inputClasses} />
          </Field>
        </div>

        <Field label="Lugar" required error={errores.lugar}>
          <input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="S.I. Catedral de Jaén"
            className={inputClasses}
          />
        </Field>

        {/* SECCIONES CONVOCADAS */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">Convocatoria</span>
            <span className="text-xs text-stone-400 italic">Sin marcar ninguna = tutti</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip activo={secciones.length === 0} onClick={() => setSecciones([])}>Tutti</Chip>
            {nombresGrupos.map((g) => (
              <Chip key={g} activo={secciones.includes(g)} onClick={() => alternarSeccion(g)}>{g}</Chip>
            ))}
          </div>
        </div>

        <Field label="Repertorio" hint="Opcional">
          <Select value={repertorioId} onChange={(e) => setRepertorioId(e.target.value)}>
            <option value="">— Sin repertorio —</option>
            {repertorios.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </Select>
        </Field>

        {tipo === 'celebracion' && (
          <Field label="Vestimenta" hint="Opcional">
            <input
              type="text"
              value={vestimenta}
              onChange={(e) => setVestimenta(e.target.value)}
              placeholder="Túnica, negro..."
              className={inputClasses}
            />
          </Field>
        )}

        <Field label="Notas" hint="Opcional · solo las ven los miembros">
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            className={`${inputClasses} resize-none`}
          />
        </Field>

        <Field label="Estado">
          <Select value={estado} onChange={(e) => setEstado(e.target.value as EstadoEvento)}>
            {(Object.keys(ETIQUETA_ESTADO) as EstadoEvento[]).map((e) => (
              <option key={e} value={e}>{ETIQUETA_ESTADO[e]}</option>
            ))}
          </Select>
        </Field>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <BotonSecundario type="button" onClick={onCerrar}>Cancelar</BotonSecundario>
          <BotonPrincipal type="submit">{modo === 'editar' ? 'Guardar cambios' : 'Crear evento'}</BotonPrincipal>
        </div>

      </form>
    </Modal>
  );
}

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium rounded-full transition-all duration-300 ${
        activo
          ? 'bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md shadow-red-900/30'
          : 'bg-stone-100 text-stone-600 border border-stone-300 hover:border-red-800/60 hover:text-red-800'
      }`}
    >
      {children}
    </button>
  );
}
