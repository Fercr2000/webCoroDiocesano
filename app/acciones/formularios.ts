'use server';

// Acciones de servidor de los formularios públicos (inscripción y contratación).
// Se vuelve a validar todo aquí: lo que llega del navegador no es de fiar.
// El campo "web" es una trampa para bots: va oculto y una persona lo deja vacío.

import { correoConfigurado, enviarCorreo, type FilaCorreo } from '@/lib/correo';

export type ResultadoEnvio = 'enviado' | 'no-configurado' | 'invalido' | 'error';

export interface DatosInscripcion {
  tipo: 'coralista' | 'instrumentista';
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  procedencia: string;
  cuerda: string;
  experiencia: string;
  lectura: string;
  instrumento: string;
  nivel: string;
  mensaje: string;
  web: string;
}

export interface DatosContratacion {
  nombre: string;
  email: string;
  telefono: string;
  entidad: string;
  fecha: string;
  lugar: string;
  mensaje: string;
  web: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Recorta y limita la longitud de cada campo.
const limpio = (valor: unknown, max = 200) => (typeof valor === 'string' ? valor.trim().slice(0, max) : '');

async function enviar(trampa: unknown, email: string, obligatorios: string[], correo: { asunto: string; titulo: string; filas: FilaCorreo[] }): Promise<ResultadoEnvio> {
  // Al bot le decimos que ha ido bien para que no insista.
  if (limpio(trampa)) return 'enviado';
  if (!EMAIL.test(email) || obligatorios.some((v) => !v)) return 'invalido';
  if (!correoConfigurado) return 'no-configurado';
  try {
    return (await enviarCorreo({ ...correo, responderA: email })) ? 'enviado' : 'error';
  } catch (e) {
    console.error('Fallo al enviar el formulario:', e);
    return 'error';
  }
}

export async function enviarInscripcion(datos: DatosInscripcion): Promise<ResultadoEnvio> {
  const tipo = datos.tipo === 'instrumentista' ? 'instrumentista' : 'coralista';
  const d = {
    nombre: limpio(datos.nombre),
    apellidos: limpio(datos.apellidos),
    email: limpio(datos.email),
    telefono: limpio(datos.telefono, 40),
    procedencia: limpio(datos.procedencia),
    cuerda: limpio(datos.cuerda),
    experiencia: limpio(datos.experiencia),
    lectura: limpio(datos.lectura),
    instrumento: limpio(datos.instrumento),
    nivel: limpio(datos.nivel),
    mensaje: limpio(datos.mensaje, 4000),
  };
  const especifico = tipo === 'coralista' ? d.cuerda : d.instrumento;
  const nombreCompleto = `${d.nombre} ${d.apellidos}`;

  return enviar(datos.web, d.email, [d.nombre, d.apellidos, d.telefono, especifico], {
    asunto: `Nueva inscripción (${tipo}): ${nombreCompleto}`,
    titulo: `Quiere unirse como ${tipo}`,
    filas: [
      ['Nombre', nombreCompleto],
      ['Email', d.email],
      ['Teléfono', d.telefono],
      ['Procedencia', d.procedencia],
      ...(tipo === 'coralista'
        ? ([['Cuerda', d.cuerda], ['Experiencia coral', d.experiencia], ['Lectura musical', d.lectura]] as FilaCorreo[])
        : ([['Instrumento', d.instrumento], ['Nivel', d.nivel]] as FilaCorreo[])),
      ['Mensaje', d.mensaje],
    ],
  });
}

export async function enviarContratacion(datos: DatosContratacion): Promise<ResultadoEnvio> {
  const d = {
    nombre: limpio(datos.nombre),
    email: limpio(datos.email),
    telefono: limpio(datos.telefono, 40),
    entidad: limpio(datos.entidad),
    fecha: limpio(datos.fecha, 20),
    lugar: limpio(datos.lugar),
    mensaje: limpio(datos.mensaje, 4000),
  };
  // La fecha llega como AAAA-MM-DD; en el correo, a la española.
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(d.fecha) ? d.fecha.split('-').reverse().join('/') : d.fecha;

  return enviar(datos.web, d.email, [d.nombre, d.telefono, d.lugar, d.mensaje], {
    asunto: `Solicitud para una celebración: ${d.nombre}`,
    titulo: 'Quiere contar con el coro',
    filas: [
      ['Nombre', d.nombre],
      ['Email', d.email],
      ['Teléfono', d.telefono],
      ['Entidad', d.entidad],
      ['Fecha prevista', fecha],
      ['Lugar', d.lugar],
      ['Mensaje', d.mensaje],
    ],
  });
}
