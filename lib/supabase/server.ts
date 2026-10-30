// Cliente de Supabase para el servidor (Server Components, Server Actions y
// Route Handlers). Lee y escribe la sesión en las cookies de la petición.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export async function crearClienteServidor() {
  const almacen = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Desde un Server Component no se pueden escribir cookies: no pasa
          // nada, el proxy refresca la sesión en cada petición.
        }
      },
    },
  });
}
