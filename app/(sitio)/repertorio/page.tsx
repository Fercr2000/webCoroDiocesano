import { permanentRedirect } from "next/navigation";

// El repertorio vive en /sobre-nosotros/repertorio; esta ruta se conserva
// para que los enlaces antiguos sigan funcionando.
export default function RepertorioRedireccion() {
  permanentRedirect("/sobre-nosotros/repertorio");
}
