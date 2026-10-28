import { notFound } from "next/navigation";
import CartaResponsable from "@/app/components/responsables/CartaResponsable";
import { RESPONSABLES } from "@/lib/responsables";

// Carta completa de cada delegado. La del Director vive en /sobre-nosotros/director.
const DELEGADOS = RESPONSABLES.filter((r) => r.slug !== "director");

export function generateStaticParams() {
  return DELEGADOS.map((r) => ({ slug: r.slug }));
}

// Solo existen las cartas generadas: cualquier otra ruta da 404.
export const dynamicParams = false;

export default async function CartaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const responsable = DELEGADOS.find((r) => r.slug === slug);
  if (!responsable) notFound();
  return <CartaResponsable responsable={responsable} />;
}
