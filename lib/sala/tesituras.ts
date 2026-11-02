// Cuerdas y niveles de "Afina tu voz". Rangos en MIDI (Do4 = 60), sonido real.
// Fuentes: rangos corales SATB habituales (Do4–La5, Sol3–Re5, Do3–La4, Mi2–Mi4)
// y su tesitura cómoda; en coros aficionados conviene quedarse por dentro.
//   · extensión: lo que la parte de coro puede llegar a pedir (nivel alto)
//   · tesitura:  donde la cuerda canta con comodidad (nivel medio)
//   · centro:    la zona más cómoda, para empezar (nivel fácil)

export type Voz = 'soprano' | 'contralto' | 'tenor' | 'bajo';
export type Nivel = 'facil' | 'medio' | 'alto';

export const VOCES: Record<Voz, { nombre: string; inicial: string; extension: [number, number]; tesitura: [number, number]; centro: [number, number] }> = {
  soprano:   { nombre: 'Soprano',   inicial: 'S', extension: [60, 81], tesitura: [64, 79], centro: [65, 74] }, // Do4–La5 · Mi4–Sol5 · Fa4–Re5
  contralto: { nombre: 'Contralto', inicial: 'C', extension: [53, 74], tesitura: [57, 72], centro: [59, 69] }, // Fa3–Re5 · La3–Do5 · Si3–La4
  tenor:     { nombre: 'Tenor',     inicial: 'T', extension: [48, 69], tesitura: [52, 67], centro: [53, 62] }, // Do3–La4 · Mi3–Sol4 · Fa3–Re4
  bajo:      { nombre: 'Bajo',      inicial: 'B', extension: [41, 62], tesitura: [43, 60], centro: [45, 57] }, // Fa2–Re4 · Sol2–Do4 · La2–La3
};

export interface ConfigNivel {
  nombre: string;
  descripcion: string;
  rango: 'centro' | 'tesitura' | 'extension';
  diatonico: boolean;     // notas de una escala mayor o todas las cromáticas
  saltoMax: number;       // semitonos máximos desde la nota anterior
  duracion: number;       // segundos que suena la nota modelo
  tolerancia: number;     // ± cents para darla por afinada
  sostener: number;       // segundos seguidos dentro de la tolerancia
  tiempoMax: number;      // segundos para intentarlo antes de pasar
  mostrarNombre: boolean; // valor por defecto del interruptor
}

// Tolerancias: un oyente empieza a notar la desafinación hacia los 20–30 cents
// y un cantante formado suele moverse en ±20–30; ±10 es nivel de afinador.
export const NIVELES: Record<Nivel, ConfigNivel> = {
  facil: {
    nombre: 'Fácil', descripcion: 'Zona central de tu voz, saltos cortos y nota larga.',
    rango: 'centro', diatonico: true, saltoMax: 4, duracion: 2, tolerancia: 30, sostener: 0.8, tiempoMax: 10, mostrarNombre: true,
  },
  medio: {
    nombre: 'Medio', descripcion: 'Toda tu tesitura cómoda, saltos de hasta una quinta.',
    rango: 'tesitura', diatonico: true, saltoMax: 7, duracion: 1.5, tolerancia: 20, sostener: 1, tiempoMax: 9, mostrarNombre: true,
  },
  alto: {
    nombre: 'Alto', descripcion: 'La extensión de tu cuerda, notas cromáticas y saltos de octava.',
    rango: 'extension', diatonico: false, saltoMax: 12, duracion: 1, tolerancia: 10, sostener: 1.2, tiempoMax: 8, mostrarNombre: false,
  },
};

export const NOTAS_POR_RONDA = 10;

export function rangoDe(voz: Voz, nivel: Nivel): [number, number] {
  return VOCES[voz][NIVELES[nivel].rango];
}

const ESCALA_MAYOR = [0, 2, 4, 5, 7, 9, 11];

// Tonalidades mayores que se escriben con bemoles (Fa, Si♭, Mi♭, La♭, Re♭).
const TONICAS_CON_BEMOL = [5, 10, 3, 8, 1];

// Secuencia de notas para una ronda: dentro del rango, con saltos limitados,
// sin repetir la nota anterior y, en los niveles diatónicos, en una tonalidad al azar.
// `bemoles` indica cómo escribir las alteraciones de esa tonalidad.
export function generarRonda(voz: Voz, nivel: Nivel, cantidad = NOTAS_POR_RONDA, azar: () => number = Math.random): { notas: number[]; bemoles: boolean } {
  const config = NIVELES[nivel];
  const [min, max] = rangoDe(voz, nivel);
  const tonica = Math.floor(azar() * 12);
  const validas: number[] = [];
  for (let m = min; m <= max; m++) {
    if (!config.diatonico || ESCALA_MAYOR.includes((((m - tonica) % 12) + 12) % 12)) validas.push(m);
  }

  const notas: number[] = [];
  // Primera nota cerca del centro del rango, que es lo más fácil de dar.
  const centro = (min + max) / 2;
  const iniciales = validas.filter((m) => Math.abs(m - centro) <= 3);
  notas.push(iniciales[Math.floor(azar() * iniciales.length)] ?? validas[Math.floor(validas.length / 2)]);

  while (notas.length < cantidad) {
    const anterior = notas[notas.length - 1];
    const opciones = validas.filter((m) => m !== anterior && Math.abs(m - anterior) <= config.saltoMax);
    notas.push(opciones[Math.floor(azar() * opciones.length)]);
  }
  return { notas, bemoles: config.diatonico && TONICAS_CON_BEMOL.includes(tonica) };
}
