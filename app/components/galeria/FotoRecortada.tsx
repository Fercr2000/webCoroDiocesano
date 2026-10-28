// Foto de la galería con su proporción y, si la tiene, su encuadre y zoom
// (para mostrar un detalle de la imagen). La usan las carpetas, el mosaico
// y el visor. El zoom va en una capa propia para poder sumar efectos hover.

import Image from 'next/image';
import { RELACION, type Foto, type Proporcion } from '@/lib/galeria';

interface FotoRecortadaProps {
  foto: Foto;
  sizes: string;
  proporcion?: Proporcion;   // fuerza una proporción distinta a la de la foto
  className?: string;
  claseImagen?: string;      // efectos sobre la imagen (p. ej. zoom al pasar el ratón)
  prioridad?: boolean;
}

// Con zoom solo se ve una parte de la imagen: se pide proporcionalmente más
// grande para que el detalle no salga borroso ("33vw" con zoom 2 → "66vw").
const ampliarSizes = (sizes: string, zoom: number) =>
  zoom === 1 ? sizes : sizes.replace(/(\d+(?:\.\d+)?)(vw|px)/g, (_, n, u) => `${Math.round(Math.min(u === 'vw' ? 100 : Infinity, Number(n) * zoom))}${u}`);

export default function FotoRecortada({ foto, sizes, proporcion, className = '', claseImagen = '', prioridad = false }: FotoRecortadaProps) {
  const encuadre = foto.encuadre ?? '50% 50%';
  const zoom = foto.zoom ?? 1;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: RELACION[proporcion ?? foto.proporcion] }}>
      <div className={`absolute inset-0 ${claseImagen}`}>
        <Image
          src={foto.src}
          alt={foto.pie}
          fill
          sizes={ampliarSizes(sizes, zoom)}
          priority={prioridad}
          className="object-cover"
          style={{ objectPosition: encuadre, transform: `scale(${zoom})`, transformOrigin: encuadre }}
        />
      </div>
    </div>
  );
}
