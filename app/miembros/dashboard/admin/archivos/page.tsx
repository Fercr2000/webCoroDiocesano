import Proximamente from "@/app/components/Proximamente";

export default function Page() {
  return (
    <Proximamente
      eyebrow="Administración"
      titulo="Archivos"
      subtitulo="Partituras y audios de cada cuerda"
      volver={{ href: '/miembros/dashboard', texto: 'Volver a tu archivo' }}
    />
  );
}
