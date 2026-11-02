import type { Metadata } from 'next';
import PaginaSala from '@/app/components/sala/PaginaSala';
import CabeceraSala from '@/app/components/sala/CabeceraSala';
import Afinador from '@/app/components/sala/Afinador';

export const metadata: Metadata = {
  title: 'Afinador',
  description: 'Afinador cromático con micrófono, con cuerdas al aire y transposición.',
};

export default function AfinadorPage() {
  return (
    <PaginaSala>
      <CabeceraSala titulo="Afinador" subtitulo="Escucha, mide y ajusta" />
      <Afinador />
    </PaginaSala>
  );
}
