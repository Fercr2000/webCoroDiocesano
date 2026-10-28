// Galería de fotos: álbumes ("carpetas") con sus fotos, cada uno de una
// categoría y, si corresponde, enlazado a una celebración del calendario.

export const CATEGORIAS = ['Celebraciones', 'Conciertos', 'Ensayos', 'Convivencias'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export type Proporcion = 'vertical' | 'horizontal' | 'cuadrada';
export const RELACION: Record<Proporcion, number> = { vertical: 3 / 4, horizontal: 3 / 2, cuadrada: 1 };

export interface Foto {
  id: string;
  src: string;
  pie: string;
  proporcion: Proporcion;
  // Encuadre opcional ('x% y%') y zoom: permiten mostrar un detalle de la imagen.
  encuadre?: string;
  zoom?: number;
}

export interface Album {
  slug: string;
  titulo: string;
  fecha: string;          // 'AAAA-MM-DD'
  lugar: string;
  categoria: Categoria;
  eventoId?: string;      // celebración del calendario a la que pertenece (de momento no se muestra)
  descripcion: string;    // texto que se ve al abrir el álbum
  fotos: Foto[];          // la primera es la portada
}
