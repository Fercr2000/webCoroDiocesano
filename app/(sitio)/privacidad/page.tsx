import PaginaLegal, { type SeccionLegal } from "@/app/components/legal/PaginaLegal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo trata el Coro y Orquesta de la Diócesis de Jaén los datos personales.",
};

// Reglamento (UE) 2016/679 (RGPD) y Ley Orgánica 3/2018 (LOPDGDD).
// BORRADOR pendiente de revisión por la Diócesis y su delegado de protección de datos.
const SECCIONES: SeccionLegal[] = [
  {
    titulo: "Responsable del tratamiento",
    parrafos: [
      "[Denominación jurídica de la entidad titular], con NIF [NIF] y domicilio en [domicilio social]. Contacto: corodiocesano@diocesisdejaen.es.",
      "Delegado de protección de datos: [datos de contacto del DPD de la Diócesis, si lo hay].",
    ],
  },
  {
    titulo: "Qué datos tratamos y para qué",
    parrafos: [
      "Formulario «Quiero unirme»: nombre, apellidos, email, teléfono, procedencia, cuerda o instrumento, experiencia musical y el mensaje que nos escribas. Los usamos para estudiar tu incorporación al coro y ponernos en contacto contigo.",
      "Formulario «Contar con vosotros»: nombre, email, teléfono, entidad, fecha y lugar de la celebración y tu mensaje. Los usamos para responder a tu solicitud.",
      "Área de miembros: nombre, email, cuerda o instrumento y, si los tienes, tus roles de gestión de la web. Los usamos para darte acceso a tu material de estudio y a la agenda interna.",
      "Componentes y galería: el nombre de los componentes y las fotografías de celebraciones, conciertos y convivencias, para dar a conocer el coro.",
    ],
  },
  {
    titulo: "Base jurídica",
    parrafos: [
      "Tu consentimiento, que nos das al enviar un formulario o al aceptar aparecer en la web, y que puedes retirar cuando quieras.",
      "En el caso de los miembros, además, la relación que mantienes con el coro como componente.",
    ],
  },
  {
    titulo: "Menores de edad",
    parrafos: [
      "Los menores de 14 años solo pueden facilitarnos sus datos o aparecer en la web con el consentimiento de sus padres o tutores. [Procedimiento para recabar ese consentimiento].",
    ],
  },
  {
    titulo: "Cuánto tiempo los conservamos",
    parrafos: [
      "Las solicitudes de los formularios, el tiempo necesario para atenderlas y, como máximo, [plazo, p. ej. un año]. Los datos de los miembros, mientras formen parte del coro. Las fotografías, mientras sigan publicadas o hasta que pidas retirarlas.",
    ],
  },
  {
    titulo: "Quién más accede a los datos",
    parrafos: [
      "No cedemos tus datos a terceros salvo obligación legal. Para que la web funcione usamos proveedores que actúan como encargados del tratamiento: Vercel (alojamiento de la web), Supabase (base de datos y archivos) y Resend (envío de los formularios por email).",
      "Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en ese caso lo hacen con las garantías previstas en el RGPD, como las cláusulas contractuales tipo de la Comisión Europea. [Revisar la región contratada de cada proveedor].",
    ],
  },
  {
    titulo: "Tus derechos",
    parrafos: [
      "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, y retirar tu consentimiento, escribiendo a corodiocesano@diocesisdejaen.es.",
      "Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
    ],
  },
];

export default function PrivacidadPage() {
  return <PaginaLegal titulo="Política de privacidad" subtitulo="Cómo cuidamos tus datos" actualizado="[fecha de aprobación]" secciones={SECCIONES} />;
}
