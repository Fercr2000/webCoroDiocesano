// Cliente de Supabase para el navegador (componentes 'use client').
// Usa la clave pública (anon): lo que puede hacer lo limitan las reglas RLS.

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export function crearClienteNavegador() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
