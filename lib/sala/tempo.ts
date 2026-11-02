// Términos de tempo italianos según las pulsaciones por minuto. Los límites
// varían según la fuente; estos son los que marcan los metrónomos habituales.

export const TEMPOS = [
  { nombre: 'Grave', desde: 20 },
  { nombre: 'Largo', desde: 40 },
  { nombre: 'Larghetto', desde: 60 },
  { nombre: 'Adagio', desde: 66 },
  { nombre: 'Andante', desde: 76 },
  { nombre: 'Moderato', desde: 108 },
  { nombre: 'Allegro', desde: 120 },
  { nombre: 'Vivace', desde: 156 },
  { nombre: 'Presto', desde: 176 },
  { nombre: 'Prestissimo', desde: 200 },
];

export const BPM_MIN = 20;
export const BPM_MAX = 300;

export function terminoTempo(bpm: number) {
  let actual = TEMPOS[0];
  for (const t of TEMPOS) if (bpm >= t.desde) actual = t;
  return actual.nombre;
}

export interface Compas {
  etiqueta: string;
  pulsos: number;
  compuesto: boolean; // x/8: el pulso es la negra con puntillo y se divide en 3
}

export const COMPASES: Compas[] = [
  { etiqueta: '1', pulsos: 1, compuesto: false },
  { etiqueta: '2/4', pulsos: 2, compuesto: false },
  { etiqueta: '3/4', pulsos: 3, compuesto: false },
  { etiqueta: '4/4', pulsos: 4, compuesto: false },
  { etiqueta: '5/4', pulsos: 5, compuesto: false },
  { etiqueta: '6/4', pulsos: 6, compuesto: false },
  { etiqueta: '6/8', pulsos: 2, compuesto: true },
  { etiqueta: '9/8', pulsos: 3, compuesto: true },
  { etiqueta: '12/8', pulsos: 4, compuesto: true },
];

// Subdivisiones posibles de cada pulso según el tipo de compás.
export const SUBDIVISIONES = {
  simple: [
    { valor: 1, nombre: 'Negras' },
    { valor: 2, nombre: 'Corcheas' },
    { valor: 3, nombre: 'Tresillos' },
    { valor: 4, nombre: 'Semicorcheas' },
  ],
  compuesto: [
    { valor: 1, nombre: 'Pulso' },
    { valor: 3, nombre: 'Corcheas' },
    { valor: 6, nombre: 'Semicorcheas' },
  ],
};
