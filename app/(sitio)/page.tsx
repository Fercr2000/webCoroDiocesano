import Hero from "../components/hero";
import About from "../components/about";
import Director from "../components/palabrasDirector";
import Inscription from "../components/inscripcion";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Director />
      <Inscription />
    </main>
  );
}
