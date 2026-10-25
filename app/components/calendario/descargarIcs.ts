// Descarga un evento como archivo .ics para añadirlo a la agenda del móvil.

import { generarIcs, type Evento } from '@/lib/calendario';

export function descargarIcs(evento: Evento, detallesInternos: boolean) {
  const blob = new Blob([generarIcs(evento, detallesInternos)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  // Nombre de archivo sin tildes ni espacios: "solemnidad-de-cristo-rey-2026-11-22.ics"
  const nombre = evento.titulo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `${nombre}-${evento.fecha}.ics`;
  enlace.click();
  URL.revokeObjectURL(url);
}
