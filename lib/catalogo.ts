// Catálogo público de obras montadas: solo datos de catálogo (título, autor,
// tipo, época, formación, idioma). Sin audios, partituras ni repertorios,
// que son del área de miembros. Tabla `obras` en Supabase.

export interface Obra {
  id: string;
  titulo: string;
  compositor: string;          // "Anónimo" si no se conoce
  fechas?: string;             // "1548–1611", "s. XII"…
  tipo: TipoObra;
  epoca: Epoca;
  formacion: Formacion;
  idioma: Idioma;
}

// Tipos agrupados en familias (el orden es el de la página).
export const FAMILIAS_TIPO = {
  'Ordinario de la misa': ['Misa completa', 'Kyrie', 'Gloria', 'Credo', 'Sanctus', 'Agnus Dei'],
  'Propio de la misa': ['Aleluya', 'Salmo', 'Antífona de entrada', 'Ofertorio', 'Comunión'],
  'Motetes y antífonas': ['Motete', 'Antífona mariana', 'Magníficat'],
  'Himnos y cantos': ['Himno', 'Canto de entrada', 'Canto de comunión'],
  'Navidad': ['Villancico'],
} as const;

export type FamiliaTipo = keyof typeof FAMILIAS_TIPO;
export type TipoObra = (typeof FAMILIAS_TIPO)[FamiliaTipo][number];

export const EPOCAS = ['Gregoriano', 'Renacimiento', 'Barroco', 'Clasicismo', 'Romanticismo', 'Siglo XX', 'Siglo XXI'] as const;
export type Epoca = (typeof EPOCAS)[number];

export const FORMACIONES = ['A capella', 'Coro y órgano', 'Coro y orquesta'] as const;
export type Formacion = (typeof FORMACIONES)[number];

export const IDIOMAS = ['Latín', 'Castellano', 'Griego', 'Otros'] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const familiaDe = (tipo: TipoObra) =>
  (Object.keys(FAMILIAS_TIPO) as FamiliaTipo[]).find((f) => (FAMILIAS_TIPO[f] as readonly string[]).includes(tipo))!;

// ============= AGRUPACIONES =============

export type Criterio = 'tipo' | 'autor' | 'epoca' | 'formacion' | 'idioma' | 'alfabetico';

export interface Grupo {
  clave: string;
  titulo: string;
  obras: Obra[];
}

const porTitulo = (a: Obra, b: Obra) => a.titulo.localeCompare(b.titulo, 'es');

// "Anónimo · arr. …" o "Anónimo (Cancionero…)" se agrupan todos como "Anónimo".
export const autorDe = (o: Obra) => (o.compositor.startsWith('Anónimo') ? 'Anónimo' : o.compositor);

// Agrupa respetando el orden natural de cada criterio (familias en su orden,
// épocas cronológicas, autores y letras alfabéticos) y ordena cada grupo por título.
export function agrupar(obras: Obra[], criterio: Criterio): Grupo[] {
  const claveDe: Record<Criterio, (o: Obra) => string> = {
    tipo: (o) => familiaDe(o.tipo),
    autor: autorDe,
    epoca: (o) => o.epoca,
    formacion: (o) => o.formacion,
    idioma: (o) => o.idioma,
    alfabetico: (o) => o.titulo.normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0).toUpperCase(),
  };
  const ordenFijo: Partial<Record<Criterio, readonly string[]>> = {
    tipo: Object.keys(FAMILIAS_TIPO),
    epoca: EPOCAS,
    formacion: FORMACIONES,
    idioma: IDIOMAS,
  };

  const mapa = new Map<string, Obra[]>();
  for (const o of obras) {
    const k = claveDe[criterio](o);
    mapa.set(k, [...(mapa.get(k) ?? []), o]);
  }

  const claves = [...mapa.keys()];
  const orden = ordenFijo[criterio];
  claves.sort((a, b) =>
    orden
      ? orden.indexOf(a) - orden.indexOf(b)
      // "Anónimo" al final entre los autores
      : (a === 'Anónimo' ? 1 : 0) - (b === 'Anónimo' ? 1 : 0) || a.localeCompare(b, 'es')
  );

  return claves.map((k) => ({ clave: k, titulo: k, obras: mapa.get(k)!.sort(porTitulo) }));
}
