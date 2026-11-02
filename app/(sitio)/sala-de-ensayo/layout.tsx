import BarraSala from '@/app/components/sala/BarraSala';

// La barra (La de referencia + metrónomo) acompaña a todas las páginas de la
// sala y no se desmonta al pasar de una herramienta a otra.
export default function SalaDeEnsayoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <BarraSala />
    </div>
  );
}
