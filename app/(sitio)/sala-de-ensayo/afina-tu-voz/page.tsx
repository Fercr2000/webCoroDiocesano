import type { Metadata } from 'next';
import PaginaSala from '@/app/components/sala/PaginaSala';
import CabeceraSala from '@/app/components/sala/CabeceraSala';
import AfinaTuVoz from '@/app/components/sala/AfinaTuVoz';

export const metadata: Metadata = {
  title: 'Afina tu voz',
  description: 'Entrena tu afinación: escucha una nota y cántala con la ayuda de una aguja.',
};

export default function AfinaTuVozPage() {
  return (
    <PaginaSala>
      <CabeceraSala titulo="Afina tu voz" subtitulo="Escucha, canta y ajusta tu voz" />
      <AfinaTuVoz />
    </PaginaSala>
  );
}
