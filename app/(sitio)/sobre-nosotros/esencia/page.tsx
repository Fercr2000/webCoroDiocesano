import { permanentRedirect } from "next/navigation";

// "Esencia" se unió a "Sobre nosotros"; la ruta se conserva para enlaces antiguos.
export default function EsenciaRedireccion() {
  permanentRedirect("/sobre-nosotros");
}
