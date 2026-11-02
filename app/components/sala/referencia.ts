'use client';

// La de referencia de la Sala de ensayo (442 Hz por defecto), compartida por
// todas las herramientas y recordada en este navegador.

import { useSyncExternalStore } from 'react';
import { LA_POR_DEFECTO, LA_MIN, LA_MAX } from '@/lib/sala/notas';

const CLAVE = 'sala-de-ensayo:la';
let la = LA_POR_DEFECTO;
let leido = false;
const oyentes = new Set<() => void>();

function leer() {
  if (!leido) {
    leido = true;
    try {
      const guardado = Number(localStorage.getItem(CLAVE));
      if (guardado >= LA_MIN && guardado <= LA_MAX) la = guardado;
    } catch {}
  }
  return la;
}

export function cambiarLa(valor: number) {
  if (!Number.isFinite(valor)) return;
  la = Math.round(Math.min(LA_MAX, Math.max(LA_MIN, valor)) * 10) / 10;
  try { localStorage.setItem(CLAVE, String(la)); } catch {}
  oyentes.forEach((o) => o());
}

const suscribir = (oyente: () => void) => {
  oyentes.add(oyente);
  return () => { oyentes.delete(oyente); };
};

export function useLa() {
  return useSyncExternalStore(suscribir, leer, () => LA_POR_DEFECTO);
}
