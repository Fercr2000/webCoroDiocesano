// Bloque de administración del dashboard. Cada tarjeta pertenece a un rol de
// gestión (lib/gestion.ts) y solo se muestra a quien lo tiene; el Director,
// que los tiene todos, las ve todas.

import Link from 'next/link';
import { Users, Theater, BookOpen, FileMusic, ListMusic, CalendarDays, LayoutTemplate, ScrollText, Images, Phone, ArrowRight } from 'lucide-react';
import { ROLES_GESTION, type RolGestion } from '@/lib/gestion';

const secciones: { rol: RolGestion; href: string; icono: typeof Users; titulo: string; descripcion: string }[] = [
  {
    rol: 'portada',
    href: '/miembros/dashboard/admin/portada',
    icono: LayoutTemplate,
    titulo: 'Portada e inicio',
    descripcion: 'Imágenes y textos del hero, textos del inicio y palabras del Obispo.',
  },
  {
    rol: 'sobre-nosotros',
    href: '/miembros/dashboard/admin/sobre-nosotros',
    icono: ScrollText,
    titulo: 'Textos y responsables',
    descripcion: 'Textos de Sobre nosotros, responsables y sus cartas.',
  },
  {
    rol: 'sobre-nosotros',
    href: '/miembros/dashboard/admin/componentes',
    icono: Theater,
    titulo: 'Componentes',
    descripcion: 'Elige quién aparece en la formación de la página pública.',
  },
  {
    rol: 'galeria',
    href: '/miembros/dashboard/admin/galeria',
    icono: Images,
    titulo: 'Galería',
    descripcion: 'Crea álbumes y sube las fotos de cada celebración.',
  },
  {
    rol: 'agenda',
    href: '/miembros/dashboard/admin/calendario',
    icono: CalendarDays,
    titulo: 'Calendario',
    descripcion: 'Programa las celebraciones y convoca a cada sección.',
  },
  {
    rol: 'musica',
    href: '/miembros/dashboard/admin/catalogo',
    icono: BookOpen,
    titulo: 'Catálogo',
    descripcion: 'Mantén las obras que el público ve en «Repertorio».',
  },
  {
    rol: 'musica',
    href: '/miembros/dashboard/admin/repertorios',
    icono: ListMusic,
    titulo: 'Repertorios',
    descripcion: 'Organiza las obras por tiempos litúrgicos y celebraciones.',
  },
  {
    rol: 'musica',
    href: '/miembros/dashboard/admin/archivos',
    icono: FileMusic,
    titulo: 'Archivos',
    descripcion: 'Sube partituras y audios y asígnalos a cada cuerda.',
  },
  {
    rol: 'secretaria',
    href: '/miembros/dashboard/admin/usuarios',
    icono: Users,
    titulo: 'Usuarios',
    descripcion: 'Da de alta a los miembros, gestiona sus accesos y sus roles.',
  },
  {
    rol: 'secretaria',
    href: '/miembros/dashboard/admin/contacto',
    icono: Phone,
    titulo: 'Contacto',
    descripcion: 'Teléfonos, email y datos que aparecen en la web.',
  },
];

export default function AdminSection({ roles, esDirector }: { roles: RolGestion[]; esDirector: boolean }) {

  const visibles = secciones.filter((s) => roles.includes(s.rol));

  return (
    <section className="mb-20 md:mb-24">

      {/* CABECERA */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-red-800/60" />
        <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
          Administración
        </span>
        <div className="h-px w-16 bg-red-800/60" />
      </div>

      <h2 className="font-serif text-4xl md:text-5xl text-stone-900 text-center tracking-tight leading-[1.1] mb-4">
        {esDirector ? 'Tu coro, en orden' : 'Lo que gestionas'}
      </h2>

      <p className="font-serif italic text-lg text-stone-500 text-center mb-12">
        {esDirector
          ? 'Tienes todos los roles de gestión y decides quién gestiona cada parte'
          : `Tus roles: ${roles.map((r) => ROLES_GESTION[r].nombre).join(' · ')}`}
      </p>

      {/* TARJETAS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {visibles.map(({ rol, href, icono: Icono, titulo, descripcion }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col bg-gradient-to-b from-white to-stone-100 border border-stone-200/80 rounded-sm overflow-hidden shadow-sm shadow-stone-900/5 hover:shadow-xl hover:shadow-red-900/10 hover:border-red-800/30 hover:-translate-y-0.5 transition-all duration-300 p-6 pl-7"
          >
            {/* Banda lateral izquierda decorativa (granate vertical) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Esquina decorativa superior derecha (sutil) */}
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20 pointer-events-none" />

            <div className="w-11 h-11 mb-5 flex items-center justify-center rounded-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 shadow-md shadow-red-900/30">
              <Icono size={18} strokeWidth={1.5} />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase text-red-800/80 font-medium mb-2">
              {ROLES_GESTION[rol].nombre}
            </span>

            <h3 className="font-serif text-2xl text-stone-900 tracking-tight leading-tight mb-2">
              {titulo}
            </h3>

            <p className="text-sm text-stone-600 leading-relaxed mb-6 flex-1">
              {descripcion}
            </p>

            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-medium text-stone-500 group-hover:text-red-800 transition-colors">
              Gestionar
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        ))}
      </div>

      {/* Separador hacia el archivo personal */}
      <div className="flex items-center gap-4 mt-20 md:mt-24">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-300" />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-800/50">
          <rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" fill="currentColor" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-300" />
      </div>

    </section>
  );
}
