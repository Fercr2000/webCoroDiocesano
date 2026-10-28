import CartaResponsable from "@/app/components/responsables/CartaResponsable";
import { RESPONSABLES } from "@/lib/responsables";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "El director",
  description: "Carta de Fernando J. Camacho Rizquez, director del coro.",
};

// Carta completa del Director (enlazada desde el menú y desde Responsables).
export default function DirectorPage() {
  return <CartaResponsable responsable={RESPONSABLES.find((r) => r.slug === "director")!} />;
}
