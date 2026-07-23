import Hero from "../components/hero";
import About from "../components/about";
import Director from "../components/palabrasDirector";
import Inscription from "../components/inscripcion";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <main>
      <Hero />
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Director />
      </Reveal>
      <Reveal>
        <Inscription />
      </Reveal>
    </main>
  );
}
