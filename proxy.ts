// Protección temporal de toda la web con usuario y contraseña (HTTP Basic Auth)
// mientras está en desarrollo. Solo se activa si existen ACCESO_USUARIO y
// ACCESO_CLAVE en las variables de entorno: sin ellas la web queda abierta,
// así que para publicarla basta con borrarlas en Vercel.
// Aquí irá también la protección de /miembros/dashboard cuando llegue Supabase.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

// Comparación en tiempo constante: evita adivinar la clave midiendo tiempos.
function iguales(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function proxy(request: NextRequest) {
  const usuario = process.env.ACCESO_USUARIO;
  const clave = process.env.ACCESO_CLAVE;

  if (!usuario || !clave) return NextResponse.next();

  // La cabecera llega como "Basic base64(usuario:clave)".
  const cabecera = request.headers.get('authorization') ?? '';
  if (cabecera.startsWith('Basic ')) {
    const [u, ...resto] = Buffer.from(cabecera.slice(6), 'base64').toString().split(':');
    if (iguales(u, usuario) && iguales(resto.join(':'), clave)) {
      const respuesta = NextResponse.next();
      // Mientras esté protegida, que los buscadores no la indexen.
      respuesta.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return respuesta;
    }
  }

  return new NextResponse('Acceso restringido', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Coro de la Diocesis de Jaen", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
