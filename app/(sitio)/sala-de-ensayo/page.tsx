import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PaginaSala from '@/app/components/sala/PaginaSala';
import CabeceraSala from '@/app/components/sala/CabeceraSala';
import Reveal from '@/app/components/Reveal';
import { IconoAfinador, IconoMetronomo, IconoPiano, IconoVoz } from '@/app/components/sala/IconosSala';
import { LA_POR_DEFECTO } from '@/lib/sala/notas';

export const metadata: Metadata = {
  title: 'Sala de ensayo',
  description: 'Herramientas para preparar tu voz y tu instrumento: piano, metrónomo, afinador y entrenamiento de afinación.',
};

const HERRAMIENTAS = [
  {
    href: '/sala-de-ensayo/afina-tu-voz', titulo: 'Afina tu voz', eyebrow: 'Para cantores', Icono: IconoVoz, destacada: true,
    texto: 'Elige tu cuerda y tu nivel. Suena una nota, se calla y la cantas: una aguja te dice si subir o bajar hasta que la clavas.',
  },
  {
    href: '/sala-de-ensayo/piano', titulo: 'Piano', eyebrow: 'Para estudiar', Icono: IconoPiano,
    texto: 'Tócalo con el ratón, con los dedos o con el teclado del ordenador. Te dice la nota, su frecuencia y el intervalo o acorde.',
  },
  {
    href: '/sala-de-ensayo/metronomo', titulo: 'Metrónomo', eyebrow: 'Para el pulso', Icono: IconoMetronomo,
    texto: 'Preciso, con compases simples y compuestos, subdivisiones y acentos. Sigue sonando mientras usas el piano.',
  },
  {
    href: '/sala-de-ensayo/afinador', titulo: 'Afinador', eyebrow: 'Para instrumentistas', Icono: IconoAfinador,
    texto: 'Afinador cromático con micrófono, cuerdas al aire de violín, viola, violonchelo y contrabajo, y transposición.',
  },
];

export default function SalaDeEnsayoPage() {
  return (
    <PaginaSala>
      <CabeceraSala titulo="Sala de ensayo" subtitulo="Herramientas para preparar tu voz y tu instrumento" volver={false} />

      <p className="max-w-2xl mx-auto text-center text-lg text-stone-600 leading-relaxed -mt-2 mb-12">
        Lo que usamos en los ensayos, al alcance de cualquiera: para estudiar en casa, afinar antes de empezar o trabajar la
        entonación. Funciona en el navegador, también en el móvil, sin instalar nada.
      </p>

      <div className="grid md:grid-cols-6 gap-5 lg:gap-6">
        {HERRAMIENTAS.map(({ href, titulo, eyebrow, texto, Icono, destacada }, i) => (
          <Reveal key={href} delay={i * 80} className="md:col-span-3">
            <Link
              href={href}
              className={`group relative h-full flex flex-col rounded-sm overflow-hidden p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${
                destacada
                  ? 'bg-gradient-to-br from-red-800 via-red-900 to-red-950 text-stone-50 shadow-xl shadow-red-950/20 hover:shadow-2xl hover:shadow-red-900/40'
                  : 'bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 shadow-sm shadow-stone-900/5 hover:shadow-xl hover:shadow-red-900/10 hover:border-red-800/30'
              }`}
            >
              {destacada ? (
                <>
                  <div className="capa-grano" />
                  <div className="absolute top-5 right-5 w-6 h-6 border-t border-r border-stone-50/30" />
                </>
              ) : (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />
                </>
              )}

              <div className={`relative z-10 ${destacada ? 'text-stone-50' : 'text-stone-800'}`}>
                <Icono />
              </div>
              <p className={`relative z-10 mt-6 text-[10px] tracking-[0.35em] uppercase font-medium ${destacada ? 'text-stone-200/80' : 'text-red-800'}`}>{eyebrow}</p>
              <h2 className={`relative z-10 font-serif text-3xl md:text-4xl tracking-tight mt-2 ${destacada ? 'text-stone-50' : 'text-stone-900'}`}>{titulo}</h2>
              <p className={`relative z-10 mt-3 leading-relaxed flex-1 ${destacada ? 'text-stone-100/85' : 'text-stone-600'}`}>{texto}</p>
              <span className={`relative z-10 mt-6 inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-medium ${destacada ? 'text-stone-50' : 'text-red-800'}`}>
                Abrir
                <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* La de referencia */}
      <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
        <p className="font-serif text-5xl text-red-800 leading-none tabular-nums">{LA_POR_DEFECTO}<span className="text-2xl text-stone-500 ml-1">Hz</span></p>
        <p className="max-w-md text-stone-600 leading-relaxed">
          Todas las herramientas comparten la misma <strong className="font-medium text-stone-800">La de referencia</strong>: {LA_POR_DEFECTO} Hz,
          la de nuestra orquesta. Puedes cambiarla en la barra de abajo (440, 415 para música barroca…).
        </p>
      </div>
    </PaginaSala>
  );
}
