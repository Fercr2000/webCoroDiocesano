import Proximamente from "@/app/components/Proximamente";

// Pendiente: se construirá al conectar Supabase (contenido editable).
export default function Page() {
  return (
    <Proximamente
      eyebrow="Administración"
      titulo="Textos y responsables"
      subtitulo="Sobre nosotros, responsables y cartas"
      volver={{ href: '/miembros/dashboard', texto: 'Volver a tu archivo' }}
    />
  );
}
