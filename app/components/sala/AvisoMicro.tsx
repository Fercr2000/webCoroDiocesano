// Mensajes del micrófono (permiso, denegado, sin micrófono…) compartidos por
// el afinador y "Afina tu voz".

import { MicOff } from 'lucide-react';
import type { EstadoMicro } from './useDetectorTono';

const TEXTOS: Partial<Record<EstadoMicro, { titulo: string; texto: string }>> = {
  pidiendo: { titulo: 'Permite el micrófono', texto: 'Tu navegador te preguntará si esta página puede usar el micrófono.' },
  denegado: { titulo: 'El micrófono está bloqueado', texto: 'Actívalo desde el candado de la barra de direcciones (permisos del sitio) y vuelve a intentarlo.' },
  'sin-micro': { titulo: 'No encontramos un micrófono', texto: 'Conecta uno o prueba desde el móvil. Algunos navegadores antiguos no permiten usarlo.' },
  error: { titulo: 'No hemos podido abrir el micrófono', texto: 'Puede que otra aplicación lo esté usando. Ciérrala y vuelve a intentarlo.' },
};

export default function AvisoMicro({ estado }: { estado: EstadoMicro }) {
  const aviso = TEXTOS[estado];
  if (!aviso) return null;
  return (
    <div role="status" className="flex gap-3 text-left bg-red-50/60 border border-red-800/15 rounded-sm p-4 animate-[fadeIn_0.3s_ease-out]">
      <MicOff size={18} strokeWidth={1.5} className="text-red-800 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-red-900">{aviso.titulo}</p>
        <p className="text-sm text-stone-600 leading-relaxed">{aviso.texto}</p>
      </div>
    </div>
  );
}

export const NOTA_PRIVACIDAD = 'El sonido se analiza en tu dispositivo: no se graba ni se envía a ningún sitio.';
