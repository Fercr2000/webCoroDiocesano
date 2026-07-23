import Hero from "../components/hero";
import About from "../components/about";
import Director from "../components/palabrasDirector";
import Inscription from "../components/inscripcion";
import Integrantes from "../components/integrantes";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Director />
      <Inscription />
      <Integrantes />
    </main>
  );
}
