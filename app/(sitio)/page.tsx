import Hero from "../components/hero";
import About from "../components/about";
import Director from "../components/palabrasDirector";
import Reveal from "../components/Reveal";
import FondoNotas from "../components/FondoNotas";
import ProximaCelebracionInicio from "../components/inicio/ProximaCelebracionInicio";
import Descubre from "../components/inicio/Descubre";
import FormaParte from "../components/inicio/FormaParte";
import { eventosPrueba } from "@/lib/datosPrueba";

// Inicio: una puerta a toda la web. Hero → próxima celebración (cartel con la
// catedral y el pentagrama) → quiénes somos → palabras del director → forma
// parte (lleva a Contacto con la opción elegida) → descubre (tarjetas con fotos
// de las secciones), al final por decisión de Fernando.
export default function Home() {
  return (
    <main>
      <Hero />

      {/* ============= PRÓXIMA CELEBRACIÓN ============= */}
      <section className="superficie-clara w-full py-16 md:py-20 overflow-hidden">
        <FondoNotas soloLaterales />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <Reveal>
            <ProximaCelebracionInicio eventos={eventosPrueba} />
          </Reveal>
        </div>
      </section>

      <Reveal>
        <About />
      </Reveal>

      <Reveal>
        <Director />
      </Reveal>

      <FormaParte />

      {/* ============= DESCUBRE ============= */}
      <section className="superficie-clara w-full py-16 md:py-24 overflow-hidden">
        <FondoNotas soloLaterales />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">Descubre</span>
            <div className="h-px w-16 bg-red-800/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-stone-900 text-center tracking-tight leading-[1.1] mb-3">
            Conoce el coro por dentro
          </h2>
          <p className="font-serif italic text-lg md:text-xl text-stone-500 text-center mb-12">
            Quiénes somos, qué cantamos y dónde nos encontrarás
          </p>
          <Reveal>
            <Descubre />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
