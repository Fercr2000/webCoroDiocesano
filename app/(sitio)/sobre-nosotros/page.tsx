import Link from "next/link";
import { Images } from "lucide-react";
import Reveal from "@/app/components/Reveal";
import FondoNotas from "@/app/components/FondoNotas";
import PentagramaOla from "@/app/components/PentagramaOla";
import PilaresGiratorios from "@/app/components/sobreNosotros/PilaresGiratorios";
import Temas from "@/app/components/sobreNosotros/Temas";
import Cifras from "@/app/components/sobreNosotros/Cifras";
import { componentesPrueba, obrasPrueba, eventosPrueba } from "@/lib/datosPrueba";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description: "Quiénes somos, nuestros valores y cómo formar parte del coro.",
};

// "Sobre nosotros" (absorbe la antigua "Esencia"): quiénes somos en bloques
// alternos con capital, pilares que se voltean, temas clicables (valores,
// cómo acceder, ministerio y familia) con acceso a la galería, cifras
// animadas y una invitación final. Textos de muestra (mockup).

const BLOQUES = [
  {
    numeral: "I",
    eyebrow: "Quiénes somos",
    titulo: "Una voz de la Iglesia de Jaén",
    texto: [
      "Somos el Coro y Orquesta de la Diócesis de Jaén: cantores e instrumentistas de toda la provincia que ponen su talento al servicio de las grandes celebraciones diocesanas. Venimos de parroquias, conservatorios y escuelas muy distintas, y nos une una misma convicción.",
      "Creemos que la música sacra no es un adorno de la liturgia, sino una forma privilegiada de oración. Por eso cantamos: para que quien escucha pueda rezar mejor.",
    ],
    panel: { tono: "granate", frase: "Servir cantando, cantar sirviendo" },
  },
  {
    numeral: "II",
    eyebrow: "Qué hacemos",
    titulo: "Al servicio de la liturgia",
    texto: [
      "Acompañamos las solemnidades de la Catedral, las celebraciones del Obispo y los grandes momentos del año litúrgico, de Adviento a Pentecostés. Cada curso preparamos además un Concierto de Navidad abierto a toda la ciudad.",
      "Nuestro repertorio recorre siglos de música: del canto gregoriano a la polifonía de Tomás Luis de Victoria, de las misas de Mozart a los autores de nuestros días.",
    ],
    panel: { tono: "claro", frase: "«Cantadle un cántico nuevo, tocad con maestría»", fuente: "Salmo 33, 3" },
  },
  {
    numeral: "III",
    eyebrow: "Cómo lo hacemos",
    titulo: "Una escuela y una familia",
    texto: [
      "Ensayamos cada semana en la Casa de la Iglesia y el Seminario Diocesano. Allí aprendemos técnica, lectura musical e historia, pero sobre todo aprendemos a escucharnos: un coro es, antes que nada, un ejercicio de humildad.",
      "Nadie llega sabiéndolo todo. Lo que pedimos es compromiso, puntualidad y ganas de servir. Lo demás llega ensayo a ensayo, entre amigos.",
    ],
    panel: { tono: "granate", frase: "Cada voz cuenta, ninguna se impone" },
  },
] as const;

export default function SobreNosotrosPage() {

  // Cifras sacadas de los propios datos de la web (las mismas que ven las demás páginas).
  const cifras = [
    { valor: componentesPrueba.length, etiqueta: "Componentes" },
    { valor: obrasPrueba.length, etiqueta: "Obras en repertorio" },
    { valor: eventosPrueba.filter((e) => e.tipo === "celebracion").length, etiqueta: "Celebraciones este curso" },
  ];

  return (
    <main>

      {/* ============= INTRODUCCIÓN + BLOQUES ALTERNOS ============= */}
      <section className="superficie-crema w-full py-12 md:py-16 overflow-hidden">
        <FondoNotas soloLaterales />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">El coro</span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
            Sobre nosotros
          </h1>

          <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-6">
            Quiénes somos y qué nos mueve
          </p>

          <div className="flex justify-center mb-16">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Bloques: el texto alterna izquierda/derecha y el panel ocupa el otro lado */}
          <div className="space-y-20 md:space-y-28">
            {BLOQUES.map((b, i) => {
              const textoDerecha = i % 2 === 1;
              return (
                <div key={b.numeral} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                  <Reveal desde={textoDerecha ? "derecha" : "izquierda"} className={textoDerecha ? "md:order-2" : ""}>
                    <span className="block text-[10px] tracking-[0.4em] uppercase text-red-800 font-medium mb-3">{b.eyebrow}</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-[1.1] mb-6">{b.titulo}</h2>
                    {b.texto.map((p, j) => (
                      <p
                        key={j}
                        className={`font-serif text-lg md:text-xl leading-relaxed text-stone-700 mb-5 ${
                          j === 0 ? "first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:text-red-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none" : ""
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                  </Reveal>

                  <Reveal desde={textoDerecha ? "izquierda" : "derecha"} delay={150} className={textoDerecha ? "md:order-1" : ""}>
                    <PanelNumeral numeral={b.numeral} {...b.panel} />
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============= LO QUE NOS MUEVE (tarjetas que se voltean) ============= */}
      <section className="superficie-clara w-full py-16 md:py-20 overflow-hidden">
        <FondoNotas soloLaterales />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <CabeceraSeccion eyebrow="Nuestros pilares" titulo="Lo que nos mueve" subtitulo="Pulsa cada tarjeta para descubrirla" />
          <PilaresGiratorios />
        </div>
      </section>

      {/* ============= MÁS ALLÁ DE LA MÚSICA (temas clicables) + GALERÍA ============= */}
      <section className="superficie-crema w-full py-16 md:py-20 overflow-hidden">
        <FondoNotas soloLaterales />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <CabeceraSeccion eyebrow="Conócenos" titulo="Más allá de la música" subtitulo="Pulsa cada tema para descubrirlo" />
          <Temas />

          <div className="flex flex-col items-center mt-16">
            <p className="font-serif italic text-lg text-stone-500 mb-5">Y si quieres vernos en acción…</p>
            <Link
              href="/sobre-nosotros/galeria"
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Images size={18} strokeWidth={1.5} />
                Ver la galería
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============= EN CIFRAS + INVITACIÓN (granate) ============= */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 pt-16 md:pt-20 pb-28">
        <div className="capa-grano" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_95%_at_50%_10%,transparent_40%,rgba(69,10,10,0.55)_100%)]" />
        <div className="respira absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
        <PentagramaOla conNotas duracion={48} className="bottom-4" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-16 bg-stone-50/50" />
            <span className="text-xs tracking-[0.4em] uppercase text-stone-50/90 font-medium">En cifras</span>
            <div className="h-px w-16 bg-stone-50/50" />
          </div>

          <Cifras cifras={cifras} />

          <div className="text-center mt-16">
            <p className="font-serif text-3xl md:text-4xl tracking-tight mb-3">¿Quieres servir cantando con nosotros?</p>
            <p className="font-serif italic text-lg text-stone-50/75 mb-8">Tu voz, tu instrumento, su gloria</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contacto?motivo=unirme"
                className="group relative overflow-hidden inline-flex items-center justify-center bg-stone-50 text-red-900 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-950/50 transition-all duration-300 rounded-sm"
              >
                <span className="relative z-10">Quiero unirme</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
              <Link
                href="/sobre-nosotros/componentes"
                className="inline-flex items-center justify-center border border-stone-50/50 text-stone-50 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-stone-50 hover:text-red-900 transition-all duration-300 rounded-sm"
              >
                Conoce a los componentes
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

// ============= SUBCOMPONENTES =============

function CabeceraSeccion({ eyebrow, titulo, subtitulo }: { eyebrow: string; titulo: string; subtitulo: string }) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-5">
        <div className="h-px w-16 bg-red-800/60" />
        <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">{eyebrow}</span>
        <div className="h-px w-16 bg-red-800/60" />
      </div>
      <h2 className="font-serif text-4xl md:text-6xl text-stone-900 tracking-tight leading-[1.1] mb-3">{titulo}</h2>
      <p className="font-serif italic text-lg md:text-xl text-stone-500">{subtitulo}</p>
    </div>
  );
}

// Panel decorativo junto a cada bloque: numeral romano grande y una frase.
function PanelNumeral({ numeral, tono, frase, fuente }: { numeral: string; tono: "granate" | "claro"; frase: string; fuente?: string }) {
  const granate = tono === "granate";
  return (
    <div
      className={`relative overflow-hidden aspect-[4/3] flex flex-col items-center justify-center text-center px-10 rounded-sm ${
        granate
          ? "bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 shadow-2xl shadow-red-950/30"
          : "bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 shadow-xl shadow-red-900/10"
      }`}
    >
      {granate && <div className="capa-grano" />}
      {/* Marco editorial de esquinas */}
      <div className={`absolute top-4 left-4 w-6 h-6 border-t border-l ${granate ? "border-stone-50/30" : "border-red-800/30"}`} />
      <div className={`absolute bottom-4 right-4 w-6 h-6 border-b border-r ${granate ? "border-stone-50/30" : "border-red-800/30"}`} />
      <div className={`absolute inset-6 border ${granate ? "border-stone-50/10" : "border-red-800/10"}`} />

      <span className={`relative font-serif text-8xl md:text-9xl leading-none mb-6 ${granate ? "text-stone-50/90" : "text-red-800/80"}`}>{numeral}</span>
      <svg width="60" height="14" viewBox="0 0 60 14" fill="none" className={`relative mb-5 ${granate ? "text-stone-50/50" : "text-red-800/50"}`} aria-hidden="true">
        <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="0.5" />
        <rect x="26" y="3" width="8" height="8" transform="rotate(45 30 7)" fill="currentColor" />
        <line x1="38" y1="7" x2="60" y2="7" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <p className={`relative font-serif italic text-xl md:text-2xl leading-snug max-w-xs ${granate ? "text-stone-50/90" : "text-red-900"}`}>{frase}</p>
      {fuente && <p className="relative mt-3 text-[10px] tracking-[0.3em] uppercase text-stone-400">{fuente}</p>}
    </div>
  );
}
