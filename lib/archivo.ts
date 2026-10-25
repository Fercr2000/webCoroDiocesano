// Tipos del archivo musical (partituras, audios y repertorios), tal y como
// se guardarán en Supabase. Una obra puede estar en varios repertorios (N:N).

export interface Repertorio {
  id: string;
  nombre: string;
}

export interface Partitura {
  id: string;
  titulo: string;
  compositor: string;
  repertorios: string[];
  enlaceDescarga: string;
}

export interface Audio {
  id: string;
  titulo: string;
  compositor: string;
  repertorios: string[];
  enlaceAudio: string;
}

// Filtro virtual: no existe en la base de datos, va siempre el primero y
// muestra todas las obras. Por eso nadie puede crear un repertorio con este nombre.
export const REPERTORIO_TODOS = 'Todos';
