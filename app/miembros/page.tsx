'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import FondoGranateMiembros from '../components/FondoGranateMiembros';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ── Atajo de DEMO (mockup) ──────────────────────────────────────────
    // Con admin / admin en email y contraseña se abre el área de miembros,
    // para poder enseñar la funcionalidad sin Supabase conectado.
    // (Se eliminará cuando se conecte la autenticación real.)
    if (email.trim().toLowerCase() === 'admin' && password === 'admin') {
      router.push('/miembros/dashboard');
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setError('La autenticación se activará al conectar Supabase.');
    }, 1000);
  };

  return (

    <div className="min-h-screen w-full md:grid md:grid-cols-2">

      {/* ============= COLUMNA IZQUIERDA: SOLO TEXTO Y ARTE =============
          Fondo granate sobrio, mismo que el botón "Acceder". */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-red-950">

        {/* Fondo decorativo compartido (grano, viñeta, focos, pauta, marco, separador) */}
        <FondoGranateMiembros />

        {/* CONTENIDO */}
        <div className="relative z-10 w-full h-full p-12 lg:p-16 flex flex-col">

          {/* Eyebrow arriba */}
          <div className="flex items-center gap-4 mb-auto">
            <div className="h-px w-16 bg-stone-50/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-stone-50 font-medium">
              Área de miembros
            </span>
          </div>

          {/* BLOQUE CENTRAL: solo texto, sin logo */}
          <div className="flex-1 flex items-center">

            <div className="relative w-full max-w-2xl">

              {/* Línea decorativa con rombito antes del titular */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rotate-45 bg-stone-50/80" />
                <div className="h-px w-24 bg-stone-50/40" />
              </div>

              {/* Titular en cascada */}
              <h2 className="font-serif text-5xl lg:text-6xl text-stone-50 leading-[1.1] mb-3">
                Tu atril,
              </h2>
              <h2 className="font-serif text-5xl lg:text-6xl text-stone-50 leading-[1.1] mb-3 pl-12 lg:pl-20">
                tu archivo,
              </h2>
              <h2 className="font-serif italic text-5xl lg:text-6xl text-stone-50/90 leading-[1.1] mb-10 pl-24 lg:pl-40">
                tu música.
              </h2>

              {/* Línea separadora con un punto decorativo */}
              <div className="flex items-center gap-4 mb-8 pl-12 lg:pl-20">
                <div className="h-px w-16 bg-stone-50/30" />
                <div className="w-1 h-1 rounded-full bg-stone-50/50" />
                <div className="h-px w-32 bg-stone-50/30" />
              </div>

              {/* Subtítulo */}
              <p className="font-serif italic text-lg lg:text-xl text-stone-200/85 max-w-md leading-relaxed pl-12 lg:pl-20">
                Accede a las partituras de tu cuerda, materiales de ensayo y calendario interno.
              </p>

            </div>

          </div>

          {/* BLOQUE INFERIOR */}
          <div className="flex items-end justify-between gap-4 mt-auto">

            <blockquote className="font-serif italic text-sm text-stone-200/50 max-w-xs">
              «Cantadle un cántico nuevo, tocad con maestría.»
              <cite className="block not-italic text-[10px] tracking-[0.3em] uppercase text-stone-200/40 mt-2">
                Salmo 33, 3
              </cite>
            </blockquote>

            <svg width="80" height="14" viewBox="0 0 80 14" fill="none" className="text-stone-50/30 flex-shrink-0">
              <line x1="0" y1="7" x2="32" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="36" y="3" width="8" height="8" transform="rotate(45 40 7)" fill="currentColor" />
              <line x1="48" y1="7" x2="80" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>

          </div>

        </div>

      </div>

      {/* ============= COLUMNA DERECHA: FORMULARIO ============= */}
      <div className="superficie-crema flex items-center justify-center px-6 py-12 md:py-0 min-h-screen overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent pointer-events-none" />

        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

        <div className="relative z-10 w-full max-w-md">

          {/* Logo (solo en móvil) */}
          <div className="md:hidden flex justify-center mb-10">
            <div className="relative h-16 w-64">
              <Image
                src="/LogoCoroDiocesano.png"
                alt="Logo Coro de la Diócesis de Jaén"
                fill
                sizes="256px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-red-800/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
              Acceso
            </span>
            <div className="h-px flex-1 bg-red-800/60" />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-[1.1] mb-3">
            Bienvenido
          </h1>

          <p className="font-serif italic text-lg text-stone-600 mb-10">
            Accede al área de miembros
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            <div>
              <label className="block mb-2">
                <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">
                  Email
                </span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-white/70 border border-stone-300 rounded-sm py-3 pl-12 pr-4 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">
                  Contraseña
                </span>
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/70 border border-stone-300 rounded-sm py-3 pl-12 pr-12 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-800 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.5} />
                  ) : (
                    <Eye size={18} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/miembros/recuperar"
                className="text-xs tracking-wider text-stone-600 hover:text-red-800 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-sm">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden w-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? 'Accediendo...' : 'Acceder'}
              </span>
              {!loading && (
                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

          </form>

          <div className="mt-12 pt-8 border-t border-stone-300/70">
            <p className="text-sm text-stone-600 leading-relaxed text-center">
              El acceso al área de miembros está reservado a integrantes del coro.
              <br />
              <span className="text-stone-500 italic">
                Las cuentas son creadas por el administrador.
              </span>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 border border-stone-300 hover:border-red-800 hover:bg-red-50/40 px-6 py-3 rounded-sm transition-all duration-300"
            >
              <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
              Volver al inicio
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
