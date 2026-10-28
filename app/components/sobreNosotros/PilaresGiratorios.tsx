'use client';

// "Lo que nos mueve": cuatro pilares en tarjetas que se voltean al pulsarlas
// (o con Enter/Espacio). Anverso claro con icono y palabra; reverso granate
// con la explicación. Con "reducir movimiento" el giro es instantáneo.

import { useState } from 'react';
import { Church, Sparkles, GraduationCap, HeartHandshake, RotateCw } from 'lucide-react';

const PILARES = [
  {
    icono: Church,
    palabra: 'Liturgia',
    lema: 'Cantamos para rezar',
    texto: 'Nuestra música nace del altar y vuelve a él. Elegimos cada obra pensando en el tiempo litúrgico y en la asamblea que celebra, no en el lucimiento del coro.',
  },
  {
    icono: Sparkles,
    palabra: 'Belleza',
    lema: 'Lo mejor, para Dios',
    texto: 'Cuidamos cada detalle: afinación, empaste, silencio. Creemos que la belleza es un camino hacia Dios y que la Iglesia merece la mejor música que podamos ofrecer.',
  },
  {
    icono: GraduationCap,
    palabra: 'Formación',
    lema: 'Siempre aprendiendo',
    texto: 'Lectura musical, técnica vocal e instrumental, historia de la música sacra. Nadie llega sabiéndolo todo: crecemos juntos ensayo a ensayo.',
  },
  {
    icono: HeartHandshake,
    palabra: 'Comunidad',
    lema: 'Una gran familia',
    texto: 'Antes que un coro somos personas que comparten fe y amistad. Los ensayos son también un lugar de encuentro, y cada voz nueva es bienvenida.',
  },
];

export default function PilaresGiratorios() {

  const [volteadas, setVolteadas] = useState<boolean[]>(PILARES.map(() => false));
  const voltear = (i: number) => setVolteadas((v) => v.map((x, j) => (j === i ? !x : x)));

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {PILARES.map(({ icono: Icono, palabra, lema, texto }, i) => (
        <button
          key={palabra}
          type="button"
          onClick={() => voltear(i)}
          aria-pressed={volteadas[i]}
          aria-label={`${palabra}: ${volteadas[i] ? texto : 'pulsa para descubrir'}`}
          className="group h-80 [perspective:1200px] text-left rounded-sm"
        >
          <div
            className={`relative h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none [transform-style:preserve-3d] ${
              volteadas[i] ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(8deg)]'
            }`}
          >
            {/* ANVERSO */}
            <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm shadow-md shadow-stone-900/5 group-hover:shadow-xl group-hover:shadow-red-900/10 group-hover:border-red-800/30 transition-shadow px-6">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />

              <span className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-lg shadow-red-900/30">
                <Icono size={26} strokeWidth={1.5} />
              </span>
              <span className="font-serif text-3xl text-stone-900 tracking-tight mb-2">{palabra}</span>
              <span className="font-serif italic text-stone-500">{lema}</span>
              <span className="absolute bottom-5 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-stone-400 group-hover:text-red-800 transition-colors">
                <RotateCw size={12} strokeWidth={1.5} />
                Descubrir
              </span>
            </div>

            {/* REVERSO */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col justify-center bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 rounded-sm shadow-xl shadow-red-950/30 px-7">
              <div className="capa-grano" />
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-stone-50/30" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-stone-50/30" />
              <div className="relative z-10">
                <span className="block text-[10px] tracking-[0.4em] uppercase text-stone-50/70 mb-3">{palabra}</span>
                <p className="font-serif text-lg leading-relaxed text-stone-50/90 first-letter:text-4xl first-letter:font-medium first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none">
                  {texto}
                </p>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
