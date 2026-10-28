// Foto de un responsable con el marco de "Palabras del director" del inicio:
// formato cuadrado, esquinas decorativas y marco exterior fino. Sin foto,
// su inicial en serif. Dos tonos: sobre granate (tríptico) o sobre claro (carta).

import Image from 'next/image';
import type { Responsable } from '@/lib/responsables';

export default function FotoResponsable({ responsable, tono, className = '' }: { responsable: Responsable; tono: 'granate' | 'claro'; className?: string }) {
  const { nombre, cargo, foto } = responsable;
  const granate = tono === 'granate';
  const esquina = granate ? 'border-stone-50/40' : 'border-red-800/30';
  const inicial = nombre.replace(/^D\.\s*/, '').charAt(0);

  return (
    <div className={`relative aspect-square ${className}`}>

      {/* Esquinas decorativas sutiles */}
      <div className={`absolute -top-2 -left-2 w-5 h-5 border-t border-l z-20 pointer-events-none ${esquina}`} />
      <div className={`absolute -top-2 -right-2 w-5 h-5 border-t border-r z-20 pointer-events-none ${esquina}`} />
      <div className={`absolute -bottom-2 -left-2 w-5 h-5 border-b border-l z-20 pointer-events-none ${esquina}`} />
      <div className={`absolute -bottom-2 -right-2 w-5 h-5 border-b border-r z-20 pointer-events-none ${esquina}`} />

      {/* Marco exterior fino */}
      <div className={`absolute -inset-4 border pointer-events-none ${granate ? 'border-stone-50/15' : 'border-red-800/15'}`} />

      <div className={`relative h-full w-full overflow-hidden shadow-2xl ${granate ? 'shadow-red-950/40' : 'shadow-red-950/30'}`}>
        {foto ? (
          <>
            <Image src={foto} alt={`${nombre}, ${cargo}`} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 33vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          // Marcador hasta tener la foto: la inicial en serif con el rombo de la casa
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${granate ? 'bg-gradient-to-br from-red-900/60 to-red-950/80 border border-stone-50/15' : 'bg-gradient-to-br from-stone-100 to-stone-200'}`}>
            <span className={`font-serif text-7xl md:text-8xl leading-none ${granate ? 'text-stone-50/80' : 'text-red-800/70'}`}>{inicial}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" className={`mt-4 ${granate ? 'text-stone-50/50' : 'text-red-800/50'}`} aria-hidden="true">
              <rect x="2.5" y="2.5" width="7" height="7" transform="rotate(45 6 6)" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
