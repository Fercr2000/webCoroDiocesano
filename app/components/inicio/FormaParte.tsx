// Inicio: cierre granate "Forma parte" con dos caminos que llevan a Contacto
// con la opción ya elegida (unirse al coro o contar con él). Abajo, el
// pentagrama con notas de la casa.

import Link from 'next/link';
import { UserPlus, CalendarHeart } from 'lucide-react';
import PentagramaOla from '../PentagramaOla';

export default function FormaParte() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 pt-16 md:pt-20 pb-32">
      <div className="capa-grano" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_95%_at_50%_10%,transparent_40%,rgba(69,10,10,0.55)_100%)]" />
      <div className="respira absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
      <PentagramaOla conNotas duracion={48} className="bottom-4" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-stone-50/50" />
          <span className="text-xs tracking-[0.4em] uppercase text-stone-50/90 font-medium">Forma parte</span>
          <div className="h-px w-16 bg-stone-50/50" />
        </div>

        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.1] mb-4">
          Tu voz, tu instrumento, su gloria
        </h2>
        <p className="font-serif italic text-lg md:text-xl text-stone-50/75 mb-10">
          Únete al coro o cuenta con nosotros en tu celebración
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contacto?motivo=unirme"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-stone-50 text-red-900 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-950/50 transition-all duration-300 rounded-sm"
          >
            <span className="relative z-10 flex items-center gap-3">
              <UserPlus size={18} strokeWidth={1.5} />
              Quiero unirme
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          <Link
            href="/contacto?motivo=contar"
            className="inline-flex items-center justify-center gap-3 border border-stone-50/50 text-stone-50 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-stone-50 hover:text-red-900 transition-all duration-300 rounded-sm"
          >
            <CalendarHeart size={18} strokeWidth={1.5} />
            Contar con vosotros
          </Link>
        </div>
      </div>
    </section>
  );
}
