'use client';

// Fecha de hoy ('AAAA-MM-DD') según el reloj del visitante.
// Las páginas se prerenderizan al compilar: si "hoy" se calculara entonces,
// la web se quedaría congelada en el día del despliegue. Con
// useSyncExternalStore el servidor devuelve null y el navegador pone la
// fecha real al hidratar, sin desajustes ni efectos.

import { useSyncExternalStore } from 'react';
import { claveDe } from '@/lib/fechas';

const sinSuscripcion = () => () => {};

export function useHoy() {
  return useSyncExternalStore(sinSuscripcion, () => claveDe(new Date()), () => null);
}
