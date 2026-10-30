import type { Metadata } from 'next';
import CambiarContrasena from './CambiarContrasena';

export const metadata: Metadata = { title: 'Cambiar contraseña' };

// Se llega desde el botón "Contraseña" del área de miembros o desde el enlace
// de recuperación (?recuperacion=1), en cuyo caso no se pide la actual.
export default async function CambiarContrasenaPage({ searchParams }: { searchParams: Promise<{ recuperacion?: string }> }) {
  const { recuperacion } = await searchParams;
  return <CambiarContrasena recuperacion={recuperacion === '1'} />;
}
