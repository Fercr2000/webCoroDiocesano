// ¿Está Supabase configurado? Mientras no haya claves en el entorno, la web
// funciona con los datos de prueba (lib/datosPrueba.ts) y el login de prueba.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
