import type { Metadata } from 'next';
import PaginaSala from '@/app/components/sala/PaginaSala';
import CabeceraSala from '@/app/components/sala/CabeceraSala';
import Metronomo from '@/app/components/sala/Metronomo';

export const metadata: Metadata = {
  title: 'Metrónomo',
  description: 'Metrónomo preciso con compases, subdivisiones y acentos.',
};

export default function MetronomoPage() {
  return (
    <PaginaSala>
      <CabeceraSala titulo="Metrónomo" subtitulo="El pulso que sostiene la música" />
      <Metronomo />
    </PaginaSala>
  );
}
