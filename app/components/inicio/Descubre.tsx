// Inicio: "Descubre", cuatro puertas a las secciones de la web (componentes,
// repertorio, galería y calendario). Tarjetas con imagen que se acerca al
// pasar el ratón; las imágenes son recortes de las de la casa hasta tener fotos.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FotoRecortada from '../galeria/FotoRecortada';
import type { Foto } from '@/lib/galeria';

const PUERTAS: { href: string; eyebrow: string; titulo: string; texto: string; foto: Foto }[] = [
  {
    href: '/sobre-nosotros/componentes',
    eyebrow: 'La formación',
    titulo: 'Componentes',
    texto: 'Cada voz y cada instrumento, en su sitio del escenario.',
    foto: { id: 'puerta-componentes', src: '/sliderUnete.jpg', pie: 'El coro en la sillería', proporcion: 'horizontal', encuadre: '12% 45%', zoom: 2 },
  },
  {
    href: '/sobre-nosotros/repertorio',
    eyebrow: 'Nuestra música',
    titulo: 'Repertorio',
    texto: 'Del gregoriano a nuestros días: las obras que tenemos montadas.',
    foto: { id: 'puerta-repertorio', src: '/repertorioCatSlider.jpg', pie: 'La cúpula de la Catedral', proporcion: 'horizontal', encuadre: '55% 25%', zoom: 1.5 },
  },
  {
    href: '/sobre-nosotros/galeria',
    eyebrow: 'En imágenes',
    titulo: 'Galería',
    texto: 'Celebraciones, conciertos, ensayos y convivencias.',
    foto: { id: 'puerta-galeria', src: '/sliderRepertorio.jpg', pie: 'La fachada de la Catedral', proporcion: 'horizontal', encuadre: '50% 60%', zoom: 1.2 },
  },
  {
    href: '/calendario',
    eyebrow: 'Agenda',
    titulo: 'Calendario',
    texto: 'Dónde y cuándo servimos cantando.',
    foto: { id: 'puerta-calendario', src: '/sliderUnete.jpg', pie: 'El director al frente', proporcion: 'horizontal', encuadre: '50% 72%', zoom: 2.2 },
  },
];

export default function Descubre() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {PUERTAS.map(({ href, eyebrow, titulo, texto, foto }) => (
        <Link
          key={href}
          href={href}
          className="group relative flex flex-col overflow-hidden rounded-sm bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 shadow-sm shadow-stone-900/5 hover:shadow-xl hover:shadow-red-900/15 hover:border-red-800/30 hover:-translate-y-1 transition-all duration-300"
        >
          {/* Imagen con velo granate que se aclara al pasar el ratón */}
          <div className="relative">
            <FotoRecortada foto={foto} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" claseImagen="transition-transform duration-700 ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 via-red-950/10 to-transparent group-hover:from-red-950/30 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-800 to-red-950" />
          </div>

          <div className="relative flex-1 flex flex-col p-6">
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-red-800 font-medium mb-2">{eyebrow}</span>
            <h3 className="font-serif text-2xl text-stone-900 tracking-tight leading-tight mb-2 group-hover:text-red-900 transition-colors">{titulo}</h3>
            <p className="font-serif italic text-stone-600 leading-relaxed mb-5 flex-1">{texto}</p>
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium text-stone-500 group-hover:text-red-800 transition-colors">
              Descubrir
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
