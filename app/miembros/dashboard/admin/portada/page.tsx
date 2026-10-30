import Proximamente from "@/app/components/Proximamente";

// Pendiente: se construirá al conectar Supabase (contenido editable).
export default function Page() {
  return (
    <Proximamente
      eyebrow="Administración"
      titulo="Portada e inicio"
      subtitulo="Hero, textos del inicio y palabras del Obispo"
      volver={{ href: '/miembros/dashboard', texto: 'Volver a tu archivo' }}
    />
  );
}
