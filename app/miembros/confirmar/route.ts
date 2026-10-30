// Destino de los enlaces que envía Supabase por email (recuperar contraseña).
// Canjea el código del enlace por una sesión y lleva a la página indicada.

import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const codigo = searchParams.get('code');
  const siguiente = searchParams.get('siguiente') ?? '/miembros/dashboard';

  // Solo rutas internas: evita usar este enlace para redirigir a otra web.
  const destino = siguiente.startsWith('/') && !siguiente.startsWith('//') ? siguiente : '/miembros/dashboard';

  if (supabaseConfigurado && codigo) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    if (!error) return NextResponse.redirect(`${origin}${destino}`);
  }

  // Enlace caducado, ya usado o sin código: se vuelve a pedir.
  return NextResponse.redirect(`${origin}/miembros/recuperar?caducado=1`);
}
