// Formación del coro y la orquesta sobre el escenario, vista desde arriba
// (el público estaría abajo, detrás del Director). Cada sección agrupa uno o
// varios roles y tiene su sitio en el plano.
//
// Posiciones en % del escenario (x, y = centro de la pieza; w = ancho),
// tomadas del esquema de la formación: el coro en gradas al fondo, el viento
// en un arco exterior, la cuerda en un arco interior y el Director delante.

import type { GrupoRol, Rol } from './roles';

// Componente que aparece en la página pública. Es una lista propia, separada
// de las cuentas de usuario: el director puede incluir a alguien sin cuenta
// (un músico invitado, por ejemplo). Tabla `componentes` en Supabase.
export interface Componente {
  id: string;
  nombre: string;
  rol: Rol;
}

export interface Seccion {
  id: string;
  nombre: string;
  grupo: GrupoRol;
  roles: Rol[];
  x: number;
  y: number;
  w: number;
}

export const SECCIONES: Seccion[] = [
  // Coro (gradas del fondo)
  { id: 'tenores', nombre: 'Tenores', grupo: 'Voces', roles: ['Tenor'], x: 26.4, y: 7.5, w: 44 },
  { id: 'bajos', nombre: 'Bajos', grupo: 'Voces', roles: ['Bajo'], x: 73.6, y: 7.5, w: 44 },
  { id: 'sopranos', nombre: 'Sopranos', grupo: 'Voces', roles: ['Soprano'], x: 26.4, y: 18.5, w: 44 },
  { id: 'contraltos', nombre: 'Contraltos', grupo: 'Voces', roles: ['Contralto'], x: 73.6, y: 18.5, w: 44 },

  // Órgano y percusión en las esquinas
  { id: 'organo', nombre: 'Órgano', grupo: 'Otros', roles: ['Órgano'], x: 9.5, y: 38, w: 14 },
  { id: 'percusion', nombre: 'Percusión', grupo: 'Otros', roles: ['Percusión'], x: 90.5, y: 38, w: 14 },

  // Viento: arco exterior
  { id: 'fagotes', nombre: 'Fagotes', grupo: 'Viento', roles: ['Fagot'], x: 42, y: 37.5, w: 15 },
  { id: 'trompas', nombre: 'Trompas', grupo: 'Viento', roles: ['Trompa'], x: 58, y: 37.5, w: 15 },
  { id: 'clarinetes', nombre: 'Clarinetes', grupo: 'Viento', roles: ['Clarinete'], x: 28.2, y: 47, w: 15 },
  { id: 'trompetas', nombre: 'Trompetas', grupo: 'Viento', roles: ['Trompeta'], x: 71.8, y: 47, w: 15 },
  { id: 'oboes', nombre: 'Oboes', grupo: 'Viento', roles: ['Oboe'], x: 17.6, y: 62.5, w: 15 },
  { id: 'trombones', nombre: 'Trombones', grupo: 'Viento', roles: ['Trombón'], x: 82.4, y: 62.5, w: 15 },
  { id: 'flautas', nombre: 'Flautas', grupo: 'Viento', roles: ['Flauta'], x: 12.7, y: 82, w: 15 },

  // Cuerda: arco interior (el contrabajo cierra por fuera, como en el esquema)
  { id: 'violines-2', nombre: 'Violines II', grupo: 'Cuerda', roles: ['Violín 2'], x: 39.6, y: 64.5, w: 17 },
  { id: 'violas', nombre: 'Violas', grupo: 'Cuerda', roles: ['Viola'], x: 60.4, y: 64.5, w: 17 },
  { id: 'violines-1', nombre: 'Violines I', grupo: 'Cuerda', roles: ['Violín 1'], x: 30.7, y: 80, w: 17 },
  { id: 'violonchelos', nombre: 'Violonchelos', grupo: 'Cuerda', roles: ['Violonchelo'], x: 69.3, y: 80, w: 17 },
  { id: 'contrabajos', nombre: 'Contrabajos', grupo: 'Cuerda', roles: ['Contrabajo'], x: 87.3, y: 82, w: 15 },

  // Delante de todos
  { id: 'director', nombre: 'Dirección', grupo: 'Dirección', roles: ['Director'], x: 50, y: 92, w: 17 },
];

// Orden de lectura en móvil: del fondo del escenario hacia el público.
export const FILAS_MOVIL: string[][] = [
  ['tenores', 'bajos', 'sopranos', 'contraltos'],
  ['organo', 'percusion'],
  ['fagotes', 'trompas', 'clarinetes', 'trompetas', 'oboes', 'trombones', 'flautas'],
  ['violines-2', 'violas', 'violines-1', 'violonchelos', 'contrabajos'],
  ['director'],
];

export function miembrosDe(seccion: Seccion, componentes: Componente[]) {
  return componentes
    .filter((u) => seccion.roles.includes(u.rol))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
