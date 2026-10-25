// Roles del coro y la orquesta, agrupados por sección.
// Es la única fuente de verdad: la usan la gestión de usuarios y, más
// adelante, la subida de archivos (cada partitura pertenece a un rol).

export const gruposRoles = {
  Voces: ['Soprano', 'Contralto', 'Tenor', 'Bajo'],
  Cuerda: ['Violín 1', 'Violín 2', 'Viola', 'Violonchelo', 'Contrabajo'],
  Viento: ['Flauta', 'Oboe', 'Clarinete', 'Fagot', 'Trompa', 'Trompeta', 'Trombón'],
  Otros: ['Percusión', 'Órgano'],
  Dirección: ['Director'],
} as const;

export type GrupoRol = keyof typeof gruposRoles;
export type Rol = (typeof gruposRoles)[GrupoRol][number];

export const nombresGrupos = Object.keys(gruposRoles) as GrupoRol[];

export function grupoDeRol(rol: Rol): GrupoRol {
  return nombresGrupos.find((g) => (gruposRoles[g] as readonly Rol[]).includes(rol))!;
}

// Miembro del coro tal y como se guardará en la tabla `usuarios` de Supabase.
// La contraseña nunca forma parte de él: la gestiona Supabase Auth.
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

// Contraseña inicial fácil de dictar y copiar: tres bloques de 4 caracteres
// sin los que se confunden entre sí (0/O, 1/l/I).
export function generarContrasena() {
  const alfabeto = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const aleatorios = crypto.getRandomValues(new Uint32Array(12));
  const caracteres = Array.from(aleatorios, (n) => alfabeto[n % alfabeto.length]);
  return [0, 4, 8].map((i) => caracteres.slice(i, i + 4).join('')).join('-');
}
