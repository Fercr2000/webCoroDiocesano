import PaginaLegal, { type SeccionLegal } from "@/app/components/legal/PaginaLegal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información sobre el titular de la web del Coro y Orquesta de la Diócesis de Jaén.",
};

// Ley 34/2002 (LSSI-CE), art. 10. BORRADOR pendiente de revisión por la Diócesis.
const SECCIONES: SeccionLegal[] = [
  {
    titulo: "Titular de la web",
    parrafos: [
      "Esta web pertenece al Coro y Orquesta de la Diócesis de Jaén, una iniciativa de la Diócesis de Jaén [denominación jurídica exacta de la entidad titular].",
      "NIF: [NIF de la entidad]. Domicilio: [domicilio social]. Sede del coro: Casa de la Iglesia · Seminario Diocesano, Jaén. Correo electrónico: corodiocesano@diocesisdejaen.es.",
      "Inscripción: [número de inscripción en el Registro de Entidades Religiosas del Ministerio de la Presidencia, Justicia y Relaciones con las Cortes].",
    ],
  },
  {
    titulo: "Objeto de la web",
    parrafos: [
      "La web da a conocer el coro y su servicio a la liturgia de la Diócesis: quiénes somos, nuestro calendario de celebraciones, el repertorio y la galería. También permite solicitar la incorporación al coro o contar con él en una celebración, y ofrece a sus miembros un área privada con el material de estudio.",
    ],
  },
  {
    titulo: "Condiciones de uso",
    parrafos: [
      "Quien navega por la web se compromete a hacer un uso adecuado de sus contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe. El acceso al área de miembros es personal: cada miembro debe custodiar su contraseña y no compartirla.",
      "El titular puede modificar en cualquier momento los contenidos y la presentación de la web.",
    ],
  },
  {
    titulo: "Propiedad intelectual e imagen",
    parrafos: [
      "Los textos, diseño, logotipos y fotografías de esta web pertenecen al titular o a sus autores, y no pueden reproducirse sin autorización, salvo para uso personal y citando la fuente.",
      "Las partituras y grabaciones del área de miembros son material de estudio para uso exclusivo de los componentes del coro y respetan los derechos de sus autores y editores. No pueden difundirse fuera del coro.",
      "Las fotografías de celebraciones, conciertos y convivencias se publican con el consentimiento de las personas que aparecen en ellas. Cualquiera puede pedir que se retire una imagen en la que aparezca escribiendo a corodiocesano@diocesisdejaen.es.",
    ],
  },
  {
    titulo: "Enlaces a otras webs",
    parrafos: [
      "La web puede enlazar a páginas de terceros (por ejemplo, la web de la Diócesis o mapas). El titular no se hace responsable de su contenido.",
    ],
  },
  {
    titulo: "Legislación aplicable",
    parrafos: [
      "Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de [Jaén], salvo que la ley disponga otra cosa.",
    ],
  },
];

export default function AvisoLegalPage() {
  return <PaginaLegal titulo="Aviso legal" subtitulo="Quiénes somos y cómo usar esta web" actualizado="[fecha de aprobación]" secciones={SECCIONES} />;
}
