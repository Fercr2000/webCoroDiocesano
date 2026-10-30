// Roles de GESTIÓN de la web (qué partes puede editar cada persona). Son
// independientes del rol musical (Tenor, Violín 1…) y acumulables: una persona
// puede tener uno, varios o ninguno. El Director los tiene SIEMPRE todos y es
// el único que puede dar o quitar roles de gestión. Los cambios se publican al
// momento, sin revisión. En Supabase: tabla `permisos (usuario_id, rol)` + RLS.

export const ROLES_GESTION = {
  portada: {
    nombre: 'Portada e inicio',
    descripcion: 'Imágenes y textos del hero, textos del inicio y palabras del Obispo.',
  },
  'sobre-nosotros': {
    nombre: 'Sobre nosotros',
    descripcion: 'Textos de Sobre nosotros, responsables y sus cartas, y componentes.',
  },
  galeria: {
    nombre: 'Galería',
    descripcion: 'Álbumes y fotos de la galería.',
  },
  agenda: {
    nombre: 'Agenda',
    descripcion: 'Celebraciones del calendario.',
  },
  musica: {
    nombre: 'Música',
    descripcion: 'Catálogo público, repertorios litúrgicos y archivo de partituras y audios.',
  },
  secretaria: {
    nombre: 'Secretaría',
    descripcion: 'Cuentas de los miembros y datos de contacto.',
  },
} as const;

export type RolGestion = keyof typeof ROLES_GESTION;
export const TODOS_LOS_ROLES = Object.keys(ROLES_GESTION) as RolGestion[];

interface ConPermisos {
  rol: string;
  gestion?: RolGestion[];
}

// Roles que una persona tiene de verdad (el Director, todos).
export const rolesEfectivos = (u: ConPermisos): RolGestion[] =>
  u.rol === 'Director' ? TODOS_LOS_ROLES : (u.gestion ?? []);

export const puedeGestionar = (u: ConPermisos, rol: RolGestion) => rolesEfectivos(u).includes(rol);

// Solo el Director reparte o retira roles de gestión.
export const puedeAsignarRoles = (u: ConPermisos) => u.rol === 'Director';
