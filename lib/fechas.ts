// Utilidades de fecha del calendario.
//
// Las fechas viajan como texto 'AAAA-MM-DD' (igual que una columna DATE de
// Supabase) y NUNCA se pasan por new Date('AAAA-MM-DD'): eso las interpreta
// en UTC y, según la zona horaria, devuelve el día anterior. Aquí todo se
// construye en hora local con new Date(año, mes, día), que además resuelve
// solo los años bisiestos y los saltos de mes y de año.
//
// Convención: `mes` va de 0 (enero) a 11 (diciembre), como en Date.
// Semana española: empieza en lunes (índice 0) y acaba en domingo (6).

export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const dos = (n: number) => String(n).padStart(2, '0');

export function partesFecha(clave: string) {
  const [anio, mes, dia] = clave.split('-').map(Number);
  return { anio, mes: mes - 1, dia };
}

export function claveDesde(anio: number, mes: number, dia: number) {
  return `${anio}-${dos(mes + 1)}-${dos(dia)}`;
}

export function claveDe(fecha: Date) {
  return claveDesde(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

// Día de la semana con el lunes como 0.
export function diaSemana(clave: string) {
  const { anio, mes, dia } = partesFecha(clave);
  return (new Date(anio, mes, dia).getDay() + 6) % 7;
}

// El día 0 del mes siguiente es el último de este (28/29 en febrero según el año).
export function diasEnMes(anio: number, mes: number) {
  return new Date(anio, mes + 1, 0).getDate();
}

// Días naturales entre dos fechas. Se calcula en UTC para que el cambio de
// hora (días de 23 o 25 horas) no descuadre la cuenta.
export function diasEntre(desde: string, hasta: string) {
  const a = partesFecha(desde);
  const b = partesFecha(hasta);
  return Math.round((Date.UTC(b.anio, b.mes, b.dia) - Date.UTC(a.anio, a.mes, a.dia)) / 86_400_000);
}

export function sumarDias(clave: string, dias: number) {
  const { anio, mes, dia } = partesFecha(clave);
  return claveDe(new Date(anio, mes, dia + dias));
}

// "domingo, 22 de noviembre de 2026"
export function fechaLarga(clave: string) {
  const { anio, mes, dia } = partesFecha(clave);
  return `${DIAS_SEMANA[diaSemana(clave)]}, ${dia} de ${MESES[mes]} de ${anio}`;
}
