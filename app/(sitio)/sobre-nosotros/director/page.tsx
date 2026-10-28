import CartaResponsable from "@/app/components/responsables/CartaResponsable";
import { RESPONSABLES } from "@/lib/responsables";

// Carta completa del Director (enlazada desde el menú y desde Responsables).
export default function DirectorPage() {
  return <CartaResponsable responsable={RESPONSABLES.find((r) => r.slug === "director")!} />;
}
