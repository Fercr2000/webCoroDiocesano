import type { Metadata } from 'next';
import Recuperar from './Recuperar';

export const metadata: Metadata = { title: 'Recuperar contraseña' };

// Si se llega desde un enlace caducado (?caducado=1) se avisa en el formulario.
export default async function RecuperarPage({ searchParams }: { searchParams: Promise<{ caducado?: string }> }) {
  const { caducado } = await searchParams;
  return <Recuperar caducado={caducado === '1'} />;
}
