// Cliente con la clave de SERVICIO (service_role): salta las reglas RLS.
// Solo para tareas del servidor que lo exigen, como crear cuentas desde el
// panel (auth.admin.createUser). Nunca se importa desde el navegador:
// 'server-only' rompe la compilación si alguien lo intenta.

import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './config';

export function crearClienteAdmin() {
  const claveServicio = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!claveServicio) throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor.');
  return createClient(SUPABASE_URL, claveServicio, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
