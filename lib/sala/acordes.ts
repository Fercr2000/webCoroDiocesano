// Nombre del intervalo o acorde que suena en el piano (en castellano).

import { NOMBRES_SOSTENIDOS, NOMBRES_BEMOLES } from './notas';

const INTERVALOS = [
  'Unísono', 'Segunda menor', 'Segunda mayor', 'Tercera menor', 'Tercera mayor', 'Cuarta justa',
  'Tritono', 'Quinta justa', 'Sexta menor', 'Sexta mayor', 'Séptima menor', 'Séptima mayor',
];

// Patrones desde la fundamental (clases de altura relativas).
const ACORDES: { patron: number[]; nombre: string }[] = [
  { patron: [0, 4, 7], nombre: 'mayor' },
  { patron: [0, 3, 7], nombre: 'menor' },
  { patron: [0, 3, 6], nombre: 'disminuido' },
  { patron: [0, 4, 8], nombre: 'aumentado' },
  { patron: [0, 5, 7], nombre: 'sus4' },
  { patron: [0, 2, 7], nombre: 'sus2' },
  { patron: [0, 4, 7, 10], nombre: 'con séptima' },
  { patron: [0, 4, 7, 11], nombre: 'con séptima mayor' },
  { patron: [0, 3, 7, 10], nombre: 'menor con séptima' },
  { patron: [0, 3, 6, 10], nombre: 'semidisminuido' },
  { patron: [0, 3, 6, 9], nombre: 'disminuido con séptima' },
  { patron: [0, 3, 7, 11], nombre: 'menor con séptima mayor' },
  { patron: [0, 4, 7, 9], nombre: 'con sexta' },
  { patron: [0, 3, 7, 9], nombre: 'menor con sexta' },
];

// Fundamentales que se escriben mejor con bemol (Si♭ mayor, no La♯ mayor).
const CON_BEMOL = new Set([3, 8, 10]);
const nombreClase = (c: number) => (CON_BEMOL.has(c) ? NOMBRES_BEMOLES : NOMBRES_SOSTENIDOS)[c];

export function describirNotas(midis: number[]): string {
  const ordenadas = [...new Set(midis)].sort((a, b) => a - b);
  if (ordenadas.length < 2) return '';

  if (ordenadas.length === 2) {
    const distancia = ordenadas[1] - ordenadas[0];
    if (distancia === 12) return 'Octava justa';
    if (distancia > 12) return `${INTERVALOS[distancia % 12]} compuesta`;
    return INTERVALOS[distancia];
  }

  const clases = [...new Set(ordenadas.map((m) => m % 12))];
  const bajo = ordenadas[0] % 12;
  for (const fundamental of clases) {
    const relativas = clases.map((c) => (c - fundamental + 12) % 12).sort((a, b) => a - b);
    const acorde = ACORDES.find((a) => a.patron.length === relativas.length && a.patron.every((p, i) => p === relativas[i]));
    if (acorde) {
      const nombre = `${nombreClase(fundamental)} ${acorde.nombre}`;
      return fundamental === bajo ? nombre : `${nombre} / ${nombreClase(bajo)}`;
    }
  }
  return '';
}
