import PaginaLegal, { type SeccionLegal } from "@/app/components/legal/PaginaLegal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué cookies usa la web del Coro y Orquesta de la Diócesis de Jaén.",
};

// LSSI-CE art. 22.2. Solo cookies técnicas: no requieren banner de consentimiento.
// Si algún día se añade analítica o vídeos de terceros, habrá que revisarlo.
const SECCIONES: SeccionLegal[] = [
  {
    titulo: "Qué son las cookies",
    parrafos: [
      "Son pequeños archivos que una web guarda en tu navegador para recordar información entre una visita y otra.",
    ],
  },
  {
    titulo: "Qué cookies usamos",
    parrafos: [
      "Solo usamos cookies técnicas, imprescindibles para que la web funcione: las que mantienen abierta tu sesión en el área de miembros (de Supabase, nuestro proveedor de acceso) mientras navegas.",
      "No usamos cookies de análisis, de publicidad ni de redes sociales, y no seguimos tu navegación con fines comerciales.",
    ],
  },
  {
    titulo: "Por qué no te pedimos consentimiento",
    parrafos: [
      "La ley exime de pedir consentimiento para las cookies técnicas estrictamente necesarias para prestar el servicio que solicitas, como iniciar sesión. Por eso no verás un aviso de cookies al entrar.",
    ],
  },
  {
    titulo: "Cómo borrarlas",
    parrafos: [
      "Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Si bloqueas las técnicas, no podrás iniciar sesión en el área de miembros.",
    ],
  },
];

export default function CookiesPage() {
  return <PaginaLegal titulo="Política de cookies" subtitulo="Solo las imprescindibles" actualizado="[fecha de aprobación]" secciones={SECCIONES} />;
}
