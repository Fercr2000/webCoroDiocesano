'use client';

// Tamaño de pantalla como dato de React (para decidir, p. ej., cuántas
// octavas caben en el piano). En el servidor se asume escritorio.

import { useSyncExternalStore } from 'react';

const consultas = { movil: '(max-width: 639px)', tableta: '(max-width: 1023px)' };

function suscribir(oyente: () => void) {
  const listas = Object.values(consultas).map((q) => window.matchMedia(q));
  listas.forEach((l) => l.addEventListener('change', oyente));
  return () => listas.forEach((l) => l.removeEventListener('change', oyente));
}

const leer = (): 'movil' | 'tableta' | 'escritorio' =>
  window.matchMedia(consultas.movil).matches ? 'movil' : window.matchMedia(consultas.tableta).matches ? 'tableta' : 'escritorio';

export function usePantalla() {
  return useSyncExternalStore(suscribir, leer, () => 'escritorio' as const);
}
