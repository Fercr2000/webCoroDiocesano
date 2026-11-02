import type { Metadata } from 'next';
import PaginaSala from '@/app/components/sala/PaginaSala';
import CabeceraSala from '@/app/components/sala/CabeceraSala';
import Piano from '@/app/components/sala/Piano';

export const metadata: Metadata = {
  title: 'Piano',
  description: 'Toca, escucha y nombra los intervalos y acordes.',
};

export default function PianoPage() {
  return (
    <PaginaSala>
      <CabeceraSala titulo="Piano" subtitulo="Un teclado para estudiar tus notas" />
      <Piano />
    </PaginaSala>
  );
}
