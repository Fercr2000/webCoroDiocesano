// Envoltorio de las páginas de la Sala de ensayo: superficie de la casa,
// notas flotando en los márgenes y ancho amplio para las herramientas.

import FondoNotas from '../FondoNotas';

export default function PaginaSala({ children }: { children: React.ReactNode }) {
  return (
    <main className="superficie-crema w-full pt-12 md:pt-16 pb-8">
      <FondoNotas soloLaterales />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">{children}</div>
    </main>
  );
}
