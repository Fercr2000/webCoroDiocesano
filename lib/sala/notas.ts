// Notas, frecuencias y la "La de referencia" de la Sala de ensayo.
// Afinación temperada igual: f = La · 2^((midi − 69) / 12), con La4 = midi 69.
// Octavas en notación científica (Do4 = Do central), la de los afinadores.

export const NOMBRES_SOSTENIDOS = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
export const NOMBRES_BEMOLES = ['Do', 'Re♭', 'Re', 'Mi♭', 'Mi', 'Fa', 'Sol♭', 'Sol', 'La♭', 'La', 'Si♭', 'Si'];

// Diapasones habituales. 442 Hz es el de muchas orquestas europeas y el de la casa.
export const REFERENCIAS_LA = [
  { hz: 415, nombre: 'Barroco' },
  { hz: 430, nombre: 'Clásico' },
  { hz: 435, nombre: 'Diapasón francés' },
  { hz: 440, nombre: 'Estándar ISO' },
  { hz: 441, nombre: '' },
  { hz: 442, nombre: 'Orquesta' },
  { hz: 443, nombre: '' },
  { hz: 444, nombre: '' },
];

export const LA_POR_DEFECTO = 442;
export const LA_MIN = 400;
export const LA_MAX = 480;

export function frecuencia(midi: number, la: number) {
  return la * 2 ** ((midi - 69) / 12);
}

// Nota más cercana a una frecuencia y desviación en cents (−50 … +50).
export function analizarFrecuencia(hz: number, la: number) {
  const exacta = 69 + 12 * Math.log2(hz / la);
  const midi = Math.round(exacta);
  return { midi, cents: (exacta - midi) * 100 };
}

// Distancia en cents entre dos frecuencias (positiva si la primera está más alta).
export function centsEntre(hz: number, referencia: number) {
  return 1200 * Math.log2(hz / referencia);
}

export const esNegra = (midi: number) => [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);

export function nombreNota(midi: number, bemoles = false) {
  const clase = ((midi % 12) + 12) % 12;
  return {
    nombre: (bemoles ? NOMBRES_BEMOLES : NOMBRES_SOSTENIDOS)[clase],
    alternativo: NOMBRES_SOSTENIDOS[clase] !== NOMBRES_BEMOLES[clase] ? (bemoles ? NOMBRES_SOSTENIDOS : NOMBRES_BEMOLES)[clase] : '',
    octava: Math.floor(midi / 12) - 1,
  };
}

export const notaConOctava = (midi: number, bemoles = false) => {
  const n = nombreNota(midi, bemoles);
  return `${n.nombre}${n.octava}`;
};
