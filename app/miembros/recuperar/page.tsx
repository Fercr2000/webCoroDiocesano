'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function RecuperarPage() {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (

    <div className="min-h-screen w-full md:grid md:grid-cols-2">

      {/* COLUMNA IZQUIERDA */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950">

        <div className="absolute top-[15%] left-[40%] w-72 h-72 rounded-full bg-red-600/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-red-950/60 blur-3xl pointer-events-none" />

        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-[30%] left-0 right-0 h-px bg-stone-50" />
          <div className="absolute top-[35%] left-0 right-0 h-px bg-stone-50" />
          <div className="absolute top-[40%] left-0 right-0 h-px bg-stone-50" />
          <div className="absolute top-[45%] left-0 right-0 h-px bg-stone-50" />
          <div className="absolute top-[50%] left-0 right-0 h-px bg-stone-50" />
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-red-950 via-red-700 to-red-950 z-10" />

        <div className="relative z-10 w-full h-full p-12 lg:p-16 flex flex-col">

          <div className="flex items-center gap-4 mb-auto">
            <div className="h-px w-16 bg-stone-50/60" />
            <span className="text-xs tracking-[0.4em] uppercase text-stone-50 font-medium">
              Recuperar acceso
            </span>
          </div>

          <div className="flex-1 flex items-center">

            <div className="relative w-full max-w-2xl">

              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rotate-45 bg-stone-50/80" />
                <div className="h-px w-24 bg-stone-50/40" />
              </div>

              <h2 className="font-serif text-5xl lg:text-6xl text-stone-50 leading-[1.1] mb-3">
                Te ayudamos
              </h2>
              <h2 className="font-serif italic text-5xl lg:text-6xl text-stone-50/90 leading-[1.1] mb-10 pl-12 lg:pl-20">
                a volver.
              </h2>

              <div className="flex items-center gap-4 mb-8 pl-12 lg:pl-20">
                <div className="h-px w-16 bg-stone-50/30" />
                <div className="w-1 h-1 rounded-full bg-stone-50/50" />
                <div className="h-px w-32 bg-stone-50/30" />
              </div>

              <p className="font-serif italic text-lg lg:text-xl text-stone-200/85 max-w-md leading-relaxed pl-12 lg:pl-20">
                Introduce tu email y te enviaremos las instrucciones para restablecer tu contraseña.
              </p>

            </div>

          </div>

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

      {/* COLUMNA DERECHA */}
      <div className="relative flex items-center justify-center bg-gradient-to-b from-stone-50 via-amber-50 to-stone-100 px-6 py-12 md:py-0 min-h-screen overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/40 to-transparent pointer-events-none" />

        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-950 via-red-700 to-red-950" />

        <div className="relative z-10 w-full max-w-md">

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
              Recuperar
            </span>
            <div className="h-px flex-1 bg-red-800/60" />
          </div>

          {!sent ? (
            <>
              <h1 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-[1.1] mb-3">
                Restablecer contraseña
              </h1>

              <p className="font-serif italic text-lg text-stone-600 mb-10">
                Te enviaremos un enlace a tu correo
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="block mb-2">
                    <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">
                      Email asociado a tu cuenta
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

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden w-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                  </span>
                  {!loading && (
                    <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>

              </form>
            </>
          ) : (
            <div className="text-center py-8">

              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-600/30 flex items-center justify-center">
                  <CheckCircle size={40} strokeWidth={1.5} className="text-green-700" />
                </div>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight leading-[1.1] mb-4">
                Email enviado
              </h1>

              <p className="font-serif italic text-lg text-stone-600 mb-8 leading-relaxed">
                Si existe una cuenta asociada a <span className="text-stone-900 not-italic">{email}</span>,
                recibirás un correo con las instrucciones en los próximos minutos.
              </p>

              <p className="text-sm text-stone-500 mb-10 leading-relaxed">
                Revisa también tu carpeta de spam o correo no deseado.
              </p>

              <Link
                href="/miembros"
                className="inline-block text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 transition-colors border border-stone-300 hover:border-red-800 px-6 py-3 rounded-sm"
              >
                Volver al acceso
              </Link>

            </div>
          )}

          {!sent && (
            <div className="mt-12 pt-8 border-t border-stone-200 text-center">
              <Link
                href="/miembros"
                className="text-sm text-stone-600 hover:text-red-800 transition-colors"
              >
                ← Volver al acceso
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
