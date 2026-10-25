// Eventos del calendario (ensayos y celebraciones), tal y como se guardarán
// en la tabla `eventos` de Supabase.

import { grupoDeRol, type GrupoRol, type Rol } from './roles';
import { partesFecha } from './fechas';

export type TipoEvento = 'ensayo' | 'celebracion';
export type EstadoEvento = 'confirmado' | 'aplazado' | 'cancelado';

export interface Evento {
  id: string;
  tipo: TipoEvento;
  titulo: string;
  fecha: string;               // 'AAAA-MM-DD'
  horaInicio: string;          // 'HH:MM'
  horaFin?: string;
  horaConvocatoria?: string;   // a qué hora deben llegar los miembros (solo área privada)
  lugar: string;
  repertorioId?: string;
  secciones: GrupoRol[];       // vacío = tutti
  vestimenta?: string;
  notas?: string;
  estado: EstadoEvento;
}

export const ETIQUETA_TIPO: Record<TipoEvento, string> = {
  ensayo: 'Ensayo',
  celebracion: 'Celebración',
};

export const ETIQUETA_ESTADO: Record<EstadoEvento, string> = {
  confirmado: 'Confirmado',
  aplazado: 'Aplazado',
  cancelado: 'Cancelado',
};

export function ordenarEventos(a: Evento, b: Evento) {
  return a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio);
}

// El Director está convocado a todo; el resto, si es tutti o si su sección figura.
export function estaConvocado(evento: Evento, rol: Rol) {
  return evento.secciones.length === 0 || rol === 'Director' || evento.secciones.includes(grupoDeRol(rol));
}

export function textoConvocatoria(evento: Evento) {
  return evento.secciones.length === 0 ? 'Tutti' : evento.secciones.join(' · ');
}

// ============= EXPORTAR A AGENDA (.ics) =============
// Formato estándar que entienden Google Calendar, iPhone y Outlook.
// Las horas van "flotantes" (sin zona): se leen en la hora local del móvil,
// que para los miembros del coro es la de Jaén.

const DURACION_POR_DEFECTO_MIN = 90;

function horaIcs(fecha: string, hora: string, minutosExtra = 0) {
  const { anio, mes, dia } = partesFecha(fecha);
  const [h, m] = hora.split(':').map(Number);
  // Date resuelve solo el paso de medianoche (y de mes/año) al sumar minutos.
  const d = new Date(anio, mes, dia, h, m + minutosExtra);
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${dos(d.getMonth() + 1)}${dos(d.getDate())}T${dos(d.getHours())}${dos(d.getMinutes())}00`;
}

const escaparIcs = (texto: string) =>
  texto.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// Las líneas de un .ics no deben pasar de 75 caracteres: se parten con un espacio inicial.
const plegar = (linea: string) => linea.match(/.{1,73}/g)!.join('\r\n ');

export function generarIcs(evento: Evento, detallesInternos: boolean) {
  const fin = evento.horaFin
    ? horaIcs(evento.fecha, evento.horaFin)
    : horaIcs(evento.fecha, evento.horaInicio, DURACION_POR_DEFECTO_MIN);

  const descripcion = [
    detallesInternos && evento.horaConvocatoria && `Convocatoria: ${evento.horaConvocatoria}`,
    detallesInternos && evento.tipo === 'ensayo' && `Secciones: ${textoConvocatoria(evento)}`,
    detallesInternos && evento.vestimenta && `Vestimenta: ${evento.vestimenta}`,
    detallesInternos && evento.notas,
    'Coro y Orquesta de la Diócesis de Jaén',
  ].filter(Boolean).join('\n');

  const sello = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Coro de la Diocesis de Jaen//Calendario//ES',
    'BEGIN:VEVENT',
    `UID:${evento.id}@corodiocesanojaen`,
    `DTSTAMP:${sello}`,
    `DTSTART:${horaIcs(evento.fecha, evento.horaInicio)}`,
    `DTEND:${fin}`,
    `SUMMARY:${escaparIcs(evento.titulo)}`,
    `LOCATION:${escaparIcs(evento.lugar)}`,
    `DESCRIPTION:${escaparIcs(descripcion)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(plegar).join('\r\n');
}
