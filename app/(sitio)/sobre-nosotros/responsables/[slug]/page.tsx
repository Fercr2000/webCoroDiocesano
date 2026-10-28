import { notFound } from "next/navigation";
import CartaResponsable from "@/app/components/responsables/CartaResponsable";
import { RESPONSABLES } from "@/lib/responsables";
import type { Metadata } from "next";

// Carta completa de cada delegado. La del Director vive en /sobre-nosotros/director.
const DELEGADOS = RESPONSABLES.filter((r) => r.slug !== "director");

export function generateStaticParams() {
  return DELEGADOS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = DELEGADOS.find((d) => d.slug === slug);
  return r ? { title: `${r.nombre} · ${r.cargo}`, description: r.resumen } : {};
}

// Solo existen las cartas generadas: cualquier otra ruta da 404.
export const dynamicParams = false;

export default async function CartaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const responsable = DELEGADOS.find((r) => r.slug === slug);
  if (!responsable) notFound();
  return <CartaResponsable responsable={responsable} />;
}
