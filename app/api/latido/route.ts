// Latido periódico para que Supabase (plan gratuito) no pause el proyecto por
// inactividad: lo llama el cron de Vercel (vercel.json) cada 5 días y hace
// una consulta mínima. Protegido con CRON_SECRET, que Vercel envía solo.

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseConfigurado } from '@/lib/supabase/config';

export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (secreto && request.headers.get('authorization') !== `Bearer ${secreto}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  if (!supabaseConfigurado) {
    return Response.json({ ok: true, supabase: 'sin configurar' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error } = await supabase.from('obras').select('id').limit(1);
  return Response.json({ ok: !error, supabase: error ? error.message : 'activo' }, { status: error ? 500 : 200 });
}
