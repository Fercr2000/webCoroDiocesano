import Proximamente from "@/app/components/Proximamente";

// Pendiente: se construirá al conectar Supabase (contenido editable).
export default function Page() {
  return (
    <Proximamente
      eyebrow="Administración"
      titulo="Contacto"
      subtitulo="Teléfonos, email y datos de la web"
      volver={{ href: '/miembros/dashboard', texto: 'Volver a tu archivo' }}
    />
  );
}
